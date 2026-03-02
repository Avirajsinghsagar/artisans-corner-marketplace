const Product = require("../models/product");
const Order = require("../models/order");

// ✅ Seller dashboard stats
exports.getSellerStats = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // total products of seller
    const totalProducts = await Product.countDocuments({
      seller: sellerId,
    });

    // orders containing seller products
    const orders = await Order.find({
      "orderItems.seller": sellerId,
    });

    const totalOrders = orders.length;

    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );

    res.json({
      totalProducts,
      totalOrders,
      totalRevenue,
    });
  } catch (err) {
    console.error("Seller stats error:", err);
    res.status(500).json({ message: "Failed to fetch seller stats" });
  }
};