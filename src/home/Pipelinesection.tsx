import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Clock, Radio, TrendingUp, Zap, GitBranch, CheckCircle2, LucideIcon } from "lucide-react";

const COLUMNS = [
  { id: "discovery",   label: "Discovery",   color: "#818cf8", glow: "rgba(129,140,248,0.3)", index: 0 },
  { id: "development", label: "Development", color: "#38bdf8", glow: "rgba(56,189,248,0.3)",  index: 1 },
  { id: "qa",          label: "QA & UAT",    color: "#fb923c", glow: "rgba(251,146,60,0.3)",  index: 2 },
  { id: "launch",      label: "Launching",   color: "#4ade80", glow: "rgba(74,222,128,0.3)",  index: 3 },
];

const CARDS = [
  {
    id: 1,
    title: "Hotel Reservation Engine",
    client: "Shri Balaji Homestay",
    column: "discovery",
    progress: 28,
    eta: "3 weeks",
    accent: "#818cf8",
    gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    tasks: ["Requirements gathering", "Tech stack selection", "Wireframe design"],
    tasksDone: 1,
  },
  {
    id: 2,
    title: "Clinic Management Platform",
    client: "Bhargava Clinic",
    column: "development",
    progress: 72,
    eta: "2 weeks",
    accent: "#38bdf8",
    gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)",
    tasks: ["API endpoints", "Auth module", "Dashboard UI"],
    tasksDone: 2,
  },
  {
    id: 3,
    title: "Event Booking Suite",
    client: "Anjani Events",
    column: "qa",
    progress: 88,
    eta: "5 days",
    accent: "#fb923c",
    gradient: "linear-gradient(135deg,#f97316,#ef4444)",
    tasks: ["Cross-browser tests", "Client UAT", "Bug fixes"],
    tasksDone: 2,
  },
  {
    id: 4,
    title: "E-commerce Dashboard",
    client: "Internal Project",
    column: "launch",
    progress: 96,
    eta: "2 days",
    accent: "#4ade80",
    gradient: "linear-gradient(135deg,#10b981,#84cc16)",
    tasks: ["Staging sign-off", "DNS & SSL", "Go live"],
    tasksDone: 2,
  },
];

// ── Animated counter ──────────────────────────────────────────────────────────
function useCounter(target: number, inView: boolean, delay = 0) {
  const [val, setVal] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (!inView || done.current) return;
    done.current = true;
    const wait = delay * 1000;
    const timer = setTimeout(() => {
      const dur = 1400;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / dur, 1);
        setVal(Math.round((1 - Math.pow(1 - t, 4)) * target));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, wait);
    return () => clearTimeout(timer);
  }, [inView, target, delay]);
  return val;
}

// ── Floating particles around column ─────────────────────────────────────────
function ColumnParticles({ color, active }: { color: string; active: boolean }) {
  const particles = [
    { x: "10%", delay: 0 }, { x: "50%", delay: 0.8 }, { x: "80%", delay: 1.5 },
    { x: "25%", delay: 2.1 }, { x: "65%", delay: 0.4 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{ left: p.x, bottom: "0%", background: color, opacity: 0 }}
          animate={active ? {
            y: [0, -180, -260],
            opacity: [0, 0.7, 0],
            scale: [0, 1.2, 0],
          } : {}}
          transition={{
            duration: 3,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: 1.5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// ── Circular progress ring ────────────────────────────────────────────────────
function ProgressRing({ progress, accent, inView, delay }: { progress: number; accent: string; inView: boolean; delay: number }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const [strokeDash, setStrokeDash] = useState(circ);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => {
      setStrokeDash(circ - (progress / 100) * circ);
    }, delay * 1000 + 400);
    return () => clearTimeout(t);
  }, [inView, progress, circ, delay]);

  return (
    <svg width="48" height="48" style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <defs>
        <filter id={`glow-${progress}`}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
      <motion.circle
        cx="24" cy="24" r={r}
        fill="none"
        stroke={accent}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circ}
        animate={{ strokeDashoffset: strokeDash }}
        initial={{ strokeDashoffset: circ }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ filter: `drop-shadow(0 0 4px ${accent})` }}
      />
    </svg>
  );
}

// ── Kanban card ───────────────────────────────────────────────────────────────
function KanbanCard({ card, cardIndex, colIndex, inView }: { card: typeof CARDS[0]; cardIndex: number; colIndex: number; inView: boolean }) {
  const [hovered, setHovered] = useState(false);
  const count = useCounter(card.progress, inView, colIndex * 0.12 + 0.3);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    setHovered(true);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        delay: colIndex * 0.12 + cardIndex * 0.08 + 0.2,
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setHovered(false)}
      className="relative"
      style={{ perspective: 800 }}
    >
      {/* Floating particles */}
      <ColumnParticles color={card.accent} active={hovered} />

      {/* Glow border */}
      <motion.div
        className="absolute -inset-px rounded-2xl pointer-events-none"
        style={{ background: card.gradient }}
        animate={{ opacity: hovered ? 0.7 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Outer shadow glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          boxShadow: hovered ? `0 20px 60px ${card.accent}25, 0 0 0 1px ${card.accent}20` : "0 0 0 0 transparent",
        }}
        transition={{ duration: 0.35 }}
      />

      <motion.div
        className="relative rounded-2xl overflow-hidden"
        style={{ background: "rgb(11,12,24)", border: "1px solid rgba(255,255,255,0.06)" }}
        animate={{
          rotateX: hovered ? -2 : 0,
          rotateY: hovered ? 2 : 0,
          y: hovered ? -4 : 0,
        }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
      >
        {/* Top gradient strip */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: card.gradient }}
          animate={{ scaleX: hovered ? 1 : 0.2, opacity: hovered ? 1 : 0.4 }}
          transition={{ duration: 0.4 }}
        />

        {/* Subtle bg glow */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: `linear-gradient(180deg, ${card.accent}08, transparent)` }}
          animate={{ opacity: hovered ? 1 : 0.4 }}
        />

        <div className="relative z-10 p-5">
          {/* Client */}
          <motion.p
            className="text-xs font-bold tracking-widest uppercase mb-2"
            style={{ fontFamily: "'Space Mono', monospace", color: card.accent }}
            animate={{ opacity: hovered ? 1 : 0.65 }}
          >
            {card.client}
          </motion.p>

          {/* Title + ring */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3
                  className="font-black text-white leading-tight"
                  style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.95rem", letterSpacing: "-0.025em" }}
                >
                  {card.title}
                </h3>
                <motion.div
                  animate={{ rotate: hovered ? 45 : 0, scale: hovered ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <ArrowUpRight
                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                    style={{ color: hovered ? card.accent : "rgba(255,255,255,0.18)" }}
                    strokeWidth={2}
                  />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Ring + percent */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <ProgressRing progress={card.progress} accent={card.accent} inView={inView} delay={colIndex * 0.12} />
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.65rem", fontWeight: 900, color: card.accent }}
              >
                {count}%
              </div>
            </div>

            {/* Task checklist */}
            <div className="flex-1 space-y-1">
              {card.tasks.map((task: string, ti: number) => (
                <motion.div
                  key={task}
                  className="flex items-center gap-1.5"
                  initial={{ opacity: 0, x: -8 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: colIndex * 0.12 + ti * 0.07 + 0.5, duration: 0.4 }}
                >
                  <motion.div
                    animate={ti < card.tasksDone ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ delay: colIndex * 0.12 + ti * 0.07 + 0.8, duration: 0.3 }}
                  >
                    {ti < card.tasksDone ? (
                      <CheckCircle2
                        className="w-3 h-3 flex-shrink-0"
                        style={{ color: card.accent }}
                        strokeWidth={2.5}
                      />
                    ) : (
                      <div
                        className="w-3 h-3 rounded-full border flex-shrink-0"
                        style={{ borderColor: "rgba(255,255,255,0.12)" }}
                      />
                    )}
                  </motion.div>
                  <span
                    className="text-xs leading-none"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: ti < card.tasksDone ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.22)",
                      textDecoration: ti < card.tasksDone ? "line-through" : "none",
                    }}
                  >
                    {task}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div
            className="h-1 rounded-full overflow-hidden mb-3"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <motion.div
              className="h-full rounded-full relative overflow-hidden"
              style={{ background: card.gradient }}
              initial={{ width: "0%" }}
              animate={inView ? { width: `${card.progress}%` } : {}}
              transition={{ delay: colIndex * 0.12 + 0.4, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Shimmer */}
              <motion.div
                className="absolute inset-y-0 w-12"
                style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)" }}
                animate={{ left: ["-20%", "120%"] }}
                transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 2.5, delay: colIndex * 0.3 + 1.6 }}
              />
            </motion.div>
          </div>

          {/* ETA */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" style={{ color: "rgba(255,255,255,0.2)" }} strokeWidth={2} />
              <span
                className="text-xs"
                style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.22)" }}
              >
                ETA {card.eta}
              </span>
            </div>
            <motion.div
              className="flex items-center gap-1 px-2 py-0.5 rounded-full"
              style={{ background: `${card.accent}12`, border: `1px solid ${card.accent}25` }}
              animate={{ scale: hovered ? 1.05 : 1 }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: card.accent }}
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span
                className="text-xs font-bold"
                style={{ fontFamily: "'Space Mono', monospace", color: card.accent, fontSize: "0.6rem", letterSpacing: "0.05em" }}
              >
                ACTIVE
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Column ────────────────────────────────────────────────────────────────────
function KanbanColumn({ col, cards, inView }: { col: typeof COLUMNS[0]; cards: typeof CARDS; inView: boolean }) {
  const [colHovered, setColHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: col.index * 0.11, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setColHovered(true)}
      onMouseLeave={() => setColHovered(false)}
      className="flex flex-col min-w-0"
    >
      {/* Column header */}
      <motion.div
        className="flex items-center gap-2.5 px-1 mb-4"
        animate={{ opacity: colHovered ? 1 : 0.75 }}
        transition={{ duration: 0.2 }}
      >
        {/* Pulsing dot */}
        <div className="relative w-2.5 h-2.5 flex-shrink-0">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: col.color }}
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: col.index * 0.3 }}
          />
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: col.glow }}
            animate={{ scale: [1, 2.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: col.index * 0.3 }}
          />
        </div>

        <span
          className="text-xs font-bold tracking-widest uppercase flex-1"
          style={{ fontFamily: "'Space Mono', monospace", color: col.color }}
        >
          {col.label}
        </span>

        {/* Count badge */}
        <motion.span
          className="text-xs font-black w-5 h-5 rounded-full flex items-center justify-center"
          style={{
            fontFamily: "'Sora', sans-serif",
            background: `${col.color}18`,
            border: `1px solid ${col.color}30`,
            color: col.color,
          }}
          animate={{ scale: colHovered ? 1.12 : 1 }}
        >
          {cards.length}
        </motion.span>
      </motion.div>

      {/* Gradient header rule */}
      <motion.div
        className="h-px mb-4 rounded-full"
        style={{ background: `linear-gradient(90deg, ${col.color}, transparent)` }}
        animate={{ scaleX: colHovered ? 1 : 0.6, opacity: colHovered ? 1 : 0.4 }}
        transition={{ duration: 0.35 }}
      />

      {/* Cards */}
      <div className="flex flex-col gap-3">
        {cards.length === 0 ? (
          <motion.div
            className="rounded-2xl flex items-center justify-center py-10"
            style={{ border: "1px dashed rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}
            animate={{ borderColor: colHovered ? `${col.color}30` : "rgba(255,255,255,0.06)" }}
            transition={{ duration: 0.3 }}
          >
            <span
              className="text-xs"
              style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.1)" }}
            >
              empty
            </span>
          </motion.div>
        ) : (
          cards.map((card: typeof CARDS[0], ci: number) => (
            <KanbanCard key={card.id} card={card} cardIndex={ci} colIndex={col.index} inView={inView} />
          ))
        )}
      </div>
    </motion.div>
  );
}

// ── Stat pill ─────────────────────────────────────────────────────────────────
function StatPill({ icon: Icon, label, value, delay, inView }: { icon: LucideIcon; label: string; value: string; delay: number; inView: boolean }) {
  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
      >
        <Icon className="w-4 h-4 text-indigo-400" strokeWidth={1.8} />
      </div>
      <div>
        <div
          className="font-black text-white leading-none"
          style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.25rem", letterSpacing: "-0.04em" }}
        >
          {value}
        </div>
        <div
          className="text-xs mt-0.5"
          style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.25)" }}
        >
          {label}
        </div>
      </div>
    </motion.div>
  );
}

// ── Orb ──────────────────────────────────────────────────────────────────────
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

// ── Main ─────────────────────────────────────────────────────────────────────
export default function PipelineSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative py-28 overflow-hidden"
      style={{ background: "#020209" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;700;800;900&family=DM+Sans:wght@300;400&family=Space+Mono:wght@400;700&display=swap');
      `}</style>

      {/* Orbs */}
      <Orb style={{ top: "-8%", left: "-5%" }}  color="radial-gradient(circle,rgba(99,102,241,0.4),transparent 70%)"  size={520} dur={9}  delay={0} />
      <Orb style={{ bottom: "-10%", right: "-4%" }} color="radial-gradient(circle,rgba(16,185,129,0.28),transparent 70%)" size={440} dur={12} delay={2} />
      <Orb style={{ top: "40%", right: "15%" }}  color="radial-gradient(circle,rgba(251,146,60,0.18),transparent 70%)"  size={300} dur={14} delay={1} />

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

      {/* Vertical scan */}
      <motion.div
        className="absolute top-0 bottom-0 w-px pointer-events-none"
        style={{ background: "linear-gradient(180deg,transparent,rgba(56,189,248,0.2),transparent)" }}
        animate={{ left: ["0%", "100%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Live badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.2)" }}
              animate={{ opacity: [1, 0.55, 1] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-emerald-400"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <Radio className="w-3 h-3 text-emerald-400" strokeWidth={2} />
              <span
                className="text-xs font-bold tracking-widest uppercase text-emerald-400"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Live · {CARDS.length} Active Projects
              </span>
            </motion.div>

            <h2
              className="font-black leading-none"
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: "clamp(2.8rem, 5.5vw, 4.5rem)",
                letterSpacing: "-0.05em",
                background: "linear-gradient(135deg,#fff 20%,rgba(255,255,255,0.35) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Project<br />Pipeline
            </h2>
          </motion.div>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-6 lg:gap-8">
            <StatPill icon={TrendingUp}  label="Avg completion"       value="71%"  delay={0.15} inView={inView} />
            <StatPill icon={CheckCircle2} label="On schedule"          value="3/4"  delay={0.25} inView={inView} />
            <StatPill icon={Zap}         label="Shipping this week"   value="2"    delay={0.35} inView={inView} />
            <StatPill icon={GitBranch}   label="Stages tracked"       value="4"    delay={0.45} inView={inView} />
          </div>
        </div>

        {/* ── Board ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              col={col}
              cards={CARDS.filter((c) => c.column === col.id)}
              inView={inView}
            />
          ))}
        </div>

        {/* ── Bottom connecting flow line ── */}
        <motion.div
          className="mt-10 relative h-px"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(90deg,rgba(129,140,248,0.4),rgba(56,189,248,0.4),rgba(251,146,60,0.4),rgba(74,222,128,0.4))" }}
          />
          {/* Travelling dot */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
            style={{ background: "#fff", boxShadow: "0 0 14px rgba(255,255,255,0.9), 0 0 30px rgba(99,102,241,0.7)" }}
            animate={{ left: ["0%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
          />
        </motion.div>

        {/* Stage labels under flow */}
        <motion.div
          className="flex justify-between mt-2 px-0"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          {COLUMNS.map((col) => (
            <span
              key={col.id}
              className="text-xs font-bold tracking-widest uppercase"
              style={{ fontFamily: "'Space Mono', monospace", color: col.color, opacity: 0.5 }}
            >
              {col.label}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}