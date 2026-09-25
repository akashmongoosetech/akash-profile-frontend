import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import {
  Terminal,
  MapPin,
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  Copy,
  Check,
  Workflow,
  FileCode2,
  Boxes,
} from "lucide-react";

// --- Tabbed code console datasets (kept) ---
const TABS = [
  {
    id: "arch",
    label: "architecture.ts",
    icon: FileCode2,
    code: `// Akash Raikwar — Core Configuration
export const engineer = {
  name: "Akash Raikwar",

  role: "Full-Stack & AI Solutions Engineer",
  focus: [
    "Full-Stack Architecture", "MERN Stack", "AI & LLM Solutions", "AI Automation", "SaaS Development", 
    "Business Solutions", "Scalable Web Applications"
  ],
  philosophy:
    "Engineering intelligent digital solutions that are scalable, reliable, and built for real business impact.",
  metrics: {
    uptime: "99.98%",
    latency: "< 42ms",
    testCoverage: "94.6%"
  },
  solutions: [
    "Web Applications", "AI-Powered Platforms", "CRM & ERP Systems", "SaaS Products", "AI Agents & Chatbots", "Business Automation"
  ],
  status: "Building high-impact digital solutions",
  availability: "Open for new projects"
};`,
  },
  {
    id: "stack",
    label: "tech.stack.json",
    icon: Boxes,
    code: `{
  "core": ["TypeScript", "React 19", "Node.js", "Python"],
  "data": ["PostgreSQL", "MongoDB", "Redis", "Vector DBs"],
  "infrastructure": ["Docker", "Kubernetes", "AWS", "Cloudflare Edge"],
  "designSystem": ["Tailwind CSS", "Framer Motion", "Figma"]
}`,
  },
  {
    id: "deploy",
    label: "pipeline.sh",
    icon: Workflow,
    code: `#!/usr/bin/env bash
# Deploying to production edge nodes...
$ git push origin main
[OK] Linting passed (0 warnings)
[OK] 128 tests passing across microservices
[OK] Static assets hashed & pushed to CDN
=> Status: ONLINE [ap-south-1 | Mumbai edge]`,
  },
];

const ROLES = [
  "Full Stack Developer",
  "React Specialist",
  "Node.js Engineer",
  "MERN Stack Developer",
  "AI Engineer",
  "LLM Engineer",
  "AI Agent Developer",
  "AI Automation Engineer",
  "Chatbot Developer",
  "SaaS Developer",
  "Cloud Architect",
  "Business Solutions Architect",
  "Digital Solutions Architect",
  "Product Engineer",
  "Technical Consultant"
];

const SOCIALS = [
  { icon: Github, href: "https://github.com/akash007123", label: "GitHub", color: "#f0f6ff" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/akash-raikwar-4a67bb171/", label: "LinkedIn", color: "#0ea5e9" },
  { icon: Mail, href: "mailto:info@akashraikwar.in", label: "Email", color: "#f87171" },
];

const STATS = [
  { value: "4+", label: "Years" },
  { value: "50+", label: "Projects" },
  { value: "25+", label: "Clients" },
];

const TECH_STRIP = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Express.js",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Supabase",
  "REST APIs",
  "GraphQL",
  "Tailwind CSS",
  "Material UI",
  "Bootstrap",
  "Redux",
  "Docker",
  "AWS",
  "Vercel",
  "Netlify",
  "Git",
  "GitHub",
  "Linux",
  "OpenAI",
  "Gemini",
  "LLMs",
  "AI Agents",
  "n8n",
  "Make Automation",
  "JWT",
  "OAuth",
  "Razorpay"
];

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const reduceMotion = useReducedMotion();

  // Spotlight follows pointer (px-correct)
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });
  const containerRef = useRef<HTMLElement>(null);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (reduceMotion || !containerRef.current) return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  // Typing role line
  useEffect(() => {
    const role = ROLES[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (!isDeleting && typedText.length < role.length) {
      timeout = setTimeout(() => setTypedText(role.slice(0, typedText.length + 1)), 80);
    } else if (!isDeleting && typedText.length === role.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && typedText.length > 0) {
      timeout = setTimeout(() => setTypedText(role.slice(0, typedText.length - 1)), 40);
    } else if (isDeleting && typedText.length === 0) {
      setIsDeleting(false);
      setRoleIndex((i) => (i + 1) % ROLES.length);
    }
    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, roleIndex]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(TABS[activeTab].code);
    } catch {
      /* clipboard unavailable — still show feedback */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="relative w-full text-slate-100 flex flex-col justify-center overflow-hidden"
      style={{ background: "#020209", fontFamily: "'Sora', 'DM Sans', sans-serif", paddingTop: "5.5rem", paddingBottom: "3rem" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');
        .hero-name { font-family: 'Sora', sans-serif; font-weight: 800; letter-spacing: -0.045em; }
        .mono { font-family: 'Space Mono', monospace; }
        .grid-bg {
          background-image:
            linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 85% 75% at 50% 35%, black 25%, transparent 78%);
          -webkit-mask-image: radial-gradient(ellipse 85% 75% at 50% 35%, black 25%, transparent 78%);
        }
        .glass-panel {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.09);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .text-shimmer {
          background: linear-gradient(90deg, #fff 0%, #a5b4fc 30%, #e879f9 60%, #fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        @keyframes shimmer { to { background-position: 200% center; } }
        .name-outline {
          color: transparent;
          -webkit-text-stroke: 1px rgba(165,180,252,0.35);
        }
        .avatar-glow {
          box-shadow: 0 0 0 2px rgba(99,102,241,0.45), 0 0 60px rgba(99,102,241,0.3), 0 0 120px rgba(139,92,246,0.18);
        }
        .available-pulse { animation: pulse-green 2s ease-in-out infinite; }
        @keyframes pulse-green { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0.5);} 50%{box-shadow:0 0 0 8px rgba(16,185,129,0);} }
        .cursor-blink { animation: blink 1s step-end infinite; }
        @keyframes blink { 50% { opacity: 0; } }
        .tech-marquee { animation: marquee 28s linear infinite; }
        .tech-marquee:hover { animation-play-state: paused; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.025;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .text-shimmer, .tech-marquee, .cursor-blink, .available-pulse { animation: none !important; }
        }
      `}</style>

      {/* Backdrop: grid + noise + orbs + pointer spotlight */}
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute inset-0 noise-overlay" />
      <div className="pointer-events-none absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full blur-[120px]" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)" }} />
      <div className="pointer-events-none absolute bottom-[-20%] right-[-10%] h-[440px] w-[440px] rounded-full blur-[130px]" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.28) 0%, transparent 70%)" }} />
      <div className="pointer-events-none absolute top-[30%] left-[55%] h-[360px] w-[360px] rounded-full blur-[120px]" style={{ background: "radial-gradient(circle, rgba(236,72,153,0.16) 0%, transparent 70%)" }} />
      {!reduceMotion && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(520px circle at 0px 0px, rgba(99,102,241,0.14), transparent 80%)" }}
        />
      )}
      {!reduceMotion && (
        <SpotlightFollower springX={springX} springY={springY} />
      )}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Eyebrow row */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-8 sm:mb-10 border-b border-white/10"
        >
          <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="mono text-[11px] sm:text-xs font-bold tracking-widest text-emerald-300">AVAILABLE FOR HIRE</span>
          </div>
          <div className="flex items-center gap-3 mono text-[11px] sm:text-xs text-gray-400">
            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-indigo-400" /> Ujjain, India</span>
            <span className="h-3 w-px bg-white/15" />
            <span className="hidden xs:inline sm:inline">Full-Stack Engineer</span>
          </div>
        </motion.div>

        {/* MONOGRAM — giant display type over portrait */}
        <div className="relative text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            aria-hidden="true"
            className="name-outline hero-name select-none pointer-events-none leading-none text-[clamp(4rem,17vw,13rem)]"
          >
            AKASH
          </motion.div>

          {/* Portrait breaking the grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto -mt-[clamp(1.5rem,5vw,3.5rem)] w-fit"
          >
            <motion.div
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
              style={{ width: "124%", aspectRatio: "1", border: "2px dotted rgba(139,92,246,0.5)", boxShadow: "0 0 26px rgba(139,92,246,0.25)" }}
            />
            <div className="relative rounded-full p-[3px]" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)" }}>
              <div className="rounded-full p-1.5" style={{ background: "#020209" }}>
                <div className="w-44 h-44 sm:w-60 sm:h-60 rounded-full overflow-hidden avatar-glow bg-gradient-to-br from-indigo-600 to-purple-700">
                  <img
                    src="./my-pic.jpg"
                    alt="Akash Raikwar"
                    className="w-full h-full object-cover"
                    loading="eager"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:64px;color:#fff;font-family:Sora,sans-serif;font-weight:800">AR</div>';
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <span className="absolute bottom-2 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] mono font-bold text-emerald-300 border border-emerald-500/30" style={{ background: "rgba(2,2,9,0.85)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 available-pulse" /> ONLINE
            </span>
            {[
              { emoji: "⚡", className: "top-2 -left-3 sm:-left-5", rotate: "-12deg", delay: 0.9 },
              { emoji: "🚀", className: "bottom-8 -right-3 sm:-right-5", rotate: "10deg", delay: 1.1 },
              { emoji: "✨", className: "top-1/2 -right-4 sm:-right-7", rotate: "8deg", delay: 1.3 },
            ].map((b, i) => (
              <motion.div
                key={i}
                className={`absolute w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-lg sm:text-xl shadow-2xl border border-white/15 ${b.className}`}
                style={{ background: "rgba(20,22,45,0.9)", rotate: b.rotate }}
                initial={{ opacity: 0, scale: 0 }}
                animate={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1, y: [0, -9, 0] }}
                transition={{
                  opacity: { delay: b.delay, duration: 0.4 },
                  scale: { delay: b.delay, duration: 0.4 },
                  y: { duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" },
                }}
              >
                {b.emoji}
              </motion.div>
            ))}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="hero-name mt-4 leading-[0.95]"
          >
            <span className="text-shimmer block text-[clamp(2.5rem,8vw,5.25rem)]">Akash Raikwar</span>
          </motion.h1>

          {/* Role chapter label (typing kept) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="mt-4 flex items-center justify-center gap-3"
          >
            <span className="mono text-[10px] sm:text-xs text-gray-500 tracking-widest">CH.02 —</span>
            <span className="text-indigo-300 text-base sm:text-xl font-semibold text-left" style={{ fontFamily: 'Sora, sans-serif', minHeight: '1.75rem' }}>
              {typedText}
              <span className="cursor-blink text-indigo-400 ml-0.5">|</span>
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.7 }}
            className="mx-auto mt-4 text-gray-400 text-sm sm:text-lg leading-relaxed max-w-xl"
            style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}
          >
            Engineering fast, deterministic web systems — from pixel-perfect interfaces to scalable cloud
            infrastructure. <span className="text-white font-medium">I build things that actually work.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-7 flex flex-wrap justify-center gap-3 sm:gap-4"
          >
            <a
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-2xl px-7 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white no-underline"
              style={{ fontFamily: 'Sora, sans-serif', background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)", boxShadow: "0 0 30px rgba(99,102,241,0.45)" }}
            >
              Start a Project
              <ArrowRight className="h-4 w-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
            <a
              href="/projects"
              className="inline-flex items-center rounded-2xl px-7 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white no-underline border border-white/15"
              style={{ fontFamily: 'Sora, sans-serif', background: "rgba(255,255,255,0.04)" }}
            >
              Explore Archive
            </a>
          </motion.div>

          {/* Socials + stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95, duration: 0.6 }}
            className="mx-auto mt-7 glass-panel rounded-2xl px-4 sm:px-5 py-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full sm:w-auto"
          >
            <div className="flex gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:-translate-y-1 transition-all"
                  style={{ width: 42, height: 42, color: s.color }}
                >
                  <s.icon size={17} />
                </a>
              ))}
            </div>
            <div className="w-full sm:w-px h-px sm:h-10 bg-white/10" />
            <div className="flex gap-5 sm:gap-6">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="hero-name text-lg sm:text-xl text-white">{s.value}</div>
                  <div className="mono text-[10px] sm:text-xs text-gray-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabbed code console (kept, supporting role) */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 sm:mt-12 rounded-3xl border border-white/10 overflow-hidden"
          style={{ background: "rgba(10,12,28,0.85)", backdropFilter: "blur(16px)" }}
        >
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="h-4 w-px bg-white/10 mx-2" />
              <span className="hidden sm:flex items-center gap-1.5 mono text-xs text-gray-500">
                <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                runtime-environment
              </span>
            </div>
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
              {TABS.map((tab, idx) => {
                const Icon = tab.icon;
                const isActive = activeTab === idx;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(idx)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-lg mono text-xs transition-all ${
                      isActive ? "text-white" : "text-gray-500 hover:text-gray-200"
                    }`}
                    style={isActive ? { background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" } : undefined}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={copyCode}
              className="flex items-center gap-1.5 mono text-xs text-gray-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
              title="Copy snippet"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span className="hidden md:inline">{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <div className="p-5 sm:p-6 mono text-xs sm:text-sm text-slate-300 overflow-x-auto leading-relaxed">
            <pre><code>{TABS[activeTab].code}</code></pre>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.015] px-5 sm:px-6 py-2.5 mono text-[11px] text-gray-600">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> main · deployed
            </span>
            <span>TypeScript v5.x · Ready</span>
          </div>
        </motion.div>

        {/* Tech marquee + scroll cue */}
        <div className="mt-8 sm:mt-10">
          <div className="overflow-hidden rounded-full glass-panel">
            <div className="tech-marquee flex w-max items-center gap-3 px-4 py-2.5">
              {[...TECH_STRIP, ...TECH_STRIP].map((t, i) => (
                <span key={i} className="flex items-center gap-3 mono text-[11px] sm:text-xs text-gray-400 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-500" />
                  {t}
                </span>
              ))}
            </div>
          </div>
          <motion.div
            className="mx-auto mt-8 flex flex-col items-center gap-2 w-fit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            <span className="mono text-[10px] text-gray-600 tracking-widest uppercase">Scroll</span>
            <motion.div
              className="w-px h-10 bg-gradient-to-b from-indigo-500 to-transparent"
              animate={reduceMotion ? undefined : { scaleY: [0, 1, 0], originY: 0 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SpotlightFollower({ springX, springY }: { springX: ReturnType<typeof useSpring>; springY: ReturnType<typeof useSpring> }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      style={{
        background: "radial-gradient(520px circle at 0px 0px, rgba(99,102,241,0.14), transparent 80%)",
        translateX: springX,
        translateY: springY,
      }}
    />
  );
}
