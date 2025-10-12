import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

const StickyScroll = ({ 
  children, 
  className = '',
  stickyClassName = '',
  startOffset = 0,
  endOffset = 0
}) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useSpring(
    useTransform(
      scrollYProgress,
      [0, 1],
      [startOffset, endOffset]
    ),
    { stiffness: 100, damping: 30 }
  );

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <motion.div
        style={{ y }}
        className={`sticky top-0 ${stickyClassName}`}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default StickyScroll;
