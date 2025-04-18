import React from 'react';

const UserRow = ({ user, isDarkMode, onDelete }) => {
  return (
    <tr
      className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition duration-200`}
    >
      <td className="px-6 py-4">
        <img
          src={`${import.meta.env.VITE_API_URL}/${user.profile_picture}`}
          alt={`${user.first_name} ${user.last_name}`}
          className="w-10 h-10 rounded-full object-cover"
        />
      </td>
      <td className="px-6 py-4 text-sm">
        {user.first_name} {user.last_name}
      </td>
      <td className="px-6 py-4 text-sm">{user.email}</td>
      <td className="px-6 py-4 text-sm">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            user.role === 'user'
              ? 'bg-green-100 text-green-800'
              : user.role === 'admin'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {user.role}
        </span>
      </td>
      <td className="px-6 py-4 text-sm">{user.phone}</td>
      <td className="px-6 py-4 text-sm">{user.marital_status}</td>
      <td className="px-6 py-4 text-sm">
        {user.locations?.map((location, index) => (
          <div key={index}>
            {location.name} ({location.lat}, {location.lng})
          </div>
        ))}
      </td>
      <td className="px-6 py-4 text-sm">
        {user.payment_methods?.map((method, index) => (
          <div key={index}>
            {method.type}: {method.details}
          </div>
        ))}
      </td>
      <td className="px-6 py-4 text-sm">
        <button
          className="text-red-500 hover:text-red-700"
          onClick={() => onDelete(user._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default UserRow;
