import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ShoppingBag, Heart, ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react';
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
  
  const ItemCard = React.forwardRef(({ item, index, onAddToCart }, ref) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpansion = () => setIsExpanded(!isExpanded);
  
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
      >
        <div className="relative h-48">
          <img src={item.image_link} alt={item.name_of_item} className="w-full h-full object-cover" />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-900 rounded-full shadow-md"
          >
            <Heart size={20} className="text-red-500" />
          </motion.button>
        </div>
        <div className="p-4 sm:p-6 flex flex-col flex-grow">
          <h4 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white leading-tight">
            {item.name_of_item}
          </h4>
          <div className="relative flex-grow">
            <p className={`text-sm text-gray-600 dark:text-gray-400 leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
              {item.description}
            </p>
            {item.description.length > 150 && (
              <button
                onClick={toggleExpansion}
                className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center mt-2 transition-colors duration-200 ease-in-out"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp size={16} className="mr-1" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} className="mr-1" />
                    Show More
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        <div className="p-4 sm:p-6 mt-auto">
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">₹{item.cost.toFixed(2)}</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(event) => onAddToCart(item, event)}
              className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors duration-200 ease-in-out flex items-center space-x-2"
            >
              <ShoppingBag size={16} />
              <span>Add to Cart</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  });
  
  const IsolatedScrollContent = React.memo(({ conversation, onAddToCart }) => {
    const itemRefs = useRef({});
    const [items, setItems] = useState([]);
  
    useEffect(() => {
      if (conversation.items) {
        setItems(conversation.items.map((item, index) => ({
          ...item,
          id: `item-${index}`
        })));
      }
    }, [conversation.items]);
  
    const scrollToItem = (itemId) => {
      const element = itemRefs.current[itemId];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };
  
    const handleAddToCart = useCallback((item, event) => {
      event.preventDefault();
      onAddToCart(item);
    }, [onAddToCart]);
  
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-[3em] sm:pb-28"> {/* Added bottom padding */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-900 dark:text-white leading-tight tracking-tight">
          {conversation.query}
        </h1>
        <div className="text-base sm:text-lg mb-10 text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
          <HighlightedText text={conversation.response} items={items} scrollToItem={scrollToItem} />
        </div>
        {items.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-900 dark:text-white leading-tight tracking-tight">
              Recommended for You
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
              {items.map((item, index) => (
                <ItemCard 
                  key={item.id}
                  ref={el => itemRefs.current[item.id] = el}
                  item={item} 
                  index={index} 
                  onAddToCart={handleAddToCart} 
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
      controls.start({ opacity: 0, x: '-10%', transition: { duration: 0.3 } })
        .then(() => {
          setActiveIndex(prev => prev + 1);
          controls.set({ x: '10%' });
          return controls.start({ opacity: 1, x: '0%', transition: { duration: 0.3 } });
        });
    }
  }, [activeIndex, conversations.length, controls]);

  const handlePrev = useCallback(() => {
    if (activeIndex > 0) {
      controls.start({ opacity: 0, x: '10%', transition: { duration: 0.3 } })
        .then(() => {
          setActiveIndex(prev => prev - 1);
          controls.set({ x: '-10%' });
          return controls.start({ opacity: 1, x: '0%', transition: { duration: 0.3 } });
        });
    }
  }, [activeIndex, controls]);

  const handleAddToCart = useCallback((item) => {
    const currentScrollPosition = scrollContainerRef.current?.scrollTop || 0;

    addToCart(item);
    setNotification("Item added to cart!");

    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = currentScrollPosition;
      }
    });

    setTimeout(() => setNotification(null), 3000);
  }, [addToCart]);

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
            className="w-full h-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl relative"
          >
            <div className="absolute top-4 right-4 z-10">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <X size={20} />
              </motion.button>
            </div>
            <div className="h-full relative overflow-hidden">
              <motion.div
                animate={controls}
                className="h-full"
              >
                <div
                  ref={scrollContainerRef}
                  className="h-full overflow-y-auto py-12 story-content"
                >
                  <IsolatedScrollContent 
                    conversation={conversations[activeIndex]}
                    onAddToCart={handleAddToCart}
                    theme={theme}
                  />
                </div>
              </motion.div>
            </div>
            <motion.div 
              className="absolute bottom-3 right-3 flex items-center space-x-4 bg-white dark:bg-gray-800 rounded-full shadow-lg px-4 py-2"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", damping: 20, stiffness: 300 }}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrev}
                disabled={activeIndex === 0}
                className={`p-2 text-gray-800 dark:text-white rounded-full transition-colors ${
                  activeIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <ChevronLeft size={24} />
              </motion.button>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {activeIndex + 1} / {conversations.length}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                disabled={activeIndex === conversations.length - 1}
                className={`p-2 text-gray-800 dark:text-white rounded-full transition-colors ${
                  activeIndex === conversations.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <ChevronRight size={24} />
              </motion.button>
            </motion.div>
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