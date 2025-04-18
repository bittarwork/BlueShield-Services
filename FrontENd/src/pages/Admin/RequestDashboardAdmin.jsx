import React from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { useTheme } from '../../contexts/ThemeContext';
import AdminRequestStatistics from '../../components/Admin/AdminRequestStatistics';
import AdminRequestTable from '../../components/Admin/AdminRequestTable';
import AdminMapAllRequest from '../../components/Admin/AdminMapAllRequest';
import AdminRequestQuickActions from '../../components/Admin/AdminRequestQueckActions';
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
        <AdminRequestStatistics></AdminRequestStatistics>
        <AdminMapAllRequest></AdminMapAllRequest>
        <AdminRequestQuickActions></AdminRequestQuickActions>
        <AdminRequestTable></AdminRequestTable>
      </div>
    </AdminLayout>
  );
};

export default UserDashboardForAdmin;
