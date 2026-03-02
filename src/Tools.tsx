import React, { useRef, CSSProperties } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { 
  Calculator, 
  TrendingUp, 
  Search, 
  FileText, 
  FileCheck, 
  Users, 
  Clock, 
  Briefcase,
  FileSignature,
  Send,
  Sparkles,
  Linkedin,
  Lightbulb,
  Rocket,
  Palette,
  Stethoscope,
  FileSpreadsheet,
  Globe,
  Database,
  FolderKanban,
  GraduationCap,
  Award,
  User,
  MessageSquare,
  Bot,
  ChevronRight
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
interface Tool {
  name: string;
  description: string;
  path: string;
  icon: LucideIcon;
}

interface Category {
  name: string;
  icon: LucideIcon;
  tools: Tool[];
  color: string;
  gradient: string;
  accent: string;
  glow: string;
}

// ── Animated Orb Component ───────────────────────────────────────────────────
function Orb({ style, color, size, dur, delay }: { style?: CSSProperties; color: string; size: number; dur: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl pointer-events-none"
      style={{ width: size, height: size, background: color, ...style }}
      animate={{ scale: [1, 1.28, 1], opacity: [0.08, 0.18, 0.08] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ── Section Label Component ───────────────────────────────────────────────────
function SectionLabel({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-3 mb-5">
      <div className="h-px w-10 bg-gradient-to-r from-transparent to-indigo-500" />
      <span className="text-xs font-bold tracking-widest uppercase text-indigo-400" style={{ fontFamily: "'Space Mono', monospace" }}>{text}</span>
      <div className="h-px w-10 bg-gradient-to-l from-transparent to-indigo-500" />
    </div>
  );
}

// ── Tool Card Component ───────────────────────────────────────────────────────
interface ToolCardProps {
  tool: Tool;
  category: Category;
  index: number;
  inView: boolean;
}

function ToolCard({ tool, category, index, inView }: ToolCardProps) {
  const [hovered, setHovered] = React.useState(false);
  const [mousePos, setMousePos] = React.useState({ x: 50, y: 50 });
  const ref = React.useRef<HTMLDivElement>(null);
  const Icon = tool.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setMousePos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className="relative"
      style={{ perspective: 900 }}
    >
      {/* Glow layer */}
      <motion.div
        className="absolute -inset-px rounded-2xl pointer-events-none"
        style={{ background: category.gradient }}
        animate={{ opacity: hovered ? 0.5 : 0 }}
        transition={{ duration: 0.3 }}
      />
      {hovered && (
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none z-0" 
          style={{ background: `radial-gradient(200px circle at ${mousePos.x}% ${mousePos.y}%, ${category.glow}, transparent 70%)` }} 
        />
      )}

      <motion.div
        className="relative rounded-2xl overflow-hidden"
        style={{ background: "rgb(11,12,24)", border: "1px solid rgba(255,255,255,0.06)" }}
        animate={{ y: hovered ? -4 : 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
      >
        {/* Top gradient strip */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-0.5" 
          style={{ background: category.gradient }} 
          animate={{ scaleX: hovered ? 1 : 0.3, opacity: hovered ? 1 : 0.5 }} 
        />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{ backgroundImage: `linear-gradient(${category.accent} 1px,transparent 1px),linear-gradient(90deg,${category.accent} 1px,transparent 1px)`, backgroundSize: "24px 24px", opacity: 0.03 }} 
        />

        {/* Corner decoration */}
        <motion.div
          className="absolute top-0 right-0 w-20 h-20 rounded-bl-full pointer-events-none"
          style={{ background: category.gradient, opacity: 0.07 }}
          animate={{ scale: hovered ? 1.5 : 1, opacity: hovered ? 0.12 : 0.07 }}
          transition={{ duration: 0.4 }}
        />

        <div className="relative z-10 p-5 flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <motion.div 
              className="w-12 h-12 rounded-xl flex items-center justify-center" 
              style={{ background: category.gradient }}
              animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 8 : 0, boxShadow: hovered ? `0 0 20px ${category.accent}60` : "none" }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Icon className="w-5 h-5 text-white" strokeWidth={1.8} />
            </motion.div>
            <Link 
              to={tool.path}
              className="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
              style={{ 
                fontFamily: "'Space Mono', monospace", 
                background: `${category.accent}14`, 
                border: `1px solid ${category.accent}28`, 
                color: category.accent,
                letterSpacing: "0.04em" 
              }}
            >
              Try Now
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <h3 
            className="font-black text-white leading-tight"
            style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", letterSpacing: "-0.03em" }}
          >
            {tool.name}
          </h3>
          
          <p 
            className="text-sm leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.4)", fontWeight: 300, lineHeight: 1.6 }}
          >
            {tool.description}
          </p>

          {/* Hover footer */}
          <motion.div 
            className="h-px" 
            style={{ background: `linear-gradient(90deg,${category.accent}40,transparent)` }} 
            animate={{ opacity: hovered ? 1 : 0.3 }} 
          />
          
          <motion.div 
            className="flex items-center gap-1 text-xs font-bold"
            style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.25)" }}
            animate={{ x: hovered ? 4 : 0 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <span style={{ color: hovered ? category.accent : "rgba(255,255,255,0.2)", transition: "color 0.3s" }}>
              Try Now
            </span>
            <ChevronRight className="w-3 h-3" style={{ color: hovered ? category.accent : "rgba(255,255,255,0.2)", transition: "color 0.3s" }} />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Category Header Component ─────────────────────────────────────────────────
interface CategoryHeaderProps {
  category: Category;
  index: number;
  inView: boolean;
}

function CategoryHeader({ category, index, inView }: CategoryHeaderProps) {
  const [hovered, setHovered] = React.useState(false);
  const Icon = category.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-4 mb-8"
    >
      <motion.div 
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: category.gradient }}
        animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 8 : 0, boxShadow: hovered ? `0 0 30px ${category.accent}50` : "none" }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <Icon className="w-7 h-7 text-white" strokeWidth={1.8} />
      </motion.div>
      <div>
        <h2 
          className="font-black text-white"
          style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", letterSpacing: "-0.03em" }}
        >
          {category.name}
        </h2>
        <p 
          className="text-sm"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.35)", fontWeight: 300 }}
        >
          {category.tools.length} tools available
        </p>
      </div>
    </motion.div>
  );
}

// ── Hero Component ───────────────────────────────────────────────────────────
function Hero() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    x: Math.random() * 100, y: Math.random() * 100,
    size: 2 + Math.random() * 4,
    accent: ["#38bdf8","#c084fc","#4ade80","#fb923c","#f472b6","#818cf8"][i % 6],
    delay: i * 0.3, dur: 3 + Math.random() * 3,
  }));

  return (
    <div className="relative text-center py-20 overflow-hidden">
      {particles.map((p, i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: p.accent }}
          animate={{ y: [0, -24, 0], opacity: [0, 0.55, 0], scale: [0.5, 1.3, 0.5] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <motion.div initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
        <SectionLabel text="Productivity Suite" />
        <h1
          className="font-black leading-none mb-5"
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "clamp(3rem,7vw,5rem)",
            letterSpacing: "-0.06em",
            background: "linear-gradient(135deg,#fff 20%,rgba(255,255,255,0.4) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}
        >
          Tools
        </h1>
        <p className="text-xl max-w-2xl mx-auto mb-8" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.38)", fontWeight: 300, lineHeight: 1.8 }}>
          Powerful free online tools to boost your productivity and help your business grow.
        </p>

        {/* Stat pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { label: "20+ Tools", accent: "#38bdf8" },
            { label: "Free Forever", accent: "#4ade80" },
            { label: "No Signup", accent: "#c084fc" },
            { label: "Instant Results", accent: "#fb923c" },
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

// ── Data ──────────────────────────────────────────────────────────────────────
const toolsData: Category[] = [
  {
    name: 'Advanced Strategy',
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500',
    gradient: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
    accent: '#a855f7',
    glow: 'rgba(168,85,247,0.25)',
    tools: [
      {
        name: 'Website Cost Calculator',
        description: 'Estimate the cost of building your website based on features and requirements',
        path: '/website-cost-calculator',
        icon: Calculator
      },
      {
        name: 'EMI Calculator',
        description: 'Calculate your Equated Monthly Installments for loans and financing',
        path: '/emi-calculator',
        icon: Calculator
      },
      {
        name: 'SEO Audit Mini Tool',
        description: 'Analyze and audit your website SEO performance with actionable insights',
        path: '/seo-audit-mini-tool',
        icon: Search
      }
    ]
  },
  {
    name: 'Productivity Tools',
    icon: Briefcase,
    color: 'from-blue-500 to-cyan-500',
    gradient: 'linear-gradient(135deg,#3b82f6,#06b6d4)',
    accent: '#38bdf8',
    glow: 'rgba(56,189,248,0.25)',
    tools: [
      {
        name: 'Invoice Generator',
        description: 'Create professional invoices for your clients quickly and easily',
        path: '/invoice-generator',
        icon: FileText
      },
      {
        name: 'Quotation Generator',
        description: 'Generate detailed quotations for your products and services',
        path: '/quotation-generator',
        icon: FileCheck
      },
      {
        name: 'Resume Builder (Tech Version)',
        description: 'Build a professional tech resume that stands out to recruiters',
        path: '/resume-builder',
        icon: Users
      },
      {
        name: 'Meeting Agenda Generator',
        description: 'Create structured meeting agendas to maximize productivity',
        path: '/meeting-agenda-generator',
        icon: Clock
      },
      {
        name: 'Contract Template Generator',
        description: 'Generate professional contract templates for your business needs',
        path: '/contract-template-generator',
        icon: FileSignature
      },
      {
        name: 'Freelance Proposal Generator',
        description: 'Create compelling freelance proposals to win more clients',
        path: '/freelance-proposal-generator',
        icon: Send
      }
    ]
  },
  {
    name: 'AI Tools',
    icon: Sparkles,
    color: 'from-indigo-500 to-purple-500',
    gradient: 'linear-gradient(135deg,#6366f1,#a855f7)',
    accent: '#818cf8',
    glow: 'rgba(129,140,248,0.25)',
    tools: [
      {
        name: 'AI Email Reply Generator',
        description: 'Generate contextual email replies with the perfect tone and length',
        path: '/ai-email-reply-generator',
        icon: Send
      },
      {
        name: 'LinkedIn Post Generator',
        description: 'Create engaging LinkedIn posts tailored for developers',
        path: '/linkedIn-post-generator-for-developers',
        icon: Linkedin
      },
      {
        name: 'Project Idea Generator',
        description: 'Generate creative project ideas for students based on technology and difficulty',
        path: '/project-idea-generator-for-students',
        icon: Lightbulb
      },
      {
        name: 'AI Business Idea Validator',
        description: 'Validate your business idea with India-specific market analysis and viability scoring',
        path: '/ai-business-idea-validator',
        icon: Rocket
      },
      {
        name: 'AI Startup Name Generator',
        description: 'Generate creative startup names with meanings, taglines, and domain suggestions',
        path: '/ai-startup-name-generator',
        icon: Palette
      },
      {
        name: 'AI Business Plan Generator',
        description: 'Generate professional investor-ready business plans with financial projections',
        path: '/ai-business-plan-generator',
        icon: FileText
      },
      {
        name: 'AI SQL Query Generator',
        description: 'Transform natural language requirements into optimized SQL queries',
        path: '/ai-sql-query-generator',
        icon: Database
      },
      {
        name: 'AI Project Description Generator',
        description: 'Create compelling project descriptions for resumes and portfolios',
        path: '/ai-project-description-generator',
        icon: FolderKanban
      },
      {
        name: 'AI Internship Cover Letter Generator',
        description: 'Generate personalized cover letters for internship applications',
        path: '/ai-internship-cover-letter-generator',
        icon: GraduationCap
      },
      {
        name: 'AI Personal Statement Generator',
        description: 'Write powerful personal statements for university applications',
        path: '/ai-personal-statement-generator',
        icon: Award
      },
      {
        name: 'AI Portfolio Bio Generator',
        description: 'Create professional bios for websites, LinkedIn, and freelance profiles',
        path: '/ai-portfolio-bio-generator',
        icon: User
      },
      {
        name: 'AI Meeting Summary Generator',
        description: 'Transform meeting transcripts into organized summaries with action items',
        path: '/ai-meeting-summary-generator',
        icon: MessageSquare
      },
      {
        name: 'AI Chat Assistant',
        description: 'Chat with AI in real-time with streaming responses and markdown support',
        path: '/ai-chat',
        icon: Bot
      }
    ]
  },
  {
    name: 'Healthcare AI Tools',
    icon: Stethoscope,
    color: 'from-teal-500 to-cyan-500',
    gradient: 'linear-gradient(135deg,#14b8a6,#06b6d4)',
    accent: '#2dd4bf',
    glow: 'rgba(45,212,191,0.25)',
    tools: [
      {
        name: 'AI Medical Note Formatter',
        description: 'Transform raw clinical notes into structured SOAP, Progress Notes, and EMR formats',
        path: '/ai-medical-note-formatter',
        icon: FileText
      },
      {
        name: 'AI Discharge Summary Generator',
        description: 'Generate professional patient discharge summaries from case data',
        path: '/ai-patient-discharge-summary-generator',
        icon: FileSpreadsheet
      },
      {
        name: 'AI Clinic Website Content Generator',
        description: 'Create SEO-optimized website content for medical clinics',
        path: '/ai-clinic-website-content-generator',
        icon: Globe
      }
    ]
  }
];

// ── Marquee items ─────────────────────────────────────────────────────────────
const marqueeItems = [
  { name: "EMI Calculator", icon: Calculator, gradient: "linear-gradient(135deg,#8b5cf6,#ec4899)", accent: "#a855f7" },
  { name: "SEO Audit", icon: Search, gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)", accent: "#38bdf8" },
  { name: "Invoice Generator", icon: FileText, gradient: "linear-gradient(135deg,#10b981,#22c55e)", accent: "#4ade80" },
  { name: "Resume Builder", icon: Users, gradient: "linear-gradient(135deg,#f97316,#ef4444)", accent: "#fb923c" },
  { name: "AI Chat", icon: Bot, gradient: "linear-gradient(135deg,#6366f1,#a855f7)", accent: "#818cf8" },
  { name: "Business Plan", icon: FileSpreadsheet, gradient: "linear-gradient(135deg,#ec4899,#f43f5e)", accent: "#f472b6" },
  { name: "Project Ideas", icon: Lightbulb, gradient: "linear-gradient(135deg,#eab308,#f97316)", accent: "#fbbf24" },
  { name: "Medical Notes", icon: Stethoscope, gradient: "linear-gradient(135deg,#14b8a6,#06b6d4)", accent: "#2dd4bf" },
  { name: "SQL Generator", icon: Database, gradient: "linear-gradient(135deg,#06b6d4,#38bdf8)", accent: "#22d3ee" },
  { name: "Startup Names", icon: Rocket, gradient: "linear-gradient(135deg,#f43f5e,#ec4899)", accent: "#fb7185" },
];

// ── Infinite marquee row ──────────────────────────────────────────────────────
function MarqueeRow({ items, direction = 1, speed = 40 }: { items: { name: string; icon: LucideIcon; gradient: string; accent: string }[]; direction?: number; speed?: number }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden w-full" style={{ maskImage: "linear-gradient(90deg,transparent,black 10%,black 90%,transparent)" }}>
      <motion.div
        className="flex gap-4 w-max"
        animate={{ x: direction > 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-5 py-2.5 rounded-full flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: item.gradient }}
            >
              <item.icon className="w-4 h-4 text-white" strokeWidth={1.8} />
            </div>
            <span 
              className="font-bold text-sm whitespace-nowrap"
              style={{ fontFamily: "'Sora', sans-serif", color: item.accent, letterSpacing: "-0.02em" }}
            >
              {item.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
const Tools: React.FC = () => {
  // Create individual refs for each category
  const category1Ref = useRef(null);
  const category2Ref = useRef(null);
  const category3Ref = useRef(null);
  const category4Ref = useRef(null);
  
  const category1InView = useInView(category1Ref, { once: true, margin: "-80px" });
  const category2InView = useInView(category2Ref, { once: true, margin: "-80px" });
  const category3InView = useInView(category3Ref, { once: true, margin: "-80px" });
  const category4InView = useInView(category4Ref, { once: true, margin: "-80px" });

  const categoryRefs = [category1Ref, category2Ref, category3Ref, category4Ref];
  const categoryInViews = [category1InView, category2InView, category3InView, category4InView];

  return (
    <>
      <Helmet>
        <title>Free Tools — Akash Raikwar</title>
        <meta name="title" content="Free Tools — Akash Raikwar" />
        <meta name="description" content="Access free online tools including EMI calculator, SEO audit tool, invoice generator, resume builder, and more. Boost your productivity with these free utilities." />
        <meta property="og:title" content="Free Tools — Akash Raikwar" />
        <meta property="og:description" content="Access free online tools including EMI calculator, SEO audit tool, invoice generator, resume builder, and more. Boost your productivity with these free utilities." />
        <meta property="twitter:title" content="Free Tools — Akash Raikwar" />
        <meta property="twitter:description" content="Access free online tools including EMI calculator, SEO audit tool, invoice generator, resume builder, and more. Boost your productivity with these free utilities." />
      </Helmet>

      <div className="min-h-screen pt-20 pb-16 relative overflow-hidden" style={{ background: "#020209" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;700;800;900&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');
        `}</style>

        {/* Global orbs */}
        <Orb style={{ top: "5%", left: "-5%" }} color="radial-gradient(circle,rgba(99,102,241,0.25),transparent 70%)" size={500} dur={10} delay={0} />
        <Orb style={{ top: "40%", right: "-5%" }} color="radial-gradient(circle,rgba(139,92,246,0.2),transparent 70%)" size={440} dur={13} delay={2} />
        <Orb style={{ bottom: "5%", left: "30%" }} color="radial-gradient(circle,rgba(16,185,129,0.12),transparent 70%)" size={360} dur={14} delay={1} />
        <Orb style={{ top: "70%", left: "10%" }} color="radial-gradient(circle,rgba(251,146,60,0.15),transparent 70%)" size={300} dur={11} delay={3} />

        {/* Grid */}
        <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(99,102,241,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.03) 1px,transparent 1px)", backgroundSize: "64px 64px", zIndex: 0 }} />

        {/* Scan line */}
        <motion.div 
          className="fixed left-0 right-0 h-px pointer-events-none" 
          style={{ background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.3),transparent)", zIndex: 1 }} 
          animate={{ top: ["0%", "100%"] }} 
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }} 
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          {/* Marquee strip */}
          <motion.div 
            className="mb-12 -mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <MarqueeRow items={marqueeItems} direction={1} speed={35} />
            <div className="mt-3">
              <MarqueeRow items={[...marqueeItems].reverse()} direction={-1} speed={45} />
            </div>
          </motion.div>

          {/* Hero */}
          <Hero />

          {/* Categories */}
          <div className="space-y-20">
            {toolsData.map((category, categoryIndex) => (
              <div 
                key={category.name} 
                ref={categoryRefs[categoryIndex]}
              >
                {/* Category Header */}
                <CategoryHeader 
                  category={category} 
                  index={categoryIndex} 
                  inView={categoryInViews[categoryIndex] || false} 
                />

                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {category.tools.map((tool, toolIndex) => (
                    <ToolCard
                      key={tool.path}
                      tool={tool}
                      category={category}
                      index={toolIndex}
                      inView={categoryInViews[categoryIndex] || false}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom spacing */}
          <div className="h-12" />
        </div>
      </div>
    </>
  );
};

export default Tools;
