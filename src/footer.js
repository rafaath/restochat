import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react';

const Footer = ({ theme, isPromptsExpanded, setIsPromptsExpanded, toggleMenu, toggleCart, isMenuOpen, isCartOpen, cartItemCount }) => {
  return (
    <footer className={`fixed bottom-0 left-0 right-0 z-50 shadow-lg ${
      theme === 'light' ? 'bg-white' : 'bg-gray-900'
    }`}>
      <div className="max-w-md mx-auto px-4 py-2">
        <nav className="flex justify-around items-center">
          <NavButton 
            icon={Menu} 
            text="Menu" 
            onClick={toggleMenu} 
            isActive={isMenuOpen}
            theme={theme}
          />
          <NavButton
            icon={isPromptsExpanded ? ChevronDown : ChevronUp}
            text={isPromptsExpanded ? "Hide" : "Inspire"}
            onClick={() => setIsPromptsExpanded(!isPromptsExpanded)}
            isActive={isPromptsExpanded}
            theme={theme}
          />
          <NavButton 
            icon={ShoppingCart} 
            text="Cart" 
            onClick={toggleCart} 
            isActive={isCartOpen}
            badge={cartItemCount > 0 ? cartItemCount : null}
            theme={theme}
          />
        </nav>
      </div>
    </footer>
  );
};

const NavButton = ({ icon: Icon, text, onClick, isActive, badge = null }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-300 w-16 relative ${
        isActive
          ? 'text-blue-500'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      <div className="relative">
        <Icon size={20} />
        {badge !== null && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold"
          >
            {badge}
          </motion.div>
        )}
      </div>
      <span className="text-[0.6rem] font-medium">{text}</span>
    </motion.button>
  );

export default Footer;