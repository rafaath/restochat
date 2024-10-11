import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, Send } from 'lucide-react';

const ChatInput = ({ onSearch, onVoiceInput, theme, isListening }) => {
  const [query, setQuery] = useState('');
  const searchInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        ref={searchInputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="What are you craving today?"
        className={`w-full p-3 pr-24 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-sm ${
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
          onClick={onVoiceInput}
          className={`p-1.5 rounded-full ${
            isListening 
              ? 'bg-red-500 text-white' 
              : theme === 'light' ? 'bg-gray-200 text-gray-600' : 'bg-gray-700 text-gray-300'
          } hover:bg-opacity-80 transition-colors`}
        >
          <Mic size={16} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="submit"
          className="p-1.5 bg-blue-500 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Send size={16} />
        </motion.button>
      </div>
    </form>
  );
};

export default ChatInput;