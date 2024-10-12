import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Plus, Minus, Star, Check, AlertCircle, Image as ImageIcon, Filter, Sparkles, Coffee, Pizza, Cake, Compass, ChevronRight, ChevronLeft, Loader, ShoppingBag } from 'lucide-react';
import AnimatedAddToCartButton from './AnimatedAddToCartButton';

const HorizontalScroll = ({ items, renderItem }) => {
  const scrollContainerRef = useRef(null);
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      const handleScroll = () => {
        scrollPositionRef.current = scrollContainer.scrollLeft;
      };

      scrollContainer.addEventListener('scroll', handleScroll);

      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.scrollLeft = scrollPositionRef.current;
    }
  });

  return (
    <div 
      ref={scrollContainerRef}
      className="flex overflow-x-auto space-x-4 py-2 no-scrollbar"
      style={{ scrollBehavior: 'smooth', overflowY: 'hidden' }}
    >
      {items.map((item, index) => (
        <div key={item.item_id || index} className="flex-shrink-0">
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
};

const Notification = ({ show, theme }) => {
  const notificationVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-4 right-4 z-[9999]"
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
  );
};

// const AnimatedAddToCartButton = ({ item, addToCart, theme, quantity }) => {
//   const [isAdded, setIsAdded] = useState(false);
//   const [showIncrement, setShowIncrement] = useState(quantity > 0);

//   const handleAddToCart = useCallback((e) => {
//     e.stopPropagation();
//     setIsAdded(true);
//     addToCart({ ...item, quantity: quantity + 1 });
//     setTimeout(() => {
//       setIsAdded(false);
//       setShowIncrement(true);
//     }, 1500);
//   }, [addToCart, item, quantity]);

//   const handleIncrement = useCallback((e) => {
//     e.stopPropagation();
//     addToCart({ ...item, quantity: quantity + 1 });
//   }, [addToCart, item, quantity]);

//   const handleDecrement = useCallback((e) => {
//     e.stopPropagation();
//     const newQuantity = Math.max(0, quantity - 1);
//     addToCart({ ...item, quantity: newQuantity });
//     if (newQuantity === 0) {
//       setShowIncrement(false);
//     }
//   }, [addToCart, item, quantity]);

//   useEffect(() => {
//     if (quantity > 0 && !isAdded) {
//       setShowIncrement(true);
//     }
//   }, [quantity, isAdded]);

//   return (
//     <motion.div className="relative w-28 h-8">
//       <AnimatePresence initial={false}>
//         {!showIncrement ? (
//           <motion.button
//             key="add-to-cart"
//             initial={{ opacity: 0, scale: 0.5 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.5 }}
//             onClick={handleAddToCart}
//             className={`absolute inset-0 px-2 py-1 rounded-full text-xs font-medium flex items-center justify-center ${
//               isAdded
//                 ? 'bg-green-500 text-white'
//                 : `bg-blue-600 text-white hover:bg-blue-700`
//             } transition-colors duration-300`}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <AnimatePresence mode="wait">
//               {isAdded ? (
//                 <motion.div
//                   key="check"
//                   initial={{ opacity: 0, scale: 0.5 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.5 }}
//                   className="flex items-center"
//                 >
//                   <Check size={14} className="mr-1" />
//                   <span className="whitespace-nowrap">Added</span>
//                 </motion.div>
//               ) : (
//                 <motion.div
//                   key="add"
//                   initial={{ opacity: 0, scale: 0.5 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.5 }}
//                   className="flex items-center"
//                 >
//                   <ShoppingBag size={14} className="mr-1" />
//                   <span className="whitespace-nowrap">Add to Cart</span>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.button>
//         ) : (
//           <motion.div
//             key="increment-decrement"
//             initial={{ opacity: 0, scale: 0.5 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.5 }}
//             className="absolute inset-0 flex items-center justify-between bg-gray-200 rounded-full p-1"
//           >
//             <motion.button
//               onClick={handleDecrement}
//               className={`p-1 rounded-full ${theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-700 text-white'}`}
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//             >
//               <Minus size={14} />
//             </motion.button>
//             <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{quantity}</span>
//             <motion.button
//               onClick={handleIncrement}
//               className={`p-1 rounded-full ${theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-700 text-white'}`}
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//             >
//               <Plus size={14} />
//             </motion.button>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// };


const IsolatedMenu = ({ isOpen, onClose, theme, menuItems, addToCart, cart }) => {
  const [view, setView] = useState('explore');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    veg: false,
    nonVeg: false,
    highRated: false,
  });

  const [showNotification, setShowNotification] = useState(false);
  const getItemQuantity = useCallback((itemId) => {
    const cartItem = cart.find(item => item.item_id === itemId);
    return cartItem ? cartItem.quantity : 0;
  }, [cart]);

  const notificationVariants = {
    hidden: { opacity: 0, y: -50, x: '-50%' },
    visible: { opacity: 1, y: 0, x: '-50%' },
    exit: { opacity: 0, y: -50, x: '-50%' },
  };

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      setTimeout(() => {
        if (menuItems && menuItems.length > 0) {
          setLoading(false);
        } else {
          setError('Failed to load menu items. Please try again.');
          setLoading(false);
        }
      }, 1000);
    }
  }, [isOpen, menuItems]);

  const filteredItems = useMemo(() => {
    if (!menuItems) return [];
    return menuItems.filter(item => {
      const matchesVeg = !activeFilters.veg || item.veg_or_non_veg === 'veg';
      const matchesNonVeg = !activeFilters.nonVeg || item.veg_or_non_veg === 'non-veg';
      const matchesHighRated = !activeFilters.highRated || (item.rating && item.rating >= 4.0);
      
      return matchesVeg && matchesNonVeg && matchesHighRated;
    });
  }, [menuItems, activeFilters]);

  const searchFilteredItems = useMemo(() => {
    return filteredItems.filter(item => 
      (item.name_of_item && item.name_of_item.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.ingredients && item.ingredients.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.cuisine && item.cuisine.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [filteredItems, searchTerm]);

  const categorizedItems = useMemo(() => {
    return filteredItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});
  }, [filteredItems]);

  const cuisines = useMemo(() => {
    return [...new Set(filteredItems.map(item => item.cuisine).filter(Boolean))];
  }, [filteredItems]);

  const renderExploreView = () => (
    <div className="space-y-6">
      {Object.entries(categorizedItems).map(([category, items]) => (
        <div key={category} className="space-y-2">
          <h2 className={`text-xl font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            {category}
          </h2>
          <HorizontalScroll items={items} renderItem={renderScrollItemCard} />
        </div>
      ))}
    </div>
  );

  const renderSearchView = () => {
    return (
      <div className="space-y-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full p-2 pl-10 rounded-full ${
              theme === 'light' ? 'bg-gray-100 text-gray-800' : 'bg-gray-800 text-white'
            }`}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <div className="flex flex-wrap gap-2">
          {cuisines.map(cuisine => (
            <motion.button
              key={cuisine}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                searchTerm === cuisine
                  ? 'bg-blue-500 text-white'
                  : theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-700 text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchTerm(cuisine)}
            >
              {cuisine}
            </motion.button>
          ))}
        </div>
        <div className="space-y-4">
          {searchFilteredItems.map(item => (
            <div key={item.item_id} className="w-full">
              {renderSearchItemCard(item, true)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDiscoverView = () => {
    const categories = [
      { name: 'Chef\'s Specials', icon: Sparkles, filter: item => item.rating > 4.5 },
      { name: 'Healthy Options', icon: Compass, filter: item => item.health_concious_option === 'yes' },
      { name: 'Popular Items', icon: Coffee, filter: item => item.number_of_people_rated > 50 },
      { name: 'Main Course', icon: Pizza, filter: item => item.meal_course_type === 'main course' },
      { name: 'Desserts', icon: Cake, filter: item => item.category && item.category.toLowerCase().includes('dessert') },
    ];

    return (
      <div className="space-y-8">
        {categories.map(category => {
          const categoryItems = filteredItems.filter(category.filter);
          if (categoryItems.length === 0) return null;
          return (
            <div key={category.name}>
              <div className="flex items-center mb-4">
                <category.icon className={`mr-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`} size={24} />
                <h2 className={`text-xl font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  {category.name}
                </h2>
              </div>
              <HorizontalScroll items={categoryItems} renderItem={renderScrollItemCard} />
            </div>
          );
        })}
      </div>
    );
  };

  // Horizontal scroll view card
const renderScrollItemCard = (item) => (
  <motion.div 
    key={item.item_id}
    className={`p-4 rounded-lg ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} shadow-md cursor-pointer w-64 flex-shrink-0 flex flex-col h-80`}
    onClick={() => setSelectedItem(item)}
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    <div className="h-36 overflow-hidden rounded-lg mb-2 relative">
      {item.image_link ? (
        <img src={item.image_link} alt={item.name_of_item} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
          <ImageIcon size={48} className="text-gray-400" />
        </div>
      )}
      <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold ${
        item.veg_or_non_veg === 'veg' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`}>
        {item.veg_or_non_veg === 'veg' ? 'Veg' : 'Non-Veg'}
      </div>
    </div>
    <h3 className={`font-semibold text-sm mb-1 line-clamp-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
      {item.name_of_item}
    </h3>
    <div className="flex items-center mb-1">
      <Star className="text-yellow-400 mr-1" size={12} />
      <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
        {item.rating ? item.rating.toFixed(1) : 'N/A'} ({item.number_of_people_rated || 0})
      </span>
    </div>
    <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} mb-2 line-clamp-2 flex-grow`}>
      {item.description}
    </p>
    <div className="flex justify-between items-center mt-auto">
      <p className="text-blue-500 font-bold text-sm">₹{item.cost.toFixed(2)}</p>
      <AnimatedAddToCartButton 
          item={item} 
          addToCart={addToCart} 
          theme={theme} 
          quantity={getItemQuantity(item.item_id)}
        />
    </div>
  </motion.div>
);

// Search view card
const renderSearchItemCard = (item) => (
  <motion.div 
    key={item.item_id}
    className={`p-4 rounded-lg ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} shadow-md cursor-pointer w-full flex mb-4 hover:shadow-lg transition-shadow duration-300`}
    onClick={() => setSelectedItem(item)}
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    <div className="w-32 h-32 overflow-hidden rounded-lg mr-4 relative flex-shrink-0">
      {item.image_link ? (
        <img src={item.image_link} alt={item.name_of_item} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
          <ImageIcon size={32} className="text-gray-400" />
        </div>
      )}
      <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold ${
        item.veg_or_non_veg === 'veg' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`}>
        {item.veg_or_non_veg === 'veg' ? 'Veg' : 'Non-Veg'}
      </div>
    </div>
    <div className="flex-grow flex flex-col justify-between">
      <div>
        <h3 className={`font-semibold text-lg mb-1 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          {item.name_of_item}
        </h3>
        <div className="flex items-center mb-2">
          <Star className="text-yellow-400 mr-1" size={16} />
          <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            {item.rating ? item.rating.toFixed(1) : 'N/A'} ({item.number_of_people_rated || 0})
          </span>
        </div>
        <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} line-clamp-2`}>
          {item.description}
        </p>
      </div>
      <div className="flex justify-between items-center mt-3">
        <p className="text-blue-500 font-bold text-lg">₹{item.cost.toFixed(2)}</p>
        <AnimatedAddToCartButton 
          item={item} 
          addToCart={addToCart} 
          theme={theme} 
          quantity={getItemQuantity(item.item_id)}
        />
      </div>
    </div>
  </motion.div>
);

  const renderItemCard = (item, fullWidth = false) => (
    <motion.div 
      key={item.item_id}
      className={`p-4 rounded-lg ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} shadow-md cursor-pointer ${fullWidth ? 'w-full' : 'w-64 flex-shrink-0'}`}
      onClick={() => setSelectedItem(item)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className={`${fullWidth ? 'flex' : ''}`}>
        <div className={`${fullWidth ? 'w-1/3 mr-4' : 'h-40'} overflow-hidden rounded-lg mb-4 relative`}>
          {item.image_link ? (
            <img src={item.image_link} alt={item.name_of_item} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <ImageIcon size={48} className="text-gray-400" />
            </div>
          )}
          <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold ${
            item.veg_or_non_veg === 'veg' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {item.veg_or_non_veg === 'veg' ? 'Veg' : 'Non-Veg'}
          </div>
        </div>
        <div className={`${fullWidth ? 'w-2/3' : ''}`}>
          <h3 className={`font-semibold text-lg mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            {item.name_of_item}
          </h3>
          <div className="flex items-center mb-2">
            <Star className="text-yellow-400 mr-1" size={16} />
            <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
              {item.rating ? item.rating.toFixed(1) : 'N/A'} ({item.number_of_people_rated || 0})
            </span>
          </div>
          <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} mb-2 line-clamp-2`}>
            {item.description}
          </p>
          <div className="flex justify-between items-center">
            <p className="text-blue-500 font-bold">₹{item.cost.toFixed(2)}</p>
            <AnimatedAddToCartButton 
          item={item} 
          addToCart={addToCart} 
          theme={theme} 
          quantity={getItemQuantity(item.item_id)}
        />
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderItemModal = () => (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`relative w-full max-w-3xl mx-auto overflow-hidden rounded-2xl shadow-2xl ${
          theme === 'light' ? 'bg-white' : 'bg-gray-900'
        }`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="relative h-80">
          <img 
            src={selectedItem.image_link} 
            alt={selectedItem.name_of_item} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
          <button 
            onClick={() => setSelectedItem(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all duration-300"
          >
            <X size={24} />
          </button>
          <div className="absolute bottom-4 left-6 right-6">
            <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
              {selectedItem.name_of_item}
            </h2>
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-yellow-400 rounded-full px-2 py-1">
                <Star className="text-yellow-900 mr-1" size={16} />
                <span className="text-sm font-semibold text-yellow-900">
                  {selectedItem.rating ? selectedItem.rating.toFixed(1) : 'N/A'}
                </span>
              </div>
              <span className="text-sm text-gray-200">
                ({selectedItem.number_of_people_rated || 0} ratings)
              </span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <p className={`text-lg mb-6 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            {selectedItem.description}
          </p>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className={`font-semibold mb-2 text-lg ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>Ingredients</h3>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                {selectedItem.ingredients}
              </p>
            </div>
            <div>
              <h3 className={`font-semibold mb-2 text-lg ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>Dietary Info</h3>
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  selectedItem.veg_or_non_veg === 'veg' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedItem.veg_or_non_veg === 'veg' ? '🥬 Vegetarian' : '🍖 Non-vegetarian'}
                </span>
                {selectedItem.is_vegan === 'yes' && (
                  <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">🌱 Vegan</span>
                )}
                {selectedItem.is_gluten_free === 'yes' && (
                  <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">🌾 Gluten-free</span>
                )}
                {selectedItem.is_dairy_free === 'yes' && (
                  <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">🥛 Dairy-free</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className={`text-sm mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Price</p>
              <p className="text-3xl font-bold text-blue-600">₹{selectedItem.cost.toFixed(2)}</p>
            </div>
            <AnimatedAddToCartButton 
            item={selectedItem} 
            addToCart={addToCart} 
            theme={theme} 
            quantity={getItemQuantity(selectedItem.item_id)}
            size="large"  // Use the large size here
          />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );


  const MainFilters = () => (
    <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
      <FilterButton
        label="Veg"
        isActive={activeFilters.veg}
        onClick={() => setActiveFilters(prev => ({ ...prev, veg: !prev.veg, nonVeg: false }))}
      />
      <FilterButton
        label="Non-Veg"
        isActive={activeFilters.nonVeg}
        onClick={() => setActiveFilters(prev => ({ ...prev, nonVeg: !prev.nonVeg, veg: false }))}
      />
      <FilterButton
        label="4.0+ Rated"
        isActive={activeFilters.highRated}
        onClick={() => setActiveFilters(prev => ({ ...prev, highRated: !prev.highRated }))}
      />
    </div>
  );

  const FilterButton = ({ label, isActive, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        isActive
          ? 'bg-blue-500 text-white'
          : `${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-700 text-white'}`
      }`}
    >
      {label}
    </motion.button>
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
        className={`absolute inset-x-0 bottom-0 ${
          theme === 'light' ? 'bg-white' : 'bg-gray-900'
        } rounded-t-3xl overflow-hidden`}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        style={{ height: 'calc(100% - 1rem)' }}
      >
        <div className="h-full flex flex-col">
          <div className="sticky top-0 z-10 bg-inherit p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl sm:text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Menu</h2>
              <button onClick={onClose} className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
                <X size={24} />
              </button>
            </div>
            <MainFilters />
            <div className="flex space-x-4">
              <TabButton icon={Compass} text="Explore" isActive={view === 'explore'} onClick={() => setView('explore')} />
              <TabButton icon={Search} text="Search" isActive={view === 'search'} onClick={() => setView('search')} />
              <TabButton icon={Sparkles} text="Discover" isActive={view === 'discover'} onClick={() => setView('discover')} />
            </div>
          </div>
          <div className="flex-grow overflow-y-auto p-4 scrollbar-hide">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-blue-500" size={48} />
              </div>
            ) : error ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <AlertCircle className="text-red-500 mb-4" size={48} />
                <p className={`text-lg ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{error}</p>
                <button 
                  onClick={() => {setLoading(true); setError(null);}} 
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full"
                >
                  Retry
                </button>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <AlertCircle className="text-yellow-500 mb-4" size={48} />
                <p className={`text-lg ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>No items found.</p>
                <p className={`mt-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                {view === 'explore' && renderExploreView()}
                {view === 'search' && renderSearchView()}
                {view === 'discover' && renderDiscoverView()}
              </>
            )}
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {selectedItem && renderItemModal()}
      </AnimatePresence>
      <Notification show={showNotification} theme={theme} />
    </motion.div>
  );
};

const TabButton = ({ icon: Icon, text, isActive, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
      isActive 
        ? 'bg-blue-500 text-white' 
        : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }`}
  >
    <Icon size={20} />
    <span>{text}</span>
  </motion.button>
);

export default IsolatedMenu;