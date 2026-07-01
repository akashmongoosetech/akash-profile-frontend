import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Code, Monitor, Server, Bot, Check, LucideIcon } from "lucide-react";

interface ExperienceCard {
  icon: LucideIcon;
  title: string;
  description: string;
  technologies: string[];
  capabilities: string[];
  accent: string;
  gradient: string;
  glow: string;
  tag: string;
}

const experienceData: ExperienceCard[] = [
  {
    icon: Code,
    title: "Full Stack Web Development",
    accent: "#38bdf8",
    gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)",
    glow: "rgba(56,189,248,0.18)",
    tag: "Full-Stack",
    description:
      "Building scalable, end-to-end web applications using the MERN stack with clean architecture, responsive UIs, and robust backend services.",
    technologies: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "JavaScript (ES6+)",
      "REST APIs",
      "HTML5/CSS3",
      "Bootstrap",
    ],
    capabilities: [
      "End-to-end application development from concept to deployment",
      "Custom admin dashboards and data management interfaces",
      "Authentication systems with JWT and role-based access control",
      "Responsive, cross-browser compatible user interfaces",
    ],
  },
  {
    icon: Monitor,
    title: "Frontend Engineering & UI",
    accent: "#c084fc",
    gradient: "linear-gradient(135deg,#8b5cf6,#a855f7)",
    glow: "rgba(192,132,252,0.18)",
    tag: "React",
    description:
      "Crafting dynamic, performant, and accessible user interfaces with modern React patterns, state management, and component-driven architecture.",
    technologies: [
      "React.js",
      "JavaScript (ES6+)",
      "HTML5",
      "CSS3",
      "Bootstrap",
      "Responsive Design",
      "Framer Motion",
      "API Integration",
    ],
    capabilities: [
      "Reusable component libraries and design systems",
      "State management with Context API and Redux patterns",
      "Smooth animations and transitions for polished UX",
      "Performance optimization: code splitting, lazy loading, memoization",
    ],
  },
  {
    icon: Server,
    title: "Backend & API Engineering",
    accent: "#4ade80",
    gradient: "linear-gradient(135deg,#10b981,#22c55e)",
    glow: "rgba(74,222,128,0.18)",
    tag: "Node.js",
    description:
      "Designing and building secure, scalable server-side applications with Node.js and Express, backed by optimized MongoDB databases.",
    technologies: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "REST API Design",
      "JWT Auth",
      "Middleware",
      "Error Handling",
      "API Security",
    ],
    capabilities: [
      "RESTful API design and implementation with Express.js",
      "MongoDB schema design, indexing, and aggregation pipelines",
      "Secure authentication, authorization, and input validation",
      "API documentation, testing, and deployment workflows",
    ],
  },
  {
    icon: Bot,
    title: "AI & Intelligent Solutions",
    accent: "#f472b6",
    gradient: "linear-gradient(135deg,#ec4899,#f43f5e)",
    glow: "rgba(244,114,182,0.18)",
    tag: "AI / ML",
    description:
      "Integrating artificial intelligence into modern web applications — from LLM-powered features to intelligent chatbots and business process automation.",
    technologies: [
      "LLM Integration",
      "OpenAI / GPT APIs",
      "Chatbot Development",
      "AI Automation",
      "Natural Language Processing",
      "Prompt Engineering",
      "RAG Pipelines",
      "Business Workflow Automation",
    ],
    capabilities: [
      "Integrating AI assistants and chatbots into websites and apps",
      "LLM integration for content generation, summarization, and Q&A",
      "Building intelligent business automation solutions",
      "End-to-end AI-powered features for modern applications",
    ],
  },
];

function ExperienceCard({
  card,
  index,
  inView,
}: {
  card: ExperienceCard;
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = card.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.94 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        delay: index * 0.12,
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative cursor-default"
      style={{ perspective: 900 }}
    >
      {/* Glow border */}
      <motion.div
        className="absolute -inset-px rounded-3xl pointer-events-none"
        style={{ background: card.gradient }}
        animate={{ opacity: hovered ? 0.6 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        className="relative rounded-3xl overflow-hidden h-full"
        style={{
          background: "rgb(11,12,24)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
        animate={{ y: hovered ? -5 : 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
      >
        {/* Top strip */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{
            background: card.gradient,
            boxShadow: hovered ? `0 0 10px ${card.accent}` : "none",
          }}
          animate={{ scaleX: hovered ? 1 : 0.2, opacity: hovered ? 1 : 0.35 }}
          transition={{ duration: 0.4 }}
        />

        {/* Corner glow */}
        <motion.div
          className="absolute top-0 right-0 w-28 h-28 rounded-bl-full pointer-events-none"
          style={{ background: card.gradient, opacity: 0.07 }}
          animate={{
            scale: hovered ? 1.6 : 1,
            opacity: hovered ? 0.11 : 0.07,
          }}
          transition={{ duration: 0.5 }}
        />

        <div className="relative z-10 p-6 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <motion.div
              className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{ background: card.gradient }}
              animate={{
                scale: hovered ? 1.1 : 1,
                rotate: hovered ? 8 : 0,
                boxShadow: hovered
                  ? `0 0 20px ${card.accent}60`
                  : "none",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Icon className="w-5 h-5 text-white" strokeWidth={1.8} />
            </motion.div>
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{
                fontFamily: "'Space Mono', monospace",
                background: `${card.accent}14`,
                border: `1px solid ${card.accent}28`,
                color: card.accent,
                letterSpacing: "0.04em",
              }}
            >
              {card.tag}
            </span>
          </div>

          {/* Title */}
          <h3
            className="font-black text-white leading-tight"
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "1rem",
              letterSpacing: "-0.03em",
            }}
          >
            {card.title}
          </h3>

          {/* Description */}
          <p
            className="text-sm leading-relaxed"
            style={{
              color: "rgba(255,255,255,0.5)",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              lineHeight: 1.7,
            }}
          >
            {card.description}
          </p>

          {/* Divider */}
          <motion.div
            className="h-px"
            style={{
              background: `linear-gradient(90deg,${card.accent}45,transparent)`,
            }}
            animate={{ opacity: hovered ? 1 : 0.3 }}
          />

          {/* Technologies */}
          <div>
            <h4
              className="text-xs font-bold uppercase tracking-wider mb-2"
              style={{
                color: "rgba(255,255,255,0.3)",
                fontFamily: "'Space Mono', monospace",
              }}
            >
              Technologies
            </h4>
            <div className="flex flex-wrap gap-2">
              {card.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    background: `${card.accent}12`,
                    border: `1px solid ${card.accent}22`,
                    color: card.accent,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Capabilities */}
          <div>
            <h4
              className="text-xs font-bold uppercase tracking-wider mb-2"
              style={{
                color: "rgba(255,255,255,0.3)",
                fontFamily: "'Space Mono', monospace",
              }}
            >
              Key Capabilities
            </h4>
            <div className="space-y-1.5">
              {card.capabilities.map((cap) => (
                <div key={cap} className="flex items-start gap-2">
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: `${card.accent}18`,
                      border: `1px solid ${card.accent}30`,
                    }}
                  >
                    <Check
                      className="w-2.5 h-2.5"
                      style={{ color: card.accent }}
                      strokeWidth={2.5}
                    />
                  </div>
                  <span
                    className="text-xs"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: "rgba(255,255,255,0.45)",
                      lineHeight: 1.6,
                      fontWeight: 300,
                    }}
                  >
                    {cap}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProfessionalExperience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative py-20 overflow-hidden"
      style={{ background: "#020209" }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 36 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-indigo-500" />
            <span
              className="text-xs font-bold tracking-widest uppercase text-indigo-400"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              What I Do
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-indigo-500" />
          </div>

          <h2
            className="font-black leading-tight mb-4"
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "clamp(2.5rem,5vw,4rem)",
              letterSpacing: "-0.04em",
              background:
                "linear-gradient(135deg,#fff 30%,rgba(255,255,255,0.4) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Professional Experience
          </h2>

          <p
            className="text-lg max-w-xl mx-auto"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "rgba(255,255,255,0.38)",
              fontWeight: 300,
              lineHeight: 1.8,
            }}
          >
            Real-world experience building production applications — no company
            names, just capabilities.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {experienceData.map((card, i) => (
            <ExperienceCard
              key={card.title}
              card={card}
              index={i}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
