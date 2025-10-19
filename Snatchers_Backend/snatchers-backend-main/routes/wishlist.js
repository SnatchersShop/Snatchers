// routes/wishlist.js
import express from "express";
import Wishlist from "../models/Wishlist.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// GET: Fetch wishlist for logged-in user
// router.get("/:userId", verifyToken, async (req, res) => {
//   try {
//     const wishlist = await Wishlist.findOne({ userId: req.user.uid }).populate("products");
//     res.json(wishlist?.products || []);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching wishlist", error: err });
//   }
// });
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const uid = req.authId || req.user?.sub || req.user?.uid || req.user?.['cognito:username'];
    console.log("[wishlist] fetch for authId:", uid);

    const wishlist = await Wishlist.findOne({ userId: uid }).populate("products");
    return res.json(wishlist?.products || []);
  } catch (err) {
    console.error("Wishlist fetch error:", err); // detailed log
    res.status(500).json({ message: "Error fetching wishlist", error: err.message });
  }
});

// POST: Add product to wishlist (body variant) - convenient for SPA clients
// NOTE: This route must be defined before any dynamic routes like '/:productId'
router.post("/add", isAuthenticated, async (req, res) => {
  try {
    const userId = req.authId || req.user?.sub || req.user?.uid || req.user?.['cognito:username'];
    const { productId } = req.body;

    if (!productId) return res.status(400).json({ message: 'productId required in request body' });

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [productId] });
    } else {
      const exists = wishlist.products.some(p => String(p) === String(productId));
      if (!exists) wishlist.products.push(productId);
    }
    await wishlist.save();
    return res.status(200).json({ message: "Added to wishlist", wishlist });
  } catch (err) {
    console.error('[wishlist] POST /add error:', err);
    return res.status(500).json({ message: "Error adding to wishlist", error: err.message });
  }
});

// DELETE: Remove product from wishlist
router.delete("/:productId", isAuthenticated, async (req, res) => {
  try {
    const userId = req.authId || req.user?.sub || req.user?.uid || req.user?.['cognito:username'];
    const productId = req.params.productId;

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $pull: { products: productId } },
      { new: true }
    );
    return res.status(200).json({ message: "Removed from wishlist", wishlist });
  } catch (err) {
    console.error('[wishlist] DELETE error:', err);
    return res.status(500).json({ message: "Error removing from wishlist", error: err.message });
  }
});

export default router;
