// models/Wishlist.js
import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
  userId: {
  type: String,
  required: true,
},

  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
}, { timestamps: true });

export default mongoose.model("Wishlist", WishlistSchema);
