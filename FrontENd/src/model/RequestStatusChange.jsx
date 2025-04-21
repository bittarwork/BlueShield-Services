import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL;

const RequestStatusChangeModal = ({
  requestId,
  currentStatus,
  onClose,
  onStatusUpdated,
  token,
  statusEndpoint, // ✅ دعم endpoint خارجي
}) => {
  const { isDarkMode } = useTheme();
  const [newStatus, setNewStatus] = useState(currentStatus || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const statuses = [
    'pending',
    'assigned',
    'in_progress',
    'delivered',
    'completed',
    'cancelled',
  ];

  const handleStatusChange = async () => {
    if (!newStatus) return;
    try {
      setLoading(true);

      const url =
        statusEndpoint || `${API_URL}/api/maintenance/${requestId}/status`; // ✅ مرونة اختيار المسار

      await axios.patch(
        url,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onStatusUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm">
      <div
        className={`w-full max-w-xl rounded-xl shadow-2xl relative transition-all duration-300 ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold text-red-500 hover:text-red-600 focus:outline-none"
        >
          &times;
        </button>

        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold border-b pb-2">
              Change Request Status
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Current status:{' '}
              <span className="font-medium">{currentStatus}</span>
            </p>
          </div>

          <div>
            <label className="block mb-2 font-medium text-sm">
              New status:
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className={`w-full px-4 py-2 rounded border ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value="">-- Select Status --</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.replaceAll('_', ' ')}
                </option>
              ))}
            </select>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleStatusChange}
              disabled={loading || !newStatus || newStatus === currentStatus}
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50 text-sm"
            >
              {loading ? 'Updating...' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestStatusChangeModal;
