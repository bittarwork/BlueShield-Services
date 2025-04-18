import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import NotMemberLayout from '../layout/NotMemberLayout';

const ContactUs = () => {
  const { isDarkMode } = useTheme();

  return (
    <NotMemberLayout>
      <div
        className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}
      >
        {/* Hero Section */}
        <div
          className={`relative h-96 flex items-center justify-center bg-gradient-to-r ${isDarkMode ? 'from-blue-900 to-purple-900' : 'from-blue-500 to-purple-500'}`}
        >
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl">
              We're here to help! Get in touch with us today.
            </p>
          </div>
          <div className="absolute bottom-0 w-full h-20 bg-white dark:bg-gray-900 transform skew-y-2"></div>
        </div>

        {/* Contact Form Section */}
        <div className="container mx-auto px-4 py-16">
          <div
            className={`max-w-3xl mx-auto rounded-2xl shadow-xl p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            <h2 className="text-3xl font-bold mb-8">Send Us a Message</h2>
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Input */}
                <div>
                  <label
                    htmlFor="name"
                    className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`mt-1  p-1  block w-full rounded-md border ${
                      isDarkMode
                        ? 'border-gray-600 bg-gray-700 text-white'
                        : 'border-gray-300 bg-white'
                    } shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-300`}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label
                    htmlFor="email"
                    className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`mt-1  p-1  block w-full rounded-md border ${
                      isDarkMode
                        ? 'border-gray-600 bg-gray-700 text-white'
                        : 'border-gray-300 bg-white'
                    } shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-300`}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Subject Input */}
              <div className="mt-6">
                <label
                  htmlFor="subject"
                  className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className={`mt-1 p-1 block w-full rounded-md border ${
                    isDarkMode
                      ? 'border-gray-600 bg-gray-700 text-white'
                      : 'border-gray-300 bg-white'
                  } shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-300`}
                  placeholder="Enter the subject"
                  required
                />
              </div>

              {/* Message Input */}
              <div className="mt-6">
                <label
                  htmlFor="message"
                  className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  className={`mt-1  p-1  block w-full rounded-md border ${
                    isDarkMode
                      ? 'border-gray-600 bg-gray-700 text-white'
                      : 'border-gray-300 bg-white'
                  } shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-300`}
                  placeholder="Enter your message"
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  className={`w-full px-6 py-3 bg-gradient-to-r ${
                    isDarkMode
                      ? 'from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                      : 'from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                  } text-white font-semibold rounded-md transition-all duration-300`}
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Phone Card */}
              <div
                className={`rounded-2xl shadow-xl p-8 text-center ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}
              >
                <div className="text-4xl mb-4">📞</div>
                <h3 className="text-xl font-semibold mb-2">Phone</h3>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  +966 123 456 789
                </p>
              </div>

              {/* Email Card */}
              <div
                className={`rounded-2xl shadow-xl p-8 text-center ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}
              >
                <div className="text-4xl mb-4">✉️</div>
                <h3 className="text-xl font-semibold mb-2">Email</h3>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  info@blueshield.com
                </p>
              </div>

              {/* Address Card */}
              <div
                className={`rounded-2xl shadow-xl p-8 text-center ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}
              >
                <div className="text-4xl mb-4">📍</div>
                <h3 className="text-xl font-semibold mb-2">Address</h3>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  123 BlueShield St, Jeddah, Saudi Arabia
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NotMemberLayout>
  );
};

export default ContactUs;
