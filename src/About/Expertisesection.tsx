import { useRef, useState, CSSProperties } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Code, Globe, Shield, Gauge, Terminal, Heart, Check, LucideIcon } from "lucide-react";

interface ExpertiseSection {
  title: string;
  icon: LucideIcon;
  accent: string;
  gradient: string;
  glow: string;
  tag: string;
  items: string[];
}

interface ExpertiseCardProps {
  section: ExpertiseSection;
  index: number;
  inView: boolean;
}

interface OrbProps {
  style?: CSSProperties;
  color: string;
  size: number;
  dur: number;
  delay: number;
}

const expertiseSections: ExpertiseSection[] = [
  {
    title: "Core Technical Expertise",
    icon: Code,
    accent: "#38bdf8",
    gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)",
    glow: "rgba(56,189,248,0.18)",
    tag: "Foundation",
    items: [
      "Frontend: React.js, JavaScript (ES6+), HTML5, CSS3, Bootstrap",
      "Backend: Node.js, Express.js",
      "Database: MongoDB",
      "REST API Development & Integration",
      "JWT Authentication & Role-Based Access Control",
    ],
  },
  {
    title: "Complete Website Development",
    icon: Globe,
    accent: "#c084fc",
    gradient: "linear-gradient(135deg,#8b5cf6,#a855f7)",
    glow: "rgba(192,132,252,0.18)",
    tag: "Full-Stack",
    items: [
      "End-to-end development (Frontend + Backend + DB)",
      "Dynamic & static website development",
      "Corporate, portfolio & admin dashboards",
      "E-commerce & business websites",
      "Custom web applications",
    ],
  },
  {
    title: "Secure & Optimized Development",
    icon: Shield,
    accent: "#4ade80",
    gradient: "linear-gradient(135deg,#10b981,#22c55e)",
    glow: "rgba(74,222,128,0.18)",
    tag: "Security",
    items: [
      "Secure authentication & authorization",
      "API protection & token-based security",
      "Input validation & error handling",
      "Secure environment configuration",
      "Performance optimization & caching",
    ],
  },
  {
    title: "Performance & Scalability",
    icon: Gauge,
    accent: "#fb923c",
    gradient: "linear-gradient(135deg,#f97316,#ef4444)",
    glow: "rgba(251,146,60,0.18)",
    tag: "Scale",
    items: [
      "Optimized backend architecture",
      "Efficient database schema design",
      "Reduced unnecessary API calls",
      "Clean and reusable component structure",
      "Code splitting & lazy loading",
    ],
  },
  {
    title: "Development Methodology",
    icon: Terminal,
    accent: "#818cf8",
    gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    glow: "rgba(129,140,248,0.18)",
    tag: "Process",
    items: [
      "Agile methodology practitioner",
      "Git version control & team collaboration",
      "Debugging & problem-solving mindset",
      "Clean, maintainable, scalable code",
    ],
  },
  {
    title: "Professional Strengths",
    icon: Heart,
    accent: "#f472b6",
    gradient: "linear-gradient(135deg,#ec4899,#f43f5e)",
    glow: "rgba(244,114,182,0.18)",
    tag: "Mindset",
    items: [
      "Passionate about clean UI & user-friendly design",
      "Responsive and cross-browser compatibility",
      "Strong frontend-backend communication",
      "Continuous learner of modern web tech",
    ],
  },
];

// ── Single expertise card ─────────────────────────────────────────────────────
function ExpertiseCard({ section, index, inView }: ExpertiseCardProps) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = section.icon;
  const isOpen = hovered || expanded;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current;
    if (!r) return;
    const rect = r.getBoundingClientRect();
    setMousePos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  // Show 2 items collapsed, all on hover

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.94 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={() => setExpanded((v) => !v)}
      className="relative cursor-pointer"
      style={{ perspective: 900 }}
    >
      {/* Glow border */}
      <motion.div
        className="absolute -inset-px rounded-3xl pointer-events-none"
        style={{ background: section.gradient }}
        animate={{ opacity: isOpen ? 0.6 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Shadow */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        animate={{ boxShadow: isOpen ? `0 24px 64px ${section.accent}20` : "none" }}
        transition={{ duration: 0.35 }}
      />

      {/* Spotlight */}
      {isOpen && (
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none z-0"
          style={{ background: `radial-gradient(200px circle at ${mousePos.x}% ${mousePos.y}%, ${section.glow}, transparent 70%)` }}
        />
      )}

      <motion.div
        className="relative rounded-3xl overflow-hidden h-full flex flex-col"
        style={{ background: "rgb(11,12,24)", border: "1px solid rgba(255,255,255,0.06)" }}
        animate={{ y: isOpen ? -5 : 0, rotateX: isOpen ? -2 : 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
      >
        {/* Animated top strip */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: section.gradient, boxShadow: isOpen ? `0 0 10px ${section.accent}` : "none" }}
          animate={{ scaleX: isOpen ? 1 : 0.2, opacity: isOpen ? 1 : 0.35 }}
          transition={{ duration: 0.4 }}
        />

        {/* BG grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(${section.accent} 1px,transparent 1px),linear-gradient(90deg,${section.accent} 1px,transparent 1px)`,
            backgroundSize: "26px 26px",
            opacity: isOpen ? 0.045 : 0.025,
            transition: "opacity 0.4s",
          }}
        />

        {/* Corner glow */}
        <motion.div
          className="absolute top-0 right-0 w-28 h-28 rounded-bl-full pointer-events-none"
          style={{ background: section.gradient, opacity: 0.07 }}
          animate={{ scale: isOpen ? 1.6 : 1, opacity: isOpen ? 0.11 : 0.07 }}
          transition={{ duration: 0.5 }}
        />

        {/* Ghost number */}
        <div
          className="absolute bottom-3 right-4 font-black pointer-events-none select-none"
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "5rem",
            color: section.accent,
            opacity: isOpen ? 0.1 : 0.04,
            letterSpacing: "-0.06em",
            lineHeight: 1,
            transition: "opacity 0.4s",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="relative z-10 p-6 flex flex-col gap-4 flex-1">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <motion.div
              className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{ background: section.gradient }}
              animate={{ scale: isOpen ? 1.1 : 1, rotate: isOpen ? 8 : 0, boxShadow: isOpen ? `0 0 20px ${section.accent}60` : "none" }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Icon className="w-5 h-5 text-white" strokeWidth={1.8} />
            </motion.div>

            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{
                fontFamily: "'Space Mono', monospace",
                background: `${section.accent}14`,
                border: `1px solid ${section.accent}28`,
                color: section.accent,
                letterSpacing: "0.04em",
              }}
            >
              {section.tag}
            </span>
          </div>

          {/* Title */}
          <h3
            className="font-black text-white leading-tight"
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "1rem",
              letterSpacing: "-0.03em",
              color: isOpen ? "#fff" : "rgba(255,255,255,0.85)",
              transition: "color 0.3s",
            }}
          >
            {section.title}
          </h3>

          {/* Divider */}
          <motion.div
            className="h-px"
            style={{ background: `linear-gradient(90deg,${section.accent}45,transparent)` }}
            animate={{ opacity: isOpen ? 1 : 0.3 }}
          />

          {/* Items list */}
          <div className="flex flex-col gap-2 flex-1">
            <AnimatePresence initial={false}>
              {section.items.map((item: string, i: number) => {
                const show = isOpen || i < 2;
                return show ? (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, delay: i > 1 ? (i - 2) * 0.06 : 0 }}
                    className="flex items-start gap-2.5 overflow-hidden"
                  >
                    <motion.div
                      className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        background: i < 2 ? `${section.accent}18` : isOpen ? `${section.accent}18` : "transparent",
                        border: `1px solid ${section.accent}30`,
                        transition: "all 0.3s",
                      }}
                    >
                      <Check className="w-2.5 h-2.5" style={{ color: section.accent }} strokeWidth={2.5} />
                    </motion.div>
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.8rem",
                        color: "rgba(255,255,255,0.45)",
                        lineHeight: 1.6,
                        fontWeight: 300,
                      }}
                    >
                      {item}
                    </span>
                  </motion.div>
                ) : null;
              })}
            </AnimatePresence>

            {/* Collapsed hint */}
            {!isOpen && section.items.length > 2 && (
              <motion.div
                className="flex items-center gap-1.5 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="h-px flex-1" style={{ background: `${section.accent}20` }} />
                <span
                  style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: section.accent, opacity: 0.6, letterSpacing: "0.04em" }}
                >
                  +{section.items.length - 2} more
                </span>
                <div className="h-px flex-1" style={{ background: `${section.accent}20` }} />
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Orb ───────────────────────────────────────────────────────────────────────
function Orb({ style, color, size, dur, delay }: OrbProps) {
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
export default function ExpertiseSection() {
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

      <Orb style={{ top: "-8%", left: "-5%" }}    color="radial-gradient(circle,rgba(59,130,246,0.28),transparent 70%)"  size={480} dur={9}  delay={0} />
      <Orb style={{ bottom: "-10%", right: "-5%" }} color="radial-gradient(circle,rgba(139,92,246,0.22),transparent 70%)" size={420} dur={12} delay={2} />
      <Orb style={{ top: "40%", left: "45%" }}    color="radial-gradient(circle,rgba(74,222,128,0.1),transparent 70%)"  size={300} dur={14} delay={1} />

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

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 36 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-indigo-500" />
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-400" style={{ fontFamily: "'Space Mono', monospace" }}>
              What I Know
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
            Technical Expertise
          </h2>

          <p
            className="text-lg max-w-xl mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.38)", fontWeight: 300, lineHeight: 1.8 }}
          >
            Six pillars of capability — hover any card to expand all details.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {expertiseSections.map((section, i) => (
            <ExpertiseCard key={section.title} section={section} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}