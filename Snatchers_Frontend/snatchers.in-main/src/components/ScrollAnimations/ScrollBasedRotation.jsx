import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ScrollBasedRotation = ({ 
  children, 
  rotationRange = [0, 360],
  className = '',
  speed = 1
}) => {
  const { scrollYProgress } = useScroll();
  
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    rotationRange.map(deg => deg * speed)
  );

  return (
    <motion.div
      style={{ rotate }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollBasedRotation;
