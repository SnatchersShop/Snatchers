// routes/cart.js
import express from 'express';
import { isAuthenticated } from '../middleware/auth.js';
import { getCart, addToCart, removeFromCart } from '../controllers/cartController.js';

const router = express.Router();

router.get('/', isAuthenticated, getCart);
router.post('/:productId', isAuthenticated, addToCart);
router.delete('/:productId', isAuthenticated, removeFromCart);

export default router;
