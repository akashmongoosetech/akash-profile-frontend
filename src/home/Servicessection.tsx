import { useRef, useState, CSSProperties } from "react";
import { motion, useInView } from "framer-motion";
import { Code, Database, Smartphone, Cloud, CheckCircle, ArrowRight, ArrowUpRight, LucideIcon } from "lucide-react";

interface Service {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  accentColor: string;
  glowColor: string;
  tag: string;
  features: string[];
  number: string;
}

const services = [
  {
    title: "Frontend Development",
    description: "Pixel-perfect, blazing-fast web applications built with modern React & Next.js. Every interaction is deliberate, every animation purposeful.",
    icon: Code,
    gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
    accentColor: "#60a5fa",
    glowColor: "rgba(59,130,246,0.25)",
    tag: "UI / UX",
    features: ["React & Next.js", "TypeScript", "Tailwind CSS", "PWA Development"],
    number: "01",
  },
  {
    title: "Backend Development",
    description: "Scalable APIs and server-side architectures that handle millions of requests without breaking a sweat. Clean, documented, and battle-tested.",
    icon: Database,
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    accentColor: "#34d399",
    glowColor: "rgba(16,185,129,0.25)",
    tag: "APIs / DBs",
    features: ["Node.js & Express", "Python & Django", "RESTful APIs", "GraphQL"],
    number: "02",
  },
  {
    title: "Mobile Development",
    description: "Cross-platform mobile apps that feel native on every device. Ship once, run everywhere — with no compromise on performance or UX.",
    icon: Smartphone,
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
    accentColor: "#c084fc",
    glowColor: "rgba(139,92,246,0.25)",
    tag: "iOS / Android",
    features: ["React Native", "Flutter", "iOS & Android", "App Store Deployment"],
    number: "03",
  },
  {
    title: "Cloud & DevOps",
    description: "From zero to production with CI/CD pipelines, containerised services, and auto-scaling cloud infrastructure. Sleep well knowing your app is solid.",
    icon: Cloud,
    gradient: "linear-gradient(135deg, #f97316 0%, #ef4444 100%)",
    accentColor: "#fb923c",
    glowColor: "rgba(249,115,22,0.25)",
    tag: "AWS / Docker",
    features: ["AWS & Azure", "Docker & Kubernetes", "CI/CD Pipelines", "Monitoring"],
    number: "04",
  },
];

// ── Animated grid lines in card bg ──────────────────────────────────────────
interface CardGridProps {
  color: string;
}

function CardGrid({ color }: CardGridProps) {
  return (
    <div
      className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden"
      style={{ opacity: 0.06 }}
    >
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}

// ── Corner accent ────────────────────────────────────────────────────────────
interface CornerAccentProps {
  gradient: string;
}

function CornerAccent({ gradient }: CornerAccentProps) {
  return (
    <div
      className="absolute top-0 right-0 w-28 h-28 pointer-events-none"
      style={{
        background: gradient,
        opacity: 0.07,
        borderRadius: "0 1.5rem 0 100%",
      }}
    />
  );
}

// ── Floating tag badge ───────────────────────────────────────────────────────
interface TagBadgeProps {
  label: string;
  color: string;
}

function TagBadge({ label, color }: TagBadgeProps) {
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase"
      style={{
        fontFamily: "'Space Mono', monospace",
        background: `${color}18`,
        border: `1px solid ${color}35`,
        color,
      }}
    >
      {label}
    </span>
  );
}

// ── Single service card ──────────────────────────────────────────────────────
interface ServiceCardProps {
  service: Service;
  index: number;
  inView: boolean;
}

function ServiceCard({ service, index, inView }: ServiceCardProps) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const Icon = service.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.13, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className="relative group"
      style={{ perspective: 1000 }}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute -inset-px rounded-3xl pointer-events-none"
        style={{ background: service.gradient }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.35 }}
      />

      {/* Mouse spotlight */}
      {hovered && (
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none z-0"
          style={{
            background: `radial-gradient(280px circle at ${mousePos.x}% ${mousePos.y}%, ${service.glowColor}, transparent 70%)`,
          }}
        />
      )}

      {/* Card */}
      <motion.div
        className="relative rounded-3xl overflow-hidden h-full"
        style={{
          background: "rgb(10, 11, 22)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
        animate={{
          rotateX: hovered ? -2 : 0,
          rotateY: hovered ? 2 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <CardGrid color={service.accentColor} />
        <CornerAccent gradient={service.gradient} />

        {/* Top gradient line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: service.gradient }}
          animate={{ scaleX: hovered ? 1 : 0.4, opacity: hovered ? 1 : 0.5 }}
          transition={{ duration: 0.4 }}
        />

        <div className="relative z-10 p-8 flex flex-col gap-6 h-full">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <motion.div
                className="relative w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: service.gradient }}
                animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 6 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                {/* Icon glow pulse */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: service.gradient }}
                  animate={{ scale: hovered ? 1.5 : 1, opacity: hovered ? 0 : 0 }}
                  transition={{ duration: 0.5 }}
                />
                <Icon className="w-6 h-6 text-white relative z-10" strokeWidth={1.8} />
              </motion.div>

              {/* Number */}
              <span
                className="font-black opacity-10 leading-none"
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: "3.5rem",
                  color: service.accentColor,
                  letterSpacing: "-0.06em",
                  lineHeight: 1,
                  transition: "opacity 0.3s",
                  ...(hovered ? { opacity: 0.18 } : {}),
                }}
              >
                {service.number}
              </span>
            </div>

            {/* Arrow + tag */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              <motion.div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${service.accentColor}15`, border: `1px solid ${service.accentColor}30` }}
                animate={{ rotate: hovered ? 45 : 0, scale: hovered ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <ArrowUpRight
                  className="w-4 h-4"
                  style={{ color: service.accentColor }}
                  strokeWidth={2}
                />
              </motion.div>
              <TagBadge label={service.tag} color={service.accentColor} />
            </div>
          </div>

          {/* Title */}
          <div>
            <h3
              className="font-bold mb-3 leading-tight"
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: "clamp(1.3rem, 2vw, 1.6rem)",
                letterSpacing: "-0.03em",
                color: "#fff",
              }}
            >
              {service.title}
            </h3>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.75,
                fontSize: "0.95rem",
                fontWeight: 300,
              }}
            >
              {service.description}
            </p>
          </div>

          {/* Divider */}
          <motion.div
            className="h-px w-full"
            style={{ background: `linear-gradient(90deg, ${service.accentColor}40, transparent)` }}
            animate={{ opacity: hovered ? 1 : 0.4 }}
          />

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 flex-1">
            {service.features.map((feature: string, i: number) => (
              <motion.div
                key={feature}
                className="flex items-center gap-2.5"
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.13 + 0.3 + i * 0.07, duration: 0.5 }}
              >
                <motion.div
                  animate={{ scale: hovered ? 1.2 : 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <CheckCircle
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: service.accentColor }}
                    strokeWidth={2}
                  />
                </motion.div>
                <span
                  className="text-sm"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: hovered ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.45)",
                    transition: "color 0.3s",
                  }}
                >
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Learn more link */}
          <motion.div
            className="flex items-center gap-2 mt-auto pt-2"
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
            transition={{ duration: 0.25 }}
          >
            <span
              className="text-sm font-semibold"
              style={{ fontFamily: "'Sora', sans-serif", color: service.accentColor }}
            >
              Learn more
            </span>
            <motion.div animate={{ x: hovered ? 4 : 0 }} transition={{ duration: 0.2 }}>
              <ArrowRight className="w-4 h-4" style={{ color: service.accentColor }} />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Floating orb background ──────────────────────────────────────────────────
interface OrbProps {
  style: CSSProperties;
  color: string;
  size: number;
  dur: number;
  delay: number;
}

function Orb({ style, color, size, dur, delay }: OrbProps) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl pointer-events-none"
      style={{ width: size, height: size, background: color, ...style }}
      animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.3, 0.15] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ── Main export ──────────────────────────────────────────────────────────────
export default function ServicesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative py-28 overflow-hidden"
      style={{ background: "#020209" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=Space+Mono:wght@400;700&display=swap');
      `}</style>

      {/* Background orbs */}
      <Orb style={{ top: "-5%", left: "-8%" }} color="radial-gradient(circle, rgba(59,130,246,0.45), transparent 70%)" size={550} dur={8} delay={0} />
      <Orb style={{ bottom: "-10%", right: "-6%" }} color="radial-gradient(circle, rgba(139,92,246,0.35), transparent 70%)" size={480} dur={10} delay={2} />
      <Orb style={{ top: "40%", left: "45%" }} color="radial-gradient(circle, rgba(16,185,129,0.18), transparent 70%)" size={350} dur={12} delay={1} />

      {/* Grid texture */}
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
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
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
              What I do best
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
            Services That Ship
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
            Comprehensive development services — from design system to deployment pipeline —
            built to transform your ideas into production-grade digital products.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} inView={inView} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <a
            href="/services"
            className="inline-flex items-center gap-3 px-9 py-4 rounded-2xl font-bold text-base text-white relative overflow-hidden group"
            style={{
              fontFamily: "'Sora', sans-serif",
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              boxShadow: "0 0 40px rgba(99,102,241,0.35)",
              textDecoration: "none",
            }}
          >
            {/* Shimmer on hover */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)",
              }}
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.55 }}
            />
            <span className="relative z-10">View All Services</span>
            <motion.div
              className="relative z-10"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </a>

          <p
            className="mt-4 text-sm"
            style={{
              fontFamily: "'Space Mono', monospace",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            Free consultation · Quick response · Quality guaranteed
          </p>
        </motion.div>
      </div>
    </section>
  );
}