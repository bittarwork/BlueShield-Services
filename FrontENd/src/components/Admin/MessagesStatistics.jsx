import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';

const API_URL = import.meta.env.VITE_API_URL;

const MessagesStatistics = () => {
  const { token } = useUser();
  const { isDarkMode } = useTheme();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/message`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const messages = res.data;
        const total = messages.length;
        const read = messages.filter((m) => m.isRead).length;
        const replied = messages.filter((m) => m.isReplied).length;

        setStats({
          total,
          read,
          unread: total - read,
          replied,
          unreplied: total - replied,
        });
      } catch (err) {
        console.error('Failed to load message stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading || !stats) {
    return (
      <div className="text-center py-6 text-gray-500">
        Loading statistics...
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Messages"
          value={stats.total}
          color="bg-gray-700"
          dark={isDarkMode}
        />
        <StatCard
          title="Read"
          value={stats.read}
          color="bg-green-500"
          dark={isDarkMode}
        />
        <StatCard
          title="Unread"
          value={stats.unread}
          color="bg-yellow-400"
          dark={isDarkMode}
        />
        <StatCard
          title="Replied"
          value={stats.replied}
          color="bg-blue-500"
          dark={isDarkMode}
        />
        <StatCard
          title="No Reply"
          value={stats.unreplied}
          color="bg-red-500"
          dark={isDarkMode}
        />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color, dark }) => {
  return (
    <div
      className={`p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 ${
        dark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}
    >
      <h4 className="text-md font-medium mb-2">{title}</h4>
      <div
        className={`text-4xl font-extrabold ${color} text-white rounded-md px-3 py-1 inline-block`}
      >
        {value}
      </div>
    </div>
  );
};

export default MessagesStatistics;
