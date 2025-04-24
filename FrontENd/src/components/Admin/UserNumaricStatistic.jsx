import React, { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  FaUsers,
  FaUserShield,
  FaUserCheck,
  FaMapMarkerAlt,
  FaCreditCard,
  FaHeart,
  FaSmile,
  FaFrown,
} from 'react-icons/fa';

const UserNumaricStatistic = () => {
  const { isDarkMode } = useTheme();
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/statistics`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }

        const data = await response.json();
        setStatistics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div
      className={`p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="text-2xl" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div
      className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}
    >
      <h2 className="text-center text-2xl font-bold mb-6">User Statistics</h2>

      {/* البطاقات الإحصائية فقط */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={statistics?.totalUsers || 0}
          icon={FaUsers}
          color="bg-blue-100 text-blue-600"
        />
        {statistics?.usersByRole?.map((role) => (
          <StatCard
            key={role._id}
            title={`${role._id}s`}
            value={role.count}
            icon={role._id === 'admin' ? FaUserShield : FaUserCheck}
            color={
              role._id === 'admin'
                ? 'bg-purple-100 text-purple-600'
                : 'bg-green-100 text-green-600'
            }
          />
        ))}
        {statistics?.usersByMaritalStatus?.map((status) => (
          <StatCard
            key={status._id}
            title={`${status._id}`}
            value={status.count}
            icon={
              status._id === 'married'
                ? FaHeart
                : status._id === 'single'
                  ? FaSmile
                  : FaFrown
            }
            color={
              status._id === 'married'
                ? 'bg-pink-100 text-pink-600'
                : status._id === 'single'
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-red-100 text-red-600'
            }
          />
        ))}
        <StatCard
          title="Users with Locations"
          value={statistics?.usersWithLocations || 0}
          icon={FaMapMarkerAlt}
          color="bg-indigo-100 text-indigo-600"
        />
        <StatCard
          title="Users with Payment Methods"
          value={statistics?.usersWithPaymentMethods || 0}
          icon={FaCreditCard}
          color="bg-teal-100 text-teal-600"
        />
      </div>
    </div>
  );
};

export default UserNumaricStatistic;
