import React, { useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Rocket, ArrowRight, MessageCircle, CheckCircle } from "lucide-react";

// ── Magnetic button ───────────────────────────────────────────────────────────
function MagneticButton({ children, className, style, href, onClick }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; href?: string; onClick?: (e: React.MouseEvent<HTMLElement>) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - r.left - r.width / 2) * 0.28);
    y.set((e.clientY - r.top - r.height / 2) * 0.28);
  };
  const reset = () => { x.set(0); y.set(0); };

  const Tag = href ? "a" : "button";

  return (
    <motion.div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={reset} style={{ x: sx, y: sy, display: "inline-flex" }}>
      <Tag href={href} onClick={onClick} className={className} style={{ ...style, textDecoration: "none" }}>
        {children}
      </Tag>
    </motion.div>
  );
}

// ── Floating particle ─────────────────────────────────────────────────────────
function Particle({ x, y, size, accent, delay, dur }: { x: number; y: number; size: number; accent: string; delay: number; dur: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: accent }}
      animate={{ y: [0, -30, 0], opacity: [0, 0.6, 0], scale: [0.5, 1.2, 0.5] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ── Orbit ring ────────────────────────────────────────────────────────────────
function OrbitRing({ r, dur, clockwise, accent }: { r: number; dur: number; clockwise: boolean; accent: string }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: r * 2, height: r * 2,
        border: `1px solid ${accent}22`,
        left: "50%", top: "50%",
        transform: "translate(-50%,-50%)",
      }}
      animate={{ rotate: clockwise ? 360 : -360 }}
      transition={{ duration: dur, repeat: Infinity, ease: "linear" }}
    >
      {/* Dot on ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: 6, height: 6,
          background: accent,
          boxShadow: `0 0 8px ${accent}`,
          top: -3, left: "50%", transform: "translateX(-50%)",
        }}
      />
    </motion.div>
  );
}

// ── Orb ───────────────────────────────────────────────────────────────────────
function Orb({ style, color, size, dur, delay }: { style?: React.CSSProperties; color: string; size: number; dur: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl pointer-events-none"
      style={{ width: size, height: size, background: color, ...style }}
      animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.25, 0.1] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const particles = [
    { x: 12, y: 20, size: 4, accent: "#38bdf8", delay: 0,    dur: 3.5 },
    { x: 88, y: 15, size: 3, accent: "#c084fc", delay: 0.8,  dur: 4   },
    { x: 20, y: 75, size: 5, accent: "#4ade80", delay: 1.2,  dur: 3   },
    { x: 75, y: 80, size: 3, accent: "#fb923c", delay: 0.4,  dur: 4.5 },
    { x: 50, y: 10, size: 4, accent: "#f472b6", delay: 1.8,  dur: 3.8 },
    { x: 92, y: 55, size: 3, accent: "#38bdf8", delay: 2.2,  dur: 3.2 },
    { x: 8,  y: 50, size: 4, accent: "#c084fc", delay: 0.6,  dur: 4.2 },
    { x: 55, y: 88, size: 3, accent: "#4ade80", delay: 1.5,  dur: 3.6 },
  ];

  const checks = [
    { label: "Free Consultation", accent: "#4ade80" },
    { label: "Quick Response",    accent: "#38bdf8" },
    { label: "Quality Guaranteed", accent: "#c084fc" },
  ];

  return (
    <section
      ref={ref}
      className="relative py-28 overflow-hidden"
      style={{ background: "#020209" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;700;800;900&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');
      `}</style>

      {/* Section-level orbs */}
      <Orb style={{ top: "-10%", left: "-8%" }}   color="radial-gradient(circle,rgba(99,102,241,0.35),transparent 70%)"  size={520} dur={10} delay={0} />
      <Orb style={{ bottom: "-10%", right: "-8%" }} color="radial-gradient(circle,rgba(139,92,246,0.3),transparent 70%)"   size={460} dur={13} delay={2} />
      <Orb style={{ top: "30%", left: "35%" }}    color="radial-gradient(circle,rgba(56,189,248,0.15),transparent 70%)"  size={340} dur={14} delay={1} />

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

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12">

        {/* ── Main CTA card ── */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Outer glow border — gradient animated */}
          <motion.div
            className="absolute -inset-px rounded-3xl pointer-events-none"
            animate={{
              background: [
                "linear-gradient(135deg,#3b82f6,#8b5cf6,#06b6d4)",
                "linear-gradient(225deg,#8b5cf6,#06b6d4,#3b82f6)",
                "linear-gradient(315deg,#06b6d4,#3b82f6,#8b5cf6)",
                "linear-gradient(45deg,#3b82f6,#8b5cf6,#06b6d4)",
              ],
              opacity: 0.65,
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />

          {/* Outer glow */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ boxShadow: "0 40px 120px rgba(99,102,241,0.25), 0 0 0 1px rgba(99,102,241,0.15)" }}
          />

          <div
            className="relative rounded-3xl overflow-hidden text-center"
            style={{ background: "rgb(10,11,22)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {/* Floating particles */}
            {particles.map((p, i) => <Particle key={i} {...p} />)}

            {/* Animated rainbow top strip */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-0.5"
              animate={{
                background: [
                  "linear-gradient(90deg,#3b82f6,#8b5cf6,#06b6d4,#4ade80)",
                  "linear-gradient(90deg,#8b5cf6,#06b6d4,#4ade80,#3b82f6)",
                  "linear-gradient(90deg,#06b6d4,#4ade80,#3b82f6,#8b5cf6)",
                  "linear-gradient(90deg,#4ade80,#3b82f6,#8b5cf6,#06b6d4)",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />

            {/* BG grid */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "linear-gradient(rgba(99,102,241,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.06) 1px,transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            {/* Radial center glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,0.08), transparent 70%)" }}
            />

            <div className="relative z-10 px-8 py-16 md:px-16 md:py-20">

              {/* ── Icon ── */}
              <div className="flex justify-center mb-10">
                <div className="relative">
                  {/* Orbit rings */}
                  <OrbitRing r={55} dur={8}  clockwise={true}  accent="#3b82f6" />
                  <OrbitRing r={75} dur={12} clockwise={false} accent="#8b5cf6" />
                  <OrbitRing r={95} dur={16} clockwise={true}  accent="#06b6d4" />

                  {/* Center icon */}
                  <motion.div
                    className="relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", boxShadow: "0 0 40px rgba(99,102,241,0.6), 0 0 80px rgba(99,102,241,0.2)" }}
                    animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Rocket className="w-10 h-10 text-white" strokeWidth={1.8} />
                  </motion.div>
                </div>
              </div>

              {/* ── Headline ── */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.25, duration: 0.7 }}
                className="mb-6"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)" }}>
                  <motion.div className="w-2 h-2 rounded-full bg-emerald-400" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                  <span className="text-xs font-bold tracking-widest uppercase text-emerald-400" style={{ fontFamily: "'Space Mono', monospace" }}>
                    Available for Projects
                  </span>
                </div>

                <h2
                  className="font-black leading-tight mb-4"
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: "clamp(2.5rem,5vw,4rem)",
                    letterSpacing: "-0.05em",
                    background: "linear-gradient(135deg,#fff 30%,rgba(255,255,255,0.5) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Ready to Start<br />Your Project?
                </h2>

                <p
                  className="text-lg max-w-2xl mx-auto"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.38)", fontWeight: 300, lineHeight: 1.8 }}
                >
                  Let's collaborate and bring your vision to life with cutting-edge technology
                  and innovative solutions. I'm here to help you build something amazing.
                </p>
              </motion.div>

              {/* ── Buttons ── */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {/* Primary CTA */}
                <MagneticButton
                  href="/contact"
                  onClick={() => {}}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-base text-white relative overflow-hidden group"
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
                    boxShadow: "0 0 40px rgba(99,102,241,0.5)",
                  }}
                >
                  <motion.div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)" }}
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.55 }}
                  />
                  <span className="relative z-10">Get In Touch</span>
                  <motion.div className="relative z-10" whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400 }}>
                    <ArrowRight className="w-5 h-5" strokeWidth={2} />
                  </motion.div>
                </MagneticButton>

                {/* Secondary — View Work */}
                <MagneticButton
                  href="/projects"
                  onClick={() => {}}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-base relative overflow-hidden"
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  <motion.div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)" }}
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.55 }}
                  />
                  <span className="relative z-10">View My Work</span>
                </MagneticButton>

                {/* Tertiary — Schedule Call */}
                <MagneticButton
                  href="tel:+919685533878"
                  onClick={() => {}}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-base relative overflow-hidden"
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    background: "rgba(74,222,128,0.08)",
                    border: "1px solid rgba(74,222,128,0.22)",
                    color: "#4ade80",
                  }}
                >
                  <motion.div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(90deg,transparent,rgba(74,222,128,0.08),transparent)" }}
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.55 }}
                  />
                  <motion.div
                    className="relative z-10 w-2 h-2 rounded-full bg-emerald-400"
                    animate={{ scale: [1, 1.6, 1] }}
                    transition={{ duration: 1.3, repeat: Infinity }}
                  />
                  <span className="relative z-10">Schedule a Call</span>
                  <MessageCircle className="w-4 h-4 relative z-10" strokeWidth={2} />
                </MagneticButton>
              </motion.div>

              {/* ── Trust badges ── */}
              <motion.div
                className="flex flex-wrap justify-center gap-6"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                {checks.map(({ label, accent }, i) => (
                  <motion.div
                    key={label}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.65 + i * 0.1, duration: 0.4 }}
                  >
                    <motion.div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `${accent}20`, border: `1px solid ${accent}40` }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
                    >
                      <CheckCircle className="w-3 h-3" style={{ color: accent }} strokeWidth={2.5} />
                    </motion.div>
                    <span
                      className="text-sm"
                      style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.45)", fontWeight: 400 }}
                    >
                      {label}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}