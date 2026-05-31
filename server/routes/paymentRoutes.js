const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const { protect } = require("../middleware/authMiddleware");

// ✅ Create Payment Intent
router.post("/create-payment-intent", protect, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // already in paise from frontend
      currency: "inr",
    });

    res.json({ clientSecret: paymentIntent.client_secret });

  } catch (error) {
    console.error("Payment intent error:", error);
    res.status(500).json({ message: "Payment initialization failed" });
  }
});

module.exports = router; // ✅ THIS is what was missing