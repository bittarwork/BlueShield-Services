import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../../contexts/UserContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FaClock, FaUserCheck, FaTools, FaCheckCircle } from 'react-icons/fa';

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

const RequestOverview = () => {
  const { isDarkMode } = useTheme();
  const { user, token } = useUser();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    assigned: 0,
    'in-progress': 0,
    resolved: 0,
  });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/maintenance/user/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = Array.isArray(res.data) ? res.data : [];

        const counts = {
          pending: 0,
          assigned: 0,
          'in-progress': 0,
          resolved: 0,
        };

        data.forEach((req) => {
          if (counts.hasOwnProperty(req.status)) {
            counts[req.status]++;
          }
        });

        setRequests(data.reverse());
        setStatusCounts(counts);
      } catch (err) {
        console.error('Failed to fetch user requests', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && token) fetchRequests();
  }, [user, token]);

  if (loading) {
    return (
      <div className="w-full text-center py-6 text-lg font-medium animate-pulse">
        Loading statistics...
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8">
      {requests.length > 0 && (
        <div
          className={`
        relative p-6 rounded-2xl overflow-hidden shadow-lg transition-all
        ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}
      `}
        >
          {/* Header Bar */}
          <div
            className={`
        absolute top-0 left-0 w-full h-2 rounded-t-xl
        ${
          requests[0].status === 'pending'
            ? 'bg-yellow-500'
            : requests[0].status === 'assigned'
              ? 'bg-blue-500'
              : requests[0].status === 'in-progress'
                ? 'bg-purple-500'
                : 'bg-green-600'
        }
      `}
          ></div>

          {/* Status & Title */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              🛠️ Maintenance Request
            </h2>
            <span
              className={`
          mt-2 inline-block px-3 py-1 text-sm rounded-full font-semibold
          ${
            requests[0].status === 'pending'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
              : requests[0].status === 'assigned'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                : requests[0].status === 'in-progress'
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
                  : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
          }
        `}
            >
              {requests[0].status.replace('-', ' ')}
            </span>
          </div>

          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base">
            <div>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Description
              </p>
              <p className="font-medium">{requests[0].description}</p>
            </div>
            <div>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Category
              </p>
              <p className="font-medium">{requests[0].category}</p>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-6 border-t pt-4 flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <p className="font-semibold">Created At</p>
              <p>{new Date(requests[0].createdAt).toLocaleString()}</p>
            </div>
            {requests[0].resolved_at && (
              <div>
                <p className="font-semibold">Resolved At</p>
                <p>{new Date(requests[0].resolved_at).toLocaleString()}</p>
              </div>
            )}
            <div>
              <p className="font-semibold">Notes</p>
              <p>{requests[0].notes.length} note(s)</p>
            </div>
          </div>
        </div>
      )}

      {/* Request Stats Cards */}
      <section>
        <h3
          className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}
        >
          📊 Request Summary
        </h3>
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          <OverviewCard
            title="Pending"
            count={statusCounts.pending}
            icon={<FaClock />}
            bgColor="bg-yellow-500"
            darkBgColor="bg-yellow-600"
          />
          <OverviewCard
            title="Assigned"
            count={statusCounts.assigned}
            icon={<FaUserCheck />}
            bgColor="bg-blue-500"
            darkBgColor="bg-blue-600"
          />
          <OverviewCard
            title="In Progress"
            count={statusCounts['in-progress']}
            icon={<FaTools />}
            bgColor="bg-purple-500"
            darkBgColor="bg-purple-600"
          />
          <OverviewCard
            title="Resolved"
            count={statusCounts.resolved}
            icon={<FaCheckCircle />}
            bgColor="bg-green-600"
            darkBgColor="bg-green-700"
          />
        </div>
      </section>
    </div>
  );
};

export default RequestOverview;
