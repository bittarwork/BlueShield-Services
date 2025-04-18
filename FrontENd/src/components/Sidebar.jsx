import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import {
  FaHome,
  FaCogs,
  FaUser,
  FaSignOutAlt,
  FaSun,
  FaMoon,
  FaChevronRight,
  FaTimes,
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useUser();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <aside
      className={`fixed h-screen w-64 flex flex-col justify-between ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      } shadow-lg transition-colors duration-300`}
    >
      {/* Top Section: Navigation Buttons */}
      <div className="p-6">
        {/* App Name */}
        <Link
          to="/"
          className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
        >
          BlueShield Services
        </Link>

        {/* Navigation Buttons */}
        <nav className="mt-8">
          <ul className="space-y-4">
            {[
              { path: '/admin', icon: <FaHome />, label: 'Home' },
              { path: '/admin/users', icon: <FaUser />, label: 'Users' },
              { path: '/admin/requests', icon: <FaUser />, label: 'Request' },
            ].map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-500 text-white'
                      : isDarkMode
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-gray-200'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {location.pathname === item.path && (
                    <FaChevronRight className="ml-auto" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Bottom Section: Theme, User Info, and Logout Buttons */}
      <div className="p-6 border-t border-gray-200">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`flex items-center space-x-3 p-3 w-full rounded-lg transition-colors ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
        >
          {isDarkMode ? <FaSun /> : <FaMoon />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {/* User Info Button */}
        {isAuthenticated && (
          <button
            onClick={toggleModal}
            className={`flex items-center space-x-3 p-3 w-full rounded-lg transition-colors mt-4 ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            <FaUser />
            <span>User Info</span>
          </button>
        )}

        {/* Logout Button */}
        {isAuthenticated && (
          <button
            onClick={logout}
            className={`flex items-center space-x-3 p-3 w-full rounded-lg transition-colors mt-4 ${
              isDarkMode
                ? 'hover:bg-red-600 hover:text-white'
                : 'hover:bg-red-500 hover:text-white'
            }`}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        )}
      </div>

      {/* User Info Modal */}
      {isModalOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}
          onClick={toggleModal}
        >
          <div
            className={`${
              isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            } rounded-lg p-6 w-96 relative`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={toggleModal}
              className={`absolute top-2 right-2 p-2 rounded-full ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold mb-4">User Info</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Full Name:</label>
                <p className="mt-1">{`${user.first_name} ${user.last_name}`}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Email:</label>
                <p className="mt-1">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Phone:</label>
                <p className="mt-1">{user.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Role:</label>
                <p className="mt-1">{user.role}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
