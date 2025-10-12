// models/Order.js
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  productTitle: {
    type: String,
    required: true,
  },
  productImage: {
    type: String,
    default: "/product-placeholder.jpg",
  },
  price: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Ordered",
    enum: ["Ordered", "Processing", "Shipped", "Delivered", "Cancelled"],
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  shiprocketOrderId: {
    type: String,
  },
}, { timestamps: true });

export default mongoose.model("Order", OrderSchema);
