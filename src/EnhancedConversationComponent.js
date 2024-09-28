import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, User } from 'lucide-react';

const EnhancedConversationComponent = ({ conversations, theme, openStory }) => {
  return (
    <div className="space-y-6">
      <AnimatePresence>
        {conversations.map((conv, index) => (
          <motion.div 
            key={index} 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className={`p-6 rounded-2xl shadow-lg cursor-pointer ${
                theme === 'light' 
                  ? 'bg-gradient-to-br from-white to-blue-50 hover:from-blue-50 hover:to-white' 
                  : 'bg-gradient-to-br from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-800'
              } transition-all duration-300`}
              onClick={() => openStory(index)}
              whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start space-x-4 mb-4">
                <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-blue-100' : 'bg-blue-900'}`}>
                  <User size={24} className={theme === 'light' ? 'text-blue-600' : 'text-blue-300'} />
                </div>
                <div className="flex-grow">
                  <h3 className={`text-lg font-semibold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                    {conv.query}
                  </h3>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                    {conv.query}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-green-100' : 'bg-green-900'}`}>
                  <MessageCircle size={24} className={theme === 'light' ? 'text-green-600' : 'text-green-300'} />
                </div>
                <div className="flex-grow">
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                    {conv.response.substring(0, 150)}...
                  </p>
                </div>
              </div>

              {conv.items.length > 0 && (
                <div className="mt-4">
                  <h4 className={`text-sm font-semibold mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    Recommended Items:
                  </h4>
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {conv.items.map((item, itemIndex) => (
                      <motion.div
                        key={itemIndex}
                        className="flex-shrink-0"
                        whileHover={{ scale: 1.05 }}
                      >
                        <img 
                          src={item.image_link} 
                          alt={item.name_of_item} 
                          className="w-16 h-16 object-cover rounded-lg shadow-md"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedConversationComponent;