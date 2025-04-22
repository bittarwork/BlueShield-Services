import React, { useEffect, useState } from 'react';

import axios from 'axios';

import UsersLayout from '../../layout/UsersLayout';

import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';

import WaterSupplyOverview from '../../components/User/WaterSupplyOverview';
import WaterSupplyTable from '../../components/User/WaterSupplyTable';
import CreateWaterRequestModal from '../../model/CreateWaterRequestModal';

const API_URL = import.meta.env.VITE_API_URL;

const AlternativeWaterSupply = () => {
  const { isDarkMode } = useTheme();
  const { token } = useUser();
  const headingText = isDarkMode ? 'text-white' : 'text-gray-900';

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/water-alternatives/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (error) {
      console.error('Error fetching requests', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <UsersLayout>
      <div className="px-4 py-6 space-y-8">
        {/* العنوان وزر الإضافة */}
        <div className="flex items-center justify-between">
          <h1 className={`text-3xl font-semibold ${headingText}`}>
            Alternative Water Supply
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            ➕ Create Request
          </button>
        </div>

        {/* المودال */}
        <CreateWaterRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchRequests} // يعيد جلب الطلبات بعد الإضافة
        />

        {/* كروت الإحصائيات */}
        <WaterSupplyOverview requests={requests} loading={loading} />

        {/* جدول الطلبات */}
        <WaterSupplyTable requests={requests} loading={loading} />
      </div>
    </UsersLayout>
  );
};

export default AlternativeWaterSupply;
