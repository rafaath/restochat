import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingBag, Check, Package, Percent, Crown, Award, Gift, Plus, Minus, Leaf, ChevronUp, ChevronDown, Shuffle } from 'lucide-react';
import Lottie from 'lottie-react';
import animationData from './animation.json';
import AnimatedAddToCartButton from './AnimatedAddToCartButton';
import ComboDetailsModal from './ComboDetailsModal';



const LottieAnimation = ({ 
  width = 192, 
  height = 120, 
  zoom = 33,
  speed = 1,
  loop = true,
  autoplay = true,
}) => {
  return (
    <div 
      className="mx-auto overflow-hidden" 
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div 
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${100 * zoom}%`,
            height: `${100 * zoom}%`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Lottie 
            animationData={animationData} 
            loop={loop}
            autoplay={autoplay}
            speed={speed}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};


const ComboCard = ({ combo, onAddToCart, onRemoveFromCart, theme, onItemClick, cart }) => {
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const comboInCart = cart.find(item => item.isCombo && item.combo_id === combo.combo_id);
    setQuantity(comboInCart ? comboInCart.quantity : 0);
  }, [cart, combo.combo_id]);

  const handleIncrement = (e) => {
    e.stopPropagation();
    setQuantity(prev => prev + 1);
    const enhancedComboItem = {
      ...combo,
      combo_type: combo.combo_type || 'Standard',
      isCombo: true,
      quantity: 1,
      image_links: combo.combo_items.map(item => item.image_link),
      combo_items: combo.combo_items.map(item => ({
        ...item,
        description: item.description || 'No Description Avaliable',
        veg_or_non_veg: item.veg_or_non_veg || 'N/A'
      }))
    };
    onAddToCart(enhancedComboItem);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    if (quantity > 0) {
      setQuantity(prev => prev - 1);
      onRemoveFromCart({ isCombo: true, combo_id: combo.combo_id });
    }
  };

  const handleClick = () => {
    const firstItemImage = combo.combo_items[0]?.image_link;
    const enhancedCombo = {
      ...combo,
      image_links: combo.combo_items.map(item => item.image_link),
      image_link: firstItemImage || combo.image_link,
    };
    onItemClick(enhancedCombo);
  };

  const getPrestigeBadge = () => {
    const badges = {
      vip: { icon: Crown, color: 'yellow', text: 'VIP' },
      premium: { icon: Award, color: 'purple', text: 'Premium' },
      standard: { icon: Gift, color: 'blue', text: 'Standard' }
    };

    const { icon: Icon, color, text } = badges[combo.combo_type] || badges.standard;

    return (
      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
        theme === 'light' 
          ? `bg-${color}-100 text-${color}-800` 
          : `bg-${color}-900 text-${color}-200`
      } text-xs font-semibold`}>
        <Icon size={12} />
        <span>{text}</span>
      </div>
    );
  };

  const isComboVeg = combo.combo_items.every(item => item.veg_or_non_veg === 'veg');

  const getVegNonVegPill = () => (
    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
      isComboVeg
        ? theme === 'light' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-green-900 text-green-200'
        : theme === 'light'
          ? 'bg-red-100 text-red-800'
          : 'bg-red-900 text-red-200'
    }`}>
      <Leaf size={12} />
      <span className="text-xs font-semibold">{isComboVeg ? 'Veg' : 'Non-Veg'}</span>
    </div>
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 100 }}
      className={`${
        theme === 'light' ? 'bg-white' : 'bg-gray-800'
      } rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out border ${
        theme === 'light' ? 'border-gray-200' : 'border-gray-700'
      } cursor-pointer flex flex-col h-full`}
      onClick={handleClick}
    >
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col space-y-2">
              <h3 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} line-clamp-2`}>
                {combo.combo_name}
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                {getPrestigeBadge()}
                {getVegNonVegPill()}
                
              </div>
            </div>
          </div>
          <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} mb-2 line-clamp-2`}>
            {combo.description}
          </p>
        </div>
        <div className="mt-auto">
          <div className="flex justify-between items-end mb-4">
            <div className="flex items-baseline space-x-2">
              <span className={`text-3xl font-bold ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>
                ₹{combo.discounted_cost.toFixed(2)}
              </span>
              {combo.has_discount === 'yes' && (
                <span className={`text-sm line-through ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
                  ₹{combo.cost.toFixed(2)}
                </span>
              )}
              {combo.has_discount === 'yes' && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-[0.65rem] font-semibold ${
                theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-blue-900 text-blue-200'
              }`}>
                Save {((combo.cost - combo.discounted_cost) / combo.cost * 100).toFixed(0)}%
              </span>
            )}
            </div>
          </div>
          
          <div className="mt-4">
            {quantity > 0 ? (
              <div 
              className={`flex items-center justify-between w-full px-4 py-2 rounded-lg ${
                theme === 'light'
                  ? 'bg-blue-50 text-blue-800'
                  : 'bg-blue-900 text-blue-200'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDecrement}
                  className={`p-1 rounded-full ${
                    theme === 'light'
                      ? 'bg-blue-200 text-blue-700 hover:bg-blue-300'
                      : 'bg-blue-800 text-blue-200 hover:bg-blue-700'
                  }`}
                >
                  <ChevronDown size={20} />
                </motion.button>
                <span className="font-bold text-xl min-w-[40px] text-center">{quantity}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleIncrement}
                  className={`p-1 rounded-full ${
                    theme === 'light'
                      ? 'bg-blue-200 text-blue-700 hover:bg-blue-300'
                      : 'bg-blue-800 text-blue-200 hover:bg-blue-700'
                  }`}
                >
                  <ChevronUp size={20} />
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleIncrement}
                className={`w-full ${
                  theme === 'light' 
                    ? 'bg-blue-500 hover:bg-blue-600' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-200 ease-in-out`}
              >
                Add Combo
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};



const EmptyState = ({ theme, onItemClick, addToCart, removeFromCart, cart, menuItems, onOpenRollTheDice }) => {
  const [topRatedItems, setTopRatedItems] = useState([]);
  const [topCombos, setTopCombos] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [comboScrollPosition, setComboScrollPosition] = useState(0);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const carouselRef = useRef(null);
  const comboCarouselRef = useRef(null);


  const getItemQuantity = useCallback((itemId) => {
    const cartItem = cart.find(item => item.item_id === itemId);
    return cartItem ? cartItem.quantity : 0;
  }, [cart]);

  const DiceIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 8H7.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 12H12.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 16H17.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  useEffect(() => {
    // Fetch top-rated items
    import('./full_menu.json').then(data => {
      const sortedItems = data.default
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6);
      setTopRatedItems(sortedItems);
    });

    // Fetch combos
    import('./all_combos.json').then(data => {
      const sortedCombos = data.default
        .sort((a, b) => b.discount_pct - a.discount_pct)
        .slice(0, 6);
      setTopCombos(sortedCombos);
    });
  }, []);

  const handleScroll = useCallback((ref, setPosition) => {
    if (ref.current) {
      const position = ref.current.scrollLeft / (ref.current.scrollWidth - ref.current.clientWidth);
      setPosition(position);
    }
  }, []);

  const headingGradient = theme === 'light'
    ? 'from-blue-600 to-indigo-500'
    : 'from-blue-400 to-indigo-300';

  const handleCardClick = useCallback((item, event) => {
    if (!event.target.closest('.add-to-cart-button')) {
      onItemClick(item);
    }
  }, [onItemClick]);

  const handleComboClick = (combo) => {
    setSelectedCombo(combo);
    setIsModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col pt-3 space-y-6 max-w-4xl mx-auto no-scrollbar">
      {/* Header and Lottie Animation */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1 className={`text-2xl font-extrabold bg-gradient-to-r ${headingGradient} text-transparent bg-clip-text`}>
          Ask Anything. We'll Serve the Perfect Meal.
        </h1>
        <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
          Ask me anything about our menu, and I'll guide you to a dish worth savoring.
        </p>
      </motion.div>

      <div className="flex-shrink-0">
        <LottieAnimation />
      </div>

      {/* Roll the Dice Button */}
      <motion.div
        className="flex justify-center my-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(0,0,0,0.2)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenRollTheDice}  // Use the prop here
          className={`px-6 py-3 rounded-full font-bold text-lg flex items-center space-x-2 ${
            theme === 'light' 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          } transition-colors duration-300`}
        >
          <DiceIcon size={24} />
          <span>Roll the Dice!</span>
        </motion.button>
      </motion.div>

      {/* Top-Rated Items Carousel */}
      <div className="flex-grow flex flex-col">
        <h2 className={`text-lg font-extrabold pl-3 text-left bg-gradient-to-r ${headingGradient} text-transparent bg-clip-text mb-4`}>
          Top-Rated Temptations
        </h2>

        <div className="relative flex-grow">
          <motion.div
            ref={carouselRef}
            className="flex overflow-x-auto scrollbar-hide space-x-4 pl-3 pr-2 pb-4 h-auto no-scrollbar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            onScroll={() => handleScroll(carouselRef, setScrollPosition)}
          >
            <AnimatePresence>
              {topRatedItems.map((item, index) => (
                <motion.div
                  key={item.item_id}
                  className={`flex-shrink-0 w-64 h-auto rounded-xl overflow-hidden shadow-md cursor-pointer ${
                    theme === 'light' ? 'bg-white' : 'bg-gray-800'
                  }`}
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -20 }}
                  transition={{ delay: 0.05 * index, duration: 0.3 }}
                  whileHover={{ y: -3, boxShadow: '0px 3px 10px rgba(0,0,0,0.1)' }}
                  onClick={(event) => handleCardClick(item, event)}
                >
                  {/* Item image and rating */}
                  <div className="relative h-40">
                    <img src={item.image_link} alt={item.name_of_item} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                      <h3 className="font-bold text-white drop-shadow-md leading-tight text-sm" style={{ maxWidth: 'calc(100% - 3rem)' }}>
                        {item.name_of_item}
                      </h3>
                      <div className="flex items-center bg-yellow-400 rounded-full px-1.5 py-0.5 ml-1 flex-shrink-0">
                        <Star size={10} className="text-yellow-900 mr-0.5" />
                        <span className="text-xs font-bold text-yellow-900">{item.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  {/* Item description and add to cart button */}
                  <div className="p-2 flex flex-col justify-between flex-grow">
                    <p className={`text-xs mb-2 line-clamp-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                      {item.description || 'Delicious dish awaits you!'}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <span className={`text-lg font-bold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                        ₹{item.cost.toFixed(0)}
                      </span>
                      <div className="add-to-cart-button" onClick={(e) => e.stopPropagation()}>
                        <AnimatedAddToCartButton
                          item={item}
                          addToCart={addToCart}
                          removeFromCart={removeFromCart}
                          theme={theme}
                          quantity={getItemQuantity(item.item_id)}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          
          {/* Scroll indicator */}
          <div className="flex justify-center mt-2 space-x-1">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  scrollPosition >= index / 6 && scrollPosition <= (index + 1) / 6
                    ? 'w-4 bg-blue-600'
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col">
        <h2 className={`text-lg font-extrabold pl-3 text-left bg-gradient-to-r ${headingGradient} text-transparent bg-clip-text mb-4`}>
          Irresistible Combos
        </h2>

        <div className="relative flex-grow">
        <motion.div
            ref={comboCarouselRef}
            className="flex overflow-x-auto scrollbar-hide space-x-4 pl-3 pr-2 pb-4 h-auto no-scrollbar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            onScroll={() => handleScroll(comboCarouselRef, setComboScrollPosition)}
          >
             <AnimatePresence>
              {topCombos.map((combo, index) => (
                <motion.div
                  key={combo.combo_id}
                  className="flex-shrink-0 w-80"
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -20 }}
                  transition={{ delay: 0.05 * index, duration: 0.3 }}
                >
                  <ComboCard
                    combo={combo}
                    onAddToCart={addToCart}
                    onRemoveFromCart={removeFromCart}
                    theme={theme}
                    onItemClick={() => handleComboClick(combo)}
                    cart={cart}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          
          {/* Scroll indicator for combos */}
          <div className="flex justify-center mt-2 space-x-1">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  comboScrollPosition >= index / 6 && comboScrollPosition <= (index + 1) / 6
                    ? 'w-4 bg-blue-600'
                    : 'w-2 bg-gray-300'
                  }`}
                  />
                ))}
              </div>
            </div>
          </div>
    
          <p className={`text-xs pb-7 text-center ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
            Explore favorites, combos, dietary choices, and flavors designed to delight.
            <br />
            <span className="italic text-xs">We're in beta. Answers may vary.</span>
          </p>
          <ComboDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        combo={selectedCombo}
        theme={theme}
      />
      
        </div>
      );
    };
    
    export default EmptyState;