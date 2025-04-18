import React from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { useTheme } from '../../contexts/ThemeContext';

const UserDashboardForAdmin = () => {
  const { isDarkMode } = useTheme();
  return (
    <AdminLayout>
      <div
        className={`min-h-screen transition-all duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}
      >
        <h1 className="text-5xl text-center font-bold my-6">
          Maintenance Request Dashboard
        </h1>
      </div>
    </AdminLayout>
  );
};

export default UserDashboardForAdmin;
