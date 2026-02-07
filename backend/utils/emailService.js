import nodemailer from "nodemailer";

/**
 * Creates a nodemailer transporter.
 * Uses Gmail SMTP if credentials are set, otherwise Ethereal (free test account) for dev.
 */
const createTransporter = async () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (SMTP_USER && SMTP_PASS) {
    const config = {
      host: SMTP_HOST || "smtp.gmail.com",
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    }
    return nodemailer.createTransport(config);
  }

  // Ethereal: free test account (no signup, auto-created for dev)
  const testAccount = await nodemailer.createTestAccount();
  console.log("OTP emails use Ethereal (dev). Add SMTP_USER/SMTP_PASS to .env for Gmail.");
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

/**
 * Sends an OTP email to the given address.
 * @param {string} to - Recipient email
 * @param {string} otp - 6-digit OTP
 * @returns {Promise<{ success: boolean, previewUrl?: string }>}
 */
export const sendOtpEmail = async (to, otp) => {
  const transporter = await createTransporter();
  const isEthereal = !process.env.SMTP_USER;

  // Gmail requires "from" to match the authenticated user (SMTP_USER)
  const fromAddress = process.env.SMTP_USER
    ? `"Doctor Appointment" <${process.env.SMTP_USER}>`
    : process.env.SMTP_FROM || '"Doctor Appointment" <noreply@example.com>';

  const info = await transporter.sendMail({
    from: fromAddress,
    to,
    subject: "Your Login OTP - Doctor Appointment",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto;">
        <h2 style="color: #333;">Your One-Time Password</h2>
        <p>Use the following code to sign in:</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #2563eb;">${otp}</p>
        <p style="color: #666; font-size: 12px;">This code expires in 5 minutes. Do not share it with anyone.</p>
      </div>
    `,
  });

  // DEVELOPMENT ONLY: Log OTP to console for easy access
  console.log(`\n=== DEV OTP: ${otp} ===\n`);

  if (isEthereal) {
    console.log("Ethereal preview URL:", nodemailer.getTestMessageUrl(info));
  }

  return { success: true, previewUrl: isEthereal ? nodemailer.getTestMessageUrl(info) : null };
};
