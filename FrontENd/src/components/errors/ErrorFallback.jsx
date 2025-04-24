import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center p-6 rounded-lg shadow-lg transition-all duration-300
        ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}
      `}
    >
      <div className="text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mx-auto mb-4 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M4.93 4.93l14.14 14.14M12 2a10 10 0 100 20 10 10 0 000-20z"
          />
        </svg>
        <h2 className="text-2xl font-semibold mb-2">
          Oops! Something went wrong.
        </h2>
        <p className="text-sm mb-4 opacity-80">
          {error?.message || 'An unexpected error occurred.'}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="px-5 py-2 mt-2 text-sm font-medium rounded-md 
            bg-red-500 text-white hover:bg-red-600 transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
            dark:focus:ring-offset-gray-900"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
