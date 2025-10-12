import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ScaleOnScroll = ({ 
  children, 
  className = '',
  scaleRange = [0.8, 1.2],
  triggerPoint = 0.5
}) => {
  const { scrollYProgress } = useScroll();
  
  const scale = useTransform(
    scrollYProgress,
    [0, triggerPoint, 1],
    scaleRange
  );

  return (
    <motion.div
      style={{ scale }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScaleOnScroll;
