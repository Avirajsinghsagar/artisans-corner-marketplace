const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: String,
    price: Number,
    quantity: Number,
    image: String,
  },
  { _id: false }
);

const shippingSchema = new mongoose.Schema(
  {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderItems: [orderItemSchema],

    shippingAddress: shippingSchema,

    paymentMethod: {
      type: String,
      required: true,
      default: "COD",
    },

    itemsPrice: { type: Number, required: true },
    taxPrice: { type: Number, default: 0 },
    shippingPrice: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },

    isPaid: { type: Boolean, default: false },
    paidAt: Date,

    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,
  },
  { timestamps: true }
);
module.exports =
  mongoose.models.Order || mongoose.model("Order", orderSchema);