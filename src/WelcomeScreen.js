import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Sparkles, ChevronRight, Coffee, Pizza, Cake, ArrowRight, ArrowLeft } from 'lucide-react';

const WelcomeScreen = ({ onGetStarted, theme }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef(0);
  const slideContainerRef = useRef(null);
  const controls = useAnimation();

  const slides = [
    {
      title: "Welcome to RestoChat",
      description: "Your personal culinary concierge",
      icon: Sparkles,
      color: "text-blue-500"
    },
    {
      title: "Discover Your Next Favorite",
      description: "Personalized recommendations just for you",
      icon: Coffee,
      color: "text-amber-500"
    },
    {
      title: "Effortless Ordering",
      description: "From craving to savoring in moments",
      icon: Pizza,
      color: "text-green-500"
    },
    {
      title: "Culinary Adventures Await",
      description: "Start your gastronomic journey now",
      icon: Cake,
      color: "text-purple-500"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isDragging) {
        nextSlide();
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [isDragging]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleDragStart = (event, info) => {
    setIsDragging(true);
    dragStartRef.current = info.point.x;
  };

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    const dragEnd = info.point.x;
    const dragThreshold = 50;

    if (dragStartRef.current - dragEnd > dragThreshold) {
      nextSlide();
    } else if (dragEnd - dragStartRef.current > dragThreshold) {
      prevSlide();
    } else {
      controls.start({ x: 0 });
    }
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <motion.div 
      className={`fixed inset-0 flex flex-col items-center justify-center p-6 min-h-screen ${
        theme === 'light' ? 'bg-gradient-to-br from-blue-50 to-indigo-100' : 'bg-gradient-to-br from-gray-900 to-indigo-900'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative w-full max-w-md mx-auto overflow-hidden min-h-[400px]">
        <AnimatePresence initial={false} custom={currentSlide}>
          <motion.div
            key={currentSlide}
            ref={slideContainerRef}
            custom={currentSlide}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div 
              className={`mb-8 p-4 rounded-full ${slides[currentSlide].color} ${
                theme === 'light' ? 'bg-white' : 'bg-gray-800'
              } shadow-lg`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              {React.createElement(slides[currentSlide].icon, { size: 48 })}
            </motion.div>
            <motion.h1 
              className={`text-4xl font-bold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {slides[currentSlide].title}
            </motion.h1>
            <motion.p 
              className={`text-xl ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {slides[currentSlide].description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="flex justify-between items-center w-full max-w-md mt-8 mb-8">
        <motion.button
          onClick={prevSlide}
          className={`p-2 rounded-full ${
            theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-800 text-white'
          } shadow-md`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft size={24} />
        </motion.button>
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <motion.div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide 
                  ? slides[currentSlide].color
                  : theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'
              }`}
              initial={false}
              animate={{ scale: index === currentSlide ? 1.5 : 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          ))}
        </div>
        <motion.button
          onClick={nextSlide}
          className={`p-2 rounded-full ${
            theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-800 text-white'
          } shadow-md`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowRight size={24} />
        </motion.button>
      </div>

      <motion.button
        onClick={onGetStarted}
        className={`flex items-center space-x-2 px-8 py-4 rounded-full text-white font-semibold text-lg ${
          theme === 'light' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'
        } transition-colors shadow-lg`}
        whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 500, damping: 30 }}
      >
        <span>Start Your Journey</span>
        <ChevronRight size={24} />
      </motion.button>
    </motion.div>
  );
};

export default WelcomeScreen;
