import React from 'react';
import { motion } from 'framer-motion';

const AnimatedHeading = ({ heading, subheading }) => {
  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-3xl sm:text-4xl mt-4 lg:text-6xl mb-2 text-center text-gray-800 font-medium"
        style={{ fontFamily: "'Italiana', serif" }}
      >
        {heading}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center text-sm sm:text-base text-gray-500 italic mb-6 sm:mb-8"
      >
        {subheading}
      </motion.p>
    </div>
  );
};

export default AnimatedHeading;
