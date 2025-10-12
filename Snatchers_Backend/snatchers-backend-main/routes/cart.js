// routes/cart.js
import express from "express";
import Cart from "../models/Cart.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

// GET: Fetch user's cart
router.get("/", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.uid }).populate("products.product");
    res.json(cart?.products || []);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart", error: err.message });
  }
});

// POST: Add or update a product in the cart
router.post("/:productId", verifyToken, async (req, res)   => {
  try {
    const userId = req.user.uid;
    const productId = req.params.productId;
    const { quantity = 1 } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [{ product: productId, quantity }] });
    } else {
      const existingProduct = cart.products.find(p => p.product.toString() === productId);
      if (existingProduct) {
        existingProduct.quantity += quantity; // Increase quantity
      } else {
        cart.products.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ message: "Product added/updated in cart", cart });
  } catch (err) {
    res.status(500).json({ message: "Error adding to cart", error: err.message });
  }
});

// DELETE: Remove a product from the cart
router.delete("/:productId", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const productId = req.params.productId;

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { products: { product: productId } } },
      { new: true }
    );
    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (err) {
    res.status(500).json({ message: "Error removing from cart", error: err.message });
  }
});

export default router;
