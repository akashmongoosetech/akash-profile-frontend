import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

interface Skill {
  name: string;
  level: number;
  gradient: string;
  accent: string;
  icon: string;
  category: string;
}

interface CircleProgressProps {
  level: number;
  gradient: string;
  accent: string;
  id: number;
  inView: boolean;
}

interface BarProgressProps {
  level: number;
  gradient: string;
  accent: string;
  index: number;
  inView: boolean;
}

interface SkillCardProps {
  skill: Skill;
  index: number;
  inView: boolean;
}

interface OrbProps {
  style?: React.CSSProperties;
  color: string;
  size: number;
  dur: number;
  delay: number;
}

const skills = [
  { name: "React.js", level: 95, gradient: "linear-gradient(90deg, #3b82f6, #06b6d4)", accent: "#60a5fa", icon: "⚛️", category: "Frontend" },
  { name: "Node.js", level: 92, gradient: "linear-gradient(90deg, #10b981, #059669)", accent: "#34d399", icon: "🟢", category: "Backend" },
  { name: "TypeScript", level: 90, gradient: "linear-gradient(90deg, #3b82f6, #6366f1)", accent: "#818cf8", icon: "𝙏𝙎", category: "Language" },
  { name: "AWS", level: 85, gradient: "linear-gradient(90deg, #f97316, #ef4444)", accent: "#fb923c", icon: "☁️", category: "Cloud" },
  { name: "MongoDB", level: 88, gradient: "linear-gradient(90deg, #10b981, #84cc16)", accent: "#4ade80", icon: "🍃", category: "Database" },
  { name: "Docker", level: 82, gradient: "linear-gradient(90deg, #6366f1, #8b5cf6)", accent: "#a78bfa", icon: "🐳", category: "DevOps" },
];

// ── Animated counter for percentage ─────────────────────────────────────────
function useAnimatedValue(target: number, inView: boolean): number {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const duration = 1600;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setVal(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);
  return val;
}

// ── Circular arc progress ────────────────────────────────────────────────────
function CircleProgress({ level, accent, id, inView }: CircleProgressProps) {
  const animVal = useAnimatedValue(level, inView);
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (animVal / 100) * circ;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 96, height: 96 }}>
      <svg width="96" height="96" style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={accent} stopOpacity="1" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.5" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        {/* Progress */}
        <motion.circle
          cx="48" cy="48" r={r}
          fill="none"
          stroke={`url(#grad-${id})`}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 6px ${accent})` }}
          transition={{ duration: 0.05 }}
        />
      </svg>
      {/* Center value */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-black text-white"
          style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.05rem", letterSpacing: "-0.04em" }}
        >
          {animVal}%
        </span>
      </div>
    </div>
  );
}

// ── Bar progress ─────────────────────────────────────────────────────────────
function BarProgress({ level, gradient, accent, index, inView }: BarProgressProps) {
  const animVal = useAnimatedValue(level, inView);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold tracking-widest uppercase" style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.3)" }}>
          Proficiency
        </span>
        <span className="text-xs font-black" style={{ fontFamily: "'Sora', sans-serif", color: accent }}>
          {animVal}%
        </span>
      </div>
      {/* Track */}
      <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        {/* Fill */}
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ background: gradient }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ delay: index * 0.1 + 0.4, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Shimmer */}
        <motion.div
          className="absolute top-0 h-full w-12 rounded-full"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }}
          animate={{ left: ["-10%", "110%"] }}
          transition={{ delay: index * 0.1 + 1.8, duration: 1.2, repeat: Infinity, repeatDelay: 3 }}
        />
      </div>
    </div>
  );
}

// ── Skill card ───────────────────────────────────────────────────────────────
function SkillCard({ skill, index, inView }: SkillCardProps) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.92 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className="relative group"
      style={{ perspective: 900 }}
    >
      {/* Outer glow border */}
      <motion.div
        className="absolute -inset-px rounded-2xl pointer-events-none"
        style={{ background: skill.gradient }}
        animate={{ opacity: hovered ? 0.9 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Mouse spotlight */}
      {hovered && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-0"
          style={{
            background: `radial-gradient(200px circle at ${mousePos.x}% ${mousePos.y}%, ${skill.accent}20, transparent 70%)`,
          }}
        />
      )}

      {/* Card body */}
      <motion.div
        className="relative rounded-2xl overflow-hidden h-full"
        style={{ background: "rgb(10,11,22)", border: "1px solid rgba(255,255,255,0.06)" }}
        animate={{ rotateX: hovered ? -3 : 0, rotateY: hovered ? 3 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Top line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: skill.gradient }}
          animate={{ scaleX: hovered ? 1 : 0.3, opacity: hovered ? 1 : 0.45 }}
          transition={{ duration: 0.4 }}
        />

        {/* BG grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: `linear-gradient(${skill.accent} 1px, transparent 1px), linear-gradient(90deg, ${skill.accent} 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* Corner glow blob */}
        <motion.div
          className="absolute top-0 right-0 w-24 h-24 rounded-bl-full pointer-events-none"
          style={{ background: skill.gradient, opacity: 0.07 }}
          animate={{ scale: hovered ? 1.6 : 1, opacity: hovered ? 0.12 : 0.07 }}
          transition={{ duration: 0.5 }}
        />

        <div className="relative z-10 p-6 flex flex-col gap-5">
          {/* Top: icon + category + circle */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              {/* Emoji icon */}
              <motion.div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: `${skill.accent}15`, border: `1px solid ${skill.accent}25` }}
                animate={{ scale: hovered ? 1.12 : 1, rotate: hovered ? 8 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                {skill.icon}
              </motion.div>

              {/* Category badge */}
              <span
                className="text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full self-start"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  background: `${skill.accent}12`,
                  border: `1px solid ${skill.accent}28`,
                  color: skill.accent,
                }}
              >
                {skill.category}
              </span>
            </div>

            {/* Circle progress */}
            <CircleProgress level={skill.level} gradient={skill.gradient} accent={skill.accent} id={index} inView={inView} />
          </div>

          {/* Skill name */}
          <div>
            <h3
              className="font-black leading-tight"
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: "1.35rem",
                letterSpacing: "-0.03em",
                color: hovered ? "#fff" : "rgba(255,255,255,0.9)",
                transition: "color 0.3s",
              }}
            >
              {skill.name}
            </h3>
          </div>

          {/* Bar progress */}
          <BarProgress level={skill.level} gradient={skill.gradient} accent={skill.accent} index={index} inView={inView} />

          {/* Expertise dots */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                className="h-1.5 flex-1 rounded-full"
                style={{
                  background: i < Math.round(skill.level / 10) ? skill.gradient : "rgba(255,255,255,0.06)",
                  boxShadow: i < Math.round(skill.level / 10) && hovered ? `0 0 6px ${skill.accent}` : "none",
                }}
                animate={{
                  scaleY: hovered && i < Math.round(skill.level / 10) ? 1.6 : 1,
                }}
                transition={{ delay: i * 0.03, type: "spring", stiffness: 400 }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Floating orb ─────────────────────────────────────────────────────────────
function Orb({ style, color, size, dur, delay }: OrbProps) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl pointer-events-none"
      style={{ width: size, height: size, background: color, ...style }}
      animate={{ scale: [1, 1.3, 1], opacity: [0.12, 0.28, 0.12] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ── Main export ──────────────────────────────────────────────────────────────
export default function SkillsSection() {
  const ref = useRef<HTMLElement>(null);
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
      <Orb style={{ top: "-8%", right: "-5%" }} color="radial-gradient(circle, rgba(99,102,241,0.45), transparent 70%)" size={520} dur={8} delay={0} />
      <Orb style={{ bottom: "-10%", left: "-5%" }} color="radial-gradient(circle, rgba(16,185,129,0.3), transparent 70%)" size={440} dur={10} delay={2} />
      <Orb style={{ top: "35%", left: "40%" }} color="radial-gradient(circle, rgba(139,92,246,0.18), transparent 70%)" size={320} dur={13} delay={1} />

      {/* Grid bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)" }}
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
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
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-400" style={{ fontFamily: "'Space Mono', monospace" }}>
              Technical Arsenal
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-indigo-500" />
          </motion.div>

          <h2
            className="font-black leading-tight mb-5"
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              letterSpacing: "-0.04em",
              background: "linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.45) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Technical Expertise
          </h2>

          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.38)", fontWeight: 300, lineHeight: 1.8 }}
          >
            Battle-tested proficiency across the full stack — from browser pixels
            to cloud infrastructure — earned through real-world production systems.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {skills.map((skill, i) => (
            <SkillCard key={skill.name} skill={skill} index={i} inView={inView} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.75, duration: 0.6 }}
        >
          <a
            href="/skills"
            className="inline-flex items-center gap-3 px-9 py-4 rounded-2xl font-bold text-base text-white relative overflow-hidden"
            style={{
              fontFamily: "'Sora', sans-serif",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              textDecoration: "none",
              backdropFilter: "blur(12px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.09)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
            }}
          >
            <Zap className="w-4 h-4 text-indigo-400" strokeWidth={2} />
            <span>View All Skills</span>
            <ArrowRight className="w-4 h-4 text-indigo-400" />
          </a>

          <p className="mt-4 text-sm" style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.18)" }}>
            6 core skills shown · 20+ technologies mastered
          </p>
        </motion.div>
      </div>
    </section>
  );
}