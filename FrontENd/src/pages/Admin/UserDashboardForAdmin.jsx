import React from 'react';
import AdminLayout from '../../layout/AdminLayout';
import AllUserStatistics from '../../components/Admin/AllUserStatistics';
import { useTheme } from '../../contexts/ThemeContext';
import UserNumaricStatistic from '../../components/Admin/UserNumaricStatistic';
import AddingNewUser from '../../components/Admin/AddingNewUser';
const UserDashboardForAdmin = () => {
  const { isDarkMode } = useTheme();
  return (
    <AdminLayout>
      <div
        className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}
      >
        <h1 className="text-5xl text-center font-bold my-6">Users Dashboard</h1>
        <UserNumaricStatistic></UserNumaricStatistic>
        <AddingNewUser></AddingNewUser>
        <AllUserStatistics></AllUserStatistics>
      </div>
    </AdminLayout>
  );
};

export default UserDashboardForAdmin;
