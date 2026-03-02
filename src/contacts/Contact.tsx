import React, { useState, useRef, CSSProperties } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useInView } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, MessageCircle, ArrowRight, Check } from 'lucide-react';

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

// ── Contact Card Component ───────────────────────────────────────────────────
interface ContactCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
  gradient: string;
  accent: string;
  index: number;
  inView: boolean;
}

function ContactCard({ icon: Icon, label, value, href, gradient, accent, index, inView }: ContactCardProps) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group block"
      style={{ perspective: 900 }}
    >
      {/* Glow layer */}
      <motion.div
        className="absolute -inset-px rounded-2xl pointer-events-none"
        style={{ background: gradient }}
        animate={{ opacity: hovered ? 0.5 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        className="relative rounded-2xl overflow-hidden p-5 flex items-center gap-4"
        style={{ background: "rgb(11,12,24)", border: "1px solid rgba(255,255,255,0.06)" }}
        animate={{ y: hovered ? -4 : 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
      >
        {/* Top gradient strip */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-0.5" 
          style={{ background: gradient }} 
          animate={{ scaleX: hovered ? 1 : 0.3, opacity: hovered ? 1 : 0.5 }} 
        />

        {/* Icon */}
        <motion.div 
          className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: gradient }}
          animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 8 : 0, boxShadow: hovered ? `0 0 25px ${accent}50` : "none" }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Icon className="w-6 h-6 text-white" strokeWidth={1.8} />
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold mb-1" style={{ fontFamily: "'Space Mono', monospace", color: accent, letterSpacing: "0.05em" }}>{label}</p>
          <p className="text-white font-medium truncate group-hover:text-blue-400 transition-colors" style={{ fontFamily: "'Sora', sans-serif" }}>
            {value}
          </p>
        </div>

        {/* Arrow */}
        <motion.div
          animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0.5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.div>
    </motion.a>
  );
}

// ── Social Button Component ───────────────────────────────────────────────────
interface SocialButtonProps {
  icon: LucideIcon;
  label: string;
  href: string;
  gradient: string;
  accent: string;
  index: number;
  inView: boolean;
}

function SocialButton({ icon: Icon, label, href, gradient, accent, index, inView }: SocialButtonProps) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group"
    >
      <motion.div
        className="w-14 h-14 rounded-xl flex items-center justify-center"
        style={{ background: hovered ? gradient : "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 8 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <Icon className="w-6 h-6" style={{ color: hovered ? "#fff" : accent }} strokeWidth={1.8} />
      </motion.div>
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: accent, fontFamily: "'Space Mono', monospace" }}>
        {label}
      </span>
    </motion.a>
  );
}

// ── Form Input Component ──────────────────────────────────────────────────────
interface FormInputProps {
  label: string;
  name: string;
  type: string;
  value: string;
  placeholder: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  gradient: string;
}

function FormInput({ label, name, type, value, placeholder, required, onChange, gradient }: FormInputProps) {
  const [focused, setFocused] = React.useState(false);

  return (
    <div>
      <label 
        htmlFor={name} 
        className="block text-xs font-bold mb-3"
        style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}
      >
        {label} {required && <span className="text-pink-400">*</span>}
      </label>
      <div className="relative">
        <motion.div 
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{ background: gradient, opacity: focused ? 0.15 : 0 }}
          animate={{ opacity: focused ? 0.15 : 0 }}
        />
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full px-5 py-4 rounded-xl text-white relative z-10"
          style={{ 
            fontFamily: "'DM Sans', sans-serif",
            background: "rgb(11,12,24)", 
            border: `1px solid ${focused ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.06)'}`,
            outline: 'none',
            transition: 'border-color 0.3s'
          }}
        />
      </div>
    </div>
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
        <SectionLabel text="Get In Touch" />
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
          Contact Me
        </h1>
        <p className="text-xl max-w-2xl mx-auto mb-8" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.38)", fontWeight: 300, lineHeight: 1.8 }}>
          Have a project in mind or want to collaborate? I'd love to hear from you. Let's create something amazing together!
        </p>

        {/* Stat pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { label: "24/7 Available", accent: "#38bdf8" },
            { label: "Quick Response", accent: "#4ade80" },
            { label: "Free Consultation", accent: "#c084fc" },
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

// ── Main Component ─────────────────────────────────────────────────────────
const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const formRef = useRef(null);
  const infoRef = useRef(null);

  const formInView = useInView(formRef, { once: true, margin: "-80px" });
  const infoInView = useInView(infoRef, { once: true, margin: "-80px" });

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'akashraikwar763@gmail.com',
      href: 'mailto:akashraikwar763@gmail.com',
      gradient: 'linear-gradient(135deg,#3b82f6,#06b6d4)',
      accent: '#38bdf8'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+91 9685533878',
      href: 'tel:+919685533878',
      gradient: 'linear-gradient(135deg,#10b981,#22c55e)',
      accent: '#4ade80'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Ujjain, India',
      href: 'https://maps.app.goo.gl/8FY1VYnqYTfWdfYFA',
      gradient: 'linear-gradient(135deg,#f97316,#ef4444)',
      accent: '#fb923c'
    }
  ];

  const socialLinks = [
    {
      icon: Github,
      label: 'GitHub',
      href: 'https://github.com/akash007123',
      gradient: 'linear-gradient(135deg,#6b7280,#374151)',
      accent: '#9ca3af'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/akash-raikwar-4a67bb171/',
      gradient: 'linear-gradient(135deg,#0077b5,#0a66c2)',
      accent: '#38bdf8'
    },
    {
      icon: Twitter,
      label: 'Twitter',
      href: 'https://x.com/AkashRa28283838',
      gradient: 'linear-gradient(135deg,#1da1f2,#0d8ecf)',
      accent: '#38bdf8'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', mobile: '', subject: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError(data.message || 'Failed to send message. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <>
      <Helmet>
        <title>Contact — Akash Raikwar</title>
        <meta name="title" content="Contact — Akash Raikwar" />
        <meta name="description" content="Get in touch with Akash Raikwar. Contact for web development projects, collaborations, or inquiries. Available for freelance work and full-time opportunities." />
        <meta property="og:title" content="Contact — Akash Raikwar" />
        <meta property="og:description" content="Get in touch with Akash Raikwar. Contact for web development projects, collaborations, or inquiries." />
        <meta property="twitter:title" content="Contact — Akash Raikwar" />
        <meta property="twitter:description" content="Get in touch with Akash Raikwar. Contact for web development projects, collaborations, or inquiries." />
      </Helmet>

      <div className="min-h-screen pt-20 pb-16 relative overflow-hidden" style={{ background: "#020209" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;700;800;900&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');
        `}</style>

        {/* Global orbs */}
        <Orb style={{ top: "5%", left: "-5%" }} color="radial-gradient(circle,rgba(59,130,246,0.25),transparent 70%)" size={500} dur={10} delay={0} />
        <Orb style={{ top: "40%", right: "-5%" }} color="radial-gradient(circle,rgba(139,92,246,0.2),transparent 70%)" size={440} dur={13} delay={2} />
        <Orb style={{ bottom: "5%", left: "30%" }} color="radial-gradient(circle,rgba(16,185,129,0.12),transparent 70%)" size={360} dur={14} delay={1} />

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
          {/* Hero */}
          <Hero />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              ref={formRef}
              initial={{ opacity: 0, y: 40 }}
              animate={formInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div 
                className="rounded-3xl overflow-hidden"
                style={{ background: "rgb(11,12,24)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {/* Header */}
                <div className="p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>
                      <MessageCircle className="w-5 h-5 text-white" strokeWidth={1.8} />
                    </div>
                    <h2 className="font-black text-white" style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.25rem", letterSpacing: "-0.03em" }}>Send a Message</h2>
                  </div>
                </div>

                <div className="p-6">
                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <motion.div 
                        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                        style={{ background: "linear-gradient(135deg,#10b981,#22c55e)" }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Check className="w-10 h-10 text-white" strokeWidth={2} />
                      </motion.div>
                      <h3 className="font-black text-white mb-3" style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.5rem" }}>Message Sent!</h3>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.5)", fontWeight: 300 }}>Thank you for reaching out. I'll get back to you soon!</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {error && (
                        <div 
                          className="rounded-xl p-4 border"
                          style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.2)" }}
                        >
                          <p className="text-sm" style={{ color: "#f87171", fontFamily: "'DM Sans', sans-serif" }}>{error}</p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormInput
                          label="NAME"
                          name="name"
                          type="text"
                          value={formData.name}
                          placeholder="Your name"
                          required
                          onChange={handleChange}
                          gradient="linear-gradient(135deg,#3b82f6,#06b6d4)"
                        />
                        <FormInput
                          label="EMAIL"
                          name="email"
                          type="email"
                          value={formData.email}
                          placeholder="your.email@example.com"
                          required
                          onChange={handleChange}
                          gradient="linear-gradient(135deg,#8b5cf6,#ec4899)"
                        />
                      </div>
                      
                      <FormInput
                        label="MOBILE"
                        name="mobile"
                        type="tel"
                        value={formData.mobile}
                        placeholder="+91 98765 43210"
                        required={false}
                        onChange={handleChange}
                        gradient="linear-gradient(135deg,#10b981,#22c55e)"
                      />
                      
                      <FormInput
                        label="SUBJECT"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        placeholder="What's this about?"
                        required
                        onChange={handleChange}
                        gradient="linear-gradient(135deg,#f97316,#ef4444)"
                      />
                      
                      <div>
                        <label 
                          htmlFor="message" 
                          className="block text-xs font-bold mb-3"
                          style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}
                        >
                          MESSAGE <span className="text-pink-400">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          placeholder="Tell me about your project or idea..."
                          className="w-full px-5 py-4 rounded-xl text-white resize-none"
                          style={{ 
                            fontFamily: "'DM Sans', sans-serif",
                            background: "rgb(11,12,24)", 
                            border: "1px solid rgba(255,255,255,0.06)",
                            outline: 'none',
                          }}
                        />
                      </div>
                      
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full relative overflow-hidden rounded-xl font-black text-sm py-4 text-white"
                        style={{ 
                          fontFamily: "'Sora', sans-serif", 
                          background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.div 
                          className="absolute inset-0" 
                          style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)" }} 
                          initial={{ x: "-100%" }} 
                          whileHover={{ x: "100%" }} 
                          transition={{ duration: 0.55 }} 
                        />
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5" />
                              Send Message
                            </>
                          )}
                        </span>
                      </motion.button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              ref={infoRef}
              initial={{ opacity: 0, y: 40 }}
              animate={infoInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Contact Details */}
              <div 
                className="rounded-3xl overflow-hidden"
                style={{ background: "rgb(11,12,24)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <h2 className="font-black text-white" style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.25rem", letterSpacing: "-0.03em" }}>Contact Information</h2>
                </div>
                <div className="p-6 space-y-4">
                  {contactInfo.map((contact, index) => (
                    <ContactCard
                      key={index}
                      icon={contact.icon}
                      label={contact.label}
                      value={contact.value}
                      href={contact.href}
                      gradient={contact.gradient}
                      accent={contact.accent}
                      index={index}
                      inView={infoInView}
                    />
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div 
                className="rounded-3xl overflow-hidden"
                style={{ background: "rgb(11,12,24)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <h2 className="font-black text-white" style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.25rem", letterSpacing: "-0.03em" }}>Connect With Me</h2>
                </div>
                <div className="p-6">
                  <div className="flex gap-4 justify-center">
                    {socialLinks.map((social, index) => (
                      <SocialButton
                        key={index}
                        icon={social.icon}
                        label={social.label}
                        href={social.href}
                        gradient={social.gradient}
                        accent={social.accent}
                        index={index}
                        inView={infoInView}
                      />
                    ))}
                  </div>
                  <p className="text-center mt-6 text-sm" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.35)", fontWeight: 300 }}>
                    Follow me for updates on my latest projects and tech insights.
                  </p>
                </div>
              </div>

              {/* Call to Action */}
              <motion.div
                className="relative rounded-3xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={infoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <motion.div
                  className="absolute -inset-px rounded-3xl pointer-events-none"
                  animate={{ background: ["linear-gradient(135deg,#3b82f6,#8b5cf6,#06b6d4)", "linear-gradient(225deg,#8b5cf6,#06b6d4,#3b82f6)", "linear-gradient(315deg,#06b6d4,#3b82f6,#8b5cf6)"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  style={{ opacity: 0.4 }}
                />
                <div className="relative rounded-3xl overflow-hidden p-8" style={{ background: "rgb(11,12,24)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <motion.div className="absolute top-0 left-0 right-0 h-0.5" animate={{ background: ["linear-gradient(90deg,#3b82f6,#8b5cf6,#06b6d4)", "linear-gradient(90deg,#8b5cf6,#06b6d4,#3b82f6)"] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
                  
                  <h3 className="font-black text-white mb-3" style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.25rem", letterSpacing: "-0.03em" }}>Ready to Work Together?</h3>
                  <p className="text-sm mb-6 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.4)", fontWeight: 300, lineHeight: 1.7 }}>
                    I'm always excited to work on new projects and collaborate with amazing people. 
                    Whether you have a specific project in mind or just want to chat about technology, 
                    don't hesitate to reach out!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="tel:+919685533878"
                      className="flex-1 px-6 py-3 rounded-xl font-bold text-sm text-center relative overflow-hidden group"
                      style={{ 
                        fontFamily: "'Sora', sans-serif", 
                        background: "linear-gradient(135deg,#10b981,#059669)",
                      }}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Phone className="w-4 h-4" />
                        Schedule a Call
                      </span>
                    </a>
                    <a
                      href="/projects"
                      className="flex-1 px-6 py-3 rounded-xl font-bold text-sm text-center"
                      style={{ 
                        fontFamily: "'Sora', sans-serif", 
                        background: "rgba(255,255,255,0.03)", 
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.7)"
                      }}
                    >
                      View My Work
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom spacing */}
          <div className="h-12" />
        </div>
      </div>
    </>
  );
};

export default Contact;
