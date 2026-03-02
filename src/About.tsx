import React, { useRef, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useInView } from 'framer-motion';
import { Calendar, MapPin, Code, Award, Users, GraduationCap, Briefcase, LucideIcon } from 'lucide-react';
import ExpertiseSection from './About/Expertisesection';

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
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * numericTarget));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  const suffix = target.replace(/[0-9]/g, "");
  return { count: count || 0, suffix };
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

// ── Stat Card ───────────────────────────────────────────────────────────────
interface StatProps {
  icon: LucideIcon;
  value: string;
  label: string;
  sub: string;
  gradient: string;
  accentColor: string;
  index: number;
  inView: boolean;
}

function StatCard({ icon: Icon, value, label, sub, gradient, accentColor, index, inView }: StatProps) {
  const [hovered, setHovered] = useState(false);
  const { count, suffix } = useCounter(value, 2000 + index * 200, inView);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group cursor-default"
      style={{ perspective: 1000 }}
    >
      {/* Glow layer */}
      <motion.div
        className="absolute -inset-px rounded-2xl"
        style={{ background: gradient }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        className="relative rounded-2xl overflow-hidden"
        style={{ background: "rgb(10, 10, 22)", border: "1px solid rgba(255,255,255,0.06)" }}
        animate={{ rotateY: hovered ? 3 : 0, rotateX: hovered ? -3 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {/* Top gradient strip */}
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: gradient }} />

        {/* Corner decoration */}
        <motion.div
          className="absolute top-4 right-4 w-6 h-6 rounded-full opacity-15"
          style={{ background: gradient }}
          animate={{ scale: hovered ? 5 : 1, opacity: hovered ? 0.04 : 0.15 }}
          transition={{ duration: 0.5 }}
        />

        <div className="relative z-10 p-6 flex flex-col items-center text-center gap-4">
          {/* Icon */}
          <motion.div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: gradient }}
            animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 5 : 0 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Icon className="w-5 h-5 text-white" strokeWidth={1.8} />
          </motion.div>

          {/* Animated number */}
          <div>
            <motion.div
              className="font-black leading-none"
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: "clamp(2rem, 4vw, 2.8rem)",
                letterSpacing: "-0.04em",
                color: hovered ? "transparent" : "#ffffff",
              }}
            >
              <span style={{ position: "relative", zIndex: 2, color: hovered ? "transparent" : "#ffffff" }}>
                {count}{suffix}
              </span>
              {hovered && (
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: gradient,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {count}{suffix}
                </span>
              )}
            </motion.div>
            <div
              className="text-xs font-semibold tracking-widest uppercase mt-1"
              style={{
                fontFamily: "'Space Mono', monospace",
                color: hovered ? accentColor : "rgba(255,255,255,0.4)",
                transition: "color 0.3s",
              }}
            >
              {label}
            </div>
          </div>

          {/* Sub-label */}
          <div className="h-px w-full" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.3)" }}>
            {sub}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Timeline Item ──────────────────────────────────────────────────────────
interface TimelineItemProps {
  title: string;
  company: string;
  location?: string;
  period: string;
  description: string;
  achievements?: string[];
  technologies?: string[];
  accent: string;
  gradient: string;
  type: 'experience' | 'education';
  index: number;
  inView: boolean;
}

function TimelineItem({ title, company, location, period, description, achievements, technologies, accent, gradient, type, index, inView }: TimelineItemProps) {
  const [hovered, setHovered] = useState(false);
  const Icon = type === 'experience' ? Briefcase : GraduationCap;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative pl-8 pb-8 border-l-2 last:border-l-0 last:pb-0"
      style={{ borderColor: `${accent}30` }}
    >
      {/* Node */}
      <motion.div
        className="absolute -left-3 top-0 w-6 h-6 rounded-full border-4 border-gray-900 flex items-center justify-center"
        style={{ background: gradient }}
        animate={{ scale: hovered ? 1.2 : 1 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <Icon className="w-3 h-3 text-white" strokeWidth={2} />
      </motion.div>

      <motion.div
        className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 ml-6"
        style={{ background: "rgb(11,12,24)", border: "1px solid rgba(255,255,255,0.06)" }}
        animate={{ scale: hovered ? 1.01 : 1, x: hovered ? 4 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        {/* Top strip */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
          style={{ background: gradient }}
          animate={{ scaleX: hovered ? 1 : 0.3, opacity: hovered ? 1 : 0.5 }}
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.02em" }}>{title}</h3>
            <h4 className="text-sm" style={{ color: accent, fontFamily: "'Space Mono', monospace" }}>{company}</h4>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full mt-2 sm:mt-0" style={{ fontFamily: "'Space Mono', monospace", background: `${accent}15`, border: `1px solid ${accent}30`, color: accent }}>
            {period}
          </span>
        </div>
        
        {location && (
          <p className="text-xs mb-3 flex items-center gap-1" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Space Mono', monospace" }}>
            <MapPin className="w-3 h-3" /> {location}
          </p>
        )}
        
        <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif", fontWeight: 300, lineHeight: 1.7 }}>
          {description}
        </p>
        
        {achievements && achievements.length > 0 && (
          <div className="mb-4">
            <h5 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Space Mono', monospace" }}>
              Key Achievements
            </h5>
            <ul className="space-y-1">
              {achievements.map((achievement, achIndex) => (
                <li key={achIndex} className="text-xs flex items-start gap-2" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif" }}>
                  <span className="text-emerald-400">▹</span>
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {technologies && technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, techIndex) => (
              <span
                key={techIndex}
                className="px-2 py-1 rounded text-xs font-medium"
                style={{ fontFamily: "'Space Mono', monospace", background: `${accent}15`, border: `1px solid ${accent}25`, color: accent }}
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}



// ── Main Component ─────────────────────────────────────────────────────────
const About: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const stats = [
    { icon: Code, value: '2+', label: 'Years Exp.', sub: 'Building production apps', gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)', accentColor: '#60a5fa' },
    { icon: Award, value: '50+', label: 'Projects', sub: 'Shipped across industries', gradient: 'linear-gradient(135deg, #10b981, #059669)', accentColor: '#34d399' },
    { icon: Users, value: '20+', label: 'Clients', sub: 'Across 4+ countries', gradient: 'linear-gradient(135deg, #8b5cf6, #a855f7)', accentColor: '#c084fc' },
  ];

  const timeline = [
    {
      type: 'experience' as const,
      title: 'Software Engineer',
      company: 'Profilics Systems Pvt. Ltd.',
      location: 'Ujjain, India',
      period: 'Feb 2025 - Present',
      description: 'Developing scalable and responsive web applications using MERN Stack. Building reusable UI components and integrating RESTful APIs. Collaborating with cross-functional Agile teams to deliver reliable software solutions.',
      achievements: [
        'Developing scalable web applications using MERN Stack',
        'Building reusable UI components for improved efficiency',
        'Integrating RESTful APIs for seamless data flow',
        'Optimizing application performance and user experience'
      ],
      technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'REST APIs'],
      accent: '#38bdf8',
      gradient: 'linear-gradient(135deg,#3b82f6,#06b6d4)',
    },
    {
      type: 'experience' as const,
      title: 'Graduate Software Engineer',
      company: 'Knocial India Limited',
      location: 'Gurgaon, India',
      period: 'June 2023 - Nov 2024',
      description: 'Worked on full stack development following Agile and SDLC best practices. Implemented new features, resolved bugs, and improved application performance.',
      achievements: [
        'Implemented new features following Agile methodology',
        'Resolved bugs and improved application performance',
        'Participated in code reviews and team collaborations',
        'Delivered scalable solutions aligned with business needs'
      ],
      technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'JavaScript'],
      accent: '#4ade80',
      gradient: 'linear-gradient(135deg,#10b981,#22c55e)',
    },
    {
      type: 'experience' as const,
      title: 'Software Trainee Intern',
      company: 'Allsoft Infotech & Multimedia',
      location: 'Ujjain, India',
      period: 'Oct 2022 - May 2023',
      description: 'Assisted in developing user-friendly web interfaces using HTML, CSS, and JavaScript. Supported backend integration, testing, and deployment activities.',
      achievements: [
        'Assisted in developing user-friendly web interfaces',
        'Supported backend integration and testing activities',
        'Gained hands-on experience with live projects',
        'Collaborated with senior developers on implementation'
      ],
      technologies: ['HTML', 'CSS', 'JavaScript', 'Backend Integration', 'Testing'],
      accent: '#c084fc',
      gradient: 'linear-gradient(135deg,#8b5cf6,#a855f7)',
    },
    {
      type: 'education' as const,
      title: 'Bachelor of Technology',
      company: 'Electronics & Computer Science Engineering',
      institution: 'Ujjain Engineering College, Ujjain',
      period: '2018 - 2022',
      description: 'Graduated with First Class Honors. Specialized in software engineering, data structures, and algorithms. Active member of the coding club.',
      achievements: [
        'CGPA: 7.7/10.0 - First Class with Honors',
        'Winner of Inter-College Coding Competition 2018',
        'Led team of 20+ students in organizing TechFest 2019',
        'Published research paper on Machine Learning applications'
      ],
      accent: '#fb923c',
      gradient: 'linear-gradient(135deg,#f97316,#ef4444)',
    },
  ];


  return (
    <>
      <Helmet>
        <title>About Me — Akash Raikwar</title>
        <meta name="title" content="About Me — Akash Raikwar" />
        <meta name="description" content="Learn about Akash Raikwar, a full-stack software engineer with expertise in React, Node.js, TypeScript, and MongoDB. View education, experience, and skills." />
        <meta property="og:title" content="About Me — Akash Raikwar" />
        <meta property="og:description" content="Learn about Akash Raikwar, a full-stack software engineer with expertise in React, Node.js, TypeScript, and MongoDB. View education, experience, and skills." />
        <meta property="twitter:title" content="About Me — Akash Raikwar" />
        <meta property="twitter:description" content="Learn about Akash Raikwar, a full-stack software engineer with expertise in React, Node.js, TypeScript, and MongoDB. View education, experience, and skills." />
      </Helmet>

      <section
        ref={ref}
        className="relative min-h-screen pt-20 pb-16 overflow-hidden"
        style={{ background: "#020209" }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;700;800;900&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');
        `}</style>

        {/* Background Orbs */}
        <Orb style={{ top: "-8%", left: "-5%" }} color="radial-gradient(circle,rgba(59,130,246,0.35),transparent 70%)" size={500} dur={9} delay={0} />
        <Orb style={{ bottom: "-10%", right: "-5%" }} color="radial-gradient(circle,rgba(139,92,246,0.28),transparent 70%)" size={440} dur={12} delay={2} />
        <Orb style={{ top: "40%", left: "40%" }} color="radial-gradient(circle,rgba(16,185,129,0.15),transparent 70%)" size={300} dur={14} delay={1} />

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
          style={{ background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.3),transparent)" }}
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="inline-flex items-center gap-3 mb-5"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-indigo-500" />
              <span className="text-xs font-bold tracking-widest uppercase text-indigo-400" style={{ fontFamily: "'Space Mono', monospace" }}>
                Get To Know Me
              </span>
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-indigo-500" />
            </motion.div>

            <h2
              className="font-black leading-tight mb-4"
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                letterSpacing: "-0.04em",
                background: "linear-gradient(135deg,#fff 30%,rgba(255,255,255,0.4) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              About Me
            </h2>

            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.38)", fontWeight: 300, lineHeight: 1.8 }}
            >
              Passionate software engineer with a love for creating innovative solutions and turning ideas into reality.
            </p>
          </motion.div>

          {/* Profile Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-20">
            {/* Left - Profile Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative">
                {/* Glow ring */}
                <motion.div
                  className="absolute rounded-full"
                  style={{ width: 320, height: 320, background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)" }}
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                {/* Image container */}
                <div className="relative rounded-3xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                  <img
                    src="./my-pic.jpg"
                    alt="Akash Raikwar"
                    className="w-72 h-72 lg:w-80 lg:h-80 object-cover"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                {/* Floating badges */}
                <motion.div
                  className="absolute -bottom-4 -right-4 px-4 py-2 rounded-xl flex items-center gap-2"
                  style={{ background: "rgb(10,11,22)", border: "1px solid rgba(255,255,255,0.1)" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'Space Mono', monospace" }}>Ujjain, India</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Right - Bio */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="space-y-6"
            >
              <h3
                className="font-bold text-white text-2xl"
                style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.02em" }}
              >
                My Story
              </h3>
              
              <div className="space-y-4 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif", fontWeight: 300, lineHeight: 1.8 }}>
                <p>
                  I'm a passionate software engineer with over 2+ years of experience in building scalable web applications 
                  and leading development teams. My journey started with a curiosity about how things work, which led me 
                  to pursue computer science and eventually specialize in full-stack development.
                </p>
                <p>
                  I believe in writing clean, maintainable code and creating user experiences that make a difference. 
                  When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, 
                  or sharing knowledge with the developer community.
                </p>
                <p>
                  My expertise spans across modern JavaScript frameworks, cloud technologies, and database design. 
                  I'm particularly passionate about React, Node.js, and building performant, accessible web applications.
                </p>
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Space Mono', monospace" }}>Available for opportunities</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              {stats.map((stat, index) => (
                <StatCard
                  key={stat.label}
                  icon={stat.icon}
                  value={stat.value}
                  label={stat.label}
                  sub={stat.sub}
                  gradient={stat.gradient}
                  accentColor={stat.accentColor}
                  index={index}
                  inView={inView}
                />
              ))}
            </div>
          </motion.div>

          {/* Timeline Section */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <div className="text-center mb-12">
              <h2
                className="font-black leading-tight mb-3"
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  letterSpacing: "-0.03em",
                  background: "linear-gradient(135deg,#fff 30%,rgba(255,255,255,0.4) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Experience & Education
              </h2>
            </div>
            
            <div className="max-w-4xl mx-auto">
              {timeline.map((item, index) => (
                <TimelineItem
                  key={`${item.type}-${index}`}
                  title={item.title}
                  company={item.company}
                  location={item.location}
                  period={item.period}
                  description={item.description}
                  achievements={item.achievements}
                  technologies={item.technologies}
                  accent={item.accent}
                  gradient={item.gradient}
                  type={item.type}
                  index={index}
                  inView={inView}
                />
              ))}
            </div>
          </motion.div>

          {/* Expertise Section */}
          <ExpertiseSection/>
        </div>
      </section>
    </>
  );
};

export default About;
