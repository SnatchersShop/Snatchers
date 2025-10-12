import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const ParallaxSection = ({ 
  children, 
  speed = 0.5, 
  className = '',
  direction = 'up',
  stiffness = 100,
  damping = 30,
  mass = 0.8
}) => {
  const { scrollYProgress } = useScroll();
  
  const rawY = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'up' ? [0, -100 * speed] : [0, 100 * speed]
  );

  // Apply spring physics for smoother motion
  const y = useSpring(rawY, {
    stiffness,
    damping,
    mass,
  });

  // Add subtle rotation for more dynamic feel
  const rotate = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 0]),
    { stiffness: 80, damping: 25 }
  );

  return (
    <motion.div
      style={{ 
        y,
        rotate,
        transformOrigin: "center center"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxSection;
