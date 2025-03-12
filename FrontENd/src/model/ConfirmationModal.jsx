import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  const { isDarkMode } = useTheme();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0">
      <div
        className={`flex justify-center items-center h-screen w-screen ${
          isDarkMode ? 'bg-[rgba(0,0,0,0.8)]' : 'bg-[rgba(0,0,0,0.6)]'
        }`}
      >
        <div
          className={`p-6 rounded-lg shadow-lg transition-colors ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} `}
        >
          <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
          <p className="mb-4">Are you sure you want to log out?</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded transition-colors ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'}`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ConfirmationModal;
