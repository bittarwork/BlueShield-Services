import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL;

const RequestAddNote = ({ requestId, onClose, onNoteAdded, token }) => {
  const { isDarkMode } = useTheme();
  const [noteText, setNoteText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!noteText.trim()) {
      setError('Note cannot be empty.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post(
        `${API_URL}/api/maintenance/${requestId}/note`,
        { text: noteText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onNoteAdded();
      onClose();
    } catch (err) {
      console.error('Failed to add note:', err);
      setError('Failed to add note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm">
      <div
        className={`w-full max-w-md rounded-xl shadow-2xl relative transition-all duration-300 ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}
      >
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold text-red-500 hover:text-red-600 focus:outline-none"
        >
          &times;
        </button>

        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold border-b pb-2">Add Note</h2>
          </div>

          <div>
            <textarea
              rows={4}
              className={`w-full p-3 border rounded-md outline-none resize-none ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300'
              }`}
              placeholder="Enter your note..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Note'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestAddNote;
