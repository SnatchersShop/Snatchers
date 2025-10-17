import React, { useState, useEffect } from 'react';
import { FaBars, FaHeart, FaSearch, FaShoppingBag, FaTimes, FaUser } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const MobileNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.scrollY < 20) {
        setShowMobileSearch(true);
      } else if (window.scrollY > lastScrollY) {
        setShowMobileSearch(false);
      } else {
        setShowMobileSearch(true);
      }
      lastScrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="flex items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center h-full">
          <img src="/logo-black.png" alt="Logo" className="h-10 w-auto" />
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-3">
          <button className="hover:text-indigo-600">
            <FaHeart />
          </button>
          <button className="hover:text-indigo-600">
            <FaShoppingBag />
          </button>
          <button
            onClick={() => (currentUser ? navigate('/profile') : navigate('/login'))}
            className="hover:text-indigo-600"
            aria-label="profile"
          >
            <FaUser />
          </button>
          <button
            className="text-2xl text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      {showMobileSearch && (
        <div className="mt-4 w-full px-4">
          <div className="bg-white border-2 border-black rounded-full flex items-center px-4 py-2 shadow-md mx-auto max-w-md">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full outline-none text-sm bg-transparent placeholder-gray-500"
            />
          </div>
        </div>
      )}

      {/* Background Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* Slide-in Menu */}
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
        <nav className="flex flex-col p-4 space-y-4 text-gray-700 text-sm font-medium">
          <a href="/" className="hover:text-indigo-600">Home</a>
          <a href="/shop" className="hover:text-indigo-600">Shop</a>
          <a href="/mens" className="hover:text-indigo-600">Men</a>
          <a href="/womens" className="hover:text-indigo-600">Women</a>
          <a href="/about" className="hover:text-indigo-600">Contact Us</a>
        </nav>
      </div>
    </>
  );
};

export default MobileNavbar;
