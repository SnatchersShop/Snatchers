import React from 'react';
import { motion, useScroll } from 'framer-motion';

const ScrollProgress = ({ 
  color = '#d82e2e', 
  height = '4px',
  position = 'top',
  className = ''
}) => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className={`fixed ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 z-50 ${className}`}
      style={{ height }}
    >
      <motion.div
        className="w-full h-full origin-left"
        style={{
          scaleX: scrollYProgress,
          backgroundColor: color,
        }}
      />
    </motion.div>
  );
};

export default ScrollProgress;
