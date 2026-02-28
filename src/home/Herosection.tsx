import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Github, Linkedin, Instagram, Facebook, Mail } from "lucide-react";

// Particle component
interface ParticleProps {
  x: number;
  y: number;
  size: number | string;
  color: string;
  duration: number;
  delay: number;
}

const Particle = ({ x, y, size, color, duration, delay }: ParticleProps) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: color }}
    animate={{
      y: [0, -120, 0],
      x: [0, Math.random() * 60 - 30, 0],
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
    }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

// Magnetic button
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  as?: React.ElementType;
  style?: React.CSSProperties;
}

const MagneticButton = ({ children, className, onClick, href, as: Tag = "button", style }: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div ref={ref} style={{ x: springX, y: springY }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="inline-block">
      <Tag href={href} onClick={onClick} className={className} style={{ fontFamily: className?.includes('Sora') ? 'Sora, sans-serif' : undefined, ...style }}>{children}</Tag>
    </motion.div>
  );
};

const ROLES = ["Full Stack Developer", "React Specialist", "Node.js Engineer", "Cloud Architect", "UI/UX Craftsman"];

interface GlowOrbProps {
  className?: string;
  color: string;
  size: number | string;
  delay?: number;
}

const GlowOrb = ({ className, color, size, delay = 0 }: GlowOrbProps) => (
  <motion.div
    className={`absolute rounded-full pointer-events-none blur-3xl ${className}`}
    style={{ width: size, height: size, background: color }}
    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
    transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay }}
  />
);

export default function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Typing effect
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

  // Mouse parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Particles
  const particles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 2,
    color: ["#3b82f6", "#8b5cf6", "#06b6d4", "#ec4899", "#10b981"][Math.floor(Math.random() * 5)],
    duration: Math.random() * 5 + 4,
    delay: Math.random() * 5,
  }));

  const socialLinks = [
    { icon: Github, href: "https://github.com/akash007123", color: "#f0f6ff" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/akash-raikwar-4a67bb171/", color: "#0ea5e9" },
    { icon: Instagram, href: "https://www.instagram.com/akashraikwar_007", color: "#ec4899" },
    { icon: Facebook, href: "https://www.facebook.com/akashraikwar007", color: "#60a5fa" },
    { icon: Mail, href: "mailto:akashraikwar763@gmail.com", color: "#f87171" },
  ];

  const stats = [
    { value: "2+", label: "Years" },
    { value: "50+", label: "Projects" },
    { value: "25+", label: "Clients" },
  ];

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-visible"
      style={{ background: "#020209", fontFamily: "'Sora', 'DM Sans', sans-serif" }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');

        .hero-name {
          font-family: 'Sora', sans-serif;
          font-weight: 800;
          letter-spacing: -0.04em;
        }
        .mono { font-family: 'Space Mono', monospace; }

        .avatar-glow {
          box-shadow: 0 0 0 2px rgba(99,102,241,0.4), 0 0 60px rgba(99,102,241,0.25), 0 0 120px rgba(139,92,246,0.15);
        }

        .gradient-border {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
          padding: 2px;
          border-radius: 9999px;
        }
        .gradient-border-inner { background: #020209; border-radius: 9999px; }

        .grid-bg {
          background-image:
            linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
        }

        .cta-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          box-shadow: 0 0 30px rgba(99,102,241,0.4);
          transition: box-shadow 0.3s, transform 0.2s;
        }
        .cta-primary:hover { box-shadow: 0 0 50px rgba(99,102,241,0.7); transform: scale(1.04); }

        .cta-secondary {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.12);
          transition: background 0.2s, transform 0.2s;
        }
        .cta-secondary:hover { background: rgba(255,255,255,0.09); transform: scale(1.04); }

        .tag-badge {
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.25);
          color: #a5b4fc;
        }

        .social-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          width: 44px; height: 44px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px;
          font-family: 'Space Mono', monospace;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          transition: border-color 0.2s, background 0.2s, transform 0.2s;
          color: rgba(255,255,255,0.7);
        }
        .social-btn:hover { transform: translateY(-4px) scale(1.1); background: rgba(255,255,255,0.1); }

        .cursor-blink { animation: blink 1s step-end infinite; }
        @keyframes blink { 50% { opacity: 0; } }

        .floating-badge {
          backdrop-filter: blur(14px);
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
        }

        /* Orbit ring animations */
        @keyframes orbitClockwise { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes orbitCounterClockwise { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes orbitPulse { 
          0% { transform: rotate(0deg) scale(1); opacity: 0.4; }
          50% { transform: rotate(180deg) scale(1.1); opacity: 0.8; }
          100% { transform: rotate(360deg) scale(1); opacity: 0.4; }
        }

        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.025;
          pointer-events: none;
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

        .available-pulse { animation: pulse-green 2s ease-in-out infinite; }
        @keyframes pulse-green { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0.5);} 50%{box-shadow:0 0 0 8px rgba(16,185,129,0);} }
        
        /* Dotted circle styles */
        .dotted-circle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        
        .dotted-circle::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle at 50% 50%, transparent 95%, rgba(255,255,255,0.1) 96%, transparent 100%);
          background-size: 20px 20px;
        }
      `}</style>

      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-100" />

      {/* Noise overlay */}
      <div className="absolute inset-0 noise-overlay" />

      {/* Glow orbs */}
      <GlowOrb className="top-[-10%] left-[-5%]" color="radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)" size={700} delay={0} />
      <GlowOrb className="bottom-[-15%] right-[-5%]" color="radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)" size={600} delay={1.5} />
      <GlowOrb className="top-[30%] right-[10%]" color="radial-gradient(circle, rgba(236,72,153,0.25) 0%, transparent 70%)" size={400} delay={3} />

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => <Particle key={p.id} {...p} />)}
      </div>

      {/* Horizontal scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)" }}
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-screen py-24">

          {/* LEFT COLUMN */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8 order-2 lg:order-1"
            style={{ transform: `translate(${mousePos.x * -12}px, ${mousePos.y * -8}px)`, transition: "transform 0.1s ease-out" }}
          >
            {/* Available badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-flex items-center gap-2.5 self-start"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full floating-badge">
                <span className="w-2 h-2 rounded-full bg-emerald-400 available-pulse" />
                <span className="text-xs mono text-emerald-400 font-bold tracking-widest uppercase">Available for hire</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-full floating-badge">
                <span className="text-xs text-gray-400 mono">📍 Ujjain, India</span>
              </div>
            </motion.div>

            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="text-gray-500 mono text-sm mb-3 tracking-wider">const developer = {`{`}</div>
              <h1 className="hero-name leading-none">
                <span className="text-shimmer block text-[clamp(4rem,9vw,7rem)]">Akash</span>
                <span className="text-white block text-[clamp(4rem,9vw,7rem)]">Raikwar</span>
              </h1>
              <div className="text-gray-500 mono text-sm mt-3">{"}"}</div>
            </motion.div>

            {/* Role typing */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-px bg-indigo-500" />
              <span className="text-indigo-300 text-xl font-semibold" style={{ fontFamily: 'Sora, sans-serif', minWidth: '260px' }}>
                {typedText}
                <span className="cursor-blink text-indigo-400 ml-0.5">|</span>
              </span>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-gray-400 text-lg leading-relaxed max-w-lg"
              style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}
            >
              Crafting scalable, blazing-fast web experiences with obsessive attention to detail.
              From pixel-perfect UIs to robust cloud infrastructure — I build things that{" "}
              <span className="text-white font-medium">actually work.</span>
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <MagneticButton
                as="a"
                href="/contact"
                className="cta-primary text-white px-8 py-4 rounded-2xl font-bold text-base cursor-pointer flex items-center gap-2.5 no-underline"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                <span>Hire Me</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >→</motion.span>
              </MagneticButton>

              <MagneticButton
                as="a"
                href="/projects"
                className="cta-secondary text-white px-8 py-4 rounded-2xl font-bold text-base cursor-pointer flex items-center gap-2 no-underline"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                View Projects
              </MagneticButton>
            </motion.div>

            {/* Social + Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85, duration: 0.6 }}
              className="flex items-center gap-8 pt-2"
            >
              <div className="flex gap-2">
                {socialLinks.map((s, i) => (
                  <motion.a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn"
                    style={{ color: s.color }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + i * 0.07, duration: 0.4 }}
                    whileHover={{ y: -5 }}
                  >
                    <s.icon size={18} />
                  </motion.a>
                ))}
              </div>

              <div className="w-px h-10 bg-white/10" />

              <div className="flex gap-6">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 + i * 0.1, duration: 0.5 }}
                    className="text-center"
                  >
                    <div className="text-xl font-bold text-white hero-name">{s.value}</div>
                    <div className="text-xs text-gray-500 mono mt-0.5">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN — Avatar with 3 new circular dotted lines */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center items-center order-1 lg:order-2 relative overflow-visible"
            style={{ transform: `translate(${mousePos.x * 14}px, ${mousePos.y * 10}px)`, transition: "transform 0.15s ease-out" }}
          >
            {/* Outer glow ring */}
            <motion.div
              className="absolute rounded-full"
              style={{ width: 380, height: 380, background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)" }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* THREE NEW CIRCULAR DOTTED LINES - Each moving in different directions */}

            {/* Dotted Circle 1 - Blue - Clockwise rotation with large dots */}
            <motion.div
              className="absolute dotted-circle"
              style={{
                width: 320,
                height: 320,
                border: '2px dotted rgba(59, 130, 246, 0.6)',
                borderRadius: '50%',
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />

            {/* Dotted Circle 2 - Purple - Counter-clockwise rotation with smaller dots */}
            <motion.div
              className="absolute dotted-circle"
              style={{
                width: 360,
                height: 360,
                border: '3px dotted rgba(168, 85, 247, 0.5)',
                borderRadius: '50%',
                boxShadow: '0 0 25px rgba(168, 85, 247, 0.3)',
                borderStyle: 'dashed'
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />

            {/* Dotted Circle 3 - Pink - Pulsing rotation with gradient dots */}
            <motion.div
              className="absolute dotted-circle"
              style={{
                width: 400,
                height: 400,
                border: '2px dotted rgba(236, 72, 153, 0.5)',
                borderRadius: '50%',
                boxShadow: '0 0 30px rgba(236, 72, 153, 0.3)',
                borderStyle: 'dotted'
              }}
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.05, 1],
                borderColor: ['rgba(236, 72, 153, 0.5)', 'rgba(139, 92, 246, 0.5)', 'rgba(236, 72, 153, 0.5)']
              }}
              transition={{ 
                rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                borderColor: { duration: 5, repeat: Infinity, ease: "linear" }
              }}
            />

            {/* Additional decorative small dots on the circles */}
            {[320, 360, 400].map((size, index) => (
              <div key={`dots-${index}`} className="absolute" style={{ width: size, height: size }}>
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={`dot-${index}-${i}`}
                    className="absolute w-1.5 h-1.5 rounded-full"
                    style={{
                      background: index === 0 ? '#3b82f6' : index === 1 ? '#a855f7' : '#ec4899',
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${i * 30}deg) translateY(-${size/2}px)`,
                      boxShadow: `0 0 10px ${index === 0 ? '#3b82f6' : index === 1 ? '#a855f7' : '#ec4899'}`,
                      opacity: 0.6
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            ))}

            {/* Original orbiting dots (keeping them for backward compatibility) */}
            <div className="absolute" style={{ width: 340, height: 340 }}>
              <motion.div
                className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-indigo-400"
                style={{ boxShadow: "0 0 10px #818cf8" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
            </div>

            {/* Floating emoji badges */}
            {[
              { emoji: "⚡", top: "5%", right: "-5%", delay: 0, bg: "from-blue-500 to-indigo-600" },
              { emoji: "🚀", bottom: "5%", left: "-5%", delay: 0.5, bg: "from-purple-500 to-pink-600" },
              { emoji: "💡", top: "40%", left: "-10%", delay: 1, bg: "from-emerald-500 to-teal-600" },
              { emoji: "🎯", top: "20%", right: "-8%", delay: 1.5, bg: "from-orange-500 to-red-600" },
              { emoji: "✨", bottom: "25%", right: "-8%", delay: 0.8, bg: "from-pink-500 to-rose-600" },
            ].map((b, i) => (
              <motion.div
                key={i}
                className={`absolute w-14 h-14 bg-gradient-to-br ${b.bg} rounded-2xl flex items-center justify-center text-2xl shadow-2xl floating-badge border border-white/10 z-20`}
                style={{ top: b.top, bottom: b.bottom, left: b.left, right: b.right }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -12, 0],
                  rotate: [0, 8, -8, 0],
                }}
                transition={{
                  opacity: { delay: 0.8 + b.delay, duration: 0.5 },
                  scale: { delay: 0.8 + b.delay, duration: 0.5 },
                  y: { duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: b.delay },
                  rotate: { duration: 4 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: b.delay },
                }}
              >
                {b.emoji}
              </motion.div>
            ))}

            {/* Avatar container */}
            <motion.div
              className="relative z-10"
              whileHover={{ scale: 1.04 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="gradient-border">
                <div className="gradient-border-inner p-1.5">
                  <div
                    className="w-64 h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden avatar-glow relative"
                  >
                    <img
                      src="./my-pic.jpg"
                      alt="Akash Raikwar"
                      className="w-full h-full object-cover"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.style.background = 'linear-gradient(135deg, #3b82f6, #8b5cf6)';
                          parent.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:80px">AR</div>';
                        }
                      }}
                    />
                    {/* Shine overlay */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)" }}
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              </div>

              {/* Status indicator */}
              <motion.div
                className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full floating-badge z-20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 available-pulse" />
                <span className="text-xs mono text-emerald-400 font-bold">Online</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <span className="text-xs mono text-gray-600 tracking-widest uppercase">Scroll</span>
          <motion.div
            className="w-px h-12 bg-gradient-to-b from-indigo-500 to-transparent"
            animate={{ scaleY: [0, 1, 0], originY: 0 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
}