import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, ExternalLink, Github, MoveRight } from "lucide-react";

const featuredProjects = [
  {
    id: 1,
    title: "Hotel Booking System",
    subtitle: "Full-Stack Platform",
    description: "Real-time room availability, secure bookings, and a complete admin panel — built for scale.",
    image: "https://ik.imagekit.io/sentyaztie/WhatsApp%20Image%202026-02-21%20at%2010.33.36%20AM.jpeg?updatedAt=1771650381217",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    demoUrl: "http://shribalajihomestay.in",
    codeUrl: "#",
    accent: "#38bdf8",
    year: "2024",
  },
  {
    id: 2,
    title: "Event & Catering",
    subtitle: "Management Suite",
    description: "From booking to billing — a real-time event management platform with analytics-rich dashboards.",
    image: "https://ik.imagekit.io/sentyaztie/eve.jpeg?updatedAt=1771650621892",
    tags: ["React", "Tailwind", "Shadcn UI", "Chart.js"],
    demoUrl: "https://anjanievents.in/",
    codeUrl: "#",
    accent: "#4ade80",
    year: "2024",
  },
  {
    id: 3,
    title: "Tripod Wellness SPA",
    subtitle: "Booking & Experience",
    description: "A luxury spa platform with therapist profiles, scheduling, and seamless online payments.",
    image: "https://ik.imagekit.io/sentyaztie/tri.jpeg?updatedAt=1771651123575",
    tags: ["React", "MongoDB", "Framer Motion"],
    demoUrl: "https://tripod-wellness.netlify.app/",
    codeUrl: "#",
    accent: "#c084fc",
    year: "2024",
  },
  {
    id: 4,
    title: "Prescription Generator",
    subtitle: "Healthcare Tool",
    description: "Patient management, drug-interaction checks, and instant PDF generation for clinicians.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900",
    tags: ["React", "Node.js", "PDF", "MongoDB"],
    demoUrl: "#",
    codeUrl: "#",
    accent: "#fb923c",
    year: "2023",
  },
  {
    id: 5,
    title: "E-Commerce Platform",
    subtitle: "Full Commerce Stack",
    description: "Product catalog, cart, Stripe payments, order management, and a powerful admin dashboard.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900",
    tags: ["React", "Node.js", "Stripe", "MongoDB"],
    demoUrl: "#",
    codeUrl: "#",
    accent: "#f472b6",
    year: "2023",
  },
  {
    id: 6,
    title: "Social Welfare Portal",
    subtitle: "NGO Management",
    description: "Campaigns, donations, volunteers, and events — managed from a single real-time platform.",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=900",
    tags: ["React", "Express", "MongoDB", "Analytics"],
    demoUrl: "#",
    codeUrl: "#",
    accent: "#34d399",
    year: "2023",
  },
];

interface ProjectSlideProps {
  project: typeof featuredProjects[0];
  index: number;
  isActive: boolean;
  onClick: () => void;
}

function ProjectSlide({ project, index, isActive, onClick }: ProjectSlideProps) {
  return (
    <motion.div
      onClick={onClick}
      className="relative flex-shrink-0 cursor-pointer rounded-3xl overflow-hidden"
      animate={{ width: isActive ? 500 : 280, opacity: isActive ? 1 : 0.6 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ height: 420 }}
      whileHover={{ opacity: 1 }}
    >
      {/* Image */}
      <motion.img
        src={project.image}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover"
        animate={{ scale: isActive ? 1.05 : 1.02 }}
        transition={{ duration: 0.7 }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: isActive
            ? "linear-gradient(to top, rgba(2,2,9,0.98) 0%, rgba(2,2,9,0.55) 45%, rgba(2,2,9,0.15) 100%)"
            : "linear-gradient(to top, rgba(2,2,9,0.98) 0%, rgba(2,2,9,0.8) 60%, rgba(2,2,9,0.6) 100%)",
        }}
      />

      {/* Accent tint */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `linear-gradient(160deg, ${project.accent}20 0%, transparent 55%)` }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* Top accent line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: project.accent, boxShadow: `0 0 12px ${project.accent}` }}
        animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* Index + year */}
      <div className="absolute top-5 left-5 flex items-center gap-2">
        <span
          className="text-xs font-black px-2.5 py-1 rounded-full"
          style={{
            fontFamily: "'Space Mono', monospace",
            background: `${project.accent}20`,
            border: `1px solid ${project.accent}45`,
            color: project.accent,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <motion.span
          className="text-xs"
          style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.3)" }}
          animate={{ opacity: isActive ? 1 : 0 }}
        >
          {project.year}
        </motion.span>
      </div>

      {/* Collapsed: vertical title */}
      <AnimatePresence>
        {!isActive && (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-8 left-0 right-0 flex justify-center"
          >
            <span
              className="font-black text-white text-base"
              style={{
                fontFamily: "'Sora', sans-serif",
                letterSpacing: "-0.02em",
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              {project.title}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded content */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            className="absolute bottom-0 left-0 right-0 p-7 space-y-4"
          >
            <p
              className="text-xs font-bold tracking-widest uppercase"
              style={{ fontFamily: "'Space Mono', monospace", color: project.accent }}
            >
              {project.subtitle}
            </p>

            <h3
              className="font-black text-white leading-tight"
              style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.7rem", letterSpacing: "-0.04em" }}
            >
              {project.title}
            </h3>

            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "rgba(255,255,255,0.5)",
                fontSize: "0.88rem",
                lineHeight: 1.75,
                fontWeight: 300,
              }}
            >
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    background: `${project.accent}14`,
                    border: `1px solid ${project.accent}30`,
                    color: project.accent,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-3 pt-1">
              {project.demoUrl !== "#" && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    background: project.accent,
                    boxShadow: `0 0 24px ${project.accent}55`,
                    textDecoration: "none",
                    color: "#020209",
                  }}
                >
                  <ExternalLink className="w-3.5 h-3.5" strokeWidth={2.5} />
                  Live Demo
                </a>
              )}
              <a
                href={project.codeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold"
                style={{
                  fontFamily: "'Sora', sans-serif",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.13)",
                  color: "rgba(255,255,255,0.65)",
                  textDecoration: "none",
                }}
              >
                <Github className="w-3.5 h-3.5" strokeWidth={2} />
                Code
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface OrbProps {
  style?: React.CSSProperties;
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
      animate={{ scale: [1, 1.28, 1], opacity: [0.1, 0.22, 0.1] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export default function Projectssection() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeIndex, setActiveIndex] = useState(0);

  const active = featuredProjects[activeIndex];

  // auto-advance
  useEffect(() => {
    const t = setInterval(() => setActiveIndex((i) => (i + 1) % featuredProjects.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      ref={ref}
      className="relative py-28 overflow-hidden"
      style={{ background: "#020209" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;700;800;900&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');
        .proj-track::-webkit-scrollbar { display: none; }
        .proj-track { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Dynamic accent bg */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: `radial-gradient(ellipse 55% 45% at 72% 55%, ${active.accent}10, transparent 70%)`,
        }}
        transition={{ duration: 0.9 }}
      />

      <Orb style={{ top: "-8%", left: "-5%" }} color="radial-gradient(circle, rgba(59,130,246,0.28), transparent 70%)" size={500} dur={9} delay={0} />
      <Orb style={{ bottom: "-10%", right: "-5%" }} color="radial-gradient(circle, rgba(139,92,246,0.22), transparent 70%)" size={440} dur={12} delay={2} />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(99,102,241,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.035) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.35), transparent)" }}
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-indigo-500" />
              <span className="text-xs font-bold tracking-widest uppercase text-indigo-400" style={{ fontFamily: "'Space Mono', monospace" }}>
                Selected Work
              </span>
            </div>
            <h2
              className="font-black leading-none"
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: "clamp(3rem, 6vw, 5.5rem)",
                letterSpacing: "-0.05em",
                background: "linear-gradient(135deg, #fff 20%, rgba(255,255,255,0.38) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Featured<br />Projects
            </h2>
          </div>

          {/* Active project info — right side */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.32 }}
              className="lg:text-right max-w-xs"
            >
              <div
                className="text-xs font-bold tracking-widest uppercase mb-1"
                style={{ fontFamily: "'Space Mono', monospace", color: active.accent }}
              >
                {active.subtitle} · {active.year}
              </div>
              <div
                className="font-black text-white mb-2"
                style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.35rem", letterSpacing: "-0.03em" }}
              >
                {active.title}
              </div>
              <div className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
                {active.description}
              </div>
              <div className="mt-3 text-sm" style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.2)" }}>
                {String(activeIndex + 1).padStart(2, "0")} / {String(featuredProjects.length).padStart(2, "0")}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Accordion slider */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div ref={trackRef} className="proj-track flex gap-3 overflow-x-auto">
            {featuredProjects.map((project, i) => (
              <ProjectSlide
                key={project.id}
                project={project}
                index={i}
                isActive={i === activeIndex}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          className="flex items-center justify-between mt-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.55, duration: 0.6 }}
        >
          {/* Progress pills */}
          <div className="flex gap-2 items-center">
            {featuredProjects.map((p, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className="relative rounded-full overflow-hidden"
                style={{
                  width: i === activeIndex ? 36 : 8,
                  height: 8,
                  background: i === activeIndex ? p.accent : "rgba(255,255,255,0.12)",
                  boxShadow: i === activeIndex ? `0 0 14px ${p.accent}80` : "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "width 0.4s cubic-bezier(0.22,1,0.36,1), background 0.35s, box-shadow 0.35s",
                  padding: 0,
                }}
              >
                {i === activeIndex && (
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ background: "rgba(255,255,255,0.4)" }}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    key={`timer-${activeIndex}`}
                    transition={{ duration: 4, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Prev / Next */}
          <div className="flex gap-3">
            <button
              onClick={() => setActiveIndex((i) => (i - 1 + featuredProjects.length) % featuredProjects.length)}
              style={{
                width: 44, height: 44, borderRadius: 12,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.45)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.45)"; }}
            >
              <ArrowRight style={{ width: 16, height: 16, transform: "rotate(180deg)" }} strokeWidth={2} />
            </button>
            <motion.button
              onClick={() => setActiveIndex((i) => (i + 1) % featuredProjects.length)}
              animate={{ background: active.accent, boxShadow: `0 0 22px ${active.accent}60` }}
              transition={{ duration: 0.4 }}
              style={{
                width: 44, height: 44, borderRadius: 12,
                color: "#020209", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "none",
              }}
            >
              <ArrowRight style={{ width: 16, height: 16 }} strokeWidth={2.5} />
            </motion.button>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.72, duration: 0.6 }}
        >
          <a
            href="/projects"
            className="inline-flex items-center gap-3 px-9 py-4 rounded-2xl font-bold text-base text-white relative overflow-hidden"
            style={{
              fontFamily: "'Sora', sans-serif",
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              boxShadow: "0 0 40px rgba(99,102,241,0.32)",
              textDecoration: "none",
            }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.13), transparent)" }}
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.55 }}
            />
            <span className="relative z-10">View All Projects</span>
            <MoveRight className="w-5 h-5 relative z-10" />
          </a>
          <p className="mt-4 text-sm" style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.18)" }}>
            6 featured · 50+ total projects shipped
          </p>
        </motion.div>
      </div>
    </section>
  );
}
