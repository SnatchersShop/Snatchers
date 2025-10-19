import React, { useEffect, useState, useContext } from 'react';
import api from '../api';

import ProductCard from '../UI/ProductCard';
import { useNavigate } from 'react-router-dom';
import AnimatedHeading from '../UI/AnimatedHeading'; // Adjust path as needed
import { WishlistContext } from '../contexts/WishlistContext';

const placeholderImg = '/placeholder.png'; // Replace with your actual path if different

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const { toggleWishlist: toggleLocalWishlist } = useContext(WishlistContext);
  const [loading, setLoading] = useState(true);
  const showDebug = typeof window !== 'undefined' && window.location.search.includes('debug=1');



  const removeFromWishlist = async (productId) => {
    try {
      // Try server-side removal first (if user is authenticated via session cookie)
      try {
        await api.delete(`/api/wishlist/${productId}`);
        setWishlist((prev) => prev.filter((item) => item._id !== productId));
        return;
      } catch (err) {
        // If unauthorized, fall back to local wishlist toggle
        if (err.response?.status === 401) {
          toggleLocalWishlist(productId);
          setWishlist((prev) => prev.filter((item) => item._id !== productId));
          return;
        }
        // If some other error occurred, rethrow so outer catch handles it
        throw err;
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleAddToCart = (product) => {
    console.log('Add to cart:', product);
    // Your cart logic here
  };

  const handleCompare = (product) => {
    console.log('Compare:', product);
    // Your compare logic here
  };

  const toggleWishlist = (productId) => {
    // On wishlist page toggling should remove the item (same as remove)
    removeFromWishlist(productId);
  };

  // Simple fetch: use the api client to request server wishlist (sends cookie)
  useEffect(() => {
    const doFetch = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/wishlist');
        const serverProducts = Array.isArray(res.data) ? res.data : [];
        setWishlist(serverProducts);
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    doFetch();
    // Listen for external wishlist changes and re-fetch
    const handler = () => doFetch();
    window.addEventListener('wishlist:changed', handler);
    return () => window.removeEventListener('wishlist:changed', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-lg font-medium text-gray-600">Loading your wishlist...</div>;
  }

  return (
    <div className="px-4 sm:px-8 py-6 min-h-screen bg-gray-50">
      <AnimatedHeading
        heading="Your Wishlist"
        subheading="All the products you love in one place."
      />

      {showDebug && (
        <div className="fixed top-24 right-6 z-50 bg-black text-white px-3 py-2 rounded shadow">
          <div className="text-xs">Debug: wishlist items {wishlist.length}</div>
        </div>
      )}

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard
              key={product._id}
              image={product.images?.[0] || placeholderImg}
              title={product.title}
              price={product.price}
              offerPrice={product.offerPrice}
              rating={product.rating}
              onAddToCart={(e) => {
                e.stopPropagation();
                handleAddToCart(product);
              }}
              onWishlist={(e) => {
                e.stopPropagation();
                toggleWishlist(product._id);
              }}
              onCompare={(e) => {
                e.stopPropagation();
                handleCompare(product);
              }}
              wishlisted={true}
              onToggleWishlist={() => toggleWishlist(product._id)}
              onClick={() => navigate(`/product/${product._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
