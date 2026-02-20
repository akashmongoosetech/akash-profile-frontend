import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { normalizeImageUrl, isValidImageUrl, stripHtmlTags } from '../utils/api';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  publishedAt: string;
  author: string;
  authorProfilePic?: string;
  category: string;
  readTime: string;
}

interface BlogPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const BlogPopup: React.FC<BlogPopupProps> = ({ isOpen, onClose }) => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authorImageError, setAuthorImageError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setAuthorImageError(false);
      fetchLatestBlog();
    }
  }, [isOpen]);

  const fetchLatestBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/blog/latest`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch latest blog');
      }
      
      const data = await response.json();
      if (data.success && data.blog) {
        setBlog(data.blog);
      } else {
        setError('No blog posts available');
      }
    } catch (err) {
      console.error('Error fetching latest blog:', err);
      setError('Failed to load latest blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleBlogClick = () => {
    if (blog) {
      navigate(`/blog/${blog.slug}`);
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAuthorAvatar = (author: string, authorProfilePic?: string) => {
    if (isValidImageUrl(authorProfilePic) && !authorImageError) {
      return (
        <img
          src={normalizeImageUrl(authorProfilePic)}
          alt={author}
          className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
          onError={() => setAuthorImageError(true)}
        />
      );
    }
    
    const initials = author
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold border-2 border-white/20">
        {initials}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 text-white"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white mb-2">Latest Blog Post</h2>
              <p className="text-gray-300">Stay updated with our newest content</p>
            </div>

            {/* Content */}
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-400 mb-4">{error}</p>
                  <button
                    onClick={fetchLatestBlog}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                  >
                    Try Again
                  </button>
                </div>
              ) : blog ? (
                <div className="space-y-4">
                  {/* Blog Image */}
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={normalizeImageUrl(blog.image)}
                      alt={blog.title}
                      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-blue-500/80 backdrop-blur-sm text-white text-sm rounded-full">
                        {blog.category}
                      </span>
                    </div>
                  </div>

                  {/* Blog Content */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white leading-tight">
                      {blog.title}
                    </h3>
                    
                    <p className="text-gray-300 overflow-hidden" style={{
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {stripHtmlTags(blog.excerpt)}
                    </p>

                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getAuthorAvatar(blog.author, blog.authorProfilePic)}
                          <span>{blog.author}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Calendar size={16} />
                          <span>{formatDate(blog.publishedAt)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Clock size={16} />
                          <span>{blog.readTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Read More Button */}
                    <button
                      onClick={handleBlogClick}
                      className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 group"
                    >
                      <span>Read Full Article</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BlogPopup;
