import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../../contexts/UserContext';
import { useTheme } from '../../contexts/ThemeContext';
import ViewWaterRequestModal from '../../model/ViewWaterRequestModal';
import AddNoteModal from '../../model/WaterAddNoteModal';

const API_URL = import.meta.env.VITE_API_URL;

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  assigned: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const WaterSupplyTable = () => {
  const { token } = useUser();
  const { isDarkMode } = useTheme();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedRequestIdForNote, setSelectedRequestIdForNote] =
    useState(null);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/water-alternatives/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data.reverse());
    } catch (err) {
      console.error('Error loading water requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchRequests();
  }, [token]);

  if (loading)
    return (
      <div className="p-4 text-gray-600 dark:text-gray-300">Loading...</div>
    );
  if (!requests.length)
    return (
      <div className="p-4 text-gray-500 dark:text-gray-400">
        No water requests found.
      </div>
    );

  return (
    <div className="p-4 space-y-6">
      <h2
        className={` text-xl font-bold text-center ${isDarkMode ? 'text-white' : 'text-gray-700'}`}
      >
        💧 Your Water Supply Requests
      </h2>

      <div className="overflow-x-auto">
        <table
          className={`min-w-full text-sm rounded-md overflow-hidden shadow-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
        >
          <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}>
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Description</th>
              <th className="p-3">Status</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Notes</th>
              <th className="p-3">Location</th>
              <th className="p-3">Created</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, index) => {
              const createdAt = new Date(req.createdAt).toLocaleDateString();
              const noteCount = req.adminNotes?.length || 0;

              return (
                <tr
                  key={req._id}
                  className={
                    index % 2 === 0
                      ? 'bg-inherit'
                      : isDarkMode
                        ? 'bg-gray-900'
                        : 'bg-gray-100'
                  }
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 max-w-xs truncate">{req.description}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[req.status]}`}
                    >
                      {req.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-3 capitalize">
                    {req.paymentMethod.replace(/_/g, ' ')}
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-xs font-medium">
                      {noteCount} note{noteCount !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="p-3 text-xs">
                    <div>
                      <span>Lat: {req.location?.lat?.toFixed(2)}</span>
                      <br />
                      <span>Lng: {req.location?.lng?.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="p-3">{createdAt}</td>
                  <td className="p-3 text-center space-y-1 flex flex-col items-center">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-xs w-full"
                      onClick={() => setSelectedRequestId(req._id)}
                    >
                      View
                    </button>
                    <button
                      className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 transition text-xs w-full"
                      onClick={() => setSelectedRequestIdForNote(req._id)}
                    >
                      Add Note
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedRequestId && (
        <ViewWaterRequestModal
          requestId={selectedRequestId}
          onClose={() => setSelectedRequestId(null)}
        />
      )}
      {selectedRequestIdForNote && (
        <AddNoteModal
          requestId={selectedRequestIdForNote}
          onClose={() => setSelectedRequestIdForNote(null)}
          onNoteAdded={fetchRequests}
        />
      )}
    </div>
  );
};

export default WaterSupplyTable;
