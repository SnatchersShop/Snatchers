// routes/wishlist.js
import express from "express";
import Wishlist from "../models/Wishlist.js";
import verifyToken from "../middleware/auth.js";

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
router.get("/", verifyToken, async (req, res) => {
  try {
    console.log("Decoded user ID:", req.user?.uid); // log userId

    const wishlist = await Wishlist.findOne({ userId: req.user.uid }).populate("products");

    res.json(wishlist?.products || []);
  } catch (err) {
    console.error("Wishlist fetch error:", err); // detailed log
    res.status(500).json({ message: "Error fetching wishlist", error: err.message });
  }
});

// POST: Add product to wishlist
router.post("/:productId", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const productId = req.params.productId;

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [productId] });
    } else if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
    }
    await wishlist.save();
    res.status(200).json({ message: "Added to wishlist", wishlist });
  } catch (err) {
    res.status(500).json({ message: "Error adding to wishlist", error: err });
  }
});

// DELETE: Remove product from wishlist
router.delete("/:productId", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const productId = req.params.productId;

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $pull: { products: productId } },
      { new: true }
    );
    res.status(200).json({ message: "Removed from wishlist", wishlist });
  } catch (err) {
    res.status(500).json({ message: "Error removing from wishlist", error: err });
  }
});

export default router;
