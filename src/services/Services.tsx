import { useRef, useState, CSSProperties } from "react";
import { Helmet } from "react-helmet-async";
import { motion, useInView } from "framer-motion";
import { LucideIcon } from "lucide-react";
import {
  Code, Smartphone, Cloud, Palette, Database, Shield, Zap, ArrowRight,
  Code2, Search, Headphones, ClipboardList, Server,
  TestTube, Rocket, Check, ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";

// ── Types ──────────────────────────────────────────────────────────────────────
interface ServiceData {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  accent: string;
  gradient: string;
  glow: string;
  tag: string;
  price: string;
}

interface ProcessData {
  step: string;
  icon: LucideIcon;
  title: string;
  accent: string;
  gradient: string;
  description: string;
}

interface FeatureData {
  icon: LucideIcon;
  title: string;
  accent: string;
  gradient: string;
  description: string;
  result: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const services: ServiceData[] = [
  {
    icon: Code, title: "Frontend Development",
    description: "Modern, responsive web applications built with the latest technologies",
    features: ["React & Next.js", "TypeScript", "Tailwind CSS", "Progressive Web Apps"],
    accent: "#38bdf8", gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)", glow: "rgba(56,189,248,0.18)",
    tag: "Frontend", price: "Starting at ₹6,000",
  },
  {
    icon: Database, title: "Backend Development",
    description: "Scalable server-side solutions and robust API development",
    features: ["Node.js & Express", "Python & Django", "RESTful APIs", "GraphQL"],
    accent: "#4ade80", gradient: "linear-gradient(135deg,#10b981,#22c55e)", glow: "rgba(74,222,128,0.18)",
    tag: "Backend", price: "Starting at ₹7,000",
  },
  {
    icon: Smartphone, title: "Mobile Development",
    description: "Cross-platform mobile applications for iOS and Android",
    features: ["React Native", "Flutter", "Native Performance", "App Store Deployment"],
    accent: "#c084fc", gradient: "linear-gradient(135deg,#8b5cf6,#a855f7)", glow: "rgba(192,132,252,0.18)",
    tag: "Mobile", price: "Starting at ₹15,000",
  },
  {
    icon: Cloud, title: "Cloud & DevOps",
    description: "Cloud infrastructure setup and deployment automation",
    features: ["AWS & Azure", "Docker & Kubernetes", "CI/CD Pipelines", "Monitoring & Scaling"],
    accent: "#fb923c", gradient: "linear-gradient(135deg,#f97316,#ef4444)", glow: "rgba(251,146,60,0.18)",
    tag: "DevOps", price: "Starting at ₹25,000",
  },
  {
    icon: Palette, title: "UI/UX Design",
    description: "Beautiful, user-centered design that converts visitors to customers",
    features: ["Figma Design", "Prototyping", "User Research", "Design Systems"],
    accent: "#f472b6", gradient: "linear-gradient(135deg,#ec4899,#f43f5e)", glow: "rgba(244,114,182,0.18)",
    tag: "Design", price: "Starting at ₹4,500",
  },
  {
    icon: Shield, title: "Security & Testing",
    description: "Comprehensive security audits and automated testing solutions",
    features: ["Security Audits", "Automated Testing", "Performance Testing", "Code Reviews"],
    accent: "#818cf8", gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)", glow: "rgba(129,140,248,0.18)",
    tag: "Security", price: "Starting at ₹3,500",
  },
];

const process: ProcessData[] = [
  { step: "01", icon: ClipboardList, title: "Requirement Analysis", accent: "#fbbf24", gradient: "linear-gradient(135deg,#f59e0b,#f97316)", description: "I start by understanding your business goals, target audience, and technical requirements to create a detailed project roadmap." },
  { step: "02", icon: Palette,       title: "UI/UX Design",          accent: "#f472b6", gradient: "linear-gradient(135deg,#ec4899,#f43f5e)", description: "I create intuitive, visually appealing designs with focus on user experience, accessibility, and brand consistency." },
  { step: "03", icon: Code2,         title: "Frontend Development",  accent: "#38bdf8", gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)", description: "I build responsive, performant interfaces using modern frameworks like React with clean, maintainable code." },
  { step: "04", icon: Server,        title: "Backend Development",   accent: "#4ade80", gradient: "linear-gradient(135deg,#10b981,#22c55e)", description: "I develop robust APIs and database structures that ensure scalability, security, and seamless data flow." },
  { step: "05", icon: TestTube,      title: "Testing & Optimization",accent: "#c084fc", gradient: "linear-gradient(135deg,#8b5cf6,#a855f7)", description: "I conduct thorough testing including unit tests, integration tests, and performance optimization for optimal results." },
  { step: "06", icon: Rocket,        title: "Deployment & Maintenance", accent: "#fb923c", gradient: "linear-gradient(135deg,#f97316,#ef4444)", description: "I deploy your application to production and provide ongoing maintenance, updates, and support services." },
];

const features: FeatureData[] = [
  { icon: Code2,      title: "Clean & Maintainable Code",      accent: "#38bdf8", gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)", description: "Every project is structured with best practices, modular architecture, and readable standards. Your project remains easy to scale, debug, and upgrade.", result: "Long-term stability with lower maintenance costs." },
  { icon: Zap,        title: "Fast & Reliable Delivery",        accent: "#fbbf24", gradient: "linear-gradient(135deg,#f59e0b,#f97316)", description: "I respect timelines and follow a structured development workflow. From planning to deployment, I ensure smooth execution without unnecessary delays.", result: "Faster launch. Faster results." },
  { icon: Search,     title: "SEO-Optimized Development",       accent: "#4ade80", gradient: "linear-gradient(135deg,#10b981,#22c55e)", description: "Websites are built with proper semantic HTML, optimized performance, clean URLs, and structured metadata for maximum search visibility.", result: "Better search engine visibility and higher organic traffic." },
  { icon: Smartphone, title: "Fully Responsive Design",         accent: "#c084fc", gradient: "linear-gradient(135deg,#8b5cf6,#a855f7)", description: "Your website will look and perform flawlessly across all devices — desktop, tablet, and mobile. No compromises.", result: "Improved user experience and higher engagement." },
  { icon: Shield,     title: "Secure & Scalable Architecture",  accent: "#f472b6", gradient: "linear-gradient(135deg,#ec4899,#f43f5e)", description: "I implement secure authentication, protected APIs, optimized databases, and scalable backend structures that grow with your business.", result: "A solution that grows with your business." },
  { icon: Headphones, title: "Ongoing Support & Improvements",  accent: "#818cf8", gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)", description: "My work doesn't end after deployment. I provide continuous support, updates, and performance improvements post-launch.", result: "Long-term partnership, not just a one-time project." },
];

// ── Utility components ────────────────────────────────────────────────────────
function Orb({ style, color, size, dur, delay }: { style?: CSSProperties; color?: string; size?: number | string; dur?: number; delay?: number }) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl pointer-events-none"
      style={{ width: size, height: size, background: color, ...style }}
      animate={{ scale: [1, 1.28, 1], opacity: [0.08, 0.18, 0.08] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-3 mb-5">
      <div className="h-px w-10 bg-gradient-to-r from-transparent to-indigo-500" />
      <span className="text-xs font-bold tracking-widest uppercase text-indigo-400" style={{ fontFamily: "'Space Mono', monospace" }}>{text}</span>
      <div className="h-px w-10 bg-gradient-to-l from-transparent to-indigo-500" />
    </div>
  );
}

function SectionHeader({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-16">
      <SectionLabel text={label} />
      <h2 className="font-black leading-tight mb-4" style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(2.2rem,4.5vw,3.5rem)", letterSpacing: "-0.04em", background: "linear-gradient(135deg,#fff 30%,rgba(255,255,255,0.4) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{title}</h2>
      {subtitle && <p className="text-lg max-w-2xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.38)", fontWeight: 300, lineHeight: 1.8 }}>{subtitle}</p>}
    </div>
  );
}

// ── Service card ──────────────────────────────────────────────────────────────
function ServiceCard({ service, index, inView }: { service: ServiceData; index: number; inView: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const ref = useRef<HTMLDivElement>(null);
  const Icon = service.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setMousePos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.94 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.09, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className="relative flex flex-col"
      style={{ perspective: 900 }}
    >
      <motion.div className="absolute -inset-px rounded-3xl pointer-events-none" style={{ background: service.gradient }} animate={{ opacity: hovered ? 0.6 : 0 }} transition={{ duration: 0.3 }} />
      {hovered && <div className="absolute inset-0 rounded-3xl pointer-events-none z-0" style={{ background: `radial-gradient(200px circle at ${mousePos.x}% ${mousePos.y}%, ${service.glow}, transparent 70%)` }} />}
      <motion.div className="absolute inset-0 rounded-3xl pointer-events-none" animate={{ boxShadow: hovered ? `0 24px 64px ${service.accent}20` : "none" }} transition={{ duration: 0.35 }} />

      <motion.div
        className="relative rounded-3xl overflow-hidden flex flex-col h-full"
        style={{ background: "rgb(11,12,24)", border: "1px solid rgba(255,255,255,0.06)" }}
        animate={{ y: hovered ? -6 : 0, rotateX: hovered ? -2 : 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
      >
        <motion.div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: service.gradient }} animate={{ scaleX: hovered ? 1 : 0.2, opacity: hovered ? 1 : 0.35 }} transition={{ duration: 0.4 }} />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(${service.accent} 1px,transparent 1px),linear-gradient(90deg,${service.accent} 1px,transparent 1px)`, backgroundSize: "26px 26px", opacity: 0.03 }} />
        <motion.div className="absolute top-0 right-0 w-28 h-28 rounded-bl-full pointer-events-none" style={{ background: service.gradient, opacity: 0.07 }} animate={{ scale: hovered ? 1.6 : 1, opacity: hovered ? 0.11 : 0.07 }} transition={{ duration: 0.5 }} />

        <div className="relative z-10 p-6 flex flex-col gap-4 flex-1">
          {/* Header */}
          <div className="flex items-center justify-between">
            <motion.div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: service.gradient }}
              animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 8 : 0, boxShadow: hovered ? `0 0 20px ${service.accent}60` : "none" }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <Icon className="w-6 h-6 text-white" strokeWidth={1.8} />
            </motion.div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ fontFamily: "'Space Mono', monospace", background: `${service.accent}14`, border: `1px solid ${service.accent}28`, color: service.accent, letterSpacing: "0.04em" }}>{service.tag}</span>
          </div>

          <h3 className="font-black text-white leading-tight" style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.1rem", letterSpacing: "-0.03em" }}>{service.title}</h3>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", lineHeight: 1.7, fontWeight: 300 }}>{service.description}</p>

          <motion.div className="h-px" style={{ background: `linear-gradient(90deg,${service.accent}45,transparent)` }} animate={{ opacity: hovered ? 1 : 0.3 }} />

          {/* Features */}
          <div className="flex flex-col gap-2 flex-1">
            {service.features.map((f) => (
              <div key={f} className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0" style={{ background: `${service.accent}18`, border: `1px solid ${service.accent}30` }}>
                  <Check className="w-2.5 h-2.5" style={{ color: service.accent }} strokeWidth={2.5} />
                </div>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", fontWeight: 300 }}>{f}</span>
              </div>
            ))}
          </div>

          <motion.div className="h-px" style={{ background: `linear-gradient(90deg,${service.accent}25,transparent)` }} animate={{ opacity: hovered ? 1 : 0.2 }} />

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="font-black" style={{ fontFamily: "'Sora', sans-serif", color: service.accent, fontSize: "0.9rem", letterSpacing: "-0.02em" }}>{service.price}</span>
            <motion.div className="flex items-center gap-1 text-xs font-bold" style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.25)" }} animate={{ x: hovered ? 4 : 0 }} transition={{ type: "spring", stiffness: 400 }}>
              <span style={{ color: hovered ? service.accent : "rgba(255,255,255,0.2)", transition: "color 0.3s" }}>Get Quote</span>
              <ChevronRight className="w-3 h-3" style={{ color: hovered ? service.accent : "rgba(255,255,255,0.2)", transition: "color 0.3s" }} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Process card ──────────────────────────────────────────────────────────────
function ProcessCard({ item, index, inView }: { item: ProcessData; index: number; inView: boolean }) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative"
      style={{ perspective: 700 }}
    >
      <motion.div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ background: item.gradient }} animate={{ opacity: hovered ? 0.5 : 0 }} transition={{ duration: 0.3 }} />
      <motion.div
        className="relative rounded-2xl overflow-hidden p-5 flex flex-col gap-3"
        style={{ background: "rgb(11,12,24)", border: "1px solid rgba(255,255,255,0.06)" }}
        animate={{ y: hovered ? -4 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        <motion.div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: item.gradient }} animate={{ scaleX: hovered ? 1 : 0.2, opacity: hovered ? 1 : 0.3 }} transition={{ duration: 0.4 }} />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(${item.accent} 1px,transparent 1px),linear-gradient(90deg,${item.accent} 1px,transparent 1px)`, backgroundSize: "22px 22px", opacity: 0.03 }} />

        {/* Ghost step */}
        <div className="absolute bottom-2 right-3 font-black pointer-events-none select-none" style={{ fontFamily: "'Sora', sans-serif", fontSize: "4rem", color: item.accent, opacity: hovered ? 0.1 : 0.04, letterSpacing: "-0.06em", lineHeight: 1, transition: "opacity 0.4s" }}>{item.step}</div>

        <div className="flex items-center justify-between relative z-10">
          <motion.div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: item.gradient }}
            animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 8 : 0, boxShadow: hovered ? `0 0 18px ${item.accent}60` : "none" }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}>
            <Icon className="w-5 h-5 text-white" strokeWidth={1.8} />
          </motion.div>
          <span className="font-black text-xs" style={{ fontFamily: "'Space Mono', monospace", color: item.accent, opacity: 0.7 }}>STEP {item.step}</span>
        </div>

        <h3 className="font-black text-white relative z-10" style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.95rem", letterSpacing: "-0.03em" }}>{item.title}</h3>
        <p className="relative z-10 text-xs leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.38)", lineHeight: 1.7, fontWeight: 300 }}>{item.description}</p>
      </motion.div>
    </motion.div>
  );
}

// ── Why Choose Me card ────────────────────────────────────────────────────────
function FeatureCard({ feature, index, inView }: { feature: FeatureData; index: number; inView: boolean }) {
  const [hovered, setHovered] = useState(false);
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative"
      style={{ perspective: 700 }}
    >
      <motion.div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ background: feature.gradient }} animate={{ opacity: hovered ? 0.5 : 0 }} transition={{ duration: 0.3 }} />
      <motion.div
        className="relative rounded-2xl overflow-hidden p-5 flex flex-col gap-4 h-full"
        style={{ background: "rgb(11,12,24)", border: "1px solid rgba(255,255,255,0.06)" }}
        animate={{ y: hovered ? -4 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        <motion.div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: feature.gradient }} animate={{ scaleX: hovered ? 1 : 0.2, opacity: hovered ? 1 : 0.3 }} transition={{ duration: 0.4 }} />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(${feature.accent} 1px,transparent 1px),linear-gradient(90deg,${feature.accent} 1px,transparent 1px)`, backgroundSize: "22px 22px", opacity: 0.03 }} />
        <motion.div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full pointer-events-none" style={{ background: feature.gradient, opacity: 0.07 }} animate={{ scale: hovered ? 1.5 : 1 }} transition={{ duration: 0.4 }} />

        <div className="flex items-center justify-between relative z-10">
          <motion.div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: feature.gradient }}
            animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 8 : 0, boxShadow: hovered ? `0 0 18px ${feature.accent}60` : "none" }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}>
            <Icon className="w-5 h-5 text-white" strokeWidth={1.8} />
          </motion.div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ fontFamily: "'Space Mono', monospace", background: `${feature.accent}12`, border: `1px solid ${feature.accent}25`, color: feature.accent, fontSize: "0.58rem" }}>Why Me</span>
        </div>

        <h3 className="font-black text-white relative z-10" style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.95rem", letterSpacing: "-0.03em" }}>{feature.title}</h3>
        <p className="relative z-10 flex-1" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.38)", fontSize: "0.82rem", lineHeight: 1.7, fontWeight: 300 }}>{feature.description}</p>

        <motion.div className="h-px" style={{ background: `linear-gradient(90deg,${feature.accent}40,transparent)` }} animate={{ opacity: hovered ? 1 : 0.3 }} />

        <div className="flex items-center gap-2 relative z-10">
          <motion.div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0" style={{ background: `${feature.accent}18`, border: `1px solid ${feature.accent}30` }}>
            <Check className="w-2.5 h-2.5" style={{ color: feature.accent }} strokeWidth={2.5} />
          </motion.div>
          <span style={{ fontFamily: "'Space Mono', monospace", color: hovered ? feature.accent : "rgba(255,255,255,0.3)", fontSize: "0.62rem", transition: "color 0.3s", letterSpacing: "0.02em" }}>{feature.result}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Hero section ──────────────────────────────────────────────────────────────
function Hero() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    x: Math.random() * 100, y: Math.random() * 100,
    size: 2 + Math.random() * 4,
    accent: ["#38bdf8","#c084fc","#4ade80","#fb923c","#f472b6","#818cf8"][i % 6],
    delay: i * 0.3, dur: 3 + Math.random() * 3,
  }));

  return (
    <div className="relative text-center py-24 overflow-hidden">
      {particles.map((p, i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: p.accent }}
          animate={{ y: [0, -24, 0], opacity: [0, 0.55, 0], scale: [0.5, 1.3, 0.5] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <motion.div initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
        <SectionLabel text="What I Offer" />
        <h1
          className="font-black leading-none mb-5"
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "clamp(3rem,7vw,6rem)",
            letterSpacing: "-0.06em",
            background: "linear-gradient(135deg,#fff 20%,rgba(255,255,255,0.4) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}
        >
          My Services
        </h1>
        <p className="text-xl max-w-2xl mx-auto mb-8" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.38)", fontWeight: 300, lineHeight: 1.8 }}>
          Comprehensive development services to transform your ideas into powerful digital solutions — from concept to production.
        </p>

        {/* Stat pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { label: "6+ Services",    accent: "#38bdf8" },
            { label: "3+ Years",       accent: "#4ade80" },
            { label: "100% On-Time",   accent: "#c084fc" },
            { label: "98% Satisfaction", accent: "#fb923c" },
          ].map(({ label, accent }) => (
            <div key={label} className="px-4 py-2 rounded-full flex items-center gap-2" style={{ background: `${accent}0D`, border: `1px solid ${accent}25` }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
              <span className="text-xs font-bold" style={{ fontFamily: "'Space Mono', monospace", color: accent, letterSpacing: "0.04em" }}>{label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ── CTA bottom ────────────────────────────────────────────────────────────────
function BottomCTA({ inView }: { inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      className="relative mt-8"
    >
      <motion.div
        className="absolute -inset-px rounded-3xl pointer-events-none"
        animate={{ background: ["linear-gradient(135deg,#3b82f6,#8b5cf6,#06b6d4)", "linear-gradient(225deg,#8b5cf6,#06b6d4,#3b82f6)", "linear-gradient(315deg,#06b6d4,#3b82f6,#8b5cf6)"], opacity: 0.55 }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />
      <div className="relative rounded-3xl overflow-hidden text-center px-8 py-14" style={{ background: "rgb(11,12,24)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <motion.div className="absolute top-0 left-0 right-0 h-0.5" animate={{ background: ["linear-gradient(90deg,#3b82f6,#8b5cf6,#06b6d4)", "linear-gradient(90deg,#8b5cf6,#06b6d4,#3b82f6)"] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(99,102,241,0.07), transparent 70%)" }} />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)" }}>
          <motion.div className="w-2 h-2 rounded-full bg-emerald-400" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
          <span className="text-xs font-bold tracking-widest uppercase text-emerald-400" style={{ fontFamily: "'Space Mono', monospace" }}>Available for Projects</span>
        </div>

        <h2 className="font-black mb-4" style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(2rem,4vw,3rem)", letterSpacing: "-0.04em", background: "linear-gradient(135deg,#fff 30%,rgba(255,255,255,0.45) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          Ready to Get Started?
        </h2>
        <p className="text-lg max-w-xl mx-auto mb-8" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.38)", fontWeight: 300, lineHeight: 1.8 }}>
          Let's discuss your project and see how I can help bring your vision to life.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/contact" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm text-white relative overflow-hidden" style={{ fontFamily: "'Sora', sans-serif", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", boxShadow: "0 0 40px rgba(99,102,241,0.5)", textDecoration: "none" }}>
            <motion.div className="absolute inset-0" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)" }} initial={{ x: "-100%" }} whileHover={{ x: "100%" }} transition={{ duration: 0.55 }} />
            <span className="relative z-10">Start Your Project</span>
            <ArrowRight className="w-4 h-4 relative z-10" strokeWidth={2} />
          </Link>
          <a href="tel:+919685533878" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm relative overflow-hidden" style={{ fontFamily: "'Sora', sans-serif", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.22)", color: "#4ade80", textDecoration: "none" }}>
            <motion.div className="w-2 h-2 rounded-full bg-emerald-400" animate={{ scale: [1, 1.6, 1] }} transition={{ duration: 1.3, repeat: Infinity }} />
            Schedule a Call
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Services() {
  const servicesRef  = useRef(null);
  const processRef   = useRef(null);
  const featuresRef  = useRef(null);
  const ctaRef       = useRef(null);

  const servicesInView  = useInView(servicesRef,  { once: true, margin: "-80px" });
  const processInView   = useInView(processRef,   { once: true, margin: "-80px" });
  const featuresInView  = useInView(featuresRef,  { once: true, margin: "-80px" });
  const ctaInView       = useInView(ctaRef,       { once: true, margin: "-80px" });

  return (
    <>
      <Helmet>
        <title>Services — Akash Raikwar</title>
        <meta name="description" content="Professional web development services including frontend development, backend development, full-stack solutions, and custom web applications." />
      </Helmet>

      <div className="min-h-screen pt-20 pb-16 relative overflow-hidden" style={{ background: "#020209" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;700;800;900&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');
        `}</style>

        {/* Global orbs */}
        <Orb style={{ top: "5%",   left: "-5%" }}   color="radial-gradient(circle,rgba(59,130,246,0.25),transparent 70%)"  size={500} dur={10} delay={0} />
        <Orb style={{ top: "40%",  right: "-5%" }}  color="radial-gradient(circle,rgba(139,92,246,0.2),transparent 70%)"   size={440} dur={13} delay={2} />
        <Orb style={{ bottom: "5%",left: "30%" }}   color="radial-gradient(circle,rgba(16,185,129,0.12),transparent 70%)"  size={360} dur={14} delay={1} />

        {/* Grid */}
        <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(99,102,241,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.03) 1px,transparent 1px)", backgroundSize: "64px 64px", zIndex: 0 }} />

        {/* Scan line */}
        <motion.div className="fixed left-0 right-0 h-px pointer-events-none" style={{ background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.3),transparent)", zIndex: 1 }} animate={{ top: ["0%", "100%"] }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">

          {/* Hero */}
          <Hero />

          {/* ── Services ── */}
          <div ref={servicesRef} className="py-8">
            <SectionHeader label="What I Build" title="Services" subtitle="Six core services tailored to bring your digital vision to life — from design to deployment." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((s, i) => <ServiceCard key={s.title} service={s} index={i} inView={servicesInView} />)}
            </div>
          </div>

          {/* ── Process ── */}
          <div ref={processRef} className="py-20">
            <SectionHeader label="How It Works" title="My Process" subtitle="A structured approach to deliver exceptional results on every single project." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {process.map((p, i) => <ProcessCard key={p.step} item={p} index={i} inView={processInView} />)}
            </div>
          </div>

          {/* ── Why Choose Me ── */}
          <div ref={featuresRef} className="py-8">
            <SectionHeader label="Why Me?" title="Why Choose Me?" subtitle="I don't just build websites — I build high-performance digital solutions that help businesses grow, convert, and scale." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f, i) => <FeatureCard key={f.title} feature={f} index={i} inView={featuresInView} />)}
            </div>
          </div>

          {/* ── CTA ── */}
          <div ref={ctaRef} className="py-16">
            <BottomCTA inView={ctaInView} />
          </div>
        </div>
      </div>
    </>
  );
}