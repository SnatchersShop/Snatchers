import React from 'react';
import { FaSearch, FaHeart, FaShoppingBag, FaTrashAlt, FaUser } from 'react-icons/fa';

const DesktopNavbar = () => {
  return (
    <>
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <div className="flex items-center h-full mr-0">
          <img src="/logo-black.png" alt="Logo" className="h-12 w-auto" />
        </div>

        {/* Search Bar */}
        <div className="flex-grow flex justify-center px-4">
          <div className="bg-gray-200 rounded-full flex items-center px-4 py-2 shadow-md w-[800px] max-w-full">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full outline-none text-sm bg-transparent placeholder-gray-500"
            />
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-3 ml-auto">
          <button className="hover:text-indigo-600">
            <FaHeart />
          </button>

          <div className="relative group">
            <button className="relative hover:text-indigo-600">
              <FaShoppingBag />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                3
              </span>
            </button>
            <div className="absolute right-0 mt-3 w-80 bg-white border shadow-lg p-4 hidden group-hover:block z-50">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 mb-4">
                  <img
                    src={`/assets/img/product-${i + 1}.jpg`}
                    alt="Product"
                    className="w-12 h-12 object-cover"
                  />
                  <div>
                    <h2 className="text-sm font-medium">Product Name {i + 1}</h2>
                    <p className="text-sm text-gray-600">
                      {3 - i} × ₹{(i + 1) * 50}
                    </p>
                  </div>
                  <button>
                    <FaTrashAlt className="text-red-600" />
                  </button>
                </div>
              ))}
              <a
                href="/checkout.html"
                className="block w-full text-center bg-red-600 text-white py-2 rounded hover:bg-indigo-700"
              >
                Checkout
              </a>
            </div>
          </div>

          <a href="/profile" className="hover:text-indigo-600">
            <FaUser />
          </a>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex justify-center mt-3 space-x-14 text-gray-700 text-lg font-thin">
        <a href="/" className="hover:text-indigo-600">Home</a>
        <a href="/shop" className="hover:text-indigo-600">Shop</a>
        <a href="/mens" className="hover:text-indigo-600">Men</a>
        <a href="/womens" className="hover:text-indigo-600">Women</a>
        <a href="/about" className="hover:text-indigo-600">Contact Us</a>
        <a href="/" className="hover:text-indigo-600">Home</a>
        <a href="/shop" className="hover:text-indigo-600">Shop</a>
        <a href="/mens" className="hover:text-indigo-600">Men</a>
        <a href="/womens" className="hover:text-indigo-600">Women</a>
        <a href="/about" className="hover:text-indigo-600">Contact Us</a>
      </nav>
    </>
  );
};

export default DesktopNavbar;
