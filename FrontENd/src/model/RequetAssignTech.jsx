import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL;

const AssignTechnicianModal = ({ requestId, onClose, onAssigned, token }) => {
  const { isDarkMode } = useTheme();

  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState('');

  const fetchTechnicians = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users?roles=technician`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTechnicians(res.data.data.users);
    } catch (err) {
      console.error('Failed to load technicians:', err);
      setError('Failed to load technicians');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedTechnician) return;
    setAssigning(true);
    try {
      await axios.patch(
        `${API_URL}/api/maintenance/${requestId}/assign`,
        { technician_id: selectedTechnician },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onAssigned();
      onClose();
    } catch (err) {
      console.error('Assignment failed:', err);
      setError('Failed to assign technician');
    } finally {
      setAssigning(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm">
      <div
        className={`w-full max-w-xl rounded-xl shadow-2xl relative transition-all duration-300 ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold text-red-500 hover:text-red-600 focus:outline-none"
        >
          &times;
        </button>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold border-b pb-2">
              Assign Technician
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Choose a technician from the list below to assign to this request.
            </p>
          </div>

          {/* Loading/Error */}
          {loading ? (
            <div className="text-center py-6 text-sm text-gray-500">
              Loading available technicians...
            </div>
          ) : (
            <>
              {/* Dropdown */}
              <div>
                <label className="block mb-2 font-medium text-sm">
                  Technician:
                </label>
                <select
                  value={selectedTechnician}
                  onChange={(e) => setSelectedTechnician(e.target.value)}
                  className={`w-full px-4 py-2 rounded border ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="">-- Choose a technician --</option>
                  {technicians.map((tech) => (
                    <option key={tech._id} value={tech._id}>
                      {tech.first_name} {tech.last_name} - {tech.email}
                    </option>
                  ))}
                </select>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={onClose}
                  disabled={assigning}
                  className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssign}
                  disabled={!selectedTechnician || assigning}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 text-sm"
                >
                  {assigning ? 'Assigning...' : 'Confirm'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignTechnicianModal;
