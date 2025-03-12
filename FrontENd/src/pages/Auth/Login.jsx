import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useTheme } from '../../contexts/ThemeContext';
import NotMemberLayout from '../../layout/NotMemberLayout';
import { FaWater, FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Login = () => {
  const { isDarkMode } = useTheme();
  const { login, loading } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Redirect or handle successful login
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <NotMemberLayout>
      <div
        className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
        }`}
      >
        <div
          className={`relative flex rounded-lg shadow-2xl overflow-hidden ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
          style={{ width: '60vw', height: '70vh' }}
        >
          {/* Left Section: Branding */}
          <div
            className={`w-1/2 flex flex-col items-center justify-center p-8 ${
              isDarkMode ? 'bg-gray-700' : 'bg-blue-500'
            }`}
          >
            <div className="relative">
              <div
                className={`absolute -top-16 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full ${
                  isDarkMode ? 'bg-gray-800' : 'bg-blue-400'
                } flex items-center justify-center shadow-lg`}
              >
                <FaWater className="w-16 h-16 text-white animate-bounce" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mt-20 text-white">
              BlueShield Services
            </h1>
            <p className="mt-2 text-white text-center">
              Manage your water resources efficiently and sustainably.
            </p>
          </div>

          {/* Right Section: Login Form */}
          <div className="w-1/2 p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-6">Welcome Back</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full p-2 pl-10 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter your email"
                    required
                  />
                  <FaEnvelope
                    className={`absolute left-3 top-3 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  />
                </div>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full p-2 pl-10 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter your password"
                    required
                  />
                  <FaLock
                    className={`absolute left-3 top-3 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  />
                </div>
              </div>
              {error && (
                <div className="mb-4 text-sm text-red-500">{error}</div>
              )}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 rounded-lg flex items-center justify-center ${
                  loading
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white font-semibold transition duration-300`}
              >
                {loading ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  'Login'
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-4 text-center">
              <span className="text-sm">Don't have an account? </span>
              <Link to="/Register" className="text-blue-500 hover:underline">
                Sign up here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </NotMemberLayout>
  );
};

export default Login;
