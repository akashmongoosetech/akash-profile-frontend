import { useRef, useState, useEffect, CSSProperties } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

// ── Type definitions ──────────────────────────────────────────────────────────
interface Testimonial {
  name: string;
  position: string;
  image: string;
  text: string;
  rating: number;
  accent: string;
  gradient: string;
  company: string;
  metric: string;
}

interface StarRatingProps {
  rating: number;
  inView: boolean;
  delay: number;
}

interface TestimonialSlideProps {
  t: Testimonial;
  inView: boolean;
  direction: number;
}

interface OrbProps {
  style?: CSSProperties;
  color: string;
  size: number;
  dur: number;
  delay: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Dr. Shashank Bhargava",
    position: "Director, Bhargava Clinic",
    image: "https://lh3.googleusercontent.com/p/AF1QipMu2qECS8hvAogiZ1bDWUDBA5AGg7dXT_g4834m=s680-w680-h510-rw",
    text: "Akash delivered an outstanding prescription generator website that perfectly meets our clinical needs. The system is fast, user-friendly, and highly efficient for managing patient prescriptions. His technical expertise, attention to detail, and understanding of healthcare workflows truly exceeded our expectations.",
    rating: 5,
    accent: "#38bdf8",
    gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)",
    company: "Bhargava Clinic",
    metric: "3× faster workflows",
  },
  {
    name: "Jitendra Thakur",
    position: "Founder, Sneh Jeet Social Welfare Society",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "Working with Akash was a game-changer for our organisation. He built a scalable, well-structured platform that handles our daily operations seamlessly. His dedication, clean code, and proactive communication made the entire process smooth and enjoyable.",
    rating: 5,
    accent: "#4ade80",
    gradient: "linear-gradient(135deg,#10b981,#22c55e)",
    company: "Sneh Jeet Society",
    metric: "100% on-time delivery",
  },
  {
    name: "Rajesh Verma",
    position: "Director & CEO, Azad Infrastructure",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    text: "Akash transformed our outdated web application into a modern, responsive platform. His expertise in React and UI/UX design principles resulted in a 60% improvement in user engagement. Highly recommend for any web development project.",
    rating: 5,
    accent: "#c084fc",
    gradient: "linear-gradient(135deg,#8b5cf6,#a855f7)",
    company: "Azad Infrastructure",
    metric: "60% more engagement",
  },
];

// ── Star rating ───────────────────────────────────────────────────────────────
function StarRating({ rating, inView, delay }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: rating }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0, rotate: -30 }}
          animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ delay: delay + i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Star
            className="w-4 h-4"
            style={{ color: "#fbbf24", fill: "#fbbf24", filter: "drop-shadow(0 0 4px #fbbf2480)" }}
            strokeWidth={0}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ── Main testimonial display ──────────────────────────────────────────────────
function TestimonialSlide({ t, inView, direction }: TestimonialSlideProps) {
  return (
    <motion.div
      key={t.name}
      initial={{ opacity: 0, x: direction * 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction * -60 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex flex-col lg:flex-row gap-10 items-start lg:items-center p-8 md:p-12"
    >
      {/* Left: avatar + meta */}
      <div className="flex flex-col items-center lg:items-start gap-5 flex-shrink-0">
        {/* Avatar */}
        <div className="relative">
          {/* Glow ring */}
          <motion.div
            className="absolute -inset-1 rounded-full"
            style={{ background: t.gradient }}
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          <div
            className="relative w-20 h-20 rounded-full overflow-hidden"
            style={{ border: `2px solid ${t.accent}50` }}
          >
            <img
              src={t.image}
              alt={t.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=0D1117&color=${t.accent.replace('#','')}&size=80`;
              }}
            />
          </div>
          {/* Verified badge */}
          <div
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: t.gradient, border: "2px solid #020209" }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10">
              <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Name + position */}
        <div className="text-center lg:text-left">
          <h3
            className="font-black text-white leading-tight"
            style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", letterSpacing: "-0.03em" }}
          >
            {t.name}
          </h3>
          <p
            className="text-xs mt-0.5"
            style={{ fontFamily: "'DM Sans', sans-serif", color: t.accent, opacity: 0.85 }}
          >
            {t.position}
          </p>
        </div>

        {/* Metric pill */}
        <div
          className="px-3 py-1.5 rounded-full text-center"
          style={{
            background: `${t.accent}12`,
            border: `1px solid ${t.accent}28`,
          }}
        >
          <span
            className="text-xs font-black"
            style={{ fontFamily: "'Space Mono', monospace", color: t.accent, letterSpacing: "0.02em" }}
          >
            {t.metric}
          </span>
        </div>

        {/* Stars */}
        <StarRating rating={t.rating} inView={inView} delay={0.2} />
      </div>

      {/* Right: quote */}
      <div className="flex-1 relative">
        {/* Large decorative quote mark */}
        <div
          className="absolute -top-4 -left-2 pointer-events-none select-none"
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "8rem",
            color: t.accent,
            opacity: 0.08,
            lineHeight: 1,
            fontWeight: 900,
          }}
        >
          "
        </div>

        <blockquote
          className="relative z-10"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(1rem,1.8vw,1.15rem)",
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.85,
            fontWeight: 300,
            fontStyle: "italic",
          }}
        >
          {t.text}
        </blockquote>

        {/* Closing quote */}
        <div
          className="text-right mt-2 pointer-events-none select-none"
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "5rem",
            color: t.accent,
            opacity: 0.08,
            lineHeight: 0.5,
            fontWeight: 900,
          }}
        >
          "
        </div>

        {/* Company tag */}
        <div className="flex items-center gap-2 mt-5">
          <div className="h-px flex-1" style={{ background: `linear-gradient(90deg,${t.accent}40,transparent)` }} />
          <span
            className="text-xs font-bold tracking-widest uppercase"
            style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.2)" }}
          >
            {t.company}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Orb ───────────────────────────────────────────────────────────────────────
function Orb({ style, color, size, dur, delay }: OrbProps) {
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
export default function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const navigate = (next: number) => {
    setDirection(next > current ? 1 : -1);
    setCurrent(next);
  };

  const prev = () => navigate((current - 1 + testimonials.length) % testimonials.length);
  const next = () => navigate((current + 1) % testimonials.length);

  // auto-advance
  useEffect(() => {
    const t = setInterval(() => {
      setDirection(1);
      setCurrent((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const active = testimonials[current];

  return (
    <section
      ref={ref}
      className="relative py-28 overflow-hidden"
      style={{ background: "#020209" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;700;800;900&family=DM+Sans:ital,wght@0,300;0,400;1,300;1,400&family=Space+Mono:wght@400;700&display=swap');
      `}</style>

      {/* Dynamic bg shifts with active testimonial */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ background: `radial-gradient(ellipse 55% 45% at 65% 50%, ${active.accent}09, transparent 70%)` }}
        transition={{ duration: 0.9 }}
      />

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

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12">

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
              Client Reviews
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
            What Clients Say
          </h2>
          <p
            className="text-lg max-w-xl mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.38)", fontWeight: 300, lineHeight: 1.8 }}
          >
            Don't just take my word for it — here's what my clients have to say.
          </p>
        </motion.div>

        {/* ── Main card ── */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Glow border */}
          <motion.div
            className="absolute -inset-px rounded-3xl pointer-events-none"
            animate={{ background: active.gradient, opacity: 0.45 }}
            transition={{ duration: 0.7 }}
          />

          {/* Outer shadow */}
          <motion.div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            animate={{ boxShadow: `0 30px 80px ${active.accent}18` }}
            transition={{ duration: 0.7 }}
          />

          <div
            className="relative rounded-3xl overflow-hidden"
            style={{ background: "rgb(11,12,24)", border: "1px solid rgba(255,255,255,0.06)", minHeight: 280 }}
          >
            {/* Animated top strip */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-0.5"
              animate={{ background: active.gradient, boxShadow: `0 0 12px ${active.accent}` }}
              transition={{ duration: 0.7 }}
            />

            {/* BG grid */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                backgroundImage: `linear-gradient(${active.accent} 1px,transparent 1px),linear-gradient(90deg,${active.accent} 1px,transparent 1px)`,
              }}
              transition={{ duration: 0.7 }}
              style={{ backgroundSize: "32px 32px", opacity: 0.03 }}
            />

            {/* Corner glow */}
            <motion.div
              className="absolute top-0 right-0 w-48 h-48 rounded-bl-full pointer-events-none"
              animate={{ background: active.gradient, opacity: 0.06 }}
              transition={{ duration: 0.7 }}
            />

            {/* Slide content */}
            <div className="relative" style={{ minHeight: 280 }}>
              <AnimatePresence mode="wait" custom={direction}>
                <TestimonialSlide
                  key={current}
                  t={active}
                  inView={inView}
                  direction={direction}
                />
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* ── Controls ── */}
        <motion.div
          className="flex items-center justify-between mt-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          {/* Progress pills */}
          <div className="flex gap-2 items-center">
            {testimonials.map((t, i) => (
              <button
                key={i}
                onClick={() => navigate(i)}
                className="rounded-full overflow-hidden relative"
                style={{
                  width: i === current ? 32 : 8,
                  height: 8,
                  background: i === current ? t.accent : "rgba(255,255,255,0.12)",
                  boxShadow: i === current ? `0 0 12px ${t.accent}` : "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "width 0.4s cubic-bezier(0.22,1,0.36,1), background 0.35s, box-shadow 0.35s",
                }}
              >
                {i === current && (
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ background: "rgba(255,255,255,0.4)" }}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    key={`timer-${current}`}
                    transition={{ duration: 5, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Prev / Next */}
          <div className="flex gap-3">
            <button
              onClick={prev}
              style={{
                width: 44, height: 44, borderRadius: 12,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.45)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
            >
              <ChevronLeft style={{ width: 16, height: 16 }} strokeWidth={2} />
            </button>
            <motion.button
              onClick={next}
              animate={{ background: active.accent, boxShadow: `0 0 20px ${active.accent}60` }}
              transition={{ duration: 0.5 }}
              style={{
                width: 44, height: 44, borderRadius: 12,
                color: "#020209", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "none",
              }}
            >
              <ChevronRight style={{ width: 16, height: 16 }} strokeWidth={2.5} />
            </motion.button>
          </div>
        </motion.div>

        {/* ── Bottom mini cards (other testimonials) ── */}
        <motion.div
          className="grid grid-cols-3 gap-3 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.65, duration: 0.6 }}
        >
          {testimonials.map((t, i) => (
            <motion.button
              key={t.name}
              onClick={() => navigate(i)}
              className="relative flex items-center gap-3 p-3 rounded-2xl text-left overflow-hidden"
              style={{
                background: i === current ? `${t.accent}0D` : "rgba(255,255,255,0.02)",
                border: `1px solid ${i === current ? t.accent + "30" : "rgba(255,255,255,0.05)"}`,
                cursor: "pointer",
                transition: "background 0.3s, border-color 0.3s",
              }}
              whileHover={{ x: 2 }}
            >
              {/* Active left bar */}
              <motion.div
                className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
                style={{ background: t.gradient }}
                animate={{ opacity: i === current ? 1 : 0, scaleY: i === current ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />

              {/* Avatar */}
              <div
                className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
                style={{ border: `1.5px solid ${i === current ? t.accent : "rgba(255,255,255,0.1)"}`, transition: "border-color 0.3s" }}
              >
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=0D1117&color=${t.accent.replace('#','')}&size=32`;
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div
                  className="font-black truncate text-xs leading-tight"
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    color: i === current ? "#fff" : "rgba(255,255,255,0.4)",
                    letterSpacing: "-0.02em",
                    transition: "color 0.3s",
                  }}
                >
                  {t.name.split(" ").slice(0, 2).join(" ")}
                </div>
                <div
                  className="text-xs truncate"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    color: i === current ? t.accent : "rgba(255,255,255,0.2)",
                    fontSize: "0.55rem",
                    transition: "color 0.3s",
                  }}
                >
                  {t.company}
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}