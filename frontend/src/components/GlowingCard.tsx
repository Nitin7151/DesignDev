import React from 'react';
import { motion } from 'framer-motion';

interface GlowingCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  hoverEffect?: boolean;
}

const GlowingCard: React.FC<GlowingCardProps> = ({ 
  children, 
  className = '', 
  glowColor = 'from-blue-500 to-purple-500',
  hoverEffect = true,
}) => {
  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden ${className}`}
      whileHover={hoverEffect ? { scale: 1.02 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 -z-10 bg-black rounded-2xl" />
      <div 
        className={`absolute -inset-0.5 -z-10 bg-gradient-to-r ${glowColor} opacity-30 blur-xl group-hover:opacity-50 transition duration-300`}
      />
      <div 
        className={`absolute -inset-1 -z-10 bg-gradient-to-r ${glowColor} opacity-20 blur-2xl group-hover:opacity-40 transition duration-300`}
      />
      
      {/* Card content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
};

export default GlowingCard;
