import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../UI/ProductCard";
import { AnimatePresence, motion } from "framer-motion";
import api from '../api';
import { useAuth } from "../contexts/AuthContext";
import { guestCartIncludes, addGuestCartItem, removeGuestCartItem, getGuestCart } from '../utils/guestCart';

const DateNight = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState("Gifts");
  const [activeGender, setActiveGender] = useState("All");
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const placeholderImg =
    "https://redthread.uoregon.edu/files/original/affd16fd5264cab9197da4cd1a996f820e601ee4.png";

  const tabOccasionMap = {
    "Everyday Wear": ["wedding", "everydaywear"],
    Gifts: ["gift", "gifts"],
    Traditional: ["heritage", "vintage", "traditional"],
    "Date night": ["datenight", "datenightonly"],
  };

  useEffect(() => {
    const fetchAuthToken = async () => {
      if (!currentUser) return;
      try {
        if (typeof currentUser.getIdToken === 'function') {
          const maybe = await currentUser.getIdToken();
          if (typeof maybe === 'string') { setToken(maybe); return; }
          if (maybe && typeof maybe.getJwtToken === 'function') { setToken(maybe.getJwtToken()); return; }
        }
      } catch (e) {}
      try {
        if (currentUser && currentUser.session && typeof currentUser.session.getIdToken === 'function') {
          const id = currentUser.session.getIdToken();
          if (id && typeof id.getJwtToken === 'function') { setToken(id.getJwtToken()); return; }
        }
      } catch (e) {}
      // final fallback: try getSession from auth context if available
      try {
        const { getSession } = require('../contexts/AuthContext.jsx');
        if (typeof getSession === 'function') {
          const s = await getSession();
          if (s && typeof s.getIdToken === 'function') {
            const id = s.getIdToken();
            if (id && typeof id.getJwtToken === 'function') { setToken(id.getJwtToken()); return; }
          }
        }
      } catch (e) {}
      try { const st = localStorage.getItem('token'); if (st) setToken(st); } catch (e) {}
    };
    fetchAuthToken();
  }, [currentUser]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
          const res = await api.get(`/api/products`);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    const fetchWishlist = async () => {
      if (!token) {
        setWishlist([]);
        return;
      }
      try {
          const res = await api.get(`/api/wishlist`);
        const productIds = res.data.map((p) => p._id);
        setWishlist(productIds);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setWishlist([]);
      }
    };

    const fetchCart = async () => {
      if (!token) {
        // load guest cart
        setCart(getGuestCart().map(p => p._id));
        return;
      }
      try {
          const res = await api.get(`/api/cart`);
        const productIds = res.data.map((item) =>
          item.product ? item.product._id : item._id // handle nested structure if needed
        );
        setCart(productIds);
      } catch (err) {
        console.error("Error fetching cart:", err);
        setCart([]);
      }
    };

    fetchProducts();
    fetchWishlist();
    fetchCart();
  }, [token]);

  const toggleWishlist = async (productId) => {
    if (!token) {
      window.location.href = '/login';
      return;
    }
    const isWishlisted = wishlist.includes(productId);
      const url = `/api/wishlist/${productId}`;
    try {
      if (isWishlisted) {
        await api.delete(url);
        setWishlist((prev) => prev.filter((id) => id !== productId));
        window.dispatchEvent(new Event('wishlist:changed'));
      } else {
        await api.post(url);
        setWishlist((prev) => [...prev, productId]);
        window.dispatchEvent(new Event('wishlist:changed'));
      }
    } catch (err) {
      console.error("Error updating wishlist:", err);
    }
  };

  const toggleCart = async (productId) => {
    const isInCart = cart.includes(productId) || guestCartIncludes(productId);

    if (token) {
        const url = `/api/cart/${productId}`;
      try {
        if (isInCart) {
          await api.delete(url);
          setCart((prev) => prev.filter((id) => id !== productId));
        } else {
          await api.post(url);
          setCart((prev) => [...prev, productId]);
        }
      } catch (err) {
        console.error("Error updating cart:", err);
      }
      return;
    }

    // guest
    try {
      if (guestCartIncludes(productId)) {
        removeGuestCartItem(productId);
        setCart((prev) => prev.filter((id) => id !== productId));
      } else {
        const prod = products.find((p) => String(p._id) === String(productId)) || { _id: productId };
        addGuestCartItem(prod);
        setCart((prev) => Array.from(new Set([...prev, productId])));
      }
    } catch (err) {
      console.error('Guest cart update failed', err);
    }
  };

  const filteredProducts = products
    .filter((p) => {
      const allowedOccasions = tabOccasionMap[activeTab];
      const occasionMatch = p.occasion?.some(occ => allowedOccasions.includes(occ));
      
      // Filter by gender if not "All"
      if (activeGender === "All") {
        return occasionMatch;
      } else {
        // Use 'category' field from product data (not 'gender')
        const genderMatch = p.category?.toLowerCase() === activeGender.toLowerCase();
        return occasionMatch && genderMatch;
      }
    })
    .slice(0, 8);

  const descriptions = {
    "Date night": "Curated picks to make your evening unforgettable.",
    Traditional: "Celebrate timeless heritage with these exclusive picks.",
    "Everyday Wear": "Elegant gifts to mark the beginning of forever.",
    Gifts: "Handpicked surprises for every kind of love.",
  };

  return (
    <div className="date-night-products max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.h1
        key={activeTab + "-title"}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-3xl sm:text-4xl lg:text-5xl mb-2 text-center text-gray-800 font-medium"
        style={{ fontFamily: "'Italiana', serif" }}
      >
        {activeTab} Specials
      </motion.h1>

      <motion.p
        key={activeTab + "-desc"}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center text-sm sm:text-base text-gray-500 mb-6 sm:mb-8"
      >
        {descriptions[activeTab]}
      </motion.p>

      <div className="flex justify-center items-center mb-4 sm:mb-6">
        <img
          src="./title-line.png"
          alt="Decorative underline"
          className="h-4 sm:h-6 md:h-8 lg:h-10 max-w-full object-contain"
        />
      </div>

      <div className="flex overflow-x-auto whitespace-nowrap justify-center items-center gap-2 sm:gap-4 md:gap-6 lg:gap-10 mb-6 px-0 scrollbar-hide">
        {["Everyday Wear", "Gifts", "Traditional", "Date night"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-1 py-1 border-2 rounded-xl p-2 transition text-xs sm:text-2xl md:text-3xl font-medium flex-shrink-0 ${
              activeTab === tab
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-red-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Gender Filter */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex justify-center items-center gap-2 sm:gap-4 mb-6"
      >
        {["All", "Mens", "Womens"].map((gender) => (
          <button
            key={gender}
            onClick={() => setActiveGender(gender)}
            className={`px-3 py-2 border-2 rounded-lg transition text-sm sm:text-base font-medium ${
              activeGender === gender
                ? "border-red-600 text-red-600 bg-red-50"
                : "border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-500"
            }`}
          >
            {gender}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab + "-" + activeGender + "-products"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6"
        >
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter") navigate(`/product/${product._id}`);
              }}
            >
              <ProductCard
                image={product.images?.[0] || placeholderImg}
                title={product.title}
                price={product.price}
                offerPrice={product.offerPrice}
                rating={product.rating}
                wishlisted={wishlist.includes(product._id)}
                onToggleWishlist={() => toggleWishlist(product._id)}
                isInCart={cart.includes(product._id)}
                onAddToCart={() => toggleCart(product._id)}
                onRemoveFromCart={() => toggleCart(product._id)}
              />
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DateNight;
