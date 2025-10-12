import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const ParallaxImage = ({ 
  children, 
  speed = 0.5,
  direction = 'up',
  className = '',
  offset = ['start end', 'end start'],
  stiffness = 120,
  damping = 35,
  mass = 0.8,
  enableRotation = true,
  rotationSpeed = 0.1
}) => {
  const { scrollYProgress } = useScroll({
    offset
  });

  // Define transforms based on direction with spring physics
  const yUp = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -100 * speed]),
    { stiffness, damping, mass }
  );
  const yDown = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 100 * speed]),
    { stiffness, damping, mass }
  );
  const xLeft = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -100 * speed]),
    { stiffness, damping, mass }
  );
  const xRight = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 100 * speed]),
    { stiffness, damping, mass }
  );

  // Add subtle rotation for more dynamic feel
  const rotation = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [0, rotationSpeed, 0]),
    { stiffness: 80, damping: 25 }
  );

  // Add scale effect for depth
  const scale = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.02, 1]),
    { stiffness: 100, damping: 30 }
  );

  // Get the appropriate transform based on direction
  const getTransformValues = () => {
    const baseTransforms = {
      y: 0,
      x: 0,
      rotate: enableRotation ? rotation : 0,
      scale: scale
    };

    switch (direction) {
      case 'up':
        return { ...baseTransforms, y: yUp };
      case 'down':
        return { ...baseTransforms, y: yDown };
      case 'left':
        return { ...baseTransforms, x: xLeft };
      case 'right':
        return { ...baseTransforms, x: xRight };
      default:
        return { ...baseTransforms, y: yUp };
    }
  };

  const transformValues = getTransformValues();

  return (
    <motion.div
      style={{
        ...transformValues,
        transformOrigin: "center center"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxImage;
