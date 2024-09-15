import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader, ShoppingCart, Mic, Send, X, Plus, Minus, Sparkles,
  Coffee, Pizza, Cake, Menu, Search, Star, ChevronDown, ChevronUp
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import ReactMarkdown from 'react-markdown';

const MenuRecommendationSystem = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [cart, setCart] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [suggestivePrompts, setSuggestivePrompts] = useState([
    { icon: Coffee, text: "Craft a perfect breakfast" },
    { icon: Pizza, text: "Discover our spiciest dish" },
    { icon: Cake, text: "Surprise me with a culinary delight" },
  ]);
  const [isPromptsExpanded, setIsPromptsExpanded] = useState(false);
  const searchInputRef = useRef(null);
  const conversationEndRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [favorites, setFavorites] = useState([]);
  const [menuItems, setMenuItems] = useState([
    {
      "name_of_item": "High Protein - Schezwan Chilli Paneer Exotic Veggies Low Gi Rice Bowl",
      "cost": 319.0,
      "description": "A deliciously aromatic and flavourful paneer rice bowl prepared with our special low gi rice,schezwan sauce along with exotic vegetables. A dish where taste meets health. High protein and low gi balanced meal. (gi value - 48) [Energy: 665.2 kcal, Protein: 25.6g, Carbohydrates: 58g, Fiber: 4g, Fat: 32.4g]",
      "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/9/44ce79b1-9ec3-44cc-b336-87413920c421_97c2f817-0169-447a-8363-0b5503b04c36.jpg"
    },
    {
      "name_of_item": "High Protein - Egg Curry Masala Low Gi Rice Bowl",
      "cost": 299.0,
      "description": "A simple but flavourful egg curry masala made along with our special low gi rice. A dish where taste meets health. High protein and low gi balanced meal. (gi value - 48) [Energy: 577.5 kcal, Protein: 18.6g, Carbohydrates: 59.4g, Fiber: 4.2g, Fat: 29g]",
      "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/9/f5f18a40-5e48-45c6-8875-83ac71c4a254_d667d1b1-6434-4a16-a5f4-ff0edc8a673c.jpg"
    },
    {
      "name_of_item": "High Protein - Paneer Makhani Low Gi Rice Bowl",
      "cost": 319.0,
      "description": "A delicious paneer makhani gravy celebrating the goodness of desi butter, served alongside our special low gi rice. A dish where taste meets health. High protein and low gi balanced meal. Taste bhi. . . Health bhi. . . (gi value - 48) [Energy: 758.6 kcal, Protein: 26.1g, Carbohydrates: 60.8g, Fiber: 4.2g, Fat: 42.6g]",
      "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/9/9443d232-7828-4566-bff9-be3ea1004d8d_692f60af-eee7-4048-9301-1f86a7b24057.jpg"
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const handleSearch = useCallback(async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    const newConversation = { query, response: '', items: [] };
    setConversations(prev => [...prev, newConversation]);

    try {
      const response = await fetch(`/api/chat/?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      setConversations(prev => 
        prev.map((conv, index) => 
          index === prev.length - 1 
            ? { ...conv, response: data.response_text, items: data.returned_items || [] }
            : conv
        )
      );
    } catch (error) {
      console.error('Error fetching data:', error);
      setConversations(prev => 
        prev.map((conv, index) => 
          index === prev.length - 1 
            ? { ...conv, response: 'An error occurred while fetching the data. Please try again.' }
            : conv
        )
      );
    } finally {
      setIsLoading(false);
      setQuery('');
      setIsPromptsExpanded(false);
    }
  }, [query]);

  const handleSuggestivePrompt = useCallback((promptText) => {
    setQuery(promptText);
    handleSearch({ preventDefault: () => {} });
  }, [handleSearch]);

  const toggleTheme = () => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');

  const toggleFavorite = useCallback((item) => {
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.some(fav => fav.name_of_item === item.name_of_item);
      if (isFavorite) {
        return prevFavorites.filter(fav => fav.name_of_item !== item.name_of_item);
      } else {
        return [...prevFavorites, item];
      }
    });
  }, []);

  const addToCart = useCallback((item) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.name_of_item === item.name_of_item);
      if (existingItem) {
        return prev.map(cartItem => 
          cartItem.name_of_item === item.name_of_item 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  }, []);

  const removeFromCart = useCallback((item) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.name_of_item === item.name_of_item);
      if (existingItem.quantity > 1) {
        return prev.map(cartItem => 
          cartItem.name_of_item === item.name_of_item 
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      } else {
        return prev.filter(cartItem => cartItem.name_of_item !== item.name_of_item);
      }
    });
  }, []);

  const handleVoiceInput = useCallback(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
      };
      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  }, []);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations]);

  useEffect(() => {
    setFilteredMenuItems(
      menuItems.filter(item =>
        item.name_of_item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, menuItems]);

  const ConversationBubble = ({ isUser, content }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`max-w-3/4 p-4 rounded-lg shadow-md ${
        isUser 
          ? 'bg-blue-500 text-white self-end' 
          : `${theme === 'light' ? 'bg-white' : 'bg-gray-800'} ${theme === 'light' ? 'text-gray-800' : 'text-white'} self-start`
      }`}
    >
      <p className="whitespace-pre-wrap">{content}</p>
    </motion.div>
  );

  const ItemCard = ({ item }) => {
    const isFavorite = favorites.some(fav => fav.name_of_item === item.name_of_item);

    return (
      <motion.div 
        className={`rounded-lg shadow-lg overflow-hidden flex flex-col w-full h-96 cursor-pointer transform transition-all duration-300 hover:scale-105 ${
          theme === 'light' ? 'bg-white' : 'bg-gray-800'
        }`}
        onClick={() => setSelectedItem(item)}
        whileHover={{ y: -5 }}
      >
        <div className="h-48 overflow-hidden relative">
          <img src={item.image_link} alt={item.name_of_item} className="w-full h-full object-cover" />
          <motion.button 
            onClick={(e) => { e.stopPropagation(); toggleFavorite(item); }}
            className={`absolute top-2 right-2 p-2 rounded-full ${
              isFavorite ? 'bg-yellow-400' : 'bg-white bg-opacity-70'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Star size={16} className={isFavorite ? 'text-white' : 'text-gray-600'} />
          </motion.button>
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <h3 className={`font-bold text-lg mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{item.name_of_item}</h3>
            <p className={`text-sm line-clamp-3 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>{item.description}</p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-2xl font-bold text-blue-500">₹{item.cost.toFixed(2)}</p>
            <motion.button 
              onClick={(e) => { e.stopPropagation(); addToCart(item); }}
              className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add to Cart
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  };

  const ItemModal = ({ item, isOpen, onClose }) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-[90%] sm:max-w-[425px] mx-auto px-4 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
        <DialogHeader>
          <DialogTitle className={theme === 'light' ? 'text-gray-800' : 'text-white'}>{item.name_of_item}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <img
            src={item.image_link}
            alt={item.name_of_item}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <p className={`mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{item.description}</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-blue-600">
              ₹{item.cost.toFixed(2)}
            </p>
            <motion.button
              onClick={() => {
                addToCart(item);
                onClose();
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add to Cart
            </motion.button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const MenuItemCard = ({ item }) => (
    <motion.div 
      className={`rounded-lg shadow-md p-4 flex flex-col h-full ${
        theme === 'light' ? 'bg-white' : 'bg-gray-800'
      }`}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <img src={item.image_link} alt={item.name_of_item} className="w-full h-40 object-cover rounded-lg mb-4" />
      <h3 className={`text-lg font-semibold mb-2 ${theme === 'light' ? 'text-gray-800' :'text-white'}`}>{item.name_of_item}</h3>
      <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} mb-2 flex-grow`}>
        {item.description.length > 100 ? `${item.description.substring(0, 100)}...` : item.description}
      </p>
      <div className="flex justify-between items-center mt-auto">
        <p className="text-xl font-bold text-blue-600">₹{item.cost.toFixed(2)}</p>
        <motion.button
          onClick={() => addToCart(item)}
          className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );

  const PromptButton = ({ icon: Icon, text }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => handleSuggestivePrompt(text)}
      className={`px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300 flex items-center space-x-2 group text-sm ${
        theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-800 text-white'
      }`}
    >
      <Icon size={16} className="group-hover:animate-bounce text-blue-500" />
      <span className="truncate">{text}</span>
    </motion.button>
  );

  return (
    <div className={`min-h-screen flex flex-col ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-gray-100 to-gray-200' 
        : 'bg-gradient-to-br from-gray-900 to-gray-800'
    }`}>
      <header className={`p-4 shadow-md ${
        theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-900 text-white'
      }`}>
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <motion.h1 
            className="text-2xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            RestoChat
          </motion.h1>
          <motion.button 
            onClick={toggleTheme} 
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </motion.button>
        </div>
      </header>

      <main className="flex-grow p-4 overflow-auto pb-32">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence>
            {conversations.map((conv, index) => (
              <motion.div 
                key={index} 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ConversationBubble isUser={true} content={conv.query} />
                {conv.response && (
                  <ConversationBubble isUser={false} content={conv.response} />
                )}
                {conv.items.length > 0 && (
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    {conv.items.map((item, itemIndex) => (
                      <ItemCard key={itemIndex} item={item} />
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={conversationEndRef} />
        </div>
      </main>

      <footer className={`fixed bottom-0 left-0 right-0 shadow-lg rounded-t-3xl transition-all duration-300 ease-in-out ${
        theme === 'light' ? 'bg-white' : 'bg-gray-900'
      }`}>
        <div className="max-w-4xl mx-auto p-6 space-y-4">
          <motion.div
            initial={false}
            animate={{ height: isPromptsExpanded ? 'auto' : '0' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              <AnimatePresence>
                {suggestivePrompts.map((prompt, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PromptButton icon={prompt.icon} text={prompt.text} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              ref={searchInputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you craving today?"
              className={`w-full p-4 pr-20 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-base ${
                theme === 'light' 
                  ? 'bg-white border-gray-300 text-gray-800' 
                  : 'bg-gray-800 border-gray-700 text-white'
              }`}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={handleVoiceInput}
                className={`p-2 rounded-full ${
                  isListening 
                    ? 'bg-red-500 text-white' 
                    : theme === 'light' ? 'bg-gray-200 text-gray-600' : 'bg-gray-700 text-gray-300'
                } hover:bg-opacity-80 transition-colors`}
              >
                <Mic size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="submit"
                className="p-2 bg-blue-500 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Send size={18} />
              </motion.button>
            </div>
          </form>
          <div className="flex justify-between items-center">
            <motion.button
              onClick={toggleMenu}
              className={`flex items-center space-x-2 transition-colors ${
                theme === 'light' ? 'text-gray-600 hover:text-gray-800' : 'text-gray-300 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu size={24} />
              <span>Explore Menu</span>
            </motion.button>
            <motion.button
              onClick={() => setIsPromptsExpanded(!isPromptsExpanded)}
              className={`flex items-center space-x-2 transition-colors ${
                theme === 'light' ? 'text-gray-600 hover:text-gray-800' : 'text-gray-300 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPromptsExpanded ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
              <span>{isPromptsExpanded ? 'Hide Inspirations' : 'Show Inspirations'}</span>
            </motion.button>
            <motion.button
              onClick={toggleCart}
              className={`flex items-center space-x-2 transition-colors relative ${
                theme === 'light' ? 'text-gray-600 hover:text-gray-800' : 'text-gray-300 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart size={24} />
              <span>Your Order</span>
              {cart.length > 0 && (
                <motion.span 
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMenu}
          >
            <motion.div 
              className={`absolute bottom-0 left-0 right-0 rounded-t-3xl ${
                theme === 'light' ? 'bg-white' : 'bg-gray-900'
              }`}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 h-[80vh] overflow-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Culinary Delights</h2>
                  <motion.button
                    onClick={toggleMenu}
                    className={`${theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-gray-300 hover:text-white'}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={24} />
                  </motion.button>
                </div>
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search our delicacies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full p-2 pl-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'light' 
                        ? 'bg-white border-gray-300 text-gray-800' 
                        : 'bg-gray-800 border-gray-700 text-white'
                    }`}
                  />
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                  }`} size={20} />
                </div>
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {filteredMenuItems.map((item) => (
                    <MenuItemCard key={item.name_of_item} item={item} />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
          >
            <motion.div 
              className={`absolute bottom-0 left-0 right-0 rounded-t-3xl ${
                theme === 'light' ? 'bg-white' : 'bg-gray-900'
              }`}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 h-[80vh] overflow-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Your Culinary Selection</h2>
                  <motion.button
                    onClick={toggleCart}
                    className={`${theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-gray-300 hover:text-white'}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={24} />
                  </motion.button>
                </div>
                {cart.length === 0 ? (
                  <motion.div 
                    className={`text-center py-8 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    Your culinary journey awaits! Add some delectable items to begin.
                  </motion.div>
                ) : (
                  <>
                    {cart.map((item, index) => (
                      <motion.div 
                        key={index} 
                        className={`flex items-center justify-between mb-4 p-4 rounded-lg ${
                          theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div>
                          <h3 className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{item.name_of_item}</h3>
                          <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>₹{item.cost} x {item.quantity}</p>
                        </div>
                        <div className="flex items-center">
                          <motion.button 
                            onClick={() => removeFromCart(item)} 
                            className={`text-red-500 hover:text-red-700 mr-2 p-1 rounded-full ${
                              theme === 'light' ? 'bg-white' : 'bg-gray-700'
                            } shadow-sm`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Minus size={16} />
                          </motion.button>
                          <span className={`mx-2 font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{item.quantity}</span>
                          <motion.button 
                            onClick={() => addToCart(item)} 
                            className={`text-green-500 hover:text-green-700 ml-2 p-1 rounded-full ${
                              theme === 'light' ? 'bg-white' : 'bg-gray-700'
                            } shadow-sm`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Plus size={16} />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                    <div className={`mt-4 pt-4 border-t ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
                      <p className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                        Total: ₹{cart.reduce((total, item) => total + item.cost * item.quantity, 0).toFixed(2)}
                      </p>
                      <motion.button 
                        className="w-full mt-4 bg-blue-500 text-white py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Proceed to Checkout
                      </motion.button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedItem && (
        <ItemModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          theme={theme}
          addToCart={addToCart}
        />
      )}

      {isLoading && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Loader size={48} className="text-white animate-spin" />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default MenuRecommendationSystem;