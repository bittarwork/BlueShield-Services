import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import UserTable from './UserTable';
import RoleFilterButton from './RoleFilterButton';

const AllUserStatistics = () => {
  const { isDarkMode } = useTheme();
  const { token } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setUsers(data.data.users);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = useCallback(
    async (userId) => {
      if (!token) {
        setError('No token found. Please log in again.');
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/users/${userId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }

        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userId)
        );
      } catch (err) {
        setError(err.message);
      }
    },
    [token]
  );

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = selectedRole === 'all' || user.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, selectedRole]);

  const handleRoleFilter = useCallback((role) => {
    setSelectedRole(role);
  }, []);

  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  if (loading) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
      >
        <div
          className={`text-center p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
        >
          <h2 className="text-2xl font-bold mb-4">Error!</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-6 min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}
    >
      <h2 className="text-2xl text-center font-bold mb-6">
        All Users Information
      </h2>

      <div className="flex space-x-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={handleSearch}
          className={`w-full p-3 rounded-lg border ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700 text-white'
              : 'bg-white border-gray-300 text-gray-800'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        <RoleFilterButton
          role="all"
          selectedRole={selectedRole}
          onClick={handleRoleFilter}
          isDarkMode={isDarkMode}
        />
        <RoleFilterButton
          role="user"
          selectedRole={selectedRole}
          onClick={handleRoleFilter}
          isDarkMode={isDarkMode}
        />
        <RoleFilterButton
          role="admin"
          selectedRole={selectedRole}
          onClick={handleRoleFilter}
          isDarkMode={isDarkMode}
        />
        <RoleFilterButton
          role="technician"
          selectedRole={selectedRole}
          onClick={handleRoleFilter}
          isDarkMode={isDarkMode}
        />
      </div>

      <UserTable
        users={filteredUsers}
        isDarkMode={isDarkMode}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AllUserStatistics;
