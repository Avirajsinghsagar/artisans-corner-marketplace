const express = require("express");
const router = express.Router();
const Review = require("../models/review");
const Order = require("../models/order");
const { protect } = require("../middleware/authMiddleware");

/* =========================
   ADD REVIEW (verified buyer)
========================= */
router.post("/:productId", protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment required" });
    }

    const hasPurchased = await Order.findOne({
      user: req.user._id,
      isPaid: true, // ⭐ IMPORTANT FIX
      orderItems: {
        $elemMatch: { product: productId },
      },
    });

    if (!hasPurchased) {
      return res.status(403).json({
        message: "You can review only purchased products",
      });
    }

    // ✅ prevent duplicate review
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        message: "You already reviewed this product",
      });
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({ message: "Server error adding review" });
  }
});

/* =========================
   GET PRODUCT REVIEWS
========================= */
router.get("/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ message: "Server error fetching reviews" });
  }
});

module.exports = router;