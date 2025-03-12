import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import UserProfile from './UserProfile';
import AuthButtons from './AuthButtons';

// مكون NavBar الرئيسي
const NavBar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderRoleLinks = () => {
    if (user?.role === 'admin') {
      return (
        <>
          <Link
            to="/admin/dashboard"
            className="hover:text-blue-500 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/manage-users"
            className="hover:text-blue-500 transition-colors"
          >
            Manage Users
          </Link>
        </>
      );
    }
    if (user?.role === 'technician') {
      return (
        <>
          <Link
            to="/technician/tasks"
            className="hover:text-blue-500 transition-colors"
          >
            Assigned Tasks
          </Link>
          <Link
            to="/technician/manage-tasks"
            className="hover:text-blue-500 transition-colors"
          >
            Task Management
          </Link>
        </>
      );
    }
    return null;
  };

  return (
    <nav
      className={`fixed w-full z-50 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      } shadow-lg transition-colors duration-300`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div>
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
          >
            BlueShield Services
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/services"
            className="hover:text-blue-500 transition-colors"
          >
            Services
          </Link>
          <Link to="/about" className="hover:text-blue-500 transition-colors">
            About Us
          </Link>
          <Link to="/contact" className="hover:text-blue-500 transition-colors">
            Contact Us
          </Link>
          {renderRoleLinks()}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-200 hover:bg-gray-300'
            } transition-colors`}
          >
            {isDarkMode ? (
              <FaSun className="text-yellow-400" />
            ) : (
              <FaMoon className="text-gray-800" />
            )}
          </button>

          {isAuthenticated ? (
            <UserProfile user={user} onLogout={logout} />
          ) : (
            <AuthButtons />
          )}
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {isMobileMenuOpen ? (
            <FaTimes className="text-2xl" />
          ) : (
            <FaBars className="text-2xl" />
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div
          className={`md:hidden ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          } transition-all duration-300`}
        >
          <div className="flex flex-col space-y-4 p-4">
            <Link
              to="/services"
              className="hover:text-blue-500 transition-colors"
            >
              Services
            </Link>
            <Link to="/about" className="hover:text-blue-500 transition-colors">
              About Us
            </Link>
            <Link
              to="/contact"
              className="hover:text-blue-500 transition-colors"
            >
              Contact Us
            </Link>
            {renderRoleLinks()}
            {isAuthenticated ? (
              <UserProfile user={user} onLogout={logout} />
            ) : (
              <AuthButtons />
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
