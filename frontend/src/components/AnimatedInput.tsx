import React from 'react';
import { motion } from 'framer-motion';
import { FallbackIcon } from './3DIcons';

interface AnimatedInputProps {
  id: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: 'email' | 'password';
  required?: boolean;
  autoComplete?: string;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  icon,
  required = true,
  autoComplete,
}) => {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <FallbackIcon icon={icon} />
      </div>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        className="appearance-none pl-16 rounded-lg relative block w-full px-3 py-4 border border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 transition-all duration-300 hover:border-blue-400"
        placeholder={placeholder}
      />
      <motion.span
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"
        initial={{ width: 0 }}
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default AnimatedInput;