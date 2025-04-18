import React from 'react';
import Sidebar from '../components/Sidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto ml-64">{children}</div>
    </div>
  );
};

export default AdminLayout;
