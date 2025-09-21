import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, FileText } from 'lucide-react';
import './DiaryEntry.css';

const DiaryEntry = () => {
  const [entry, setEntry] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!entry.trim()) return;

    setIsSaving(true);
    try {
      const response = await fetch('http://localhost:5000/save_diary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entry: entry.trim() }),
      });

      if (response.ok) {
        alert('Diary entry saved successfully!');
        setEntry('');
      } else {
        alert('Failed to save the diary entry.');
      }
    } catch (error) {
      alert('Error saving diary entry: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <FileText className="mr-3" size={32} />
          Diary Entry
        </h1>
        <p className="text-gray-600">
          Write down your thoughts, experiences, and reflections for the day.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="mb-6">
          <label
            htmlFor="diary-entry"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Entry
          </label>
          <textarea
            id="diary-entry"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="Start writing your thoughts here..."
            className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none transition-all duration-200"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          />
        </div>

        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={!entry.trim() || isSaving}
            className={`
              flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200
              ${entry.trim() && !isSaving
                ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            <Save className="mr-2" size={18} />
            {isSaving ? 'Saving...' : 'Save Entry'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default DiaryEntry;
