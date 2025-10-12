import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const RevealOnScroll = ({ 
  children, 
  direction = 'up',
  distance = 50,
  duration = 0.6,
  delay = 0,
  className = '',
  threshold = 0.1,
  once = true
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    threshold, 
    once,
    margin: "-100px 0px -100px 0px"
  });

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance, opacity: 0 };
      case 'down':
        return { y: -distance, opacity: 0 };
      case 'left':
        return { x: distance, opacity: 0 };
      case 'right':
        return { x: -distance, opacity: 0 };
      case 'scale':
        return { scale: 0.8, opacity: 0 };
      case 'rotate':
        return { rotate: 15, opacity: 0 };
      default:
        return { y: distance, opacity: 0 };
    }
  };

  const getFinalPosition = () => {
    switch (direction) {
      case 'up':
      case 'down':
        return { y: 0, opacity: 1 };
      case 'left':
      case 'right':
        return { x: 0, opacity: 1 };
      case 'scale':
        return { scale: 1, opacity: 1 };
      case 'rotate':
        return { rotate: 0, opacity: 1 };
      default:
        return { y: 0, opacity: 1 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitialPosition()}
      animate={isInView ? getFinalPosition() : getInitialPosition()}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default RevealOnScroll;
