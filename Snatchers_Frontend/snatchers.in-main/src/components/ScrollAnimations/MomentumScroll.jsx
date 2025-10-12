import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const MomentumScroll = ({ 
  children, 
  className = '',
  friction = 0.95,
  sensitivity = 1,
  maxSpeed = 50
}) => {
  const containerRef = useRef(null);
  const velocityX = useMotionValue(0);
  const velocityY = useMotionValue(0);
  const positionX = useMotionValue(0);
  const positionY = useMotionValue(0);
  
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const lastTime = useRef(Date.now());

  // Smooth spring animations for position
  const smoothX = useSpring(positionX, { 
    stiffness: 100, 
    damping: 30, 
    mass: 0.8 
  });
  const smoothY = useSpring(positionY, { 
    stiffness: 100, 
    damping: 30, 
    mass: 0.8 
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrame;
    
    // Momentum update loop
    const updateMomentum = () => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTime.current) / 1000;
      
      if (deltaTime > 0) {
        // Apply friction
        velocityX.set(velocityX.get() * Math.pow(friction, deltaTime * 60));
        velocityY.set(velocityY.get() * Math.pow(friction, deltaTime * 60));
        
        // Update position
        positionX.set(positionX.get() + velocityX.get() * deltaTime * sensitivity);
        positionY.set(positionY.get() + velocityY.get() * deltaTime * sensitivity);
        
        // Stop very small movements
        if (Math.abs(velocityX.get()) < 0.1) velocityX.set(0);
        if (Math.abs(velocityY.get()) < 0.1) velocityY.set(0);
      }
      
      lastTime.current = currentTime;
      animationFrame = requestAnimationFrame(updateMomentum);
    };

    updateMomentum();

    const handleMouseDown = (e) => {
      setIsDragging(true);
      lastMousePosition.current = { x: e.clientX, y: e.clientY };
      velocityX.set(0);
      velocityY.set(0);
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - lastMousePosition.current.x;
      const deltaY = e.clientY - lastMousePosition.current.y;
      
      // Update position directly during drag
      positionX.set(positionX.get() + deltaX * sensitivity);
      positionY.set(positionY.get() + deltaY * sensitivity);
      
      lastMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = (e) => {
      if (!isDragging) return;
      setIsDragging(false);
      
      const deltaTime = 0.016; // ~60fps
      const deltaX = e.clientX - lastMousePosition.current.x;
      const deltaY = e.clientY - lastMousePosition.current.y;
      
      // Set velocity based on final movement
      velocityX.set(Math.max(-maxSpeed, Math.min(maxSpeed, deltaX * sensitivity * 10)));
      velocityY.set(Math.max(-maxSpeed, Math.min(maxSpeed, deltaY * sensitivity * 10)));
    };

    // Touch support
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        setIsDragging(true);
        lastMousePosition.current = { x: touch.clientX, y: touch.clientY };
        velocityX.set(0);
        velocityY.set(0);
      }
    };

    const handleTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - lastMousePosition.current.x;
      const deltaY = touch.clientY - lastMousePosition.current.y;
      
      positionX.set(positionX.get() + deltaX * sensitivity);
      positionY.set(positionY.get() + deltaY * sensitivity);
      
      lastMousePosition.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (e) => {
      if (!isDragging) return;
      setIsDragging(false);
      
      const deltaTime = 0.016;
      const deltaX = e.changedTouches[0].clientX - lastMousePosition.current.x;
      const deltaY = e.changedTouches[0].clientY - lastMousePosition.current.y;
      
      velocityX.set(Math.max(-maxSpeed, Math.min(maxSpeed, deltaX * sensitivity * 10)));
      velocityY.set(Math.max(-maxSpeed, Math.min(maxSpeed, deltaY * sensitivity * 10)));
    };

    // Event listeners
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseUp);
    
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseUp);
      
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [friction, sensitivity, maxSpeed, isDragging, velocityX, velocityY, positionX, positionY]);

  return (
    <motion.div
      ref={containerRef}
      style={{ 
        x: smoothX, 
        y: smoothY,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      className={`momentum-scroll-container ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default MomentumScroll;

