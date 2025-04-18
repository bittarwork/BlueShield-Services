import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import NotMemberLayout from '../layout/NotMemberLayout';

const Services = () => {
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
            <h1 className="text-5xl font-bold mb-4">Our Services</h1>
            <p className="text-xl">
              Providing Innovative Solutions for Your Water Needs
            </p>
          </div>
          <div className="absolute bottom-0 w-full h-20 bg-white dark:bg-gray-900 transform skew-y-2"></div>
        </div>

        {/* Services Section */}
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Emergency Repairs',
                description:
                  '24/7 emergency repair services to fix water pump failures and other issues.',
                icon: '🛠️',
              },
              {
                title: 'Preventive Maintenance',
                description:
                  'Regular maintenance to prevent breakdowns and ensure system efficiency.',
                icon: '🔧',
              },
              {
                title: 'Alternative Water Supply',
                description:
                  'Temporary water solutions during service interruptions.',
                icon: '🚰',
              },
              {
                title: 'System Upgrades',
                description:
                  'Upgrading outdated systems for better performance and reliability.',
                icon: '⚙️',
              },
              {
                title: 'Consultation & Planning',
                description:
                  'Expert advice and planning for water system optimization.',
                icon: '📋',
              },
              {
                title: 'Customer Support',
                description:
                  'Dedicated support team to assist with all your water-related needs.',
                icon: '📞',
              },
            ].map((service, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p
                  className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Section */}
        <div className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p
              className={`text-lg mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Contact us today to learn more about our services and how we can
              help you.
            </p>
            <button
              className={`px-8 py-3 rounded-full font-semibold text-lg ${
                isDarkMode
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
              }`}
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </NotMemberLayout>
  );
};

export default Services;
