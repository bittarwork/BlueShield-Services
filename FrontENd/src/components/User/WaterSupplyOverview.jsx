import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import {
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaListAlt,
  FaTools,
} from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;

const OverviewCard = ({ title, count, icon, bgColor, darkBgColor }) => {
  return (
    <div
      className={`
        flex flex-col justify-between p-5 rounded-xl shadow-md transition-transform duration-200
        hover:-translate-y-1 hover:shadow-xl
        text-white w-full aspect-square
        ${bgColor}
        dark:${darkBgColor}
      `}
    >
      <div className="text-4xl mb-4 opacity-80">{icon}</div>
      <div>
        <p className="text-sm opacity-90">{title}</p>
        <p className="text-2xl font-semibold">{count}</p>
      </div>
    </div>
  );
};

const WaterSupplyOverview = () => {
  const { isDarkMode } = useTheme();
  const { token } = useUser();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/water-alternatives/my`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = response.data;

        const calculatedStats = {
          total: data.length,
          pending: data.filter((r) => r.status === 'pending').length,
          inProgress: data.filter((r) =>
            ['assigned', 'in_progress'].includes(r.status)
          ).length,
          completed: data.filter((r) => r.status === 'completed').length,
          cancelled: data.filter((r) => r.status === 'cancelled').length,
        };

        setStats(calculatedStats);
      } catch (error) {
        console.error('Failed to load requests', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  if (loading) {
    return (
      <div className="w-full text-center py-6 text-lg font-medium animate-pulse">
        Loading statistics...
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 px-4 mb-8">
      <OverviewCard
        title="Total Requests"
        count={stats.total}
        icon={<FaListAlt />}
        bgColor="bg-blue-600"
        darkBgColor="bg-blue-700"
      />
      <OverviewCard
        title="Pending"
        count={stats.pending}
        icon={<FaClock />}
        bgColor="bg-yellow-500"
        darkBgColor="bg-yellow-600"
      />
      <OverviewCard
        title="In Progress"
        count={stats.inProgress}
        icon={<FaTools />}
        bgColor="bg-indigo-500"
        darkBgColor="bg-indigo-600"
      />
      <OverviewCard
        title="Completed"
        count={stats.completed}
        icon={<FaCheckCircle />}
        bgColor="bg-green-600"
        darkBgColor="bg-green-700"
      />
      <OverviewCard
        title="Cancelled"
        count={stats.cancelled}
        icon={<FaTimesCircle />}
        bgColor="bg-red-600"
        darkBgColor="bg-red-700"
      />
    </div>
  );
};

export default WaterSupplyOverview;
