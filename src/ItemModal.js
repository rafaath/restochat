import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ImageIcon, Sparkles } from 'lucide-react';
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
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 300,
        duration: 0.4
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  if (!isOpen || !item) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black bg-opacity-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={`relative w-full max-w-4xl mx-auto overflow-hidden rounded-3xl shadow-2xl max-h-[85vh] min-h-[350px] ${theme === 'light'
          ? 'bg-white/95 backdrop-blur-md'
          : 'bg-gray-900/95 backdrop-blur-md'}`}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative h-72">
          {item.image_link ? (
            <motion.img
              src={item.image_link}
              alt={item.name_of_item}
              className="w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}>
              <ImageIcon size={64} className={theme === 'light' ? 'text-gray-400' : 'text-gray-500'} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />


          <motion.button
            onClick={(e) => {
              e.stopPropagation();  // Add this to prevent event bubbling
              onClose();
            }}
            className="absolute top-6 right-6 p-3 rounded-full bg-black/30 text-white backdrop-blur-md hover:bg-black/50 transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <X size={24} />
          </motion.button>

          <div className="absolute bottom-6 left-8 right-8">
            <div className="flex items-center space-x-2 mb-3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center bg-yellow-400 rounded-full px-3 py-1.5 shadow-lg"
              >
                <Star className="text-yellow-900 mr-1.5" size={16} />
                <span className="text-sm font-bold text-yellow-900">
                  {item.rating ? item.rating.toFixed(1) : 'N/A'}
                </span>
              </motion.div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-gray-200 font-medium"
              >
                ({item.number_of_people_rated || 0} ratings)
              </motion.span>
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-bold text-white mb-2 tracking-tight"
            >
              {item.name_of_item}
            </motion.h2>
          </div>
        </div>

        <div className="p-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-md mb-8 leading-relaxed ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}
          >
            {item.description || "No description available."}
          </motion.p>

          <div className="grid grid-cols-2 gap-8 mb-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className={`font-semibold mb-3 text-lg flex items-center gap-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'
                }`}>
                <Sparkles size={18} className="text-yellow-500" />
                Ingredients
              </h3>
              <p className={`text-sm leading-relaxed ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                {item.ingredients || "Ingredients information not available."}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className={`font-semibold mb-3 text-lg flex items-center gap-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'
                }`}>
                <Sparkles size={18} className="text-yellow-500" />
                Dietary Info
              </h3>
              <div className="flex flex-wrap gap-2">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium shadow-sm ${item.veg_or_non_veg === 'veg'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}
                >
                  {item.veg_or_non_veg === 'veg' ? '🥬 Veg' : '🍖 Non-veg'}
                </motion.span>
                {item.is_vegan === 'yes' && (
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-1.5 rounded-full text-xs font-medium shadow-sm bg-green-100 text-green-800"
                  >
                    🌱 Vegan
                  </motion.span>
                )}
                {item.is_gluten_free === 'yes' && (
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-1.5 rounded-full text-xs font-medium shadow-sm bg-yellow-100 text-yellow-800"
                  >
                    🌾 Gluten-free
                  </motion.span>
                )}
                {item.is_dairy_free === 'yes' && (
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-1.5 rounded-full text-xs font-medium shadow-sm bg-blue-100 text-blue-800"
                  >
                    🥛 Dairy-free
                  </motion.span>
                )}
              </div>
            </motion.div>
          </div>

          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className={`text-sm mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                Price
              </p>
              <p className="text-3xl font-bold text-blue-500">
                ₹{item.cost.toFixed(2)}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4"
            >
              <AnimatedAddToCartButton
                item={item}
                addToCart={handleAddToCart}
                removeFromCart={handleRemoveFromCart}
                theme={theme}
                quantity={getItemQuantity(item.item_id)}
                size="large"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ItemModal;