import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {

  return (
    <div className="bg-white text-gray-800 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Main Heading with Italiana Font */}
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl sm:text-4xl lg:text-5xl mb-2 text-center text-gray-800 font-medium"
          style={{ fontFamily: "'Italiana', serif" }}
        >
          Contact Us
        </motion.h1>

        {/* Decorative Line */}
        <div className="flex justify-center items-center mb-8 sm:mb-12">
          <img
            src="./title-line.png"
            alt="Decorative underline"
            className="h-4 sm:h-6 md:h-8 lg:h-10 max-w-full object-contain"
          />
        </div>

        {/* Stay Connected Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="bg-gray-50 border-2 border-gray-300 p-8 rounded-lg text-center">
            <h2 
              className="text-2xl sm:text-3xl font-semibold mb-4 text-gray-800"
              style={{ fontFamily: "'Italiana', serif" }}
            >
              Stay Connected
            </h2>
            <p className="text-gray-600 mb-6">
              Follow us on social media for the latest updates, new collections, and jewelry care tips.
            </p>
            
            <div className="flex justify-center space-x-6 mb-8">
              <a href="https://www.facebook.com/share/1CgAGNEJeH/" className="text-gray-600 hover:text-red-600 transition-colors duration-300" target="_blank" rel="noopener noreferrer">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12a10 10 0 10-11.63 9.87v-6.99h-2.8v-2.88h2.8V9.41c0-2.76 1.64-4.29 4.16-4.29 1.2 0 2.46.22 2.46.22v2.7h-1.38c-1.36 0-1.79.85-1.79 1.72v2.07h3.04l-.49 2.88h-2.55v6.99A10 10 0 0022 12z" />
                </svg>
              </a>
              <a href="https://instagram.com" className="text-gray-600 hover:text-red-600 transition-colors duration-300" target="_blank" rel="noopener noreferrer">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 2A3.75 3.75 0 004 7.75v8.5A3.75 3.75 0 007.75 20h8.5a3.75 3.75 0 003.75-3.75v-8.5A3.75 3.75 0 0016.25 4h-8.5zM12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm4.5-3a1 1 0 110 2 1 1 0 010-2z" />
                </svg>
              </a>
              
            </div>
            
            {/* Email Section */}
            <div className="border-t border-gray-300 pt-6 mt-6">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <span className="text-2xl">📧</span>
                <h3 className="text-xl font-semibold text-gray-800" style={{ fontFamily: "'Italiana', serif" }}>
                  Email Us
                </h3>
              </div>
              <a href="mailto:snatchers.shop@gmail.com" className="text-lg text-red-600 hover:text-red-700 font-medium transition-colors duration-300">
                snatchers.shop@gmail.com
              </a>
            </div>

            {/* Address Section */}
            <div className="border-t border-gray-300 pt-6 mt-6">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <span className="text-2xl">📍</span>
                <h3 className="text-xl font-semibold text-gray-800" style={{ fontFamily: "'Italiana', serif" }}>
                  Our Location
                </h3>
              </div>
              <p className="text-lg text-gray-700 font-medium">
                Bhubaneswar
              </p>
            </div>
            
            <p className="text-sm text-gray-500 mt-6">
              Tag us in your jewelry photos with #SnatchersJewelry for a chance to be featured!
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Contact;

