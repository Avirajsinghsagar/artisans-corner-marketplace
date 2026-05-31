const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Pottery",
        "Decor",
        "Jewelry",
        "Paintings",
        "Gifts",
      ],
      default: "Pottery",
    },

    image: {
      type: String,
      default: "",
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema);