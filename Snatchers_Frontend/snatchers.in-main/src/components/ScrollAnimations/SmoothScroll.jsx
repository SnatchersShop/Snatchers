import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const SmoothScroll = ({ 
  children, 
  className = '',
  stiffness = 100,
  damping = 30,
  mass = 0.8,
  enabled = true
}) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    
    // Enhanced smooth scrolling with momentum
    const handleWheel = (e) => {
      e.preventDefault();
      
      const delta = e.deltaY;
      const momentum = Math.min(Math.abs(delta) / 100, 3); // Cap momentum
      
      // Smooth scroll with easing
      container.scrollBy({
        top: delta * momentum,
        behavior: 'smooth'
      });
    };

    // Add passive listeners for better performance
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [enabled]);

  // Create smooth transform based on scroll progress
  const smoothY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -100]),
    { stiffness, damping, mass }
  );

  return (
    <motion.div
      ref={containerRef}
      style={{ y: enabled ? smoothY : 0 }}
      className={`smooth-scroll-container ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default SmoothScroll;


