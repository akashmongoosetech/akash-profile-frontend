import { useRef, useState, CSSProperties } from "react";
import { Helmet } from "react-helmet-async";
import { motion, useInView } from "framer-motion";
import {
  Briefcase, GraduationCap, Award, Calendar, MapPin, ExternalLink, Check, Star, LucideIcon
} from "lucide-react";

// ── Type definitions ──────────────────────────────────────────────────────────
interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  status: string;
  description: string;
  achievements: string[];
  technologies: string[];
  accent: string;
  gradient: string;
  emoji: string;
}

interface Education {
  title: string;
  field: string;
  institution: string;
  location: string;
  period: string;
  description: string;
  achievements: string[];
  accent: string;
  gradient: string;
  emoji: string;
}

interface Certification {
  title: string;
  issuer: string;
  date: string;
  id: string;
  emoji: string;
  accent: string;
  gradient: string;
}

interface Badge {
  title: string;
  issuer: string;
  verifyLink: string;
  image: string;
  accent: string;
}

interface OrbProps {
  style?: CSSProperties;
  color: string;
  size: number;
  dur: number;
  delay: number;
}

interface SectionTitleProps {
  icon: LucideIcon;
  iconColor: string;
  text: string;
}

interface ExpItemProps {
  exp: Experience;
  index: number;
  inView: boolean;
  isLast: boolean;
}

interface EduItemProps {
  edu: Education;
  index: number;
  inView: boolean;
}

interface CertCardProps {
  cert: Certification;
  index: number;
  inView: boolean;
}

interface BadgeCardProps {
  badge: Badge;
  index: number;
  inView: boolean;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const experiences: Experience[] = [
  {
    title: "Software Engineer",
    company: "Profilics Systems Pvt. Ltd.",
    location: "Ujjain, India",
    period: "Feb 2025 – Present",
    status: "current",
    description: "Developing scalable and responsive web applications using MERN Stack. Building reusable UI components and integrating RESTful APIs. Collaborating with cross-functional Agile teams to deliver reliable software solutions.",
    achievements: [
      "Developing scalable web applications using MERN Stack",
      "Building reusable UI components for improved efficiency",
      "Integrating RESTful APIs for seamless data flow",
      "Optimizing application performance and user experience",
    ],
    technologies: ["MongoDB", "Express.js", "React", "Node.js", "REST APIs"],
    accent: "#38bdf8", gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)", emoji: "🏢",
  },
  {
    title: "Graduate Software Engineer",
    company: "Knocial India Limited",
    location: "Gurgaon, India",
    period: "June 2023 – Nov 2024",
    status: "past",
    description: "Worked on full stack development following Agile and SDLC best practices. Implemented new features, resolved bugs, and improved application performance. Participated in code reviews and collaborated closely with senior engineers.",
    achievements: [
      "Implemented new features following Agile methodology",
      "Resolved bugs and improved application performance",
      "Participated in code reviews and team collaborations",
      "Delivered scalable solutions aligned with business needs",
    ],
    technologies: ["MongoDB", "Express.js", "React", "Node.js", "JavaScript"],
    accent: "#c084fc", gradient: "linear-gradient(135deg,#8b5cf6,#a855f7)", emoji: "💡",
  },
  {
    title: "Software Trainee Intern",
    company: "Allsoft Infotech & Multimedia",
    location: "Ujjain, India",
    period: "Oct 2022 – May 2023",
    status: "past",
    description: "Assisted in developing user-friendly web interfaces using HTML, CSS, and JavaScript. Supported backend integration, testing, and deployment activities. Gained hands-on experience working on live projects under senior developer guidance.",
    achievements: [
      "Assisted in developing user-friendly web interfaces",
      "Supported backend integration and testing activities",
      "Gained hands-on experience with live projects",
      "Collaborated with senior developers on implementation",
    ],
    technologies: ["HTML", "CSS", "JavaScript", "Backend Integration", "Testing"],
    accent: "#4ade80", gradient: "linear-gradient(135deg,#10b981,#22c55e)", emoji: "🚀",
  },
];

const education: Education[] = [
  {
    title: "Bachelor of Technology",
    field: "Electronics & Computer Science Engineering",
    institution: "Ujjain Engineering College, Ujjain",
    location: "Ujjain, India",
    period: "2018 – 2022",
    description: "Graduated with First Class Honors. Specialized in software engineering, data structures, and algorithms. Active member of the coding club and organized multiple hackathons.",
    achievements: [
      "CGPA: 7.7/10.0 — First Class with Honors",
      "Winner of Inter-College Coding Competition 2018",
      "Led team of 20+ students in organizing TechFest 2019",
      "Published research paper on Machine Learning applications",
    ],
    accent: "#f472b6", gradient: "linear-gradient(135deg,#ec4899,#f43f5e)", emoji: "🎓",
  },
];

const certifications: Certification[] = [
  { title: "AWS Certified Solutions Architect",   issuer: "Amazon Web Services",                date: "March 2023",    id: "AWS-CSA-2023-001",  emoji: "☁️", accent: "#fb923c", gradient: "linear-gradient(135deg,#f97316,#ef4444)" },
  { title: "Google Cloud Professional Developer", issuer: "Google Cloud",                       date: "January 2023",  id: "GCP-PD-2023-001",   emoji: "🌐", accent: "#38bdf8", gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)" },
  { title: "Certified Kubernetes Administrator",  issuer: "Cloud Native Computing Foundation",  date: "November 2022", id: "CKA-2022-001",       emoji: "⚙️", accent: "#818cf8", gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)" },
  { title: "MongoDB Certified Developer",         issuer: "MongoDB Inc.",                       date: "September 2022",id: "MDB-DEV-2022-001",   emoji: "🍃", accent: "#4ade80", gradient: "linear-gradient(135deg,#10b981,#22c55e)" },
];

const badges: Badge[] = [
  { title: "Data Science for Business - Level 1", issuer: "IBM", verifyLink: "https://www.credly.com/badges/a3af8295-9513-4d5d-bc7a-b1d61080a439/public_url", image: "https://images.credly.com/size/340x340/images/547b89ab-8749-4dfa-8ace-edf4fc6af3be/blob", accent: "#fbbf24" },
  { title: "IBM Blockchain Essentials V2",        issuer: "IBM", verifyLink: "https://www.credly.com/badges/8225afdb-e459-4149-bf09-14ed9199fcfe/public_url", image: "https://images.credly.com/size/340x340/images/2f9eee24-6834-4595-b2b6-e8e585190a0d/IBM-Blockchain-Essentials-V2.png", accent: "#818cf8" },
  { title: "Deep Learning using TensorFlow",      issuer: "IBM", verifyLink: "https://www.credly.com/badges/09064042-1c44-42a7-8d69-ecca98568a27/public_url", image: "https://images.credly.com/size/340x340/images/ba85e07d-8263-4f30-b39b-d79883ee558c/blob", accent: "#38bdf8" },
];

// ── Shared utilities ──────────────────────────────────────────────────────────
function Orb({ style, color, size, dur, delay }: OrbProps) {
  return (
    <motion.div className="absolute rounded-full blur-3xl pointer-events-none"
      style={{ width: size, height: size, background: color, ...style }}
      animate={{ scale: [1, 1.28, 1], opacity: [0.08, 0.18, 0.08] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function SectionTitle({ icon: Icon, iconColor, text }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-3 mb-12">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${iconColor}18`, border: `1px solid ${iconColor}30` }}>
        <Icon className="w-5 h-5" style={{ color: iconColor }} strokeWidth={1.8} />
      </div>
      <h2 className="font-black text-white" style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.6rem", letterSpacing: "-0.04em" }}>{text}</h2>
      <div className="h-px flex-1 ml-2" style={{ background: `linear-gradient(90deg,${iconColor}40,transparent)` }} />
    </div>
  );
}

// ── Experience timeline item ───────────────────────────────────────────────────
function ExpItem({ exp, index, inView, isLast }: ExpItemProps) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current;
    if (!r) return;
    const rect = r.getBoundingClientRect();
    setMousePos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  return (
    <div className="relative flex gap-6">
      {/* Spine */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 44 }}>
        {/* Node */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: index * 0.15 + 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          {exp.status === "current" && (
            <>
              <motion.div className="absolute inset-0 rounded-full" style={{ background: exp.accent, margin: -6 }} animate={{ scale: [1, 2.2], opacity: [0.3, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
              <motion.div className="absolute inset-0 rounded-full" style={{ background: exp.accent, margin: -6 }} animate={{ scale: [1, 1.7], opacity: [0.25, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} />
            </>
          )}
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-lg relative z-10"
            style={{ background: exp.gradient, boxShadow: `0 0 20px ${exp.accent}60`, border: "3px solid #020209" }}>
            <span style={{ fontSize: "1.1rem" }}>{exp.emoji}</span>
          </div>
        </motion.div>

        {/* Line to next */}
        {!isLast && (
          <motion.div
            className="flex-1 w-px mt-2"
            style={{ background: `linear-gradient(180deg,${exp.accent}60,rgba(255,255,255,0.05))`, transformOrigin: "top", width: 1 }}
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ delay: index * 0.15 + 0.4, duration: 0.6 }}
          />
        )}
      </div>

      {/* Card */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: 30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: index * 0.15, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMouseMove}
        className="relative flex-1 mb-10"
        style={{ perspective: 900 }}
      >
        <motion.div className="absolute -inset-px rounded-3xl pointer-events-none" style={{ background: exp.gradient }} animate={{ opacity: hovered ? 0.55 : 0 }} transition={{ duration: 0.3 }} />
        {hovered && <div className="absolute inset-0 rounded-3xl pointer-events-none z-0" style={{ background: `radial-gradient(250px circle at ${mousePos.x}% ${mousePos.y}%, ${exp.accent}18, transparent 70%)` }} />}

        <motion.div className="relative rounded-3xl overflow-hidden" style={{ background: "rgb(11,12,24)", border: "1px solid rgba(255,255,255,0.06)" }}
          animate={{ y: hovered ? -4 : 0 }} transition={{ type: "spring", stiffness: 280, damping: 26 }}>
          <motion.div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: exp.gradient }} animate={{ scaleX: hovered ? 1 : 0.2, opacity: hovered ? 1 : 0.3 }} transition={{ duration: 0.4 }} />
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(${exp.accent} 1px,transparent 1px),linear-gradient(90deg,${exp.accent} 1px,transparent 1px)`, backgroundSize: "28px 28px", opacity: 0.03 }} />
          <motion.div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full pointer-events-none" style={{ background: exp.gradient, opacity: 0.07 }} animate={{ scale: hovered ? 1.5 : 1 }} transition={{ duration: 0.5 }} />

          <div className="relative z-10 p-7">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-black text-white" style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.15rem", letterSpacing: "-0.03em" }}>{exp.title}</h3>
                  {exp.status === "current" && (
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full" style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)" }}>
                      <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                      <span className="text-xs font-bold text-emerald-400" style={{ fontFamily: "'Space Mono', monospace" }}>Current</span>
                    </div>
                  )}
                </div>
                <div className="font-bold mb-2" style={{ fontFamily: "'Sora', sans-serif", color: exp.accent, fontSize: "0.95rem" }}>{exp.company}</div>
                <div className="flex flex-wrap gap-4">
                  {[{ icon: Calendar, text: exp.period }, { icon: MapPin, text: exp.location }].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.25)" }} strokeWidth={1.8} />
                      <span className="text-xs" style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.28)" }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tag */}
              <span className="text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0" style={{ fontFamily: "'Space Mono', monospace", background: `${exp.accent}12`, border: `1px solid ${exp.accent}28`, color: exp.accent, letterSpacing: "0.04em" }}>
                {index === 0 ? "Full-Time" : index === 1 ? "Full-Time" : "Internship"}
              </span>
            </div>

            <p className="mb-5 text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.42)", fontWeight: 300, lineHeight: 1.8 }}>{exp.description}</p>

            {/* Divider */}
            <div className="h-px mb-5" style={{ background: `linear-gradient(90deg,${exp.accent}30,transparent)` }} />

            {/* Two-col: achievements + tech */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="text-xs font-black uppercase tracking-widest mb-3" style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.3)" }}>Key Achievements</div>
                <div className="flex flex-col gap-2">
                  {exp.achievements.map((a: string) => (
                    <div key={a} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${exp.accent}18`, border: `1px solid ${exp.accent}30` }}>
                        <Check className="w-2.5 h-2.5" style={{ color: exp.accent }} strokeWidth={2.5} />
                      </div>
                      <span className="text-xs leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.42)", lineHeight: 1.65, fontWeight: 300 }}>{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-black uppercase tracking-widest mb-3" style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.3)" }}>Technologies</div>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((t: string) => (
                    <span key={t} className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ fontFamily: "'Space Mono', monospace", background: `${exp.accent}12`, border: `1px solid ${exp.accent}25`, color: exp.accent, fontSize: "0.65rem", letterSpacing: "0.03em" }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ── Education item ─────────────────────────────────────────────────────────────
function EduItem({ edu, index, inView }: EduItemProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative"
    >
      <motion.div className="absolute -inset-px rounded-3xl pointer-events-none" style={{ background: edu.gradient }} animate={{ opacity: hovered ? 0.55 : 0 }} transition={{ duration: 0.3 }} />
      <motion.div className="relative rounded-3xl overflow-hidden" style={{ background: "rgb(11,12,24)", border: "1px solid rgba(255,255,255,0.06)" }}
        animate={{ y: hovered ? -4 : 0 }} transition={{ type: "spring", stiffness: 280, damping: 26 }}>
        <motion.div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: edu.gradient }} animate={{ scaleX: hovered ? 1 : 0.2, opacity: hovered ? 1 : 0.3 }} transition={{ duration: 0.4 }} />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(${edu.accent} 1px,transparent 1px),linear-gradient(90deg,${edu.accent} 1px,transparent 1px)`, backgroundSize: "28px 28px", opacity: 0.03 }} />

        <div className="relative z-10 p-7">
          <div className="flex items-start gap-5 mb-5">
            <motion.div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: edu.gradient, boxShadow: hovered ? `0 0 20px ${edu.accent}60` : "none", transition: "box-shadow 0.3s" }}
              animate={{ scale: hovered ? 1.08 : 1, rotate: hovered ? 6 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              {edu.emoji}
            </motion.div>
            <div className="flex-1">
              <h3 className="font-black text-white mb-0.5" style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.1rem", letterSpacing: "-0.03em" }}>{edu.title}</h3>
              <div className="font-bold mb-0.5" style={{ fontFamily: "'Sora', sans-serif", color: edu.accent, fontSize: "0.9rem" }}>{edu.field}</div>
              <div className="text-sm mb-2" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.45)" }}>{edu.institution}</div>
              <div className="flex flex-wrap gap-4">
                {[{ icon: Calendar, text: edu.period }, { icon: MapPin, text: edu.location }].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.25)" }} strokeWidth={1.8} />
                    <span className="text-xs" style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.28)" }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-sm leading-relaxed mb-5" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.42)", fontWeight: 300, lineHeight: 1.8 }}>{edu.description}</p>
          <div className="h-px mb-5" style={{ background: `linear-gradient(90deg,${edu.accent}30,transparent)` }} />

          <div className="text-xs font-black uppercase tracking-widest mb-3" style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.3)" }}>Achievements</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {edu.achievements.map((a: string) => (
              <div key={a} className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${edu.accent}18`, border: `1px solid ${edu.accent}30` }}>
                  <Star className="w-2.5 h-2.5" style={{ color: edu.accent }} strokeWidth={2.5} />
                </div>
                <span className="text-xs leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.42)", lineHeight: 1.65, fontWeight: 300 }}>{a}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Cert card ─────────────────────────────────────────────────────────────────
function CertCard({ cert, index, inView }: CertCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative"
    >
      <motion.div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ background: cert.gradient }} animate={{ opacity: hovered ? 0.55 : 0 }} transition={{ duration: 0.3 }} />
      <motion.div className="relative rounded-2xl overflow-hidden p-5 flex items-start gap-4" style={{ background: "rgb(11,12,24)", border: "1px solid rgba(255,255,255,0.06)" }}
        animate={{ y: hovered ? -4 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 26 }}>
        <motion.div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: cert.gradient }} animate={{ scaleX: hovered ? 1 : 0.2, opacity: hovered ? 1 : 0.3 }} transition={{ duration: 0.4 }} />

        <motion.div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: cert.gradient, boxShadow: hovered ? `0 0 18px ${cert.accent}60` : "none", transition: "box-shadow 0.3s" }}
          animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 8 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
          {cert.emoji}
        </motion.div>

        <div className="flex-1 min-w-0">
          <h3 className="font-black text-white mb-0.5 leading-tight" style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.9rem", letterSpacing: "-0.02em" }}>{cert.title}</h3>
          <div className="text-xs mb-2" style={{ fontFamily: "'DM Sans', sans-serif", color: cert.accent }}>{cert.issuer}</div>
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.25)" }}>{cert.date}</span>
            <button className="flex items-center gap-1 text-xs font-bold" style={{ fontFamily: "'Space Mono', monospace", color: hovered ? cert.accent : "rgba(255,255,255,0.2)", transition: "color 0.3s", background: "none", border: "none", cursor: "pointer" }}>
              <ExternalLink className="w-3 h-3" /> Verify
            </button>
          </div>
          <div className="text-xs mt-1" style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.15)", fontSize: "0.6rem" }}>ID: {cert.id}</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Badge card ────────────────────────────────────────────────────────────────
function BadgeCard({ badge, index, inView }: BadgeCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 30 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative"
    >
      <motion.div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ background: `linear-gradient(135deg,${badge.accent},${badge.accent}80)` }} animate={{ opacity: hovered ? 0.55 : 0 }} transition={{ duration: 0.3 }} />
      <motion.div className="relative rounded-2xl overflow-hidden p-6 flex flex-col items-center text-center gap-4" style={{ background: "rgb(11,12,24)", border: "1px solid rgba(255,255,255,0.06)" }}
        animate={{ y: hovered ? -5 : 0 }} transition={{ type: "spring", stiffness: 280, damping: 26 }}>
        <motion.div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg,${badge.accent},${badge.accent}50)` }} animate={{ scaleX: hovered ? 1 : 0.2, opacity: hovered ? 1 : 0.3 }} transition={{ duration: 0.4 }} />

        {/* Badge image */}
        <motion.div className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center p-1"
          style={{ background: "white", boxShadow: hovered ? `0 0 24px ${badge.accent}60` : "none", transition: "box-shadow 0.3s" }}
          animate={{ scale: hovered ? 1.1 : 1 }} transition={{ type: "spring", stiffness: 380, damping: 22 }}>
          <img src={badge.image} alt={badge.title} className="w-full h-full object-contain" />
        </motion.div>

        <div>
          <h3 className="font-black text-white mb-1 leading-tight" style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.88rem", letterSpacing: "-0.02em" }}>{badge.title}</h3>
          <div className="text-xs font-bold mb-3" style={{ fontFamily: "'Space Mono', monospace", color: badge.accent }}>{badge.issuer}</div>

          <a href={badge.verifyLink} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ fontFamily: "'Space Mono', monospace", background: `${badge.accent}14`, border: `1px solid ${badge.accent}28`, color: badge.accent, textDecoration: "none", letterSpacing: "0.04em" }}>
            <ExternalLink className="w-3 h-3" /> Verify Badge
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Experience() {
  const expRef   = useRef(null);
  const eduRef   = useRef(null);
  const certRef  = useRef(null);
  const badgeRef = useRef(null);

  const expInView   = useInView(expRef,   { once: true, margin: "-60px" });
  const eduInView   = useInView(eduRef,   { once: true, margin: "-60px" });
  const certInView  = useInView(certRef,  { once: true, margin: "-60px" });
  const badgeInView = useInView(badgeRef, { once: true, margin: "-60px" });

  return (
    <>
      <Helmet>
        <title>Experience — Akash Raikwar</title>
        <meta name="description" content="View my professional experience and work history. Learn about my roles as a full-stack developer and software engineer." />
      </Helmet>

      <div className="min-h-screen pt-20 pb-16 relative overflow-hidden" style={{ background: "#020209" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;700;800;900&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');
        `}</style>

        <Orb style={{ top: "5%",   left: "-5%" }}  color="radial-gradient(circle,rgba(59,130,246,0.22),transparent 70%)"  size={480} dur={10} delay={0} />
        <Orb style={{ top: "45%",  right: "-5%" }} color="radial-gradient(circle,rgba(139,92,246,0.18),transparent 70%)" size={420} dur={13} delay={2} />
        <Orb style={{ bottom:"5%", left: "30%" }}  color="radial-gradient(circle,rgba(74,222,128,0.1),transparent 70%)"  size={340} dur={14} delay={1} />

        <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(99,102,241,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.025) 1px,transparent 1px)", backgroundSize: "64px 64px", zIndex: 0 }} />
        <motion.div className="fixed left-0 right-0 h-px pointer-events-none" style={{ background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.3),transparent)", zIndex: 1 }} animate={{ top: ["0%", "100%"] }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12">

          {/* Hero */}
          <motion.div className="text-center py-20" initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-indigo-500" />
              <span className="text-xs font-bold tracking-widest uppercase text-indigo-400" style={{ fontFamily: "'Space Mono', monospace" }}>My Journey</span>
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-indigo-500" />
            </div>
            <h1 className="font-black leading-none mb-5" style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(3rem,7vw,5.5rem)", letterSpacing: "-0.06em", background: "linear-gradient(135deg,#fff 20%,rgba(255,255,255,0.4) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Experience &<br />Education
            </h1>
            <p className="text-xl max-w-xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.38)", fontWeight: 300, lineHeight: 1.8 }}>
              My professional journey, educational background, and continuous learning path.
            </p>
          </motion.div>

          {/* ── Work Experience ── */}
          <div ref={expRef} className="mb-20">
            <SectionTitle icon={Briefcase} iconColor="#38bdf8" text="Professional Experience" />
            <div className="flex flex-col">
              {experiences.map((exp, i) => (
                <ExpItem key={exp.company} exp={exp} index={i} inView={expInView} isLast={i === experiences.length - 1} />
              ))}
            </div>
          </div>

          {/* ── Education ── */}
          <div ref={eduRef} className="mb-20">
            <SectionTitle icon={GraduationCap} iconColor="#f472b6" text="Education" />
            <div className="flex flex-col gap-5">
              {education.map((edu, i) => <EduItem key={edu.title} edu={edu} index={i} inView={eduInView} />)}
            </div>
          </div>

          {/* ── Certifications ── */}
          <div ref={certRef} className="mb-20">
            <SectionTitle icon={Award} iconColor="#4ade80" text="Certifications" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certifications.map((cert, i) => <CertCard key={cert.title} cert={cert} index={i} inView={certInView} />)}
            </div>
          </div>

          {/* ── Badges ── */}
          <div ref={badgeRef} className="mb-12">
            <SectionTitle icon={Award} iconColor="#fbbf24" text="Badges" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {badges.map((badge, i) => <BadgeCard key={badge.title} badge={badge} index={i} inView={badgeInView} />)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}