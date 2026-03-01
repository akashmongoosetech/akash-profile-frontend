import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Gauge, Activity, GitBranch, LucideIcon } from "lucide-react";

interface Metric {
  label: string;
  value: string;
  numericValue: number | null;
  note: string;
  icon: LucideIcon;
  accent: string;
  gradient: string;
  glow: string;
  tag: string;
  barValue: number;
  detail: string;
  sparkData: number[];
}

const reliabilityMetrics = [
  {
    label: "Avg Lighthouse Performance",
    value: "92+",
    numericValue: 92,
    note: "Across recent production builds",
    icon: Gauge,
    accent: "#38bdf8",
    gradient: "linear-gradient(135deg,#06b6d4,#3b82f6)",
    glow: "rgba(56,189,248,0.25)",
    tag: "PERFORMANCE",
    barValue: 92,
    detail: "Optimized bundles, lazy loading, CDN delivery, and Core Web Vitals tuning on every build.",
    sparkData: [70, 75, 78, 82, 85, 88, 90, 91, 92, 92],
  },
  {
    label: "API Success Rate",
    value: "99.3%",
    numericValue: 99.3,
    note: "Measured on stable deployments",
    icon: Activity,
    accent: "#4ade80",
    gradient: "linear-gradient(135deg,#10b981,#84cc16)",
    glow: "rgba(74,222,128,0.25)",
    tag: "RELIABILITY",
    barValue: 99.3,
    detail: "Resilient error handling, circuit breakers, retries, and real-time uptime monitoring across all APIs.",
    sparkData: [96, 97, 98, 98.5, 99, 99.1, 99.2, 99.3, 99.3, 99.3],
  },
  {
    label: "Release Frequency",
    value: "Weekly",
    numericValue: null,
    note: "Small, low-risk incremental updates",
    icon: GitBranch,
    accent: "#c084fc",
    gradient: "linear-gradient(135deg,#8b5cf6,#a855f7)",
    glow: "rgba(192,132,252,0.25)",
    tag: "VELOCITY",
    barValue: 85,
    detail: "Feature flags, staged rollouts, and automated CI/CD pipelines ensure zero-downtime deploys every week.",
    sparkData: [40, 50, 55, 60, 65, 70, 75, 80, 82, 85],
  },
];

// ── Animated counter ──────────────────────────────────────────────────────────
function useCounter(target: number | null, inView: boolean, delay = 0) {
  const [val, setVal] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (!inView || done.current || target === null) return;
    done.current = true;
    setTimeout(() => {
      const dur = 1600;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / dur, 1);
        const e = 1 - Math.pow(1 - t, 4);
        setVal(parseFloat((e * target).toFixed(1)));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay * 1000);
  }, [inView, target, delay]);
  return val;
}

// ── Mini sparkline ────────────────────────────────────────────────────────────
function Sparkline({ data, accent, inView, delay }: { data: number[]; accent: string; inView: boolean; delay: number }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setProgress(1), delay * 1000 + 600);
    return () => clearTimeout(t);
  }, [inView, delay]);

  const w = 120, h = 36;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pts = data.map((v: number, i: number) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min + 0.0001)) * (h - 4) - 2;
    return `${x},${y}`;
  });
  const polyline = pts.join(" ");

  return (
    <svg width={w} height={h} className="overflow-visible">
      <defs>
        <linearGradient id={`sg-${accent.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.3" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
        <clipPath id={`cp-${accent.replace("#", "")}`}>
          <motion.rect
            x="0" y="0" height={h + 4}
            initial={{ width: 0 }}
            animate={{ width: progress * w }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </clipPath>
      </defs>
      {/* Area fill */}
      <polygon
        points={`0,${h} ${polyline} ${w},${h}`}
        fill={`url(#sg-${accent.replace("#", "")})`}
        clipPath={`url(#cp-${accent.replace("#", "")})`}
      />
      {/* Line */}
      <polyline
        points={polyline}
        fill="none"
        stroke={accent}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        clipPath={`url(#cp-${accent.replace("#", "")})`}
        style={{ filter: `drop-shadow(0 0 3px ${accent})` }}
      />
      {/* End dot */}
      <motion.circle
        cx={pts[pts.length - 1].split(",")[0]}
        cy={pts[pts.length - 1].split(",")[1]}
        r="3"
        fill={accent}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: progress, scale: progress }}
        transition={{ delay: delay + 1.5, duration: 0.3 }}
        style={{ filter: `drop-shadow(0 0 5px ${accent})` }}
      />
    </svg>
  );
}

// ── Gauge arc (for Lighthouse card) ──────────────────────────────────────────
function GaugeArc({ value, accent, inView, delay }: { value: number; accent: string; inView: boolean; delay: number }) {
  const r = 48, stroke = 6;
  const circ = Math.PI * r; // half circle
  const [offset, setOffset] = useState(circ);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setOffset(circ - (value / 100) * circ), delay * 1000 + 300);
    return () => clearTimeout(t);
  }, [inView, value, circ, delay]);

  return (
    <svg width="110" height="60" viewBox="0 0 110 60">
      <defs>
        <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.4" />
          <stop offset="100%" stopColor={accent} />
        </linearGradient>
      </defs>
      {/* Track */}
      <path
        d="M 7 55 A 48 48 0 0 1 103 55"
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      {/* Fill */}
      <motion.path
        d="M 7 55 A 48 48 0 0 1 103 55"
        fill="none"
        stroke="url(#gauge-grad)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        animate={{ strokeDashoffset: offset }}
        initial={{ strokeDashoffset: circ }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ filter: `drop-shadow(0 0 5px ${accent})` }}
      />
    </svg>
  );
}

// ── Horizontal bar (for API rate card) ───────────────────────────────────────
function ApiBar({ value, accent, gradient, inView, delay }: { value: number; accent: string; gradient: string; inView: boolean; delay: number }) {
  return (
    <div className="space-y-1.5 w-full">
      {["Success", "Cached", "Retried"].map((label, i) => {
        const barVals = [value, 0.4, 0.3];
        return (
          <div key={label} className="flex items-center gap-2">
            <span
              className="text-xs w-12 flex-shrink-0"
              style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.25)", fontSize: "0.6rem" }}
            >
              {label}
            </span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: i === 0 ? gradient : `${accent}50` }}
                initial={{ width: "0%" }}
                animate={inView ? { width: `${barVals[i]}%` } : {}}
                transition={{ delay: delay + i * 0.12 + 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Weekly deploy dots ────────────────────────────────────────────────────────
function DeployDots({ accent, inView, delay }: { accent: string; inView: boolean; delay: number }) {
  const weeks = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];
  return (
    <div className="flex items-end gap-2 w-full">
      {weeks.map((w: string, i: number) => (
        <div key={w} className="flex flex-col items-center gap-1 flex-1">
          <motion.div
            className="w-full rounded-sm"
            style={{
              background: i < 7 ? accent : `${accent}30`,
              boxShadow: i < 7 ? `0 0 6px ${accent}60` : "none",
              height: [18, 24, 20, 28, 22, 26, 24, 14][i],
              borderRadius: 3,
              transformOrigin: "bottom",
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={inView ? { scaleY: 1, opacity: 1 } : {}}
            transition={{ delay: delay + i * 0.09 + 0.4, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
          <span className="text-xs" style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.15)", fontSize: "0.5rem" }}>
            {w}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Single metric card ────────────────────────────────────────────────────────
function MetricCard({ metric, index, inView }: { metric: Metric; index: number; inView: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const count = useCounter(metric.numericValue, inView, index * 0.14);
  const Icon = metric.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setMousePos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  const displayValue = metric.numericValue === null
    ? metric.value
    : metric.label.includes("Success")
    ? `${count}%`
    : `${Math.floor(count)}+`;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 55, scale: 0.93 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.14, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={() => setExpanded((v) => !v)}
      className="relative cursor-pointer"
      style={{ perspective: 900 }}
    >
      {/* Outer glow border */}
      <motion.div
        className="absolute -inset-px rounded-3xl pointer-events-none"
        style={{ background: metric.gradient }}
        animate={{ opacity: hovered ? 0.7 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Mouse spotlight */}
      {hovered && (
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none z-0"
          style={{
            background: `radial-gradient(220px circle at ${mousePos.x}% ${mousePos.y}%, ${metric.glow}, transparent 70%)`,
          }}
        />
      )}

      {/* Outer shadow */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        animate={{
          boxShadow: hovered ? `0 24px 70px ${metric.accent}22, 0 0 0 1px ${metric.accent}18` : "none",
        }}
        transition={{ duration: 0.35 }}
      />

      <motion.div
        className="relative rounded-3xl overflow-hidden"
        style={{ background: "rgb(10,11,22)", border: "1px solid rgba(255,255,255,0.06)" }}
        animate={{ rotateX: hovered ? -2 : 0, rotateY: hovered ? 2 : 0, y: hovered ? -5 : 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
      >
        {/* Top strip */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: metric.gradient, boxShadow: hovered ? `0 0 12px ${metric.accent}` : "none" }}
          animate={{ scaleX: hovered ? 1 : 0.2, opacity: hovered ? 1 : 0.4 }}
          transition={{ duration: 0.4 }}
        />

        {/* BG grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(${metric.accent} 1px,transparent 1px),linear-gradient(90deg,${metric.accent} 1px,transparent 1px)`,
            backgroundSize: "28px 28px",
            opacity: 0.03,
          }}
        />

        {/* Corner glow */}
        <motion.div
          className="absolute top-0 right-0 w-36 h-36 rounded-bl-full pointer-events-none"
          style={{ background: metric.gradient, opacity: 0.06 }}
          animate={{ scale: hovered ? 1.4 : 1, opacity: hovered ? 0.1 : 0.06 }}
          transition={{ duration: 0.5 }}
        />

        <div className="relative z-10 p-7 flex flex-col gap-5">
          {/* Tag + Icon row */}
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
              style={{
                fontFamily: "'Space Mono', monospace",
                background: `${metric.accent}14`,
                border: `1px solid ${metric.accent}28`,
                color: metric.accent,
              }}
            >
              {metric.tag}
            </span>

            <motion.div
              className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{ background: metric.gradient }}
              animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 8 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Icon className="w-5 h-5 text-white" strokeWidth={1.8} />
            </motion.div>
          </div>

          {/* Big value */}
          <div>
            <motion.div
              className="font-black leading-none mb-1"
              style={hovered ? {
                fontFamily: "'Sora', sans-serif",
                fontSize: "clamp(2.8rem, 4vw, 3.8rem)",
                letterSpacing: "-0.06em",
                lineHeight: 1,
                background: metric.gradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              } : {
                fontFamily: "'Sora', sans-serif",
                fontSize: "clamp(2.8rem, 4vw, 3.8rem)",
                letterSpacing: "-0.06em",
                lineHeight: 1,
                color: "#ffffff",
                WebkitTextFillColor: "#ffffff",
              }}
            >
              {displayValue}
            </motion.div>

            <p
              className="text-sm font-semibold"
              style={{
                fontFamily: "'Sora', sans-serif",
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "-0.01em",
              }}
            >
              {metric.label}
            </p>
          </div>

          {/* Visualizer — unique per card */}
          <div className="w-full">
            {index === 0 && (
              <div className="flex flex-col items-center gap-1">
                <GaugeArc value={metric.barValue} accent={metric.accent} inView={inView} delay={index * 0.14} />
                <Sparkline data={metric.sparkData} accent={metric.accent} inView={inView} delay={index * 0.14} />
              </div>
            )}
            {index === 1 && (
              <ApiBar value={metric.barValue} accent={metric.accent} gradient={metric.gradient} inView={inView} delay={index * 0.14} />
            )}
            {index === 2 && (
              <DeployDots accent={metric.accent} inView={inView} delay={index * 0.14} />
            )}
          </div>

          {/* Divider */}
          <motion.div
            className="h-px"
            style={{ background: `linear-gradient(90deg,${metric.accent}45,transparent)` }}
            animate={{ opacity: hovered ? 1 : 0.35 }}
          />

          {/* Note + expand detail */}
          <div>
            <p
              className="text-xs leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.32)", fontWeight: 300 }}
            >
              {metric.note}
            </p>

            <AnimatePresence>
              {(hovered || expanded) && (
                <motion.p
                  initial={{ height: 0, opacity: 0, marginTop: 0 }}
                  animate={{ height: "auto", opacity: 1, marginTop: 8 }}
                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-xs overflow-hidden"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: metric.accent, lineHeight: 1.65, opacity: 0.85 }}
                >
                  {metric.detail}
                </motion.p>
              )}
            </AnimatePresence>
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
      animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.2, 0.08] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function PerformanceSection() {
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

      <Orb style={{ top: "-8%", left: "-5%" }}    color="radial-gradient(circle,rgba(56,189,248,0.3),transparent 70%)"   size={500} dur={9}  delay={0} />
      <Orb style={{ bottom: "-10%", right: "-5%" }} color="radial-gradient(circle,rgba(139,92,246,0.25),transparent 70%)"  size={440} dur={12} delay={2} />
      <Orb style={{ top: "40%", left: "42%" }}    color="radial-gradient(circle,rgba(74,222,128,0.15),transparent 70%)"   size={300} dur={14} delay={1} />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(99,102,241,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.035) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Scan line */}
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
              Engineering Quality
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-indigo-500" />
          </motion.div>

          <h2
            className="font-black leading-tight mb-5"
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "clamp(2.5rem,5vw,4rem)",
              letterSpacing: "-0.04em",
              background: "linear-gradient(135deg,#fff 30%,rgba(255,255,255,0.4) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Performance & Reliability
          </h2>

          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.38)", fontWeight: 300, lineHeight: 1.8 }}
          >
            Engineering quality benchmarks that keep every user experience
            fast, dependable, and production-proven. Hover to explore details.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {reliabilityMetrics.map((metric, i) => (
            <MetricCard key={metric.label} metric={metric} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}