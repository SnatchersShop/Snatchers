import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const DebugScrollReveal = ({ children, direction = 'up', distance = 50 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      console.log('Scroll Y:', window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log('Intersection observed:', entry.isIntersecting);
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('[data-debug-reveal]');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <div data-debug-reveal style={{ minHeight: '100vh', padding: '20px' }}>
      <div style={{ position: 'fixed', top: '10px', right: '10px', background: 'black', color: 'white', padding: '10px', zIndex: 9999 }}>
        <div>Scroll Y: {scrollY}</div>
        <div>Is Visible: {isVisible ? 'Yes' : 'No'}</div>
      </div>
      
      <motion.div
        initial={{
          opacity: 0,
          y: direction === 'up' ? distance : 0,
          x: direction === 'left' ? distance : direction === 'right' ? -distance : 0,
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          y: isVisible ? 0 : (direction === 'up' ? distance : 0),
          x: isVisible ? 0 : (direction === 'left' ? distance : direction === 'right' ? -distance : 0),
        }}
        transition={{
          duration: 0.6,
          ease: "easeOut"
        }}
        style={{
          background: isVisible ? '#4ade80' : '#ef4444',
          padding: '20px',
          borderRadius: '8px',
          margin: '20px 0',
        }}
      >
        <h2>Debug Scroll Reveal</h2>
        <p>This should change color when scrolled into view</p>
        {children}
      </motion.div>
    </div>
  );
};

export default DebugScrollReveal;


