import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Initialize integrations
await connectDB();
await connectCloudinary();

// Health check
app.get("/", (req, res) => res.send("API is running"));

// API routes
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

/**
 * Legacy Stripe endpoint used by `frontend/src/components/PaymentForm.jsx`.
 * Prefer the newer `/api/user/payment-stripe` flow (see `controllers/userController.js`).
 */
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || Number.isNaN(Number(amount))) {
      return res.status(400).json({ error: "amount is required" });
    }

    const stripeSecret = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET;
    if (!stripeSecret) {
      return res.status(500).json({ error: "STRIPE_SECRET_KEY is not set" });
    }

    const currency = (process.env.CURRENCY || "INR").toLowerCase();
    const stripe = new Stripe(stripeSecret);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount),
      currency,
      payment_method_types: ["card"],
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
