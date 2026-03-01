import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Server, Database, Globe, Cloud, Shield, Zap, ArrowDown, Activity, Layers, LucideIcon } from "lucide-react";

interface ArchitectureFlowItem {
  label: string;
  icon: LucideIcon;
  desc: string;
}

interface ArchitectureSnapshot {
  title: string;
  summary: string;
  accent: string;
  gradient: string;
  glow: string;
  icon: LucideIcon;
  tag: string;
  flow: ArchitectureFlowItem[];
}

const architectureSnapshots = [
  {
    title: "Healthcare Workflow System",
    summary: "Secure patient data flow with role-based access and automated PDF outputs.",
    accent: "#38bdf8",
    gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)",
    glow: "rgba(56,189,248,0.22)",
    icon: Shield,
    tag: "HIPAA-Grade",
    flow: [
      { label: "React Client",          icon: Globe,    desc: "Role-based UI, responsive dashboard" },
      { label: "Node API Gateway",      icon: Server,   desc: "JWT auth, request routing, rate limiting" },
      { label: "MongoDB + Redis",        icon: Database, desc: "Patient records, session caching" },
      { label: "AWS S3 + Backups",       icon: Cloud,    desc: "Encrypted PDF storage, automated backups" },
    ],
  },
  {
    title: "High-Traffic Booking Platform",
    summary: "Designed for peak-hour spikes with cache-first reads and resilient queue processing.",
    accent: "#c084fc",
    gradient: "linear-gradient(135deg,#8b5cf6,#a855f7)",
    glow: "rgba(192,132,252,0.22)",
    icon: Zap,
    tag: "10k+ req/min",
    flow: [
      { label: "Next.js Frontend",       icon: Globe,    desc: "SSR, ISR, edge-optimized delivery" },
      { label: "API Gateway + Services", icon: Server,   desc: "Load balanced microservices mesh" },
      { label: "PostgreSQL + Queue",      icon: Database, desc: "ACID transactions, async job workers" },
      { label: "CDN + Cloud Monitor",    icon: Cloud,    desc: "99.9% uptime SLA, real-time alerts" },
    ],
  },
  {
    title: "Analytics-Driven Business Portal",
    summary: "Real-time metrics pipeline with event tracking and actionable dashboards.",
    accent: "#4ade80",
    gradient: "linear-gradient(135deg,#10b981,#84cc16)",
    glow: "rgba(74,222,128,0.22)",
    icon: Activity,
    tag: "Real-Time",
    flow: [
      { label: "React Admin Panel",      icon: Layers,   desc: "Custom charts, filterable reports" },
      { label: "Express REST API",       icon: Server,   desc: "Aggregation pipelines, webhooks" },
      { label: "MongoDB Aggregations",   icon: Database, desc: "Time-series analytics, indexing" },
      { label: "Cron + Scheduled Jobs",  icon: Cloud,    desc: "Automated reports, email digests" },
    ],
  },
];

// ── Animated connector line between layers ────────────────────────────────────
function Connector({ accent, inView, delay }: { accent: string; inView: boolean; delay: number }) {
  return (
    <div className="flex flex-col items-center my-0.5 relative" style={{ height: 28 }}>
      {/* Static line */}
      <div className="w-px flex-1" style={{ background: `${accent}25` }} />
      {/* Travelling dot */}
      <motion.div
        className="absolute w-1.5 h-1.5 rounded-full"
        style={{
          background: accent,
          boxShadow: `0 0 6px ${accent}`,
          left: "50%",
          transform: "translateX(-50%)",
          top: 0,
        }}
        animate={inView ? { top: ["0%", "100%"], opacity: [0, 1, 0] } : {}}
        transition={{ duration: 1.2, delay, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
      />
      <ArrowDown className="w-3 h-3 absolute -bottom-1.5" style={{ color: `${accent}50` }} strokeWidth={1.5} />
    </div>
  );
}

// ── Single layer row ──────────────────────────────────────────────────────────
function LayerRow({ layer, index, accent, gradient, inView, cardDelay }: { layer: { label: string; icon: LucideIcon; desc: string }; index: number; accent: string; gradient: string; inView: boolean; cardDelay: number }) {
  const [hovered, setHovered] = useState(false);
  const Icon = layer.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: cardDelay + index * 0.1 + 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-3 relative"
    >
      {/* Glow border */}
      <motion.div
        className="absolute -inset-px rounded-xl pointer-events-none"
        style={{ background: gradient }}
        animate={{ opacity: hovered ? 0.5 : 0 }}
        transition={{ duration: 0.25 }}
      />

      <motion.div
        className="relative flex items-center gap-3 w-full rounded-xl px-3 py-2.5"
        style={{
          background: "rgb(11,12,24)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
        animate={{ x: hovered ? 4 : 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
      >
        {/* Step number */}
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
          style={{
            background: hovered ? gradient : "rgba(255,255,255,0.05)",
            border: hovered ? "none" : `1px solid ${accent}30`,
            color: hovered ? "#fff" : accent,
            fontFamily: "'Sora', sans-serif",
            transition: "background 0.25s",
          }}
        >
          {index + 1}
        </div>

        {/* Icon */}
        <motion.div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${accent}12`, border: `1px solid ${accent}20` }}
          animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 5 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: accent }} strokeWidth={1.8} />
        </motion.div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div
            className="font-bold text-sm leading-tight truncate"
            style={{
              fontFamily: "'Sora', sans-serif",
              color: hovered ? "#fff" : "rgba(255,255,255,0.8)",
              letterSpacing: "-0.02em",
              transition: "color 0.25s",
            }}
          >
            {layer.label}
          </div>
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <div
                  className="text-xs mt-0.5"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "rgba(255,255,255,0.38)",
                    lineHeight: 1.5,
                  }}
                >
                  {layer.desc}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Architecture card ─────────────────────────────────────────────────────────
function ArchCard({ snapshot, index, inView }: { snapshot: ArchitectureSnapshot; index: number; inView: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = snapshot.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setMousePos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  const cardDelay = index * 0.14;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 55, scale: 0.94 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: cardDelay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className="relative flex flex-col"
      style={{ perspective: 900 }}
    >
      {/* Outer glow border */}
      <motion.div
        className="absolute -inset-px rounded-3xl pointer-events-none"
        style={{ background: snapshot.gradient }}
        animate={{ opacity: hovered ? 0.65 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Mouse spotlight */}
      {hovered && (
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none z-0"
          style={{
            background: `radial-gradient(200px circle at ${mousePos.x}% ${mousePos.y}%, ${snapshot.glow}, transparent 70%)`,
          }}
        />
      )}

      <motion.div
        className="relative rounded-3xl overflow-hidden flex flex-col h-full"
        style={{ background: "rgb(10,11,22)", border: "1px solid rgba(255,255,255,0.06)" }}
        animate={{ rotateX: hovered ? -2 : 0, rotateY: hovered ? 2 : 0, y: hovered ? -4 : 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
      >
        {/* Animated top strip */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: snapshot.gradient, boxShadow: hovered ? `0 0 10px ${snapshot.accent}` : "none" }}
          animate={{ scaleX: hovered ? 1 : 0.25, opacity: hovered ? 1 : 0.45 }}
          transition={{ duration: 0.4 }}
        />

        {/* BG grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(${snapshot.accent} 1px,transparent 1px),linear-gradient(90deg,${snapshot.accent} 1px,transparent 1px)`,
            backgroundSize: "32px 32px",
            opacity: 0.035,
          }}
        />

        {/* Corner glow */}
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 pointer-events-none rounded-bl-full"
          style={{ background: snapshot.gradient, opacity: 0.06 }}
          animate={{ scale: hovered ? 1.5 : 1, opacity: hovered ? 0.1 : 0.06 }}
          transition={{ duration: 0.5 }}
        />

        <div className="relative z-10 p-7 flex flex-col gap-5 h-full">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              {/* Icon badge */}
              <motion.div
                className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: snapshot.gradient }}
                animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 8 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Icon className="w-5 h-5 text-white" strokeWidth={1.8} />
              </motion.div>

              <div>
                <h3
                  className="font-black text-white leading-tight mb-1"
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: "1.05rem",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {snapshot.title}
                </h3>
                <span
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    background: `${snapshot.accent}15`,
                    border: `1px solid ${snapshot.accent}30`,
                    color: snapshot.accent,
                    letterSpacing: "0.04em",
                  }}
                >
                  {snapshot.tag}
                </span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "rgba(255,255,255,0.38)",
              fontSize: "0.88rem",
              lineHeight: 1.75,
              fontWeight: 300,
            }}
          >
            {snapshot.summary}
          </p>

          {/* Divider */}
          <motion.div
            className="h-px"
            style={{ background: `linear-gradient(90deg,${snapshot.accent}45,transparent)` }}
            animate={{ opacity: hovered ? 1 : 0.4 }}
          />

          {/* Flow layers */}
          <div className="flex flex-col flex-1">
            {snapshot.flow.map((layer: { label: string; icon: LucideIcon; desc: string }, fi: number) => (
              <div key={layer.label}>
                <LayerRow
                  layer={layer}
                  index={fi}
                  accent={snapshot.accent}
                  gradient={snapshot.gradient}
                  inView={inView}
                  cardDelay={cardDelay}
                />
                {fi < snapshot.flow.length - 1 && (
                  <div className="ml-4">
                    <Connector accent={snapshot.accent} inView={inView} delay={cardDelay + fi * 0.25 + 0.6} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Orb ───────────────────────────────────────────────────────────────────────
function Orb({ style, color, size, dur, delay }: { style?: React.CSSProperties; color: string; size: number; dur: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl pointer-events-none"
      style={{ width: size, height: size, background: color, ...style }}
      animate={{ scale: [1, 1.28, 1], opacity: [0.08, 0.2, 0.08] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ArchitectureSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative py-28 overflow-hidden"
      style={{ background: "#020209" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;700;800;900&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');
      `}</style>

      {/* Orbs */}
      <Orb style={{ top: "-8%", left: "-5%" }}   color="radial-gradient(circle,rgba(59,130,246,0.35),transparent 70%)"  size={500} dur={9}  delay={0} />
      <Orb style={{ bottom: "-10%", right: "-5%" }} color="radial-gradient(circle,rgba(139,92,246,0.28),transparent 70%)" size={440} dur={12} delay={2} />
      <Orb style={{ top: "35%", left: "40%" }}   color="radial-gradient(circle,rgba(16,185,129,0.15),transparent 70%)" size={300} dur={14} delay={1} />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(99,102,241,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.035) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Horizontal scan */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.35),transparent)" }}
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-6"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-indigo-500" />
            <span
              className="text-xs font-bold tracking-widest uppercase text-indigo-400"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              System Design
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-indigo-500" />
          </motion.div>

          <h2
            className="font-black leading-tight mb-5"
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              letterSpacing: "-0.04em",
              background: "linear-gradient(135deg,#fff 30%,rgba(255,255,255,0.4) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Architecture Snapshots
          </h2>

          <p
            className="text-lg max-w-2xl mx-auto"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "rgba(255,255,255,0.38)",
              fontWeight: 300,
              lineHeight: 1.8,
            }}
          >
            Technical blueprints showing how products are structured
            for scale, reliability, and speed — hover each layer for details.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          {architectureSnapshots.map((snapshot, i) => (
            <ArchCard key={snapshot.title} snapshot={snapshot} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}