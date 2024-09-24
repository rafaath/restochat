import React from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';

const IsolatedCart = ({ isOpen, onClose, theme, cartItems, onIncrement, onDecrement }) => {
  const total = cartItems.reduce((sum, item) => sum + item.cost * item.quantity, 0);

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
                {cartItems.map((item, index) => (
                  <div key={index} className={`flex justify-between items-center py-4 ${
                    theme === 'light' ? 'border-b border-gray-200' : 'border-b border-gray-700'
                  }`}>
                    <div className="flex items-center">
                      <img src={item.image_link} alt={item.name_of_item} className="w-16 h-16 object-cover rounded-lg mr-4" />
                      <div>
                        <h3 className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{item.name_of_item}</h3>
                        <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>₹{item.cost.toFixed(2)} x {item.quantity}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button onClick={() => onDecrement(item)} className={`p-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                        <Minus size={16} />
                      </button>
                      <span className={`mx-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{item.quantity}</span>
                      <button onClick={() => onIncrement(item)} className={`p-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                ))}
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
    </motion.div>
  );
};

export default IsolatedCart;