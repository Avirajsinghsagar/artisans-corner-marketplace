const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const aiRoutes = require("./routes/aiRoutes"); // ✅ AI ROUTES

const { protect } = require("./middleware/authMiddleware");
const { getSellerStats } = require("./controllers/sellerController");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// ✅ ALL ROUTES
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/ai", aiRoutes); // ✅ AI ROUTES

// seller stats
app.get("/api/seller/stats", protect, getSellerStats);

// test route
app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "Protected route accessed", user: req.user });
});

app.get("/", (req, res) => {
  res.send("Server is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});