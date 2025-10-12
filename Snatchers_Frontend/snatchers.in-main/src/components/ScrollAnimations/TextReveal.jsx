import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const TextReveal = ({ 
  text, 
  className = '',
  delay = 0.1,
  threshold = 0.1,
  animationType = 'word' // 'word', 'letter', 'line'
}) => {
  const [ref, isVisible] = useScrollAnimation(threshold);

  const getTextArray = () => {
    if (animationType === 'letter') {
      return text.split('');
    } else if (animationType === 'word') {
      return text.split(' ');
    } else {
      return text.split('\n');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delay,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const textArray = getTextArray();

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className={className}
    >
      {textArray.map((item, index) => (
        <motion.span
          key={index}
          variants={itemVariants}
          style={{ display: 'inline-block' }}
        >
          {item}
          {animationType === 'word' && index < textArray.length - 1 && ' '}
          {animationType === 'line' && index < textArray.length - 1 && <br />}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default TextReveal;
