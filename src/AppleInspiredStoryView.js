import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ShoppingBag, Heart, ShoppingCart, ChevronDown, ChevronUp, Star, Package, Info, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Notification = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ type: "spring", damping: 25, stiffness: 300 }}
    className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-[60]"
  >
    <ShoppingCart size={20} />
    <span>{message}</span>
  </motion.div>
);

const highlightColors = [
  'text-blue-500',
  'text-green-500',
  'text-purple-500',
  'text-pink-500',
  'text-yellow-500',
  'text-indigo-500',
  'text-red-500',
  'text-teal-500'
];

const HighlightedText = ({ text, items, scrollToItem }) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  let colorIndex = 0;

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const innerText = part.slice(2, -2);
          const colorClass = highlightColors[colorIndex];
          colorIndex = (colorIndex + 1) % highlightColors.length;
          const matchingItem = items.find(item => item.name_of_item.toLowerCase().includes(innerText.toLowerCase()));

          return (
            <span
              key={index}
              className={`${colorClass} font-semibold cursor-pointer transition-colors duration-200 ease-in-out hover:opacity-80`}
              onClick={() => matchingItem && scrollToItem(matchingItem.id)}
            >
              {innerText}
            </span>
          );
        }
        return part;
      })}
    </>
  );
};

const ComboSection = ({ combos, onAddToCart, onAddCombo, setShowCombos }) => {
  const [expandedCombo, setExpandedCombo] = useState(null);

  return (
    <div className="space-y-4">
      {combos.map((combo) => (
        <motion.div
          key={combo.combo_id}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md"
        >
          <div className="p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{combo.combo_name}</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setExpandedCombo(expandedCombo === combo.combo_id ? null : combo.combo_id)}
                className="text-blue-500 hover:text-blue-600 transition-colors"
              >
                {expandedCombo === combo.combo_id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </motion.button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{combo.description}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">₹{combo.cost.toFixed(2)}</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAddCombo(combo)}
                className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <Package size={16} />
                <span>Add Combo</span>
              </motion.button>
            </div>
          </div>
          <AnimatePresence>
            {expandedCombo === combo.combo_id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="px-4 pb-4"
              >
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Combo Items:</h4>
                {combo.combo_items.map((item) => (
                  <div key={item.item_id} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <img src={item.image_link} alt={item.name_of_item} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.name_of_item}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onAddToCart(item)}
                      className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold hover:bg-green-600 transition-colors"
                    >
                      Add
                    </motion.button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

const ItemCard = React.forwardRef(({ item, onAddToCart, onAddCombo }, ref) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCombos, setShowCombos] = useState(false);

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl ${
        showCombos ? 'md:col-span-2' : ''
      }`}
    >
      <div
        className={`flex flex-col md:flex-row ${
          showCombos ? 'md:divide-x' : ''
        } divide-gray-200 dark:divide-gray-700`}
      >
        <div className={`flex-shrink-0 ${showCombos ? 'md:w-1/2' : 'w-full'}`}>
          <div className="relative">
            <img
              src={item.image_link}
              alt={item.name_of_item}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 right-2 flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-white dark:bg-gray-900 rounded-full shadow-md text-red-500 hover:text-red-600 transition-colors"
              >
                <Heart size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 bg-white dark:bg-gray-900 rounded-full shadow-md text-blue-500 hover:text-blue-600 transition-colors"
              >
                <Info size={20} />
              </motion.button>
            </div>
            <div
              className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold ${
                item.veg_or_non_veg === 'veg'
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}
            >
              {item.veg_or_non_veg === 'veg' ? 'Veg' : 'Non-Veg'}
            </div>
          </div>
          <div className="p-4 flex flex-col space-y-3">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {item.name_of_item}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {item.description}
            </p>
            <div className="flex items-center">
              <Star className="text-yellow-400 mr-1" size={16} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {item.rating
                  ? `${item.rating.toFixed(1)} (${item.number_of_people_rated} ratings)`
                  : 'Not rated yet'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                ₹{item.cost.toFixed(2)}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAddToCart(item)}
                className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <ShoppingBag size={16} />
                <span>Add to Cart</span>
              </motion.button>
            </div>
            {item.combos && item.combos.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCombos(!showCombos)}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-purple-600 hover:to-indigo-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Sparkles size={16} />
                <span>
                  {showCombos ? 'Hide' : 'View'} {item.combos.length} Combo
                  {item.combos.length > 1 ? 's' : ''}
                </span>
              </motion.button>
            )}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Additional Information:
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>Cuisine: {item.cuisine}</li>
                    <li>Meal Time: {item.meal_time}</li>
                    <li>Spiciness: {item.spiciness}</li>
                    <li>Allergens: {item.allergens_present || 'None'}</li>
                    <li>
                      Dietary:{' '}
                      {item.is_vegan ? 'Vegan' : ''}{' '}
                      {item.is_gluten_free ? 'Gluten-free' : ''}
                    </li>
                    <li>Energy: {item.energy}</li>
                    <li>Protein: {item.protein}</li>
                    <li>Fat: {item.fat}</li>
                    <li>Carbohydrates: {item.carbohydrates}</li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <AnimatePresence>
          {showCombos && (
            <motion.div
              key="combo-section"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                duration: 0.5,
                ease: [0.43, 0.13, 0.23, 0.96],
              }}
              className="md:w-1/2 overflow-hidden"
            >
              <div className="p-6 h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Available Combos
                  </h3>
                </div>
                <ComboSection
                  combos={item.combos}
                  onAddToCart={onAddToCart}
                  onAddCombo={onAddCombo}
                  setShowCombos={setShowCombos}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});


const IsolatedScrollContent = React.memo(({ conversation, onAddToCart, onAddCombo }) => {
  const itemRefs = useRef({});
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (conversation.items) {
      setItems(
        conversation.items.map((item, index) => ({
          ...item,
          id: `item-${index}`
        }))
      );
    }
  }, [conversation.items]);

  const scrollToItem = (itemId) => {
    const element = itemRefs.current[itemId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
        {conversation.query}
      </h2>
      <div className="prose dark:prose-invert mb-12">
        <HighlightedText text={conversation.response} items={items} scrollToItem={scrollToItem} />
      </div>
      {items.length > 0 && (
        <div className="space-y-12">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Recommended Items</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                ref={(el) => (itemRefs.current[item.id] = el)}
                item={item}
                onAddToCart={onAddToCart}
                onAddCombo={onAddCombo}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

const AppleInspiredStoryView = ({ isOpen, onClose, conversations, initialIndex, addToCart, theme }) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [notification, setNotification] = useState(null);
  const controls = useAnimation();
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleNext = useCallback(() => {
    if (activeIndex < conversations.length - 1) {
      controls
        .start({ opacity: 0, y: '10%', transition: { duration: 0.3 } })
        .then(() => {
          setActiveIndex((prev) => prev + 1);
          controls.set({ y: '-10%' });
          return controls.start({ opacity: 1, y: '0%', transition: { duration: 0.3 } });
        });
    }
  }, [activeIndex, conversations.length, controls]);

  const handlePrev = useCallback(() => {
    if (activeIndex > 0) {
      controls
        .start({ opacity: 0, y: '-10%', transition: { duration: 0.3 } })
        .then(() => {
          setActiveIndex((prev) => prev - 1);
          controls.set({ y: '10%' });
          return controls.start({ opacity: 1, y: '0%', transition: { duration: 0.3 } });
        });
    }
  }, [activeIndex, controls]);

  const handleAddToCart = useCallback(
    (item) => {
      addToCart(item);
      setNotification(`${item.name_of_item} added to cart!`);
      setTimeout(() => setNotification(null), 3000);
    },
    [addToCart]
  );

  const handleAddCombo = useCallback(
    (combo) => {
      combo.combo_items.forEach((item) => addToCart(item));
      setNotification(`${combo.combo_name} added to cart!`);
      setTimeout(() => setNotification(null), 3000);
    },
    [addToCart]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Menu Recommendations</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={24} />
              </motion.button>
            </div>
            <div ref={scrollContainerRef} className="flex-grow overflow-y-auto">
              <motion.div animate={controls} className="h-full">
                <IsolatedScrollContent
                  conversation={conversations[activeIndex]}
                  onAddToCart={handleAddToCart}
                  onAddCombo={handleAddCombo}
                />
              </motion.div>
            </div>
            {conversations.length > 1 && (
              <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrev}
                  disabled={activeIndex === 0}
                  className={`p-2 rounded-full ${
                    activeIndex === 0
                      ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-400'
                  } transition-colors`}
                >
                  <ChevronLeft size={24} />
                </motion.button>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {activeIndex + 1} / {conversations.length}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  disabled={activeIndex === conversations.length - 1}
                  className={`p-2 rounded-full ${
                    activeIndex === conversations.length - 1
                      ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-400'
                  } transition-colors`}
                >
                  <ChevronRight size={24} />
                </motion.button>
              </div>
            )}
          </motion.div>
          <AnimatePresence>
            {notification && <Notification message={notification} />}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppleInspiredStoryView;
