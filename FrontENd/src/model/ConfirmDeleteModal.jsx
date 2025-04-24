import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  item,
  deleteUrl,
  token,
  onSuccess,
}) => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !item) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);

      await axios.delete(`${import.meta.env.VITE_API_URL}${deleteUrl}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to delete.');
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
        className={`w-full max-w-md rounded-xl shadow-2xl p-6 relative transition-all duration-300 ${
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

        <div className="space-y-6 text-center">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-red-600">
              🗑️ Confirm Deletion
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Are you sure you want to delete{' '}
              <span className="font-semibold">{item.name || 'this item'}?</span>
            </p>
          </div>

          {/* Error Message */}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
