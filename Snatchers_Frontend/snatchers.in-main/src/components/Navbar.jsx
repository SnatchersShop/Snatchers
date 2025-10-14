import React, { useState, useEffect } from 'react';
import {
  FaSearch,
  FaShoppingBag,
  FaTrashAlt,
  FaUser,
  FaBars,
  FaTimes,
  FaHeart,
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext.jsx';
import axios from 'axios';

const Navbar = () => {
  const { currentUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(true);

  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length > 0) {
      try {
  const res = await axios.get(`/search`, {
          params: { q: value }
        });
        setSearchResults(res.data);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Search failed:', err);
        setSearchResults([]);
        setShowSuggestions(false);
      }
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }
  };

  // Dismiss dropdown on click outside
  useEffect(() => {
    const handler = (event) => {
      if (
        event.target.closest('.search-suggestions') === null &&
        event.target.closest('.product-search-input') === null
      ) {
        setShowSuggestions(false);
      }
    };
    if (showSuggestions) {
      document.addEventListener('mousedown', handler);
    }
    return () => document.removeEventListener('mousedown', handler);
  }, [showSuggestions]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.scrollY < 20) setShowMobileSearch(true);
      else if (window.scrollY > lastScrollY) setShowMobileSearch(false);
      else setShowMobileSearch(true);
      lastScrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;

      try {
        const token = await currentUser.getIdToken();

        const [wishlistRes, cartRes] = await Promise.all([
          axios.get(`/api/wishlist`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/api/cart`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setWishlistCount(wishlistRes.data.length);
        setCartItems(cartRes.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleUserClick = (e) => {
    e.preventDefault();
    if (!currentUser) window.location.href = '/login';
    else window.location.href = '/profile';
  };

  const handleProductClick = (productId) => {
    setShowSuggestions(false);
    window.location.assign(`/product/${productId}`);
  };

  // Search Suggestions Dropdown
  const renderSearchSuggestions = () =>
    (searchQuery && showSuggestions) ? (
      <div className="search-suggestions absolute left-0 right-0 top-full z-50 bg-white border border-gray-200 rounded-b-xl shadow-lg"
        style={{ minWidth: '100%' }}>
        {searchResults.length > 0 ? (
          <ul>
            {searchResults.map((product) => (
              <li
                key={product._id || product.id}
                className="px-4 py-2 hover:bg-gray-100 flex items-center border-b border-gray-100 last:border-b-0"
              >
                <div
                  className="flex items-center w-full cursor-pointer"
                  onClick={() => handleProductClick(product._id || product.id)}
                  tabIndex={0}
                >
                  {product.images && product.images[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-10 h-10 object-cover rounded mr-3 border"
                    />
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-gray-800 truncate">{product.title}</span>
                    {product.badgeText && (
                      <span
                        className={`mt-0.5 text-xs px-2 py-0.5 rounded ${product.badgeClass || 'bg-red-500 text-white'}`}
                      >
                        {product.badgeText}
                      </span>
                    )}
                  </div>
                  <span className="ml-auto text-sm text-gray-600 font-light whitespace-nowrap">
                    ₹{product.price}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-4 text-center text-gray-600 select-none">
            No products found
          </div>
        )}
      </div>
    ) : null;

  return (
    <>
      <header className="fixed top-8 left-0 w-full bg-white shadow-md z-40">
        <div className="flex flex-col items-center justify-center px-4 py-4">
          <div className="flex items-center justify-center w-full max-w-7xl">
            <a href="/" className="flex items-center">
              <img src="/logo-black.png" alt="Logo" className="h-12 w-auto" />
            </a>

            {/* Desktop Search Bar */}
            <div className="hidden lg:flex flex-grow justify-center px-4">
              <div className="relative w-[800px] max-w-full">
                <div className="bg-gray-200 rounded-full flex items-center px-4 py-3 shadow-md w-full">
                  <FaSearch className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Search for products..."
                    className="w-full outline-none text-sm bg-transparent placeholder-gray-500 product-search-input"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => {
                      if (searchResults.length > 0 || searchQuery.length > 0) setShowSuggestions(true);
                    }}
                  />
                </div>
                {renderSearchSuggestions()}
              </div>
            </div>

            <div className="flex items-center space-x-6 ml-auto">
              <a href="/wishlist" className="relative hover:text-indigo-600 lg:text-2xl">
                <FaHeart />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </a>
              <a href="/cart" className="relative hover:text-indigo-600 lg:text-2xl">
                <FaShoppingBag />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </a>
              <a
                href="/profile"
                onClick={handleUserClick}
                className="hover:text-indigo-600 lg:text-2xl"
              >
                <FaUser />
              </a>
              <button
                className="lg:hidden text-2xl text-gray-700"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {showMobileSearch && (
            <div className="block lg:hidden mt-4 w-full px-4">
              <div className="relative max-w-md mx-auto w-full">
                <div className="bg-white border-2 border-black rounded-full flex items-center px-4 py-2 shadow-md w-full">
                  <FaSearch className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Search for products..."
                    className="w-full outline-none text-sm bg-transparent placeholder-gray-500 product-search-input"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => {
                      if (searchResults.length > 0 || searchQuery.length > 0) setShowSuggestions(true);
                    }}
                  />
                </div>
                {renderSearchSuggestions()}
              </div>
            </div>
          )}

          <nav className="hidden lg:flex justify-center mt-3 space-x-12 text-gray-700 text-lg font-thin">
            <a href="/" className="hover:text-indigo-600">
              Home
            </a>
            <a href="/shop" className="hover:text-indigo-600">
              Shop
            </a>
            <a href="/mens" className="hover:text-indigo-600">
              Men
            </a>
            <a href="/womens" className="hover:text-indigo-600">
              Women
            </a>
            <a href="/about" className="hover:text-indigo-600">
              About Us
            </a>
            <a href="/contact" className="hover:text-indigo-600">
              Contact Us
            </a>
          </nav>
        </div>
      </header>

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="text-lg font-semibold text-gray-800">Menu</span>
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <FaTimes className="text-gray-700 text-xl hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
        <nav className="flex flex-col p-4 space-y-4 text-gray-700 text-md font-thin">
          <a href="/" className="hover:text-indigo-600">Home</a>
          <a href="/shop" className="hover:text-indigo-600">Shop</a>
          <a href="/mens" className="hover:text-indigo-600">Men</a>
          <a href="/womens" className="hover:text-indigo-600">Women</a>
          <a href="/about" className="hover:text-indigo-600">About Us</a>
          <a href="/contact" className="hover:text-indigo-600">Contact Us</a>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
