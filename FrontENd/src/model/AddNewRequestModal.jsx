import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

const API_URL = import.meta.env.VITE_API_URL;

const LocationPicker = ({ lat, lng, setLatLng }) => {
  useMapEvents({
    click(e) {
      setLatLng({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return (
    <Marker
      position={[lat, lng]}
      icon={L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      })}
    />
  );
};

const CreateManualRequestModal = ({ onClose, onRequestCreated }) => {
  const { isDarkMode } = useTheme();
  const { token } = useUser();

  const [formData, setFormData] = useState({
    description: '',
    category: '',
    lat: 24.774265,
    lng: 46.738586,
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      setFormData({ ...formData, images: files });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    const { description, category, lat, lng, images } = formData;

    if (!description || !category || !lat || !lng) {
      setError('جميع الحقول مطلوبة.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = new FormData();
      payload.append('description', description);
      payload.append('category', category);
      payload.append(
        'location',
        JSON.stringify({ lat: parseFloat(lat), lng: parseFloat(lng) })
      );
      for (let i = 0; i < images.length; i++) {
        payload.append('images', images[i]);
      }

      await axios.post(`${API_URL}/api/maintenance`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      onRequestCreated();
      onClose();
    } catch (err) {
      console.error(err);
      setError('فشل في إرسال الطلب. حاول مجددًا.');
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
          <h2 className="text-xl font-bold border-b pb-2">
            إضافة طلب صيانة يدوي
          </h2>

          <input
            type="text"
            name="description"
            placeholder="الوصف"
            className={`w-full p-3 border rounded-md outline-none ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300'
            }`}
            onChange={handleChange}
            value={formData.description}
          />

          <input
            type="text"
            name="category"
            placeholder="الفئة (مثل: كهرباء)"
            className={`w-full p-3 border rounded-md outline-none ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300'
            }`}
            onChange={handleChange}
            value={formData.category}
          />

          <div className="h-64 w-full rounded overflow-hidden">
            <MapContainer
              center={[formData.lat, formData.lng]}
              zoom={13}
              scrollWheelZoom={true}
              className="h-full w-full"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationPicker
                lat={formData.lat}
                lng={formData.lng}
                setLatLng={({ lat, lng }) =>
                  setFormData((prev) => ({ ...prev, lat, lng }))
                }
              />
            </MapContainer>
          </div>

          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            className="w-full p-3 border rounded-md"
            onChange={handleChange}
          />

          {/* معاينة الصور */}
          <div className="flex gap-2 flex-wrap">
            {Array.from(formData.images).map((img, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(img)}
                alt={`img-${idx}`}
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition"
            >
              إلغاء
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateManualRequestModal;
