import React from 'react';

const RoleFilterButton = ({ role, selectedRole, onClick, isDarkMode }) => {
  const colors = {
    all: { bg: 'blue', hover: 'blue-600' },
    user: { bg: 'green', hover: 'green-600' },
    admin: { bg: 'purple', hover: 'purple-600' },
    technician: { bg: 'yellow', hover: 'yellow-600' },
  };

  return (
    <button
      onClick={() => onClick(role)}
      className={`px-4 rounded-lg transition-all duration-300 ${
        selectedRole === role
          ? `bg-${colors[role].bg}-500 text-white hover:bg-${colors[role].hover}`
          : isDarkMode
            ? 'bg-gray-700 text-white hover:bg-gray-600'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
      }`}
    >
      {role === 'all' ? 'All' : role.charAt(0).toUpperCase() + role.slice(1)}
    </button>
  );
};

export default RoleFilterButton;
