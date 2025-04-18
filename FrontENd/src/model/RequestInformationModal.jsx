import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const RequestInformationModal = ({ request, onClose }) => {
  const { isDarkMode } = useTheme();

  const {
    user_id,
    category,
    description,
    location,
    images,
    status,
    notes,
    createdAt,
    resolved_at,
  } = request;

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
              Request Overview
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Created at: {new Date(createdAt).toLocaleString()} | Resolved at:{' '}
              {resolved_at ? new Date(resolved_at).toLocaleString() : '--'}
            </p>
          </div>

          {/* Section: User Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3">👤 User Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <Info
                label="Name"
                value={`${user_id?.first_name} ${user_id?.last_name}`}
              />
              <Info label="Email" value={user_id?.email} />
              <Info label="Phone" value={user_id?.phone} />
              <Info
                label="DOB"
                value={new Date(user_id?.date_of_birth).toLocaleDateString()}
              />
              <Info label="Marital Status" value={user_id?.marital_status} />
              <Info label="Role" value={user_id?.role} />
            </div>
          </div>

          {/* Section: Request Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              🧾 Request Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <Info label="Category" value={category} />
              <Info label="Status" value={status} />
              <Info label="Description" value={description} full />
            </div>
          </div>

          {/* Section: Location */}
          <div>
            <h3 className="text-lg font-semibold mb-3">📍 Location</h3>
            <div className="text-sm mb-2">
              Latitude: <strong>{location?.lat}</strong>, Longitude:{' '}
              <strong>{location?.lng}</strong>
            </div>
            <div className="rounded overflow-hidden shadow">
              <iframe
                title="Location Map"
                src={`https://maps.google.com/maps?q=${location?.lat},${location?.lng}&z=15&output=embed`}
                className="w-full h-64 border-0"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          {/* Section: Images */}
          {images?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">📸 Images</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={`${import.meta.env.VITE_API_URL}/uploads/${img}`}
                    alt={`image-${i}`}
                    className="w-full h-32 object-cover rounded-lg border shadow-sm hover:scale-105 transition"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Section: Notes */}
          <div>
            <h3 className="text-lg font-semibold mb-3">📝 Notes</h3>
            <div className="space-y-4">
              {notes?.length > 0 ? (
                notes.map((note, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-md border ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-gray-100 border-gray-300'
                    }`}
                  >
                    <p className="text-sm mb-2">{note.text}</p>
                    <div className="text-xs text-gray-500">
                      By: {note.added_by?.role} |{' '}
                      {new Date(note.created_at).toLocaleString()}
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

// Reusable Info Row
const Info = ({ label, value, full }) => (
  <div className={full ? 'col-span-full' : ''}>
    <span className="text-gray-500">{label}:</span>{' '}
    <span className="font-medium">{value || '--'}</span>
  </div>
);

export default RequestInformationModal;
