import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ParticleBackground from './ParticleBackground';
import SmokeTrail from './SmokeTrail';
import BlogPopup from './BlogPopup';
import { useBlogPopup } from '../hooks/useBlogPopup';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isPopupOpen, closePopup } = useBlogPopup();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-gray-900 dark:via-blue-900 dark:to-gray-900 relative overflow-x-hidden">
      <SmokeTrail />
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10">
        {children ? children : <Outlet />}
      </main>
      <Footer />
      
      {/* Blog Popup */}
      <BlogPopup isOpen={isPopupOpen} onClose={closePopup} />
    </div>
  );
};

export default Layout;