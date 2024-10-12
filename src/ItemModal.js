import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Plus, Minus, Check } from 'lucide-react';

const ItemModal = ({ item, isOpen, onClose, theme, addToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const addToCartWithQuantity = async () => {
    setIsAddingToCart(true);
    for (let i = 0; i < quantity; i++) {
      await addToCart(item);
    }
    setIsAddingToCart(false);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      onClose();
    }, 700);
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 }
  };

  const notificationVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className={`relative max-w-[90%] w-full sm:max-w-[425px] mx-auto overflow-hidden rounded-2xl ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="relative">
          <img
            src={item.image_link}
            alt={item.name_of_item}
            className="w-full h-48 sm:h-64 object-cover"
          />
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all"
          >
            <X size={20} />
          </button>
          <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold ${
            item.veg_or_non_veg === 'veg' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {item.veg_or_non_veg === 'veg' ? 'Veg' : 'Non-Veg'}
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            {item.name_of_item}
          </h3>
          <div className="flex items-center mb-2 sm:mb-4">
            <Star className="text-yellow-400 mr-1" size={16} />
            <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
              {/* {item.rating.toFixed(1)} ({item.number_of_people_rated} ratings) */}
              {item.rating != null ? item.rating.toFixed(1) : 'N/A'} ({item.number_of_people_rated || 0} ratings)
            </span>
          </div>
          <p className={`mb-4 text-sm sm:text-base ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            {item.description}
          </p>
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <p className="text-xl sm:text-2xl font-bold text-blue-600">
              {/* ₹{item.cost.toFixed(2)} */}
              ₹{item.cost != null ? item.cost.toFixed(2) : 'N/A'}
            </p>
            <div className="flex items-center">
              <button 
                onClick={decrementQuantity}
                className={`p-2 rounded-full ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}
                disabled={isAddingToCart}
              >
                <Minus size={16} />
              </button>
              <span className={`mx-4 font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                {quantity}
              </span>
              <button 
                onClick={incrementQuantity}
                className={`p-2 rounded-full ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}
                disabled={isAddingToCart}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          <motion.button
            onClick={addToCartWithQuantity}
            className={`w-full bg-blue-500 text-white py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold transition-colors ${
              isAddingToCart ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
            whileHover={{ scale: isAddingToCart ? 1 : 1.05 }}
            whileTap={{ scale: isAddingToCart ? 1 : 0.95 }}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? 'Adding to Cart...' : `Add to Cart - ₹${(item.cost * quantity).toFixed(2)}`}
          </motion.button>
        </div>
      </motion.div>
      <AnimatePresence>
        {showNotification && (
          <motion.div
            className="fixed top-4 right-4 transform -translate-x-1/2 z-60"
            variants={notificationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className={`px-4 py-2 rounded-full ${theme === 'light' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg flex items-center space-x-2`}>
              <Check size={18} className="text-green-500" />
              <span className="font-semibold">Added to Cart</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ItemModal;