import express from "express";
import multer from "multer";
import mongoose from "mongoose";

import { storage } from "../config/cloudinary.js";
import Product from "../models/Product.js";

const upload = multer({ storage });
const router = express.Router();

// GET /api/products - Fetch all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/products/:id - Fetch single product by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/products - Create product with multiple images
router.post("/", upload.array("images", 5), async (req, res) => {
  console.log("Received files:", req.files);
  try {
    const {
      title,
      price,
      offerPrice,
      rating,
      badgeText,
      badgeClass,
      description,
      category,
      occasion
    } = req.body;

    const imageUrls = req.files.map((file) => file.path);
    console.log("Received images:", imageUrls);
    const product = new Product({
      images: imageUrls,
      title,
      price,
      offerPrice: offerPrice ? Number(offerPrice) : null,
      rating,
      badgeText,
      badgeClass,
      description,
      category,
      occasion: Array.isArray(occasion) ? occasion : occasion.split(",")
    });

    await product.save();

    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// DELETE /api/products/:id - Delete product by id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await Product.findByIdAndDelete(id);
    // TODO: consider deleting associated images from cloudinary/storage if needed
    return res.status(200).json({ success: true, id });
  } catch (err) {
    console.error('Error deleting product:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/products/:id - Update product fields (admin)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }
  try {
    const update = {};
    const allowed = ['title', 'price', 'offerPrice', 'rating', 'badgeText', 'badgeClass', 'description', 'category', 'occasion'];
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        update[key] = req.body[key];
      }
    }
    // Normalize numeric fields
    if (update.price !== undefined) update.price = Number(update.price);
    if (update.offerPrice !== undefined) update.offerPrice = update.offerPrice === null ? null : Number(update.offerPrice);
    if (update.rating !== undefined) update.rating = Number(update.rating);

    const product = await Product.findByIdAndUpdate(id, update, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.status(200).json({ success: true, product });
  } catch (err) {
    console.error('Error updating product:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
