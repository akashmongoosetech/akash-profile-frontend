import React, { useState, useEffect, useCallback, CSSProperties } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  ArrowRight,
  Eye, 
  Heart, 
  Share2, 
  ChevronRight,
  BookOpen,
  Sparkles,
  Loader2
} from 'lucide-react';
import { normalizeImageUrl, isValidImageUrl } from '../utils/api';

interface ContentSection {
  title: string;
  content: string;
  image: string;
  code: string;
  order: number;
}

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  contentSections?: ContentSection[];
  image: string;
  author: string;
  authorProfile?: string;
  authorProfilePic?: string;
  category: string;
  tags: string[];
  readTime: string;
  featured: boolean;
  publishedAt: string;
  views: number;
  likes: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

interface RelatedPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  readTime: string;
  publishedAt: string;
}

interface SidebarBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  readTime: string;
  publishedAt: string;
  author: string;
  views: number;
}

// Animated Orb Component
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

// Loading Component
function LoadingState() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center" style={{ background: "#020209" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8 text-white" />
        </motion.div>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-lg"
          style={{ fontFamily: "'Sora', sans-serif", color: "rgba(255,255,255,0.7)" }}
        >
          Loading Article...
        </motion.p>
        <motion.div
          className="h-1 mx-auto mt-4 rounded-full"
          style={{ background: "linear-gradient(90deg,#3b82f6,#8b5cf6,#06b6d4)", width: "120px" }}
          animate={{ scaleX: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
}

// Error Component
function ErrorState({ error, onBack }: { error: string; onBack: () => void }) {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center" style={{ background: "#020209" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-6"
      >
        <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#ef4444,#f97316)" }}>
          <BookOpen className="w-10 h-10 text-white" />
        </div>
        <h1 
          className="text-6xl font-black mb-4"
          style={{ fontFamily: "'Sora', sans-serif", background: "linear-gradient(135deg,#fff,rgba(255,255,255,0.5))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          404
        </h1>
        <p className="text-lg mb-8" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.5)" }}>
          {error || 'Blog post not found'}
        </p>
        <motion.button
          onClick={onBack}
          className="px-8 py-3 rounded-xl font-bold text-sm"
          style={{ 
            fontFamily: "'Sora', sans-serif",
            background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
            color: "#fff"
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Back to Blog
        </motion.button>
      </motion.div>
    </div>
  );
}

// Main Component
const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [sidebarBlogs, setSidebarBlogs] = useState<SidebarBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [authorImageError, setAuthorImageError] = useState(false);
  const [showAuthorImageModal, setShowAuthorImageModal] = useState(false);

  // Fetch blog post by slug
  const fetchBlogPost = useCallback(async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/blog/slug/${slug}`);
      const data = await response.json();

      if (data.success) {
        setBlog(data.blog);
        setLikeCount(data.blog.likes);
        fetchRelatedPosts(data.blog.category, data.blog._id);
        fetchSidebarBlogs(data.blog._id);
      } else {
        setError('Blog post not found');
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  // Fetch related posts
  const fetchRelatedPosts = async (category: string, excludeId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/blog?category=${category}&limit=3`
      );
      const data = await response.json();

      if (data.success) {
        const filtered = data.blogs.filter((post: RelatedPost) => post._id !== excludeId);
        setRelatedPosts(filtered.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

  // Fetch all blogs for sidebar
  const fetchSidebarBlogs = async (excludeId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/blog?limit=5`
      );
      const data = await response.json();

      if (data.success) {
        const filtered = data.blogs.filter((post: SidebarBlog) => post._id !== excludeId);
        setSidebarBlogs(filtered.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching sidebar blogs:', error);
    }
  };

  // Handle like
  const handleLike = async () => {
    if (!blog || liked) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/blog/${blog._id}/like`, {
        method: 'POST',
      });
      const data = await response.json();

      if (data.success) {
        setLiked(true);
        setLikeCount(data.likes);
      }
    } catch (error) {
      console.error('Error liking blog post:', error);
    }
  };

  // Handle share
  const handleShare = async () => {
    if (!blog) return;

    const url = window.location.href;
    const text = `Check out this article: ${blog.title}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: url,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  useEffect(() => {
    setAuthorImageError(false);
    fetchBlogPost();
  }, [slug, fetchBlogPost]);

  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAuthorImageModal(false);
      }
    };
    
    if (showAuthorImageModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showAuthorImageModal]);

  // Update SEO meta tags when blog loads
  useEffect(() => {
    if (blog) {
      document.title = blog.seoTitle || blog.title || 'Blog Post';
      
      let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!metaDescription) {
        metaDescription = document.createElement('meta') as HTMLMetaElement;
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      metaDescription.content = blog.seoDescription || blog.excerpt?.replace(/<[^>]*>/g, '') || '';
      
      let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null;
      if (blog.seoKeywords) {
        if (!metaKeywords) {
          metaKeywords = document.createElement('meta') as HTMLMetaElement;
          metaKeywords.name = 'keywords';
          document.head.appendChild(metaKeywords);
        }
        metaKeywords.content = blog.seoKeywords;
      }

      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link') as HTMLLinkElement;
        canonicalLink.rel = 'canonical';
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.href = window.location.href;

      let metaRobots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
      if (!metaRobots) {
        metaRobots = document.createElement('meta') as HTMLMetaElement;
        metaRobots.name = 'robots';
        document.head.appendChild(metaRobots);
      }
      metaRobots.content = 'index, follow';

      let metaAuthor = document.querySelector('meta[name="author"]') as HTMLMetaElement | null;
      if (!metaAuthor) {
        metaAuthor = document.createElement('meta') as HTMLMetaElement;
        metaAuthor.name = 'author';
        document.head.appendChild(metaAuthor);
      }
      metaAuthor.content = blog.author || 'Akash Raikwar';

      const updateOGTag = (property: string, content: string) => {
        let ogTag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
        if (!ogTag) {
          ogTag = document.createElement('meta') as HTMLMetaElement;
          ogTag.setAttribute('property', property);
          document.head.appendChild(ogTag);
        }
        ogTag.content = content;
      };

      updateOGTag('og:title', blog.seoTitle || blog.title);
      updateOGTag('og:description', blog.seoDescription || blog.excerpt?.replace(/<[^>]*>/g, '') || '');
      updateOGTag('og:image', blog.image);
      updateOGTag('og:type', 'article');
      updateOGTag('og:url', window.location.href);
      updateOGTag('og:site_name', 'Akash Raikwar - Portfolio');
      updateOGTag('article:author', blog.author || 'Akash Raikwar');
      updateOGTag('article:published_time', blog.publishedAt);
      updateOGTag('article:tag', blog.category);

      const updateTwitterTag = (name: string, content: string) => {
        let twitterTag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
        if (!twitterTag) {
          twitterTag = document.createElement('meta') as HTMLMetaElement;
          twitterTag.setAttribute('name', name);
          document.head.appendChild(twitterTag);
        }
        twitterTag.content = content;
      };

      updateTwitterTag('twitter:card', 'summary_large_image');
      updateTwitterTag('twitter:title', blog.seoTitle || blog.title);
      updateTwitterTag('twitter:description', blog.seoDescription || blog.excerpt?.replace(/<[^>]*>/g, '') || '');
      updateTwitterTag('twitter:image', blog.image);
      updateTwitterTag('twitter:creator', '@akashraikwar');
      updateTwitterTag('twitter:site', '@akashraikwar');

      const scriptId = 'blog-post-structured-data';
      let structuredDataScript = document.getElementById(scriptId) as HTMLScriptElement | null;
      
      if (!structuredDataScript) {
        structuredDataScript = document.createElement('script') as HTMLScriptElement;
        structuredDataScript.id = scriptId;
        structuredDataScript.type = 'application/ld+json';
        document.head.appendChild(structuredDataScript);
      }

      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: blog.title,
        description: blog.seoDescription || blog.excerpt?.replace(/<[^>]*>/g, '') || '',
        image: blog.image,
        datePublished: blog.publishedAt,
        dateModified: blog.publishedAt,
        author: {
          '@type': 'Person',
          name: blog.author || 'Akash Raikwar',
          url: 'https://akashraikwar.in'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Akash Raikwar - Portfolio',
          logo: {
            '@type': 'ImageObject',
            url: 'https://akashraikwar.in/logo.png'
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': window.location.href
        },
        keywords: blog.seoKeywords || blog.tags?.join(', ') || '',
        articleSection: blog.category,
        wordCount: blog.content?.split(/\s+/).length || 0
      };

      structuredDataScript.textContent = JSON.stringify(structuredData);
    }

    return () => {
      document.title = 'Akash Raikwar - Portfolio';
      
      const structuredDataScript = document.getElementById('blog-post-structured-data');
      if (structuredDataScript) {
        structuredDataScript.remove();
      }
    };
  }, [blog]);

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error || !blog) {
    return <ErrorState error={error || 'Blog post not found'} onBack={() => navigate('/blog')} />;
  }

  return (
    <div className="min-h-screen pt-20 pb-16 relative overflow-hidden" style={{ background: "#020209" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;700;800;900&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');
        .blog-content h1, .blog-content h2, .blog-content h3 { color: #fff; font-family: 'Sora', sans-serif; margin-top: 1.5rem; margin-bottom: 0.75rem; }
        .blog-content h1 { font-size: 1.75rem; font-weight: 800; }
        .blog-content h2 { font-size: 1.5rem; font-weight: 700; }
        .blog-content h3 { font-size: 1.25rem; font-weight: 700; }
        .blog-content p { color: rgba(255,255,255,0.7); font-family: 'DM Sans', sans-serif; line-height: 1.8; margin-bottom: 1rem; }
        .blog-content a { color: #818cf8; text-decoration: underline; }
        .blog-content ul, .blog-content ol { color: rgba(255,255,255,0.7); font-family: 'DM Sans', sans-serif; margin-left: 1.5rem; margin-bottom: 1rem; }
        .blog-content li { margin-bottom: 0.5rem; }
        .blog-content code { background: rgba(99,102,241,0.15); padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-family: 'Space Mono', monospace; font-size: 0.875rem; color: #818cf8; }
        .blog-content pre { background: #0a0a14; border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; padding: 1rem; overflow-x: auto; margin: 1rem 0; }
        .blog-content pre code { background: none; padding: 0; color: #4ade80; }
        .blog-content blockquote { border-left: 4px solid #8b5cf6; padding-left: 1rem; margin: 1rem 0; color: rgba(255,255,255,0.6); font-style: italic; }
        .blog-content img { border-radius: 0.75rem; margin: 1rem 0; }
        .blog-content strong { color: #fff; font-weight: 600; }
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
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium"
            style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Space Mono', monospace" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          {/* Category & Tags */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <motion.span
              className="px-4 py-1.5 rounded-full text-xs font-bold"
              style={{ 
                fontFamily: "'Space Mono', monospace",
                background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
                color: "#fff",
                letterSpacing: "0.05em"
              }}
              whileHover={{ scale: 1.02 }}
            >
              {blog.category}
            </motion.span>
            {blog.tags?.slice(0, 3).map((tag, index) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="px-3 py-1 rounded-full text-xs"
                style={{ 
                  fontFamily: "'Space Mono', monospace",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.5)"
                }}
              >
                #{tag}
              </motion.span>
            ))}
          </div>

          {/* Title */}
          <h1 
            className="text-3xl md:text-5xl font-black mb-6 leading-tight"
            style={{ 
              fontFamily: "'Sora', sans-serif", 
              letterSpacing: "-0.04em",
              background: "linear-gradient(135deg,#fff 30%,rgba(255,255,255,0.4) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6" style={{ color: "rgba(255,255,255,0.5)" }}>
            {/* Author */}
            <div className="flex items-center gap-3">
              {isValidImageUrl(blog.authorProfilePic) && !authorImageError ? (
                <motion.img
                  src={normalizeImageUrl(blog.authorProfilePic)}
                  alt={blog.author}
                  className="w-10 h-10 rounded-full object-cover border-2 cursor-pointer"
                  style={{ borderColor: "rgba(139,92,246,0.5)" }}
                  onError={() => setAuthorImageError(true)}
                  onClick={() => setShowAuthorImageModal(true)}
                  whileHover={{ scale: 1.1 }}
                />
              ) : (
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}
                >
                  <span className="text-white font-bold">{blog.author?.charAt(0)}</span>
                </div>
              )}
              <div>
                <p className="text-white font-medium text-sm" style={{ fontFamily: "'Sora', sans-serif" }}>{blog.author}</p>
                {blog.authorProfile && (
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{blog.authorProfile}</p>
                )}
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: "#818cf8" }} />
              <span className="text-sm" style={{ fontFamily: "'Space Mono', monospace" }}>
                {new Date(blog.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>

            {/* Read Time */}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: "#818cf8" }} />
              <span className="text-sm" style={{ fontFamily: "'Space Mono', monospace" }}>{blog.readTime}</span>
            </div>

            {/* Views */}
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" style={{ color: "#818cf8" }} />
              <span className="text-sm" style={{ fontFamily: "'Space Mono', monospace" }}>{blog.views} views</span>
            </div>
          </div>
        </motion.header>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-12"
        >
          <div className="relative rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
            <motion.img
              src={normalizeImageUrl(blog.image)}
              alt={blog.title}
              className="w-full h-64 md:h-96 object-cover"
              initial={{ scale: 1 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Article Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:w-2/3"
          >
            {/* Excerpt */}
            <div 
              className="rounded-2xl p-6 mb-8"
              style={{ background: "linear-gradient(135deg,rgba(59,130,246,0.1),rgba(139,92,246,0.1))", border: "1px solid rgba(139,92,246,0.2)" }}
            >
              <p className="text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'DM Sans', sans-serif" }}>
                <div dangerouslySetInnerHTML={{ __html: blog.excerpt }} />
              </p>
            </div>

            {/* Content */}
            <div 
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Content Sections */}
            {blog.contentSections && blog.contentSections.length > 0 && (
              <div className="space-y-8 mt-8">
                {blog.contentSections
                  .sort((a, b) => a.order - b.order)
                  .map((section, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="rounded-2xl p-8"
                      style={{ background: "rgb(11,12,24)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      {section.title && (
                        <h2 
                          className="text-2xl font-bold mb-6 pb-4"
                          style={{ 
                            fontFamily: "'Sora', sans-serif", 
                            color: "#fff",
                            borderBottom: "1px solid rgba(255,255,255,0.06)"
                          }}
                        >
                          {section.title}
                        </h2>
                      )}
                      
                      {section.content && (
                        <div className="blog-content" dangerouslySetInnerHTML={{ __html: section.content }} />
                      )}
                      
                      {section.image && (
                        <div className="mt-6 rounded-xl overflow-hidden">
                          <img src={normalizeImageUrl(section.image)} alt={section.title} className="w-full object-cover" />
                        </div>
                      )}
                      
                      {section.code && (
                        <div className="mt-6 rounded-xl overflow-hidden" style={{ background: "#0a0a14", border: "1px solid rgba(255,255,255,0.1)" }}>
                          <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                            <div className="flex gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ background: "#ef4444" }} />
                              <div className="w-3 h-3 rounded-full" style={{ background: "#fbbf24" }} />
                              <div className="w-3 h-3 rounded-full" style={{ background: "#22c55e" }} />
                            </div>
                            <span className="text-xs ml-4" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Space Mono', monospace" }}>Code</span>
                          </div>
                          <pre className="p-4 overflow-x-auto">
                            <code className="text-sm" style={{ color: "#4ade80", fontFamily: "'Space Mono', monospace" }}>{section.code}</code>
                          </pre>
                        </div>
                      )}
                    </motion.div>
                  ))}
              </div>
            )}

            {/* Actions */}
            <motion.div
              className="flex flex-wrap items-center gap-4 mt-10 pt-8"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <motion.button
                onClick={handleLike}
                disabled={liked}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm"
                style={{ 
                  fontFamily: "'Space Mono', monospace",
                  background: liked ? "linear-gradient(135deg,#ef4444,#f97316)" : "rgba(255,255,255,0.03)",
                  border: "1px solid",
                  borderColor: liked ? "transparent" : "rgba(255,255,255,0.1)",
                  color: liked ? "#fff" : "rgba(255,255,255,0.7)"
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                {liked ? 'Liked' : 'Like'} ({likeCount})
              </motion.button>

              <motion.button
                onClick={handleShare}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm"
                style={{ 
                  fontFamily: "'Space Mono', monospace",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.7)"
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 className="w-4 h-4" />
                Share
              </motion.button>
            </motion.div>
          </motion.article>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:w-1/3"
          >
            {/* Other Blogs Widget */}
            <div 
              className="rounded-2xl overflow-hidden sticky top-24"
              style={{ background: "rgb(11,12,24)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="p-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>
                    <BookOpen className="w-5 h-5 text-white" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>Other Blogs</h3>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>Explore more articles</p>
                  </div>
                </div>
              </div>
              
              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                {sidebarBlogs.map((post) => (
                  <Link
                    key={post._id}
                    to={`/blog/${post.slug}`}
                    className="block p-4 group"
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-xl overflow-hidden">
                          <img
                            src={normalizeImageUrl(post.image)}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span 
                          className="inline-block px-2 py-0.5 rounded-full text-xs font-bold mb-2"
                          style={{ 
                            fontFamily: "'Space Mono', monospace",
                            background: "rgba(139,92,246,0.15)",
                            color: "#a78bfa"
                          }}
                        >
                          {post.category}
                        </span>
                        <h4 
                          className="text-white font-semibold text-sm line-clamp-2 group-hover:text-blue-400 transition-colors"
                          style={{ fontFamily: "'Sora', sans-serif" }}
                        >
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <Link
                  to="/blog"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm group"
                  style={{ 
                    fontFamily: "'Sora', sans-serif",
                    background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
                    color: "#fff"
                  }}
                >
                  View All Blogs
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.aside>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-16"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>
                <Sparkles className="w-5 h-5 text-white" strokeWidth={1.8} />
              </div>
              <h2 className="font-black text-white" style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.5rem", letterSpacing: "-0.03em" }}>
                Related Articles
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link to={`/blog/${post.slug}`} className="group block">
                    <div 
                      className="rounded-2xl overflow-hidden h-full"
                      style={{ background: "rgb(11,12,24)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={normalizeImageUrl(post.image)}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <span 
                          className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold"
                          style={{ 
                            fontFamily: "'Space Mono', monospace",
                            background: "rgba(139,92,246,0.8)",
                            color: "#fff"
                          }}
                        >
                          {post.category}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 
                          className="font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors"
                          style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem" }}
                        >
                          {post.title}
                        </h3>
                        <div className="flex items-center justify-between text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                          <span>{post.readTime}</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Author Image Modal */}
      {showAuthorImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setShowAuthorImageModal(false)}
          style={{ background: "rgba(0,0,0,0.9)" }}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-12 right-0 md:-right-12 p-2 rounded-full transition-colors hover:bg-white/10"
              onClick={() => setShowAuthorImageModal(false)}
              style={{ color: "#fff" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <img
              src={normalizeImageUrl(blog.authorProfilePic)}
              alt={blog.author}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              style={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPost;
