import React, { useState } from 'react';
import UserRow from './UserRow';

const UserTable = ({ users, isDarkMode, onDelete }) => {
  const [visibleUsers, setVisibleUsers] = useState(10); // عدد المستخدمين المعروضين حاليًا

  // دالة لتحميل المزيد من المستخدمين
  const loadMoreUsers = () => {
    setVisibleUsers((prevVisibleUsers) => prevVisibleUsers + 10);
  };

  // نحدد الجزء من المستخدمين الذي نريد عرضه
  const usersToShow = users.slice(0, visibleUsers);

  return (
    <div className="overflow-x-auto">
      <table
        className={`min-w-full rounded-lg overflow-hidden shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
              Profile
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
              Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
              Email
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
              Role
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
              Phone
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
              Marital Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
              Locations
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
              Payment Methods
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {usersToShow.map((user) => (
            <UserRow
              key={user._id}
              user={user}
              isDarkMode={isDarkMode}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>

      {/* زر "عرض المزيد" */}
      {visibleUsers < users.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={loadMoreUsers}
            className={`px-4 py-2 rounded-lg ${
              isDarkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            } transition duration-300`}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default UserTable;
