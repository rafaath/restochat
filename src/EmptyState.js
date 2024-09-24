import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Coffee, Pizza, Cake } from 'lucide-react';

const EmptyState = ({ theme }) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center text-center px-4 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={`p-4 rounded-full mb-4 ${
          theme === 'light' ? 'bg-blue-100' : 'bg-blue-900'
        }`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
      >
        <MessageSquare size={40} className="text-blue-500" />
      </motion.div>
      <h2 className={`text-xl font-bold mb-2 ${
        theme === 'light' ? 'text-gray-800' : 'text-white'
      }`}>
        Start Your Culinary Journey
      </h2>
      <p className={`text-base mb-4 ${
        theme === 'light' ? 'text-gray-600' : 'text-gray-300'
      }`}>
        Ask me anything about our menu, and I'll help you discover delicious options!
      </p>
      <div className="flex space-x-4 mb-4">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Coffee size={24} className="text-yellow-500" />
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Pizza size={24} className="text-red-500" />
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Cake size={24} className="text-pink-500" />
        </motion.div>
      </div>
      <p className={`text-xs ${
        theme === 'light' ? 'text-gray-500' : 'text-gray-400'
      }`}>
        Try asking about our specials, dietary options, or popular dishes!
      </p>
    </motion.div>
  );
};

export default EmptyState;