import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageCircle, Check } from 'lucide-react';

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

const BlogContactForm: React.FC = () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "rgb(11,12,24)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="p-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>
            <MessageCircle className="w-5 h-5 text-white" strokeWidth={1.8} />
          </div>
          <div>
            <h3 className="font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>Send a Message</h3>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>I'll get back to you soon</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "linear-gradient(135deg,#10b981,#22c55e)" }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Check className="w-8 h-8 text-white" strokeWidth={2} />
            </motion.div>
            <h3 className="font-bold text-white mb-2" style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.125rem" }}>Message Sent!</h3>
            <p className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.5)" }}>Thank you for reaching out!</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                className="rounded-xl p-4 border"
                style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.2)" }}
              >
                <p className="text-sm" style={{ color: "#f87171", fontFamily: "'DM Sans', sans-serif" }}>{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
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
                placeholder="your@email.com"
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
              placeholder="+91 9685533878"
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
                htmlFor="blog-message"
                className="block text-xs font-bold mb-3"
                style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}
              >
                MESSAGE <span className="text-pink-400">*</span>
              </label>
              <textarea
                id="blog-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Tell me about your project..."
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
  );
};

export default BlogContactForm;
