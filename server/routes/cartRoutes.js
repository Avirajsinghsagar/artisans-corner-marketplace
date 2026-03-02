console.log("🔥 cartRoutes file LOADED");
const express = require("express");
const router = express.Router();

const Cart = require("../models/cart");
const Product = require("../models/product");
const { protect } = require("../middleware/authMiddleware");

/* =========================
   ADD TO CART (SMART)
========================= */
router.post("/", protect, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // ✅ check product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ find user's cart
    let cart = await Cart.findOne({ user: req.user._id });

    // ✅ create cart if not exists
    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    // ✅ check if item already exists
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    await cart.save();

    res.status(200).json({
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Server error adding to cart" });
  }
});

/* =========================
   GET MY CART
========================= */
router.get("/", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart) {
      return res.json({ items: [] });
    }

    res.json(cart);
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Server error fetching cart" });
  }
});
// ✅ UPDATE CART ITEM
router.put("/update", protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (i) => i.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    // ✅ ONLY update quantity
    item.quantity = quantity;

    await cart.save();

    res.json({
      message: "Cart updated",
      cart,
    });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ message: "Server error updating cart" });
  }
});

// ✅ REMOVE SINGLE ITEM FROM CART
router.delete("/remove/:productId", protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // 🔥 remove ONLY the selected product
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    res.json({
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    console.error("Remove cart item error:", error);
    res.status(500).json({ message: "Server error removing item" });
  }
});

router.delete("/clear", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ message: "Server error clearing cart" });
  }
});

module.exports = router;