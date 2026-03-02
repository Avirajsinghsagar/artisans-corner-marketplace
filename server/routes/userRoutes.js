const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/user");
const { getSellerStats } = require("../controllers/sellerController");

const router = express.Router();

/* =========================
   REGISTER ROUTE
========================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ ensure default role
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "buyer",
    });

    res.status(201).json({
      message: "User Registered Successfully",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   LOGIN ROUTE
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // ✅ ensure role fallback
    const role = user.role || "buyer";

    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ IMPORTANT: send role to frontend
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role, // ← guaranteed present
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   BECOME SELLER
========================= */
router.put("/become-seller", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "seller") {
      return res.status(400).json({
        message: "Already a seller",
      });
    }

    user.role = "seller";
    await user.save();

    res.json({
      message: "You are now a seller",
      role: user.role,
    });
  } catch (error) {
    console.error("Become seller error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   SELLER STATS
========================= */
router.get("/seller/stats", protect, getSellerStats);

/* =========================
   EXPORT
========================= */
module.exports = router;