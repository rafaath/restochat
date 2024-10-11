import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, MessageCircle } from 'lucide-react';

const FloatingNav = ({ theme, activeTab, setActiveTab }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const NavButton = ({ icon: Icon, tab }) => (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setActiveTab(tab)}
      className={`p-2 rounded-full ${
        activeTab === tab
          ? 'bg-blue-500 text-white'
          : theme === 'light'
          ? 'bg-white text-gray-800'
          : 'bg-gray-800 text-white'
      }`}
    >
      <Icon size={24} />
    </motion.button>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex space-x-4 p-2 rounded-full shadow-lg ${
            theme === 'light' ? 'bg-white' : 'bg-gray-800'
          }`}
        >
          <NavButton icon={Home} tab="home" />
          <NavButton icon={MessageCircle} tab="chat" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingNav;