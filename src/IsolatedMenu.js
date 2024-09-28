import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Plus, Minus, Star, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';

const IsolatedMenu = ({ isOpen, onClose, theme, menuItems, addToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const filteredMenuItems = useMemo(() => {
    if (!Array.isArray(menuItems)) return [];
    return menuItems.filter(item =>
      (item.name_of_item?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())) ?? false
    );
  }, [menuItems, searchTerm]);

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
    if (!selectedItem) return;
    setIsAddingToCart(true);
    for (let i = 0; i < quantity; i++) {
      await addToCart(selectedItem);
    }
    setIsAddingToCart(false);
    showAddToCartNotification(selectedItem.name_of_item || 'Item');
    setTimeout(() => {
      closeModal();
    }, 1500);
  };

  const addToCartFromMenu = async (item, event) => {
    event.stopPropagation();
    await addToCart(item);
    showAddToCartNotification(item.name_of_item || 'Item');
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

  const renderItemCard = (item, index) => (
    <motion.div 
      key={index} 
      className={`p-4 rounded-lg ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'} cursor-pointer flex flex-col h-[300px] sm:h-[400px]`}
      onClick={() => handleItemClick(item)}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="h-32 sm:h-48 overflow-hidden rounded-lg mb-2 sm:mb-4 relative">
        {item.image_link ? (
          <img src={item.image_link} alt={item.name_of_item || 'Menu item'} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <ImageIcon size={48} className="text-gray-400" />
          </div>
        )}
        {item.veg_or_non_veg && (
          <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold ${
            item.veg_or_non_veg === 'veg' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {item.veg_or_non_veg === 'veg' ? 'Veg' : 'Non-Veg'}
          </div>
        )}
      </div>
      <h3 className={`font-semibold text-base sm:text-lg mb-1 sm:mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
        {item.name_of_item || 'Unnamed Item'}
      </h3>
      {(item.rating != null && item.number_of_people_rated != null) ? (
        <div className="flex items-center mb-1">
          <Star className="text-yellow-400 mr-1" size={14} />
          <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            {item.rating?.toFixed(1) ?? 'N/A'} ({item.number_of_people_rated ?? 0} ratings)
          </span>
        </div>
      ) : (
        <div className="mb-1 text-xs text-gray-500">No ratings yet</div>
      )}
      <p className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} mb-2 sm:mb-4 flex-grow overflow-hidden`}>
        {item.description ? (item.description.length > 60 ? `${item.description.substring(0, 60)}...` : item.description) : 'No description available'}
      </p>
      <div className="mt-auto">
        <p className="text-blue-500 font-bold mb-2">
          {item.cost != null ? `₹${item.cost.toFixed(2)}` : 'Price not available'}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => addToCartFromMenu(item, e)}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center"
          disabled={item.cost == null}
        >
          <Plus size={16} className="mr-1" /> Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );

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
        } rounded-t-3xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto`}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
      >
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl sm:text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Menu</h2>
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
          {!Array.isArray(menuItems) ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredMenuItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <AlertCircle size={48} className="text-yellow-500 mb-4" />
              <p className={`text-lg ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                {searchTerm ? "No matching menu items found" : "No menu items available"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMenuItems.map(renderItemCard)}
            </div>
          )}
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
                {selectedItem.image_link ? (
                  <img
                    src={selectedItem.image_link}
                    alt={selectedItem.name_of_item || 'Menu item'}
                    className="w-full h-48 sm:h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 sm:h-64 bg-gray-300 flex items-center justify-center">
                    <ImageIcon size={64} className="text-gray-400" />
                  </div>
                )}
                <button 
                  onClick={closeModal}
                  className="absolute top-2 right-2 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 sm:p-6">
              <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
        {selectedItem.name_of_item || 'Unnamed Item'}
      </h3>
      {(selectedItem.rating != null && selectedItem.number_of_people_rated != null) ? (
        <div className="flex items-center mb-2 sm:mb-4">
          <Star className="text-yellow-400 mr-1" size={16} />
          <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            {selectedItem.rating?.toFixed(1) ?? 'N/A'} ({selectedItem.number_of_people_rated ?? 0} ratings)
          </span>
        </div>
      ) : (
        <div className="mb-2 sm:mb-4 text-sm text-gray-500">No ratings yet</div>
      )}
      <p className={`mb-4 text-sm sm:text-base ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
        {selectedItem.description || 'No description available'}
      </p>
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <p className="text-xl sm:text-2xl font-bold text-blue-600">
          {selectedItem.cost != null ? `₹${selectedItem.cost.toFixed(2)}` : 'Price not available'}
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
        className={`w-full bg-blue-500 text-white py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold transition-colors ${
          isAddingToCart || selectedItem.cost == null ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'
        }`}
        whileHover={{ scale: isAddingToCart || selectedItem.cost == null ? 1 : 1.05 }}
        whileTap={{ scale: isAddingToCart || selectedItem.cost == null ? 1 : 0.95 }}
        disabled={isAddingToCart || selectedItem.cost == null}
      >
        {isAddingToCart ? 'Adding to Cart...' : 
          (selectedItem.cost != null
            ? `Add to Cart - ₹${(selectedItem.cost * quantity).toFixed(2)}`
            : 'Price not available'
          )
        }
      </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showNotification && (
          <motion.div
            className="fixed top-4 right-4 transform -translate-x-1/2 z-70"
            variants={notificationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className={`px-4 py-2 rounded-full ${theme === 'light' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg flex items-center space-x-2`}>
              <Check size={18} className="text-green-500" />
              <span className="font-semibold">{notificationMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default IsolatedMenu;