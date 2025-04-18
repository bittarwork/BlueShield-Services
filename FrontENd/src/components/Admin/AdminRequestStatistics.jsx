import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const API_URL = import.meta.env.VITE_API_URL;

const AdminRequestStatistics = () => {
  const { token } = useUser();
  const { isDarkMode } = useTheme();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/maintenance`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;

        const counts = {
          total: data.length,
          pending: data.filter((req) => req.status === 'pending').length,
          assigned: data.filter((req) => req.status === 'assigned').length,
          inProgress: data.filter((req) => req.status === 'in-progress').length,
          resolved: data.filter((req) => req.status === 'resolved').length,
          withTechnician: data.filter((req) => req.technician_id).length,
        };

        setStats(counts);
      } catch (err) {
        console.error('Failed to load statistics:', err);
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

  const pieData = {
    labels: [
      'Pending',
      'Assigned',
      'In Progress',
      'Resolved',
      'With Technician',
    ],
    datasets: [
      {
        label: 'Request Status Distribution',
        data: [
          stats.pending,
          stats.assigned,
          stats.inProgress,
          stats.resolved,
          stats.withTechnician,
        ],
        backgroundColor: [
          '#facc15', // yellow
          '#a855f7', // purple
          '#f97316', // orange
          '#22c55e', // green
          '#14b8a6', // teal
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-center text-2xl font-bold mb-6">
        Maintenance Request Statistics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Requests"
          value={stats.total}
          color="bg-blue-600"
          dark={isDarkMode}
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          color="bg-yellow-400"
          dark={isDarkMode}
        />
        <StatCard
          title="Assigned"
          value={stats.assigned}
          color="bg-purple-500"
          dark={isDarkMode}
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          color="bg-orange-500"
          dark={isDarkMode}
        />
        <StatCard
          title="Resolved"
          value={stats.resolved}
          color="bg-green-500"
          dark={isDarkMode}
        />
        <StatCard
          title="With Technician"
          value={stats.withTechnician}
          color="bg-teal-500"
          dark={isDarkMode}
        />
      </div>

      {/* <div
        className={`rounded-xl shadow-md p-6 w-1/3  ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        <h3 className="text-md font-semibold mb-4 text-center">
          Status Breakdown
        </h3>
        <Pie data={pieData} />
      </div> */}
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

export default AdminRequestStatistics;
