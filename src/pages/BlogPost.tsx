import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Eye, 
  Heart, 
  Share2, 
  Tag,
  ChevronRight,
  BookOpen,
  PenTool
} from 'lucide-react';

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

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Fetch blog post by slug
  const fetchBlogPost = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/blog/slug/${slug}`);
      const data = await response.json();

      if (data.success) {
        setBlog(data.blog);
        setLikeCount(data.blog.likes);
        
        // Fetch related posts
        fetchRelatedPosts(data.blog.category, data.blog._id);
      } else {
        setError('Blog post not found');
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

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
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  useEffect(() => {
    fetchBlogPost();
  }, [slug]);

  // Update SEO meta tags when blog loads
  useEffect(() => {
    if (blog) {
      // Update document title
      document.title = blog.seoTitle || blog.title || 'Blog Post';
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', blog.seoDescription || blog.excerpt || '');
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = blog.seoDescription || blog.excerpt || '';
        document.head.appendChild(meta);
      }
      
      // Update meta keywords
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (blog.seoKeywords) {
        if (metaKeywords) {
          metaKeywords.setAttribute('content', blog.seoKeywords);
        } else {
          const meta = document.createElement('meta');
          meta.name = 'keywords';
          meta.content = blog.seoKeywords;
          document.head.appendChild(meta);
        }
      }

      // Update Open Graph tags
      const updateOGTag = (property: string, content: string) => {
        let ogTag = document.querySelector(`meta[property="${property}"]`);
        if (ogTag) {
          ogTag.setAttribute('content', content);
        } else {
          ogTag = document.createElement('meta');
          ogTag.setAttribute('property', property);
          ogTag.setAttribute('content', content);
          document.head.appendChild(ogTag);
        }
      };

      updateOGTag('og:title', blog.seoTitle || blog.title);
      updateOGTag('og:description', blog.seoDescription || blog.excerpt);
      updateOGTag('og:image', blog.image);
      updateOGTag('og:type', 'article');
      updateOGTag('og:url', window.location.href);
    }

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = 'Akash Raikwar - Portfolio';
    };
  }, [blog]);


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="relative">
          {/* Notebook Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            {/* Notebook Base */}
            <div className="relative w-80 h-96 bg-gradient-to-br from-amber-50 to-amber-100 rounded-r-lg shadow-2xl border-l-4 border-red-600">
              {/* Spiral Binding */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-red-600 rounded-full"></div>
              <div className="absolute left-6 top-4 space-y-8">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-4 h-1 bg-red-400 rounded-full"></div>
                ))}
              </div>
              
              {/* Notebook Lines */}
              <div className="absolute left-16 right-4 top-8 space-y-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="h-px bg-blue-200"></div>
                ))}
              </div>
              
              {/* Typing Animation */}
              <div className="absolute left-16 right-4 top-8 space-y-6">
                {/* Title Line */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "60%" }}
                  transition={{ duration: 2, delay: 0.5 }}
                  className="h-1 bg-blue-600 rounded-full"
                ></motion.div>
                
                {/* Content Lines */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ width: 0 }}
                    animate={{ width: i % 3 === 0 ? "90%" : i % 2 === 0 ? "75%" : "85%" }}
                    transition={{ 
                      duration: 1.5, 
                      delay: 1 + (i * 0.2),
                      ease: "easeOut"
                    }}
                    className="h-0.5 bg-gray-600 rounded-full"
                  ></motion.div>
                ))}
              </div>
              
              {/* Animated Pen */}
              <motion.div
                animate={{ 
                  x: [0, 200, 0, 180, 0, 160],
                  y: [0, 0, 24, 24, 48, 48]
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute left-16 top-8"
              >
                <PenTool className="w-4 h-4 text-blue-600 transform rotate-45" />
              </motion.div>
              
              {/* Page Corner Fold */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-amber-200 transform rotate-45 translate-x-4 -translate-y-4 shadow-lg"></div>
            </div>
            
            {/* Page Flipping Animation */}
            <AnimatePresence>
              <motion.div
                key="page-flip"
                initial={{ rotateY: 0, x: 0 }}
                animate={{ 
                  rotateY: [0, -90, -90, 0],
                  x: [0, -20, -20, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  repeatDelay: 2,
                  times: [0, 0.3, 0.7, 1]
                }}
                className="absolute inset-0 w-80 h-96 bg-gradient-to-br from-white to-gray-50 rounded-r-lg shadow-xl border-l-4 border-red-600 origin-left"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Page Content */}
                <div className="absolute left-16 right-4 top-8 space-y-4">
                  <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-1 bg-gray-200 rounded w-full"></div>
                  <div className="h-1 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Book Icon */}
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-8 left-1/2 transform -translate-x-1/2"
            >
              <BookOpen className="w-8 h-8 text-blue-400" />
            </motion.div>
          </motion.div>
          
          {/* Loading Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-center mt-8"
          >
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xl text-white font-medium mb-2"
            >
              Blog Post Comming...
            </motion.p>
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              className="flex items-center justify-center space-x-1"
            >
              <span className="text-gray-400">Loading blog post</span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              >
                .
              </motion.span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              >
                .
              </motion.span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              >
                .
              </motion.span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">404</h1>
          <p className="text-gray-400 mb-8">{error || 'Blog post not found'}</p>
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Breadcrumb */}
        <motion.nav variants={itemVariants} className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/blog" className="hover:text-blue-400 transition-colors">Blog</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-300">{blog.title}</span>
        </motion.nav>

        {/* Back Button */}
        <motion.div variants={itemVariants} className="mb-8">
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blog
          </button>
        </motion.div>

        {/* Article Header */}
        <motion.header variants={itemVariants} className="mb-12">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-semibold rounded-full">
              {blog.category}
            </span>
            {blog.featured && (
              <span className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm font-semibold rounded-full">
                Featured
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {blog.title}
          </h1>

          <p className="text-xl text-gray-400 mb-8 leading-relaxed">
            {blog.excerpt}
          </p>

          {/* Author Information */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-8">
            <div className="flex items-start gap-4">
              {blog.authorProfilePic ? (
                <img
                  src={blog.authorProfilePic}
                  alt={blog.author}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white/20 flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl font-bold">
                    {blog.author.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-white text-lg font-semibold mb-1">{blog.author}</h3>
                {blog.authorProfile && (
                  <p className="text-gray-400 text-sm mb-3">{blog.authorProfile}</p>
                )}
                <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(blog.publishedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{blog.readTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{blog.views} views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Featured Image */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.article variants={itemVariants} className="mb-12">
          <div className="prose prose-lg prose-invert max-w-none">
            <div 
              className="text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: blog.content.replace(/\n/g, '<br />') 
              }}
            />
          </div>
        </motion.article>

        {/* Additional Content Sections */}
        {blog.contentSections && blog.contentSections.length > 0 && (
          <motion.div variants={itemVariants} className="mb-12 space-y-8">
            {blog.contentSections
              .sort((a, b) => a.order - b.order)
              .map((section, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                  {section.title && (
                    <h2 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-white/10">
                      {section.title}
                    </h2>
                  )}
                  
                  <div className="space-y-6">
                    {section.content && (
                      <div className="prose prose-lg prose-invert max-w-none">
                        <div 
                          className="text-gray-300 leading-relaxed"
                          dangerouslySetInnerHTML={{ 
                            __html: section.content.replace(/\n/g, '<br />') 
                          }}
                        />
                      </div>
                    )}
                    
                    {section.image && (
                      <div className="relative rounded-xl overflow-hidden">
                        <img
                          src={section.image}
                          alt={section.title || `Section ${index + 1} image`}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    )}
                    
                    {section.code && (
                      <div className="relative">
                        <div className="bg-slate-900 rounded-xl p-6 border border-white/10">
                          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                            <div className="flex gap-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <span className="text-gray-400 text-sm font-medium ml-4">Code</span>
                          </div>
                          <pre className="text-green-400 font-mono text-sm leading-relaxed overflow-x-auto">
                            <code>{section.code}</code>
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </motion.div>
        )}

        {/* Tags */}
        {blog.tags.length > 0 && (
          <motion.div variants={itemVariants} className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400 font-medium">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/10 text-gray-300 text-sm rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-16 p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              disabled={liked}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                liked
                  ? 'bg-red-500/20 text-red-400 cursor-not-allowed'
                  : 'bg-white/10 hover:bg-red-500/20 text-gray-300 hover:text-red-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-blue-500/20 text-gray-300 hover:text-blue-400 rounded-lg font-medium transition-all duration-200"
            >
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>

          <div className="text-sm text-gray-500">
            {blog.views} views • {likeCount} likes
          </div>
        </motion.div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold text-white mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((post) => (
                <Link
                  key={post._id}
                  to={`/blog/${post.slug}`}
                  className="group block"
                >
                  <motion.article
                    whileHover={{ y: -5 }}
                    className="bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="inline-block px-3 py-1 bg-blue-500/80 text-white text-xs font-semibold rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 mb-4 text-sm leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </div>
          </motion.section>
        )}
      </motion.div>
    </div>
  );
};

export default BlogPost;
