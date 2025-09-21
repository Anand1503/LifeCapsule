import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User } from 'lucide-react';
import './PersonalAssistant.css';

const PersonalAssistant = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [currentMessageIndex, setCurrentMessageIndex] = useState(-1);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedText]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage = { type: 'user', content: query.trim() };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/analyze_diary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMessage.content }),
      });

      const data = await response.json();
      const assistantMessage = {
        type: 'assistant',
        content: data.answer || 'I apologize, but I couldn\'t process your request. Please try again.'
      };

      setMessages(prev => [...prev, assistantMessage]);
      setCurrentMessageIndex(messages.length);
      setDisplayedText('');
    } catch (error) {
      const errorMessage = {
        type: 'assistant',
        content: 'I\'m sorry, I encountered an error. Please try again later.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Typing animation effect
  useEffect(() => {
    if (currentMessageIndex >= 0 && messages[currentMessageIndex]) {
      const message = messages[currentMessageIndex];
      if (message.type === 'assistant') {
        let index = 0;
        const text = message.content;

        const timer = setInterval(() => {
          if (index < text.length) {
            setDisplayedText(text.slice(0, index + 1));
            index++;
          } else {
            clearInterval(timer);
            setCurrentMessageIndex(-1);
          }
        }, 30);

        return () => clearInterval(timer);
      }
    }
  }, [currentMessageIndex, messages]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 h-full flex flex-col"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Bot className="mr-3" size={32} />
          Personal Assistant
        </h1>
        <p className="text-gray-600">
          Ask me anything about your diary entries or get insights from your personal data.
        </p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6 overflow-y-auto">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md
                    ${message.type === 'user'
                      ? 'bg-gray-900 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-900 rounded-bl-md'
                    }
                  `}
                >
                  <div className="flex items-center mb-1">
                    {message.type === 'user' ? (
                      <User size={16} className="mr-2" />
                    ) : (
                      <Bot size={16} className="mr-2" />
                    )}
                    <span className="text-xs opacity-75">
                      {message.type === 'user' ? 'You' : 'Assistant'}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">
                    {index === currentMessageIndex && message.type === 'assistant'
                      ? displayedText
                      : message.content
                    }
                    {index === currentMessageIndex && message.type === 'assistant' && (
                      <span className="animate-pulse">|</span>
                    )}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-md">
                <div className="flex items-center">
                  <Bot size={16} className="mr-2" />
                  <span className="text-xs opacity-75">Assistant</span>
                </div>
                <div className="flex space-x-1 mt-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask me anything about your diary..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
            disabled={isLoading}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!query.trim() || isLoading}
            className={`
              px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center
              ${query.trim() && !isLoading
                ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            <Send size={18} className="mr-2" />
            Send
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default PersonalAssistant;
