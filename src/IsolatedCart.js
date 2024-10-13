import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingCart, Package } from 'lucide-react';
import ComboDetailsModal from './ComboDetailsModal'; // Make sure to import the new component

const CombinedImage = ({ images, size = 64 }) => {
  const imageCount = images.length;
  const gridSize = Math.ceil(Math.sqrt(imageCount));

  return (
    <div 
      style={{
        width: size,
        height: size,
        display: 'grid',
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        gap: '2px',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {images.map((src, index) => (
        <img 
          key={index} 
          src={src} 
          alt={`Combo item ${index + 1}`} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      ))}
    </div>
  );
};

const IsolatedCart = ({ isOpen, onClose, theme, cartItems, addToCart, removeFromCart }) => {
  const total = cartItems.reduce((sum, item) => sum + item.cost * item.quantity, 0);
  const [selectedCombo, setSelectedCombo] = useState(null);

  const handleIncrement = (item) => {
    addToCart({ ...item, quantity: item.quantity + 1 });
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      addToCart({ ...item, quantity: item.quantity - 1 });
    } else {
      removeFromCart(item);
    }
  };

  const renderCartItem = (item) => {
    const isCombo = item.isCombo;
    return (
      <div 
        key={isCombo ? `${item.combo_id}-${item.uniqueId}` : item.item_id} 
        className={`flex justify-between items-center py-4 ${
          theme === 'light' ? 'border-b border-gray-200' : 'border-b border-gray-700'
        }`}
        onClick={() => isCombo && setSelectedCombo(item)}
      >
        <div className="flex items-center cursor-pointer">
          {isCombo ? (
            <CombinedImage images={item.image_links} size={64} />
          ) : (
            <img src={item.image_link} alt={item.name_of_item} className="w-16 h-16 object-cover rounded-lg mr-4" />
          )}
          <div className="ml-4">
            <h3 className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              {isCombo ? (
                <span className="flex items-center">
                  <Package size={16} className="mr-2" />
                  {item.combo_name}
                </span>
              ) : item.name_of_item}
            </h3>
            <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>₹{item.cost.toFixed(2)} x {item.quantity}</p>
          </div>
        </div>
        <div className="flex items-center">
          <button 
            onClick={(e) => { e.stopPropagation(); removeFromCart(item); }} 
            className={`p-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}
          >
            <Minus size={16} />
          </button>
          <span className={`mx-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{item.quantity}</span>
          <button 
            onClick={(e) => { e.stopPropagation(); addToCart(item); }} 
            className={`p-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <motion.div 
        className={`absolute bottom-0 left-0 right-0 ${
          theme === 'light' ? 'bg-white' : 'bg-gray-900'
        } rounded-t-3xl min-h-[60vh] max-h-[80vh] overflow-y-auto`}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Your Cart</h2>
            <button onClick={onClose} className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
              <X size={24} />
            </button>
          </div>
          {cartItems.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center">
              <ShoppingCart size={64} className={`${theme === 'light' ? 'text-gray-300' : 'text-gray-600'} mb-4`} />
              <p className={`text-center ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} text-lg`}>Your cart is empty</p>
              <p className={`text-center ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'} mt-2`}>Add some delicious items to get started!</p>
            </div>
          ) : (
            <>
              <div className="flex-grow">
                {cartItems.map(renderCartItem)}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Total: ₹{total.toFixed(2)}
                </p>
                <button className="w-full mt-4 bg-blue-500 text-white py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors">
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
      <ComboDetailsModal
        isOpen={!!selectedCombo}
        onClose={() => setSelectedCombo(null)}
        combo={selectedCombo}
        theme={theme}
      />
    </motion.div>
  );
};

export default IsolatedCart;