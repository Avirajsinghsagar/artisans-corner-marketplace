const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getSingleProduct,
  deleteProduct,
  getMyProducts,
} = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");
const Product = require("../models/product");

/*=========================================
   CREATE PRODUCT
=========================================*/
router.post("/", protect, upload.single("image"), createProduct);

/*=========================================
   GET MY PRODUCTS
=========================================*/
router.get("/my-products", protect, getMyProducts);

/*=========================================
   GET ALL PRODUCTS
=========================================*/
router.get("/", getProducts);

/*=========================================
   GET SINGLE PRODUCT
=========================================*/
router.get("/:id", getSingleProduct);

/*=========================================
   UPDATE PRODUCT ✅ FIXED
=========================================*/
router.put("/:id", protect, upload.single("image"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ only seller who owns it can edit
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this product" });
    }

    const { title, description, price, category } = req.body;

    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = Number(price);
    if (category) product.category = category;

    // ✅ upload new image to Cloudinary only if new file provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "artisans-products",
      });
      product.image = result.secure_url;
    }

    await product.save();
    res.json(product);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Server error updating product" });
  }
});

/*=========================================
   DELETE PRODUCT
=========================================*/
router.delete("/:id", protect, deleteProduct);

module.exports = router;