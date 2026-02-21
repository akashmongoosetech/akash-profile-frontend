import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Code, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import BlogPopupTrigger from './BlogPopupTrigger';
import { useBlogPopup } from '../hooks/useBlogPopup';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { openPopup } = useBlogPopup();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/blog', label: 'Blog' },
    { path: '/projects', label: 'Projects' },
    { path: '/skills', label: 'Skills' },
    { 
      label: 'More', 
      dropdown: [
        { path: '/services', label: 'Services' },
        { path: '/experience', label: 'Experience' },
        // { path: '/testimonials', label: 'Testimonials' },
        // { path: '/blog', label: 'Blog' }
      ]
    },
    { path: '/contact', label: 'Contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActiveDropdown = (dropdown: any[]) => {
    return dropdown.some(item => location.pathname === item.path);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/10 dark:bg-gray-900/10 backdrop-blur-lg border-b border-white/20' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Akash
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <div key={index} className="relative">
                {item.dropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setShowDropdown(true)}
                    onMouseLeave={() => setShowDropdown(false)}
                  >
                    <button
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                        isActiveDropdown(item.dropdown)
                          ? 'text-blue-400'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      {item.label}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    <AnimatePresence>
                      {showDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-lg rounded-lg border border-white/20 shadow-xl"
                        >
                          {item.dropdown.map((dropdownItem, dropdownIndex) => (
                            <Link
                              key={dropdownIndex}
                              to={dropdownItem.path}
                              className={`block px-4 py-3 text-sm transition-colors ${
                                location.pathname === dropdownItem.path
                                  ? 'text-blue-400 bg-blue-500/10'
                                  : 'text-gray-300 hover:text-white hover:bg-white/10'
                              } ${dropdownIndex === 0 ? 'rounded-t-lg' : ''} ${
                                dropdownIndex === item.dropdown.length - 1 ? 'rounded-b-lg' : ''
                              }`}
                            >
                              {dropdownItem.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`relative px-3 py-2 rounded-lg transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'text-blue-400'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {item.label}
                    {location.pathname === item.path && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-white/10 rounded-lg border border-white/20"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                )}
              </div>
            ))}
            
            {/* Blog Popup Trigger */}
            <BlogPopupTrigger 
              onTrigger={openPopup}
              variant="icon"
              className="hover:scale-110"
            />
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-blue-400" />
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-blue-400" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-900/95 backdrop-blur-lg border-b border-white/20"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item, index) => (
                <div key={index}>
                  {item.dropdown ? (
                    <div className="space-y-2">
                      <div className="text-gray-400 text-sm font-medium px-4 py-2">
                        {item.label}
                      </div>
                      {item.dropdown.map((dropdownItem, dropdownIndex) => (
                        <motion.div
                          key={dropdownIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (index + dropdownIndex) * 0.1 }}
                        >
                          <Link
                            to={dropdownItem.path}
                            onClick={() => setIsOpen(false)}
                            className={`block px-6 py-2 rounded-lg transition-all duration-200 ${
                              location.pathname === dropdownItem.path
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {dropdownItem.label}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`block px-4 py-2 rounded-lg transition-all duration-200 ${
                          location.pathname === item.path
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;