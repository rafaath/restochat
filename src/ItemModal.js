import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ImageIcon } from 'lucide-react';
import AnimatedAddToCartButton from './AnimatedAddToCartButton';

const ItemModal = ({ item, isOpen, onClose, theme, addToCart, removeFromCart, cart }) => {
  const getItemQuantity = (itemId) => {
    const cartItem = cart.find(item => item.item_id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = (item) => {
    addToCart({ ...item, quantity: getItemQuantity(item.item_id) + 1 });
  };

  const handleRemoveFromCart = (item) => {
    const newQuantity = Math.max(0, getItemQuantity(item.item_id) - 1);
    removeFromCart({ ...item, quantity: newQuantity });
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  };

  if (!isOpen || !item) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-50 "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={`relative w-full max-w-3xl mx-auto overflow-hidden rounded-2xl shadow-2xl ${
          theme === 'light' ? 'bg-white' : 'bg-gray-900'
        }`}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="relative h-80">
          {item.image_link ? (
            <img 
              src={item.image_link} 
              alt={item.name_of_item} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${
              theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
            }`}>
              <ImageIcon size={64} className={theme === 'light' ? 'text-gray-400' : 'text-gray-500'} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all duration-300"
          >
            <X size={24} />
          </button>
          <div className="absolute bottom-4 left-6 right-6">
            <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
              {item.name_of_item}
            </h2>
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-yellow-400 rounded-full px-2 py-1">
                <Star className="text-yellow-900 mr-1" size={16} />
                <span className="text-sm font-semibold text-yellow-900">
                  {item.rating ? item.rating.toFixed(1) : 'N/A'}
                </span>
              </div>
              <span className="text-sm text-gray-200">
                ({item.number_of_people_rated || 0} ratings)
              </span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <p className={`text-lg mb-6 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            {item.description || "No description available."}
          </p>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className={`font-semibold mb-2 text-lg ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>Ingredients</h3>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                {item.ingredients || "Ingredients information not available."}
              </p>
            </div>
            <div>
              <h3 className={`font-semibold mb-2 text-lg ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>Dietary Info</h3>
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  item.veg_or_non_veg === 'veg' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.veg_or_non_veg === 'veg' ? '🥬 Vegetarian' : '🍖 Non-vegetarian'}
                </span>
                {item.is_vegan === 'yes' && (
                  <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">🌱 Vegan</span>
                )}
                {item.is_gluten_free === 'yes' && (
                  <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">🌾 Gluten-free</span>
                )}
                {item.is_dairy_free === 'yes' && (
                  <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">🥛 Dairy-free</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className={`text-sm mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Price</p>
              <p className="text-3xl font-bold text-blue-600">₹{item.cost.toFixed(2)}</p>
            </div>
            <div className='mt-4'>
              <AnimatedAddToCartButton 
                item={item} 
                addToCart={handleAddToCart}
                removeFromCart={handleRemoveFromCart}
                theme={theme} 
                quantity={getItemQuantity(item.item_id)}
                size="large"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ItemModal;