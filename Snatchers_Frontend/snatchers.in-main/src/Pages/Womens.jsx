import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../UI/ProductCard";
import { motion } from "framer-motion";
import axios from "axios";
import api from '../api';
import { useAuth } from '../contexts/AuthContext.jsx';
import { guestCartIncludes, addGuestCartItem, removeGuestCartItem } from '../utils/guestCart';
import productsFallback from '../Data/ProductData';

const Womens = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const { getSession } = useAuth();
  const [usedFallback, setUsedFallback] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const placeholderImg =
    "https://redthread.uoregon.edu/files/original/affd16fd5264cab9197da4cd1a996f820e601ee4.png";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = await getSession();
        
        // Always fetch products (no auth required)
        try {
          const productsRes = await api.get(`/products`);
          setProducts(productsRes.data);
        } catch (err) {
          console.warn('Womens: product API failed, using local fallback', err?.message || err);
          setUsedFallback(true);
          setErrorMsg(err?.message || String(err));
          const local = productsFallback.map(p => ({
            _id: p._id || p.id?.toString?.() || `${p.title}-${Math.random()}`,
            title: p.title,
            price: p.price,
            offerPrice: p.offerPrice || null,
            rating: p.rating,
            images: p.images || [],
            badgeText: p.badgeText,
            badgeClass: p.badgeClass,
            description: p.description,
            category: p.category,
          }));
          setProducts(local);
        }

        // Only fetch user-specific data if logged in
        if (session) {
          let idToken = null;
          try {
            if (typeof session.getIdToken === 'function') {
              const maybe = session.getIdToken();
              idToken = typeof maybe.getJwtToken === 'function' ? maybe.getJwtToken() : (typeof maybe === 'string' ? maybe : null);
            }
          } catch (e) {}
          if (!idToken) {
            try {
              const s2 = await getSession();
              if (s2 && typeof s2.getIdToken === 'function') {
                const id = s2.getIdToken();
                idToken = typeof id.getJwtToken === 'function' ? id.getJwtToken() : (typeof id === 'string' ? id : null);
              }
            } catch (e) {}
          }
          if (!idToken) {
            try { idToken = localStorage.getItem('token'); } catch (e) { /* ignore */ }
          }
          if (idToken) setToken(idToken);

          try {
            const [wishlistRes, cartRes] = await Promise.all([
              api.get(`/wishlist`),
              api.get(`/cart`),
            ]);

            const wishlistedIds = wishlistRes.data.map((item) =>
              typeof item === "object" && item.productId
                ? item.productId._id || item.productId
                : item._id || item
            );
            setWishlist(wishlistedIds);

            const cartIds = cartRes.data.map((item) => item.product._id);
            setCart(cartIds);
          } catch (userDataErr) {
            console.log("User data fetch failed (user might not have cart/wishlist yet):", userDataErr);
            // Set empty arrays for non-logged in users
            setWishlist([]);
            setCart([]);
          }
        } else {
          // Set empty arrays for non-logged in users
          setWishlist([]);
          setCart([]);
        }
      } catch (err) {
        console.error("Error fetching women's data:", err);
      }
    };

    fetchData();
  }, [getSession]);

  const toggleWishlist = async (e, productId) => {
    e?.stopPropagation?.();
    if (!token) {
      navigate('/login');
      return;
    }

    const isWishlisted = wishlist.includes(productId);
  const url = `/wishlist/${productId}`;

    try {
        if (isWishlisted) {
        await api.delete(url);
        setWishlist((prev) => prev.filter((id) => id !== productId));
        // notify other parts of the app that wishlist changed
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

  const toggleCart = async (e, productId) => {
    e?.stopPropagation?.();
    const isInCart = cart.includes(productId) || guestCartIncludes(productId);

    if (token) {
      const url = `/cart/${productId}`;
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

  const womensProducts = products.filter(
    (product) => product.category?.toLowerCase() === "women"
  );

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {usedFallback && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded">
            Using local product data because the product API failed or is unreachable. <div className="text-xs text-gray-600">{errorMsg}</div>
          </div>
        )}
        {/* Hero Section */}
        <div className="relative w-full mb-8">
          <img
            src="/womens.jpg"
            alt="Women's Collection"
            className="w-full h-48 sm:h-64 md:h-80 lg:h-[28rem] xl:h-[32rem] object-cover object-center shadow-md"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/30">
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-3xl sm:text-4xl lg:text-5xl mb-2 text-center text-white font-medium drop-shadow-lg"
              style={{ fontFamily: "'Italiana', serif" }}
            >
              Explore Our Women's Collection
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center text-sm sm:text-base text-gray-200 italic mb-2 sm:mb-4 drop-shadow"
            >
              Embrace Elegance and Femininity.
            </motion.p>

            <img
              src="./title-line.png"
              alt="Decorative underline"
              className="h-4 sm:h-6 md:h-8 lg:h-10 max-w-full object-contain mb-2"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {womensProducts.map((product) => (
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
                badgeText={product.badgeText}
                badgeClass={product.badgeClass}
                wishlisted={wishlist.includes(product._id)}
                isInCart={cart.includes(product._id)}
                onToggleWishlist={(e) => toggleWishlist(e, product._id)}
                onAddToCart={(e) => toggleCart(e, product._id)}
                onRemoveFromCart={(e) => toggleCart(e, product._id)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Womens;
