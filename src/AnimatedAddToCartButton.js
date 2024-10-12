import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShoppingBag, Plus, Minus } from 'lucide-react';

const AnimatedAddToCartButton = ({ item, addToCart, theme, quantity, size = 'normal' }) => {
  const [isAdded, setIsAdded] = useState(false);
  const [showIncrement, setShowIncrement] = useState(quantity > 0);

  const handleAddToCart = useCallback((e) => {
    e.stopPropagation();
    setIsAdded(true);
    addToCart({ ...item, quantity: quantity + 1 });
    setTimeout(() => {
      setIsAdded(false);
      setShowIncrement(true);
    }, 1500);
  }, [addToCart, item, quantity]);

  const handleIncrement = useCallback((e) => {
    e.stopPropagation();
    addToCart({ ...item, quantity: quantity + 1 });
  }, [addToCart, item, quantity]);

  const handleDecrement = useCallback((e) => {
    e.stopPropagation();
    const newQuantity = Math.max(0, quantity - 1);
    addToCart({ ...item, quantity: newQuantity });
    if (newQuantity === 0) {
      setShowIncrement(false);
    }
  }, [addToCart, item, quantity]);

  useEffect(() => {
    if (quantity > 0 && !isAdded) {
      setShowIncrement(true);
    }
  }, [quantity, isAdded]);

  const buttonStyles = theme === 'light'
    ? 'bg-blue-500 text-white hover:bg-blue-600'
    : 'bg-blue-600 text-white hover:bg-blue-700';

  const incrementDecrementStyles = theme === 'light'
    ? 'bg-gray-200 text-gray-800'
    : 'bg-gray-700 text-gray-200';

  const iconButtonStyles = theme === 'light'
    ? 'bg-white text-blue-500 hover:bg-gray-100'
    : 'bg-gray-800 text-blue-400 hover:bg-gray-600';

  const sizeStyles = {
    normal: 'w-28 h-8 text-xs',
    large: 'w-40 h-12 text-base'
  };

  const iconSizes = {
    normal: 14,
    large: 20
  };

  return (
    <motion.div className={`relative ${sizeStyles[size]}`}>
      <AnimatePresence initial={false}>
        {!showIncrement ? (
          <motion.button
            key="add-to-cart"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={handleAddToCart}
            className={`absolute inset-0 px-2 py-1 rounded-full font-medium flex items-center justify-center ${
              isAdded
                ? 'bg-green-500 text-white'
                : buttonStyles
            } transition-colors duration-300`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isAdded ? (
                <motion.div
                  key="check"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="flex items-center"
                >
                  <Check size={iconSizes[size]} className="mr-1" />
                  <span className="whitespace-nowrap">Added</span>
                </motion.div>
              ) : (
                <motion.div
                  key="add"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="flex items-center"
                >
                  <ShoppingBag size={iconSizes[size]} className="mr-1" />
                  <span className="whitespace-nowrap">Add to Cart</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ) : (
          <motion.div
            key="increment-decrement"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className={`absolute inset-0 flex items-center justify-between ${incrementDecrementStyles} rounded-full p-1`}
          >
            <motion.button
              onClick={handleDecrement}
              className={`p-1 rounded-full ${iconButtonStyles}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Minus size={iconSizes[size]} />
            </motion.button>
            <span className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{quantity}</span>
            <motion.button
              onClick={handleIncrement}
              className={`p-1 rounded-full ${iconButtonStyles}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Plus size={iconSizes[size]} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AnimatedAddToCartButton;