import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';

const ViewWaterRequestModal = ({ requestId, onClose }) => {
  const { token } = useUser();
  const { isDarkMode } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/water-alternatives/${requestId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(res.data);
      } catch (error) {
        console.error('Error fetching request details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (requestId && token) fetchData();
  }, [requestId, token]);

  if (!requestId || loading || !data) return null;

  const overlayStyle = 'backdrop-blur-sm';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 ${overlayStyle}`}
    >
      <div
        className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative transition-all duration-300 ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold text-red-500 hover:text-red-600 focus:outline-none"
        >
          &times;
        </button>

        <div className="p-6 space-y-8">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold border-b pb-2">
              Water Request Overview
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Created at: {new Date(data.createdAt).toLocaleString()}
            </p>
          </div>

          {/* User Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3">👤 User Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <Info
                label="Name"
                value={`${data.user?.first_name} ${data.user?.last_name}`}
              />
              <Info label="Email" value={data.user?.email} />
            </div>
          </div>

          {/* Technician Info */}
          {data.technician && (
            <div>
              <h3 className="text-lg font-semibold mb-3">
                🔧 Assigned Technician
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <Info
                  label="Name"
                  value={`${data.technician?.first_name} ${data.technician?.last_name}`}
                />
                <Info label="Email" value={data.technician?.email} />
              </div>
            </div>
          )}

          {/* Request Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              🧾 Request Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <Info label="Status" value={data.status} />
              <Info
                label="Payment Method"
                value={data.paymentMethod.replace('_', ' ')}
              />
              <Info label="Description" value={data.description} full />
            </div>
          </div>

          {/* Location Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3">📍 Location</h3>
            <div className="text-sm mb-2">
              Latitude: <strong>{data.location?.lat}</strong>, Longitude:{' '}
              <strong>{data.location?.lng}</strong>
            </div>
            <div className="rounded overflow-hidden shadow">
              <iframe
                title="Location Map"
                src={`https://maps.google.com/maps?q=${data.location.lat},${data.location.lng}&z=15&output=embed`}
                className="w-full h-64 border-0"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          {/* Admin Notes */}
          <div>
            <h3 className="text-lg font-semibold mb-3">📝 Admin Notes</h3>
            <div className="space-y-4">
              {data.adminNotes?.length > 0 ? (
                data.adminNotes.map((note, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-md border ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-gray-100 border-gray-300'
                    }`}
                  >
                    <p className="text-sm mb-2">{note.note || 'No content'}</p>
                    <div className="text-xs text-gray-500">
                      By: {note.addedBy} |{' '}
                      {new Date(note.date).toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No notes available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Info Component
const Info = ({ label, value, full }) => (
  <div className={full ? 'col-span-full' : ''}>
    <span className="text-gray-500">{label}:</span>{' '}
    <span className="font-medium">{value || '--'}</span>
  </div>
);

export default ViewWaterRequestModal;
