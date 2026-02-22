import React, { useState } from 'react';
import { Github, Linkedin, Twitter, Mail, ArrowUp, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const socialLinks = [
    { icon: Github, href: 'https://github.com/akash007123', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/akash-raikwar-4a67bb171/', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://x.com/AkashRa28283838', label: 'Twitter' },
    { icon: Mail, href: 'mailto:akashraikwar763@gmail.com', label: 'Email' },
    { icon: Instagram, href: 'https://www.instagram.com/akashraikwar_007', label: 'Instagram' },
    { icon: Facebook, href: 'https://www.facebook.com/akashraikwar007', label: 'Facebook' }
  ];

  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/projects', label: 'Projects' },
    { path: '/skills', label: 'Skills' }
  ];

  const services = [
    { path: '/services', label: 'Services' },
    { path: '/experience', label: 'Experience' },
    // { path: '/testimonials', label: 'Testimonials' },
    { path: '/blog', label: 'Blog' }
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
    } catch (error) {
      setSubscriptionStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="relative z-10 bg-gray-900/50 backdrop-blur-lg border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Akash Raikwar
              </h3>
              <p className="text-gray-400 max-w-md leading-relaxed">
                Software Engineer passionate about creating innovative solutions and beautiful user experiences. 
                Specializing in modern web technologies and scalable applications.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <a href="mailto:akashraikwar763@gmail.com" className="text-gray-300 hover:text-white transition-colors">
                  akashraikwar763@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <a href="tel:+919685533878" className="text-gray-300 hover:text-white transition-colors">
                  +91 96855 33878
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">Ujjain, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-200 hover:scale-110 group"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <div className="space-y-3">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="block text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">More</h4>
            <div className="space-y-3">
              {services.map((service, index) => (
                <Link
                  key={index}
                  to={service.path}
                  className="block text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200"
                >
                  {service.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 text-center">
            <h4 className="text-xl font-bold text-white mb-4">Stay Updated</h4>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Subscribe to my newsletter for the latest updates on projects, tech insights, and industry trends.
            </p>
            
            {subscriptionStatus === 'success' ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-green-400 text-sm">Successfully subscribed! Welcome to the newsletter.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 backdrop-blur-lg"
                  required
                />
                <button 
                  type="submit"
                  disabled={isSubscribing}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                >
                  {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}
            
            {subscriptionStatus === 'error' && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 max-w-md mx-auto mt-4">
                <p className="text-red-400 text-sm">{errorMessage}</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 Akash Raikwar. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            {/* <p className="text-gray-400 text-sm flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> using React & Tailwind
            </p> */}
            
            <button
              onClick={scrollToTop}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 group"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;