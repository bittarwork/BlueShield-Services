import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

const UserInformationModal = ({ isOpen, onClose, user }) => {
  const { isDarkMode } = useTheme();

  if (!isOpen || !user) return null;

  const overlayStyle = 'backdrop-blur-sm';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 ${overlayStyle}`}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative transition-all duration-300 p-6 ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold text-red-500 hover:text-red-600 focus:outline-none"
        >
          <FaTimes />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold border-b pb-2">
            👤 User Information
          </h2>
        </div>

        {/* User Info */}
        <div className="space-y-4 text-sm">
          <div>
            <label className="block font-semibold">Full Name:</label>
            <p className="mt-1">{`${user.first_name} ${user.last_name}`}</p>
          </div>
          <div>
            <label className="block font-semibold">Email:</label>
            <p className="mt-1">{user.email}</p>
          </div>
          <div>
            <label className="block font-semibold">Phone:</label>
            <p className="mt-1">{user.phone}</p>
          </div>
          <div>
            <label className="block font-semibold">Role:</label>
            <p className="mt-1 capitalize">{user.role}</p>
          </div>
          {user.birthDate && (
            <div>
              <label className="block font-semibold">Birth Date:</label>
              <p className="mt-1">
                {new Date(user.birthDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInformationModal;
