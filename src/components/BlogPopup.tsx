import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, ArrowRight, Sparkles, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { normalizeImageUrl, isValidImageUrl, stripHtmlTags } from "../utils/api";
import Loader from './Loader';

// ── Orb ───────────────────────────────────────────────────────────────────────
function Orb({ style, color, size, dur, delay }) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl pointer-events-none"
      style={{ width: size, height: size, background: color, ...style }}
      animate={{ scale: [1, 1.3, 1], opacity: [0.12, 0.28, 0.12] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ── Particle ──────────────────────────────────────────────────────────────────
function Particle({ x, y, size, accent, delay, dur }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: accent }}
      animate={{ y: [0, -20, 0], opacity: [0, 0.5, 0], scale: [0.5, 1.2, 0.5] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}





// ── Avatar ────────────────────────────────────────────────────────────────────
function AuthorAvatar({ author, profilePic }) {
  const [imgErr, setImgErr] = useState(false);
  const initials = author?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "AR";

  if (isValidImageUrl(profilePic) && !imgErr) {
    return (
      <img
        src={normalizeImageUrl(profilePic)}
        alt={author}
        onError={() => setImgErr(true)}
        className="w-8 h-8 rounded-full object-cover"
        style={{ border: "2px solid rgba(255,255,255,0.15)" }}
      />
    );
  }
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", fontFamily: "'Sora', sans-serif" }}>
      {initials}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function BlogPopup({ isOpen, onClose }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) fetchLatest();
  }, [isOpen]);

  const fetchLatest = async () => {
    try {
      setLoading(true);
      setError(null);
      const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const res = await fetch(`${API}/api/blog/latest`);
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      if (data.success && data.blog) setBlog(data.blog);
      else setError("No blog posts available");
    } catch {
      setError("Failed to load latest blog post");
    } finally {
      setLoading(false);
    }
  };

  const handleRead = () => {
    if (blog) { navigate(`/blog/${blog.slug}`); onClose(); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const particles = [
    { x: 8,  y: 15, size: 3, accent: "#38bdf8", delay: 0,   dur: 3.2 },
    { x: 88, y: 20, size: 2, accent: "#c084fc", delay: 0.8, dur: 4   },
    { x: 15, y: 78, size: 3, accent: "#4ade80", delay: 1.4, dur: 3.5 },
    { x: 85, y: 72, size: 2, accent: "#fb923c", delay: 0.3, dur: 4.2 },
    { x: 50, y: 5,  size: 2, accent: "#f472b6", delay: 1.8, dur: 3   },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backdropFilter: "blur(12px)", background: "rgba(2,2,9,0.82)" }}
            onClick={onClose}
          >
            {/* Background orbs in backdrop */}
            <Orb style={{ top: "15%", left: "15%" }}   color="radial-gradient(circle,rgba(59,130,246,0.35),transparent 70%)"  size={320} dur={8}  delay={0} />
            <Orb style={{ bottom: "15%", right: "15%" }} color="radial-gradient(circle,rgba(139,92,246,0.28),transparent 70%)" size={280} dur={11} delay={1.5} />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 60 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="relative w-full max-w-lg overflow-hidden"
              style={{ borderRadius: "1.75rem" }}
              onClick={(e) => e.stopPropagation()}
            >
              <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;700;800;900&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');`}</style>

              {/* Animated glow border */}
              <motion.div
                className="absolute -inset-px pointer-events-none"
                style={{ borderRadius: "1.75rem" }}
                animate={{ background: ["linear-gradient(135deg,#3b82f6,#8b5cf6,#06b6d4)", "linear-gradient(225deg,#8b5cf6,#06b6d4,#3b82f6)", "linear-gradient(315deg,#06b6d4,#3b82f6,#8b5cf6)"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                style={{ opacity: 0.6 }}
              />

              {/* Outer glow */}
              <div className="absolute pointer-events-none" style={{ inset: -20, borderRadius: "2rem", boxShadow: "0 0 80px rgba(99,102,241,0.3)", zIndex: -1 }} />

              <div className="relative overflow-hidden" style={{ background: "rgb(10,11,22)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "1.75rem" }}>

                {/* Particles inside modal */}
                {particles.map((p, i) => <Particle key={i} {...p} />)}

                {/* Rainbow top strip */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  animate={{ background: ["linear-gradient(90deg,#3b82f6,#8b5cf6,#06b6d4,#4ade80)", "linear-gradient(90deg,#8b5cf6,#06b6d4,#4ade80,#3b82f6)", "linear-gradient(90deg,#06b6d4,#4ade80,#3b82f6,#8b5cf6)"] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                />

                {/* BG grid */}
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />

                {/* BG radial glow */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(99,102,241,0.09), transparent 70%)" }} />

                {/* ── Header ── */}
                <div className="relative z-10 px-7 pt-7 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(129,140,248,0.14)", border: "1px solid rgba(129,140,248,0.25)" }}>
                        <Sparkles className="w-4 h-4" style={{ color: "#818cf8" }} strokeWidth={1.8} />
                      </div>
                      <div>
                        <div className="text-xs font-bold tracking-widest uppercase" style={{ fontFamily: "'Space Mono', monospace", color: "#818cf8" }}>Latest Post</div>
                        <h2 className="font-black text-white leading-tight" style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.1rem", letterSpacing: "-0.04em" }}>Stay Updated</h2>
                      </div>
                    </div>

                    {/* Close button */}
                    <motion.button
                      onClick={onClose}
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer" }}
                      whileHover={{ background: "rgba(255,255,255,0.1)", scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="w-4 h-4" style={{ color: "rgba(255,255,255,0.55)" }} strokeWidth={2} />
                    </motion.button>
                  </div>
                </div>

                {/* ── Body ── */}
                <div className="relative z-10 px-7 py-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 120px)" }}>
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <Loader />
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)" }}>
                        <X className="w-7 h-7" style={{ color: "#f87171" }} />
                      </div>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(248,113,113,0.8)", fontSize: "0.9rem" }}>{error}</p>
                      <motion.button
                        onClick={fetchLatest}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                        style={{ fontFamily: "'Sora', sans-serif", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", border: "none", cursor: "pointer" }}
                        whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Try Again
                      </motion.button>
                    </div>
                  ) : blog ? (
                    <div className="space-y-5">

                      {/* Blog image */}
                      <div className="relative overflow-hidden" style={{ borderRadius: "1rem" }}>
                        <motion.img
                          src={normalizeImageUrl(blog.image)}
                          alt={blog.title}
                          className="w-full object-cover"
                          style={{ height: 200 }}
                          whileHover={{ scale: 1.04 }}
                          transition={{ duration: 0.4 }}
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top,rgba(10,11,22,0.7),transparent 50%)" }} />

                        {/* Category pill */}
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1.5 text-xs font-black rounded-full" style={{ fontFamily: "'Space Mono', monospace", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", color: "#fff", letterSpacing: "0.05em" }}>
                            {blog.category}
                          </span>
                        </div>

                        {/* Read time pill */}
                        <div className="absolute bottom-3 right-3">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: "rgba(10,11,22,0.75)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
                            <Clock className="w-3 h-3" style={{ color: "rgba(255,255,255,0.55)" }} />
                            <span className="text-xs" style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.55)" }}>{blog.readTime}</span>
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <div>
                        <h3 className="font-black text-white leading-tight mb-2" style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.15rem", letterSpacing: "-0.03em" }}>
                          {blog.title}
                        </h3>
                        <p className="text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.38)", fontWeight: 300, lineHeight: 1.75, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
                          {stripHtmlTags(blog.excerpt)}
                        </p>
                      </div>

                      {/* Divider */}
                      <div className="h-px" style={{ background: "linear-gradient(90deg,rgba(99,102,241,0.3),transparent)" }} />

                      {/* Author + date */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <AuthorAvatar author={blog.author} profilePic={blog.authorProfilePic} />
                          <span className="text-sm font-bold" style={{ fontFamily: "'Sora', sans-serif", color: "rgba(255,255,255,0.65)", letterSpacing: "-0.01em" }}>{blog.author}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.3)" }} />
                          <span className="text-xs" style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.3)" }}>{formatDate(blog.publishedAt)}</span>
                        </div>
                      </div>

                      {/* CTA button */}
                      <motion.button
                        onClick={handleRead}
                        className="relative w-full py-4 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2.5 overflow-hidden"
                        style={{ fontFamily: "'Sora', sans-serif", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", border: "none", cursor: "pointer" }}
                        whileHover={{ scale: 1.015, boxShadow: "0 0 40px rgba(99,102,241,0.5)" }}
                        whileTap={{ scale: 0.985 }}
                      >
                        {/* Shimmer sweep */}
                        <motion.div
                          className="absolute inset-0"
                          style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)" }}
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.55 }}
                        />
                        <span className="relative z-10">Read Full Article</span>
                        <motion.div className="relative z-10" whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400 }}>
                          <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                        </motion.div>
                      </motion.button>

                      {/* Dismiss */}
                      <button
                        onClick={onClose}
                        className="w-full text-xs text-center"
                        style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.2)", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.04em" }}
                      >
                        Maybe later
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}