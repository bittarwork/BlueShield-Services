import React from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { useTheme } from '../../contexts/ThemeContext';

const DashboardAdmin = () => {
  const { isDarkMode } = useTheme();

  // Mock data for statistics
  const stats = [
    { title: 'Total Users', value: '1,200', change: '+5.2%' },
    { title: 'Daily Visits', value: '300', change: '-1.8%' },
    { title: 'New Orders', value: '45', change: '+12%' },
    { title: 'Revenue', value: '$8,500', change: '+3.4%' },
  ];

  return (
    <AdminLayout>
      <div className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="max-w-7xl mx-auto p-6">
          {/* Coming Soon Section */}
          <div className="text-center mb-8">
            <h1
              className={`text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
            >
              Coming Soon...
            </h1>
            <p
              className={`mt-4 text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              We're working on something awesome! Stay tuned for updates.
            </p>
          </div>

          {/* Site Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <h3
                  className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  {stat.title}
                </h3>
                <p
                  className={`text-2xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  {stat.value}
                </p>
                <p
                  className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}
                >
                  {stat.change}
                </p>
              </div>
            ))}
          </div>

          {/* Empty Data Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div
              className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <h3
                className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                Order Data
              </h3>
              <p
                className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                No data available at the moment.
              </p>
            </div>
            <div
              className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <h3
                className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                User Data
              </h3>
              <p
                className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                No data available at the moment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardAdmin;
