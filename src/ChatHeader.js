import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

const IntegratedClearChatMessage = ({ onClearChat, theme }) => {
  const [isClearing, setIsClearing] = useState(false);
  const [stage, setStage] = useState(0);

  const handleClear = async () => {
    setIsClearing(true);
    
    // Stage 1: Initial sweep
    setStage(1);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Stage 2: Ripple effect
    // setStage(2);
    // await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Stage 3: Burst effect
    // setStage(3);
    // await new Promise(resolve => setTimeout(resolve, 800));
    
    onClearChat();
    setIsClearing(false);
    setStage(0);
  };

  const stageAnimations = {
    1: (
      <motion.div
        key="sweep"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-r from-blue-300 via-green-300 to-blue-300"
      />
    ),
    2: (
      <motion.div
        key="ripple"
        className="absolute inset-0 flex items-center justify-center"
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full border-4 ${
              theme === 'light' ? 'border-blue-400' : 'border-blue-500'
            }`}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: '400px', height: '400px', opacity: 0 }}
            transition={{
              duration: 2,
              delay: i * 0.4,
              ease: "easeOut",
              repeat: Infinity,
            }}
          />
        ))}
      </motion.div>
    ),
    3: (
      <motion.div
        key="burst"
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100">
          <motion.path
            d="M50 50 L50 0 A50 50 0 0 1 100 50 Z"
            fill={theme === 'light' ? '#3B82F6' : '#60A5FA'}
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ transformOrigin: '50px 50px' }}
          />
          <motion.path
            d="M50 50 L50 0 A50 50 0 0 1 100 50 Z"
            fill={theme === 'light' ? '#3B82F6' : '#60A5FA'}
            initial={{ rotate: 90 }}
            animate={{ rotate: 450 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ transformOrigin: '50px 50px' }}
          />
          <motion.path
            d="M50 50 L50 0 A50 50 0 0 1 100 50 Z"
            fill={theme === 'light' ? '#3B82F6' : '#60A5FA'}
            initial={{ rotate: 180 }}
            animate={{ rotate: 540 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ transformOrigin: '50px 50px' }}
          />
          <motion.path
            d="M50 50 L50 0 A50 50 0 0 1 100 50 Z"
            fill={theme === 'light' ? '#3B82F6' : '#60A5FA'}
            initial={{ rotate: 270 }}
            animate={{ rotate: 630 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ transformOrigin: '50px 50px' }}
          />
        </svg>
      </motion.div>
    )
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className={`my-8 p-4 rounded-lg shadow-md overflow-hidden ${
        theme === 'light' ? 'bg-blue-50' : 'bg-blue-900'
      } relative`}
    >
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-2">
          <Sparkles className="text-yellow-400" size={20} />
          <p className={`text-sm font-medium ${
            theme === 'light' ? 'text-blue-800' : 'text-blue-100'
          }`}>
            Ready for a fresh start?
          </p>
        </div>
        <AnimatePresence>
          {!isClearing ? (
            <motion.button
              key="clearButton"
              className={`px-4 py-2 rounded-full flex items-center space-x-2 ${
                theme === 'light' 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-blue-400 text-blue-900 hover:bg-blue-300'
              } transition-colors duration-300`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClear}
            >
              <span className="text-sm font-medium">Start New Chat</span>
              <ArrowRight size={16} />
            </motion.button>
          ) : (
            <motion.div
              key="clearingText"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`text-sm font-medium ${
                theme === 'light' ? 'text-blue-800' : 'text-blue-100'
              }`}
            >
              Creating a fresh start...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {isClearing && stageAnimations[stage]}
      </AnimatePresence>
    </motion.div>
  );
};

export default IntegratedClearChatMessage;