// AdminWaterStatistics.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';

const API_URL = import.meta.env.VITE_API_URL;

const AdminWaterStatistics = () => {
  const { token } = useUser();
  const { isDarkMode } = useTheme();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWaterRequests = async () => {
      if (!token) return;

      try {
        const response = await axios.get(`${API_URL}/api/water-alternatives`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const requests = response.data;
        const totalRequests = requests.length;

        const statusCounts = requests.reduce((acc, req) => {
          acc[req.status] = (acc[req.status] || 0) + 1;
          return acc;
        }, {});

        const uniqueTechnicians = new Set(
          requests.filter((r) => r.technician).map((r) => r.technician._id)
        ).size;

        const totalNotes = requests.reduce(
          (sum, r) => sum + (r.adminNotes?.length || 0),
          0
        );

        const paymentMethods = requests.reduce((acc, r) => {
          acc[r.paymentMethod] = (acc[r.paymentMethod] || 0) + 1;
          return acc;
        }, {});

        const latestRequest = requests.reduce((latest, current) =>
          new Date(current.createdAt) > new Date(latest.createdAt)
            ? current
            : latest
        );

        const userActivity = {};
        requests.forEach((r) => {
          const uid = r.user?._id;
          if (uid) userActivity[uid] = (userActivity[uid] || 0) + 1;
        });

        const mostActiveUserId = Object.entries(userActivity).sort(
          (a, b) => b[1] - a[1]
        )[0]?.[0];

        const mostActiveUser = requests.find(
          (r) => r.user?._id === mostActiveUserId
        )?.user;

        setStats({
          totalRequests,
          statusCounts,
          uniqueTechnicians,
          totalNotes,
          paymentMethods,
          latestRequest,
          mostActiveUser,
        });
      } catch (err) {
        console.error('Error loading water statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWaterRequests();
  }, [token]);

  if (loading || !stats) {
    return (
      <div className="text-center py-6 text-gray-500">
        Loading statistics...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Requests"
          value={stats.totalRequests}
          color="bg-blue-600"
          dark={isDarkMode}
        />
        <StatCard
          title="Unique Technicians"
          value={stats.uniqueTechnicians}
          color="bg-indigo-500"
          dark={isDarkMode}
        />
        <StatCard
          title="Admin Notes"
          value={stats.totalNotes}
          color="bg-pink-500"
          dark={isDarkMode}
        />

        {Object.entries(stats.statusCounts).map(([status, count]) => (
          <StatCard
            key={status}
            title={`Status: ${status}`}
            value={count}
            color="bg-amber-500"
            dark={isDarkMode}
          />
        ))}

        {Object.entries(stats.paymentMethods).map(([method, count]) => (
          <StatCard
            key={method}
            title={`Payment: ${method}`}
            value={count}
            color="bg-teal-600"
            dark={isDarkMode}
          />
        ))}

        <StatCard
          title="Most Active User"
          value={
            stats.mostActiveUser
              ? `${stats.mostActiveUser.first_name} ${stats.mostActiveUser.last_name}`
              : 'N/A'
          }
          color="bg-fuchsia-600"
          dark={isDarkMode}
        />

        <StatCard
          title="Latest Request"
          value={new Date(stats.latestRequest.createdAt).toLocaleString()}
          color="bg-gray-600"
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

export default AdminWaterStatistics;
