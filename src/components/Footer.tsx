import React, { useState, CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Github, Linkedin, Twitter, Mail, ArrowUp, Phone, MapPin, Instagram, Facebook, Send, Check, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

// ── Animated Orb Component ───────────────────────────────────────────────────
function Orb({ style, color, size, dur, delay }: { style?: CSSProperties; color: string; size: number; dur: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl pointer-events-none"
      style={{ width: size, height: size, background: color, ...style }}
      animate={{ scale: [1, 1.28, 1], opacity: [0.06, 0.14, 0.06] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ── Social Button Component ───────────────────────────────────────────────────
interface SocialButtonProps {
  icon: LucideIcon;
  href: string;
  label: string;
  gradient: string;
  index: number;
}

function SocialButton({ icon: Icon, href, label, gradient, index }: SocialButtonProps) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group"
      aria-label={label}
    >
      <motion.div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ 
          background: hovered ? gradient : "rgba(255,255,255,0.03)", 
          border: "1px solid rgba(255,255,255,0.06)",
        }}
        animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 8 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <Icon className="w-5 h-5" style={{ color: hovered ? "#fff" : "rgba(255,255,255,0.5)" }} strokeWidth={1.8} />
      </motion.div>
    </motion.a>
  );
}

// ── Link Card Component ───────────────────────────────────────────────────────
interface LinkItemProps {
  path: string;
  label: string;
  index: number;
}

function LinkItem({ path, label, index }: LinkItemProps) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={path}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex items-center gap-2 group"
      >
        <motion.div 
          className="w-1.5 h-1.5 rounded-full bg-indigo-500"
          animate={{ scale: hovered ? 1.5 : 1, opacity: hovered ? 1 : 0.5 }}
        />
        <span 
          className="text-sm font-medium"
          style={{ 
            fontFamily: "'DM Sans', sans-serif", 
            color: hovered ? "#fff" : "rgba(255,255,255,0.4)",
            transition: "color 0.3s"
          }}
        >
          {label}
        </span>
        <motion.span
          animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          →
        </motion.span>
      </Link>
    </motion.div>
  );
}

// ── Contact Item Component ───────────────────────────────────────────────────
interface ContactItemProps {
  icon: LucideIcon;
  value: string;
  href: string;
  gradient: string;
  index: number;
}

function ContactItem({ icon: Icon, value, href, gradient, index }: ContactItemProps) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-3 group"
    >
      <motion.div 
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: hovered ? gradient : "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        animate={{ scale: hovered ? 1.1 : 1 }}
      >
        <Icon className="w-4 h-4" style={{ color: hovered ? "#fff" : "rgba(255,255,255,0.5)" }} strokeWidth={1.8} />
      </motion.div>
      <span 
        className="text-sm truncate"
        style={{ 
          fontFamily: "'DM Sans', sans-serif", 
          color: hovered ? "#fff" : "rgba(255,255,255,0.5)",
          transition: "color 0.3s"
        }}
      >
        {value}
      </span>
    </motion.a>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const socialLinks = [
    { icon: Github, href: 'https://github.com/akash007123', label: 'GitHub', gradient: "linear-gradient(135deg,#6b7280,#374151)" },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/akash-raikwar-4a67bb171/', label: 'LinkedIn', gradient: "linear-gradient(135deg,#0077b5,#0a66c2)" },
    { icon: Twitter, href: 'https://x.com/AkashRa28283838', label: 'Twitter', gradient: "linear-gradient(135deg,#1da1f2,#0d8ecf)" },
    { icon: Mail, href: 'mailto:akashraikwar763@gmail.com', label: 'Email', gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)" },
    { icon: Instagram, href: 'https://www.instagram.com/akashraikwar_007', label: 'Instagram', gradient: "linear-gradient(135deg,#e1306c,#fd594a)" },
    { icon: Facebook, href: 'https://www.facebook.com/akashraikwar007', label: 'Facebook', gradient: "linear-gradient(135deg,#1877f2,#0d65d9)" }
  ];

  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/projects', label: 'Projects' },
    { path: '/skills', label: 'Skills' },
    { path: '/experience', label: 'Experience' },
    { path: '/tools', label: 'Tools' }
  ];

  const services = [
    { path: '/services', label: 'Services' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
    { path: '/case-studies', label: 'Case Studies' },
    { path: '/testimonials', label: 'Testimonials' },
    { path: '/events', label: 'Events' }
  ];

  const contactInfo = [
    { icon: Mail, value: 'akashraikwar763@gmail.com', href: 'mailto:akashraikwar763@gmail.com', gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)" },
    { icon: Phone, value: '+91 96855 33878', href: 'tel:+919685533878', gradient: "linear-gradient(135deg,#10b981,#22c55e)" },
    { icon: MapPin, value: 'Ujjain, India', href: 'https://maps.app.goo.gl/8FY1VYnqYTfWdfYFA', gradient: "linear-gradient(135deg,#f97316,#ef4444)" }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubscribing(true);
    setSubscriptionStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscriptionStatus('success');
        setEmail('');
        setTimeout(() => setSubscriptionStatus('idle'), 5000);
      } else {
        setSubscriptionStatus('error');
        setErrorMessage(data.message || 'Failed to subscribe. Please try again.');
      }
    } catch {
      setSubscriptionStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="relative z-10 overflow-hidden" style={{ background: "#020209" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;700;800;900&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');
      `}</style>

      {/* Background Orbs */}
      <Orb style={{ top: "20%", left: "-10%" }} color="radial-gradient(circle,rgba(59,130,246,0.15),transparent 70%)" size={400} dur={12} delay={0} />
      <Orb style={{ bottom: "10%", right: "-5%" }} color="radial-gradient(circle,rgba(139,92,246,0.12),transparent 70%)" size={350} dur={15} delay={2} />
      <Orb style={{ top: "60%", left: "40%" }} color="radial-gradient(circle,rgba(16,185,129,0.08),transparent 70%)" size={250} dur={14} delay={1} />

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(99,102,241,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.02) 1px,transparent 1px)", backgroundSize: "64px 64px" }} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-16">
        {/* Main Grid: Left (Contact) | Right (Links + Newsletter) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: Brand & Contact Info */}
          <div className="lg:col-span-4 space-y-8">
            <div>
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}
              >
                <Zap className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold" style={{ fontFamily: "'Space Mono', monospace", color: "#818cf8", letterSpacing: "0.05em" }}>AVAILABLE FOR PROJECTS</span>
              </motion.div>

              <h3 className="font-black mb-4" style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.75rem", letterSpacing: "-0.04em", background: "linear-gradient(135deg,#fff 30%,rgba(255,255,255,0.5) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Akash Raikwar
              </h3>
              <p className="leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.4)", fontWeight: 300, lineHeight: 1.8 }}>
                Software Engineer passionate about creating innovative solutions and beautiful user experiences.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              {contactInfo.map((item, index) => (
                <ContactItem
                  key={index}
                  icon={item.icon}
                  value={item.value}
                  href={item.href}
                  gradient={item.gradient}
                  index={index}
                />
              ))}
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social, index) => (
                <SocialButton
                  key={index}
                  icon={social.icon}
                  href={social.href}
                  label={social.label}
                  gradient={social.gradient}
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: Quick Links + Services + Newsletter */}
          <div className="lg:col-span-8 space-y-10">
            {/* Quick Links & Services Row */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-white mb-6" style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", letterSpacing: "-0.02em" }}>Quick Links</h4>
                <div className="space-y-3">
                  {quickLinks.map((link, index) => (
                    <LinkItem key={index} path={link.path} label={link.label} index={index} />
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-white mb-6" style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", letterSpacing: "-0.02em" }}>Services</h4>
                <div className="space-y-3">
                  {services.map((service, index) => (
                    <LinkItem key={index} path={service.path} label={service.label} index={index + quickLinks.length} />
                  ))}
                </div>
              </div>
            </div>

            {/* Newsletter Signup - Below Quick Links and Services */}
            <motion.div 
              className="relative overflow-hidden rounded-3xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="absolute -inset-px rounded-3xl pointer-events-none"
                animate={{ background: ["linear-gradient(135deg,#3b82f6,#8b5cf6,#06b6d4)", "linear-gradient(225deg,#8b5cf6,#06b6d4,#3b82f6)", "linear-gradient(315deg,#06b6d4,#3b82f6,#8b5cf6)"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                style={{ opacity: 0.4 }}
              />
              <div 
                className="relative rounded-3xl overflow-hidden px-8 py-10"
                style={{ background: "rgb(11,12,24)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <motion.div className="absolute top-0 left-0 right-0 h-0.5" animate={{ background: ["linear-gradient(90deg,#3b82f6,#8b5cf6,#06b6d4)", "linear-gradient(90deg,#8b5cf6,#06b6d4,#3b82f6)"] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
                
                <div className="flex flex-col md:flex-row items-center justify-end gap-8">
                  {subscriptionStatus === 'success' ? (
                    <motion.div 
                      className="flex items-center gap-3 px-6 py-3 rounded-xl"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#10b981,#22c55e)" }}>
                        <Check className="w-4 h-4 text-white" strokeWidth={2} />
                      </div>
                      <span className="font-medium" style={{ color: "#4ade80", fontFamily: "'DM Sans', sans-serif" }}>Successfully subscribed!</span>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="flex w-full md:w-auto">
                      <div className="relative flex-1 md:w-64">
                        <input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 rounded-l-xl text-white placeholder-gray-500"
                          style={{ 
                            fontFamily: "'DM Sans', sans-serif",
                            background: "rgba(255,255,255,0.03)", 
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRight: "none",
                            outline: 'none',
                          }}
                          required
                        />
                      </div>
                      <motion.button 
                        type="submit"
                        disabled={isSubscribing}
                        className="px-6 py-3 rounded-r-xl font-bold text-sm text-white flex items-center gap-2"
                        style={{ 
                          fontFamily: "'Sora', sans-serif", 
                          background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isSubscribing ? (
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </motion.button>
                    </form>
                  )}

                  <div className="text-center md:text-right">
                    <h4 className="font-black text-white mb-2" style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.25rem", letterSpacing: "-0.03em" }}>Stay Updated</h4>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.4)", fontWeight: 300 }}>
                      Subscribe for latest updates on projects and tech insights.
                    </p>
                  </div>
                </div>
                
                {subscriptionStatus === 'error' && (
                  <motion.div 
                    className="mt-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="text-sm" style={{ color: "#f87171", fontFamily: "'DM Sans', sans-serif" }}>{errorMessage}</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.3)" }}>
            © 2025 Akash Raikwar. All rights reserved.
          </p>
          
          <motion.button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            whileHover={{ scale: 1.1, background: "rgba(99,102,241,0.1)" }}
            whileTap={{ scale: 0.95 }}
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" style={{ color: "rgba(255,255,255,0.5)" }} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
