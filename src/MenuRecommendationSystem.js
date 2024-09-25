import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import {
  Loader, ShoppingCart, Mic, Send, X, Plus, Minus, Sparkles,
  Coffee, Pizza, Cake, Menu, Search, Star, ChevronDown, ChevronUp,
  ArrowRight, ArrowLeft, Trash2, AlertCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./components/ui/alert-dialog";
import AppleInspiredStoryView from './AppleInspiredStoryView';
import WelcomeScreen from './WelcomeScreen';
import EmptyState from './EmptyState';
import IsolatedMenu from './IsolatedMenu';
import IsolatedCart from './IsolatedCart';

const ClearChatButton = ({ onClearChat, theme, isVisible }) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleClearChat = () => {
    onClearChat();
    setIsDialogOpen(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDialogOpen(true)}
            className={`p-2 rounded-full shadow-md transition-colors ${
              theme === 'light'
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
            aria-label="Clear chat"
          >
            <Trash2 size={20} />
          </motion.button>

          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogContent className={theme === 'light' ? 'bg-white' : 'bg-gray-800'}>
              <AlertDialogHeader>
                <AlertDialogTitle className={`flex items-center space-x-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  <AlertCircle className="text-red-500" size={24} />
                  <span>Clear Chat History</span>
                </AlertDialogTitle>
                <AlertDialogDescription className={theme === 'light' ? 'text-gray-500' : 'text-gray-300'}>
                  Are you sure you want to clear all chat history? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className={`${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-700 text-white'} hover:opacity-80`}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearChat}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  Clear Chat
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


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
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const storyRef = useRef(null);
  const storyContentRef = useRef(null);
  const [chatId, setChatId] = useState(null);

  const clearChat = () => {
    setConversations([]);
    setChatId(null);
    // You might want to add any other state resets here
  };
  const isChatStarted = conversations.length > 0;
  const storyControls = useAnimation();

  const [showWelcome, setShowWelcome] = useState(true);
  // ... (other state variables remain the same)


  const [selectedItemFromConversation, setSelectedItemFromConversation] = useState(null);


  const mainContentRef = useRef(null);

  useEffect(() => {
    if (conversations.length > 0 && mainContentRef.current) {
      mainContentRef.current.scrollTop = mainContentRef.current.scrollHeight;
    }
  }, [conversations]);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (hasSeenWelcome) {
      setShowWelcome(false);
    }
  }, []);

  const handleGetStarted = () => {
    setShowWelcome(false);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      if (st > lastScrollTop.current && st > 50) {
        // Scrolling down and past the threshold
        setIsHeaderVisible(false);
      } else if (st < lastScrollTop.current || st <= 50) {
        // Scrolling up or at the top
        setIsHeaderVisible(true);
      }
      lastScrollTop.current = st <= 0 ? 0 : st;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const [menuItems, setMenuItems] = useState([
    ,
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isCartOpen) setIsCartOpen(false);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };


  


  const openStory = (index) => {
    setActiveStoryIndex(index);
    setIsStoryOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeStory = () => {
    setIsStoryOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextStory = () => {
    if (activeStoryIndex < conversations.length - 1) {
      setActiveStoryIndex(prevIndex => prevIndex + 1);
      storyControls.start({ opacity: [0, 1], x: [50, 0] });
    } else {
      closeStory();
    }
  };

  const prevStory = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(prevIndex => prevIndex - 1);
      storyControls.start({ opacity: [0, 1], x: [-50, 0] });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isStoryOpen) {
        if (e.key === 'ArrowRight') nextStory();
        else if (e.key === 'ArrowLeft') prevStory();
        else if (e.key === 'Escape') closeStory();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStoryOpen, activeStoryIndex]);

  useEffect(() => {
    if (isStoryOpen && storyContentRef.current) {
      storyContentRef.current.scrollTop = 0;
    }
  }, [activeStoryIndex, isStoryOpen]);

  const StoryContent = ({ conversation }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="h-full overflow-y-auto px-4 py-8"
      ref={storyContentRef}
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-white">{conversation.query}</h2>
        <ReactMarkdown
          components={{
            p: ({ node, ...props }) => <p className="mb-4 text-gray-200" {...props} />,
            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4 text-white" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mb-3 text-white" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-xl font-bold mb-2 text-white" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 text-gray-200" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 text-gray-200" {...props} />,
            li: ({ node, ...props }) => <li className="mb-2 text-gray-200" {...props} />,
            code: ({ node, inline, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={tomorrow}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-md overflow-hidden my-4"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className="bg-gray-800 rounded px-1 py-0.5 text-gray-200" {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {conversation.response}
        </ReactMarkdown>
        {conversation.items.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 text-white">Recommended Items</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {conversation.items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
                >
                  <img src={item.image_link} alt={item.name_of_item} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h4 className="text-lg font-semibold mb-2 text-white">{item.name_of_item}</h4>
                    <p className="text-sm text-gray-300 mb-4">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-blue-400">₹{item.cost.toFixed(2)}</span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addToCart(item)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors"
                      >
                        Add to Cart
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );






  const handleSearch = useCallback(async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
  
    setIsLoading(true);
    const newConversation = { query, response: 'Waiting for response...', items: [] };
    setConversations(prev => [...prev, newConversation]);
  
    const pollInterval = 10000; // 10 seconds
    const maxAttempts = 24; // 4 minutes total (24 * 10 seconds)
    let attempts = 0;
  
    const pollForResponse = async () => {
      try {
        let url = `https://menubot-backend.onrender.com/chat/?query=${encodeURIComponent(query)}`;
        if (chatId) {
          url += `&chat_id=${chatId}`;
        }
  
        const response = await fetch(url);
        const data = await response.json();
  
        if (!chatId && data.chat_id) {
          setChatId(data.chat_id);
        }
  
        if (data.status === 'processing') {
          attempts++;
          if (attempts >= maxAttempts) {
            throw new Error('Max attempts reached');
          }
          setConversations(prev => 
            prev.map((conv, index) => 
              index === prev.length - 1 
                ? { ...conv, response: `Still processing... (${attempts * 10} seconds)` }
                : conv
            )
          );
          setTimeout(pollForResponse, pollInterval);
        } else {
          setConversations(prev => 
            prev.map((conv, index) => 
              index === prev.length - 1 
                ? { ...conv, response: data.response_text, items: data.returned_items || [] }
                : conv
            )
          );
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setConversations(prev => 
          prev.map((conv, index) => 
            index === prev.length - 1 
              ? { ...conv, response: 'An error occurred while fetching the data. Please try again.' }
              : conv
          )
        );
        setIsLoading(false);
      }
    };
  
    pollForResponse();
  
    setQuery('');
    setIsPromptsExpanded(false);
  }, [query, chatId]);



  

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
      <DialogContent className={`max-w-[90%] sm:max-w-[425px] mx-auto p-0 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
        <div className="relative">
          <img
            src={item.image_link}
            alt={item.name_of_item}
            className="w-full h-64 object-cover"
          />
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <h3 className={`text-2xl font-bold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            {item.name_of_item}
          </h3>
          <div className="flex items-center mb-4">
            <Star className="text-yellow-400 mr-1" size={16} />
            <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
              4.5 (120 reviews)
            </span>
          </div>
          <p className={`mb-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            {item.description}
          </p>
          <div className="flex justify-between items-center mb-6">
            <p className="text-2xl font-bold text-blue-600">
              ₹{item.cost.toFixed(2)}
            </p>
          </div>
          <motion.button
            onClick={() => {
              addToCart(item);
              onClose();
            }}
            className="w-full bg-blue-500 text-white py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add to Cart
          </motion.button>
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

  const inspireButtonControls = useAnimation();

  useEffect(() => {
    const animateInspireButton = async () => {
      while (true) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 10 seconds
        if (!isPromptsExpanded) {
          await inspireButtonControls.start({
            y: [0, -10, 0],
            transition: { duration: 0.5, times: [0, 0.5, 1] }
          });
        }
      }
    };

    animateInspireButton();
  }, [isPromptsExpanded, inspireButtonControls]);

  const bounceAnimation = {
    y: [0, -4, 0],
    transition: {
      duration: 1.0,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  };
  const inspireControls = useAnimation();
  useEffect(() => {
    const animateInspire = async () => {
      while (true) {
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for 3 seconds
        if (!isPromptsExpanded) {
          await inspireControls.start({
            y: [0, -6, 0],
            transition: {
              duration: 0.6,
              times: [0, 0.4, 1],
              ease: [0.34, 1.56, 0.64, 1], // Custom spring-like easing
            }
          });
        }
      }
    };

    animateInspire();
  }, [inspireControls, isPromptsExpanded]);
  const NavButton = React.useMemo(() => {
    return ({ icon: Icon, text, onClick, isActive, badge = null }) => (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-300 w-20 relative ${
          isActive
            ? theme === 'light'
              ? 'text-blue-600'
              : 'text-blue-400'
            : theme === 'light'
            ? 'text-gray-600 hover:text-gray-800'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <motion.div 
          className="relative"
          animate={text === "Inspire" 
            ? isPromptsExpanded 
              ? { rotate: 180 } 
              : inspireControls
            : {}
          }
          transition={{ duration: 0.3 }}
        >
          <Icon size={24} />
          {badge !== null && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
            >
              {badge}
            </motion.div>
          )}
        </motion.div>
        <span className="text-xs font-medium">{text}</span>
      </motion.button>
    );
  }, [theme, isPromptsExpanded, inspireControls]);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-gray-100 to-gray-200' 
        : 'bg-gradient-to-br from-gray-900 to-gray-800'
    }`}>
       <AnimatePresence>
        {showWelcome && (
          <WelcomeScreen onGetStarted={handleGetStarted} theme={theme} />
        )}
      </AnimatePresence>
  
      {!showWelcome && (
        <>
             <header 
            className={`flex-shrink-0 z-50 p-4 shadow-md ${
              theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-900 text-white'
            }`}
          >
            <div className="max-w-4xl mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">RestoChat</h1>
              <div className="flex items-center space-x-4">
                <ClearChatButton onClearChat={clearChat} theme={theme} isVisible={isChatStarted} />
                <motion.button 
                  onClick={toggleTheme} 
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {theme === 'light' ? '🌙' : '☀️'}
                </motion.button>
              </div>
            </div>
          </header>
  
          <main 
        ref={mainContentRef}
        className={`flex-grow overflow-y-auto ${conversations.length === 0 ? 'flex items-center justify-center' : 'p-4'}`}
      >
        <div className="w-full max-w-4xl mx-auto">
          {conversations.length === 0 ? (
            <EmptyState theme={theme} />
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {conversations.map((conv, index) => (
                  <motion.div 
                    key={index} 
                    className="mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className={`p-6 rounded-lg shadow-lg cursor-pointer ${
                        theme === 'light' ? 'bg-white hover:bg-gray-50' : 'bg-gray-800 hover:bg-gray-700'
                      } transition-colors duration-200`}
                      onClick={() => openStory(index)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <h3 className={`text-lg font-semibold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                        {conv.query}
                      </h3>
                      <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                        {conv.response.substring(0, 100)}...
                      </p>
                      {conv.items.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-4">
                          {conv.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex flex-col items-center">
                              <motion.img
                                src={item.image_link}
                                alt={item.name_of_item}
                                className="w-16 h-16 object-cover rounded-full border-2 border-blue-500 cursor-pointer"
                                whileHover={{ scale: 1.1 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedItemFromConversation(item);
                                }}
                              />
                              <p className={`text-xs mt-1 text-center ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                                {item.name_of_item.length > 20 ? `${item.name_of_item.substring(0, 20)}...` : item.name_of_item}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          <div ref={conversationEndRef} />
        </div>
      </main>

  
          <footer className={`flex-shrink-0 z-50 ${
            theme === 'light' ? 'bg-white bg-opacity-90' : 'bg-gray-900 bg-opacity-90'
          } backdrop-blur-md`}>
            <div className="max-w-4xl mx-auto p-4 space-y-4">
              <motion.div
                initial={false}
                animate={{ height: isPromptsExpanded ? 'auto' : '0' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  <AnimatePresence>
                    {suggestivePrompts.map((prompt, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.05 }}
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
                  className={`w-full p-4 pr-24 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-base ${
                    theme === 'light' 
                      ? 'bg-gray-100 text-gray-800 placeholder-gray-500' 
                      : 'bg-gray-800 text-white placeholder-gray-400'
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
                    <Mic size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="submit"
                    className="p-2 bg-blue-500 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Send size={20} />
                  </motion.button>
                </div>
              </form>
              <nav className="flex justify-around items-center py-2 border-gray-200 dark:border-gray-700">
            <NavButton icon={Menu} text="Menu" onClick={toggleMenu} isActive={isMenuOpen} />
            <NavButton
              icon={isPromptsExpanded ? ChevronDown : ChevronUp}
              text={isPromptsExpanded ? "Hide" : "Inspire"}
              onClick={() => setIsPromptsExpanded(!isPromptsExpanded)}
              isActive={isPromptsExpanded}
              isAnimated={true}
            />
            <NavButton 
              icon={ShoppingCart} 
              text="Cart" 
              onClick={toggleCart} 
              isActive={isCartOpen}
              badge={cartItemCount > 0 ? cartItemCount : null}
            />
          </nav>
            </div>
          </footer>
        </>
      )}
  
  <AppleInspiredStoryView
  isOpen={isStoryOpen}
  onClose={closeStory}
  conversations={conversations}
  initialIndex={activeStoryIndex}
  addToCart={addToCart}
  theme={theme}
  // userName={"John"}
/>
  
      <AnimatePresence>
        {isMenuOpen && (
          <IsolatedMenu
            isOpen={isMenuOpen}
            onClose={toggleMenu}
            theme={theme}
            menuItems={menuItems}
            addToCart={addToCart}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <IsolatedCart
            isOpen={isCartOpen}
            onClose={toggleCart}
            theme={theme}
            cartItems={cart}
            onIncrement={addToCart}
            onDecrement={removeFromCart}
          />
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
      {selectedItemFromConversation && (
        <ItemModal
          item={selectedItemFromConversation}
          isOpen={!!selectedItemFromConversation}
          onClose={() => setSelectedItemFromConversation(null)}
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