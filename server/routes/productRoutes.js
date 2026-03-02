const express = require("express");
const router = express.Router();

const Product = require("../models/product");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");

/* =========================================
   CREATE PRODUCT (SELLER)
========================================= */
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const { title, description, price } = req.body;

    // validation
    if (!title || !description || !price) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // upload to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "artisans",
    });

    // create product
    const product = new Product({
      title,
      description,
      price,
      image: result.secure_url,
      seller: req.user._id, // 🔥 VERY IMPORTANT
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error.message);
    res.status(500).json({ message: "Server error creating product" });
  }
});

/* =========================================
   GET ALL PRODUCTS (PUBLIC)
========================================= */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching products" });
  }
});

/* =========================================
   GET SINGLE PRODUCT
========================================= */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching product" });
  }
});

/* =========================================
   DELETE PRODUCT (SELLER ONLY)
========================================= */
router.delete("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 🔥 only owner or admin
    if (
      product.seller.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await product.deleteOne();

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting product" });
  }
});

/* =========================================
   ⭐ GET MY PRODUCTS (SELLER DASHBOARD)
========================================= */
router.get("/my-products", protect, async (req, res) => {
  try {
    const products = await Product.find({
      seller: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error("Get seller products error:", error);
    res.status(500).json({ message: "Server error fetching seller products" });
  }
});

module.exports = router;