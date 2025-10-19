import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api';
import { toast } from 'react-toastify';
import ProductCard from "../UI/ProductCard";
// auth handled via API session cookie; no Cognito getSession required here
import { guestCartIncludes, addGuestCartItem, removeGuestCartItem } from '../utils/guestCart';
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
      let isAuthenticated = false;

      // 1) Always fetch products (no auth required)
      try {
        const productsRes = await api.get(`/api/products`);
        setProducts(productsRes.data);
      } catch (err) {
        console.warn('Shop: product API failed, using local fallback', err?.message || err);
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

      // 2) Try to fetch user-specific data using the API (sends session cookie)
      try {
        const [wishlistRes, cartRes] = await Promise.all([
          api.get(`/api/wishlist`),
          api.get(`/api/cart`),
        ]);

        isAuthenticated = true;

        const wishlistedIds = wishlistRes.data.map((item) =>
          typeof item === "object" && item.productId
            ? item.productId._id || item.productId
            : item._id || item
        );
        setWishlist(wishlistedIds);

        const cartIds = cartRes.data.map((item) => item.product._id);
        setCart(cartIds);
      } catch (userDataErr) {
        console.log("Could not fetch user data. Assuming guest.", userDataErr.message);
        isAuthenticated = false;
        setWishlist([]);
        try {
          const guest = (await import('../utils/guestCart')).getGuestCart();
          setCart(guest.map((p) => p._id));
        } catch (e) {
          setCart([]);
        }
      }

      // 3) Set token to a boolean flag indicating authenticated or not
      setToken(isAuthenticated);
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
    try {
      if (isWishlisted) {
        await api.delete(`/api/wishlist/${productId}`);
        setWishlist((prev) => prev.filter((id) => id !== productId));
        window.dispatchEvent(new Event('wishlist:changed'));
        toast.success('Removed from wishlist');
      } else {
        await api.post(`/api/wishlist/add`, { productId });
        setWishlist((prev) => [...prev, productId]);
        window.dispatchEvent(new Event('wishlist:changed'));
        toast.success('Added to wishlist');
      }
    } catch (err) {
      console.error("Error updating wishlist:", err);
      if (err.response?.status === 401) {
        toast.error('Your session expired. Please log in.');
        navigate('/login');
      } else {
        toast.error('Unable to update wishlist');
      }
    }
  };

  const toggleCart = async (e, productId) => {
    e?.stopPropagation?.();
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

    // Guest cart toggle
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
                    product={product}
                    image={product.images?.[0] || placeholderImg}
                    title={product.title}
                    price={product.price}
                    offerPrice={product.offerPrice}
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
