import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import NotMemberLayout from '../layout/NotMemberLayout';

import.meta.env.VITE_API_URL;

const ContactUs = () => {
  const { isDarkMode } = useTheme();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/message`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setFeedback({
          type: 'success',
          message: data.message || 'Message sent successfully.',
        });
        setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
      } else {
        setFeedback({
          type: 'error',
          message: data.message || 'Something went wrong. Please try again.',
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'Failed to send message. Please check your connection.',
      });
    } finally {
      setLoading(false);
    }
  };

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
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
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
                    value={formData.name}
                    onChange={handleChange}
                    className={`mt-1 p-1 block w-full rounded-md border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                {/* Email */}
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
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 p-1 block w-full rounded-md border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Subject */}
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
                  value={formData.subject}
                  onChange={handleChange}
                  className={`mt-1 p-1 block w-full rounded-md border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                  placeholder="Enter the subject"
                  required
                />
              </div>

              {/* Message */}
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
                  value={formData.message}
                  onChange={handleChange}
                  className={`mt-1 p-1 block w-full rounded-md border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                  placeholder="Enter your message"
                  required
                ></textarea>
              </div>

              {/* Feedback Message */}
              {feedback && (
                <div
                  className={`mt-4 text-sm font-medium ${feedback.type === 'success' ? 'text-green-500' : 'text-red-500'}`}
                >
                  {feedback.message}
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full px-6 py-3 bg-gradient-to-r ${
                    isDarkMode
                      ? 'from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                      : 'from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                  } text-white font-semibold rounded-md transition-all duration-300`}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* Contact Information Section */} {/* [تبقى بدون تغيير] */}
      </div>
    </NotMemberLayout>
  );
};

export default ContactUs;
