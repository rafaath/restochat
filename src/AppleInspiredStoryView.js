import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ShoppingBag, Heart, ShoppingCart } from 'lucide-react';
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

const IsolatedScrollContent = React.memo(({ conversation, onAddToCart, theme }) => {
  const handleAddToCart = (item, event) => {
    event.preventDefault();
    onAddToCart(item);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white leading-tight">
        {conversation.query}
      </h2>
      <ReactMarkdown
        components={{
          p: ({ node, ...props }) => <p className="text-base sm:text-lg mb-4 sm:mb-6 text-gray-700 dark:text-gray-300 leading-relaxed" {...props} />,
          h1: ({ node, ...props }) => <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white mt-6 sm:mt-8" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white mt-5 sm:mt-6" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white mt-4" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 sm:mb-6 text-gray-700 dark:text-gray-300" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 sm:mb-6 text-gray-700 dark:text-gray-300" {...props} />,
          li: ({ node, ...props }) => <li className="mb-2 text-gray-700 dark:text-gray-300" {...props} />,
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={tomorrow}
                language={match[1]}
                PreTag="div"
                className="rounded-lg overflow-hidden my-4 sm:my-6 text-sm"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 text-sm font-mono text-gray-800 dark:text-gray-200" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {conversation.response}
      </ReactMarkdown>
      {conversation.items.length > 0 && (
        <div className="mt-8 sm:mt-12">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">Recommended for You</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {conversation.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="relative">
                  <img src={item.image_link} alt={item.name_of_item} className="w-full h-48 object-cover" />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-900 rounded-full shadow-md"
                  >
                    <Heart size={20} className="text-red-500" />
                  </motion.button>
                </div>
                <div className="p-4 sm:p-6">
                  <h4 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white">{item.name_of_item}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">₹{item.cost.toFixed(2)}</span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(event) => handleAddToCart(item, event)}
                      className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center space-x-2"
                    >
                      <ShoppingBag size={16} />
                      <span className="hidden sm:inline">Add to Cart</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
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