import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';

const MessageReplyModal = ({ isOpen, onClose, message, token, onSuccess }) => {
  const { isDarkMode } = useTheme();
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !message) return null;

  const handleReply = async () => {
    if (!replyText.trim()) {
      setError('Reply message cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/message/${message._id}/reply`,
        { replyMessage: replyText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to send reply.');
      console.error(err);
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
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative transition-all duration-300 ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold text-red-500 hover:text-red-600 focus:outline-none"
        >
          &times;
        </button>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold border-b pb-2 text-center">
              ✉️ Reply to Message
            </h2>
            <p className="text-sm text-gray-500 mt-1 text-center">
              Received from: <strong>{message.name}</strong> ({message.email})
            </p>
          </div>

          {/* Message Content */}
          <div>
            <h3 className="text-lg font-semibold mb-2">📨 Original Message</h3>
            <div
              className={`p-4 rounded-md border text-sm ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-gray-100 border-gray-300'
              }`}
            >
              {message.message || 'No message content.'}
            </div>
          </div>

          {/* Reply Form */}
          <div>
            <h3 className="text-lg font-semibold mb-2">✍️ Your Reply</h3>
            <textarea
              rows={5}
              className={`w-full p-3 rounded-md border resize-none text-sm ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-gray-100 border-gray-300'
              }`}
              placeholder="Write your reply here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={handleReply}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reply'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageReplyModal;
