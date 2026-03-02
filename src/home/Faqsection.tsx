import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What is your development process?",
    answer: "My development process follows a structured approach: Discovery & Planning, Design & Prototype, Development, Testing & QA, Deployment, and Post-launch Support. I keep you updated at every step and ensure transparent communication throughout the project lifecycle.",
    accent: "#38bdf8",
    gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)",
    tag: "Process",
  },
  {
    question: "How long does it take to build a project?",
    answer: "Project timeline depends on complexity and scope. A simple website takes 1–2 weeks, while complex web applications can take 2–6 months. I provide detailed timelines during the planning phase and keep you updated on progress.",
    accent: "#4ade80",
    gradient: "linear-gradient(135deg,#10b981,#22c55e)",
    tag: "Timeline",
  },
  {
    question: "Do you offer post-launch support?",
    answer: "Yes! I offer comprehensive post-launch support including bug fixes, security updates, performance optimizations, and new feature implementations. We can discuss a maintenance plan that fits your needs.",
    accent: "#c084fc",
    gradient: "linear-gradient(135deg,#8b5cf6,#a855f7)",
    tag: "Support",
  },
  {
    question: "What technologies do you specialize in?",
    answer: "I specialize in modern web technologies including React.js, Next.js, TypeScript, Node.js, MongoDB, PostgreSQL, AWS, Docker, and more. I choose the best tech stack based on your project requirements.",
    accent: "#fb923c",
    gradient: "linear-gradient(135deg,#f97316,#ef4444)",
    tag: "Tech",
  },
  {
    question: "How do you handle payments and contracts?",
    answer: "I offer flexible payment structures including fixed-price projects and hourly rates. For large projects, I typically work with milestones: 30% upfront, 30% at midpoint, and 40% upon completion.",
    accent: "#f472b6",
    gradient: "linear-gradient(135deg,#ec4899,#f43f5e)",
    tag: "Billing",
  },
  {
    question: "Can you work with existing codebases?",
    answer: "Absolutely! I have experience taking over existing projects, understanding the current architecture, and making improvements or adding new features without disrupting existing functionality.",
    accent: "#fbbf24",
    gradient: "linear-gradient(135deg,#f59e0b,#f97316)",
    tag: "Codebase",
  },
];

// ── FAQ item ──────────────────────────────────────────────────────────────────
function FaqItem({ faq, index, isOpen, onToggle, inView }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative"
    >
      {/* Glow border */}
      <motion.div
        className="absolute -inset-px rounded-2xl pointer-events-none"
        style={{ background: faq.gradient }}
        animate={{ opacity: isOpen ? 0.55 : hovered ? 0.3 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        className="relative rounded-2xl overflow-hidden"
        style={{ background: "rgb(11,12,24)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Top strip */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: faq.gradient, boxShadow: isOpen ? `0 0 10px ${faq.accent}` : "none" }}
          animate={{ scaleX: isOpen ? 1 : hovered ? 0.5 : 0.15, opacity: isOpen ? 1 : hovered ? 0.6 : 0.3 }}
          transition={{ duration: 0.4 }}
        />

        {/* Left accent bar */}
        <motion.div
          className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full"
          style={{ background: faq.gradient }}
          animate={{ opacity: isOpen ? 1 : 0, scaleY: isOpen ? 1 : 0 }}
          transition={{ duration: 0.35 }}
        />

        {/* BG grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(${faq.accent} 1px,transparent 1px),linear-gradient(90deg,${faq.accent} 1px,transparent 1px)`,
            backgroundSize: "28px 28px",
            opacity: isOpen ? 0.04 : 0.02,
            transition: "opacity 0.4s",
          }}
        />

        {/* Subtle bg glow when open */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 50% at 0% 50%, ${faq.accent}08, transparent 70%)` }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />

        {/* Question row */}
        <button
          onClick={onToggle}
          className="relative z-10 w-full flex items-center gap-4 px-6 py-5 text-left"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          {/* Tag */}
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 hidden sm:block"
            style={{
              fontFamily: "'Space Mono', monospace",
              background: `${faq.accent}14`,
              border: `1px solid ${faq.accent}28`,
              color: faq.accent,
              letterSpacing: "0.04em",
            }}
          >
            {faq.tag}
          </span>

          {/* Question */}
          <span
            className="flex-1 font-black leading-snug"
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "0.97rem",
              letterSpacing: "-0.02em",
              color: isOpen ? "#fff" : "rgba(255,255,255,0.7)",
              transition: "color 0.3s",
            }}
          >
            {faq.question}
          </span>

          {/* Toggle icon */}
          <motion.div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: isOpen ? faq.gradient : "rgba(255,255,255,0.05)",
              border: isOpen ? "none" : `1px solid rgba(255,255,255,0.1)`,
              boxShadow: isOpen ? `0 0 16px ${faq.accent}60` : "none",
              transition: "background 0.3s, box-shadow 0.3s",
            }}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 24 }}
          >
            {isOpen ? (
              <Minus className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            ) : (
              <Plus className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.5)" }} strokeWidth={2.5} />
            )}
          </motion.div>
        </button>

        {/* Answer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="relative z-10 px-6 pb-6 pt-0 sm:pl-[calc(1.5rem+80px)]">
                {/* Animated underline */}
                <motion.div
                  className="h-px mb-4"
                  style={{ background: `linear-gradient(90deg,${faq.accent}40,transparent)` }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                />
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "rgba(255,255,255,0.48)",
                    fontSize: "0.9rem",
                    lineHeight: 1.8,
                    fontWeight: 300,
                  }}
                >
                  {faq.answer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ── Orb ───────────────────────────────────────────────────────────────────────
function Orb({ style, color, size, dur, delay }) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl pointer-events-none"
      style={{ width: size, height: size, background: color, ...style }}
      animate={{ scale: [1, 1.28, 1], opacity: [0.08, 0.18, 0.08] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function FaqSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      ref={ref}
      className="relative py-28 overflow-hidden"
      style={{ background: "#020209" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;700;800;900&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');
      `}</style>

      <Orb style={{ top: "-8%", left: "-5%" }}    color="radial-gradient(circle,rgba(59,130,246,0.28),transparent 70%)"  size={480} dur={9}  delay={0} />
      <Orb style={{ bottom: "-10%", right: "-5%" }} color="radial-gradient(circle,rgba(139,92,246,0.22),transparent 70%)" size={420} dur={12} delay={2} />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(99,102,241,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.03) 1px,transparent 1px)",
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

      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 36 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-indigo-500" />
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-400" style={{ fontFamily: "'Space Mono', monospace" }}>
              Got Questions?
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-indigo-500" />
          </div>

          <h2
            className="font-black leading-tight mb-4"
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "clamp(2.5rem,5vw,4rem)",
              letterSpacing: "-0.04em",
              background: "linear-gradient(135deg,#fff 30%,rgba(255,255,255,0.4) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Frequently Asked
          </h2>

          <p
            className="text-lg max-w-xl mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.38)", fontWeight: 300, lineHeight: 1.8 }}
          >
            Common questions about my services and working process.
          </p>
        </motion.div>

        {/* FAQ list */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <FaqItem
              key={faq.question}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
              inView={inView}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <p
            className="mb-4 text-sm"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.3)", lineHeight: 1.7 }}
          >
            Still have questions? I'm happy to chat.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl font-bold text-sm text-white relative overflow-hidden"
            style={{
              fontFamily: "'Sora', sans-serif",
              background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
              boxShadow: "0 0 32px rgba(99,102,241,0.3)",
              textDecoration: "none",
            }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.13),transparent)" }}
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.55 }}
            />
            <span className="relative z-10">Get in Touch</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}