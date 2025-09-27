import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './DiaryEntry.css';

const DiaryEntry = () => {
  const [entry, setEntry] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [entries, setEntries] = useState([]);
  const [typewriterText, setTypewriterText] = useState('');
  const fullText = 'Write Your Memories for Today';

  // Custom typewriter effect
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypewriterText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100); // Adjust speed as needed
    return () => clearInterval(timer);
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get('http://localhost:8000/diary/all');
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSave = async () => {
    if (!entry.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/diary/', { entry: entry.trim() });
      if (response.status === 200) {
        setEntry('');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        fetchEntries();
      }
    } catch (error) {
      console.error('Error saving diary entry:', error);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-white p-4"
    >
      <div className="w-full max-w-2xl">
        {/* Heading with typewriter */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center text-black mb-8"
        >
          {typewriterText}
        </motion.h1>

        {/* Textarea */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mb-6"
        >
          <motion.textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Write your thoughts..."
            animate={{
              height: isFocused ? '20rem' : '16rem', // Expand on focus
              scale: isFocused ? 1.02 : 1,
            }}
            transition={{ duration: 0.3 }}
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none font-poppins text-gray-700 placeholder-gray-400"
            disabled={isLoading}
          />
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="flex justify-center"
        >
          <motion.button
            onClick={handleSave}
            disabled={!entry.trim() || isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-8 py-3 rounded-lg font-medium font-poppins transition-all duration-200 ${
              entry.trim() && !isLoading
                ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Saving...' : 'Save Entry'}
          </motion.button>
        </motion.div>

        {/* Entries List */}
        {entries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold text-black mb-4 text-center">Your Previous Entries</h2>
            <AnimatePresence>
              {entries.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4 p-4 bg-white rounded-lg shadow-md border border-gray-200"
                >
                  <p className="text-gray-700 font-poppins whitespace-pre-wrap">{item.entry}</p>
                  {item.timestamp && (
                    <p className="text-sm text-gray-500 mt-2 font-poppins">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Success Message */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="mt-4 text-center"
          >
            <motion.p
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: 1 }}
              className="text-green-600 font-medium font-poppins"
            >
              Entry Saved!
            </motion.p>
          </motion.div>
        )}

        {/* Error Message */}
        {showError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="mt-4 text-center"
          >
            <motion.p
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: 1 }}
              className="text-red-600 font-medium font-poppins"
            >
              Failed to save entry. Please try again.
            </motion.p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default DiaryEntry;
