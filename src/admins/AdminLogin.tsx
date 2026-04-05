import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Loader from '../components/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  Terminal,
  Cpu,
  Globe,
  BarChart3,
  FileText,
  Users,
} from 'lucide-react';
import { setAuthToken } from '../utils/api';

/* ─── tiny floating stat card ──────────────────────────────────────────────── */
const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  delay: number;
}> = ({ icon, label, value, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: 'easeOut' }}
    className="flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl px-4 py-3 shadow-xl"
  >
    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/20 flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-white/40 text-[10px] uppercase tracking-widest leading-none mb-0.5">{label}</p>
      <p className="text-white font-semibold text-sm leading-none">{value}</p>
    </div>
  </motion.div>
);

/* ─── animated grid dot background ─────────────────────────────────────────── */
const GridBg: React.FC = () => (
  <div
    className="absolute inset-0 opacity-[0.06]"
    style={{
      backgroundImage: `radial-gradient(circle, #67e8f9 1px, transparent 1px)`,
      backgroundSize: '32px 32px',
    }}
  />
);

/* ─── main component ────────────────────────────────────────────────────────── */
const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setAuthToken(data.token);
        navigate('/admin');
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .font-body   { font-family: 'DM Sans', sans-serif; }
        .input-field {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-field:focus {
          outline: none;
          border-color: rgba(103,232,249,0.5);
          box-shadow: 0 0 0 3px rgba(103,232,249,0.08);
        }
        .input-field::placeholder { color: rgba(255,255,255,0.25); }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #67e8f9, #a78bfa, #67e8f9);
          background-size: 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        .float-slow  { animation: float 6s ease-in-out infinite; }
        .float-med   { animation: float 4s ease-in-out infinite 1s; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="font-body min-h-screen flex bg-[#060a14]">

        {/* ══════════════════════════════════════════
            LEFT PANEL — hero / visual side
        ══════════════════════════════════════════ */}
        <div className="hidden lg:flex lg:w-[55%] xl:w-[58%] relative flex-col overflow-hidden">
          {/* Deep space background layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#060a14] via-[#0a1628] to-[#060a14]" />
          <GridBg />

          {/* Glowing orbs */}
          <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[140px]" />
          <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-blue-500/8 blur-[90px]" />

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">

            {/* Logo / brand */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Terminal className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-white text-lg tracking-tight">Akash</span>
            </motion.div>

            {/* Hero image — dashboard mockup */}
            <div className="flex-1 flex items-center justify-center my-8 relative">

              {/* Main "screen" mockup */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-lg"
              >
                {/* Browser chrome */}
                <div className="bg-[#0d1526]/80 border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden backdrop-blur-sm">
                  {/* Browser bar */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 bg-white/[0.02]">
                    <div className="w-3 h-3 rounded-full bg-red-400/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                    <div className="w-3 h-3 rounded-full bg-green-400/70" />
                    <div className="flex-1 mx-3 bg-white/5 rounded-md px-3 py-1 text-xs text-white/25 font-mono">
                      admin.akashraikwar.dev
                    </div>
                  </div>

                  {/* Dashboard preview */}
                  <div className="p-5 space-y-3">
                    {/* Stat row */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Posts', value: '48', color: 'from-cyan-500/20 to-cyan-600/10', accent: 'border-cyan-500/20' },
                        { label: 'Views', value: '12.4k', color: 'from-violet-500/20 to-violet-600/10', accent: 'border-violet-500/20' },
                        { label: 'Users', value: '284', color: 'from-emerald-500/20 to-emerald-600/10', accent: 'border-emerald-500/20' },
                      ].map((s) => (
                        <div key={s.label} className={`bg-gradient-to-br ${s.color} border ${s.accent} rounded-xl p-3`}>
                          <p className="text-white/40 text-[9px] uppercase tracking-wider">{s.label}</p>
                          <p className="text-white font-display font-bold text-lg mt-0.5">{s.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Fake chart bars */}
                    <div className="bg-white/[0.03] border border-white/8 rounded-xl p-3">
                      <p className="text-white/30 text-[9px] uppercase tracking-wider mb-3">Monthly Traffic</p>
                      <div className="flex items-end gap-1 h-16">
                        {[30, 55, 40, 70, 45, 80, 60, 90, 50, 75, 85, 65].map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ delay: 0.5 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
                            style={{ height: `${h}%`, originY: 1 }}
                            className="flex-1 rounded-sm bg-gradient-to-t from-cyan-500/60 to-cyan-400/20"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Blog post rows */}
                    {[
                      { title: 'Building scalable React apps', tag: 'React', pub: true },
                      { title: 'DevOps with Docker & K8s', tag: 'DevOps', pub: true },
                      { title: 'PostgreSQL performance tips', tag: 'Database', pub: false },
                    ].map((post, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        className="flex items-center gap-3 bg-white/[0.025] border border-white/8 rounded-xl px-3 py-2.5"
                      >
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500/30 to-cyan-500/20 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white/80 text-xs font-medium truncate">{post.title}</p>
                          <p className="text-white/30 text-[9px]">{post.tag}</p>
                        </div>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full border font-medium ${
                          post.pub
                            ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                            : 'text-slate-400 border-slate-500/30 bg-slate-500/10'
                        }`}>
                          {post.pub ? 'Live' : 'Draft'}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Floating stat cards */}
                <div className="absolute -left-14 top-[15%] float-slow">
                  <StatCard icon={<BarChart3 className="w-4 h-4 text-cyan-400" />} label="Avg. Read Time" value="4.2 min" delay={0.9} />
                </div>
                <div className="absolute -right-10 top-[55%] float-med">
                  <StatCard icon={<FileText className="w-4 h-4 text-violet-400" />} label="Published" value="48 Posts" delay={1.1} />
                </div>
                <div className="absolute -left-8 bottom-[-4%] float-slow" style={{ animationDelay: '2s' }}>
                  <StatCard icon={<Users className="w-4 h-4 text-emerald-400" />} label="Monthly Readers" value="12.4k" delay={1.3} />
                </div>
              </motion.div>
            </div>

            {/* Bottom copy */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="font-display font-bold text-3xl xl:text-4xl text-white leading-tight mb-3">
                Your content,<br />
                <span className="shimmer-text">fully in control.</span>
              </h2>
              <p className="text-white/35 text-sm leading-relaxed max-w-sm">
                Manage blog posts, track analytics, and publish with confidence — all from one streamlined dashboard.
              </p>

              {/* Trust badges */}
              <div className="flex items-center gap-6 mt-6">
                {[
                  { icon: <Cpu className="w-3.5 h-3.5" />, text: 'Encrypted sessions' },
                  { icon: <Globe className="w-3.5 h-3.5" />, text: 'Global CDN' },
                ].map((b) => (
                  <div key={b.text} className="flex items-center gap-1.5 text-white/30 text-xs">
                    {b.icon}
                    {b.text}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            RIGHT PANEL — login form
        ══════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#080c1a] to-[#060a14]" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(103,232,249,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(103,232,249,0.4) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
          {/* Glow top-right */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/6 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-violet-500/6 rounded-full blur-[90px]" />

          <div className="relative z-10 flex flex-col h-full px-6 sm:px-10 py-8">
            {/* Mobile brand */}
            <div className="flex items-center justify-between lg:justify-end mb-8 lg:mb-0">
              <div className="flex lg:hidden items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="font-display font-bold text-white text-base">Akash</span>
              </div>
              <Link
                to="/"
                className="flex items-center gap-1.5 text-white/35 hover:text-white/70 transition-colors text-sm group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                Back to site
              </Link>
            </div>

            {/* Form centred vertically */}
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-sm"
              >
                {/* Heading */}
                <div className="mb-8">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="text-cyan-400/80 text-xs font-medium uppercase tracking-[0.2em] mb-3"
                  >
                    Admin Access
                  </motion.p>
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="font-display font-bold text-3xl sm:text-4xl text-white leading-none mb-3"
                  >
                    Welcome back
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/35 text-sm"
                  >
                    Sign in to manage your blog and content.
                  </motion.p>
                </div>

                {/* Error banner */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-start gap-3 p-3.5 bg-red-500/8 border border-red-500/20 rounded-xl text-red-400">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span className="text-sm leading-snug">{error}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Username */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <label htmlFor="username" className="block text-xs font-medium text-white/40 uppercase tracking-widest mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-field w-full px-4 py-3.5 rounded-xl text-white text-sm"
                        placeholder="your_username"
                        required
                      />
                    </div>
                  </motion.div>

                  {/* Password */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.42 }}
                  >
                    <label htmlFor="password" className="block text-xs font-medium text-white/40 uppercase tracking-widest mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field w-full px-4 py-3.5 pr-12 rounded-xl text-white text-sm"
                        placeholder="••••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors p-1"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </motion.div>

                  {/* Submit */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="pt-2"
                  >
                    <motion.button
                      type="submit"
                      disabled={isLoading || !username || !password}
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      className="relative w-full py-3.5 rounded-xl font-display font-semibold text-sm overflow-hidden group disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                      style={{
                        background: 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)',
                      }}
                    >
                      {/* Shimmer overlay on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />

                      <span className="relative flex items-center justify-center gap-2 text-white">
                        {isLoading ? (
                          <Loader />
                        ) : (
                          'Sign In'
                        )}
                      </span>
                    </motion.button>
                  </motion.div>
                </form>

                {/* Divider */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-4 my-7"
                >
                  <div className="flex-1 h-px bg-white/8" />
                  <span className="text-white/20 text-xs">secured access</span>
                  <div className="flex-1 h-px bg-white/8" />
                </motion.div>

                {/* Info badges */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.65 }}
                  className="flex items-center justify-center gap-4 flex-wrap"
                >
                  {['JWT Auth', 'HTTPS Only', 'Session Encrypted'].map((badge) => (
                    <span key={badge} className="text-[10px] text-white/20 uppercase tracking-wider border border-white/8 rounded-full px-3 py-1">
                      {badge}
                    </span>
                  ))}
                </motion.div>
              </motion.div>
            </div>

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center text-white/15 text-xs mt-6"
            >
              © {new Date().getFullYear()} Akash Raikwar · All rights reserved
            </motion.p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;