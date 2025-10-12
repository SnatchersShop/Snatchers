import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const ScrollBasedCarousel = ({ 
  children, 
  direction = 'right', // 'left', 'right', 'alternating'
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

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY;
      
      setScrollDirection(deltaY > 0 ? 'down' : 'up');
      setScrollVelocity(Math.abs(deltaY));
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
  
  const alternatingMovement = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    scrollDirection === 'down' 
      ? [0, 50 * speed, 100 * speed] 
      : [0, -50 * speed, -100 * speed]
  );
  
  const leftMovement = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);
  
  const velocityEnhancement = useTransform(
    scrollYProgress,
    [0, 1],
    [0, scrollVelocity * 0.1]
  );

  // Apply spring physics to all transforms
  const springBase = useSpring(baseMovement, { stiffness, damping, restDelta: 0.001 });
  const springAlternating = useSpring(alternatingMovement, { stiffness, damping, restDelta: 0.001 });
  const springLeft = useSpring(leftMovement, { stiffness, damping, restDelta: 0.001 });
  const springVelocity = useSpring(velocityEnhancement, { stiffness, damping, restDelta: 0.001 });

  // Select the appropriate transform based on direction
  const getSelectedTransform = () => {
    if (direction === 'alternating') {
      return springAlternating;
    } else if (direction === 'left') {
      return springLeft;
    } else {
      return springBase;
    }
  };

  const x = getSelectedTransform();

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

export default ScrollBasedCarousel;
