import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Pizza, Cake, Apple, Carrot, Beef, Fish, 
         IceCream, Salad, Sandwich, Egg, ChefHat, Utensils, 
         Wine, Beer } from 'lucide-react';

const EmptyState = ({ theme }) => {
  const [currentIcon, setCurrentIcon] = useState(0);
  const icons = [
    { component: Coffee, color: 'text-amber-400' },  // A refined, golden amber
    { component: Pizza, color: 'text-rose-500' },    // Soft, sophisticated rose
    { component: Cake, color: 'text-fuchsia-400' },  // Bright, poppy fuchsia
    { component: Apple, color: 'text-emerald-400' }, // Luxurious emerald green
    { component: Carrot, color: 'text-orange-400' }, // Energetic, glowing orange
    { component: Beef, color: 'text-red-500' },      // Bold, classic deep red
    { component: Fish, color: 'text-sky-400' },      // Fresh, light sky blue
    { component: IceCream, color: 'text-violet-500' },// Vibrant violet for a futuristic feel
    { component: Salad, color: 'text-lime-400' },    // Crisp, fresh lime
    { component: Sandwich, color: 'text-yellow-500' },// Bright, lively yellow
    { component: Egg, color: 'text-yellow-300' },    // Soft, delicate pastel yellow
    { component: ChefHat, color: 'text-cyan-200' },  // Subtle, cool cyan
    { component: Utensils, color: 'text-rose-400' }, // Refined rose pink
    { component: Wine, color: 'text-red-700' },      // Deep, elegant wine red
    { component: Beer, color: 'text-amber-300' },    // Warm, inviting amber
  ];
  

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIcon((prevIcon) => (prevIcon + 1) % icons.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className={`flex flex-col items-center justify-center text-center px-4 h-full`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className={`p-6 rounded-full mb-8 ${
          theme === 'light' ? 'bg-white shadow-lg' : 'bg-gray-800 shadow-xl'
        }`}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIcon}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {React.createElement(icons[currentIcon].component, { size: 48, className: icons[currentIcon].color })}
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <motion.h2 
        className={`text-3xl font-bold mb-4 ${
          theme === 'light' ? 'text-gray-800' : 'text-white'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Start Your Culinary Journey
      </motion.h2>
      <motion.p 
        className={`text-lg mb-8 max-w-md ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-300'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        Ask me anything about our menu, and I'll guide you to a dish worth savoring.
      </motion.p>
      <motion.p 
        className={`text-sm mb-6 max-w-md ${
          theme === 'light' ? 'text-gray-500' : 'text-gray-400'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        We're in beta. Answers may vary. Great things, like good food, take time.
      </motion.p>
      <motion.p 
        className={`text-sm ${
          theme === 'light' ? 'text-gray-500' : 'text-gray-400'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
      >
        Explore recommended favorites, personalized dietary choices, and flavors designed to delight.
      </motion.p>
    </motion.div>
  );
};

export default EmptyState;
