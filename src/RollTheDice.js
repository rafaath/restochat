import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pin, Shuffle, Star } from 'lucide-react';
import AnimatedAddToCartButton from './AnimatedAddToCartButton';

const CustomSlider = ({ value, onChange, theme }) => {
    const steps = [500, 1000, 1500, 2000];
    
    return (
      <div className="relative pt-3 pb-8">
        <div className="absolute w-full h-5 bg-gray-200 dark:bg-gray-700 rounded-full">
          <div 
            className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(steps.indexOf(value) / (steps.length - 1)) * 100}%` }}
          />
          {steps.map((step, index) => (
            <button
              key={step}
              className="absolute top-1/2 -translate-y-1/2 w-10 h-10 -ml-5 flex items-center justify-center focus:outline-none"
              style={{ left: `${(index / (steps.length - 1)) * 100}%` }}
              onClick={() => onChange(step)}
            >
              <div className={`w-5 h-7 rounded-full transition-all duration-300 ease-out ${
                value >= step 
                  ? 'bg-white scale-100 shadow-md' 
                  : 'bg-blue-200 dark:bg-blue-600 scale-90'
              }`} />
            </button>
          ))}
        </div>
        <div className="absolute w-full flex justify-between mt-8">
          {steps.map((step, index) => (
            <span
              key={step}
              className={`text-xs transition-all duration-300 ease-out ${
                value >= step
                  ? 'font-semibold text-blue-500 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              style={{ left: `${(index / (steps.length - 1)) * 100}%`, position: 'absolute', transform: 'translateX(-50%)' }}
            >
              ₹{step}{index === steps.length - 1 && '+'}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const RollTheDice = ({ isOpen, onClose, theme, menuItems, addToCart, removeFromCart, cart }) => {
    const [priceRange, setPriceRange] = useState(1000);
    const [items, setItems] = useState([]);
    const [shouldRandomize, setShouldRandomize] = useState(true);
  
    const getItemQuantity = useCallback((itemId) => {
      const cartItem = cart.find(item => item.item_id === itemId);
      return cartItem ? cartItem.quantity : 0;
    }, [cart]);
  
    const eligibleItems = useMemo(() => {
      if (priceRange === 2000) {
        // For 2000+, include all items sorted by price descending
        return [...menuItems].sort((a, b) => b.cost - a.cost);
      }
      return menuItems.filter(item => item.cost <= priceRange);
    }, [menuItems, priceRange]);
  
    const getRandomItems = useCallback((count, maxTotal) => {
      if (priceRange === 2000) {
        // For 2000+, select random items from the entire menu
        const shuffled = [...menuItems].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
      }
  
      const shuffled = [...eligibleItems].sort(() => 0.5 - Math.random());
      const selected = [];
      let total = 0;
  
      for (let item of shuffled) {
        if (selected.length < count && total + item.cost <= maxTotal) {
          selected.push(item);
          total += item.cost;
        }
        if (selected.length === count) break;
      }
  
      return selected;
    }, [menuItems, eligibleItems, priceRange]);
  
    const calculateItemCount = useCallback(() => {
      if (priceRange === 500) return 2;
      if (priceRange === 1000) return 3;
      if (priceRange === 1500) return 4;
      return 5; // for 2000+
    }, [priceRange]);
  
    const handleRandomize = useCallback(() => {
      const itemCount = calculateItemCount();
      const pinnedItems = items.filter(item => item.isPinned);
      const maxTotal = priceRange === 2000 ? Infinity : priceRange;
      const newRandomItems = getRandomItems(itemCount - pinnedItems.length, maxTotal);
  
      setItems(prevItems => {
        const newItems = [...pinnedItems, ...newRandomItems].map(item => ({
          ...item,
          isPinned: item.isPinned || false
        }));
        return newItems.slice(0, itemCount);
      });
      setShouldRandomize(false);
    }, [calculateItemCount, getRandomItems, items, priceRange]);
  
    const handlePinItem = useCallback((index) => {
      setItems(prevItems => {
        const newItems = [...prevItems];
        newItems[index] = { ...newItems[index], isPinned: !newItems[index].isPinned };
        return newItems;
      });
    }, []);
  
    useEffect(() => {
      if (isOpen && shouldRandomize) {
        handleRandomize();
      } else if (!isOpen) {
        setItems([]);
        setShouldRandomize(true);
      }
    }, [isOpen, handleRandomize, shouldRandomize]);
  
    useEffect(() => {
      setShouldRandomize(true);
    }, [priceRange]);
  
    return (
        <div className="z-[9999] no-scrollbar">
          <AnimatePresence>
            {isOpen && (
              <motion.div 
                className="fixed inset-0 z-[9999] overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div 
                  className="absolute inset-0 bg-black bg-opacity-50" 
                  onClick={onClose}
                />
                <motion.div 
                  className={`absolute inset-x-0 bottom-0 ${
                    theme === 'light' ? 'bg-white' : 'bg-gray-900'
                  } rounded-t-3xl overflow-hidden shadow-lg`}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                  style={{ 
                    height: 'calc(100% - 1rem)', 
                    maxHeight: '100vh',
                    transform: 'translateZ(0)', // Create a new stacking context
                  }}
                >
                <div className="h-full flex flex-col p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      Roll the Dice
                    </h2>
                    <button 
                      onClick={onClose} 
                      className={`p-2 rounded-full ${theme === 'light' ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-300 hover:bg-gray-800'}`}
                    >
                      <X size={24} />
                    </button>
                  </div>
  
                  <div className="mb-8">
                    <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
                      Set Your Budget
                    </h3>
                    <CustomSlider
                      value={priceRange}
                      onChange={(value) => {
                        setPriceRange(value);
                        setShouldRandomize(true);
                      }}
                      theme={theme}
                    />
                  </div>
  
                  <div className="flex-grow overflow-y-auto no-scrollbar">
                    <AnimatePresence>
                      {items.map((item, index) => (
                        <motion.div
                          key={item.item_id}
                          className={`p-4 rounded-lg mb-4 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}
                        >
                          <div className="flex items-start space-x-4">
                            <img 
                              src={item.image_link || "/api/placeholder/80/80"} 
                              alt={item.name_of_item} 
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-grow">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                                    {item.name_of_item}
                                  </h3>
                                  <div className="flex items-center mt-1">
                                    <Star className="text-yellow-400 mr-1" size={16} />
                                    <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                                      {item.rating ? item.rating.toFixed(1) : 'N/A'} ({item.number_of_people_rated || 0})
                                    </span>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => handlePinItem(index)}
                                  className={`p-1 rounded-full ${
                                    item.isPinned
                                      ? 'bg-blue-500 text-white'
                                      : theme === 'light' ? 'bg-gray-200 text-gray-600' : 'bg-gray-700 text-gray-300'
                                  }`}
                                >
                                  <Pin size={16} />
                                </button>
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                <span className={`font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                                  ₹{item.cost.toFixed(2)}
                                </span>
                                <AnimatedAddToCartButton
                                  item={item}
                                  addToCart={addToCart}
                                  removeFromCart={removeFromCart}
                                  theme={theme}
                                  quantity={getItemQuantity(item.item_id)}
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShouldRandomize(true)}
                    className={`w-full py-3 mt-6 ${
                      theme === 'light' 
                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    } rounded-full font-semibold flex items-center justify-center transition-colors duration-300`}
                  >
                    <Shuffle className="mr-2" size={20} />
                    Roll Again
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };
  
  export default RollTheDice;