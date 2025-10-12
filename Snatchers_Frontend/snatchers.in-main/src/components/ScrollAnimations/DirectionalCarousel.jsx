import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const DirectionalCarousel = ({ 
  children, 
  reverseDirection = false,
  speed = 0.5,
  stiffness = 100,
  damping = 30,
  className = ''
}) => {
  const containerRef = useRef(null);
  const [scrollDirection, setScrollDirection] = useState('down');
  const [lastScrollY, setLastScrollY] = useState(0);

  // Track scroll direction
  useEffect(() => {
    let ticking = false;

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up');
      setLastScrollY(currentScrollY);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Get scroll progress for this component
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Create all transforms at the top level
  const baseMovement = useTransform(scrollYProgress, [0, 1], [0, 100 * speed]);
  
  const reverseMovement = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -100 * speed]
  );

  const directionalMovement = useTransform(
    scrollYProgress,
    [0, 1],
    scrollDirection === 'down' 
      ? [0, 100 * speed] 
      : [0, -50 * speed]
  );

  // Apply spring physics
  const springBase = useSpring(baseMovement, { stiffness, damping, restDelta: 0.001 });
  const springReverse = useSpring(reverseMovement, { stiffness, damping, restDelta: 0.001 });
  const springDirectional = useSpring(directionalMovement, { stiffness, damping, restDelta: 0.001 });

  // Select the appropriate transform
  const x = reverseDirection ? springReverse : springDirectional;

  return (
    <motion.div
      ref={containerRef}
      style={{ x }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default DirectionalCarousel;
