import React from 'react';
import moment from 'moment';
import { useTheme } from '../contexts/ThemeContext';

const MessageViewModal = ({ isOpen, onClose, message }) => {
  const { isDarkMode } = useTheme();

  if (!isOpen || !message) return null;

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
              📨 Message Details
            </h2>
            <p className="text-sm text-gray-500 mt-1 text-center">
              Sent at: {moment(message.createdAt).format('YYYY-MM-DD HH:mm')}
            </p>
          </div>

          {/* Message Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <Info label="Name" value={message.name} />
            <Info label="Email" value={message.email} />
            <Info label="Phone" value={message.phone || '—'} />
            <Info label="Subject" value={message.subject} />
          </div>

          {/* Message Content */}
          <div>
            <h3 className="text-lg font-semibold mb-2">💬 Message</h3>
            <div
              className={`p-4 rounded-md border text-sm ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-gray-100 border-gray-300'
              }`}
            >
              {message.message}
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex gap-3 mt-4 text-sm">
            <span
              className={`px-3 py-1 rounded-full font-semibold ${
                message.isRead
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
              }`}
            >
              {message.isRead ? 'Read' : 'Unread'}
            </span>
            <span
              className={`px-3 py-1 rounded-full font-semibold ${
                message.isReplied
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              }`}
            >
              {message.isReplied ? 'Replied' : 'No Reply'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Info Row
const Info = ({ label, value }) => (
  <div>
    <span className="text-gray-500">{label}:</span>{' '}
    <span className="font-medium">{value}</span>
  </div>
);

export default MessageViewModal;
