import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext"; // تأكد من المسار الصحيح
import {
  FaHome,
  FaCogs,
  FaUser,
  FaSignOutAlt,
  FaSun,
  FaMoon,
  FaChevronRight,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom"; // إذا كنت تستخدم React Router

const Sidebar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation(); // لتحديد الصفحة النشطة
  const [isHovered, setIsHovered] = useState(false); // لتتبع حالة التمرير

  return (
    <aside
      className={`fixed h-screen w-64 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      } shadow-lg transition-colors duration-300`}
    >
      <div className="p-4">
        {/* اسم الموقع */}
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
        >
          BlueShield
        </Link>

        {/* قائمة التنقل */}
        <nav className="mt-8">
          <ul className="space-y-2">
            {[
              { path: "/", icon: <FaHome />, label: "الرئيسية" },
              { path: "/services", icon: <FaCogs />, label: "الخدمات" },
              { path: "/profile", icon: <FaUser />, label: "حسابي" },
            ].map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-2 p-2 rounded transition-colors ${
                    location.pathname === item.path
                      ? "bg-blue-500 text-white"
                      : isDarkMode
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {location.pathname === item.path && (
                    <FaChevronRight className="ml-auto" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* زر تبديل الوضع الليلي */}
        <div className="mt-8">
          <button
            onClick={toggleTheme}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`flex items-center space-x-2 p-2 w-full rounded transition-colors ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
            }`}
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
            <span>{isDarkMode ? "الوضع النهاري" : "الوضع الليلي"}</span>
            {isHovered && (
              <span className="ml-auto text-sm text-gray-500">
                {isDarkMode ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
              </span>
            )}
          </button>
        </div>

        {/* زر تسجيل الخروج (إذا كان المستخدم مسجل الدخول) */}
        <div className="mt-8">
          <button
            onClick={() => {
              // قم بتنفيذ دالة تسجيل الخروج هنا
              alert("تم تسجيل الخروج بنجاح!");
            }}
            className={`flex items-center space-x-2 p-2 w-full rounded transition-colors ${
              isDarkMode
                ? "hover:bg-red-600 hover:text-white"
                : "hover:bg-red-500 hover:text-white"
            }`}
          >
            <FaSignOutAlt />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
