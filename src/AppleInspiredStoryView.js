import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ShoppingBag, Heart, ShoppingCart, ChevronDown, ChevronUp, Star, Package, Info, Sparkles, Plus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Tooltip } from './components/ui/tooltip';
import { Badge } from './components/ui/badge';

const Notification = ({ message, theme }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ type: "spring", damping: 25, stiffness: 300 }}
    className={`fixed top-4 right-4 ${theme === 'light' ? 'bg-green-500' : 'bg-green-600'} text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-[60]`}
  >
    <ShoppingCart size={20} />
    <span>{message}</span>
  </motion.div>
);

const highlightColors = {
  light: [
    'text-blue-600',
    'text-green-600',
    'text-purple-600',
    'text-pink-600',
    'text-yellow-600',
    'text-indigo-600',
    'text-red-600',
    'text-teal-600'
  ],
  dark: [
    'text-blue-400',
    'text-green-400',
    'text-purple-400',
    'text-pink-400',
    'text-yellow-400',
    'text-indigo-400',
    'text-red-400',
    'text-teal-400'
  ]
};

const HighlightedText = ({ text, items, scrollToItem, theme }) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  let colorIndex = 0;

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const innerText = part.slice(2, -2);
          const colorClass = highlightColors[theme][colorIndex];
          colorIndex = (colorIndex + 1) % highlightColors[theme].length;
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


const ComboItem = ({ item, onAddToCart, theme, onItemClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    controls.start(isHovered ? 'hover' : 'rest');
  }, [isHovered, controls]);

  const imageVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: { scale: 1.05, rotate: 3, transition: { type: 'spring', stiffness: 300, damping: 10 } }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1, transition: { type: 'spring', stiffness: 400, damping: 10 } }
  };

  const renderSpicyIndicator = (spiciness) => {
    return (
        <div className="flex items-center mt-1">
          {[...Array(spiciness)].map((_, i) => (
            <Sparkles key={i} size={10} className="text-red-500 mr-0.5" />
          ))}
          <span className="text-xs ml-1 text-gray-500">Spicy</span>
        </div>
    );
  };

  const renderRating = (rating) => (
    <div className="flex items-center mt-1">
      <Star size={12} className="text-yellow-400 mr-0.5" fill="currentColor" />
      <span className="text-xs text-gray-500">{rating.toFixed(1)}</span>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onItemClick(item)}
      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 ${
        theme === 'light' 
          ? 'bg-white hover:bg-gray-50' 
          : 'bg-gray-800 hover:bg-gray-750'
      } rounded-lg transition-all duration-300 ease-in-out shadow-sm hover:shadow-md cursor-pointer`}
    >
      <div className="flex items-center space-x-3 w-full sm:w-auto">
        <motion.div
          variants={imageVariants}
          initial="rest"
          animate={controls}
          className="relative flex-shrink-0"
        >
          <motion.img 
            src={item.image_link} 
            alt={item.name_of_item} 
            className="w-16 h-16 rounded-lg object-cover shadow-md"
          />
          {item.veg_or_non_veg && (
            <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${
              item.veg_or_non_veg === 'veg' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              <span className="text-white text-xs font-bold">
                {item.veg_or_non_veg === 'veg' ? 'V' : 'N'}
              </span>
            </div>
          )}
          {item.bestseller && (
            <Badge variant="secondary" className="absolute -bottom-2 left-0 text-xs">
              Bestseller
            </Badge>
          )}
        </motion.div>
        <div className="flex-grow min-w-0">
          <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
            {item.name_of_item}
          </p>
          <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
            {truncateText(item.description, 50)}
          </p>
          <div className="flex items-center mt-1 space-x-2">
            {item.spiciness === "spicy" && renderSpicyIndicator(item.spiciness)}
            {item.rating && renderRating(item.rating)}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0">
        <div className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mr-3`}>
          ₹{item.cost.toFixed(2)}
        </div>
        <motion.button
          variants={buttonVariants}
          initial="rest"
          animate={controls}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(item);
          }}
          className={`p-2 rounded-full ${
            theme === 'light' 
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white transition-colors duration-200 ease-in-out shadow-md hover:shadow-lg`}
        >
          <Plus size={18} />
        </motion.button>
      </div>
    </motion.div>
  );
};

const ComboCard = ({ combo, onAddToCart, onAddCombo, theme, onItemClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isExpanded]);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const totalSavings = combo.combo_items.reduce((sum, item) => sum + item.cost, 0) - combo.cost;
  const savingsPercentage = ((totalSavings / combo.combo_items.reduce((sum, item) => sum + item.cost, 0)) * 100).toFixed(0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`${
        theme === 'light' 
          ? 'bg-white' 
          : 'bg-gray-800'
      } rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className={`text-2xl font-extrabold ${theme === 'light' ? 'text-gray-900' : 'text-white'} pr-2`}>
            {combo.combo_name}
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleExpand}
            className={`p-1 rounded-full ${
              theme === 'light' 
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            } transition-colors duration-200 ease-in-out flex-shrink-0`}
          >
           {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </motion.button>
        </div>
        <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} mb-3`}>
          {combo.description}
        </p>
        <div className="flex flex-col space-y-3">
          <div className="flex flex-col items-start justify-between">
            <div>
              <span className={`text-3xl font-bold ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>
                ₹{combo.cost.toFixed(2)}
              </span>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className={`inline-block ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                  theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-800 text-green-100'
                }`}
              >
                Save {savingsPercentage}%
              </motion.div>
            </div>
            
            <span className={`text-xs mt-2 mb-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
              Original: ₹{(combo.cost + totalSavings).toFixed(2)}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAddCombo(combo)}
            className={`${
              theme === 'light' 
                ? 'bg-blue-500 hover:bg-blue-600' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out flex items-center justify-center space-x-2 w-full shadow-md hover:shadow-lg`}
          >
            <Package size={18} />
            <span>Add Combo</span>
          </motion.button>
        </div>
      </div>
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? contentHeight : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="overflow-hidden"
      >
        <div ref={contentRef} className="p-4 space-y-3 bg-opacity-50 bg-gray-50 dark:bg-opacity-50 dark:bg-gray-700">
          {combo.combo_items.map((item) => (
            <ComboItem 
              key={item.item_id} 
              item={item} 
              onAddToCart={onAddToCart} 
              theme={theme}
              onItemClick={onItemClick}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

const ComboSection = ({ combos, onAddToCart, onAddCombo, theme, onItemClick }) => {
  return (
    <div className="space-y-4">
      {combos.map((combo) => (
        <ComboCard
          key={combo.combo_id}
          combo={combo}
          onAddToCart={onAddToCart}
          onAddCombo={onAddCombo}
          theme={theme}
          onItemClick={onItemClick}
        />
      ))}
    </div>
  );
};

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};


const ItemCard = React.forwardRef(({ item, onAddToCart, onAddCombo, theme, onItemClick }, ref) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCombos, setShowCombos] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const combosSectionRef = useRef(null);

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const descriptionText = showFullDescription
    ? item.description
    : truncateText(item.description, 120);

  const handleShowCombos = () => {
    setShowCombos(!showCombos);
    if (!showCombos) {
      setTimeout(() => {
        combosSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100); // Small delay to ensure the combos section is rendered
    }
  };

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl ${
        showCombos ? 'md:col-span-2' : ''
      }`}
      // onClick={() => onItemClick(item)}
    >
      <div
        className={`flex flex-col md:flex-row ${
          showCombos ? 'md:divide-x' : ''
        } ${theme === 'light' ? 'divide-gray-200' : 'divide-gray-700'} h-full`}
      >
        <div className={`flex-shrink-0 ${showCombos ? 'md:w-1/2' : 'w-full'} flex flex-col`}>
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
                className={`p-2 ${theme === 'light' ? 'bg-white text-red-500 hover:text-red-600' : 'bg-gray-900 text-red-400 hover:text-red-300'} rounded-full shadow-md transition-colors`}
              >
                <Heart size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className={`p-2 ${theme === 'light' ? 'bg-white text-blue-500 hover:text-blue-600' : 'bg-gray-900 text-blue-400 hover:text-blue-300'} rounded-full shadow-md transition-colors`}
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
          <div className="p-4 flex flex-col flex-grow">
            <h3 className={`text-xl font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {item.name_of_item}
            </h3>
            <div className="mt-2">
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                {descriptionText}
              </p>
              {item.description.length > 120 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className={`${theme === 'light' ? 'text-blue-500 hover:text-blue-600' : 'text-blue-400 hover:text-blue-300'} text-sm mt-1`}
                >
                  {showFullDescription ? 'See Less' : 'See More'}
                </button>
              )}
            </div>
            <div className="flex items-center mt-3">
              <Star className="text-yellow-400 mr-1" size={16} />
              <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                {item.rating
                  ? `${item.rating.toFixed(1)} (${item.number_of_people_rated} ratings)`
                  : 'Not rated yet'}
              </span>
            </div>
            <div className="mt-auto">
              <div className="flex justify-between items-center mt-3">
                <span className={`text-2xl font-bold ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>
                  ₹{item.cost.toFixed(2)}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onAddToCart(item)}
                  className={`${theme === 'light' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center space-x-2`}
                >
                  <ShoppingBag size={16} />
                  <span>Add to Cart</span>
                </motion.button>
              </div>
              {item.combos && item.combos.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShowCombos}
              className={`mt-3 w-full ${theme === 'light' ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'} text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center justify-center space-x-2`}
            >
              <Sparkles size={16} />
              <span>
                {showCombos ? 'Hide' : 'View'} {item.combos.length} Combo
                {item.combos.length > 1 ? 's' : ''}
              </span>
            </motion.button>
          )}
            </div>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`pt-4 border-t ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'} mt-3`}
                >
                  <h4 className={`font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-2`}>
                    Additional Information:
                  </h4>
                  <ul className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} space-y-1`}>
                    <li>Cuisine: {item.cuisine}</li>
                    <li>Meal Time: {item.meal_time}</li>
                    <li>Spiciness: {item.spiciness}</li>
                    <li>Allergens: {item.allergens_present || 'None'}</li>
                    <li>
                      Dietary: {item.is_vegan ? 'Vegan' : ''}{' '}
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
              ref={combosSectionRef}
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
                  <h3 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    Available Combos
                  </h3>
                </div>
                <ComboSection
                combos={item.combos}
                onAddToCart={onAddToCart}
                onAddCombo={onAddCombo}
                setShowCombos={setShowCombos}
                theme={theme}
                onItemClick={onItemClick}
              />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

const IsolatedScrollContent = React.memo(({ conversation, onAddToCart, onAddCombo, theme, onItemClick }) => {
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
      <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'} leading-tight`}>
        {conversation.query}
      </h2>
      <div className={`prose ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-12`}>
        <HighlightedText text={conversation.response} items={items} scrollToItem={scrollToItem} theme={theme} />
      </div>
      {items.length > 0 && (
        <div className="space-y-12">
          <h3 className={`text-2xl font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'} mb-6`}>Recommended Items</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                ref={(el) => (itemRefs.current[item.id] = el)}
                item={item}
                onAddToCart={onAddToCart}
                onAddCombo={onAddCombo}
                theme={theme}
                onItemClick={onItemClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

const AppleInspiredStoryView = ({ isOpen, onClose, conversations, initialIndex, addToCart, theme, onItemClick }) => {
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
            className={`w-full max-w-4xl max-h-[90vh] ${theme === 'light' ? 'bg-white' : 'bg-gray-900'} rounded-2xl overflow-hidden shadow-2xl relative flex flex-col`}
          >
            <div className={`flex justify-between items-center p-6 border-b ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
              <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Our Recommendations</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className={`p-2 rounded-full ${theme === 'light' ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'} transition-colors`}
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
                  theme={theme}
                  onItemClick={onItemClick}
                />
              </motion.div>
            </div>
            {conversations.length > 1 && (
              <div className={`flex justify-between items-center p-6 border-t ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrev}
                  disabled={activeIndex === 0}
                  className={`p-2 rounded-full ${
                    activeIndex === 0
                      ? `${theme === 'light' ? 'bg-gray-200 text-gray-400' : 'bg-gray-800 text-gray-600'} cursor-not-allowed`
                      : `${theme === 'light' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`
                  } transition-colors`}
                >
                  <ChevronLeft size={24} />
                </motion.button>
                <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {activeIndex + 1} / {conversations.length}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  disabled={activeIndex === conversations.length - 1}
                  className={`p-2 rounded-full ${
                    activeIndex === conversations.length - 1
                      ? `${theme === 'light' ? 'bg-gray-200 text-gray-400' : 'bg-gray-800 text-gray-600'} cursor-not-allowed`
                      : `${theme === 'light' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`
                  } transition-colors`}
                >
                  <ChevronRight size={24} />
                </motion.button>
              </div>
            )}
          </motion.div>
          <AnimatePresence>
            {notification && <Notification message={notification} theme={theme} />}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppleInspiredStoryView;