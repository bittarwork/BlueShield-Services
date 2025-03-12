import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const NotMemberLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="">{children}</main>

      <Footer />
    </div>
  );
};

export default NotMemberLayout;
