import React from 'react';
import { motion } from 'framer-motion';
import ThreeDIcon, { FallbackIcon } from './3DIcons';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  icon: 'login' | 'signup';
  children: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ title, subtitle, icon, children }) => {
  return (
    <motion.div
      className="max-w-md w-full space-y-8 bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-xl shadow-2xl border border-gray-700"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center">
        <div className="mb-4">
          <FallbackIcon icon={icon} />
        </div>
        <motion.h2
          className="text-center text-3xl font-extrabold text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            className="mt-2 text-center text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default AuthCard;