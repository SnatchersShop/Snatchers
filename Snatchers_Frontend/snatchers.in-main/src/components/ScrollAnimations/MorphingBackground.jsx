import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const MorphingBackground = ({ 
  children, 
  className = '',
  color1 = '#ffffff',
  color2 = '#f3f4f6',
  color3 = '#e5e7eb',
  morphSpeed = 0.5
}) => {
  const { scrollYProgress } = useScroll();
  
  const background = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [color1, color2, color3]
  );

  const borderRadius = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['0%', '50%', '0%']
  );

  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1, 1.1, 1]
  );

  return (
    <motion.div
      style={{
        background,
        borderRadius,
        scale
      }}
      className={`transition-all duration-700 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default MorphingBackground;
