import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronRight, ChevronDown, MessageCircle,  Sparkles, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength).trim();
  return truncated.replace(/\s+\S*$/, '') + '...';
};

const MessageBubble = React.memo(({ isUser, content, theme, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const truncatedContent = useMemo(() => truncateText(content, 150), [content]);

  const toggleExpand = useCallback(() => setIsExpanded(prev => !prev), []);

  const bubbleVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <motion.div
      layout
      initial="initial"
      animate="animate"
      exit="exit"
      variants={bubbleVariants}
      transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 30 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div
        className={`max-w-[85%] p-3.5 rounded-2xl ${
          isUser
            ? 'bg-gradient-to-br from-blue-400 to-blue-500 text-white'
            : theme === 'light'
            ? 'bg-gray-100 text-gray-800'
            : 'bg-gray-800 text-gray-100'
        } shadow-sm`}
      >
        <div className="prose prose-sm max-w-none dark:prose-invert overflow-hidden transition-all duration-300 ease-in-out">
          <ReactMarkdown
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={tomorrow}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }
            }}
          >
            {isExpanded ? content : truncatedContent}
          </ReactMarkdown>
        </div>
        {content.length > 150 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleExpand}
            className={`mt-2 text-xs font-medium flex items-center ${
              isUser ? 'text-blue-100' : theme === 'light' ? 'text-blue-500' : 'text-blue-300'
            }`}
          >
            {isExpanded ? 'Show less' : 'Read more'}
            <motion.div
              initial={false}
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={14} className="ml-1" />
            </motion.div>
          </motion.button>
        )}
        {children}
      </div>
    </motion.div>
  );
});

const ItemCircle = React.memo(({ item, onClick, theme }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className="flex flex-col items-center"
    onClick={onClick}
  >
    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-md">
      <img
        src={item.image_link}
        alt={item.name_of_item}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
    <p className={`text-xs mt-1.5 text-center w-20 truncate ${
      theme === 'light' ? 'text-gray-600' : 'text-gray-300'
    }`}>
      {item.name_of_item}
    </p>
  </motion.div>
));

const MoreItemsButton = React.memo(({ count, onClick, theme }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className="flex flex-col items-center"
    onClick={onClick}
  >
    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-purple-400 to-blue-500 text-white' 
        : 'bg-gradient-to-br from-purple-500 to-blue-600 text-white'
    } shadow-md`}>
      <span className="text-lg font-semibold">+{count}</span>
    </div>
    <p className={`text-xs mt-1.5 text-center ${
      theme === 'light' ? 'text-gray-600' : 'text-gray-300'
    }`}>
      More
    </p>
  </motion.div>
));

const ConversationFlow = React.memo(({ conversation, theme, openStory, setSelectedItemFromConversation, index }) => {
  const handleItemClick = useCallback((item) => setSelectedItemFromConversation(item), [setSelectedItemFromConversation]);
  const handleOpenStory = useCallback(() => openStory(index), [openStory, index]);

  return (
    <>
      <MessageBubble isUser={true} content={conversation.query} theme={theme} />
      <MessageBubble isUser={false} content={conversation.response} theme={theme}>
        {conversation.items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 flex space-x-4 overflow-x-auto py-2 px-1 -mx-1 scrollbar-hide"
          >
            {conversation.items.slice(0, 3).map((item, itemIndex) => (
              <ItemCircle
                key={itemIndex}
                item={item}
                onClick={() => handleItemClick(item)}
                theme={theme}
              />
            ))}
            {conversation.items.length > 3 && (
              <MoreItemsButton
                count={conversation.items.length - 3}
                onClick={handleOpenStory}
                theme={theme}
              />
            )}
          </motion.div>
        )}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleOpenStory}
          className={`mt-3 w-full flex items-center justify-between px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${
            theme === 'light'
              ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              : 'bg-blue-900 text-blue-200 hover:bg-blue-800'
          }`}
        >
          <span className="flex items-center">
            <MessageCircle size={16} className="mr-2" />
            View Full Response
          </span>
          <ChevronRight size={16} />
        </motion.button>
      </MessageBubble>
    </>
  );
});

const IntegratedClearChatMessage = React.memo(({ onClearChat, theme }) => {
    const [isClearing, setIsClearing] = useState(false);
    const [stage, setStage] = useState(0);
    const shouldReduceMotion = useReducedMotion();
  
    const handleClear = useCallback(async () => {
      if (typeof onClearChat !== 'function') {
        console.error('onClearChat is not a function');
        return;
      }
  
      setIsClearing(true);
      setStage(1);
  
      // Wait for the animation to complete
      await new Promise(resolve => setTimeout(resolve, shouldReduceMotion ? 0 : 1000));
  
      // Call onClearChat and wait for it to complete
      await onClearChat();
  
      setIsClearing(false);
      setStage(0);
    }, [onClearChat, shouldReduceMotion]);
  
    useEffect(() => {
      if (stage === 0 && !isClearing) {
        // Ensure any post-clearing actions are performed here
      }
    }, [stage, isClearing]);
  
    const stageAnimations = {
      1: (
        <motion.div
          key="sweep"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: shouldReduceMotion ? 0 : 1, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-blue-300 via-green-300 to-blue-300"
        />
      )
    };
  
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className={`my-8 p-4 rounded-2xl shadow-md overflow-hidden ${
          theme === 'light' ? 'bg-blue-50' : 'bg-blue-900'
        } relative`}
      >
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-2">
            <Sparkles className="text-yellow-400" size={20} />
            <p className={`text-sm font-medium ${
              theme === 'light' ? 'text-blue-800' : 'text-blue-100'
            }`}>
              Ready for a fresh start?
            </p>
          </div>
          <AnimatePresence mode="wait">
            {!isClearing ? (
              <motion.button
                key="clearButton"
                className={`px-4 py-2 rounded-full flex items-center space-x-2 ${
                  theme === 'light' 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-blue-400 text-blue-900 hover:bg-blue-300'
                } transition-colors duration-300`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClear}
              >
                <span className="text-sm font-medium">Start New Chat</span>
                <ArrowRight size={16} />
              </motion.button>
            ) : (
              <motion.div
                key="clearingText"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`text-sm font-medium ${
                  theme === 'light' ? 'text-blue-800' : 'text-blue-100'
                }`}
              >
                Creating a fresh start...
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {isClearing && stageAnimations[stage]}
        </AnimatePresence>
      </motion.div>
    );
  });
  
  const ChatInterface = ({ conversations, theme, openStory, setSelectedItemFromConversation, onClearChat }) => {
    const [isClearing, setIsClearing] = useState(false);
  
    const handleClearChat = useCallback(async () => {
      if (typeof onClearChat !== 'function') {
        console.error('onClearChat is not a function');
        return;
      }
  
      setIsClearing(true);
      await onClearChat();
      setIsClearing(false);
    }, [onClearChat]);
  
    return (
      <div className="space-y-8 max-w-2xl mx-auto py-6">
        <AnimatePresence>
          {!isClearing && conversations.map((conversation, index) => (
            <React.Fragment key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ConversationFlow
                  conversation={conversation}
                  theme={theme}
                  openStory={openStory}
                  setSelectedItemFromConversation={setSelectedItemFromConversation}
                  index={index}
                />
              </motion.div>
              {(index + 1) % 3 === 0 || index === conversations.length - 1 ? (
                <IntegratedClearChatMessage onClearChat={handleClearChat} theme={theme} />
              ) : null}
            </React.Fragment>
          ))}
        </AnimatePresence>
        {isClearing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <p className={`text-lg font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
              Starting a fresh chat...
            </p>
          </motion.div>
        )}
      </div>
    );
  };
  
  export default React.memo(ChatInterface);