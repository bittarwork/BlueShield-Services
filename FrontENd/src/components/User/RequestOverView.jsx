import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../../contexts/UserContext';
import { useTheme } from '../../contexts/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL;

const statusColors = {
  pending: 'bg-yellow-500',
  assigned: 'bg-blue-500',
  'in-progress': 'bg-purple-500',
  resolved: 'bg-green-600',
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-block px-3 py-1 text-sm font-semibold text-white rounded-full capitalize ${statusColors[status]}`}
  >
    {status.replace('-', ' ')}
  </span>
);

const RequestOverview = () => {
  const { isDarkMode } = useTheme();
  const { user, token } = useUser();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/maintenance/user/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRequests(Array.isArray(res.data) ? res.data.reverse() : []);
      } catch (err) {
        console.error('Failed to fetch user requests', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && token) fetchRequests();
  }, [user, token]);

  const baseText = isDarkMode ? 'text-gray-200' : 'text-gray-700';
  const baseTitle = isDarkMode ? 'text-gray-100' : 'text-gray-800';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const shadow = 'shadow-md';

  if (loading) {
    return (
      <div className="p-4 animate-pulse">
        <div className={`h-6 ${cardBg} ${shadow} rounded w-1/2 mb-4`} />
        <div className="space-y-3">
          <div className={`h-4 ${cardBg} rounded w-3/4`} />
          <div className={`h-4 ${cardBg} rounded w-2/3`} />
          <div className={`h-4 ${cardBg} rounded w-1/3`} />
        </div>
      </div>
    );
  }

  if (!requests.length) {
    return (
      <div className={`p-4 ${baseText}`}>No maintenance requests yet.</div>
    );
  }

  const lastRequest = requests[0];
  const statusCounts = {
    pending: 0,
    assigned: 0,
    'in-progress': 0,
    resolved: 0,
  };

  requests.forEach((req) => {
    if (statusCounts.hasOwnProperty(req.status)) {
      statusCounts[req.status]++;
    }
  });

  return (
    <div className="p-4 space-y-8">
      {/* Latest Request Card */}
      <section className={`${cardBg} ${shadow} rounded-lg p-6`}>
        <h2
          className={`text-xl font-semibold mb-4 flex items-center gap-2 ${baseTitle}`}
        >
          📝 Latest Maintenance Request
        </h2>
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${baseText}`}>
          <div>
            <span className="font-medium">Description:</span>{' '}
            {lastRequest.description}
          </div>
          <div>
            <span className="font-medium">Category:</span>{' '}
            {lastRequest.category}
          </div>
          <div>
            <span className="font-medium">Date:</span>{' '}
            {new Date(lastRequest.createdAt).toLocaleDateString()}
          </div>
          <div>
            <span className="font-medium">Status:</span>{' '}
            <StatusBadge status={lastRequest.status} />
          </div>
        </div>
      </section>

      {/* Request Statistics */}
      <section>
        <h3 className={`text-lg font-semibold mb-3 ${baseTitle}`}>
          📊 Request Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(statusCounts).map(([key, value]) => (
            <div
              key={key}
              className={`${cardBg} ${shadow} p-4 rounded-lg flex flex-col items-center`}
            >
              <p
                className={`capitalize text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                {key.replace('-', ' ')}
              </p>
              <p
                className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RequestOverview;
