import React from 'react';
import UserNavBar from '../components/User/UserNavbar';
import Footer from '../components/Footer';
import { useTheme } from '../contexts/ThemeContext';

const UsersLayout = ({ children }) => {
  const { isDarkMode } = useTheme();

  const layoutBg = isDarkMode
    ? 'bg-gray-900 text-white'
    : 'bg-gray-50 text-gray-900';

  return (
    <div
      className={`flex flex-col min-h-screen transition-colors duration-300 ${layoutBg}`}
    >
      <UserNavBar />
      <main className="flex-grow pt-20">{children}</main>
      <Footer />
    </div>
  );
};

export default UsersLayout;
