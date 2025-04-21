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

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const navItems = [
    { path: '/admin', icon: <FaHome />, label: 'Home' },
    { path: '/admin/users', icon: <FaUser />, label: 'Users' },
    { path: '/admin/requests', icon: <FaUser />, label: 'Requests' },
    {
      path: '/admin/AlternativeWaterSupply',
      icon: <FaCogs />,
      label: 'Alternative Supply',
    },
  ];

  const themeStyles = {
    container: isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900',
    hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200',
    modal: isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900',
  };

  return (
    <aside
      className={`fixed h-screen w-64 flex flex-col justify-between shadow-lg transition-colors duration-300 ${themeStyles.container}`}
    >
      {/* Top Section */}
      <div className="p-6">
        <Link
          to="/"
          className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
        >
          BlueShield Services
        </Link>

        <nav className="mt-8">
          <ul className="space-y-2">
            {navItems.map(({ path, icon, label }) => {
              const active = location.pathname === path;
              return (
                <li key={path}>
                  <Link
                    to={path}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      active ? 'bg-blue-500 text-white' : themeStyles.hover
                    }`}
                  >
                    {icon}
                    <span>{label}</span>
                    {active && <FaChevronRight className="ml-auto" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        {/* Theme Switch */}
        <button
          onClick={toggleTheme}
          className={`flex items-center space-x-3 p-3 w-full rounded-lg transition-colors ${themeStyles.hover}`}
        >
          {isDarkMode ? <FaSun /> : <FaMoon />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {/* User Info */}
        {isAuthenticated && (
          <>
            <button
              onClick={toggleModal}
              className={`flex items-center space-x-3 p-3 w-full rounded-lg mt-4 transition-colors ${themeStyles.hover}`}
            >
              <FaUser />
              <span>User Info</span>
            </button>

            <button
              onClick={logout}
              className={`flex items-center space-x-3 p-3 w-full rounded-lg mt-4 transition-colors ${
                isDarkMode
                  ? 'hover:bg-red-600 hover:text-white'
                  : 'hover:bg-red-500 hover:text-white'
              }`}
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </>
        )}
      </div>

      {/* User Info Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={toggleModal}
        >
          <div
            className={`relative rounded-lg p-6 w-96 ${themeStyles.modal}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={toggleModal}
              className={`absolute top-2 right-2 p-2 rounded-full ${themeStyles.hover}`}
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold mb-4">User Info</h2>
            <div className="space-y-4 text-sm">
              <div>
                <label className="block font-medium">Full Name:</label>
                <p className="mt-1">{`${user.first_name} ${user.last_name}`}</p>
              </div>
              <div>
                <label className="block font-medium">Email:</label>
                <p className="mt-1">{user.email}</p>
              </div>
              <div>
                <label className="block font-medium">Phone:</label>
                <p className="mt-1">{user.phone}</p>
              </div>
              <div>
                <label className="block font-medium">Role:</label>
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
