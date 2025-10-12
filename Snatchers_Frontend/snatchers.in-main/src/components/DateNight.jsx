import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../UI/ProductCard";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

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
      if (currentUser) {
        const freshToken = await currentUser.getIdToken();
        setToken(freshToken);
      }
    };
    fetchAuthToken();
  }, [currentUser]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/products`);
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
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const productIds = res.data.map((p) => p._id);
        setWishlist(productIds);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setWishlist([]);
      }
    };

    const fetchCart = async () => {
      if (!token) {
        setCart([]);
        return;
      }
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/wishlist/${productId}`;
    try {
      if (isWishlisted) {
        await axios.delete(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist((prev) => prev.filter((id) => id !== productId));
        window.dispatchEvent(new Event('wishlist:changed'));
      } else {
        await axios.post(url, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist((prev) => [...prev, productId]);
        window.dispatchEvent(new Event('wishlist:changed'));
      }
    } catch (err) {
      console.error("Error updating wishlist:", err);
    }
  };

  const toggleCart = async (productId) => {
    if (!token) {
      window.location.href = '/login';
      return;
    }
    const isInCart = cart.includes(productId);
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/cart/${productId}`;
    try {
      if (isInCart) {
        await axios.delete(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart((prev) => prev.filter((id) => id !== productId));
      } else {
        await axios.post(url, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart((prev) => [...prev, productId]);
      }
    } catch (err) {
      console.error("Error updating cart:", err);
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
