import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';

const AddNoteModal = ({ requestId, onClose, onNoteAdded }) => {
  const { token } = useUser();
  const { isDarkMode } = useTheme();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Note cannot be empty.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post(
        `${API_URL}/api/water-alternatives/${requestId}/note`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setText('');
      onNoteAdded?.(); // callback
      onClose();
    } catch (err) {
      console.error('Failed to add note', err);
      setError('Something went wrong while adding the note.');
    } finally {
      setLoading(false);
    }
  };

  const overlayStyle = 'backdrop-blur-sm';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 ${overlayStyle}`}
    >
      <div
        className={`w-full max-w-md rounded-xl shadow-2xl relative transition-all duration-300 ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold text-red-500 hover:text-red-600 focus:outline-none"
        >
          &times;
        </button>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold border-b pb-2">
              📝 Add Admin Note
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Your note will be visible in the request details.
            </p>
          </div>

          {/* Textarea */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Note Content
            </label>
            <textarea
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your note here..."
              className={`w-full p-3 rounded-md border text-sm resize-none transition ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 placeholder-gray-400'
                  : 'bg-gray-100 border-gray-300'
              }`}
            />
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNoteModal;
