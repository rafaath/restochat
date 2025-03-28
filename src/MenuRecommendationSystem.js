import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation, LayoutGroup } from 'framer-motion';
import {
  Loader, ShoppingCart, Mic, Send, X, Plus, Minus, Sparkles,
  Coffee, Pizza, Cake, Menu, Search, Star, ChevronDown, ChevronUp,
  ArrowRight, ArrowLeft, Trash2, AlertCircle, RefreshCw, Home, MessageCircle, Moon, Sun, Settings,
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

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
import ItemModal from './ItemModal';  // Make sure the path is correct
import fullMenuData from './full_menu.json';
import prompts from './prompts.json';
import { getSimulatedResponse, useSimulatedApi } from './simulatedResponses.js';
import { useUser } from '@clerk/clerk-react';
import ChatInterface from './ChatInterface';
import RollTheDice from './RollTheDice';
import ComboDetailsModal from './ComboDetailsModal';

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
            className={`p-2 rounded-full shadow-md transition-colors ${theme === 'light'
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
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [cart, setCart] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
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
  const { user } = useUser();

  const [selectedComboItem, setSelectedComboItem] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  // ... (existing code)

  // const handleItemClick = (item) => {
  //   setSelectedItemFromConversation(item);
  //   setIsModalOpen(true);
  // };

  const handleComboItemClick = (item) => {
    setSelectedComboItem(item);
    setIsModalOpen(true);
  };
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const clearCart = () => {
    setCart([]); // Assuming you're using React state to manage cart items
    // Or if you're using a state management library:
    // dispatch({ type: 'CLEAR_CART' });
  };

  const clearChat = () => {
    setConversations([]);
    setChatId(null);
    // setActiveTab('chat');
  };
  const isChatStarted = conversations.length > 0;
  const storyControls = useAnimation();

  const [showWelcome, setShowWelcome] = useState(true);
  // ... (other state variables remain the same)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedItemFromConversation, setSelectedItemFromConversation] = useState(null);

  const { getToken } = useAuth();
  const mainContentRef = useRef(null);

  const [isRollTheDiceOpen, setIsRollTheDiceOpen] = useState(false);


  // ... existing functions and effects ...

  const handleOpenRollTheDice = useCallback(() => {
    setIsRollTheDiceOpen(true);
  }, []);


  const [selectedCombo, setSelectedCombo] = useState(null);
  const [isComboModalOpen, setIsComboModalOpen] = useState(false);

  const handleComboClick = useCallback((combo) => {
    setSelectedCombo(combo);
    setIsComboModalOpen(true);
  }, []);


  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef(null);
  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  const [displayedPrompts, setDisplayedPrompts] = useState([]);

  // Assume this is your full list of prompts
  const allPrompts = prompts;
  const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  };

  useEffect(() => {
    const selectRandomPrompts = () => {
      const shuffled = shuffleArray([...allPrompts]);
      setDisplayedPrompts(shuffled.slice(0, 10));
    };

    selectRandomPrompts();
  }, []);

  // const [selectedItem, setSelectedItem] = useState(null);

  const [menuItems, setMenuItems] = useState([]);
  const promptsContainerRef = useRef(null);

  useEffect(() => {
    // Load menu items from the JSON file
    console.log("Loading menu items...");
    console.log("fullMenuData:", fullMenuData);
    setMenuItems(fullMenuData || []);
  }, []);



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



  const EmptyChatState = React.memo(({ theme, searchInputRef, onStartChatting }) => (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 max-w-2xl mx-auto">
      <div className="flex justify-center mb-4">
        <MessageCircle size={64} className={`${theme === 'light' ? 'text-gray-400' : 'text-gray-600'}`} />
      </div>
      <h2 className={`text-2xl font-bold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
        Start a New Conversation
      </h2>
      <p className={`text-lg mb-6 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
        Ask about our menu, dietary options, or get personalized recommendations!
      </p>
      <button
        onClick={() => {
          searchInputRef.current?.focus();
          onStartChatting();
        }}
        className="bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition-colors"
      >
        Start Chatting
      </button>
    </div>
  ));

  const TabButton = React.useMemo(() => {
    return ({ icon: Icon, isActive, onClick }) => (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`relative p-2 rounded-full transition-all duration-300 ${isActive
          ? theme === 'light'
            ? 'text-blue-600'
            : 'text-blue-400'
          : theme === 'light'
            ? 'text-gray-600 hover:text-gray-800'
            : 'text-gray-400 hover:text-white'
          }`}
      >
        <Icon size={24} />
        {isActive && (
          <motion.div
            layoutId="activeTab"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-current"
            initial={false}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </motion.button>
    );
  }, [theme]);

  // const handleSearch = useCallback(async (e) => {
  //   e?.preventDefault();
  //   const searchQuery = query.trim();
  //   if (!searchQuery) return;

  //   setActiveTab('chat'); // Switch to chat tab immediately

  //   // Add user's query to conversations
  //   setConversations(prev => [...prev, { query: searchQuery, response: null, items: [] }]);

  //   setIsLoading(true);

  //   try {
  //     let data;
  //     if (useSimulatedApi) {
  //       data = await getSimulatedResponse(searchQuery);
  //     } else {
  //       let url = `https://menubot-backend.onrender.com/chat/?query=${encodeURIComponent(searchQuery)}`;
  //       if (chatId) {
  //         url += `&chat_id=${chatId}`;
  //       }
  //       const response = await fetch(url);
  //       data = await response.json();
  //     }

  //     if (!chatId && data.chat_id) {
  //       setChatId(data.chat_id);
  //     }

  //     // Update the last conversation with the response
  //     setConversations(prev => 
  //       prev.map((conv, index) => 
  //         index === prev.length - 1 
  //           ? { ...conv, response: data.response_text, items: data.returned_items || [] }
  //           : conv
  //       )
  //     );
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //     // Update the last conversation with the error message
  //     setConversations(prev => 
  //       prev.map((conv, index) => 
  //         index === prev.length - 1 
  //           ? { ...conv, response: 'An error occurred while fetching the data. Please try again.' }
  //           : conv
  //       )
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }

  //   setQuery('');
  //   setSelectedPrompt(null);
  //   setIsPromptsExpanded(false);
  // }, [query, chatId, setChatId, setConversations, setActiveTab, setIsPromptsExpanded]);


  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

  const handleSearch = useCallback(async (e) => {
    e?.preventDefault();
    const searchQuery = query.trim();
    if (!searchQuery || isWaitingForResponse) return;



    setActiveTab('chat');
    setConversations(prev => [...prev, { query: searchQuery, response: null, items: [] }]);
    setIsWaitingForResponse(true);
    setIsLoading(true);

    const pollInterval = 10000; // 10 seconds
    const maxAttempts = 24; // 4 minutes total (24 * 10 seconds)
    let attempts = 0;

    const pollForResponse = async () => {
      try {
        let url = `/chat/?query=${encodeURIComponent(searchQuery)}&search_engine=vector`;
        if (chatId) {
          url += `&chat_id=${chatId}`;
        }

        const token = await getToken();

        const response = await axios.get(url, {
          baseURL: 'https://menubot-backend.onrender.com',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("nig", response);
        const data = response.data;

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
          setIsWaitingForResponse(false);
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
        setIsWaitingForResponse(false);
      }
    };

    pollForResponse();

    setQuery('');
    setSelectedPrompt(null);
    setIsPromptsExpanded(false);
  }, [
    query,
    chatId,
    setChatId,
    setConversations,
    setIsLoading,
    setIsPromptsExpanded,
  ]);






  const handleSuggestivePrompt = useCallback((promptText) => {
    setQuery(promptText);
    setSelectedPrompt(promptText);
  }, []);



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

  const addToCart = useCallback((newItem) => {
    setCart(prevCart => {
      if (newItem.isCombo) {
        const existingComboIndex = prevCart.findIndex(
          item => item.isCombo && item.combo_id === newItem.combo_id
        );

        if (existingComboIndex !== -1) {
          // Increment quantity of existing combo
          const updatedCart = [...prevCart];
          updatedCart[existingComboIndex] = {
            ...updatedCart[existingComboIndex],
            quantity: updatedCart[existingComboIndex].quantity + 1
          };
          return updatedCart;
        } else {
          // Add new combo with quantity 1
          return [...prevCart, { ...newItem, quantity: 1, uniqueId: Date.now() }];
        }
      } else {
        // Existing logic for regular items
        const existingItemIndex = prevCart.findIndex(item => item.item_id === newItem.item_id);

        if (existingItemIndex !== -1) {
          const updatedCart = [...prevCart];
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            quantity: updatedCart[existingItemIndex].quantity + 1
          };
          return updatedCart;
        } else {
          return [...prevCart, { ...newItem, quantity: 1 }];
        }
      }
    });
  }, []);

  const removeFromCart = useCallback((itemToRemove) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (itemToRemove.isCombo) {
          if (item.isCombo && item.combo_id === itemToRemove.combo_id) {
            return item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : null;
          }
        } else {
          if (item.item_id === itemToRemove.item_id) {
            return item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : null;
          }
        }
        return item;
      }).filter(Boolean);
    });
  }, []);

  const handleChatButtonClick = useCallback(() => {
    setActiveTab('chat');
    setIsPromptsExpanded(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
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



  const handleItemClick = (item) => {
    setSelectedItemFromConversation(item);
    setIsModalOpen(true);
  };

  // const [displayedPrompts, setDisplayedPrompts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // const promptsContainerRef = useRef(null);

  const selectRandomPrompts = useCallback(() => {
    const shuffled = shuffleArray([...allPrompts]);
    return shuffled.slice(0, 10);
  }, []);

  useEffect(() => {
    setDisplayedPrompts(selectRandomPrompts());
  }, [selectRandomPrompts]);

  const handleRefreshPrompts = async () => {
    setIsRefreshing(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newPrompts = selectRandomPrompts();
    setDisplayedPrompts(newPrompts);

    setIsRefreshing(false);

    // Scroll to the beginning after a short delay to allow for render
    setTimeout(() => {
      if (promptsContainerRef.current) {
        promptsContainerRef.current.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const PromptButton = ({ emoji, text }) => {
    const isSelected = selectedPrompt === text;
    const [isHovered, setIsHovered] = useState(false);
    const buttonRef = useRef(null);

    useEffect(() => {
      if (isSelected && buttonRef.current) {
        buttonRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }, [isSelected]);

    const buttonVariants = {
      selected: {
        scale: [1, 1.01, 1],
        transition: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      },
      notSelected: {
        scale: 1
      }
    };

    const emojiVariants = {
      initial: { scale: 1, rotate: 0 },
      hover: {
        scale: [1, 1.1, 1],
        rotate: [0, -5, 5, 0],
        transition: {
          duration: 0.4,
          ease: "easeInOut"
        }
      },
      selected: {
        scale: [1, 1.1, 1],
        rotate: [-5, 5, -5, 0],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      }
    };

    const sparkleVariants = {
      hidden: { opacity: 0, scale: 0 },
      visible: {
        opacity: [0, 0.7, 0],
        scale: [0.4, 1, 0.4],
        transition: {
          duration: 1.2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeOut"
        }
      }
    };

    return (
      <motion.div
        ref={buttonRef}
        className="relative group"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        initial="notSelected"
        animate={isSelected ? "selected" : "notSelected"}
      >
        {/* Ambient highlight effect without blur */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isSelected ? 0.6 : 0,
            scale: isSelected ? 1 : 0.8,
          }}
          className={`
            absolute inset-0 -m-0.5
            rounded-full
            ${theme === 'light'
              ? 'bg-gradient-to-r from-blue-200/20 via-purple-200/20 to-pink-200/20'
              : 'bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10'
            }
          `}
        />

        {/* Subtle sparkles */}
        {(isSelected || isHovered) && (
          <>
            <motion.div
              variants={sparkleVariants}
              initial="hidden"
              animate="visible"
              className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${theme === 'light' ? 'bg-yellow-300/70' : 'bg-yellow-200/70'
                }`}
            />
            <motion.div
              variants={sparkleVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className={`absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 rounded-full ${theme === 'light' ? 'bg-blue-300/70' : 'bg-blue-200/70'
                }`}
            />
          </>
        )}

        <motion.button
          layout
          variants={buttonVariants}
          whileHover={{
            scale: 1.02,
            y: -1,
            transition: { duration: 0.2 }
          }}
          whileTap={{
            scale: 0.98,
            rotate: [-1, 0],
            transition: { duration: 0.2 }
          }}
          onClick={() => {
            handleSuggestivePrompt(text);
            if (window.navigator.vibrate) {
              window.navigator.vibrate(40);
            }
          }}
          className={`
            relative px-3 py-1.5 rounded-full 
            shadow-sm
            transition-all duration-300 
            flex items-center space-x-1.5 
            text-sm flex-shrink-0 
            border
            ${theme === 'light'
              ? `
                bg-white
                hover:bg-blue-50/90
                border-blue-100
                text-gray-700
                hover:text-blue-600
                ${isSelected ? 'bg-blue-50/90 text-blue-700 border-blue-200' : ''}
              `
              : `
                bg-gray-800
                hover:bg-gray-750
                border-blue-500/20
                text-gray-100
                hover:text-blue-200
                ${isSelected ? 'bg-blue-900/30 text-blue-200 border-blue-400/30' : ''}
              `
            }
            ${isSelected ? 'ring-1 ring-blue-400/40 ring-offset-1 ring-offset-transparent' : ''}
            hover:shadow-md
            hover:border-blue-300/40
            active:shadow-inner
          `}
        >
          {/* Subtle highlight effect */}
          {isSelected && (
            <motion.div
              className={`
                absolute inset-0 
                bg-gradient-to-r from-transparent via-current to-transparent
                opacity-5
                rounded-full
              `}
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear"
              }}
            />
          )}

          <motion.span
            variants={emojiVariants}
            initial="initial"
            animate={isSelected ? "selected" : isHovered ? "hover" : "initial"}
            className="text-sm flex items-center justify-center w-5 h-5"
          >
            {emoji}
          </motion.span>

          <span className="truncate font-medium pr-1 relative text-xs">
            {text}
            {isSelected && (
              <motion.div
                layoutId="underline"
                className={`absolute -bottom-0.5 left-0 right-0 h-px rounded-full ${theme === 'light' ? 'bg-blue-400/70' : 'bg-blue-400/70'
                  }`}
                transition={{ duration: 0.2 }}
              />
            )}
          </span>
        </motion.button>
      </motion.div>
    );
  };

  const RefreshButton = () => (
    <motion.button
      layout
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleRefreshPrompts}
      disabled={isRefreshing}
      className={`p-1 rounded-full shadow-sm hover:shadow-md transition-all duration-300 ${theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-800 text-white'
        } ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <motion.div
        animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 0.5, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
      >
        {isRefreshing ? <Loader size={16} /> : <RefreshCw size={16} />}
      </motion.div>
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
        className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-300 w-20 relative ${isActive
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
          <Icon size={20} />
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
        <span className="text-[0.7rem] font-medium">{text}</span>
      </motion.button>
    );
  }, [theme, isPromptsExpanded, inspireControls]);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);


  useEffect(() => {
    const handleScroll = (e) => {
      const container = promptsContainerRef.current;
      if (container) {
        // Add a subtle shadow when scrolling
        const hasScroll = container.scrollLeft > 0;
        container.style.boxShadow = hasScroll
          ? 'inset 10px 0 20px -10px rgba(0, 0, 0, 0.1)'
          : 'none';
      }
    };

    const container = promptsContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);




  const InspireNavButton = React.memo(({ icon: Icon, text, onClick, isActive, badge = null, theme, isPromptsExpanded }) => {
    // For the Inspire button, show correct text and icon based on expanded state
    const isInspireButton = text === "Inspire";
    const buttonText = isInspireButton ? (isPromptsExpanded ? "Hide" : "Inspire") : text;
    const ButtonIcon = isInspireButton ? (isPromptsExpanded ? ChevronDown : ChevronUp) : Icon;

    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-300 w-20 relative ${isActive
          ? theme === 'light'
            ? 'text-blue-600'
            : 'text-blue-400'
          : theme === 'light'
            ? 'text-gray-600 hover:text-gray-800'
            : 'text-gray-400 hover:text-white'
          }`}
      >
        <div className="relative">
          <ButtonIcon size={20} />
          {badge !== null && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
            >
              {badge}
            </motion.div>
          )}
        </div>
        <span className="text-[0.7rem] font-medium">{buttonText}</span>
      </motion.button>
    );
  });





  const footerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      // Only apply this fix on mobile devices
      if (window.innerWidth <= 768) {
        const visualViewport = window.visualViewport;
        if (visualViewport) {
          const bottomBarHeight = window.innerHeight - visualViewport.height;
          document.documentElement.style.setProperty(
            '--viewport-bottom',
            `${bottomBarHeight}px`
          );
        }
      }
    };

    // Listen to the visualViewport resize event
    window.visualViewport?.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('scroll', handleResize);

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('scroll', handleResize);
    };
  }, []);





  const [showEmptyState, setShowEmptyState] = useState(true);

  useEffect(() => {
    // Only show empty state when there are no conversations and the query is empty
    setShowEmptyState(conversations.length === 0 && query.trim() === '');
  }, [conversations, query]);

  const handleStartChatting = () => {
    setIsPromptsExpanded(true);
    // If you want to switch to the chat tab as well:
    setActiveTab('chat');
  };


  return (
    <div className={`app-container h-screen flex flex-col overflow-hidden ${theme === 'light'
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
            className={`flex-shrink-0 z-50 transition-all duration-300 ${theme === 'light'
              ? 'bg-white bg-opacity-90 text-gray-800'
              : 'bg-gray-900 bg-opacity-90 text-white'
              } backdrop-blur-sm`}
          >
            <div className="max-w-4xl mx-auto px-4">
              <div className="flex items-center justify-between h-14">
                <div className="flex items-center space-x-4">
                  <h1 className="text-lg font-bold">RestoChat</h1>
                  <div className="flex space-x-1">
                    <TabButton
                      icon={Home}
                      isActive={activeTab === 'home'}
                      onClick={() => setActiveTab('home')}
                    />
                    <TabButton
                      icon={MessageCircle}
                      isActive={activeTab === 'chat'}
                      onClick={() => setActiveTab('chat')}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className='text-xs'>Welcome, {user.username || user.phoneNumbers[0].phoneNumber}</span>
                  {/* Add a sign out button */}
                  <button className='text-xs' onClick={() => window.Clerk.signOut()}>Sign Out</button>
                  {/* <IconButton 
                      icon={theme === 'light' ? Moon : Sun}
                      onClick={toggleTheme}
                      label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    />
                    <IconButton 
                      icon={Settings}
                      onClick={() => setIsSettingsOpen(true)}
                      label="Open settings"
                    /> */}
                </div>
              </div>
            </div>
          </header>
          {/* <div className="flex justify-center mt-4 mb-2">
            <div className="flex space-x-2">
              <TabButton
                icon={Home}
                text="Home"
                isActive={activeTab === 'home'}
                onClick={() => setActiveTab('home')}
              />
              <TabButton
                icon={MessageCircle}
                text="Chat"
                isActive={activeTab === 'chat'}
                onClick={() => setActiveTab('chat')}
              />
            </div>
          </div> */}

          <main
            ref={mainContentRef}
            className="flex-grow overflow-y-auto no-scrollbar"
          >
            <AnimatePresence mode="wait">
              {activeTab === 'home' && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <EmptyState
                    theme={theme}
                    onItemClick={handleItemClick}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                    cart={cart}
                    menuItems={menuItems}
                    onOpenRollTheDice={handleOpenRollTheDice}
                    onComboClick={handleComboClick}
                  />
                </motion.div>
              )}
              {activeTab === 'chat' && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full overflow-y-auto p-4"
                >
                  {conversations.length === 0 ? (
                    <EmptyChatState
                      theme={theme}
                      searchInputRef={searchInputRef}
                      onStartChatting={handleStartChatting}
                    />
                  ) : (
                    <ChatInterface
                      conversations={conversations}
                      onClearChat={clearChat}
                      theme={theme}
                      openStory={openStory}
                      setSelectedItemFromConversation={setSelectedItemFromConversation}
                      isLoading={isLoading}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={conversationEndRef} />
          </main>

          <footer className={`sticky bottom-0 z-50 border-t ${theme === 'light'
            ? 'bg-white/95 border-gray-200'
            : 'bg-gray-900/95 border-gray-800'} 
  backdrop-blur-lg transition-all duration-300 shadow-lg`}>
            <AnimatePresence>
              {isPromptsExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className={`relative overflow-hidden ${theme === 'light' ? 'bg-gray-50/90' : 'bg-gray-800/90'
                    } backdrop-blur-md`}
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                  <LayoutGroup>
                    <motion.div
                      ref={promptsContainerRef}
                      className="flex items-center gap-2 overflow-x-auto overflow-y-hidden py-2 px-4 no-scrollbar scroll-smooth"
                      style={{
                        scrollBehavior: 'smooth',
                        WebkitOverflowScrolling: 'touch'
                      }}
                    >
                      {displayedPrompts.map((prompt, index) => (
                        <motion.div
                          key={prompt.text}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2, delay: index * 0.03 }}
                        >
                          <PromptButton emoji={prompt.emoji} text={prompt.text} />
                        </motion.div>
                      ))}
                      <RefreshButton />
                    </motion.div>
                  </LayoutGroup>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="max-w-4xl mx-auto px-4 py-3 space-y-3">
              <form onSubmit={handleSearch} className="relative">
                <motion.div
                  initial={false}
                  animate={{
                    scale: query ? 1.02 : 1,
                    boxShadow: query
                      ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                  }}
                  transition={{ duration: 0.2 }}
                  className={`rounded-full ${theme === 'light'
                    ? 'bg-gray-100 hover:bg-gray-50'
                    : 'bg-gray-800 hover:bg-gray-700'
                    } ${isWaitingForResponse ? 'opacity-50' : ''}`}
                >
                  <input
                    type="text"
                    ref={searchInputRef}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      if (e.target.value !== selectedPrompt) {
                        setSelectedPrompt(null);
                      }
                    }}
                    disabled={isWaitingForResponse}
                    placeholder={isWaitingForResponse ? "Waiting for response..." : "What are you craving today?"}
                    className={`w-full p-3.5 pr-24 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-sm ${theme === 'light'
                      ? 'bg-transparent text-gray-800 placeholder-gray-500'
                      : 'bg-transparent text-white placeholder-gray-400'
                      } ${isWaitingForResponse ? 'cursor-not-allowed' : ''}`}
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: isWaitingForResponse ? 1 : 1.05 }}
                      whileTap={{ scale: isWaitingForResponse ? 1 : 0.95 }}
                      type="button"
                      onClick={handleVoiceInput}
                      disabled={isWaitingForResponse}
                      className={`p-2 rounded-full transition-colors ${isListening
                        ? 'bg-red-500 text-white'
                        : theme === 'light'
                          ? 'bg-white text-gray-600 hover:bg-gray-50'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        } ${isWaitingForResponse ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Mic size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: isWaitingForResponse ? 1 : 1.05 }}
                      whileTap={{ scale: isWaitingForResponse ? 1 : 0.95 }}
                      type="submit"
                      disabled={isWaitingForResponse}
                      className={`p-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-colors ${isWaitingForResponse ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                      {isWaitingForResponse ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
                    </motion.button>
                  </div>
                </motion.div>
              </form>

              <nav className="flex justify-around items-center pt-1">
                <NavButton
                  icon={Menu}
                  text="Menu"
                  onClick={toggleMenu}
                  isActive={isMenuOpen}
                />
                <InspireNavButton
                  icon={isPromptsExpanded ? ChevronDown : ChevronUp}
                  text="Inspire"
                  onClick={() => setIsPromptsExpanded(!isPromptsExpanded)}
                  isActive={isPromptsExpanded}
                  theme={theme}
                  isPromptsExpanded={isPromptsExpanded}
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
        removeFromCart={removeFromCart}
        theme={theme}
        onItemClick={handleComboItemClick}
        cart={cart}
      />

      <AnimatePresence>
        {isMenuOpen && (
          <IsolatedMenu
            isOpen={isMenuOpen}
            onClose={toggleMenu}
            theme={theme}
            menuItems={menuItems}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            cart={cart}
            onChatButtonClick={handleChatButtonClick}
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
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isRollTheDiceOpen && (
          <RollTheDice
            isOpen={isRollTheDiceOpen}
            onClose={() => setIsRollTheDiceOpen(false)}
            theme={theme}
            menuItems={menuItems}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            cart={cart}
          />
        )}
      </AnimatePresence>

      {(selectedItemFromConversation || selectedComboItem) && (
        <ItemModal
          item={selectedItemFromConversation || selectedComboItem}
          isOpen={isModalOpen}
          onClose={() => {
            setSelectedItemFromConversation(null);
            setSelectedComboItem(null);
            setIsModalOpen(false);
          }}
          theme={theme}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          cart={cart}
        />
      )}

      {selectedItem && (
        <ItemModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          theme={theme}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          cart={cart}
        />
      )}
      {selectedItemFromConversation && (
        <ItemModal
          item={selectedItemFromConversation}
          isOpen={!!selectedItemFromConversation}
          onClose={() => setSelectedItemFromConversation(null)}
          theme={theme}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          cart={cart}
        />
      )}

      {selectedCombo && (
        <ComboDetailsModal
          isOpen={isComboModalOpen}
          onClose={() => {
            setIsComboModalOpen(false);
            setSelectedCombo(null);
          }}
          combo={selectedCombo}
          theme={theme}
        />
      )}

      {/* {isLoading && (
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
      )} */}
      <style jsx global>{`
  :root {
    --viewport-bottom: 0px;
  }

  .app-container {
    min-height: calc(100vh - var(--viewport-bottom));
    position: relative;
    display: flex;
    flex-direction: column;
  }

  main {
    flex: 1 1 auto;
    overflow-y: auto;
  }

  footer {
    position: sticky;
    bottom: 0;
    width: 100%;
    background: inherit;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
  }

  @supports (padding: env(safe-area-inset-bottom)) {
    footer {
      padding-bottom: env(safe-area-inset-bottom);
    }
  }
`}</style>
    </div>
  );
};

export default MenuRecommendationSystem;
