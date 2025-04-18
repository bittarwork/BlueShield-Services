import React from 'react';
import { Link } from 'react-router-dom';
// مكون AuthButtons للأزرار الخاصة بتسجيل الدخول والتسجيل
const AuthButtons = () => {
  return (
    <div className="flex space-x-2">
      <Link
        to="/login"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Login
      </Link>
      <Link
        to="/register"
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        Sign up
      </Link>
    </div>
  );
};

export default AuthButtons;
