import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const ElasticScroll = ({ 
  children, 
  className = '',
  stiffness = 300,
  damping = 25,
  mass = 1,
  overshoot = 0.3
}) => {
  const containerRef = useRef(null);
  const scrollY = useMotionValue(0);
  const maxScroll = useMotionValue(0);
  const overscroll = useMotionValue(0);

  // Elastic spring for overscroll
  const elasticY = useSpring(overscroll, {
    stiffness,
    damping,
    mass,
    restDelta: 0.001
  });

  // Transform to create elastic boundaries
  const elasticTransform = useTransform(
    [scrollY, elasticY],
    ([scroll, elastic]) => {
      const baseScroll = scroll;
      const elasticEffect = elastic * overshoot;
      return baseScroll + elasticEffect;
    }
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isScrolling = false;
    let scrollTimeout;

    const handleScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
        overscroll.set(0); // Reset overscroll when scrolling stops
      }, 150);

      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      
      scrollY.set(scrollTop);
      maxScroll.set(scrollHeight - clientHeight);

      // Calculate overscroll
      if (scrollTop < 0) {
        // Overscroll at top
        overscroll.set(scrollTop * 0.5);
      } else if (scrollTop > scrollHeight - clientHeight) {
        // Overscroll at bottom
        overscroll.set((scrollTop - (scrollHeight - clientHeight)) * 0.5);
      } else {
        overscroll.set(0);
      }
    };

    const handleWheel = (e) => {
      e.preventDefault();
      
      const delta = e.deltaY;
      const currentScroll = container.scrollTop;
      const maxScrollValue = container.scrollHeight - container.clientHeight;
      
      // Check boundaries and apply elastic resistance
      if (currentScroll <= 0 && delta < 0) {
        // At top, scrolling up
        const resistance = Math.pow(Math.abs(currentScroll) / 100 + 1, 0.5);
        container.scrollTop = currentScroll + (delta * 0.3) / resistance;
        e.preventDefault();
      } else if (currentScroll >= maxScrollValue && delta > 0) {
        // At bottom, scrolling down
        const overscrollAmount = currentScroll - maxScrollValue;
        const resistance = Math.pow(overscrollAmount / 100 + 1, 0.5);
        container.scrollTop = currentScroll + (delta * 0.3) / resistance;
        e.preventDefault();
      } else {
        // Normal scrolling
        container.scrollTop = currentScroll + delta * 0.8;
        e.preventDefault();
      }
    };

    // Touch handling for mobile elastic scrolling
    let startY = 0;
    let startScrollTop = 0;
    let isTouchScrolling = false;

    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY;
      startScrollTop = container.scrollTop;
      isTouchScrolling = true;
    };

    const handleTouchMove = (e) => {
      if (!isTouchScrolling) return;
      
      const currentY = e.touches[0].clientY;
      const deltaY = startY - currentY;
      const newScrollTop = startScrollTop + deltaY;
      
      // Apply elastic resistance at boundaries
      const maxScrollValue = container.scrollHeight - container.clientHeight;
      
      if (newScrollTop < 0) {
        // Elastic at top
        const elasticAmount = Math.abs(newScrollTop) * 0.3;
        container.scrollTop = -elasticAmount;
      } else if (newScrollTop > maxScrollValue) {
        // Elastic at bottom
        const overscrollAmount = newScrollTop - maxScrollValue;
        const elasticAmount = overscrollAmount * 0.3;
        container.scrollTop = maxScrollValue + elasticAmount;
      } else {
        container.scrollTop = newScrollTop;
      }
    };

    const handleTouchEnd = () => {
      isTouchScrolling = false;
      // Snap back to boundaries
      if (container.scrollTop < 0) {
        container.scrollTop = 0;
      } else if (container.scrollTop > container.scrollHeight - container.clientHeight) {
        container.scrollTop = container.scrollHeight - container.clientHeight;
      }
    };

    // Event listeners
    container.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      clearTimeout(scrollTimeout);
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [overscroll, scrollY, maxScroll]);

  return (
    <motion.div
      ref={containerRef}
      style={{ 
        y: elasticTransform
      }}
      className={`elastic-scroll-container ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default ElasticScroll;

