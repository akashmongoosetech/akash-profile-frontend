import React, { useState, useEffect, useCallback, useRef, CSSProperties } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, BookOpen, Search, Eye, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { normalizeImageUrl, isValidImageUrl, stripHtmlTags } from '../utils/api';
import Loader from '../components/Loader';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  author: string;
  authorProfile: string;
  authorProfilePic: string;
  category: string;
  tags: string[];
  readTime: string;
  featured: boolean;
  publishedAt: string;
  formattedDate: string;
  views: number;
  likes: number;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

interface BlogResponse {
  success: boolean;
  blogs: BlogPost[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalBlogs: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
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
    <div className="inline-flex items-center gap-3 mb-4">
      <div className="h-px w-8 bg-gradient-to-r from-transparent to-indigo-500" />
      <span className="text-xs font-bold tracking-widest uppercase text-indigo-400" style={{ fontFamily: "'Space Mono', monospace" }}>{text}</span>
      <div className="h-px w-8 bg-gradient-to-l from-transparent to-indigo-500" />
    </div>
  );
}

// ── Blog Card Component ─────────────────────────────────────────────────────
interface BlogCardProps {
  post: BlogPost;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  authorImageError: boolean;
  setAuthorImageError: (postId: string) => void;
}

function BlogCard({ post, index, expanded, onToggle, authorImageError, setAuthorImageError }: BlogCardProps) {
  const [hovered, setHovered] = React.useState(false);

  const shouldTruncate = post.excerpt.length > 150;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link
        to={`/blog/${post.slug}`}
        className="group block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <motion.article
          className="relative rounded-2xl overflow-hidden h-full"
          style={{ 
            background: "rgb(11,12,24)", 
            border: "1px solid rgba(255,255,255,0.06)",
            transform: hovered ? "translateY(-4px)" : "translateY(0)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
        >
          {/* Glow effect */}
          <motion.div
            className="absolute -inset-px rounded-2xl pointer-events-none"
            style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}
            animate={{ opacity: hovered ? 0.4 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <motion.img
              src={normalizeImageUrl(post.image)}
              alt={post.title}
              className="w-full h-full object-cover"
              animate={{ scale: hovered ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Category Badge */}
            <motion.div
              className="absolute top-4 left-4"
              animate={{ scale: hovered ? 1.05 : 1 }}
            >
              <span 
                className="px-3 py-1.5 text-xs font-bold rounded-full"
                style={{ 
                  fontFamily: "'Space Mono', monospace",
                  background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
                  color: "#fff",
                  letterSpacing: "0.05em"
                }}
              >
                {post.category}
              </span>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 
              className="font-bold text-white mb-3 line-clamp-2"
              style={{ 
                fontFamily: "'Sora', sans-serif", 
                fontSize: "1.1rem",
                letterSpacing: "-0.02em"
              }}
            >
              {post.title}
            </h3>

            <div className="text-sm mb-4 leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
              <p className="whitespace-pre-wrap">
                {expanded || !shouldTruncate
                  ? stripHtmlTags(post.excerpt)
                  : stripHtmlTags(post.excerpt).substring(0, 150) + '...'
                }
              </p>
              {shouldTruncate && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onToggle();
                  }}
                  className="inline-flex items-center gap-1 mt-2 text-xs font-medium"
                  style={{ color: "#818cf8" }}
                >
                  {expanded ? (
                    <>Show less <ChevronUp className="w-3 h-3" /></>
                  ) : (
                    <>Read more <ChevronDown className="w-3 h-3" /></>
                  )}
                </button>
              )}
            </div>

            {/* Meta */}
            <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-3">
                {isValidImageUrl(post.authorProfilePic) && !authorImageError ? (
                  <img
                    src={normalizeImageUrl(post.authorProfilePic)}
                    alt={post.author}
                    className="w-8 h-8 rounded-full object-cover border border-white/20"
                    onError={() => setAuthorImageError(post._id)}
                  />
                ) : (
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}
                  >
                    <span className="text-white text-xs font-bold">{post.author.charAt(0)}</span>
                  </div>
                )}
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif" }}>{post.author}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Space Mono', monospace" }}>
                  <Calendar className="w-3 h-3" />
                  {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <motion.span
                  animate={{ x: hovered ? 4 : 0 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ArrowRight className="w-4 h-4" style={{ color: "#818cf8" }} />
                </motion.span>
              </div>
            </div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}

// ── Featured Blog Card ─────────────────────────────────────────────────────
interface FeaturedBlogCardProps {
  post: BlogPost;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  authorImageError: boolean;
  setAuthorImageError: (postId: string) => void;
}

function FeaturedBlogCard({ post, index, expanded, onToggle, authorImageError, setAuthorImageError }: FeaturedBlogCardProps) {
  const [hovered, setHovered] = React.useState(false);

  const shouldTruncate = post.excerpt.length > 200;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
    >
      <Link
        to={`/blog/${post.slug}`}
        className="group block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <motion.article
          className="relative rounded-2xl overflow-hidden h-full"
          style={{ 
            background: "rgb(11,12,24)", 
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Glow */}
          <motion.div
            className="absolute -inset-px rounded-2xl pointer-events-none"
            style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}
            animate={{ opacity: hovered ? 0.5 : 0 }}
            transition={{ duration: 0.3 }}
          />

          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="relative h-64 md:h-auto md:w-2/5 overflow-hidden">
              <motion.img
                src={normalizeImageUrl(post.image)}
                alt={post.title}
                className="w-full h-full object-cover"
                animate={{ scale: hovered ? 1.05 : 1 }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent md:bg-gradient-to-r" />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span 
                  className="px-3 py-1.5 text-xs font-bold rounded-full"
                  style={{ 
                    fontFamily: "'Space Mono', monospace",
                    background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
                    color: "#fff",
                    letterSpacing: "0.05em"
                  }}
                >
                  {post.category}
                </span>
                <span 
                  className="px-3 py-1.5 text-xs font-bold rounded-full"
                  style={{ 
                    fontFamily: "'Space Mono', monospace",
                    background: "linear-gradient(135deg,#fbbf24,#f59e0b)",
                    color: "#000",
                    letterSpacing: "0.05em"
                  }}
                >
                  Featured
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 md:w-3/5 flex flex-col justify-center">
              <h3 
                className="font-bold text-white mb-4"
                style={{ 
                  fontFamily: "'Sora', sans-serif", 
                  fontSize: "1.35rem",
                  letterSpacing: "-0.02em"
                }}
              >
                {post.title}
              </h3>

              <div className="text-sm mb-5 leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
                <p className="whitespace-pre-wrap">
                  {expanded || !shouldTruncate
                    ? stripHtmlTags(post.excerpt)
                    : stripHtmlTags(post.excerpt).substring(0, 200) + '...'
                  }
                </p>
                {shouldTruncate && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onToggle();
                    }}
                    className="inline-flex items-center gap-1 mt-2 text-xs font-medium"
                    style={{ color: "#c084fc" }}
                  >
                    {expanded ? (
                      <>Show less <ChevronUp className="w-3 h-3" /></>
                    ) : (
                      <>Read more <ChevronDown className="w-3 h-3" /></>
                    )}
                  </button>
                )}
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between pt-4 mt-auto" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-3">
                  {isValidImageUrl(post.authorProfilePic) && !authorImageError ? (
                    <img
                      src={normalizeImageUrl(post.authorProfilePic)}
                      alt={post.author}
                      className="w-9 h-9 rounded-full object-cover border border-white/20"
                      onError={() => setAuthorImageError(post._id)}
                    />
                  ) : (
                    <div 
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}
                    >
                      <span className="text-white text-sm font-bold">{post.author.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">{post.author}</p>
                    {post.authorProfile && (
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{post.authorProfile}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Space Mono', monospace" }}>
                    <Calendar className="w-3 h-3" />
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Space Mono', monospace" }}>
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}

// ── Hero Component ───────────────────────────────────────────────────────────
function Hero() {
  const particles = Array.from({ length: 15 }, (_, i) => ({
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
        <SectionLabel text="Insights & Tutorials" />
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
          Blog
        </h1>
        <p className="text-xl max-w-2xl mx-auto mb-8" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.38)", fontWeight: 300, lineHeight: 1.8 }}>
          Sharing insights, tutorials, and thoughts on software development, technology trends, and best practices.
        </p>

        {/* Stat pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { label: "Latest Articles", accent: "#38bdf8" },
            { label: "Expert Insights", accent: "#c084fc" },
            { label: "Tutorials", accent: "#4ade80" },
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

// ── Search & Filter Component ────────────────────────────────────────────────
function SearchFilter({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  handleCategoryChange, 
  categories,
  handleSearch 
}: { 
  searchTerm: string; 
  setSearchTerm: (s: string) => void;
  selectedCategory: string;
  handleCategoryChange: (c: string) => void;
  categories: {_id: string; count: number}[];
  handleSearch: (e: React.FormEvent) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-12"
    >
      <div 
        className="rounded-2xl overflow-hidden p-1"
        style={{ background: "rgb(11,12,24)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="p-5">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "rgba(255,255,255,0.3)" }} />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl text-white"
                  style={{ 
                    fontFamily: "'DM Sans', sans-serif",
                    background: "rgba(255,255,255,0.03)", 
                    border: "1px solid rgba(255,255,255,0.06)",
                    outline: 'none',
                  }}
                />
              </div>
            </form>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              <motion.button
                onClick={() => handleCategoryChange('')}
                className="px-4 py-2 rounded-xl text-xs font-bold"
                style={{ 
                  fontFamily: "'Space Mono', monospace",
                  background: selectedCategory === '' ? "linear-gradient(135deg,#3b82f6,#8b5cf6)" : "rgba(255,255,255,0.03)",
                  border: "1px solid",
                  borderColor: selectedCategory === '' ? "transparent" : "rgba(255,255,255,0.1)",
                  color: selectedCategory === '' ? "#fff" : "rgba(255,255,255,0.5)",
                  letterSpacing: "0.05em"
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                All
              </motion.button>
              {categories.map((category) => (
                <motion.button
                  key={category._id}
                  onClick={() => handleCategoryChange(category._id)}
                  className="px-4 py-2 rounded-xl text-xs font-bold"
                  style={{ 
                    fontFamily: "'Space Mono', monospace",
                    background: selectedCategory === category._id ? "linear-gradient(135deg,#3b82f6,#8b5cf6)" : "rgba(255,255,255,0.03)",
                    border: "1px solid",
                    borderColor: selectedCategory === category._id ? "transparent" : "rgba(255,255,255,0.1)",
                    color: selectedCategory === category._id ? "#fff" : "rgba(255,255,255,0.5)",
                    letterSpacing: "0.05em"
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {category._id} ({category.count})
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
const Blog: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [featuredBlogs, setFeaturedBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<BlogResponse['pagination']>();
  const [categories, setCategories] = useState<{_id: string; count: number}[]>([]);
  
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [expandedFeaturedPosts, setExpandedFeaturedPosts] = useState<Set<string>>(new Set());
  const [authorImageErrors, setAuthorImageErrors] = useState<Set<string>>(new Set());

  const heroRef = useRef(null);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      params.append('page', currentPage.toString());
      params.append('limit', '6');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/blog?${params}`);
      const data: BlogResponse = await response.json();
      
      if (data.success) {
        setBlogs(data.blogs);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, currentPage]);

  const fetchFeaturedBlogs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/blog/featured`);
      const data: BlogResponse = await response.json();
      
      if (data.success) {
        setFeaturedBlogs(data.blogs);
      }
    } catch (error) {
      console.error('Error fetching featured blogs:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/blog/categories`);
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchFeaturedBlogs();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, selectedCategory, fetchBlogs]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        setCurrentPage(1);
        fetchBlogs();
      } else if (!searchTerm && blogs.length === 0) {
        fetchBlogs();
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchBlogs, blogs.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const togglePostExpansion = (postId: string) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const toggleFeaturedPostExpansion = (postId: string) => {
    setExpandedFeaturedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const setAuthorImageError = (postId: string) => {
    setAuthorImageErrors(prev => new Set(prev).add(postId));
  };

  return (
    <>
      <Helmet>
        <title>Blog — Akash Raikwar</title>
        <meta name="title" content="Blog — Akash Raikwar" />
        <meta name="description" content="Read articles on web development, programming, React, Node.js, and more." />
        <meta property="og:title" content="Blog — Akash Raikwar" />
        <meta property="og:description" content="Read articles on web development and technology." />
        <meta property="twitter:title" content="Blog — Akash Raikwar" />
        <meta property="twitter:description" content="Read articles on web development and technology." />
      </Helmet>

      <div className="min-h-screen pt-20 pb-16 relative overflow-hidden" style={{ background: "#020209" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;700;800;900&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');
        `}</style>

        {/* Background Orbs */}
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
          <div ref={heroRef}>
            <Hero />
          </div>

          {/* Search & Filter */}
          <SearchFilter 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            handleCategoryChange={handleCategoryChange}
            categories={categories}
            handleSearch={handleSearch}
          />

          {/* Featured Posts */}
          {featuredBlogs.length > 0 && (
            <motion.div className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>
                  <Sparkles className="w-5 h-5 text-white" strokeWidth={1.8} />
                </div>
                <h2 className="font-black text-white" style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.5rem", letterSpacing: "-0.03em" }}>Featured Articles</h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {featuredBlogs.map((post, index) => (
                  <FeaturedBlogCard
                    key={post._id}
                    post={post}
                    index={index}
                    expanded={expandedFeaturedPosts.has(post._id)}
                    onToggle={() => toggleFeaturedPostExpansion(post._id)}
                    authorImageError={authorImageErrors.has(post._id)}
                    setAuthorImageError={setAuthorImageError}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Regular Posts */}
          <motion.div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>
                  <BookOpen className="w-5 h-5 text-white" strokeWidth={1.8} />
                </div>
                <h2 className="font-black text-white" style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.5rem", letterSpacing: "-0.03em" }}>Latest Articles</h2>
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Space Mono', monospace" }}>
                <Eye className="w-4 h-4" />
                <span>{pagination?.totalBlogs || 0} articles</span>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((post, index) => (
                  <BlogCard
                    key={post._id}
                    post={post}
                    index={index}
                    expanded={expandedPosts.has(post._id)}
                    onToggle={() => togglePostExpansion(post._id)}
                    authorImageError={authorImageErrors.has(post._id)}
                    setAuthorImageError={setAuthorImageError}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mb-12">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <motion.button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className="w-10 h-10 rounded-xl text-xs font-bold"
                  style={{ 
                    fontFamily: "'Space Mono', monospace",
                    background: currentPage === page ? "linear-gradient(135deg,#3b82f6,#8b5cf6)" : "rgba(255,255,255,0.03)",
                    border: "1px solid",
                    borderColor: currentPage === page ? "transparent" : "rgba(255,255,255,0.1)",
                    color: currentPage === page ? "#fff" : "rgba(255,255,255,0.5)",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {page}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Blog;
