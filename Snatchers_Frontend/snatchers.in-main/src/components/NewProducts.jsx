import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../UI/ProductCard";
import axios from "axios";
import { getAuth } from "firebase/auth";

const NewProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [token, setToken] = useState(null);

  const placeholderImg =
    "https://redthread.uoregon.edu/files/original/affd16fd5264cab9197da4cd1a996f820e601ee4.png";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        // Always fetch products (no auth required)
        const productRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/products`);
        const sorted = productRes.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setProducts(sorted.slice(0, 8));

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
  }, []);

  const toggleWishlist = async (e, productId) => {
    e?.stopPropagation?.();
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

  const toggleCart = async (e, productId) => {
    e?.stopPropagation?.();
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
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/cart/${productId}`, { }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart((prev) => [...prev, productId]);
      }
    } catch (err) {
      console.error("Error updating cart:", err);
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
