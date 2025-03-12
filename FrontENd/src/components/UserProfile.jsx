import React from 'react';
import { useState } from 'react';
import {
  FaSun,
  FaMoon,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import ConfirmationModal from '../model/ConfirmationModal';
// مكون UserProfile لعرض معلومات المستخدم
const UserProfile = ({ user, onLogout }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    onLogout();
    setShowLogoutModal(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        <img
          src={`${import.meta.env.VITE_API_URL}/${user.profile_picture}`}
          alt="Profile"
          className="w-10 h-10 rounded-full border-2 border-blue-500"
        />
        <span className="font-semibold">
          {user?.first_name} {user?.last_name}
        </span>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          onLogout();
          setShowLogoutModal(false);
        }}
      />
    </>
  );
};

export default UserProfile;
