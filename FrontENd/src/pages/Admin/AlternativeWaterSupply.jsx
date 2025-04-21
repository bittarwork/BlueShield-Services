import React from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { useTheme } from '../../contexts/ThemeContext';

import AlternativeWaterSupplyTable from '../../components/Admin/AlternativeWaterSupplyTable';
import AdminWaterStatistics from '../../components/Admin/AdminWaterStatistics';
const AlternativeWaterSupply = () => {
  const { isDarkMode } = useTheme();
  return (
    <AdminLayout>
      <div
        className={` p-4 min-h-screen transition-all duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}
      >
        <h1 className="text-5xl text-center font-bold my-6">
          Alternative Water Supply
        </h1>
        <AdminWaterStatistics></AdminWaterStatistics>
        <AlternativeWaterSupplyTable></AlternativeWaterSupplyTable>
      </div>
    </AdminLayout>
  );
};

export default AlternativeWaterSupply;
