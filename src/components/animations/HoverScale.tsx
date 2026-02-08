import React from 'react';
import { motion } from 'framer-motion';

interface HoverScaleProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;
}

const HoverScale: React.FC<HoverScaleProps> = ({ 
  children, 
  className = '',
  scale = 1.03 
}) => {
  return (
    <motion.div
      className={className}
      whileHover={{ 
        scale,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
};

export default HoverScale;
