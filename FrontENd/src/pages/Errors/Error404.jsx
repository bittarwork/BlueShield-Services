import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const Error404 = () => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-12 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'
      }`}
    >
      <div className="text-center max-w-md">
        <div className="text-7xl font-bold mb-4">404</div>
        <h1 className="text-2xl font-semibold mb-2">Page Not Found</h1>
        <p className="mb-6 text-gray-500">
          Sorry, the page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link
          to="/"
          className={`inline-block px-6 py-3 rounded-md font-medium transition ${
            isDarkMode
              ? 'bg-white text-gray-900 hover:bg-gray-200'
              : 'bg-gray-900 text-white hover:bg-gray-700'
          }`}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Error404;
