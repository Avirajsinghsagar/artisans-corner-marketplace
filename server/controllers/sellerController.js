const Product = require("../models/product");
const Order = require("../models/order");

exports.getSellerStats = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // ✅ total products by this seller
    const totalProducts = await Product.countDocuments({
      seller: sellerId,
    });

    // ✅ find all products by this seller first
    const sellerProducts = await Product.find(
      { seller: sellerId },
      "_id"
    );
    const sellerProductIds = sellerProducts.map((p) => p._id.toString());

    // ✅ find orders that contain seller's products
    const orders = await Order.find({
      "orderItems.product": { $in: sellerProductIds },
    });

    const totalOrders = orders.length;

    // ✅ FIXED: use totalPrice not totalAmount
    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.totalPrice || 0),
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