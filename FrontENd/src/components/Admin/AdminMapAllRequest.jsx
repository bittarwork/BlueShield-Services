import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import 'leaflet/dist/leaflet.css';

const API_URL = import.meta.env.VITE_API_URL;

const statusColors = {
  pending: 'FFA500',
  assigned: '007BFF',
  'in-progress': '800080',
  resolved: '28a745',
};

const getIcon = (status) =>
  new Icon({
    iconUrl: `https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${
      statusColors[status] || '999999'
    }`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
  });

const AdminMapAllRequest = () => {
  const { token } = useUser();
  const { isDarkMode } = useTheme();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/maintenance`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allRequests = res.data || [];
        const withLocation = allRequests
          .filter((req) => req.location?.lat && req.location?.lng)
          .slice(0, 20);

        setRequests(withLocation);
      } catch (err) {
        console.error('Failed to load requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  if (loading) {
    return (
      <div className="text-center py-6 text-gray-500">
        Loading maintenance map...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-center text-2xl font-bold mb-6">
        Maintenance Requests Map
      </h2>

      {/* وصف وتعليمات + دليل الألوان */}
      <div
        className={`rounded-xl shadow-md p-6 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
          This interactive map displays up to{' '}
          <span className="font-medium text-black dark:text-white">
            20 recent maintenance requests
          </span>{' '}
          with valid location data. Marker color indicates request status.
        </p>

        <div className="flex flex-wrap gap-4 text-sm mb-6">
          <LegendItem label="Pending" color="bg-orange-500" />
          <LegendItem label="Assigned" color="bg-blue-500" />
          <LegendItem label="In Progress" color="bg-purple-600" />
          <LegendItem label="Resolved" color="bg-green-600" />
        </div>

        <div className="h-[500px] w-full rounded-lg overflow-hidden border dark:border-gray-700 shadow-inner">
          <MapContainer
            center={[24.774265, 46.738586]}
            zoom={6}
            scrollWheelZoom={true}
            className="h-full w-full z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/">OpenStreetMap</a>'
              url={
                isDarkMode
                  ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                  : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              }
            />

            {requests.map((req) => (
              <Marker
                key={req._id}
                position={[req.location.lat, req.location.lng]}
                icon={getIcon(req.status)}
              >
                <Popup>
                  <div className="text-sm space-y-1 text-gray-800 dark:text-gray-100">
                    <div>
                      <span className="font-semibold">Category:</span>{' '}
                      {req.category}
                    </div>
                    <div>
                      <span className="font-semibold">Status:</span>{' '}
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-white text-xs ${
                          {
                            pending: 'bg-orange-500',
                            assigned: 'bg-blue-500',
                            'in-progress': 'bg-purple-600',
                            resolved: 'bg-green-600',
                          }[req.status] || 'bg-gray-500'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">Date:</span>{' '}
                      {new Date(req.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

const LegendItem = ({ label, color }) => (
  <div className="flex items-center gap-2">
    <span className={`w-3 h-3 rounded-full inline-block ${color}`} />
    <span className="text-gray-700 dark:text-gray-300">{label}</span>
  </div>
);

export default AdminMapAllRequest;
