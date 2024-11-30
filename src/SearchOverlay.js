import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, ImageIcon } from 'lucide-react';

const SearchOverlay = ({
    isOpen,
    onClose,
    theme,
    menuItems,
    query,
    setQuery,
    onSearch
}) => {
    const [filteredItems, setFilteredItems] = useState([]);

    useEffect(() => {
        if (!menuItems || !query) return;

        const filtered = menuItems.filter(item =>
            item.name_of_item.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredItems(filtered.slice(0, 6)); // Show top 6 matches
    }, [query, menuItems]);

    const handleItemClick = (itemName) => {
        setQuery(itemName);
    };

    const suggestions = [
        'Pizza', 'Burger', 'Pasta', 'Indian', 'Chinese', 'Desserts',
        'Vegetarian', 'Healthy', 'Spicy', 'Popular'
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="w-full h-full flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className={`flex-grow overflow-y-auto mt-32 px-4 pb-36 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                            {!query && (
                                <div className="max-w-2xl mx-auto">
                                    <h3 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
                                        Popular Searches
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {suggestions.map((suggestion) => (
                                            <motion.button
                                                key={suggestion}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleItemClick(suggestion)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium
                          ${theme === 'light'
                                                        ? 'bg-white text-gray-800 hover:bg-gray-50 shadow-sm'
                                                        : 'bg-gray-800 text-white hover:bg-gray-700 shadow-md'}`}
                                            >
                                                {suggestion}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {query && filteredItems.length > 0 && (
                                <div className="max-w-2xl mx-auto space-y-4">
                                    <h3 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
                                        Matching Items
                                    </h3>
                                    {filteredItems.map((item) => (
                                        <motion.div
                                            key={item.item_id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            onClick={() => handleItemClick(item.name_of_item)}
                                            className={`p-4 rounded-xl cursor-pointer ${theme === 'light'
                                                    ? 'bg-white shadow-sm hover:bg-gray-50'
                                                    : 'bg-gray-800 shadow-md hover:bg-gray-700'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                                                    {item.image_link ? (
                                                        <img
                                                            src={item.image_link}
                                                            alt={item.name_of_item}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className={`w-full h-full flex items-center justify-center ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'
                                                            }`}>
                                                            <ImageIcon className="w-8 h-8 opacity-50" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-grow">
                                                    <h4 className="font-medium mb-1">{item.name_of_item}</h4>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="flex items-center">
                                                            <Star className="w-4 h-4 text-yellow-400" />
                                                            <span className="ml-1 text-sm">
                                                                {item.rating ? item.rating.toFixed(1) : 'N/A'}
                                                            </span>
                                                        </div>
                                                        <span className="text-blue-500 font-medium">
                                                            ₹{item.cost}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {query && filteredItems.length === 0 && (
                                <div className="max-w-2xl mx-auto text-center mt-8">
                                    <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                                        No matching items found. Press Enter to search with AI chat.
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SearchOverlay;