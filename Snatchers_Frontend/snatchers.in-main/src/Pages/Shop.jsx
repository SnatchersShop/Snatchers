import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../UI/ProductCard";
import { getAuth } from "firebase/auth";
import { StaggeredReveal, RevealOnScroll, MagneticScroll } from "../components/ScrollAnimations";
import productsFallback from '../Data/ProductData';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [token, setToken] = useState(null);
  const [usedFallback, setUsedFallback] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  const placeholderImg =
    "https://redthread.uoregon.edu/files/original/affd16fd5264cab9197da4cd1a996f820e601ee4.png";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        // Always fetch products (no auth required)
        try {
          const productsRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/products`);
          setProducts(productsRes.data);
        } catch (err) {
          console.warn('Shop: product API failed, using local fallback', err?.message || err);
          setUsedFallback(true);
          setErrorMsg(err?.message || String(err));
          const local = productsFallback.map(p => ({
            _id: p._id || p.id?.toString?.() || `${p.title}-${Math.random()}`,
            title: p.title,
            price: p.price,
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
        if (user) {
          const idToken = await user.getIdToken();
          setToken(idToken);

          try {
            const [wishlistRes, cartRes] = await Promise.all([
              axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/wishlist`, {
                headers: { Authorization: `Bearer ${idToken}` },
              }),
              axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/cart`, {
                headers: { Authorization: `Bearer ${idToken}` },
              }),
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
        console.error("Error fetching shop data:", err);
      }
    };

    fetchData();
  }, []);

  const toggleWishlist = async (e, productId) => {
    e?.stopPropagation?.();
    if (!token) {
      navigate('/login');
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

  const toggleCart = async (e, productId) => {
    e?.stopPropagation?.();
    if (!token) {
      navigate('/login');
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

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {usedFallback && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded">
            Using local product data because the product API failed or is unreachable. <div className="text-xs text-gray-600">{errorMsg}</div>
          </div>
        )}
        <RevealOnScroll direction="up" distance={50}>
          <MagneticScroll strength={0.1}>
            <h2 className="text-4xl font-bold mb-8 text-red-600 text-center">
              Explore Our Collection
            </h2>
          </MagneticScroll>
          <div className="w-24 h-1 bg-red-500 mx-auto mb-10 rounded-full" />
        </RevealOnScroll>

        <StaggeredReveal staggerDelay={0.1} direction="up" distance={30}>
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, index) => (
              <div key={product._id} className="stagger-item">
                <MagneticScroll strength={0.15}>
                  <ProductCard
                    image={product.images?.[0] || placeholderImg}
                    title={product.title}
                    price={product.price}
                    rating={product.rating}
                    badgeText={product.badgeText}
                    badgeClass={product.badgeClass}
                    wishlisted={wishlist.includes(product._id)}
                    isInCart={cart.includes(product._id)}
                    onClick={() => navigate(`/product/${product._id}`)}
                    onToggleWishlist={(e) => toggleWishlist(e, product._id)}
                    onAddToCart={(e) => toggleCart(e, product._id)}
                    onRemoveFromCart={(e) => toggleCart(e, product._id)}
                  />
                </MagneticScroll>
              </div>
            ))}
          </div>
        </StaggeredReveal>
      </div>
    </section>
  );
};

export default Shop;
