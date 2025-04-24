import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';

import RequestInformationModal from '../../model/RequestInformationModal';
import AssignTechnicianModal from '../../model/RequetAssignTech';
import RequestStatusChangeModal from '../../model/RequestStatusChange';
import RequestAddNote from '../../model/RequestAddNote';

const API_URL = import.meta.env.VITE_API_URL;

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  assigned: 'bg-purple-100 text-purple-800',
  in_progress: 'bg-blue-100 text-blue-800',
  delivered: 'bg-teal-100 text-teal-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const AlternativeWaterSupplyTable = () => {
  const { token } = useUser();
  const { isDarkMode } = useTheme();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(20);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignRequestId, setAssignRequestId] = useState(null);

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusRequestId, setStatusRequestId] = useState(null);
  const [statusCurrentValue, setStatusCurrentValue] = useState('');

  const [addNoteModalOpen, setAddNoteModalOpen] = useState(false);
  const [noteRequestId, setNoteRequestId] = useState(null);

  const [requestDetailsLoading, setRequestDetailsLoading] = useState(false);
  const fetchRequestDetails = async (id) => {
    try {
      setRequestDetailsLoading(true);
      const { data } = await axios.get(
        `${API_URL}/api/water-alternatives/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedRequest(data);
      setShowModal(true);
    } catch (err) {
      console.error('Failed to load request details:', err);
      alert('Failed to load request details. Please try again.');
    } finally {
      setRequestDetailsLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/water-alternatives`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(data);
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = requests.filter((req) => {
    const fullName =
      `${req.user?.first_name || ''} ${req.user?.last_name || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? req.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Filters */}
      <div
        className={`p-4 rounded-md shadow-md flex flex-col md:flex-row gap-4 items-stretch md:items-end justify-between ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
        }`}
      >
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">
            Search by user name
          </label>
          <input
            type="text"
            placeholder="e.g. Ahmad"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full px-4 py-2 rounded border outline-none ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300'
            }`}
          />
        </div>

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
            {Object.keys(statusColors).map((s) => (
              <option key={s} value={s}>
                {s.replaceAll('_', ' ')}
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
              <th className="p-3">Description</th>
              <th className="p-3">Location</th>
              <th className="p-3">Status</th>
              <th className="p-3">Technician</th>
              <th className="p-3">Created</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.slice(0, visibleCount).map((req, index) => (
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
                <td className="p-3 font-medium">
                  {req.user?.first_name} {req.user?.last_name}
                </td>
                <td className="p-3 max-w-xs truncate">{req.description}</td>
                <td className="p-3 text-xs">
                  <div>Lat: {req.location?.lat}</div>
                  <div>Lng: {req.location?.lng}</div>
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[req.status]}`}
                  >
                    {req.status.replaceAll('_', ' ')}
                  </span>
                </td>
                <td className="p-3">
                  {req.technician ? (
                    `${req.technician?.first_name} ${req.technician?.last_name}`
                  ) : (
                    <span className="text-gray-400 italic">None</span>
                  )}
                </td>
                <td className="p-3">
                  {moment(req.createdAt).format('YYYY-MM-DD')}
                </td>
                <td className="p-3 space-y-1 flex flex-col">
                  <button
                    onClick={() => fetchRequestDetails(req._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-xs"
                  >
                    {requestDetailsLoading && selectedRequest?._id === req._id
                      ? 'Loading...'
                      : 'View'}
                  </button>

                  <button
                    onClick={() => {
                      setAssignRequestId(req._id);
                      setAssignModalOpen(true);
                    }}
                    className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition text-xs"
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
          assignEndpoint={`${API_URL}/api/water-alternatives/${assignRequestId}/assign`} // ✅ هنا الفرق الوحيد
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
          statusEndpoint={`${API_URL}/api/water-alternatives/${statusRequestId}/status`} // ✅ التخصيص هنا
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
          noteEndpoint={`${API_URL}/api/water-alternatives/${noteRequestId}/note`} // ✅ تمرير endpoint مخصص
        />
      )}
    </div>
  );
};

export default AlternativeWaterSupplyTable;
