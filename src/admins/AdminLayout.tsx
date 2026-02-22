import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Mail,
  Users,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  Settings,
  Shield,
  Bell
} from 'lucide-react';
import { removeAuthToken, isTokenExpired } from '../utils/api';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  // Check token expiration on mount and set up periodic checking
  useEffect(() => {
    const checkTokenExpiration = () => {
      if (isTokenExpired()) {
        // Token is expired, logout automatically
        removeAuthToken();
        navigate('/admin/login', { replace: true });
      }
    };

    // Check immediately on mount
    checkTokenExpiration();

    // Check every minute for token expiration
    const intervalId = setInterval(checkTokenExpiration, 60000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [navigate]);

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/admin/blog-management', label: 'Blog Management', icon: <BookOpen className="w-5 h-5" /> },
    { to: '/admin/contact-table', label: 'Contact Table', icon: <Mail className="w-5 h-5" /> },
    { to: '/admin/subscriber-table', label: 'Subscriber Table', icon: <Users className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    removeAuthToken();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-[#070B14] text-white overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`bg-[#0A0F1C]/90 backdrop-blur-2xl border-r border-white/5 shadow-[20px_0_40px_rgba(0,0,0,0.5)] flex flex-col h-screen fixed md:relative z-50 inset-y-0 left-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ width: isCollapsed ? '80px' : '280px' }}
      >
          {/* Logo Section */}
          <motion.div
            className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-700/50"
            animate={{ justifyContent: isCollapsed ? 'center' : 'space-between' }}
          >
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Admin Panel</h2>
                    <p className="text-xs text-slate-400">Portfolio Management</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {isCollapsed && (
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mx-auto">
                <Shield className="w-5 h-5 text-white" />
              </div>
            )}

            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white focus:outline-none p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Collapse Toggle - Desktop Only */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex absolute -right-3 top-20 w-6 h-6 bg-slate-700 border border-slate-600 rounded-full items-center justify-center text-slate-400 hover:text-white hover:bg-slate-600 transition-colors z-10"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden mt-2 px-3 pb-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 mb-2 text-sm font-medium rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
                    ? 'text-white shadow-[0_4px_20px_rgba(59,130,246,0.3)] ring-1 ring-white/10'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active State Background Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavBackground"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-blue-400/80"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span
                      className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                        }`}
                    >
                      {item.icon}
                    </span>
                    <AnimatePresence mode="wait">
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="relative z-10"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User Section */}
          <div className="flex-shrink-0 p-4 border-t border-slate-700/50">
            <div className={`flex items-center gap-3 mb-3 ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1"
                  >
                    <p className="text-sm font-medium text-white">Admin User</p>
                    <p className="text-xs text-slate-400">Administrator</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-slate-300 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 ${isCollapsed ? 'justify-center' : ''
                }`}
            >
              <LogOut className="w-5 h-5" />
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full bg-[#070B14]">
        {/* Header */}
        <header className="bg-[#0A0F1C]/80 backdrop-blur-2xl shadow-lg border-b border-white/5 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden text-slate-400 hover:text-white focus:outline-none p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-white hidden sm:block">Dashboard</h1>
                <p className="text-xs text-slate-400 hidden sm:block">Welcome back to your admin panel</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Notification Bell */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </motion.button>

              {/* Settings */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-transparent relative z-0">
          {/* Subtle global background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
