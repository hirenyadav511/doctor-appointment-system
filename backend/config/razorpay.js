import Razorpay from "razorpay";

const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

// Allow the server to boot even if Razorpay isn't configured (payments will fail with a clear error).
const razorpayInstance =
  RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET
    ? new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET })
    : {
        orders: {
          create() {
            throw new Error("Razorpay is not configured (RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET missing)");
          },
          fetch() {
            throw new Error("Razorpay is not configured (RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET missing)");
          },
        },
      };

export default razorpayInstance;


