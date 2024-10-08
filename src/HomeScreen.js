import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Search, Star, ShoppingBag } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import EmptyState from './EmptyState';
import ItemModal from './ItemModal';

const HomeScreen = ({ 
  theme, 
  conversations, 
  onSearch, 
  addToCart, 
  openStory,
  topRatedItems,
  isLoading
}) => {
  const [showFullChat, setShowFullChat] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef(null);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
    setSearchQuery('');
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setShowFullChat(true);
      } else if (scrollTop === 0) {
        setShowFullChat(false);
      }
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className={`h-full flex flex-col ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
      <motion.div 
        className="flex-grow overflow-y-auto"
        ref={scrollRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto p-4">
          <motion.h1 
            className={`text-3xl font-bold mb-6 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Welcome to RestoChat
          </motion.h1>

          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What are you craving today?"
                className={`w-full p-4 pr-12 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                  theme === 'light'
                    ? 'bg-white text-gray-800 border-gray-200'
                    : 'bg-gray-800 text-white border-gray-700'
                }`}
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                <Search className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'} />
              </button>
            </div>
          </form>

          <EmptyState theme={theme} onItemClick={handleItemClick} addToCart={addToCart} />

          {conversations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <h2 className={`text-2xl font-semibold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                Recent Conversations
              </h2>
              <div className="space-y-4">
                {conversations.slice(0, showFullChat ? undefined : 2).map((conv, index) => (
                  <motion.div
                    key={index}
                    className={`p-4 rounded-lg shadow-md cursor-pointer ${
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
                      <div className="mt-4 flex space-x-4 overflow-x-auto py-2">
                        {conv.items.slice(0, 3).map((item, itemIndex) => (
                          <div key={itemIndex} className="flex-shrink-0">
                            <img
                              src={item.image_link}
                              alt={item.name_of_item}
                              className="w-16 h-16 object-cover rounded-full border-2 border-blue-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleItemClick(item);
                              }}
                            />
                          </div>
                        ))}
                        {conv.items.length > 3 && (
                          <div className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                            +{conv.items.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              {conversations.length > 2 && (
                <motion.button
                  onClick={() => setShowFullChat(!showFullChat)}
                  className={`mt-4 flex items-center justify-center w-full py-2 rounded-full ${
                    theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-700 text-white'
                  } hover:bg-opacity-80 transition-colors`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showFullChat ? (
                    <>
                      <ChevronUp className="mr-2" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-2" />
                      Show More
                    </>
                  )}
                </motion.button>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && selectedItem && (
          <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
            <DialogContent className={theme === 'light' ? 'bg-white' : 'bg-gray-800'}>
              <ItemModal
                item={selectedItem}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                theme={theme}
                addToCart={addToCart}
              />
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;