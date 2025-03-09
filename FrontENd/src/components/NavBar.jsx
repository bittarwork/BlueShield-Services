import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext"; // تأكد من المسار الصحيح
import { useUser } from "../contexts/UserContext"; // تأكد من المسار الصحيح

import {
  FaSun,
  FaMoon,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { Link } from "react-router-dom"; // إذا كنت تستخدم React Router

const NavBar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav
      className={`fixed w-full z-50 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } shadow-lg transition-colors duration-300`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* اسم الموقع */}
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
        >
          BlueShield Services
        </Link>

        {/* قائمة التنقل للأجهزة الكبيرة */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/services"
            className="hover:text-blue-500 transition-colors"
          >
            الخدمات
          </Link>
          <Link to="/about" className="hover:text-blue-500 transition-colors">
            من نحن
          </Link>
          <Link to="/contact" className="hover:text-blue-500 transition-colors">
            اتصل بنا
          </Link>
        </div>

        {/* الأزرار التفاعلية */}
        <div className="hidden md:flex items-center space-x-4">
          {/* زر تبديل الوضع الليلي */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-200 hover:bg-gray-300"
            } transition-colors`}
          >
            {isDarkMode ? (
              <FaSun className="text-yellow-400" />
            ) : (
              <FaMoon className="text-gray-800" />
            )}
          </button>

          {/* معلومات المستخدم */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <img
                src={user?.profilePicture || "https://via.placeholder.com/40"}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-blue-500"
              />
              <span className="font-semibold">{user?.name}</span>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                <FaSignOutAlt />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                تسجيل الدخول
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                إنشاء حساب
              </Link>
            </div>
          )}
        </div>

        {/* قائمة التنقل للأجهزة المحمولة */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {isMobileMenuOpen ? (
            <FaTimes className="text-2xl" />
          ) : (
            <FaBars className="text-2xl" />
          )}
        </button>
      </div>

      {/* قائمة التنقل المتنقلة (Mobile Menu) */}
      {isMobileMenuOpen && (
        <div
          className={`md:hidden ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          } transition-all duration-300`}
        >
          <div className="flex flex-col space-y-4 p-4">
            <Link
              to="/services"
              className="hover:text-blue-500 transition-colors"
            >
              الخدمات
            </Link>
            <Link to="/about" className="hover:text-blue-500 transition-colors">
              من نحن
            </Link>
            <Link
              to="/contact"
              className="hover:text-blue-500 transition-colors"
            >
              اتصل بنا
            </Link>
            {isAuthenticated ? (
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <img
                    src={
                      user?.profilePicture || "https://via.placeholder.com/40"
                    }
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-blue-500"
                  />
                  <span className="font-semibold">{user?.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  <FaSignOutAlt />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  إنشاء حساب
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
