// AdminWaterStatistics.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';

const AdminWaterStatistics = () => {
  const { isDarkMode } = useTheme();
  const { token } = useUser();

  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWaterRequests = async () => {
      if (!token) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/water-alternatives`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(response.data);
        calculateStats(response.data);
      } catch (error) {
        console.error('Error fetching water alternative requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWaterRequests();
  }, [token]);

  const calculateStats = (requests) => {
    const totalRequests = requests.length;

    const statusCounts = requests.reduce((acc, req) => {
      acc[req.status] = (acc[req.status] || 0) + 1;
      return acc;
    }, {});

    const uniqueTechnicians = new Set(
      requests.filter((req) => req.technician).map((req) => req.technician._id)
    ).size;

    const totalNotes = requests.reduce(
      (acc, req) => acc + (req.adminNotes?.length || 0),
      0
    );

    const paymentMethods = requests.reduce((acc, req) => {
      acc[req.paymentMethod] = (acc[req.paymentMethod] || 0) + 1;
      return acc;
    }, {});

    const latestRequest = requests.reduce((latest, current) =>
      new Date(current.createdAt) > new Date(latest.createdAt)
        ? current
        : latest
    );

    const userCounts = {};
    requests.forEach((req) => {
      const userId = req.user?._id;
      if (userId) {
        userCounts[userId] = (userCounts[userId] || 0) + 1;
      }
    });

    const mostActiveUserId = Object.keys(userCounts).sort(
      (a, b) => userCounts[b] - userCounts[a]
    )[0];
    const mostActiveUser = requests.find(
      (r) => r.user._id === mostActiveUserId
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
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-600 dark:text-gray-300">
        Loading statistics...
      </div>
    );

  if (!stats)
    return (
      <div className="p-6 text-center text-red-500 dark:text-red-400">
        No statistics available.
      </div>
    );

  return (
    <div
      className={`p-6 rounded-lg shadow-md transition-all ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <h2 className="text-2xl font-bold mb-6 text-center">
        Water Alternatives - Statistics Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <StatCard label="Total Requests" value={stats.totalRequests} />
        <StatCard label="Unique Technicians" value={stats.uniqueTechnicians} />
        <StatCard label="Total Admin Notes" value={stats.totalNotes} />

        {Object.entries(stats.statusCounts).map(([status, count]) => (
          <StatCard key={status} label={`Status: ${status}`} value={count} />
        ))}

        {Object.entries(stats.paymentMethods).map(([method, count]) => (
          <StatCard key={method} label={`Payment: ${method}`} value={count} />
        ))}

        <StatCard
          label="Most Active User"
          value={
            stats.mostActiveUser
              ? `${stats.mostActiveUser.first_name} ${stats.mostActiveUser.last_name}`
              : 'N/A'
          }
        />

        <StatCard
          label="Latest Request"
          value={new Date(stats.latestRequest.createdAt).toLocaleString()}
        />
      </div>
    </div>
  );
};

// مكون إحصائية واحدة
const StatCard = ({ label, value }) => (
  <div className="p-5 rounded-md border shadow-sm bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white dark:border-gray-700">
    <div className="text-sm font-medium opacity-70">{label}</div>
    <div className="text-2xl font-semibold mt-2">{value}</div>
  </div>
);

export default AdminWaterStatistics;
