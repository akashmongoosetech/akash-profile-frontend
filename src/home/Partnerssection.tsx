import { useRef, useState, CSSProperties } from "react";
import { motion, useInView } from "framer-motion";

// ── Type definitions ──────────────────────────────────────────────────────────
interface Partner {
  name: string;
  emoji: string;
  desc: string;
  accent: string;
  gradient: string;
  year: string;
}

interface PartnerCardProps {
  partner: Partner;
  index: number;
  inView: boolean;
}

interface MarqueeRowProps {
  items: Partner[];
  direction?: number;
  speed?: number;
}

interface OrbProps {
  style?: CSSProperties;
  color: string;
  size: number;
  dur: number;
  delay: number;
}

const partners: Partner[] = [
  {
    name: "Bhargava Clinic",
    emoji: "🏥",
    desc: "Healthcare Management",
    accent: "#38bdf8",
    gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)",
    year: "2024",
  },
  {
    name: "Sneh Jeet",
    emoji: "🤝",
    desc: "Community Services",
    accent: "#4ade80",
    gradient: "linear-gradient(135deg,#10b981,#22c55e)",
    year: "2023",
  },
  {
    name: "Azad Infrastructure",
    emoji: "🏗️",
    desc: "Construction & Build",
    accent: "#fb923c",
    gradient: "linear-gradient(135deg,#f97316,#ef4444)",
    year: "2024",
  },
  {
    name: "Shri Balaji Homestay",
    emoji: "🏨",
    desc: "Hospitality & Booking",
    accent: "#c084fc",
    gradient: "linear-gradient(135deg,#8b5cf6,#a855f7)",
    year: "2023",
  },
  {
    name: "Anjani Events",
    emoji: "🎉",
    desc: "Event Management",
    accent: "#f472b6",
    gradient: "linear-gradient(135deg,#ec4899,#f43f5e)",
    year: "2024",
  },
  {
    name: "Tripod Wellness",
    emoji: "💆",
    desc: "Spa & Wellness",
    accent: "#34d399",
    gradient: "linear-gradient(135deg,#10b981,#84cc16)",
    year: "2024",
  },
];

// ── Single partner card ───────────────────────────────────────────────────────
function PartnerCard({ partner, index, inView }: PartnerCardProps) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current;
    if (!r) return;
    const rect = r.getBoundingClientRect();
    setMousePos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className="relative cursor-pointer flex-1"
      style={{ minWidth: 180, maxWidth: 220, perspective: 800 }}
    >
      {/* Glow border */}
      <motion.div
        className="absolute -inset-px rounded-3xl pointer-events-none"
        style={{ background: partner.gradient }}
        animate={{ opacity: hovered ? 0.7 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Mouse spotlight */}
      {hovered && (
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none z-0"
          style={{ background: `radial-gradient(160px circle at ${mousePos.x}% ${mousePos.y}%, ${partner.accent}22, transparent 70%)` }}
        />
      )}

      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        animate={{ boxShadow: hovered ? `0 20px 60px ${partner.accent}20` : "none" }}
        transition={{ duration: 0.35 }}
      />

      <motion.div
        className="relative rounded-3xl overflow-hidden flex flex-col items-center py-8 px-6 gap-4"
        style={{ background: "rgb(11,12,24)", border: "1px solid rgba(255,255,255,0.06)" }}
        animate={{ y: hovered ? -6 : 0, rotateX: hovered ? -2 : 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
      >
        {/* Top strip */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: partner.gradient, boxShadow: hovered ? `0 0 10px ${partner.accent}` : "none" }}
          animate={{ scaleX: hovered ? 1 : 0.2, opacity: hovered ? 1 : 0.35 }}
          transition={{ duration: 0.4 }}
        />

        {/* BG grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(${partner.accent} 1px,transparent 1px),linear-gradient(90deg,${partner.accent} 1px,transparent 1px)`,
            backgroundSize: "24px 24px",
            opacity: 0.03,
          }}
        />

        {/* Corner glow */}
        <motion.div
          className="absolute top-0 right-0 w-20 h-20 rounded-bl-full pointer-events-none"
          style={{ background: partner.gradient, opacity: 0.07 }}
          animate={{ scale: hovered ? 1.6 : 1, opacity: hovered ? 0.12 : 0.07 }}
          transition={{ duration: 0.45 }}
        />

        {/* Emoji with ring */}
        <motion.div
          className="relative z-10 flex items-center justify-center"
          animate={{ scale: hovered ? 1.15 : 1, rotate: hovered ? 8 : 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
        >
          {/* Glow ring */}
          <motion.div
            className="absolute w-16 h-16 rounded-full"
            style={{ background: `radial-gradient(circle, ${partner.accent}30, transparent 70%)` }}
            animate={{ scale: hovered ? 1.4 : 1, opacity: hovered ? 1 : 0.5 }}
            transition={{ duration: 0.4 }}
          />
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl relative z-10"
            style={{
              background: hovered ? partner.gradient : "rgba(255,255,255,0.05)",
              border: `1px solid ${hovered ? "transparent" : partner.accent + "25"}`,
              boxShadow: hovered ? `0 0 24px ${partner.accent}60` : "none",
              transition: "all 0.3s",
            }}
          >
            {partner.emoji}
          </div>
        </motion.div>

        {/* Year badge */}
        <motion.span
          className="relative z-10 text-xs font-bold px-2 py-0.5 rounded-full"
          style={{
            fontFamily: "'Space Mono', monospace",
            background: `${partner.accent}14`,
            border: `1px solid ${partner.accent}28`,
            color: partner.accent,
            letterSpacing: "0.06em",
          }}
          animate={{ opacity: hovered ? 1 : 0.6, scale: hovered ? 1.05 : 1 }}
        >
          Since {partner.year}
        </motion.span>

        {/* Name */}
        <h3
          className="relative z-10 font-black text-white text-center leading-tight"
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "0.95rem",
            letterSpacing: "-0.03em",
            color: hovered ? "#fff" : "rgba(255,255,255,0.85)",
            transition: "color 0.3s",
          }}
        >
          {partner.name}
        </h3>

        {/* Divider */}
        <motion.div
          className="relative z-10 w-full h-px"
          style={{ background: `linear-gradient(90deg,transparent,${partner.accent}45,transparent)` }}
          animate={{ opacity: hovered ? 1 : 0.3 }}
        />

        {/* Description */}
        <p
          className="relative z-10 text-center text-xs"
          style={{
            fontFamily: "'Space Mono', monospace",
            color: hovered ? partner.accent : "rgba(255,255,255,0.25)",
            letterSpacing: "0.04em",
            transition: "color 0.3s",
            fontSize: "0.65rem",
          }}
        >
          {partner.desc}
        </p>
      </motion.div>
    </motion.div>
  );
}

// ── Infinite marquee row ──────────────────────────────────────────────────────
function MarqueeRow({ items, direction = 1, speed = 40 }: MarqueeRowProps) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden w-full" style={{ maskImage: "linear-gradient(90deg,transparent,black 10%,black 90%,transparent)" }}>
      <motion.div
        className="flex gap-4 w-max"
        animate={{ x: direction > 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((p, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-5 py-2.5 rounded-full flex-shrink-0"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span className="text-xl">{p.emoji}</span>
            <span
              className="font-bold text-sm whitespace-nowrap"
              style={{ fontFamily: "'Sora', sans-serif", color: "rgba(255,255,255,0.4)", letterSpacing: "-0.02em" }}
            >
              {p.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
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
export default function PartnersSection() {
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
              Clients & Partners
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
            Trusted By
          </h2>

          <p
            className="text-lg max-w-xl mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.38)", fontWeight: 300, lineHeight: 1.8 }}
          >
            Organizations I've had the privilege to partner with and build for.
          </p>
        </motion.div>

        {/* ── Cards grid ── */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {partners.map((partner, i) => (
            <PartnerCard key={partner.name} partner={partner} index={i} inView={inView} />
          ))}
        </div>

        {/* ── Infinite marquee strip ── */}
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <MarqueeRow items={partners} direction={1} speed={35} />
          <MarqueeRow items={[...partners].reverse()} direction={-1} speed={45} />
        </motion.div>

        {/* Bottom stat */}
        <motion.div
          className="mt-12 flex items-center justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          {[
            { value: "6+", label: "Partners" },
            { value: "100%", label: "Satisfaction" },
            { value: "3+", label: "Years" },
          ].map(({ value, label }, i, arr) => (
            <div key={label} className="flex items-center gap-6">
              <div className="text-center">
                <div className="font-black text-white" style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.5rem", letterSpacing: "-0.05em" }}>
                  {value}
                </div>
                <div className="text-xs" style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.25)" }}>
                  {label}
                </div>
              </div>
              {i < arr.length - 1 && <div className="w-px h-8" style={{ background: "rgba(255,255,255,0.07)" }} />}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}