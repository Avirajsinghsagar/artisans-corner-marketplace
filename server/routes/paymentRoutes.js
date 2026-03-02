const express = require("express");
const router = express.Router();

// ✅ VERY IMPORTANT — load stripe AFTER dotenv
const Stripe = require("stripe");

// 🔥 DEBUG (remove later)
console.log("STRIPE KEY:", process.env.STRIPE_SECRET_KEY);

// ✅ initialize stripe safely
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ===============================
// CREATE PAYMENT INTENT
// ===============================
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        message: "Amount is required",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // ₹ → paise
      currency: "inr",
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe error:", error.message);
    res.status(500).json({
      message: "Payment intent creation failed",
    });
  }
});

module.exports = router;