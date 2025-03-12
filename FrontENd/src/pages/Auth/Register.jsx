import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useTheme } from '../../contexts/ThemeContext';
import NotMemberLayout from '../../layout/NotMemberLayout';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaSpinner,
  FaUpload,
} from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

const Register = () => {
  const { isDarkMode } = useTheme();
  const { register: registerUser, loading } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('password', data.password);
    if (data.profile_picture[0]) {
      formData.append('profile_picture', data.profile_picture[0]);
    }

    try {
      await registerUser(formData);
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <NotMemberLayout>
      <div
        className={`min-h-screen pt-25 pb-10  flex items-center justify-center transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
        }`}
      >
        <div
          className={`relative flex rounded-lg shadow-2xl overflow-hidden ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
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
                <FaUser className="w-16 h-16 text-white animate-bounce" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mt-20 text-white">
              BlueShield Services
            </h1>
            <p className="mt-2 text-white text-center">
              Manage your water resources efficiently and sustainably.
            </p>
          </div>

          {/* Right Section: Registration Form */}
          <div className="w-1/2 p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-6">Create an Account</h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              encType="multipart/form-data"
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  First Name
                </label>
                <div className="relative">
                  <input
                    {...register('first_name', { required: true })}
                    type="text"
                    className={`w-full p-2 pl-10 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter your first name"
                  />
                  <FaUser
                    className={`absolute left-3 top-3 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  />
                </div>
                {errors.first_name && (
                  <p className="text-red-500 text-sm mt-1">
                    First name is required
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <input
                    {...register('last_name', { required: true })}
                    type="text"
                    className={`w-full p-2 pl-10 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter your last name"
                  />
                  <FaUser
                    className={`absolute left-3 top-3 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  />
                </div>
                {errors.last_name && (
                  <p className="text-red-500 text-sm mt-1">
                    Last name is required
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <input
                    {...register('email', { required: true })}
                    type="email"
                    className={`w-full p-2 pl-10 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter your email"
                  />
                  <FaEnvelope
                    className={`absolute left-3 top-3 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    Valid email is required
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Phone</label>
                <div className="relative">
                  <input
                    {...register('phone', { required: true })}
                    type="text"
                    className={`w-full p-2 pl-10 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter your phone number"
                  />
                  <FaPhone
                    className={`absolute left-3 top-3 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    Phone number is required
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register('password', { required: true })}
                    type="password"
                    className={`w-full p-2 pl-10 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter your password"
                  />
                  <FaLock
                    className={`absolute left-3 top-3 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    Password is required
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Profile Picture
                </label>
                <div className="relative">
                  <input
                    {...register('profile_picture')}
                    type="file"
                    className={`w-full p-2 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  <FaUpload
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
                  'Register'
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-4 text-center">
              <span className="text-sm">Already have an account? </span>
              <Link to="/Login" className="text-blue-500 hover:underline">
                Login here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </NotMemberLayout>
  );
};

export default Register;
