import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingBag } from 'lucide-react';
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

const EmptyState = ({ theme }) => {
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

  const handleScroll = () => {
    if (carouselRef.current) {
      const position = carouselRef.current.scrollLeft / (carouselRef.current.scrollWidth - carouselRef.current.clientWidth);
      setScrollPosition(position);
    }
  };

  const headingGradient = theme === 'light'
    ? 'from-blue-600 to-indigo-500'
    : 'from-blue-400 to-indigo-300';

  return (
    <div className={`h-full flex flex-col p-2 space-y-1`}>
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

      <LottieAnimation />

      <h2 className={`text-lg font-extrabold text-left bg-gradient-to-r ${headingGradient} text-transparent bg-clip-text`}>
        Top-Rated Temptations
      </h2>

      <div className="flex-grow relative">
        <motion.div
          ref={carouselRef}
          className="flex overflow-x-auto scrollbar-hide space-x-3 pb-2 no-scrollbar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          onScroll={handleScroll}
        >
          <AnimatePresence>
            {topRatedItems.map((item, index) => (
              <motion.div
                key={item.name_of_item}
                className={`flex-shrink-0 w-48 h-60 rounded-xl overflow-hidden shadow-md ${
                  theme === 'light' ? 'bg-white' : 'bg-gray-800'
                }`}
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -20 }}
                transition={{ delay: 0.05 * index, duration: 0.3 }}
                whileHover={{ y: -3, boxShadow: '0px 3px 10px rgba(0,0,0,0.1)' }}
              >
                <div className="relative h-28">
                  <img src={item.image_link} alt={item.name_of_item} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-1 left-1 right-1 flex justify-between items-end">
                    <h3 className="font-bold text-white drop-shadow-md leading-tight text-sm" style={{ maxWidth: 'calc(100% - 3rem)' }}>
                      {item.name_of_item}
                    </h3>
                    <div className="flex items-center bg-yellow-400 rounded-full px-1.5 py-0.5 ml-1 flex-shrink-0">
                      <Star size={10} className="text-yellow-900 mr-0.5" />
                      <span className="text-xs font-bold text-yellow-900">{item.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <div className="p-2 flex flex-col justify-between h-32">
                  <p className={`text-xs mb-1 line-clamp-3 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                    {item.description || 'Delicious dish awaits you!'}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-bold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                      ₹{item.cost.toFixed(0)}
                    </span>
                    <motion.button 
                      className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs font-medium flex items-center"
                      whileHover={{ scale: 1.05, backgroundColor: '#4F46E5' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ShoppingBag size={12} className="mr-1" />
                      Add to Cart
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {/* Scroll indicator */}
        <div className="flex justify-center mt-2 space-x-1">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                scrollPosition >= index / 5 && scrollPosition <= (index + 1) / 5
                  ? 'w-4 bg-blue-600'
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        <p className={`text-xs text-center mt-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
          Explore favorites, dietary choices, and flavors designed to delight.
          <br />
          <span className="italic text-xs">We're in beta. Answers may vary.</span>
        </p>
      </div>
    </div>
  );
};

export default EmptyState;