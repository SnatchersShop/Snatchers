import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  getGuestCart,
  addGuestCartItem,
  removeGuestCartItem,
  guestCartIncludes,
} from '../utils/guestCart';
import ProductCard from '../UI/ProductCard';
import { useNavigate } from 'react-router-dom';
import AnimatedHeading from '../UI/AnimatedHeading';

const placeholderImg = '/placeholder.png';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // load guest cart from localStorage
        const guest = getGuestCart();
        setCartItems(guest);
        return;
      }

      const res = await axios.get(`/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const cartData = Array.isArray(res.data)
        ? res.data.map((item) => item.product || item)
        : [];

      setCartItems(cartData);
    } catch (error) {
      console.error('Failed to fetch cart:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // guest removal
        removeGuestCartItem(productId);
        setCartItems((prev) => prev.filter((item) => item._id !== productId));
        return;
      }

      await axios.delete(`/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems((prev) => prev.filter((item) => item._id !== productId));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // guest add
        addGuestCartItem(product);
        setCartItems((prev) => Array.from(new Set([...prev, product])));
        return;
      }

      await axios.post(`/api/cart`, { productId: product._id }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems((prev) => [...prev, product]);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleCartToggle = (product) => {
    const isInCart = cartItems.some((item) => item._id === product._id);
    isInCart ? removeFromCart(product._id) : addToCart(product);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg font-medium text-gray-600">
        Loading your cart...
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 py-6 min-h-screen bg-gray-50">
      <AnimatedHeading
        heading="Your Cart"
        subheading="Everything you're ready to grab!"
      />

      {!localStorage.getItem('token') && (
        <div className="max-w-3xl mx-auto mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded text-center">
          <p className="mb-3">You're viewing the cart as a guest. You can add items and continue shopping. To save your cart across devices or proceed to checkout, please login or register.</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/login')} className="px-4 py-2 bg-black text-white rounded">Login</button>
            <button onClick={() => navigate('/register')} className="px-4 py-2 border border-black rounded">Register</button>
          </div>
        </div>
      )}

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">Your cart is empty.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cartItems.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                image={product.images?.[0] || placeholderImg}
                title={product.title}
                price={product.price}
                offerPrice={product.offerPrice}
                rating={product.rating}
                isInCart={true}
                onAddToCart={() => handleCartToggle(product)}
                onRemoveFromCart={() => handleCartToggle(product)}
                showRemoveFromCart={true}
                onClick={() => navigate(`/product/${product._id}`)}
              />
            ))}
          </div>
          
          {/* Checkout Section */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total ({cartItems.length} items):</span>
              <span className="text-xl font-bold text-red-600">
                ₹{cartItems.reduce((total, product) => total + (product.price || 0), 0)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4 text-center">
              Individual checkout for each item
            </p>
            <div className="space-y-2">
              {cartItems.map((product) => (
                <button
                  key={product._id}
                  onClick={() => navigate(`/buy-now/${product._id}`)}
                  className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200 text-sm"
                >
                  Buy {product.title} - ₹{product.price}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
