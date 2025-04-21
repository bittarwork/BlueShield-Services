import React, { useState } from 'react';
import UsersLayout from '../../layout/UsersLayout';
import RequestOverView from '../../components/User/RequestOverView';
import CreateManualRequestModal from '../../model/CreateRequestModal';
import MyRequestTable from '../../components/User/MyRequestTable';
import { useTheme } from '../../contexts/ThemeContext';

const DashboardUser = () => {
  const [showModal, setShowModal] = useState(false);
  const { isDarkMode } = useTheme();

  const headingText = isDarkMode ? 'text-white' : 'text-gray-900';
  const buttonClasses = `
    ${isDarkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-500'}
    text-white px-5 py-2 rounded-lg font-medium shadow transition duration-300
  `;

  return (
    <UsersLayout>
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 px-4 mt-6 mb-8">
        <h1 className={`text-3xl font-semibold ${headingText}`}>
          User Dashboard
        </h1>
        <button className={buttonClasses} onClick={() => setShowModal(true)}>
          ➕ Create Maintenance Request
        </button>
      </div>

      <RequestOverView />
      <MyRequestTable />
      {showModal && (
        <CreateManualRequestModal
          onClose={() => setShowModal(false)}
          onRequestCreated={() => setShowModal(false)}
        />
      )}
    </UsersLayout>
  );
};

export default DashboardUser;
