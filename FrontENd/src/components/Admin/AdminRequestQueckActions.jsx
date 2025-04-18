import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import { FiPlus, FiDownload } from 'react-icons/fi';
import CreateManualRequestModal from '../../model/AddNewRequestModal';

const API_URL = import.meta.env.VITE_API_URL;

const AdminRequestQuickActions = ({ onRequestCreated }) => {
  const { token } = useUser();
  const { isDarkMode } = useTheme();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState({
    create: false,
    report: false,
  });

  const buttonStyle = `flex items-center justify-center gap-2 w-full px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 text-lg font-medium`;

  const handleDownloadReport = async () => {
    try {
      setLoading((prev) => ({ ...prev, report: true }));
      const response = await axios.get(
        `${API_URL}/api/maintenance/export-report`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob', // مهم لتحميل الملفات
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'maintenance-report.xlsx'); // اسم الملف
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading report:', error);
    } finally {
      setLoading((prev) => ({ ...prev, report: false }));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-center text-2xl font-bold mb-4">Quick Actions</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => setCreateModalOpen(true)}
          disabled={loading.create}
          className={`${buttonStyle} ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} ${
            loading.create ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <FiPlus className="text-xl" />
          {loading.create ? 'Creating...' : 'Create Manual Request'}
        </button>

        <button
          onClick={handleDownloadReport}
          disabled={loading.report}
          className={`${buttonStyle} ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} ${
            loading.report ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <FiDownload className="text-xl" />
          {loading.report ? 'Downloading...' : 'Download Report'}
        </button>
      </div>

      {createModalOpen && (
        <CreateManualRequestModal
          onClose={() => setCreateModalOpen(false)}
          onRequestCreated={() => {
            if (typeof onRequestCreated === 'function') {
              onRequestCreated();
            }
          }}
        />
      )}
    </div>
  );
};

export default AdminRequestQuickActions;
