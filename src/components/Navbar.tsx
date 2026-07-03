import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Sun,
  Moon,
  Code,
  ChevronDown,
  BookOpen,
  FolderKanban,
  Wrench,
  UsersRound,
  FileText,
  Calendar,
  Bot,
  Home,
  User,
  Briefcase,
  Clock,
  Wand2,
  Mail,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import BlogPopupTrigger from "./BlogPopupTrigger";
import { useBlogPopup } from "../hooks/useBlogPopup";

interface NavItem {
  path?: string;
  label: string;
  dropdown?: NavItem[];
  icon?: React.ElementType;
}

// Primary nav links shown at every breakpoint (collapsed on mobile)
const navItems: NavItem[] = [
  { path: "/", label: "Home", icon: Home },
  { path: "/about", label: "About", icon: User },
  { path: "/services", label: "Services", icon: Briefcase },
  { path: "/experience", label: "Experience", icon: Clock },
  { path: "/tools", label: "AI Tools", icon: Wand2 },
  {
    label: "More",
    dropdown: [
      { path: "/blog", label: "Blog", icon: BookOpen },
      { path: "/events", label: "Events", icon: Calendar },
      { path: "/case-studies", label: "Case Studies", icon: FileText },
      { path: "/projects", label: "Projects", icon: FolderKanban },
      { path: "/skills", label: "Skills", icon: Wrench },
      { path: "/testimonials", label: "Testimonials", icon: UsersRound },
    ],
  },
  { path: "/contact", label: "Contact", icon: Mail },
];

// On tablet (md) we hide some links to avoid overflow
const tabletHidden = ["/experience", "/tools", "/contact"];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { openPopup } = useBlogPopup();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setMobileMoreOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const isActiveDropdown = (dropdown: NavItem[]) =>
    dropdown.some((item) => location.pathname === item.path);

  const isActive = (path?: string) => location.pathname === path;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/10 dark:bg-gray-900/10 backdrop-blur-lg border-b border-white/20"
            : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center space-x-2 group flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Akash
              </span>
            </Link>

            {/* ── Desktop / Tablet Navigation (md+) ── */}
            <div className="hidden md:flex items-center space-x-1 flex-1 justify-center">
              {navItems.map((item, index) => (
                <div key={index} className="relative">
                  {item.dropdown ? (
                    /* Dropdown "More" */
                    <div
                      ref={dropdownRef}
                      className="relative"
                      onMouseEnter={() => setShowDropdown(true)}
                      onMouseLeave={() => setShowDropdown(false)}
                    >
                      <button
                        onClick={() => setShowDropdown((v) => !v)}
                        aria-expanded={showDropdown}
                        aria-haspopup="true"
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                          isActiveDropdown(item.dropdown)
                            ? "text-blue-400"
                            : "text-gray-300 hover:text-white hover:bg-white/8"
                        }`}
                      >
                        {item.label}
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-300 ${
                            showDropdown ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {showDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-0 mt-2 w-72 bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                          >
                            {/* Header */}
                            <div className="px-4 pt-4 pb-2">
                              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse" />
                                Explore
                              </h3>
                            </div>

                            <div className="px-3 pb-3 grid grid-cols-2 gap-1">
                              {item.dropdown.map((dropdownItem, di) => {
                                const Icon = dropdownItem.icon;
                                const active = isActive(dropdownItem.path);
                                return (
                                  <Link
                                    key={di}
                                    to={dropdownItem.path!}
                                    onClick={() => setShowDropdown(false)}
                                    className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200 relative overflow-hidden ${
                                      active ? "text-white" : "text-gray-300 hover:text-white"
                                    }`}
                                  >
                                    <div
                                      className={`absolute inset-0 rounded-xl transition-all duration-200 ${
                                        active
                                          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                                          : "bg-transparent group-hover:bg-white/8"
                                      }`}
                                    />
                                    <div
                                      className={`absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-gradient-to-b from-blue-400 to-purple-500 transition-opacity duration-200 ${
                                        active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                      }`}
                                    />
                                    {Icon && (
                                      <div
                                        className={`relative p-1.5 rounded-lg flex-shrink-0 transition-all duration-200 ${
                                          active
                                            ? "bg-gradient-to-br from-blue-500 to-purple-600"
                                            : "bg-white/10 group-hover:bg-white/16"
                                        }`}
                                      >
                                        <Icon
                                          className={`w-3.5 h-3.5 ${
                                            active ? "text-white" : "text-gray-400 group-hover:text-white"
                                          }`}
                                        />
                                      </div>
                                    )}
                                    <span className="text-xs font-medium truncate">
                                      {dropdownItem.label}
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>

                            <div className="px-4 pb-3 pt-2 border-t border-white/5">
                              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                                <span className="w-8 h-px bg-gradient-to-r from-transparent to-white/20 rounded-full" />
                                <span className="flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50 animate-pulse" />
                                  Discover more
                                </span>
                                <span className="w-8 h-px bg-gradient-to-l from-transparent to-white/20 rounded-full" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    /* Regular link — hide some on md to avoid overflow */
                    <Link
                      to={item.path!}
                      className={`relative px-3 py-2 rounded-lg text-sm transition-all duration-200 hidden lg:inline-flex ${
                        /* show all on lg, hide some on md */
                        tabletHidden.includes(item.path ?? "") ? "lg:inline-flex" : "md:inline-flex"
                      } ${
                        isActive(item.path)
                          ? "text-blue-400"
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      {item.label}
                      {isActive(item.path) && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-white/10 rounded-lg border border-white/20"
                          initial={false}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                        />
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* ── Desktop Actions ── */}
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              <Link
                to="/ai-chat"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-4 lg:px-5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center gap-2 text-sm"
              >
                <Bot className="w-4 h-4" />
                <span className="hidden lg:inline">Chat with AI</span>
                <span className="lg:hidden">AI Chat</span>
              </Link>

              <BlogPopupTrigger
                onTrigger={openPopup}
                variant="icon"
                className="hover:scale-110"
              />

              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-yellow-400" />
                ) : (
                  <Moon className="w-4 h-4 text-blue-400" />
                )}
              </button>
            </div>

            {/* ── Mobile Controls ── */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-yellow-400" />
                ) : (
                  <Moon className="w-4 h-4 text-blue-400" />
                )}
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="open"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="md:hidden overflow-hidden bg-gray-900/98 backdrop-blur-lg border-b border-white/10"
            >
              <div className="px-4 py-4 space-y-1 max-h-[calc(100vh-56px)] overflow-y-auto">

                {/* AI Chat CTA */}
                <Link
                  to="/ai-chat"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 mb-3 text-sm"
                >
                  <Bot className="w-4 h-4" />
                  Chat with AI
                </Link>

                {/* Primary links */}
                {navItems
                  .filter((item) => !item.dropdown)
                  .map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <Link
                          to={item.path!}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm ${
                            isActive(item.path)
                              ? "bg-blue-500/15 text-blue-400"
                              : "text-gray-300 hover:bg-white/8 hover:text-white"
                          }`}
                        >
                          {Icon && (
                            <Icon
                              className={`w-4 h-4 flex-shrink-0 ${
                                isActive(item.path) ? "text-blue-400" : "text-gray-500"
                              }`}
                            />
                          )}
                          {item.label}
                          {isActive(item.path) && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}

                {/* More section */}
                {navItems
                  .filter((item) => item.dropdown)
                  .map((item, i) => (
                    <div key={i}>
                      <button
                        onClick={() => setMobileMoreOpen((v) => !v)}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-400 font-medium"
                      >
                        <span>More</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            mobileMoreOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {mobileMoreOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.15 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-2 space-y-0.5 pb-1">
                              {item.dropdown!.map((sub, si) => {
                                const Icon = sub.icon;
                                return (
                                  <motion.div
                                    key={si}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: si * 0.03 }}
                                  >
                                    <Link
                                      to={sub.path!}
                                      onClick={() => setIsOpen(false)}
                                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm ${
                                        isActive(sub.path)
                                          ? "bg-blue-500/15 text-blue-400"
                                          : "text-gray-300 hover:bg-white/8 hover:text-white"
                                      }`}
                                    >
                                      {Icon && (
                                        <div
                                          className={`p-1.5 rounded-lg flex-shrink-0 ${
                                            isActive(sub.path)
                                              ? "bg-gradient-to-br from-blue-500 to-purple-600"
                                              : "bg-white/8"
                                          }`}
                                        >
                                          <Icon className="w-3.5 h-3.5" />
                                        </div>
                                      )}
                                      {sub.label}
                                    </Link>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}

                {/* Blog Popup */}
                <div className="pt-2 border-t border-white/8">
                  <BlogPopupTrigger
                    onTrigger={() => {
                      openPopup();
                      setIsOpen(false);
                    }}
                    variant="button"
                    className="w-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Backdrop overlay for mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;