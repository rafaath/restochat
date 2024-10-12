import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingBag, Check } from 'lucide-react';
import Lottie from 'lottie-react';
import animationData from './animation.json';

const LottieAnimation = ({ 
  width = 192, 
  height = 128, 
  zoom = 2,
  speed = 1,
  loop = true,
  autoplay = true,
}) => {
  return (
    <div 
      className="mx-auto my-1 overflow-hidden" 
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div 
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${100 * zoom}%`,
            height: `${100 * zoom}%`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Lottie 
            animationData={animationData} 
            loop={loop}
            autoplay={autoplay}
            speed={speed}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};

const AnimatedAddToCartButton = ({ onClick, theme }) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = useCallback(() => {
    setIsAdded(true);
    onClick();
    setTimeout(() => setIsAdded(false), 1500);
  }, [onClick]);

  return (
    <motion.button
      onClick={handleClick}
      className={`px-2 py-1 rounded-full text-xs font-medium flex items-center justify-center w-28 h-8 ${
        isAdded
          ? 'bg-green-500 text-white'
          : `bg-blue-600 text-white hover:bg-blue-700`
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
            <Check size={14} className="mr-1" />
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
            <ShoppingBag size={14} className="mr-1" />
            <span className="whitespace-nowrap">Add to Cart</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

const EmptyState = ({ theme, onItemClick, addToCart }) => {
  const [topRatedItems, setTopRatedItems] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    import('./full_menu.json').then(data => {
      const sortedItems = data.default
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6);
      setTopRatedItems(sortedItems);
    });
  }, []);

  const handleScroll = useCallback(() => {
    if (carouselRef.current) {
      const position = carouselRef.current.scrollLeft / (carouselRef.current.scrollWidth - carouselRef.current.clientWidth);
      setScrollPosition(position);
    }
  }, []);

  const headingGradient = theme === 'light'
    ? 'from-blue-600 to-indigo-500'
    : 'from-blue-400 to-indigo-300';

  const handleCardClick = useCallback((item, event) => {
    if (!event.target.closest('.add-to-cart-button')) {
      onItemClick(item);
    }
  }, [onItemClick]);

  return (
    <div className="h-full flex flex-col pt-1 p-auto space-y-4 max-w-4xl mx-auto no-scrollbar">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1 className={`text-2xl font-extrabold bg-gradient-to-r ${headingGradient} text-transparent bg-clip-text`}>
          Ask Anything. We'll Serve the Perfect Meal.
        </h1>
        <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
          Ask me anything about our menu, and I'll guide you to a dish worth savoring.
        </p>
      </motion.div>

      <div className="flex-shrink-0">
        <LottieAnimation />
      </div>

      <div className="flex-grow flex flex-col">
        <h2 className={`text-lg font-extrabold pl-3 text-left bg-gradient-to-r ${headingGradient} text-transparent bg-clip-text mb-4`}>
          Top-Rated Temptations
        </h2>

        <div className="relative flex-grow">
          <motion.div
            ref={carouselRef}
            className="flex overflow-x-auto scrollbar-hide space-x-4 pl-3 pr-2 pb-4 h-auto no-scrollbar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            onScroll={handleScroll}
          >
            <AnimatePresence>
              {topRatedItems.map((item, index) => (
                <motion.div
                  key={item.name_of_item}
                  className={`flex-shrink-0 w-64 h-auto rounded-xl overflow-hidden shadow-md cursor-pointer ${
                    theme === 'light' ? 'bg-white' : 'bg-gray-800'
                  }`}
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -20 }}
                  transition={{ delay: 0.05 * index, duration: 0.3 }}
                  whileHover={{ y: -3, boxShadow: '0px 3px 10px rgba(0,0,0,0.1)' }}
                  onClick={(event) => handleCardClick(item, event)}
                >
                  <div className="relative h-40">
                    <img src={item.image_link} alt={item.name_of_item} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                      <h3 className="font-bold text-white drop-shadow-md leading-tight text-sm" style={{ maxWidth: 'calc(100% - 3rem)' }}>
                        {item.name_of_item}
                      </h3>
                      <div className="flex items-center bg-yellow-400 rounded-full px-1.5 py-0.5 ml-1 flex-shrink-0">
                        <Star size={10} className="text-yellow-900 mr-0.5" />
                        <span className="text-xs font-bold text-yellow-900">{item.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 flex flex-col justify-between flex-grow">
                    <p className={`text-xs mb-2 line-clamp-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                      {item.description || 'Delicious dish awaits you!'}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <span className={`text-lg font-bold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                        ₹{item.cost.toFixed(0)}
                      </span>
                      <div className="add-to-cart-button" onClick={(e) => e.stopPropagation()}>
                        <AnimatedAddToCartButton
                          onClick={() => addToCart(item)}
                          theme={theme} 
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          
          {/* Scroll indicator */}
          <div className="flex justify-center mt-auto space-x-1">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  scrollPosition >= index / 6 && scrollPosition <= (index + 1) / 6
                    ? 'w-4 bg-blue-600'
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <p className={`text-xs text-center ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
          Explore favorites, dietary choices, and flavors designed to delight.
          <br />
          <span className="italic text-xs">We're in beta. Answers may vary.</span>
        </p>
      </div>
    </div>
  );
};

export default EmptyState;