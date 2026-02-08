import React from 'react';
import { motion } from 'framer-motion';

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
}

const FloatingElement: React.FC<FloatingElementProps> = ({ 
  children, 
  className = '',
  amplitude = 10,
  duration = 3
}) => {
  return (
    <motion.div
      className={className}
      animate={{ 
        y: [-amplitude, amplitude, -amplitude]
      }}
      transition={{ 
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

export default FloatingElement;
