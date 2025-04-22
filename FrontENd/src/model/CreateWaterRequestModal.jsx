import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const API_URL = import.meta.env.VITE_API_URL;

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const LocationSelector = ({ setLocation }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setLocation({ lat, lng });
    },
  });
  return null;
};

const CreateWaterRequestModal = ({ isOpen, onClose, onSuccess }) => {
  const { token } = useUser();
  const { isDarkMode } = useTheme();
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setDescription('');
    setLocation({ lat: null, lng: null });
    setPaymentMethod('cash_on_delivery');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description || !location.lat || !location.lng) {
      setError('Please complete all required fields.');
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${API_URL}/api/water-alternatives`,
        {
          description,
          location: {
            lat: parseFloat(location.lat),
            lng: parseFloat(location.lng),
          },
          paymentMethod,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onSuccess();
      resetForm();
      onClose();
    } catch (err) {
      console.error('Error submitting request:', err);
      setError('Submission failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm">
      <div
        className={`w-full max-w-2xl rounded-xl shadow-2xl relative transition-all duration-300 ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}
      >
        {/* زر الإغلاق */}
        <button
          onClick={() => {
            resetForm();
            onClose();
          }}
          className="absolute top-4 right-4 text-2xl font-bold text-red-500 hover:text-red-600 focus:outline-none"
        >
          &times;
        </button>

        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold border-b pb-2">
              Create Water Request
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium text-sm">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Describe your request..."
                className={`w-full p-3 rounded-md border resize-none outline-none ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300'
                }`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-sm">
                Select location on map
              </label>
              <MapContainer
                center={[33.5138, 36.2765]}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: '300px' }}
                className="rounded-md overflow-hidden"
              >
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationSelector setLocation={setLocation} />
                {location.lat && location.lng && (
                  <Marker position={[location.lat, location.lng]} />
                )}
              </MapContainer>
              {location.lat && location.lng && (
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                  Selected:{' '}
                  <strong>
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </strong>
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium text-sm">
                Payment Method
              </label>
              <select
                className={`w-full p-3 rounded-md border outline-none ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300'
                }`}
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="cash_on_delivery">Cash on Delivery</option>
                <option value="electronic">Electronic Payment</option>
              </select>
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium -mt-2">{error}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateWaterRequestModal;
