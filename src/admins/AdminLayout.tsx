/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
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
  Bell,
  Calendar,
  Terminal,
  ChevronRight,
} from 'lucide-react';
import { removeAuthToken, isTokenExpired } from '../utils/api';

/* ─── nav config ─────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { to: '/admin',                  label: 'Dashboard',         icon: LayoutDashboard, end: true  },
  { to: '/admin/blog-management',  label: 'Blog Management',   icon: BookOpen,        end: false },
  { to: '/admin/event-management', label: 'Event Management',  icon: Calendar,        end: false },
  { to: '/admin/contact-table',    label: 'Contact Table',     icon: Mail,            end: false },
  { to: '/admin/subscriber-table', label: 'Subscriber Table',  icon: Users,           end: false },
];

/* ─── page title derived from route ─────────────────────────────────────── */
const useTitleFromPath = () => {
  const { pathname } = useLocation();
  const item = NAV_ITEMS.find((n) =>
    n.end ? pathname === n.to : pathname.startsWith(n.to)
  );
  return item?.label ?? 'Admin Panel';
};

/* ═══════════════════════════════════════════════════════════════════════════
   AdminLayout
═══════════════════════════════════════════════════════════════════════════ */
const AdminLayout: React.FC = () => {
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [collapsed,   setCollapsed]   = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate  = useNavigate();
  const pageTitle = useTitleFromPath();
  const mainRef   = useRef<HTMLDivElement>(null);

  /* close mobile sidebar on route change */
  const { pathname } = useLocation();
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  /* close mobile sidebar when screen goes wide */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* token expiry check */
  useEffect(() => {
    const check = () => {
      if (isTokenExpired()) { removeAuthToken(); navigate('/admin/login', { replace: true }); }
    };
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, [navigate]);

  /* scroll main back to top on route change */
  useEffect(() => { mainRef.current?.scrollTo(0, 0); }, [pathname]);

  const handleLogout = () => { removeAuthToken(); navigate('/admin/login'); };

  /* sidebar widths */
  const sidebarW     = collapsed ? 72  : 256;
  const sidebarWFull = collapsed ? 72  : 256;   // same; split for clarity

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .font-body    { font-family: 'DM Sans', sans-serif; }
        .nav-scrollbar::-webkit-scrollbar { width: 3px; }
        .nav-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .nav-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 99px; }
        .main-scrollbar::-webkit-scrollbar { width: 6px; }
        .main-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .main-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 99px; }
        .main-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.12); }
      `}</style>

      <div className="font-body flex h-screen bg-[#060a14] text-white overflow-hidden">

        {/* ── Mobile overlay ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* ══════════════════════════════════════════════════════════════════
            SIDEBAR
        ══════════════════════════════════════════════════════════════════ */}
        <aside
          className={`
            flex-shrink-0 fixed md:static inset-y-0 left-0 z-50
            flex flex-col h-full
            bg-[#080d1c] border-r border-white/[0.06]
            transition-all duration-300 ease-in-out
            ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
          style={{ width: sidebarWFull }}
          aria-label="Sidebar navigation"
        >
          {/* dot grid texture */}
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #67e8f9 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          {/* top glow */}
          <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />

          {/* ── Brand header ─────────────────────────────────────────────── */}
          <div className="relative flex items-center justify-between px-4 py-5 border-b border-white/[0.06] flex-shrink-0">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 flex-shrink-0 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <Terminal className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.div
                    key="brand-text"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    <p className="font-display font-bold text-white text-sm leading-tight">DevCMS</p>
                    <p className="text-white/25 text-[10px] leading-tight">Portfolio Admin</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Close on mobile */}
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1.5 text-white/30 hover:text-white transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── Collapse toggle (desktop) ─────────────────────────────────── */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="hidden md:flex absolute -right-3 top-[72px] w-6 h-6 bg-[#0f1629] border border-white/10 rounded-full items-center justify-center text-white/40 hover:text-white hover:border-white/25 transition-all z-10 shadow-lg"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft className={`w-3.5 h-3.5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
          </button>

          {/* ── Nav ──────────────────────────────────────────────────────── */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden nav-scrollbar px-3 py-4 space-y-0.5">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group overflow-hidden
                   ${isActive
                     ? 'text-white'
                     : 'text-white/35 hover:text-white/70 hover:bg-white/[0.04]'
                   }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* active pill bg */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500/15 to-blue-500/10 rounded-xl border border-cyan-500/20"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}

                    {/* left accent bar */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r-full" />
                    )}

                    <Icon
                      className={`w-4 h-4 flex-shrink-0 relative z-10 transition-colors ${isActive ? 'text-cyan-400' : 'text-white/35 group-hover:text-white/60'}`}
                    />

                    <AnimatePresence initial={false}>
                      {!collapsed && (
                        <motion.span
                          key="label"
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -6 }}
                          transition={{ duration: 0.2 }}
                          className="relative z-10 whitespace-nowrap"
                        >
                          {label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* tooltip when collapsed */}
                    {collapsed && (
                      <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#0f1629] border border-white/10 rounded-lg text-xs text-white/80 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-50">
                        {label}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* ── User + logout ─────────────────────────────────────────────── */}
          <div className="flex-shrink-0 border-t border-white/[0.06] p-3 space-y-1">
            {/* User pill */}
            <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden ${collapsed ? 'justify-center' : ''}`}>
              <div className="w-7 h-7 flex-shrink-0 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center font-display font-bold text-xs text-white shadow">
                A
              </div>
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.div
                    key="user-info"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden min-w-0"
                  >
                    <p className="text-xs font-medium text-white/80 leading-tight whitespace-nowrap">Akash Raikwar</p>
                    <p className="text-[10px] text-white/25 leading-tight whitespace-nowrap">Administrator</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Logout */}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-white/35 hover:text-red-400 hover:bg-red-500/8 transition-all duration-200 group ${collapsed ? 'justify-center' : ''}`}
            >
              <LogOut className="w-4 h-4 flex-shrink-0 group-hover:text-red-400 transition-colors" />
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    key="logout-label"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="whitespace-nowrap"
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>

              {/* tooltip when collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#0f1629] border border-white/10 rounded-lg text-xs text-red-400 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-50">
                  Logout
                </div>
              )}
            </button>
          </div>
        </aside>

        {/* ══════════════════════════════════════════════════════════════════
            MAIN AREA
        ══════════════════════════════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* ── Topbar ───────────────────────────────────────────────────── */}
          <header className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#080d1c]/80 backdrop-blur-xl border-b border-white/[0.06] sticky top-0 z-30">
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Breadcrumb / title */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-white/25 text-xs mb-0.5 hidden sm:flex">
                  <Shield className="w-3 h-3" />
                  <span>Admin</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-cyan-400/70">{pageTitle}</span>
                </div>
                <h1 className="font-display font-bold text-white text-base sm:text-lg leading-none truncate">
                  {pageTitle}
                </h1>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* Notification */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2.5 rounded-xl text-white/35 hover:text-white hover:bg-white/[0.06] transition-all"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-[#080d1c]" />
              </motion.button>

              {/* Settings */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-xl text-white/35 hover:text-white hover:bg-white/[0.06] transition-all"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4" />
              </motion.button>

              {/* Avatar */}
              <div className="ml-1 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center font-display font-bold text-xs text-white shadow-lg cursor-pointer">
                A
              </div>
            </div>
          </header>

          {/* ── Page content ─────────────────────────────────────────────── */}
          <main
            ref={mainRef}
            className="flex-1 overflow-y-auto main-scrollbar relative bg-[#060a14]"
          >
            {/* Ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/4 blur-[120px] rounded-full pointer-events-none" />

            {/* Subtle grid */}
            <div
              className="absolute inset-0 opacity-[0.018] pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(rgba(103,232,249,0.5) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(103,232,249,0.5) 1px, transparent 1px)`,
                backgroundSize: '60px 60px',
              }}
            />

            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto"
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>

      {/* ── Logout confirmation modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.45 }}
              className="bg-[#0d1526] border border-white/10 rounded-2xl p-6 shadow-2xl w-full max-w-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="font-display font-bold text-white text-center text-lg mb-1">Sign out?</h3>
              <p className="text-white/35 text-sm text-center mb-5">You'll need to log in again to access the admin panel.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white/60 hover:text-white text-sm font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/25 text-red-400 hover:text-red-300 text-sm font-medium transition-all"
                >
                  Sign out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminLayout;