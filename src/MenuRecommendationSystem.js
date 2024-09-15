import React, { useState, useEffect, useRef } from 'react';
import { Loader, ShoppingCart, Mic, Send, X, Plus, Minus, Sparkles, Coffee, Pizza, Cake, Menu, Search, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    { icon: Coffee, text: "Recommend a perfect breakfast" },
    { icon: Pizza, text: "What's your spiciest dish?" },
    { icon: Cake, text: "Surprise me!" },
  ]);
  const [isPromptsExpanded, setIsPromptsExpanded] = useState(false);
  const searchInputRef = useRef(null);
  const conversationEndRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [favorites, setFavorites] = useState([]);
  const [menuItems, setMenuItems] = useState([
    // ... (menuItems remain unchanged)
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
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
  };

  const handleSuggestivePrompt = (promptText) => {
    setQuery(promptText);
    handleSearch({ preventDefault: () => {} });
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const toggleFavorite = (item) => {
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.some(fav => fav.name_of_item === item.name_of_item);
      if (isFavorite) {
        return prevFavorites.filter(fav => fav.name_of_item !== item.name_of_item);
      } else {
        return [...prevFavorites, item];
      }
    });
  };

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

  const addToCart = (item) => {
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
  };

  const removeFromCart = (item) => {
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
  };

  const handleVoiceInput = () => {
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
  };

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations]);

  const ConversationBubble = ({ isUser, content }) => (
    <div
      className={`max-w-3/4 p-3 rounded-lg ${
        isUser ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-gray-800 self-start'
      }`}
    >
      <p className="whitespace-pre-wrap">{content}</p>
    </div>
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
          <button 
            onClick={(e) => { e.stopPropagation(); toggleFavorite(item); }}
            className={`absolute top-2 right-2 p-2 rounded-full ${
              isFavorite ? 'bg-yellow-400' : 'bg-white bg-opacity-70'
            }`}
          >
            <Star size={16} className={isFavorite ? 'text-white' : 'text-gray-600'} />
          </button>
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <h3 className={`font-bold text-lg mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{item.name_of_item}</h3>
            <p className={`text-sm line-clamp-3 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>{item.description}</p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-2xl font-bold text-blue-500">₹{item.cost.toFixed(2)}</p>
            <button 
              onClick={(e) => { e.stopPropagation(); addToCart(item); }}
              className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const ItemModal = ({ item, isOpen, onClose }) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-[90%] sm:max-w-[425px] mx-auto px-4">
        <DialogHeader>
          <DialogTitle>{item.name_of_item}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <img
            src={item.image_link}
            alt={item.name_of_item}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <p className="text-gray-700 mb-4">{item.description}</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-blue-600">
              ₹{item.cost.toFixed(2)}
            </p>
            <button
              onClick={() => {
                addToCart(item);
                onClose();
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  useEffect(() => {
    setFilteredMenuItems(
      menuItems.filter(item =>
        item.name_of_item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, menuItems]);

  const MenuItemCard = ({ item }) => (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col h-full">
      <img src={item.image_link} alt={item.name_of_item} className="w-full h-40 object-cover rounded-lg mb-4" />
      <h3 className="text-lg font-semibold mb-2">{item.name_of_item}</h3>
      <p className="text-sm text-gray-600 mb-2 flex-grow">{item.description.length > 100 ? `${item.description.substring(0, 100)}...` : item.description}</p>
      <div className="flex justify-between items-center mt-auto">
        <p className="text-xl font-bold text-blue-600">₹{item.cost.toFixed(2)}</p>
        <button
          onClick={() => addToCart(item)}
          className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
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
          <h1 className="text-2xl font-bold">RestoChat</h1>
          <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <main className="flex-grow p-4 overflow-auto pb-32">
        <div className="max-w-4xl mx-auto space-y-6">
          {conversations.map((conv, index) => (
            <motion.div 
              key={index} 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`p-4 rounded-lg shadow ${
                theme === 'light' ? 'bg-blue-100' : 'bg-blue-900'
              }`}>
                <p className="font-semibold">You: {conv.query}</p>
              </div>
              {conv.response && (
                <div className={`p-4 rounded-lg shadow ${
                  theme === 'light' ? 'bg-white' : 'bg-gray-800'
                }`}>
                  <p className="font-semibold mb-2">AI:</p>
                  <ReactMarkdown className={`prose ${
                    theme === 'light' ? 'prose-gray' : 'prose-invert'
                  }`}>
                    {conv.response}
                  </ReactMarkdown>
                </div>
              )}
              {conv.items.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {conv.items.map((item,itemIndex) => (
                    <ItemCard key={itemIndex} item={item} />
                  ))}
                </div>
              )}
            </motion.div>
          ))}
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
              placeholder="What would you like to eat?"
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
            <button
              onClick={toggleMenu}
              className={`flex items-center space-x-2 transition-colors ${
                theme === 'light' ? 'text-gray-600 hover:text-gray-800' : 'text-gray-300 hover:text-white'
              }`}
            >
              <Menu size={24} />
              <span>Full Menu</span>
            </button>
            <button
              onClick={() => setIsPromptsExpanded(!isPromptsExpanded)}
              className={`flex items-center space-x-2 transition-colors ${
                theme === 'light' ? 'text-gray-600 hover:text-gray-800' : 'text-gray-300 hover:text-white'
              }`}
            >
              {isPromptsExpanded ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
              <span>{isPromptsExpanded ? 'Hide Suggestions' : 'Show Suggestions'}</span>
            </button>
            <button
              onClick={toggleCart}
              className={`flex items-center space-x-2 transition-colors relative ${
                theme === 'light' ? 'text-gray-600 hover:text-gray-800' : 'text-gray-300 hover:text-white'
              }`}
            >
              <ShoppingCart size={24} />
              <span>Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </footer>

      {/* Full Menu Overlay */}
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
                  <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Full Menu</h2>
                  <button
                    onClick={toggleMenu}
                    className={`${theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-gray-300 hover:text-white'}`}
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search menu..."
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMenuItems.map((item) => (
                    <MenuItemCard key={item.name_of_item} item={item} />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Overlay */}
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
                  <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Your Cart</h2>
                  <button
                    onClick={toggleCart}
                    className={`${theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-gray-300 hover:text-white'}`}
                  >
                    <X size={24} />
                  </button>
                </div>
                {cart.length === 0 ? (
                  <div className={`text-center py-8 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Your cart is empty. Add some delicious items!
                  </div>
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
                          <button 
                            onClick={() => removeFromCart(item)} 
                            className={`text-red-500 hover:text-red-700 mr-2 p-1 rounded-full ${
                              theme === 'light' ? 'bg-white' : 'bg-gray-700'
                            } shadow-sm`}
                          >
                            <Minus size={16} />
                          </button>
                          <span className={`mx-2 font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{item.quantity}</span>
                          <button 
                            onClick={() => addToCart(item)} 
                            className={`text-green-500 hover:text-green-700 ml-2 p-1 rounded-full ${
                              theme === 'light' ? 'bg-white' : 'bg-gray-700'
                            } shadow-sm`}
                          >
                            <Plus size={16} />
                          </button>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Loader size={48} className="text-white animate-spin" />
        </div>
      )}
    </div>
  );
};

export default MenuRecommendationSystem;