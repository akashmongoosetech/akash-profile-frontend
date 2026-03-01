import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, Shield, Target, Rocket, LucideIcon } from "lucide-react";

interface Achievement {
  icon: LucideIcon;
  title: string;
  description: string;
  metric: string;
  accent: string;
  gradient: string;
  year: string;
  tag: string;
}

const achievements = [
  {
    icon: TrendingUp,
    title: "200% Performance Boost",
    description: "Optimized critical render paths, lazy-loaded assets, and tuned Core Web Vitals across all production builds.",
    metric: "200%",
    accent: "#38bdf8",
    gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)",
    year: "2024",
    tag: "Speed",
  },
  {
    icon: Shield,
    title: "Zero Security Issues",
    description: "Implemented end-to-end encryption, JWT hardening, rate limiting, and passed all penetration tests with zero findings.",
    metric: "0 CVEs",
    accent: "#4ade80",
    gradient: "linear-gradient(135deg,#10b981,#22c55e)",
    year: "2023–24",
    tag: "Security",
  },
  {
    icon: Target,
    title: "98% Client Satisfaction",
    description: "Consistently exceeded scope, delivered ahead of schedule, and maintained long-term relationships with every client.",
    metric: "98%",
    accent: "#c084fc",
    gradient: "linear-gradient(135deg,#8b5cf6,#a855f7)",
    year: "2022–24",
    tag: "Quality",
  },
  {
    icon: Rocket,
    title: "100% On-Time Delivery",
    description: "Every project shipped on or before deadline using milestone-driven sprints and transparent stakeholder communication.",
    metric: "100%",
    accent: "#fb923c",
    gradient: "linear-gradient(135deg,#f97316,#ef4444)",
    year: "2022–24",
    tag: "Delivery",
  },
];

function AchievementRow({ item, index, inView }: { item: Achievement; index: number; inView: boolean; }) {
  const [hovered, setHovered] = useState(false);
  const isEven = index % 2 === 0;
  const Icon = item.icon;
  const delay = index * 0.15;

  return (
    <div className="relative flex items-center gap-0">

      {/* ── LEFT SIDE ── */}
      <div className={`flex-1 flex ${isEven ? "justify-end pr-10" : "justify-start pl-10 order-3"}`}>
        <motion.div
          initial={{ opacity: 0, x: isEven ? 40 : -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="relative max-w-sm w-full group"
          style={{ perspective: 800 }}
        >
          {/* Glow border */}
          <motion.div
            className="absolute -inset-px rounded-2xl pointer-events-none"
            style={{ background: item.gradient }}
            animate={{ opacity: hovered ? 0.6 : 0 }}
            transition={{ duration: 0.3 }}
          />

          <motion.div
            className="relative rounded-2xl overflow-hidden"
            style={{ background: "rgb(11,12,24)", border: "1px solid rgba(255,255,255,0.07)" }}
            animate={{ rotateY: hovered ? (isEven ? -2 : 2) : 0, y: hovered ? -4 : 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
          >
            {/* Top strip */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{ background: item.gradient }}
              animate={{ scaleX: hovered ? 1 : 0.25, opacity: hovered ? 1 : 0.4 }}
              transition={{ duration: 0.4 }}
            />

            {/* Subtle bg glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 80% 60% at ${isEven ? "100%" : "0%"} 0%, ${item.accent}0D, transparent 70%)`,
              }}
            />

            <div className="relative z-10 p-6 flex gap-4">
              {/* Icon */}
              <motion.div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: item.gradient }}
                animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 8 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Icon className="w-5 h-5 text-white" strokeWidth={1.8} />
              </motion.div>

              <div className="flex-1 min-w-0">
                {/* Tag + year */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="text-xs font-bold tracking-widest uppercase"
                    style={{ fontFamily: "'Space Mono', monospace", color: item.accent }}
                  >
                    {item.tag}
                  </span>
                  <span
                    className="text-xs"
                    style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.2)" }}
                  >
                    · {item.year}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="font-black text-white mb-2 leading-tight"
                  style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", letterSpacing: "-0.03em" }}
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "rgba(255,255,255,0.35)",
                    fontSize: "0.82rem",
                    lineHeight: 1.7,
                    fontWeight: 300,
                  }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Connector arrow pointing to center */}
          <motion.div
            className={`absolute top-1/2 -translate-y-1/2 w-6 h-px ${isEven ? "-right-10" : "-left-10"}`}
            style={{ background: `linear-gradient(${isEven ? "90deg" : "270deg"}, ${item.accent}80, transparent)` }}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: delay + 0.3, duration: 0.4 }}
          />
        </motion.div>
      </div>

      {/* ── CENTER SPINE ── */}
      <div className="flex-shrink-0 w-px flex flex-col items-center order-2 relative" style={{ zIndex: 10 }}>
        {/* Node */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: delay + 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Pulse rings */}
          {hovered && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: item.accent }}
                animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: item.accent }}
                animate={{ scale: [1, 2], opacity: [0.3, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
              />
            </>
          )}

          {/* Node circle */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center relative z-10"
            style={{
              background: hovered ? item.gradient : "rgb(14,15,26)",
              border: `2px solid ${item.accent}`,
              boxShadow: hovered ? `0 0 20px ${item.accent}80` : `0 0 8px ${item.accent}30`,
              transition: "background 0.3s, box-shadow 0.3s",
            }}
          >
            <span
              className="font-black"
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: "0.75rem",
                letterSpacing: "-0.04em",
                color: hovered ? "#fff" : item.accent,
                transition: "color 0.3s",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Metric pill below node */}
          <motion.div
            className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-full"
            style={{
              background: `${item.accent}14`,
              border: `1px solid ${item.accent}30`,
            }}
            initial={{ opacity: 0, y: -6 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: delay + 0.4, duration: 0.4 }}
          >
            <span
              className="font-black"
              style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.7rem", color: item.accent, letterSpacing: "-0.03em" }}
            >
              {item.metric}
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* ── RIGHT SIDE spacer (empty on alternating rows) ── */}
      <div className={`flex-1 ${isEven ? "order-3" : "order-1"}`} />
    </div>
  );
}

// ── Spine line segment between nodes ─────────────────────────────────────────
function SpineSegment({ fromAccent, toAccent, inView, delay }: { fromAccent: string; toAccent: string; inView: boolean; delay: number }) {
  return (
    <div className="flex justify-center relative" style={{ height: 64, zIndex: 5 }}>
      {/* Center line */}
      <motion.div
        className="w-px"
        style={{
          background: `linear-gradient(180deg, ${fromAccent}60, ${toAccent}60)`,
        }}
        initial={{ scaleY: 0, originY: 0 }}
        animate={inView ? { scaleY: 1 } : {}}
        transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Travelling dot */}
      <motion.div
        className="absolute w-1.5 h-1.5 rounded-full left-1/2 -translate-x-1/2"
        style={{
          background: toAccent,
          boxShadow: `0 0 8px ${toAccent}`,
          top: 0,
        }}
        animate={inView ? { top: ["0%", "100%"], opacity: [0, 1, 0] } : {}}
        transition={{ duration: 1.2, delay: delay + 0.3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
      />
    </div>
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
export default function AchievementsSection() {
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

      <Orb style={{ top: "-8%", left: "-5%" }}    color="radial-gradient(circle,rgba(59,130,246,0.3),transparent 70%)"  size={500} dur={9}  delay={0} />
      <Orb style={{ bottom: "-10%", right: "-5%" }} color="radial-gradient(circle,rgba(139,92,246,0.25),transparent 70%)" size={440} dur={12} delay={2} />

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
        style={{ background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.3),transparent)" }}
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12">

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
              Proven Results
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
            Key Achievements
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
            A record of outcomes that speak for themselves — built through
            focus, craft, and relentless iteration.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {achievements.map((item, i) => (
            <div key={item.title}>
              <AchievementRow
                item={item}
                index={i}
                inView={inView}
              />
              {i < achievements.length - 1 && (
                <SpineSegment
                  fromAccent={item.accent}
                  toAccent={achievements[i + 1].accent}
                  inView={inView}
                  delay={i * 0.15 + 0.3}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}