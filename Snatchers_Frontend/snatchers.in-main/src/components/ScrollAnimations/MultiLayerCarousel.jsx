import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const MultiLayerCarousel = ({ 
  children, 
  layers = 2,
  baseSpeed = 0.3,
  speedMultiplier = 0.5,
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

  // Create transforms for each layer (limited to max 3 layers for performance)
  const maxLayers = Math.min(layers, 3);
  
  const layer0Speed = baseSpeed + (0 * speedMultiplier);
  const layer0Direction = 0 % 2 === 0 ? 1 : -1;
  const layer0Transform = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 100 * layer0Speed * layer0Direction]
  );
  const springLayer0 = useSpring(layer0Transform, {
    stiffness: stiffness - (0 * 10),
    damping: damping + (0 * 5),
    restDelta: 0.001
  });

  const layer1Speed = baseSpeed + (1 * speedMultiplier);
  const layer1Direction = 1 % 2 === 0 ? 1 : -1;
  const layer1Transform = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 100 * layer1Speed * layer1Direction]
  );
  const springLayer1 = useSpring(layer1Transform, {
    stiffness: stiffness - (1 * 10),
    damping: damping + (1 * 5),
    restDelta: 0.001
  });

  const layer2Speed = baseSpeed + (2 * speedMultiplier);
  const layer2Direction = 2 % 2 === 0 ? 1 : -1;
  const layer2Transform = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 100 * layer2Speed * layer2Direction]
  );
  const springLayer2 = useSpring(layer2Transform, {
    stiffness: stiffness - (2 * 10),
    damping: damping + (2 * 5),
    restDelta: 0.001
  });

  const layerTransforms = [springLayer0, springLayer1, springLayer2].slice(0, maxLayers);

  return (
    <div ref={containerRef} className="relative">
      {Array.from({ length: layers }).map((_, layerIndex) => (
        <motion.div
          key={layerIndex}
          style={{ 
            x: layerTransforms[layerIndex],
            opacity: 1 - (layerIndex * 0.2), // Fade layers
            zIndex: layers - layerIndex
          }}
          className={`absolute inset-0 ${className}`}
        >
          {layerIndex === 0 ? children : null}
        </motion.div>
      ))}
    </div>
  );
};

export default MultiLayerCarousel;
