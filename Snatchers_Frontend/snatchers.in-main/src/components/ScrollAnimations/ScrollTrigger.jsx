import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const ScrollTrigger = ({ 
  children, 
  trigger = 0.5,
  className = '',
  onTrigger = () => {},
  animationType = 'scale',
  animationValue = 1.1
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const scale = useSpring(
    useTransform(scrollYProgress, [0, trigger, 1], [1, animationValue, 1]),
    { stiffness: 100, damping: 30 }
  );

  const opacity = useSpring(
    useTransform(scrollYProgress, [0, trigger, 1], [0.5, 1, 0.5]),
    { stiffness: 100, damping: 30 }
  );

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (latest >= trigger && latest < 1) {
        onTrigger();
      }
    });

    return unsubscribe;
  }, [scrollYProgress, trigger, onTrigger]);

  const getAnimationStyle = () => {
    switch (animationType) {
      case 'scale':
        return { scale };
      case 'opacity':
        return { opacity };
      case 'both':
        return { scale, opacity };
      default:
        return { scale };
    }
  };

  return (
    <motion.div
      ref={ref}
      style={getAnimationStyle()}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollTrigger;
