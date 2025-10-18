import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../UI/ProductCard";
import api from '../api';
import { useAuth } from '../contexts/AuthContext.jsx';
import {
  addGuestCartItem,
  removeGuestCartItem,
  guestCartIncludes,
} from '../utils/guestCart';

const NewProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [token, setToken] = useState(null);
  const { getSession } = useAuth();

  const placeholderImg =
    "https://redthread.uoregon.edu/files/original/affd16fd5264cab9197da4cd1a996f820e601ee4.png";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = await getSession();
        const idToken = session ? session.getIdToken().getJwtToken() : null;
        
        // Always fetch products (no auth required)
  const productRes = await api.get(`/api/products`);
        const sorted = productRes.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setProducts(sorted.slice(0, 8));

        // Only fetch user-specific data if logged in
        if (session) {
          setToken(idToken);

          try {
            const [wishlistRes, cartRes] = await Promise.all([
              api.get(`/api/wishlist`),
              api.get(`/api/cart`),
            ]);

            const wishlistedIds = wishlistRes.data.map((item) =>
              typeof item === "object" && item.productId
                ? item.productId._id || item.productId
                : item._id || item
            );
            setWishlist(wishlistedIds);

            const cartProductIds = cartRes.data.map((item) => item.product._id);
            setCart(cartProductIds);
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
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [getSession]);

  const toggleWishlist = async (e, productId) => {
    e?.stopPropagation?.();
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

  const toggleCart = async (e, productId) => {
    e?.stopPropagation?.();
    const isInCart = cart.includes(productId) || guestCartIncludes(productId);

    // If logged in, use server API
    if (token) {
      const url = `/api/cart/${productId}`;
      try {
        if (isInCart) {
          await api.delete(url);
          setCart((prev) => prev.filter((id) => id !== productId));
        } else {
          await api.post(`/api/cart/${productId}`);
          setCart((prev) => [...prev, productId]);
        }
      } catch (err) {
        console.error("Error updating cart:", err);
      }
      return;
    }

    // Guest flow: toggle localStorage-backed cart
    try {
      if (guestCartIncludes(productId)) {
        removeGuestCartItem(productId);
        setCart((prev) => prev.filter((id) => id !== productId));
      } else {
        // Build minimal product placeholder for guest cart
        const prod = products.find((p) => String(p._id) === String(productId)) || { _id: productId };
        addGuestCartItem(prod);
        setCart((prev) => Array.from(new Set([...prev, productId])));
      }
    } catch (err) {
      console.error('Guest cart update failed', err);
    }
  };

  return (
    <>
      <div className="date-night-products mt-0 max-w-10xl mx-auto px-6 py-10">
        <h1
          className="text-6xl mb-0 text-center text-gray-800 font-medium"
          style={{ fontFamily: "'Italiana', serif" }}
        >
          Just Arrived
        </h1>

        <p className="text-center text-gray-500 italic mb-10">
          Discover Our Latest Additions.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
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
                isInCart={cart.includes(product._id)} // 👈 Cart state
                onToggleWishlist={(e) => toggleWishlist(e, product._id)}
                onAddToCart={(e) => toggleCart(e, product._id)} // 👈 Add
                onRemoveFromCart={(e) => toggleCart(e, product._id)} // 👈 Remove
              />
            </div>
          ))}
        </div>
      </div>

      <img
        src="/men.jpg"
        alt="Decorative line"
        className="mx-auto my-0 mb-9 max-w-10xl w-full shadow-md object-cover"
      />
    </>
  );
};

export default NewProducts;
