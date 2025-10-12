import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const ScrollReveal = ({ 
  children, 
  direction = 'up', 
  distance = 50, 
  duration = 0.6, 
  delay = 0,
  threshold = 0.1,
  className = ''
}) => {
  const [ref, isVisible] = useScrollAnimation(threshold);

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
      x: direction === 'left' ? distance : direction === 'right' ? -distance : 0,
      scale: direction === 'scale' ? 0.8 : 1,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 1,
        delay,
        opacity: {
          duration: duration * 0.8,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
        y: {
          type: "spring",
          stiffness: 120,
          damping: 25,
          delay: delay + 0.1,
        },
        x: {
          type: "spring",
          stiffness: 120,
          damping: 25,
          delay: delay + 0.1,
        },
        scale: {
          type: "spring",
          stiffness: 100,
          damping: 15,
          delay: delay + 0.05,
        },
        filter: {
          duration: duration * 0.6,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: delay + 0.2,
        },
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
