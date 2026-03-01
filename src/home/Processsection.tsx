import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Lightbulb, Palette, Hammer, Bug, Rocket, Heart, LucideIcon } from "lucide-react";

interface ProcessStep {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  gradient: string;
  tag: string;
  deliverable: string;
}

const processSteps = [
  {
    step: "01", title: "Discovery & Planning",
    description: "We start by understanding your vision, goals, and requirements. I analyze your needs and create a detailed project roadmap.",
    icon: Lightbulb, accent: "#fbbf24", gradient: "linear-gradient(135deg,#f59e0b,#f97316)", tag: "Week 1", deliverable: "Roadmap + scope doc",
  },
  {
    step: "02", title: "Design & Prototype",
    description: "I create stunning UI/UX designs and interactive prototypes to visualize the final product before development begins.",
    icon: Palette, accent: "#f472b6", gradient: "linear-gradient(135deg,#ec4899,#f43f5e)", tag: "Week 2", deliverable: "Figma + style guide",
  },
  {
    step: "03", title: "Development",
    description: "Using cutting-edge technologies, I build robust and scalable solutions with clean, maintainable code.",
    icon: Hammer, accent: "#38bdf8", gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)", tag: "Week 3–6", deliverable: "Production codebase",
  },
  {
    step: "04", title: "Testing & QA",
    description: "Rigorous testing ensures your application is bug-free, secure, and performs optimally across all devices.",
    icon: Bug, accent: "#4ade80", gradient: "linear-gradient(135deg,#10b981,#22c55e)", tag: "Week 7", deliverable: "QA report + fixes",
  },
  {
    step: "05", title: "Deployment & Launch",
    description: "I deploy your application to production servers and ensure a smooth launch with zero downtime.",
    icon: Rocket, accent: "#c084fc", gradient: "linear-gradient(135deg,#8b5cf6,#a855f7)", tag: "Week 8", deliverable: "Live app + CI/CD",
  },
  {
    step: "06", title: "Support & Maintain",
    description: "Post-launch support includes updates, optimizations, and ongoing maintenance to keep your app running perfectly.",
    icon: Heart, accent: "#fb7185", gradient: "linear-gradient(135deg,#f43f5e,#ec4899)", tag: "Ongoing", deliverable: "Monthly reports",
  },
];

const ORBIT_R = 210; // orbit radius in px
const TOTAL = processSteps.length;

// ── Detail panel (center) ─────────────────────────────────────────────────────
function CenterPanel({ active }: { active: number }) {
  const s = processSteps[active];
  const Icon = s.icon;
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-3"
        >
          {/* Icon */}
          <motion.div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-1"
            style={{ background: s.gradient, boxShadow: `0 0 32px ${s.accent}60` }}
          >
            <Icon className="w-8 h-8 text-white" strokeWidth={1.6} />
          </motion.div>

          {/* Step label */}
          <span
            className="text-xs font-black tracking-widest uppercase"
            style={{ fontFamily: "'Space Mono', monospace", color: s.accent }}
          >
            Step {s.step} · {s.tag}
          </span>

          {/* Title */}
          <h3
            className="font-black text-white leading-tight"
            style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.15rem", letterSpacing: "-0.04em", maxWidth: 200 }}
          >
            {s.title}
          </h3>

          {/* Description */}
          <p
            className="text-xs leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.38)", maxWidth: 200, fontWeight: 300, lineHeight: 1.7 }}
          >
            {s.description}
          </p>

          {/* Deliverable */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full mt-1"
            style={{ background: `${s.accent}12`, border: `1px solid ${s.accent}28` }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: s.accent }}
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span
              style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: s.accent, letterSpacing: "0.04em" }}
            >
              {s.deliverable}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── Orbit node ────────────────────────────────────────────────────────────────
function OrbitNode({ step, index, total, active, onClick, inView, orbitR }: { step: ProcessStep; index: number; total: number; active: number; onClick: () => void; inView: boolean; orbitR: number }) {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // start at top
  const x = Math.cos(angle) * orbitR;
  const y = Math.sin(angle) * orbitR;
  const isActive = index === active;
  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: index * 0.1 + 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
    >
      {/* Pulse rings when active */}
      {isActive && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ background: step.accent, margin: -8 }}
            animate={{ scale: [1, 2.2], opacity: [0.3, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ background: step.accent, margin: -8 }}
            animate={{ scale: [1, 1.7], opacity: [0.25, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
          />
        </>
      )}

      {/* Node button */}
      <motion.button
        onClick={onClick}
        className="relative flex flex-col items-center gap-2 cursor-pointer group"
        style={{ background: "none", border: "none", padding: 0 }}
        animate={{ scale: isActive ? 1.18 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        whileHover={{ scale: isActive ? 1.2 : 1.1 }}
      >
        {/* Icon circle */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center relative"
          style={{
            background: isActive ? step.gradient : "rgb(14,15,26)",
            border: `2px solid ${isActive ? step.accent : step.accent + "55"}`,
            boxShadow: isActive ? `0 0 28px ${step.accent}80, 0 0 60px ${step.accent}30` : `0 0 10px ${step.accent}20`,
            transition: "all 0.35s",
          }}
        >
          <Icon
            className="w-6 h-6"
            style={{ color: isActive ? "#fff" : step.accent, opacity: isActive ? 1 : 0.7, transition: "all 0.3s" }}
            strokeWidth={1.8}
          />
        </div>

        {/* Step number badge */}
        <span
          className="font-black leading-none"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.55rem",
            color: isActive ? step.accent : "rgba(255,255,255,0.25)",
            letterSpacing: "0.06em",
            transition: "color 0.3s",
          }}
        >
          {step.step}
        </span>
      </motion.button>
    </motion.div>
  );
}

// ── SVG orbit ring + connecting lines ─────────────────────────────────────────
function OrbitSVG({ active, total, orbitR, size, inView }: { active: number; total: number; orbitR: number; size: number; inView: boolean }) {
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg
      width={size}
      height={size}
      className="absolute inset-0 pointer-events-none"
      style={{ top: 0, left: 0 }}
    >
      <defs>
        {processSteps.map((s, i) => (
          <radialGradient key={i} id={`ng-${i}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={s.accent} stopOpacity="0.6" />
            <stop offset="100%" stopColor={s.accent} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>

      {/* Outer orbit ring */}
      <motion.circle
        cx={cx} cy={cy} r={orbitR}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="1"
        strokeDasharray="4 8"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.2, duration: 0.8 }}
      />

      {/* Active accent arc segment */}
      {inView && (() => {
        const startAngle = (active / total) * 2 * Math.PI - Math.PI / 2;
        const endAngle = startAngle + (2 * Math.PI / total);
        const x1 = cx + Math.cos(startAngle) * orbitR;
        const y1 = cy + Math.sin(startAngle) * orbitR;
        const x2 = cx + Math.cos(endAngle) * orbitR;
        const y2 = cy + Math.sin(endAngle) * orbitR;
        const s = processSteps[active];
        return (
          <motion.path
            d={`M ${x1} ${y1} A ${orbitR} ${orbitR} 0 0 1 ${x2} ${y2}`}
            fill="none"
            stroke={s.accent}
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            key={active}
            style={{ filter: `drop-shadow(0 0 6px ${s.accent})` }}
          />
        );
      })()}

      {/* Spoke lines from center to each node */}
      {processSteps.map((s, i) => {
        const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
        const nx = cx + Math.cos(angle) * orbitR;
        const ny = cy + Math.sin(angle) * orbitR;
        const isAct = i === active;
        return (
          <motion.line
            key={i}
            x1={cx} y1={cy} x2={nx} y2={ny}
            stroke={isAct ? s.accent : "rgba(255,255,255,0.04)"}
            strokeWidth={isAct ? "1" : "0.5"}
            strokeDasharray={isAct ? "none" : "3 6"}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: i * 0.08 + 0.4, duration: 0.4 }}
            style={{ transition: "stroke 0.4s" }}
          />
        );
      })}

      {/* Travelling dot along orbit */}
      {inView && (() => {
        const s = processSteps[active];
        return (
          <motion.circle
            r="3"
            fill={s.accent}
            key={`dot-${active}`}
            style={{ filter: `drop-shadow(0 0 5px ${s.accent})` }}
          >
            <animateMotion
              dur="4s"
              repeatCount="indefinite"
              path={`M ${cx + Math.cos(-Math.PI / 2) * orbitR} ${cy + Math.sin(-Math.PI / 2) * orbitR} A ${orbitR} ${orbitR} 0 1 1 ${cx + Math.cos(-Math.PI / 2 - 0.001) * orbitR} ${cy + Math.sin(-Math.PI / 2 - 0.001) * orbitR}`}
            />
          </motion.circle>
        );
      })()}

      {/* Inner ring */}
      <circle
        cx={cx} cy={cy} r={90}
        fill="none"
        stroke="rgba(255,255,255,0.03)"
        strokeWidth="1"
      />
    </svg>
  );
}

// ── Orb ───────────────────────────────────────────────────────────────────────
function Orb({ style, color, size, dur, delay }: { style?: React.CSSProperties; color: string; size: number; dur: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl pointer-events-none"
      style={{ width: size, height: size, background: color, ...style }}
      animate={{ scale: [1, 1.28, 1], opacity: [0.08, 0.18, 0.08] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ProcessSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);

  // auto-advance
  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % TOTAL), 3000);
    return () => clearInterval(t);
  }, []);

  const DIAL_SIZE = 580;
  const activeStep = processSteps[active];

  return (
    <section
      ref={ref}
      className="relative py-28 overflow-hidden"
      style={{ background: "#020209" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;700;800;900&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');
      `}</style>

      {/* Dynamic center glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        animate={{ background: `radial-gradient(ellipse 40% 40% at 50% 55%, ${activeStep.accent}0D, transparent 70%)` }}
        transition={{ duration: 0.8 }}
      />

      <Orb style={{ top: "-8%", left: "-5%" }}    color="radial-gradient(circle,rgba(59,130,246,0.25),transparent 70%)"  size={460} dur={10} delay={0} />
      <Orb style={{ bottom: "-8%", right: "-5%" }} color="radial-gradient(circle,rgba(139,92,246,0.22),transparent 70%)" size={420} dur={13} delay={2} />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(99,102,241,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.03) 1px,transparent 1px)",
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

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── Header ── */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 36 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-indigo-500" />
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-400" style={{ fontFamily: "'Space Mono', monospace" }}>
              How I Work
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-indigo-500" />
          </div>
          <h2
            className="font-black leading-tight mb-4"
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
            The Process
          </h2>
          <p
            className="text-lg max-w-xl mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.38)", fontWeight: 300, lineHeight: 1.8 }}
          >
            Six repeatable phases that turn ideas into production-ready products — every time.
          </p>
        </motion.div>

        {/* ── Orbital diagram ── */}
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* Orbital wheel */}
          <div className="flex-shrink-0 relative" style={{ width: DIAL_SIZE, height: DIAL_SIZE }}>
            {/* SVG rings + spokes */}
            <OrbitSVG active={active} total={TOTAL} orbitR={ORBIT_R} size={DIAL_SIZE} inView={inView} />

            {/* Center panel */}
            <motion.div
              className="absolute rounded-full"
              style={{
                left: "50%", top: "50%",
                width: 180, height: 180,
                transform: "translate(-50%,-50%)",
                background: "rgb(11,12,24)",
                border: `1px solid ${activeStep.accent}30`,
                boxShadow: `0 0 40px ${activeStep.accent}18`,
                transition: "border-color 0.4s, box-shadow 0.4s",
              }}
            />
            <CenterPanel active={active} />

            {/* Orbit nodes */}
            {processSteps.map((step, i) => (
              <OrbitNode
                key={step.step}
                step={step}
                index={i}
                total={TOTAL}
                active={active}
                onClick={() => setActive(i)}
                inView={inView}
                orbitR={ORBIT_R}
              />
            ))}
          </div>

          {/* Right: step list */}
          <div className="flex flex-col gap-3 flex-1 w-full max-w-sm mx-auto lg:mx-0">
            {processSteps.map((s, i) => {
              const Icon = s.icon;
              const isAct = i === active;
              return (
                <motion.button
                  key={s.step}
                  onClick={() => setActive(i)}
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.08 + 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex items-center gap-4 px-4 py-3 rounded-2xl text-left w-full overflow-hidden"
                  style={{
                    background: isAct ? `${s.accent}0D` : "rgba(255,255,255,0.02)",
                    border: `1px solid ${isAct ? s.accent + "35" : "rgba(255,255,255,0.06)"}`,
                    cursor: "pointer",
                    transition: "background 0.3s, border-color 0.3s",
                  }}
                  whileHover={{ x: 4 }}
                >
                  {/* Active left bar */}
                  <motion.div
                    className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
                    style={{ background: s.gradient }}
                    animate={{ opacity: isAct ? 1 : 0, scaleY: isAct ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Icon */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: isAct ? s.gradient : "rgba(255,255,255,0.04)",
                      border: isAct ? "none" : `1px solid ${s.accent}25`,
                      transition: "background 0.3s",
                      boxShadow: isAct ? `0 0 14px ${s.accent}50` : "none",
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: isAct ? "#fff" : s.accent }} strokeWidth={1.8} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-black text-sm"
                        style={{ fontFamily: "'Sora', sans-serif", color: isAct ? "#fff" : "rgba(255,255,255,0.55)", letterSpacing: "-0.02em", transition: "color 0.3s" }}
                      >
                        {s.title}
                      </span>
                    </div>
                    <span
                      className="text-xs"
                      style={{ fontFamily: "'Space Mono', monospace", color: isAct ? s.accent : "rgba(255,255,255,0.2)", transition: "color 0.3s" }}
                    >
                      {s.step} · {s.tag}
                    </span>
                  </div>

                  {/* Active indicator */}
                  {isAct && (
                    <motion.div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: s.accent, boxShadow: `0 0 8px ${s.accent}` }}
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}