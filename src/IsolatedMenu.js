import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Plus, Minus, Star, Check } from 'lucide-react';

const IsolatedMenu = ({ isOpen, onClose, theme, menuItems, addToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const filteredMenuItems = menuItems.filter(item =>
    item.name_of_item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setQuantity(1);
  };

  const closeModal = useCallback(() => {
    setSelectedItem(null);
    setQuantity(1);
    setIsAddingToCart(false);
  }, []);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const showAddToCartNotification = (itemName) => {
    setNotificationMessage(`${itemName} added to cart`);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 1500);
  };

  const addToCartWithQuantity = async () => {
    setIsAddingToCart(true);
    for (let i = 0; i < quantity; i++) {
      await addToCart(selectedItem);
    }
    setIsAddingToCart(false);
    showAddToCartNotification(selectedItem.name_of_item);
    setTimeout(() => {
      closeModal();
    }, 1500);
  };

  const addToCartFromMenu = async (item, event) => {
    event.stopPropagation();
    await addToCart(item);
    showAddToCartNotification(item.name_of_item);
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 }
  };

  const notificationVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 }
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
        } rounded-t-3xl max-h-[80vh] overflow-y-auto`}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Menu</h2>
            <button onClick={onClose} className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
              <X size={24} />
            </button>
          </div>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full p-2 pl-10 rounded-full ${
                theme === 'light' 
                  ? 'bg-gray-100 text-gray-800' 
                  : 'bg-gray-800 text-white'
              }`}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMenuItems.map((item, index) => (
              <motion.div 
                key={index} 
                className={`p-4 rounded-lg ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'} cursor-pointer flex flex-col h-[400px]`}
                onClick={() => handleItemClick(item)}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="h-48 overflow-hidden rounded-lg mb-4">
                  <img src={item.image_link} alt={item.name_of_item} className="w-full h-full object-cover" />
                </div>
                <h3 className={`font-semibold text-lg mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{item.name_of_item}</h3>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} mb-4 flex-grow overflow-hidden`}>
                  {item.description.length > 100 ? `${item.description.substring(0, 100)}...` : item.description}
                </p>
                <div className="mt-auto">
                  <p className="text-blue-500 font-bold mb-2">₹{item.cost.toFixed(2)}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => addToCartFromMenu(item, e)}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center"
                  >
                    <Plus size={16} className="mr-1" /> Add to Cart
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
      {selectedItem && (
          <motion.div
            className="fixed inset-0 z-60 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            />
            <motion.div
              className={`relative max-w-[90%] w-full sm:max-w-[425px] mx-auto p-0 overflow-hidden rounded-2xl ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedItem.image_link}
                  alt={selectedItem.name_of_item}
                  className="w-full h-64 object-cover"
                />
                <button 
                  onClick={closeModal}
                  className="absolute top-2 right-2 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <h3 className={`text-2xl font-bold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  {selectedItem.name_of_item}
                </h3>
                <div className="flex items-center mb-4">
                  <Star className="text-yellow-400 mr-1" size={16} />
                  <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                    4.5 (120 reviews)
                  </span>
                </div>
                <p className={`mb-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  {selectedItem.description}
                </p>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-2xl font-bold text-blue-600">
                    ₹{selectedItem.cost.toFixed(2)}
                  </p>
                  <div className="flex items-center">
                    <button 
                      onClick={decrementQuantity}
                      className={`p-2 rounded-full ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}
                      disabled={isAddingToCart}
                    >
                      <Minus size={16} />
                    </button>
                    <span className={`mx-4 font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      {quantity}
                    </span>
                    <button 
                      onClick={incrementQuantity}
                      className={`p-2 rounded-full ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}
                      disabled={isAddingToCart}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <motion.button
                  onClick={addToCartWithQuantity}
                  className={`w-full bg-blue-500 text-white py-3 rounded-full text-lg font-semibold transition-colors ${
                    isAddingToCart ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'
                  }`}
                  whileHover={{ scale: isAddingToCart ? 1 : 1.05 }}
                  whileTap={{ scale: isAddingToCart ? 1 : 0.95 }}
                  disabled={isAddingToCart}
                >
                  {isAddingToCart ? 'Adding to Cart...' : `Add to Cart - ₹${(selectedItem.cost * quantity).toFixed(2)}`}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showNotification && (
          <motion.div
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-70"
            variants={notificationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className={`px-4 py-2 rounded-full ${theme === 'light' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg flex items-center space-x-2`}>
              <Check size={18} className="text-green-500" />
              <span className="font-semibold">Added to Cart</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default IsolatedMenu;