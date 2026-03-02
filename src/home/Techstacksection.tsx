import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// Real SVG logos for each technology
const techStack = [
  {
    name: "React.js",
    accent: "#61dafb",
    gradient: "linear-gradient(135deg,#61dafb,#1e90ff)",
    category: "Frontend",
    svg: (
      <svg viewBox="0 0 40 40" fill="none">
        <ellipse cx="20" cy="20" rx="18" ry="7" stroke="#61dafb" strokeWidth="2" fill="none"/>
        <ellipse cx="20" cy="20" rx="18" ry="7" stroke="#61dafb" strokeWidth="2" fill="none" transform="rotate(60 20 20)"/>
        <ellipse cx="20" cy="20" rx="18" ry="7" stroke="#61dafb" strokeWidth="2" fill="none" transform="rotate(120 20 20)"/>
        <circle cx="20" cy="20" r="3" fill="#61dafb"/>
      </svg>
    ),
  },
  {
    name: "Next.js",
    accent: "#ffffff",
    gradient: "linear-gradient(135deg,#e2e8f0,#64748b)",
    category: "Frontend",
    svg: (
      <svg viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="17" stroke="white" strokeWidth="2"/>
        <text x="9" y="26" fontFamily="monospace" fontWeight="900" fontSize="14" fill="white">N</text>
        <polygon points="26,12 34,28 26,28" fill="white"/>
      </svg>
    ),
  },
  {
    name: "TypeScript",
    accent: "#3178c6",
    gradient: "linear-gradient(135deg,#3178c6,#1e5fa8)",
    category: "Language",
    svg: (
      <svg viewBox="0 0 40 40" fill="none">
        <rect x="4" y="4" width="32" height="32" rx="4" fill="#3178c6"/>
        <text x="6" y="28" fontFamily="monospace" fontWeight="900" fontSize="16" fill="white">TS</text>
      </svg>
    ),
  },
  {
    name: "Node.js",
    accent: "#68a063",
    gradient: "linear-gradient(135deg,#68a063,#3e7b3a)",
    category: "Backend",
    svg: (
      <svg viewBox="0 0 40 40" fill="none">
        <polygon points="20,3 35,11.5 35,28.5 20,37 5,28.5 5,11.5" stroke="#68a063" strokeWidth="2" fill="none"/>
        <text x="11" y="26" fontFamily="monospace" fontWeight="900" fontSize="11" fill="#68a063">JS</text>
      </svg>
    ),
  },
  {
    name: "Express",
    accent: "#aaaaaa",
    gradient: "linear-gradient(135deg,#ccc,#666)",
    category: "Backend",
    svg: (
      <svg viewBox="0 0 40 40" fill="none">
        <text x="4" y="23" fontFamily="monospace" fontWeight="900" fontSize="10" fill="#aaa">EX</text>
        <line x1="4" y1="28" x2="36" y2="28" stroke="#aaa" strokeWidth="1.5"/>
        <line x1="4" y1="12" x2="36" y2="12" stroke="#aaa" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    name: "MongoDB",
    accent: "#4db33d",
    gradient: "linear-gradient(135deg,#4db33d,#2d7a24)",
    category: "Database",
    svg: (
      <svg viewBox="0 0 40 40" fill="none">
        <path d="M20 4 C20 4 28 14 28 22 C28 30 24 36 20 36 C16 36 12 30 12 22 C12 14 20 4 20 4Z" stroke="#4db33d" strokeWidth="2" fill="none"/>
        <line x1="20" y1="30" x2="20" y2="38" stroke="#4db33d" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    name: "PostgreSQL",
    accent: "#336791",
    gradient: "linear-gradient(135deg,#336791,#1a3d5c)",
    category: "Database",
    svg: (
      <svg viewBox="0 0 40 40" fill="none">
        <ellipse cx="20" cy="12" rx="14" ry="5" stroke="#336791" strokeWidth="2"/>
        <path d="M6 12 L6 28 C6 31 12 34 20 34 C28 34 34 31 34 28 L34 12" stroke="#336791" strokeWidth="2" fill="none"/>
        <line x1="6" y1="20" x2="34" y2="20" stroke="#336791" strokeWidth="1.5" strokeDasharray="3 2"/>
      </svg>
    ),
  },
  {
    name: "AWS",
    accent: "#ff9900",
    gradient: "linear-gradient(135deg,#ff9900,#e67300)",
    category: "Cloud",
    svg: (
      <svg viewBox="0 0 40 40" fill="none">
        <path d="M8 22 C6 18 8 12 14 11 C15 7 20 5 24 8 C27 5 34 7 34 13 C38 14 38 22 34 24 L8 24 Z" stroke="#ff9900" strokeWidth="2" fill="none"/>
        <path d="M10 30 C10 30 6 32 10 34" stroke="#ff9900" strokeWidth="1.5"/>
        <path d="M20 30 L20 34" stroke="#ff9900" strokeWidth="1.5"/>
        <path d="M30 30 C30 30 34 32 30 34" stroke="#ff9900" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    name: "Docker",
    accent: "#2496ed",
    gradient: "linear-gradient(135deg,#2496ed,#0d6ec7)",
    category: "DevOps",
    svg: (
      <svg viewBox="0 0 40 40" fill="none">
        <rect x="6" y="16" width="6" height="6" rx="1" stroke="#2496ed" strokeWidth="1.8"/>
        <rect x="14" y="16" width="6" height="6" rx="1" stroke="#2496ed" strokeWidth="1.8"/>
        <rect x="22" y="16" width="6" height="6" rx="1" stroke="#2496ed" strokeWidth="1.8"/>
        <rect x="14" y="8" width="6" height="6" rx="1" stroke="#2496ed" strokeWidth="1.8"/>
        <path d="M6 26 C6 30 10 32 20 32 C30 32 36 28 36 26" stroke="#2496ed" strokeWidth="1.8"/>
        <path d="M30 22 C34 20 36 16 34 14" stroke="#2496ed" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    name: "Tailwind CSS",
    accent: "#38bdf8",
    gradient: "linear-gradient(135deg,#38bdf8,#0ea5e9)",
    category: "Styling",
    svg: (
      <svg viewBox="0 0 40 40" fill="none">
        <path d="M10 20 C10 15 13 12 17 13 C18 10 22 8 26 11 C28 8 34 10 34 16" stroke="#38bdf8" strokeWidth="2" fill="none"/>
        <path d="M6 28 C6 23 9 20 13 21 C14 18 18 16 22 19 C24 16 30 18 30 24" stroke="#38bdf8" strokeWidth="2" fill="none"/>
      </svg>
    ),
  },
  {
    name: "GraphQL",
    accent: "#e10098",
    gradient: "linear-gradient(135deg,#e10098,#a8006e)",
    category: "API",
    svg: (
      <svg viewBox="0 0 40 40" fill="none">
        <polygon points="20,4 34,12 34,28 20,36 6,28 6,12" stroke="#e10098" strokeWidth="2" fill="none"/>
        <circle cx="20" cy="4" r="2.5" fill="#e10098"/>
        <circle cx="34" cy="12" r="2.5" fill="#e10098"/>
        <circle cx="34" cy="28" r="2.5" fill="#e10098"/>
        <circle cx="20" cy="36" r="2.5" fill="#e10098"/>
        <circle cx="6" cy="28" r="2.5" fill="#e10098"/>
        <circle cx="6" cy="12" r="2.5" fill="#e10098"/>
        <line x1="6" y1="12" x2="34" y2="28" stroke="#e10098" strokeWidth="1.2" opacity="0.4"/>
        <line x1="34" y1="12" x2="6" y2="28" stroke="#e10098" strokeWidth="1.2" opacity="0.4"/>
        <line x1="20" y1="4" x2="20" y2="36" stroke="#e10098" strokeWidth="1.2" opacity="0.4"/>
      </svg>
    ),
  },
  {
    name: "Redis",
    accent: "#ff4438",
    gradient: "linear-gradient(135deg,#ff4438,#c0392b)",
    category: "Cache",
    svg: (
      <svg viewBox="0 0 40 40" fill="none">
        <ellipse cx="20" cy="16" rx="14" ry="5" stroke="#ff4438" strokeWidth="2"/>
        <ellipse cx="20" cy="24" rx="14" ry="5" stroke="#ff4438" strokeWidth="2"/>
        <line x1="6" y1="16" x2="6" y2="24" stroke="#ff4438" strokeWidth="2"/>
        <line x1="34" y1="16" x2="34" y2="24" stroke="#ff4438" strokeWidth="2"/>
      </svg>
    ),
  },
];

// Group by category for the category filter - categories are derived dynamically from techStack

interface TechItem {
  name: string;
  accent: string;
  gradient: string;
  category: string;
  svg: React.ReactNode;
}

interface TechCardProps {
  tech: TechItem;
  index: number;
  inView: boolean;
}

// ── Tech card ─────────────────────────────────────────────────────────────────
function TechCard({ tech, index, inView }: TechCardProps) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setMousePos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.7, y: 30 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className="relative cursor-pointer"
      style={{ perspective: 600 }}
    >
      {/* Glow border */}
      <motion.div
        className="absolute -inset-px rounded-2xl pointer-events-none"
        style={{ background: tech.gradient }}
        animate={{ opacity: hovered ? 0.7 : 0 }}
        transition={{ duration: 0.25 }}
      />

      {/* Spotlight */}
      {hovered && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-0"
          style={{ background: `radial-gradient(120px circle at ${mousePos.x}% ${mousePos.y}%, ${tech.accent}20, transparent 70%)` }}
        />
      )}

      <motion.div
        className="relative rounded-2xl overflow-hidden flex flex-col items-center gap-3 py-5 px-3"
        style={{ background: "rgb(11,12,24)", border: "1px solid rgba(255,255,255,0.06)" }}
        animate={{ y: hovered ? -6 : 0, rotateX: hovered ? -4 : 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
      >
        {/* Top strip */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: tech.gradient }}
          animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.35 }}
        />

        {/* Corner glow */}
        <motion.div
          className="absolute top-0 right-0 w-16 h-16 rounded-bl-full pointer-events-none"
          style={{ background: tech.gradient, opacity: 0.06 }}
          animate={{ scale: hovered ? 1.8 : 1, opacity: hovered ? 0.12 : 0.06 }}
          transition={{ duration: 0.4 }}
        />

        {/* SVG icon */}
        <motion.div
          className="relative z-10 flex items-center justify-center"
          style={{ width: 44, height: 44 }}
          animate={{
            scale: hovered ? 1.15 : 1,
            rotate: hovered ? 6 : 0,
            filter: hovered ? `drop-shadow(0 0 12px ${tech.accent}90)` : "none",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          {tech.svg}
        </motion.div>

        {/* Name */}
        <span
          className="relative z-10 font-bold text-center leading-tight"
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "0.72rem",
            letterSpacing: "-0.01em",
            color: hovered ? "#fff" : "rgba(255,255,255,0.55)",
            transition: "color 0.3s",
          }}
        >
          {tech.name}
        </span>

        {/* Category pill — only on hover */}
        <motion.span
          className="relative z-10 text-xs px-2 py-0.5 rounded-full font-bold"
          style={{
            fontFamily: "'Space Mono', monospace",
            background: `${tech.accent}15`,
            border: `1px solid ${tech.accent}30`,
            color: tech.accent,
            fontSize: "0.55rem",
            letterSpacing: "0.04em",
          }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 4 }}
          transition={{ duration: 0.2 }}
        >
          {tech.category}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

interface OrbProps {
  style: React.CSSProperties;
  color: string;
  size: number;
  dur: number;
  delay: number;
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
export default function TechStackSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeCategory, setActiveCategory] = useState("All");

  const availableCategories = ["All", ...Array.from(new Set(techStack.map((t) => t.category)))];
  const filtered = activeCategory === "All" ? techStack : techStack.filter((t) => t.category === activeCategory);

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
          className="text-center mb-14"
          initial={{ opacity: 0, y: 36 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-indigo-500" />
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-400" style={{ fontFamily: "'Space Mono', monospace" }}>
              Tools & Tech
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
            Technology Stack
          </h2>

          <p
            className="text-lg max-w-xl mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.38)", fontWeight: 300, lineHeight: 1.8 }}
          >
            Modern tools and frameworks I use to build powerful, production-grade applications.
          </p>
        </motion.div>

        {/* Category filter pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          {availableCategories.map((cat) => {
            const isActive = cat === activeCategory;
            const matchTech = techStack.find((t) => t.category === cat);
            const accent = matchTech ? matchTech.accent : "#6366f1";
            return (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  background: isActive ? (matchTech ? matchTech.gradient : "linear-gradient(135deg,#6366f1,#8b5cf6)") : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isActive ? accent : "rgba(255,255,255,0.08)"}`,
                  color: isActive ? (cat === "All" ? "#fff" : "#020209") : "rgba(255,255,255,0.4)",
                  letterSpacing: "0.04em",
                  boxShadow: isActive ? `0 0 16px ${accent}50` : "none",
                  cursor: "pointer",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                {cat}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Tech grid */}
        <motion.div
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 lg:gap-4"
          layout
        >
          {filtered.map((tech, i) => (
            <TechCard key={tech.name} tech={tech} index={i} inView={inView} />
          ))}
        </motion.div>

        {/* Bottom count bar */}
        <motion.div
          className="mt-12 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="h-px flex-1 max-w-24" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.08))" }} />
          <span
            className="text-xs font-bold"
            style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em" }}
          >
            {filtered.length} of {techStack.length} technologies
          </span>
          <div className="h-px flex-1 max-w-24" style={{ background: "linear-gradient(270deg,transparent,rgba(255,255,255,0.08))" }} />
        </motion.div>
      </div>
    </section>
  );
}