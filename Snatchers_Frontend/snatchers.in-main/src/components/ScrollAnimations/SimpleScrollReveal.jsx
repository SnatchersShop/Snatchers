import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const SimpleScrollReveal = ({ 
  children, 
  direction = 'up', 
  distance = 50, 
  duration = 0.6,
  delay = 0,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log('SimpleScrollReveal - Element visible:', entry.isIntersecting);
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
      console.log('SimpleScrollReveal - Observer attached to element');
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const getInitialStyle = () => {
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
      default:
        return { y: distance, opacity: 0 };
    }
  };

  const getFinalStyle = () => {
    switch (direction) {
      case 'up':
      case 'down':
        return { y: 0, opacity: 1 };
      case 'left':
      case 'right':
        return { x: 0, opacity: 1 };
      case 'scale':
        return { scale: 1, opacity: 1 };
      default:
        return { y: 0, opacity: 1 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitialStyle()}
      animate={isVisible ? getFinalStyle() : getInitialStyle()}
      transition={{
        duration,
        delay,
        ease: "easeOut"
      }}
      className={className}
      style={{
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </motion.div>
  );
};

export default SimpleScrollReveal;


