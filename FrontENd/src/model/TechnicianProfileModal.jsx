import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
const API_URL = import.meta.env.VITE_API_URL;

const TechnicianProfileModal = ({ technicianId, onClose }) => {
  const { token } = useUser();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [technician, setTechnician] = useState(null);

  useEffect(() => {
    const fetchTechnician = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/users/profile/${technicianId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTechnician(res.data);
      } catch (err) {
        console.error('Failed to fetch technician info:', err);
      } finally {
        setLoading(false);
      }
    };

    if (technicianId) fetchTechnician();
  }, [technicianId]);

  const overlayStyle = 'backdrop-blur-sm';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 ${overlayStyle}`}
    >
      <div
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative transition-all duration-300 ${
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
          <h2 className="text-2xl font-bold border-b pb-2">
            👨‍🔧 Technician Information
          </h2>

          {loading ? (
            <p className="text-center text-gray-500">
              Loading technician info...
            </p>
          ) : technician ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 flex justify-center">
                <img
                  src={`${API_URL}/${technician.profile_picture.replace(/\\/g, '/')}`}
                  alt="Technician"
                  className="w-40 h-40 object-cover rounded-full shadow-lg"
                />
              </div>

              <div className="col-span-1 space-y-3 text-sm">
                <Info
                  label="Full Name"
                  value={`${technician.first_name} ${technician.last_name}`}
                />
                <Info label="Email" value={technician.email} />
                <Info label="Phone" value={technician.phone} />
                <Info
                  label="Date of Birth"
                  value={new Date(
                    technician.date_of_birth
                  ).toLocaleDateString()}
                />
                <Info
                  label="Marital Status"
                  value={technician.marital_status}
                />
                <Info
                  label="Registered At"
                  value={new Date(technician.createdAt).toLocaleString()}
                />
              </div>
            </div>
          ) : (
            <p className="text-red-500">Technician not found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <span className="text-gray-500">{label}:</span>{' '}
    <span className="font-medium">{value || '--'}</span>
  </div>
);

export default TechnicianProfileModal;
