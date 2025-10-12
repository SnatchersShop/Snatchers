import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  images: [String],
  title: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  badgeText: { type: String, default: '' },
  badgeClass: { type: String, default: '' },
  description: String,
  category: { type: String, required: true },
  occasion: [String],
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
