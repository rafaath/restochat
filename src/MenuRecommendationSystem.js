import React, { useState, useEffect, useRef } from 'react';
import { Loader, ShoppingCart, Mic, Send, X, Plus, Minus, Sparkles, Coffee, Pizza, Cake, Menu, Search} from 'lucide-react';
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
  const searchInputRef = useRef(null);
  const conversationEndRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([
    {
        "name_of_item": "High Protein - Soboro Don Low Gi Rice Bowl",
        "cost": 339.0,
        "description": "A classic japanese dish made of tangy and spicy minced chicken served over a bed of our healthy low gi rice topped with slices of perfectly boiled eggs. A dish where taste meets health. High protein and low gi balanced meal (gi value - 48) [Energy: 613.4 kcal, Protein: 38.1g, Carbohydrates: 54.5g, Fiber: 3.7g, Fat: 25.1g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/9/0cbbfa59-6f1e-4efe-8419-8604a1445eca_f56ce6d7-7216-4e45-91eb-3eaeec10432d.jpg"
    },
    {
        "name_of_item": "High Protein - Butter Chicken Low Gi Rice Bowl",
        "cost": 339.0,
        "description": "A delicious chicken gravy celebrating the goodness of desi butter, served alongside our special low gi rice. A dish where taste meets health. High protein and low gi balanced meal. Taste bhi. . . Health bhi. . . (gi value - 48) [Energy: 602 kcal, Protein: 29.9g, Carbohydrates: 58.4g, Fiber: 4.2g, Fat: 27.1g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/7/9e59321d-7b4d-48ba-9bd4-125743ed61d6_2b180860-a5db-4633-b603-eab5f872e684.jpg"
    },
    {
        "name_of_item": "High Protein - Schezwan Chilli Chicken Low Gi Rice Bowl",
        "cost": 339.0,
        "description": "A deliciously aromatic and flavourful schezwan chicken rice bowl prepared with our special low gi rice ,schezwan sauce and chicken. A dish where taste meets health. High protein and low gi balance meal (gi value - 48) [Energy: 513.6 kcal, Protein: 29.1g, Carbohydrates: 54.7g, Fiber: 3.4g, Fat: 18.2g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/9/6341123b-a1b3-4a93-be4d-d2d994fe3e22_380c620f-1e11-4938-8074-3a55753d2cdc.jpg"
    }
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
    }
  };

  const handleSuggestivePrompt = (promptText) => {
    setQuery(promptText);
    handleSearch({ preventDefault: () => {} });
  };

  const PromptButton = ({ icon: Icon, text }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => handleSuggestivePrompt(text)}
      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 group text-sm sm:text-base"
    >
      <Icon size={16} className="group-hover:animate-bounce" />
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



  const ItemCard = ({ item }) => (
    <div 
      className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col w-full h-96 cursor-pointer transform transition-all duration-300 hover:scale-105"
      onClick={() => setSelectedItem(item)}
    >
      <div className="h-48 overflow-hidden">
        <img src={item.image_link} alt={item.name_of_item} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-gray-800 mb-2">{item.name_of_item}</h3>
          <p className="text-gray-600 text-sm line-clamp-3">{item.description}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-2xl font-bold text-blue-600">₹{item.cost.toFixed(2)}</p>
          <button 
            onClick={(e) => { e.stopPropagation(); addToCart(item); }}
            className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

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
  

//   const updatePrompts = (newPrompts) => {
//     setSuggestivePrompts(newPrompts);
//   };
  
//   // Later, you could call this function with new prompts
//   updatePrompts([
//     { icon: Coffee, text: "Show me healthy options" },
//     { icon: Coffee, text: "What's your chef's special today?" },
//     { icon: Coffee, text: "I need a quick meal" }
//   ]);


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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">RestoChat</h1>
      </header>

      <main className="flex-grow p-4 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {conversations.map((conv, index) => (
            <div key={index} className="space-y-4">
              <div className="bg-blue-100 p-4 rounded-lg shadow">
                <p className="font-semibold">You: {conv.query}</p>
              </div>
              {conv.response && (
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="font-semibold mb-2">AI:</p>
                  <ReactMarkdown className="prose">
                    {conv.response}
                  </ReactMarkdown>
                </div>
              )}
              {conv.items.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {conv.items.map((item, itemIndex) => (
                    <ItemCard key={itemIndex} item={item} />
                  ))}
                </div>
              )}
            </div>
          ))}
          <div ref={conversationEndRef} />
        </div>
      </main>

      <footer className={`bg-white p-6 shadow-lg rounded-t-3xl transition-all duration-300 ease-in-out ${isMenuOpen ? 'transform translate-y-[calc(100%-4rem)]' : ''}`}>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-wrap justify-center gap-4">
            <AnimatePresence>
              {suggestivePrompts.map((prompt, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ 
                    transform: `translateX(${index % 3 === 1 ? '20px' : index % 3 === 2 ? '-20px' : '0'})`,
                  }}
                >
                  <PromptButton icon={prompt.icon} text={prompt.text} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              ref={searchInputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What would you like to eat?"
              className="w-full p-4 pr-20 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-base sm:text-lg"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={handleVoiceInput}
                className={`p-2 rounded-full ${isListening ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'} hover:bg-gray-300 transition-colors`}
              >
                <Mic size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="submit"
                className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Send size={18} />
              </motion.button>
            </div>
          </form>
        </div>
      </footer>

      <div className={`fixed bottom-0 left-0 right-0 bg-white shadow-9xl rounded-t-3xl transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'h-[calc(100%-3rem)]' : 'h-0'}`} style={{ boxShadow: '0px -4px 70px rgba(0, 0, 0, 0.9)' }}>
        <div className="p-6 h-full overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Full Menu</h2>
            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-gray-700"
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
              className="w-full p-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {filteredMenuItems.map((item) => (
              <MenuItemCard key={item.name_of_item} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Full Menu Button */}
      <button
        onClick={toggleMenu}
        className="fixed bottom-24 left-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      >
        <Menu size={24} />
      </button>

      {selectedItem && (
        <ItemModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}


      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg p-4 overflow-auto transition-transform duration-300 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <h2 className="text-xl font-bold mb-4">Your Cart</h2>
        <button
          onClick={() => setIsCartOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        {cart.map((item, index) => (
          <div key={index} className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">{item.name_of_item}</h3>
              <p className="text-sm text-gray-600">₹{item.cost} x {item.quantity}</p>
            </div>
            <div className="flex items-center">
              <button onClick={() => removeFromCart(item)} className="text-red-500 hover:text-red-700 mr-2">
                <Minus size={16} />
              </button>
              <span className="mx-2">{item.quantity}</span>
              <button onClick={() => addToCart(item)} className="text-green-500 hover:text-green-700 ml-2">
                <Plus size={16} />
              </button>
            </div>
          </div>
        ))}
        <div className="mt-4 pt-4 border-t">
          <p className="text-xl font-bold">
            Total: ₹{cart.reduce((total, item) => total + item.cost * item.quantity, 0).toFixed(2)}
          </p>
        </div>
      </div>

      <button
        onClick={toggleCart}
        className="fixed bottom-24 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      >
        <ShoppingCart size={24} />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
            {cart.reduce((total, item) => total + item.quantity, 0)}
          </span>
        )}
      </button>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Loader size={48} className="text-white animate-spin" />
        </div>
      )}
    </div>
  );
};

export default MenuRecommendationSystem;