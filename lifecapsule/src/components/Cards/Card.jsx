import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

const Card = ({
  children,
  className = '',
  hover = true,
  padding = 'p-6',
  shadow = 'shadow-lg'
}) => {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02 } : {}}
      className={`
        bg-white rounded-xl border border-gray-200 ${shadow} ${padding}
        transition-all duration-200 ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-gray-200 ${className}`}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
