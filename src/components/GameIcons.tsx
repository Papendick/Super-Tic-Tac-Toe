import React from 'react';
import { motion } from 'motion/react';

interface IconProps {
  className?: string;
  strokeWidth?: number;
}

export const IconX: React.FC<IconProps> = ({ className = "", strokeWidth = 10 }) => (
  <motion.svg 
    viewBox="0 0 100 100" 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    strokeLinecap="square"
    strokeLinejoin="miter"
  >
    {/* Outer glow / secondary tech line */}
    <motion.path 
      d="M 20 20 L 80 80 M 80 20 L 20 80" 
      strokeWidth={strokeWidth * 0.3}
      strokeOpacity={0.3}
      initial={{ pathLength: 0, opacity: 0 }} 
      animate={{ pathLength: 1, opacity: 1 }} 
      transition={{ duration: 0.5, ease: "easeOut" }} 
    />
    {/* Main sharp lines */}
    <motion.path 
      d="M 24 24 L 76 76" 
      strokeWidth={strokeWidth}
      initial={{ pathLength: 0, opacity: 0 }} 
      animate={{ pathLength: 1, opacity: 1 }} 
      transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }} 
    />
    <motion.path 
      d="M 76 24 L 24 76" 
      strokeWidth={strokeWidth}
      initial={{ pathLength: 0, opacity: 0 }} 
      animate={{ pathLength: 1, opacity: 1 }} 
      transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }} 
    />
    {/* Center tactical dot */}
    <motion.circle
      cx="50" cy="50" r={strokeWidth * 0.8}
      fill="currentColor"
      stroke="none"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", bounce: 0.6, delay: 0.4 }}
    />
  </motion.svg>
);

export const IconO: React.FC<IconProps> = ({ className = "", strokeWidth = 10 }) => (
  <motion.svg 
    viewBox="0 0 100 100" 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    strokeLinecap="round"
  >
    {/* Outer tactical ring */}
    <motion.circle 
      cx="50" cy="50" r="38" 
      strokeWidth={strokeWidth * 0.2}
      strokeDasharray="4 8"
      strokeOpacity={0.5}
      initial={{ rotate: -90, opacity: 0 }} 
      animate={{ rotate: 0, opacity: 1 }} 
      transition={{ duration: 0.8, ease: "easeOut" }} 
    />
    {/* Main elegant ring */}
    <motion.circle 
      cx="50" cy="50" r="28" 
      strokeWidth={strokeWidth}
      initial={{ pathLength: 0, opacity: 0, scale: 0.8 }} 
      animate={{ pathLength: 1, opacity: 1, scale: 1 }} 
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }} 
    />
  </motion.svg>
);

export const IconDraw: React.FC<IconProps> = ({ className = "", strokeWidth = 10 }) => (
  <motion.svg 
    viewBox="0 0 100 100" 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    strokeLinecap="square"
  >
    <motion.path 
      d="M 25 40 L 75 40 M 25 60 L 75 60" 
      strokeWidth={strokeWidth}
      initial={{ pathLength: 0, opacity: 0 }} 
      animate={{ pathLength: 1, opacity: 1 }} 
      transition={{ duration: 0.4, ease: "easeOut" }} 
    />
  </motion.svg>
);
