const Product = require("../models/product");

const cloudinary = require("../config/cloudinary");

/* =========================================
   CREATE PRODUCT
========================================= */
const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
    } = req.body;

    // VALIDATION
    if (
      !title ||
      !description ||
      !price ||
      !category
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // IMAGE REQUIRED
    if (!req.file) {
      return res.status(400).json({
        message: "Product image is required",
      });
    }

    // UPLOAD TO CLOUDINARY
    const result =
      await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "artisans-products",
        }
      );

    // CREATE PRODUCT
    const product = new Product({
      title,
      description,
      price,
      category,
      image: result.secure_url,
      seller: req.user._id,
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error(
      "Create product error:",
      error
    );

    res.status(500).json({
      message: "Server error creating product",
    });
  }
};

/* =========================================
   GET ALL PRODUCTS
========================================= */
const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("seller", "name email")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error(
      "Fetch products error:",
      error
    );

    res.status(500).json({
      message: "Server error fetching products",
    });
  }
};

/* =========================================
   GET SINGLE PRODUCT
========================================= */
const getSingleProduct = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      ).populate("seller", "name email");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    console.error(
      "Single product error:",
      error
    );

    res.status(500).json({
      message: "Server error fetching product",
    });
  }
};

/* =========================================
   DELETE PRODUCT
========================================= */
const deleteProduct = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // OWNER CHECK
    if (
      product.seller.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await product.deleteOne();

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete product error:",
      error
    );

    res.status(500).json({
      message: "Server error deleting product",
    });
  }
};

/* =========================================
   GET MY PRODUCTS
========================================= */
const getMyProducts = async (
  req,
  res
) => {
  try {
    const products = await Product.find({
      seller: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json(products);
  } catch (error) {
    console.error(
      "My products error:",
      error
    );

    res.status(500).json({
      message:
        "Server error fetching seller products",
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getSingleProduct,
  deleteProduct,
  getMyProducts,
};