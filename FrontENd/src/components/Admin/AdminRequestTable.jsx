import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import RequestInformationModal from '../../model/RequestInformationModal';
import AssignTechnicianModal from '../../model/RequetAssignTech';
import RequestStatusChangeModal from '../../model/RequestStatusChange';
import RequestAddNote from '../../model/RequestAddNote';

const API_URL = import.meta.env.VITE_API_URL;

const AdminRequestTable = () => {
  const { token } = useUser();
  const { isDarkMode } = useTheme();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(20);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignRequestId, setAssignRequestId] = useState(null);

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusRequestId, setStatusRequestId] = useState(null);
  const [statusCurrentValue, setStatusCurrentValue] = useState('');

  const [addNoteModalOpen, setAddNoteModalOpen] = useState(false);
  const [noteRequestId, setNoteRequestId] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/maintenance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const uniqueCategories = [
    ...new Set(requests.map((r) => r.category).filter(Boolean)),
  ];

  const filteredRequests = requests.filter((req) => {
    const fullName =
      `${req.user_id?.first_name || ''} ${req.user_id?.last_name || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? req.status === statusFilter : true;
    const matchesCategory = categoryFilter
      ? req.category === categoryFilter
      : true;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleResolveRequest = async (requestId) => {
    try {
      await axios.patch(
        `${API_URL}/api/maintenance/${requestId}/resolve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchRequests();
    } catch (err) {
      console.error('Failed to resolve request:', err);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-4">Loading requests...</div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-center text-2xl font-semibold  ">
        All Request table
      </h2>
      {/* Filters */}
      <div
        className={`p-4 rounded-md shadow-md flex flex-col md:flex-row gap-4 items-stretch md:items-end justify-between ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
        }`}
      >
        {/* Search */}
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">
            Search by user name
          </label>
          <input
            type="text"
            placeholder="e.g. John Doe"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full px-4 py-2 rounded border outline-none ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300'
            }`}
          />
        </div>

        {/* Status Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">
            Filter by status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`w-full px-4 py-2 rounded border outline-none ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300'
            }`}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">
            Filter by category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={`w-full px-4 py-2 rounded border outline-none ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300'
            }`}
          >
            <option value="">All</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table
          className={`min-w-full text-sm text-left rounded-md overflow-hidden shadow-md ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
          }`}
        >
          <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}>
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">User</th>
              <th className="p-3">Category</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created At</th>
              <th className="p-3">Resolved At</th>
              <th className="p-3">Last Note</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.slice(0, visibleCount).map((req, index) => {
              const fullName = `${req.user_id?.first_name || ''} ${req.user_id?.last_name || ''}`;
              const lastNote = req.notes?.[req.notes.length - 1];
              const noteText = lastNote?.text || '--';
              const noteBy = lastNote?.added_by?.role || '';
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
                  <td className="p-3 font-medium">{fullName}</td>
                  <td className="p-3">{req.category}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyle(req.status)}`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="p-3">{createdAt}</td>
                  <td className="p-3">{resolvedAt}</td>
                  <td className="p-3">
                    <div className="text-sm">
                      <p>{noteText}</p>
                      <span className="text-xs text-gray-500">
                        By: {noteBy}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 space-y-1 flex flex-col">
                    <button
                      onClick={() => {
                        setSelectedRequest(req);
                        setShowModal(true);
                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-xs"
                    >
                      View
                    </button>

                    <button
                      onClick={() => {
                        setAssignRequestId(req._id);
                        setAssignModalOpen(true);
                      }}
                      disabled={!!req.assigned_technician}
                      className={`px-3 py-1 rounded text-xs transition font-medium ${
                        req.assigned_technician
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-purple-500 text-white hover:bg-purple-600'
                      }`}
                      title={
                        req.assigned_technician
                          ? `Already assigned to ${req.assigned_technician?.first_name || 'technician'}`
                          : 'Assign a technician'
                      }
                    >
                      Assign
                    </button>

                    <button
                      onClick={() => {
                        setStatusRequestId(req._id);
                        setStatusCurrentValue(req.status);
                        setStatusModalOpen(true);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-xs"
                    >
                      Change Status
                    </button>

                    <button
                      onClick={() => {
                        setNoteRequestId(req._id);
                        setAddNoteModalOpen(true);
                      }}
                      className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 transition text-xs"
                    >
                      Add Note
                    </button>

                    <button
                      onClick={() => handleResolveRequest(req._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition text-xs"
                    >
                      Resolve
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Load More */}
      {visibleCount < filteredRequests.length && (
        <div className="text-center mt-6">
          <button
            onClick={handleLoadMore}
            className="bg-gray-700 text-white px-6 py-2 rounded hover:bg-gray-800 transition"
          >
            Load More
          </button>
        </div>
      )}

      {/* Modals */}
      {showModal && selectedRequest && (
        <RequestInformationModal
          request={selectedRequest}
          onClose={() => {
            setShowModal(false);
            setSelectedRequest(null);
          }}
        />
      )}

      {assignModalOpen && assignRequestId && (
        <AssignTechnicianModal
          requestId={assignRequestId}
          onClose={() => {
            setAssignModalOpen(false);
            setAssignRequestId(null);
          }}
          onAssigned={fetchRequests}
          token={token}
        />
      )}

      {statusModalOpen && statusRequestId && (
        <RequestStatusChangeModal
          requestId={statusRequestId}
          currentStatus={statusCurrentValue}
          onClose={() => {
            setStatusModalOpen(false);
            setStatusRequestId(null);
            setStatusCurrentValue('');
          }}
          onStatusUpdated={fetchRequests}
          token={token}
        />
      )}

      {addNoteModalOpen && noteRequestId && (
        <RequestAddNote
          requestId={noteRequestId}
          onClose={() => {
            setAddNoteModalOpen(false);
            setNoteRequestId(null);
          }}
          onNoteAdded={fetchRequests}
          token={token}
        />
      )}
    </div>
  );
};

export default AdminRequestTable;
