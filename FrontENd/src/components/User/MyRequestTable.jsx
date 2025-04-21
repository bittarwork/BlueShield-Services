import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../../contexts/UserContext';
import { useTheme } from '../../contexts/ThemeContext';
import RequestInformationModal from '../../model/RequestInformationModal';
import TechnicianProfileModal from '../../model/TechnicianProfileModal';
import RequestAddNote from '../../model/RequestAddNote';
const API_URL = import.meta.env.VITE_API_URL;

const getStatusStyle = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800';
    case 'resolved':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const MyRequestTable = () => {
  const { user, token } = useUser();
  const { isDarkMode } = useTheme();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [techModalId, setTechModalId] = useState(null);
  const [noteModalId, setNoteModalId] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/maintenance/user/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const enriched = res.data.map((req) => ({
        ...req,
        user: user,
        technician: req.technician_id,
        adminNotes: req.notes.map((n) => ({
          note: n.text,
          addedBy: n.added_by?.role || 'unknown',
          date: n.created_at,
        })),
      }));

      setRequests(Array.isArray(enriched) ? enriched.reverse() : []);
    } catch (err) {
      console.error('Failed to fetch user requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id && token) fetchRequests();
  }, [user, token]);

  if (loading)
    return (
      <div className="p-4 text-gray-600 dark:text-gray-300">Loading...</div>
    );

  if (!requests.length)
    return (
      <div className="p-4 text-gray-500 dark:text-gray-400">
        No requests found.
      </div>
    );

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 text-center">
        📋 Your Maintenance Requests
      </h2>

      <div className="overflow-x-auto">
        <table
          className={`min-w-full text-sm rounded-md overflow-hidden shadow-md ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
          }`}
        >
          <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}>
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Description</th>
              <th className="p-3">Category</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
              <th className="p-3">Resolved</th>
              <th className="p-3">Images</th>
              <th className="p-3">Last Note</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, index) => {
              const lastNote = req.notes?.[req.notes.length - 1];
              const noteText = lastNote?.text || '--';
              const createdAt = new Date(req.createdAt).toLocaleDateString();
              const resolvedAt = req.resolved_at
                ? new Date(req.resolved_at).toLocaleDateString()
                : '--';

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
                  <td className="p-3">{req.description}</td>
                  <td className="p-3">{req.category}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                        req.status
                      )}`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="p-3">{createdAt}</td>
                  <td className="p-3">{resolvedAt}</td>
                  <td className="p-3">
                    {req.images?.length > 0 ? (
                      <span className="text-green-500 font-semibold">
                        {req.images.length} 📷
                      </span>
                    ) : (
                      <span className="text-gray-400">--</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="text-sm">
                      <p>{noteText}</p>
                    </div>
                  </td>
                  <td className="p-3 text-center space-y-1 flex flex-col items-center">
                    <button
                      onClick={() => setSelectedRequest(req)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-xs w-full"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() =>
                        req.technician_id &&
                        setTechModalId(
                          typeof req.technician_id === 'string'
                            ? req.technician_id
                            : req.technician_id?._id
                        )
                      }
                      disabled={!req.technician_id}
                      className={`px-3 py-1 rounded text-xs w-full transition font-medium
    ${
      req.technician_id
        ? 'bg-purple-500 text-white hover:bg-purple-600'
        : 'bg-gray-400 text-white cursor-not-allowed'
    }
  `}
                      title={
                        req.technician_id
                          ? 'View assigned technician'
                          : 'Technician not assigned yet'
                      }
                    >
                      Technician Info
                    </button>

                    <button
                      onClick={() => setNoteModalId(req._id)}
                      className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 transition text-xs w-full"
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

      {selectedRequest && (
        <RequestInformationModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
      {techModalId && (
        <TechnicianProfileModal
          technicianId={techModalId}
          onClose={() => setTechModalId(null)}
        />
      )}
      {noteModalId && (
        <RequestAddNote
          requestId={noteModalId}
          token={token}
          onClose={() => setNoteModalId(null)}
          onNoteAdded={fetchRequests}
        />
      )}
    </div>
  );
};

export default MyRequestTable;
