import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/navigation";
import { useAuth } from '../contexts/AuthContext.jsx';
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import products from "../Data/ProductData";
import ProductCard from "./ProductCard";

const renderStars = (rating) => {
  const maxStars = 5;
  const filledStars = Math.round(rating);
  const stars = [];
  for (let i = 1; i <= maxStars; i++) {
    stars.push(
      <i
        key={i}
        className={`fa fa-star text-yellow-400 text-lg ${
          i <= filledStars ? "opacity-100" : "opacity-30"
        } transition-opacity duration-400 ease-in-out`}
      ></i>
    );
  }
  return stars;
};

const ProductDialog = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState([]);
  const { getSession } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching product with ID:", productId);
        console.log("API Base URL:", process.env.REACT_APP_API_BASE_URL);
      const session = await getSession();
      let idToken = null;
      if (session) {
        idToken = session.getIdToken().getJwtToken();
        setToken(idToken);
      }

  const productUrl = `/api/products/${productId}`;
        console.log("Product URL:", productUrl);
        
        // Always fetch product data (no auth required)
        try {
          const productRes = await axios.get(productUrl);
          console.log("Product response:", productRes.data);
          setProduct(productRes.data);
        } catch (apiErr) {
          console.error("API call failed, trying local data:", apiErr);
          console.log("Looking for product ID:", productId, "in local data");
          console.log("Available local product IDs:", products.map(p => p.id));
          
          // Try to find product by both _id and id formats
          let localProduct = products.find(p => p.id.toString() === productId);
          if (!localProduct) {
            // Try finding by _id format (in case it's a MongoDB ObjectId)
            localProduct = products.find(p => p._id === productId);
          }
          
          if (localProduct) {
            // Convert local product format to match API format
            const convertedProduct = {
              _id: localProduct._id || localProduct.id.toString(),
              title: localProduct.title,
              price: localProduct.price,
              offerPrice: localProduct.offerPrice || null,
              rating: localProduct.rating,
              description: localProduct.description,
              images: localProduct.images,
              badgeText: localProduct.badgeText,
              badgeClass: localProduct.badgeClass,
              category: localProduct.category,
              occasion: localProduct.occasion
            };
            console.log("Using local product data:", convertedProduct);
            setProduct(convertedProduct);
          } else {
            console.error("Product not found in local data either. ProductId:", productId);
            // If still not found, try to show a generic product or the first available product
            if (products.length > 0) {
              console.log("Showing first available product as fallback");
              const fallbackProduct = products[0];
              const convertedProduct = {
                _id: fallbackProduct._id || fallbackProduct.id.toString(),
                title: fallbackProduct.title,
                price: fallbackProduct.price,
                offerPrice: fallbackProduct.offerPrice || null,
                rating: fallbackProduct.rating,
                description: fallbackProduct.description,
                images: fallbackProduct.images,
                badgeText: fallbackProduct.badgeText,
                badgeClass: fallbackProduct.badgeClass,
                category: fallbackProduct.category,
                occasion: fallbackProduct.occasion
              };
              setProduct(convertedProduct);
            } else {
              throw new Error("No products available");
            }
          }
        }
        
  // Only fetch cart and wishlist data if user is authenticated
  if (session && idToken) {
          try {
            const [cartRes, wishlistRes] = await Promise.all([
              axios.get(`/api/cart`, {
                headers: { Authorization: `Bearer ${idToken}` },
              }),
              axios.get(`/api/wishlist`, {
                headers: { Authorization: `Bearer ${idToken}` },
              })
            ]);
            const cartIds = cartRes.data.map((item) => item.product._id);
            const wishlistIds = wishlistRes.data.map((item) => 
              typeof item === "object" && item.productId ? item.productId._id || item.productId : item._id || item
            );
            setCart(cartIds);
            setWishlist(wishlistIds);
          } catch (err) {
            console.error("Error fetching cart/wishlist:", err);
            // Don't fail the whole operation if cart/wishlist fetch fails
          }
        }
      } catch (err) {
        console.error("Error fetching product data:", err);
        console.error("Error response:", err.response?.data);
        console.error("Error status:", err.response?.status);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId, getSession]);

  // After product is loaded, fetch other products and filter by same category
  useEffect(() => {
    if (!product) return;
    let mounted = true;
    const loadSimilar = async () => {
      const sameCategory = (a, b) => {
        if (!a || !b) return false;
        const norm = (v) => (Array.isArray(v) ? v.map(String).map(s => s.toLowerCase()) : String(v).toLowerCase());
        const na = norm(a);
        const nb = norm(b);
        if (Array.isArray(na)) return na.includes(nb);
        if (Array.isArray(nb)) return nb.includes(na);
        return na === nb;
      };
      try {
        const res = await axios.get('/api/products');
        if (!mounted) return;
        const all = Array.isArray(res.data) ? res.data : [];
        const similar = all
          .filter((p) => String(p._id) !== String(product._id) && sameCategory(p.category, product.category))
          .slice(0, 6)
          .map((p) => ({
            _id: p._id,
            title: p.title,
            price: p.price,
            offerPrice: p.offerPrice ?? null,
            rating: p.rating,
            images: p.images || [],
            badgeText: p.badgeText,
            badgeClass: p.badgeClass,
          }));
        setSimilarProducts(similar);
      } catch (err) {
        console.warn('Failed to fetch products for similar list, using local fallback', err?.message || err);
        const fallback = products
          .filter((p) => String(p.id || p._id) !== String(product._id) && sameCategory(p.category, product.category))
          .slice(0, 6)
          .map((p) => ({
            _id: p._id || p.id?.toString?.() || `${p.title}-${Math.random()}`,
            title: p.title,
            price: p.price,
            offerPrice: p.offerPrice || null,
            rating: p.rating,
            images: p.images || [],
            badgeText: p.badgeText,
            badgeClass: p.badgeClass,
          }));
        if (mounted) setSimilarProducts(fallback);
      }
    };
    loadSimilar();
    return () => (mounted = false);
  }, [product]);

  const isInCart = product ? cart.includes(product._id) : false;
  const isWishlisted = product ? wishlist.includes(product._id) : false;

  const toggleWishlist = async () => {
    if (!token || !product) return;

  const url = `/api/wishlist/${product._id}`;

    try {
      if (isWishlisted) {
        await axios.delete(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist((prev) => prev.filter((id) => id !== product._id));
        window.dispatchEvent(new Event('wishlist:changed'));
      } else {
        await axios.post(url, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist((prev) => [...prev, product._id]);
        window.dispatchEvent(new Event('wishlist:changed'));
      }
    } catch (err) {
      console.error("Error updating wishlist:", err);
      alert("Unable to update wishlist. Please try again later or contact support.");
    }
  };

  const toggleCart = async () => {
    if (!token || !product) return;

  const url = `/api/cart/${product._id}`;

    try {
      if (isInCart) {
        await axios.delete(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart((prev) => prev.filter((id) => id !== product._id));
      } else {
        await axios.post(url, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart((prev) => [...prev, product._id]);
      }
    } catch (err) {
      console.error("Error updating cart:", err);
      // If API fails, show a message to the user
      alert("Unable to update cart. Please try again later or contact support.");
    }
  };

  // Helpers for similar products list
  const addToCartById = async (prod) => {
    if (!token) { alert('Please login to add to cart'); return; }
    try {
      await axios.post(`/api/cart/${prod._id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setCart((prev) => Array.from(new Set([...prev, prod._id])));
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Unable to add to cart. Please try again later.');
    }
  };

  const removeFromCartById = async (prodId) => {
    if (!token) { alert('Please login to modify cart'); return; }
    try {
      await axios.delete(`/api/cart/${prodId}`, { headers: { Authorization: `Bearer ${token}` } });
      setCart((prev) => prev.filter((id) => id !== prodId));
    } catch (err) {
      console.error('Error removing from cart:', err);
      alert('Unable to remove from cart.');
    }
  };

  const toggleWishlistById = async (prod) => {
    if (!token) { alert('Please login to manage wishlist'); return; }
    try {
      if (wishlist.includes(prod._id)) {
        await axios.delete(`/api/wishlist/${prod._id}`, { headers: { Authorization: `Bearer ${token}` } });
        setWishlist((prev) => prev.filter((id) => id !== prod._id));
      } else {
        await axios.post(`/api/wishlist/${prod._id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
        setWishlist((prev) => Array.from(new Set([...prev, prod._id])));
      }
      window.dispatchEvent(new Event('wishlist:changed'));
    } catch (err) {
      console.error('Error toggling wishlist:', err);
      alert('Unable to update wishlist.');
    }
  };

  const handleShare = async () => {
    const productUrl = `${window.location.origin}/product/${product._id}`;
  const shareText = `Check out this beautiful ${product.title} from Snatchers! Only ₹${product.offerPrice ?? product.price}`;
    
    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: shareText,
          url: productUrl,
        });
      } catch (err) {
        // User cancelled or error occurred, fallback to clipboard
        copyToClipboard(productUrl);
      }
    } else {
      // Fallback to clipboard
      copyToClipboard(productUrl);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Show a temporary success message
      const button = document.querySelector('[data-share-button]');
      if (button) {
        const originalText = button.innerHTML;
        button.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Copied!
        `;
        button.classList.add('bg-green-50', 'border-green-400', 'text-green-600');
        
        setTimeout(() => {
          button.innerHTML = originalText;
          button.classList.remove('bg-green-50', 'border-green-400', 'text-green-600');
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      // Fallback: show the URL in an alert
      alert(`Share this product: ${text}`);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading product...</p>
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Product not found</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            ← Back to Products
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-red-600 hover:text-red-700 font-medium mb-8 focus:outline-none focus:ring-2 focus:ring-red-600 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-red-50"
          aria-label="Go back"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
        >
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            {/* Images Section */}
            <div className="w-full lg:w-1/2 relative bg-gray-50">
              {/* Wishlist Button */}
              <button
                onClick={toggleWishlist}
                disabled={!token}
                className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl text-red-500 hover:text-red-700 hover:bg-white transition-all duration-300 disabled:text-gray-400 disabled:cursor-not-allowed shadow-lg"
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                {isWishlisted ? <FaHeart /> : <FaRegHeart />}
              </button>

              {/* Badge displayed vertically */}
              {product.badgeText && (
                <div
                  className={`absolute z-10 top-6 left-6 text-white italic px-3 py-1 text-xs font-serif ${product.badgeClass} clip-polygon shadow-lg`}
                  style={{
                    // Use vertical writing mode so badge letters stack vertically
                    writingMode: 'vertical-rl',
                    textOrientation: 'upright',
                    WebkitWritingMode: 'vertical-rl',
                    WebkitTextOrientation: 'upright',
                    clipPath: "polygon(100% 0%, 85% 50%, 100% 100%, 0 100%, 0% 50%, 0 0)",
                    fontFamily: "'Droid Serif', serif",
                    lineHeight: 1,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {product.badgeText.toUpperCase()}
                </div>
              )}

              {/* Main Image Gallery */}
              <div className="relative">
                <Swiper
                  style={{ width: "100%", height: "500px" }}
                  spaceBetween={0}
                  navigation={{
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                  }}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  modules={[Thumbs, Navigation]}
                  className="h-full"
                >
                  {product.images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                       <div className="relative w-full h-full bg-gray-100 border-2 border-gray-700 rounded-3xl overflow-hidden">
                        <img
                          src={img}
                          alt={`Product image ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                
                {/* Custom Navigation Buttons */}
                <div className="swiper-button-prev-custom absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                <div className="swiper-button-next-custom absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="p-6 bg-white border-t border-gray-200">
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={12}
                  slidesPerView={4}
                  freeMode
                  watchSlidesProgress
                  modules={[Thumbs]}
                  className="thumbnail-swiper"
                >
                  {product.images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <div className="relative group cursor-pointer">
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 group-hover:border-red-500 transition-all duration-200 shadow-sm"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>

            {/* Details Section */}
            <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-white">
              {/* Product Title */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mb-6"
              >
                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl text-black-600 font-medium leading-tight"
                  style={{ fontFamily: "'Italiana', serif" }}
                >
                  {product.title}
                </h1>
                {product.category && (
                  <p className="text-sm text-gray-500 uppercase tracking-wider mt-2 font-medium">
                    {product.category}
                  </p>
                )}
              </motion.div>

              {/* Rating */}
              {/* <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="mb-6 flex items-center space-x-3"
              >
                <div className="flex items-center space-x-1">
                  {renderStars(product.rating)}
                </div>
                <span className="text-gray-500 text-sm font-medium">({product.rating}/5)</span>
                <div className="h-4 w-px bg-gray-300"></div>
                <span className="text-gray-500 text-sm">Premium Quality</span>
              </motion.div> */}

              {/* Price */}
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="mb-8"
              >
                    <div className="flex items-baseline space-x-3">
                      {product.offerPrice ? (
                        <>
                          <span className="text-lg text-gray-500 line-through">₹{product.price}</span>
                          <span className="text-3xl sm:text-4xl font-bold text-gray-900">₹{product.offerPrice}</span>
                          <span className="text-sm text-gray-500">INR</span>
                          <span className="ml-3 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded">Offer</span>
                        </>
                      ) : (
                        <>
                          <span className="text-3xl sm:text-4xl font-bold text-gray-900">₹{product.price}</span>
                          <span className="text-sm text-gray-500">INR</span>
                        </>
                      )}
                    </div>
                
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="mb-8"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 text-base leading-relaxed">
                  {product.description}
                </p>
              </motion.div>

              {/* Product Features */}
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="mb-8"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Premium Materials</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Handcrafted</span>
                  </div>
                  
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={toggleCart}
                    disabled={!token}
                    className={`flex-1 border-2 uppercase text-sm font-semibold py-4 px-6 rounded-lg transition-all duration-300 ${
                      !token
                        ? "border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50"
                        : isInCart
                        ? "border-black text-black hover:bg-black hover:text-white bg-white"
                        : "border-black text-black hover:bg-black hover:text-white bg-white hover:shadow-lg"
                    }`}
                    type="button"
                  >
                    {!token ? "Login to Add to Cart" : isInCart ? "Remove from Cart" : "Add to Cart"}
                  </button>
                  
                  <button
                    className="flex-1 bg-black hover:bg-gray-800 text-white uppercase text-sm font-semibold py-4 px-6 rounded-lg transition-all duration-300 hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                    onClick={() => navigate(`/buy-now/${product._id}`)}
                    type="button"
                  >
                    Buy Now
                  </button>
                </div>
                
                {/* Share Button */}
                <div className="mt-4">
                  <button
                    onClick={handleShare}
                    data-share-button
                    className="w-full border-2 border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 bg-white py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                    type="button"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    Share Product
                  </button>
                </div>
                
                {/* Additional Info */}
                <div className="text-center text-xs text-gray-500 space-y-1">
                  <p>✓ Secure checkout with SSL encryption</p>
                  
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Similar Products Section */}
      {similarProducts && similarProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-semibold mb-4">Similar Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {similarProducts.map((sp) => (
              <ProductCard
                key={sp._id}
                image={sp.images?.[0] || '/fallback-image.jpg'}
                title={sp.title}
                price={sp.price}
                offerPrice={sp.offerPrice}
                rating={sp.rating}
                badgeText={sp.badgeText}
                badgeClass={sp.badgeClass}
                onClick={() => navigate(`/product/${sp._id}`)}
                onAddToCart={() => addToCartById(sp)}
                onRemoveFromCart={() => removeFromCartById(sp._id)}
                isInCart={cart.includes(sp._id)}
                onToggleWishlist={() => toggleWishlistById(sp)}
                wishlisted={wishlist.includes(sp._id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDialog;
