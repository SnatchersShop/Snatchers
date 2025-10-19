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
  const { wishlist: localWishlist, toggleWishlist: toggleLocalWishlist } = useContext(WishlistContext);
  const [loading, setLoading] = useState(true);
  const showDebug = typeof window !== 'undefined' && window.location.search.includes('debug=1');

  const fetchWishlist = async () => {
    try {
      // Try to fetch server-side wishlist using session cookie (api has withCredentials:true)
      const res = await api.get('/api/wishlist');
      const serverProducts = Array.isArray(res.data) ? res.data : [];

      // If there are local wishlist IDs saved (from before login), fetch those product details
      const localIds = (localWishlist || []).filter(id => !serverProducts.find(p => p._id === id));
      let localProducts = [];
      if (localIds.length > 0) {
        const fetches = localIds.map(id => api.get(`/api/products/${id}`).then(r => r.data).catch(() => null));
        const fetched = await Promise.all(fetches);
        localProducts = fetched.filter(Boolean);
      }

      setWishlist([...serverProducts, ...localProducts]);
    } catch (error) {
      // If server wishlist fetch fails (likely unauthenticated), fall back to local wishlist
      console.debug('Server wishlist fetch failed or unauthenticated:', error?.response?.status || error.message);
      const localIds = localWishlist || [];
      if (localIds.length === 0) {
        setWishlist([]);
        setLoading(false);
        return;
      }

      try {
        const fetches = localIds.map(id => api.get(`/api/products/${id}`).then(r => r.data).catch(() => null));
        const fetched = await Promise.all(fetches);
        setWishlist(fetched.filter(Boolean));
      } catch (innerErr) {
        console.error('Failed to fetch local product details:', innerErr);
        setWishlist([]);
      }
    } finally {
      setLoading(false);
    }
  };

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

  // Re-fetch when the local wishlist changes so unauthenticated users see updates,
  // and to merge local IDs when user logs in. Listen for global wishlist change
  // events and wait for Firebase auth readiness before fetching so we get a token
  // when available.
  useEffect(() => {
    // Re-fetch when local wishlist changes and when other components signal changes
    fetchWishlist();
    const handler = () => fetchWishlist();
    window.addEventListener('wishlist:changed', handler);
    return () => window.removeEventListener('wishlist:changed', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localWishlist]);

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
          <div className="text-xs">Debug: token {tokenAvailable ? 'available' : 'missing'}</div>
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
