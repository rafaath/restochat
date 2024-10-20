import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Clock, Utensils, DollarSign, Percent, Award, Leaf } from 'lucide-react';

const ComboDetailsModal = ({ isOpen, onClose, combo, theme }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen || !combo) return null;

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const contentVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { delay: 0.1, duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.2, ease: "easeIn" } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const getDiscountPercentage = () => {
    if (combo.cost && combo.discounted_cost) {
      const discount = ((combo.cost - combo.discounted_cost) / combo.cost * 100).toFixed(0);
      return parseInt(discount, 10);
    }
    return 0;
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
  const discountPercentage = getDiscountPercentage();
  const isVeg = combo.combo_items && combo.combo_items.every(item => item.veg_or_non_veg === 'veg');

  const fallbackImageUrl = 'https://via.placeholder.com/400x200?text=No+Image+Available';
  const displayImage = combo.image_links?.[0] || combo.image_link || combo.combo_items?.[0]?.image_link || fallbackImageUrl;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center  justify-center no-scrollbar">
      <div className="absolute inset-0 " onClick={onClose} />
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur flex items-center justify-center no-scrollbar overflow-hidden"
          style={{ minHeight: '-webkit-fill-available' }}
          onClick={onClose}
        >
          <motion.div
            variants={contentVariants}
            className={`w-full max-w-3xl rounded-2xl shadow-2xl max-h-[70vh] no-scrollbar overflow-y-auto m-4 ${
              theme === 'light' ? 'bg-white' : 'bg-gray-800'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent opacity-60"></div>
                <img 
                  src={displayImage}
                  alt={combo.combo_name} 
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    console.log('Image failed to load, using fallback');
                    e.target.src = fallbackImageUrl;
                  }}
                />
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <h2 className={`text-3xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                {combo.combo_name}
              </h2>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                {isVeg !== undefined && (
                  <span className={`flex items-center px-2 py-1 rounded-full text-sm ${
                    isVeg 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {isVeg ? (
                      <>
                        <Leaf size={14} className="mr-1" /> Vegetarian
                      </>
                    ) : (
                      <>
                        <Utensils size={14} className="mr-1" /> Non-Vegetarian
                      </>
                    )}
                  </span>
                )}
                {combo.combo_type && (
                  <span className="flex items-center px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    <Award size={14} className="mr-1" /> {capitalizeFirstLetter(combo.combo_type)}
                  </span>
                )}
                {combo.rating && (
                  <span className="flex items-center">
                    <Star size={16} className="text-yellow-400 mr-1" fill="currentColor" />
                    <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
                      {combo.rating.toFixed(1)}
                    </span>
                  </span>
                )}
                {combo.preparation_time && (
                  <span className="flex items-center">
                    <Clock size={16} className={`mr-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`} />
                    <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
                      {combo.preparation_time} mins
                    </span>
                  </span>
                )}
              </div>
              
              <p className={`text-lg mb-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                {combo.description}
              </p>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className={`text-3xl font-bold ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>
                  ₹{combo.discounted_cost ? combo.discounted_cost.toFixed(2) : combo.cost.toFixed(2)}
                </span>
                {discountPercentage > 0 && (
                  <>
                    <span className={`text-lg line-through ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
                      ₹{combo.cost.toFixed(2)}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      Save {discountPercentage}%
                    </span>
                  </>
                )}
              </div>
              
              {combo.combo_items && combo.combo_items.length > 0 && (
                <>
                  <h3 className={`text-xl font-semibold mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
                    Items in this combo:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {combo.combo_items.map((item, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center p-3 rounded-lg ${
                          theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'
                        }`}
                      >
                        <img src={item.image_link || fallbackImageUrl} alt={item.name_of_item} className="w-16 h-16 object-cover rounded-md mr-4" />
                        <div>
                          <h4 className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
                            {item.name_of_item}
                          </h4>
                          <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                            {item.description ? item.description.substring(0, 500): 'No description available'} {/* + '...' */}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
              
              {combo.nutrition && (
                <div className="mb-6">
                  <h3 className={`text-xl font-semibold mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
                    Nutrition Information
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {Object.entries(combo.nutrition).map(([key, value]) => (
                      <div key={key} className={`p-3 rounded-lg ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900'}`}>
                        <p className={`text-sm font-medium ${theme === 'light' ? 'text-blue-800' : 'text-blue-200'}`}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </p>
                        <p className={`text-lg font-bold ${theme === 'light' ? 'text-blue-600' : 'text-blue-300'}`}>
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {combo.additional_info && combo.additional_info.length > 0 && (
                <div className="mb-6">
                  <h3 className={`text-xl font-semibold mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
                    Additional Information
                  </h3>
                  <ul className={`list-disc list-inside ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                    {combo.additional_info.map((info, index) => (
                      <li key={index}>{info}</li>
                    ))}
                  </ul>
                </div>
              )}
             </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
    
  );
};

export default ComboDetailsModal;