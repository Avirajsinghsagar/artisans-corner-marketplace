const express = require("express");
const router = express.Router();

const Order = require("../models/order");
const Cart = require("../models/cart");
const { protect, admin } = require("../middleware/authMiddleware");

/* =========================
   PLACE ORDER FROM CART
========================= */
router.post("/", protect, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    // ✅ validation
    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address required" });
    }

    // ✅ get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // ✅ build order items (VERY IMPORTANT for reviews)
    const orderItems = cart.items.map((item) => ({
      product: item.product._id, // ⭐ MUST be ObjectId
      name: item.product.title || item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image || "",
    }));

    // ✅ calculate prices
    const itemsPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const shippingPrice = itemsPrice > 500 ? 0 : 50;
    const taxPrice = Number((0.18 * itemsPrice).toFixed(2));
    const totalPrice = Number(
      (itemsPrice + shippingPrice + taxPrice).toFixed(2)
    );

    // ✅ create order
    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,

      // ⭐ IMPORTANT FOR REVIEW FLOW
      isPaid: paymentMethod === "COD" ? true : false,
      paidAt: paymentMethod === "COD" ? new Date() : null,
    });

    // ✅ clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({ message: "Server error while placing order" });
  }
});

/* =========================
   GET MY ORDERS
========================= */
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching orders" });
  }
});

/* =========================
   GET SINGLE ORDER
========================= */
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ security check
    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching order" });
  }
});

/* =========================
   ADMIN — GET ALL ORDERS
========================= */
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ message: "Server error fetching orders" });
  }
});

/* =========================
   ADMIN — MARK ORDER PAID
========================= */
router.put("/:id/pay", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.isPaid) {
      return res.status(400).json({
        message: "Order already paid",
      });
    }

    order.isPaid = true;
    order.paidAt = new Date();

    await order.save();

    res.json({
      message: "Order marked as paid",
      order,
    });
  } catch (error) {
    console.error("Mark paid error:", error);
    res.status(500).json({ message: "Server error updating payment" });
  }
});

/* =========================
   ADMIN — MARK ORDER DELIVERED
========================= */
router.put("/:id/deliver", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.isPaid) {
      return res.status(400).json({
        message: "Order not paid yet",
      });
    }

    if (order.isDelivered) {
      return res.status(400).json({
        message: "Order already delivered",
      });
    }

    order.isDelivered = true;
    order.deliveredAt = new Date();

    await order.save();

    res.json({
      message: "Order marked as delivered",
      order,
    });
  } catch (error) {
    console.error("Deliver order error:", error);
    res.status(500).json({ message: "Server error updating delivery" });
  }
});

module.exports = router;