import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

const Notification = ({ show, message, type, theme }) => {
  const notificationVariants = {
    hidden: { opacity: 0, y: -50, x: '-50%' },
    visible: { opacity: 1, y: 0, x: '-50%' },
    exit: { opacity: 0, y: -50, x: '-50%' },
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-4 left-1/2 z-[9999]"
          variants={notificationVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className={`px-4 py-2 rounded-full ${theme === 'light' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg flex items-center space-x-2`}>
            {type === 'success' && <Check size={18} className="text-green-500" />}
            {type === 'error' && <X size={18} className="text-red-500" />}
            <span className="font-semibold">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;