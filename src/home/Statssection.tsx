import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Users, Star, Coffee } from "lucide-react";

// ── Animated counter hook ──────────────────────────────────────────────────
function useCounter(target: string, duration: number = 2000, inView: boolean = true) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    const numericTarget = parseInt(target.replace(/\D/g, ""), 10);
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * numericTarget));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  const suffix = target.replace(/[0-9]/g, "");
  return { count: count || 0, suffix };
}

// ── Particle burst around card ─────────────────────────────────────────────
function CardParticles({ active, color }: { active: boolean; color: string }) {
  const dots = Array.from({ length: 8 }, (_, i) => i);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
      {dots.map((i) => {
        const angle = (i / dots.length) * 360;
        return (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              background: color,
              top: "50%",
              left: "50%",
            }}
            animate={
              active
                ? {
                    x: Math.cos((angle * Math.PI) / 180) * 90,
                    y: Math.sin((angle * Math.PI) / 180) * 90,
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }
                : { x: 0, y: 0, opacity: 0, scale: 0 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

// ── Single stat card ───────────────────────────────────────────────────────
function StatCard({ stat, index, inView }: { stat: { icon: React.ElementType; value: string; label: string; sub: string; gradient: string; accentColor: string }; index: number; inView: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [burst, setBurst] = useState(false);
  const { count, suffix } = useCounter(stat.value, 2000 + index * 200, inView);

  const handleMouseEnter = () => {
    setHovered(true);
    setBurst(true);
    setTimeout(() => setBurst(false), 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.85 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        delay: index * 0.12,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
      className="relative group cursor-default"
      style={{ perspective: 1000 }}
    >
      {/* Outer glow layer */}
      <motion.div
        className="absolute -inset-px rounded-3xl"
        style={{ background: stat.gradient }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Card body */}
      <motion.div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: "rgb(10, 10, 22)",
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(20px)",
        }}
        animate={{ rotateY: hovered ? 4 : 0, rotateX: hovered ? -4 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {/* Particle burst */}
        <CardParticles active={burst} color={stat.accentColor} />

        {/* Top gradient strip */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: stat.gradient }}
        />

        {/* Corner decoration */}
        <motion.div
          className="absolute top-4 right-4 w-8 h-8 rounded-full opacity-20"
          style={{ background: stat.gradient }}
          animate={{ scale: hovered ? 6 : 1, opacity: hovered ? 0.04 : 0.18 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        <div className="relative z-10 p-8 flex flex-col items-center text-center gap-5">
          {/* Icon ring */}
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{ background: stat.gradient }}
              animate={{
                scale: hovered ? [1, 1.4, 1.2] : 1,
                opacity: hovered ? [0.4, 0, 0.15] : 0.15,
              }}
              transition={{ duration: 0.6 }}
            />
            <motion.div
              className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: stat.gradient }}
              animate={{ scale: hovered ? 1.12 : 1, rotate: hovered ? 8 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <stat.icon className="w-7 h-7 text-white" strokeWidth={1.8} />
            </motion.div>
          </div>

          {/* Animated number */}
          <div className="space-y-1">
            <motion.div
              className="font-black leading-none relative"
              style={{
                fontFamily: "'Sora', 'DM Sans', sans-serif",
                fontSize: "clamp(2.4rem, 4vw, 3.2rem)",
                letterSpacing: "-0.04em",
                color: hovered ? "transparent" : "#ffffff",
              }}
              animate={{ scale: hovered ? 1.06 : 1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {/* Solid white base — always visible, never clips */}
              <span style={{ position: "relative", zIndex: 2, color: hovered ? "transparent" : "#ffffff" }}>
                {count}{suffix}
              </span>
              {/* Gradient overlay — only shown on hover, layered on top via mix */}
              {hovered && (
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: stat.gradient,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    zIndex: 3,
                    fontFamily: "'Sora', 'DM Sans', sans-serif",
                    fontSize: "clamp(2.4rem, 4vw, 3.2rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {count}{suffix}
                </span>
              )}
            </motion.div>

            <div
              className="text-sm font-semibold tracking-widest uppercase"
              style={{
                fontFamily: "'Space Mono', monospace",
                color: hovered ? stat.accentColor : "rgba(255,255,255,0.4)",
                transition: "color 0.3s",
              }}
            >
              {stat.label}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="w-full h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

          {/* Sub-label */}
          <motion.div
            className="text-xs"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "rgba(255,255,255,0.3)",
            }}
            animate={{ opacity: hovered ? 1 : 0.6 }}
          >
            {stat.sub}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Background drifting orbs ───────────────────────────────────────────────
function FloatingOrb({ style, gradient, size, duration, delay }: { style: React.CSSProperties; gradient: string; size: number; duration: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none blur-3xl"
      style={{ width: size, height: size, background: gradient, ...style }}
      animate={{ scale: [1, 1.2, 1], opacity: [0.18, 0.35, 0.18] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ── Horizontal ticker ──────────────────────────────────────────────────────
function Ticker() {
  const items = [
    "React.js", "⬥", "Node.js", "⬥", "TypeScript", "⬥",
    "AWS", "⬥", "MongoDB", "⬥", "Docker", "⬥",
    "GraphQL", "⬥", "PostgreSQL", "⬥", "Next.js", "⬥",
  ];
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden w-full" style={{ maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)" }}>
      <motion.div
        className="flex gap-6 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="text-xs font-bold tracking-widest uppercase shrink-0"
            style={{
              fontFamily: "'Space Mono', monospace",
              color: item === "⬥" ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.15)",
            }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
const stats = [
  {
    icon: Award,
    value: "2+",
    label: "Years Exp.",
    sub: "Building production apps",
    gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)",
    accentColor: "#60a5fa",
  },
  {
    icon: Users,
    value: "50+",
    label: "Projects",
    sub: "Shipped across industries",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    accentColor: "#34d399",
  },
  {
    icon: Star,
    value: "25+",
    label: "Clients",
    sub: "Across 4+ countries",
    gradient: "linear-gradient(135deg, #8b5cf6, #a855f7)",
    accentColor: "#c084fc",
  },
  {
    icon: Coffee,
    value: "1000+",
    label: "Coffees",
    sub: "Fuel behind the code",
    gradient: "linear-gradient(135deg, #f97316, #ef4444)",
    accentColor: "#fb923c",
  },
];

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative py-28 overflow-hidden"
      style={{ background: "#020209", fontFamily: "'Sora', 'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;700;800&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');
      `}</style>

      {/* Floating orbs */}
      <FloatingOrb style={{ top: "-8%", left: "-4%" }} gradient="radial-gradient(circle, rgba(59,130,246,0.4), transparent 70%)" size={500} duration={7} delay={0} />
      <FloatingOrb style={{ bottom: "-10%", right: "-4%" }} gradient="radial-gradient(circle, rgba(139,92,246,0.35), transparent 70%)" size={420} duration={9} delay={2} />
      <FloatingOrb style={{ top: "30%", left: "50%" }} gradient="radial-gradient(circle, rgba(16,185,129,0.2), transparent 70%)" size={300} duration={11} delay={1} />

      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Scanline sweep */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)" }}
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Label */}
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
              By the numbers
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-indigo-500" />
          </motion.div>

          <h2
            className="font-black leading-tight mb-5"
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              letterSpacing: "-0.04em",
              background: "linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.5) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Numbers That Matter
          </h2>

          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.4)", fontWeight: 300, lineHeight: 1.7 }}
          >
            Real metrics from real work — delivered with precision,
            powered by caffeine and a relentless drive to ship.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} inView={inView} />
          ))}
        </div>

        {/* Bottom ticker */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <Ticker />
        </motion.div>
      </div>
    </section>
  );
}