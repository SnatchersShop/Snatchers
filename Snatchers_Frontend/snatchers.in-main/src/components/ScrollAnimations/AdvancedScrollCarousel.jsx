import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const AdvancedScrollCarousel = ({ 
  children, 
  movementType = 'parallax', // 'parallax', 'wave', 'spiral', 'opposite'
  speed = 0.5,
  stiffness = 100,
  damping = 30,
  className = ''
}) => {
  const containerRef = useRef(null);
  const [scrollDirection, setScrollDirection] = useState('down');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);

  // Track scroll direction and velocity
  useEffect(() => {
    let ticking = false;

    const updateScrollData = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY;
      
      setScrollDirection(deltaY > 0 ? 'down' : 'up');
      setScrollVelocity(Math.abs(deltaY));
      setLastScrollY(currentScrollY);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollData);
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
  const parallaxTransform = useTransform(scrollYProgress, [0, 1], [0, 100 * speed]);
  
  const waveTransform = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [0, 50 * speed, -50 * speed, 50 * speed, 0]
  );
  
  const spiralX = useTransform(scrollYProgress, [0, 1], [0, 100 * speed]);
  const spiralY = useTransform(scrollYProgress, [0, 1], [0, 50 * speed]);
  const spiralRotate = useTransform(scrollYProgress, [0, 1], [0, 180]);
  
  const oppositeTransform = useTransform(
    scrollYProgress,
    [0, 1],
    scrollDirection === 'down' 
      ? [0, 100 * speed] 
      : [0, -100 * speed]
  );

  // Apply spring physics to all transforms
  const springParallax = useSpring(parallaxTransform, { stiffness, damping });
  const springWave = useSpring(waveTransform, { stiffness, damping });
  const springSpiralX = useSpring(spiralX, { stiffness, damping });
  const springSpiralY = useSpring(spiralY, { stiffness, damping });
  const springSpiralRotate = useSpring(spiralRotate, { stiffness, damping });
  const springOpposite = useSpring(oppositeTransform, { stiffness, damping });

  // Select the appropriate transform based on movement type
  const getSpringTransform = () => {
    switch (movementType) {
      case 'parallax':
        return springParallax;
      case 'wave':
        return springWave;
      case 'spiral':
        return { x: springSpiralX, y: springSpiralY, rotate: springSpiralRotate };
      case 'opposite':
        return springOpposite;
      default:
        return springParallax;
    }
  };

  const springTransform = getSpringTransform();

  return (
    <motion.div
      ref={containerRef}
      style={springTransform}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AdvancedScrollCarousel;
