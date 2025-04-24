import React from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { useTheme } from '../../contexts/ThemeContext';

const DashboardAdmin = () => {
  const { isDarkMode } = useTheme();

  return (
    <AdminLayout>
      <div
        className={`flex-1 flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}
      >
        <div className="text-center px-6 py-10 max-w-2xl">
          <h1 className="text-4xl font-bold mb-6">Welcome, Admin 👋</h1>
          <p className="text-lg leading-relaxed">
            <span className="font-semibold text-primary">
              BlueShield-Services
            </span>{' '}
            is a smart platform built to manage water maintenance requests
            across Saudi Arabia. As an admin, you can oversee requests, assign
            technicians, track progress, and ensure high-quality service
            delivery. Use the side menu to access and control the platform’s
            core features efficiently.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardAdmin;
