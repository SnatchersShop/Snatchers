import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Add item to cart
// @route   POST /api/cart/:productId
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.session?.userInfo?._id || req.session?.userInfo?.uid || req.user?._id || req.user?.sub || req.user?.uid;

    if (!userId) return res.status(401).json({ error: 'Not authenticated' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const price = product.offerPrice || product.price || 0;

    let cart = await Cart.findOne({ user }).exec().catch(() => null);

    if (!cart) {
      // create a new cart
      cart = new Cart({ user: userId, items: [{ product: productId, quantity: 1, price }], totalPrice: price });
    } else {
      const existing = cart.items.find((it) => String(it.product) === String(productId));
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.items.push({ product: productId, quantity: 1, price });
      }
      cart.totalPrice = cart.items.reduce((acc, it) => acc + (it.price * it.quantity), 0);
    }

    await cart.save();
    const populated = await cart.populate('items.product');
    return res.status(201).json(populated);
  } catch (err) {
    console.error('CART_ADD_ERROR:', err);
    return res.status(500).json({ error: 'Failed to update cart' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.session?.userInfo?._id || req.session?.userInfo?.uid || req.user?._id || req.user?.sub || req.user?.uid;
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const idx = cart.items.findIndex((it) => String(it.product) === String(productId));
    if (idx > -1) {
      cart.items.splice(idx, 1);
      cart.totalPrice = cart.items.reduce((acc, it) => acc + (it.price * it.quantity), 0);
      await cart.save();
      return res.status(200).json({ message: 'Item removed from cart' });
    }
    return res.status(404).json({ error: 'Item not in cart' });
  } catch (err) {
    console.error('CART_DELETE_ERROR:', err);
    return res.status(500).json({ error: 'Failed to update cart' });
  }
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    const userId = req.session?.userInfo?._id || req.session?.userInfo?.uid || req.user?._id || req.user?.sub || req.user?.uid;
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });

    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) return res.json([]);
    return res.json(cart.items);
  } catch (err) {
    console.error('CART_GET_ERROR:', err);
    return res.status(500).json({ error: 'Failed to get cart' });
  }
};
