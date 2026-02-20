import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authenticatedFetch, normalizeImageUrl, stripHtmlTags } from '../utils/api';
import BlogForm from './BlogForm';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Calendar,
  Clock,
  Star,
  X,
  Tag,
  CheckCircle,
  AlertTriangle,
  Sparkles
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
  contentSections: ContentSection[];
  image: string;
  author: string;
  authorProfile: string;
  authorProfilePic: string;
  category: string;
  tags: string[];
  readTime: string;
  featured: boolean;
  published: boolean;
  publishedAt: string;
  views: number;
  likes: number;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  contentSections: ContentSection[];
  image: string;
  author: string;
  authorProfile: string;
  authorProfilePic: string;
  category: string;
  tags: string[];
  readTime: string;
  featured: boolean;
  published: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

const BlogManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState(['React', 'Backend', 'DevOps', 'Database', 'Trends', 'Tutorial', 'Technology']);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  
  // Success and Delete Modal States
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<BlogPost | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    contentSections: [],
    image: '',
    author: 'Akash Raikwar',
    authorProfile: 'Full Stack Developer & Software Engineer passionate about creating innovative web solutions.',
    authorProfilePic: '',
    category: 'React',
    tags: [],
    readTime: '5 min read',
    featured: false,
    published: true,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  });

  // Fetch blogs
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      params.append('page', currentPage.toString());
      params.append('limit', '10');
      
      const response = await authenticatedFetch(`/api/blog/admin/all?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setBlogs(data.blogs);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, currentPage]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Open modal for creating/editing
  const openModal = (blog?: BlogPost) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
        content: blog.content,
        contentSections: blog.contentSections || [],
        image: blog.image,
        author: blog.author,
        authorProfile: blog.authorProfile || 'Full Stack Developer & Software Engineer passionate about creating innovative web solutions.',
        authorProfilePic: blog.authorProfilePic || '',
        category: blog.category,
        tags: blog.tags,
        readTime: blog.readTime,
        featured: blog.featured,
        published: blog.published,
        seoTitle: blog.seoTitle || '',
        seoDescription: blog.seoDescription || '',
        seoKeywords: blog.seoKeywords || ''
      });
    } else {
      setEditingBlog(null);
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        contentSections: [],
        image: '',
        author: 'Akash Raikwar',
        authorProfile: 'Full Stack Developer & Software Engineer passionate about creating innovative web solutions.',
        authorProfilePic: '',
        category: 'React',
        tags: [],
        readTime: '5 min read',
        featured: false,
        published: true,
        seoTitle: '',
        seoDescription: '',
        seoKeywords: ''
      });
    }
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingBlog(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      contentSections: [],
      image: '',
      author: 'Akash Raikwar',
      authorProfile: 'Full Stack Developer & Software Engineer passionate about creating innovative web solutions.',
      authorProfilePic: '',
      category: 'React',
      tags: [],
      readTime: '5 min read',
      featured: false,
      published: true,
      seoTitle: '',
      seoDescription: '',
      seoKeywords: ''
    });
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        alert('Title is required');
        setIsSubmitting(false);
        return;
      }
      
      if (!formData.excerpt.trim()) {
        alert('Excerpt is required');
        setIsSubmitting(false);
        return;
      }
      
      if (!formData.content.trim()) {
        alert('Content is required');
        setIsSubmitting(false);
        return;
      }
      
      if (!formData.image.trim()) {
        alert('Image URL is required');
        setIsSubmitting(false);
        return;
      }

      // Clean up the form data before sending
      const cleanedFormData = {
        ...formData,
        // Remove empty URL fields to avoid validation errors
        authorProfilePic: formData.authorProfilePic.trim() || undefined,
        contentSections: formData.contentSections.map(section => ({
          ...section,
          image: section.image.trim() || undefined
        })).filter(section => 
          section.title.trim() || section.content.trim() || section.image || section.code.trim()
        ),
        // Ensure tags are properly formatted
        tags: formData.tags.filter(tag => tag.trim().length > 0)
      };

      console.log('Form data being sent:', cleanedFormData);
      console.log('Tags being sent:', cleanedFormData.tags);

      const url = editingBlog 
        ? `/api/blog/${editingBlog._id}`
        : `/api/blog`;
      
      const method = editingBlog ? 'PUT' : 'POST';
      
      console.log('Sending blog data:', cleanedFormData); // Debug log
      
      const response = await authenticatedFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedFormData),
      });

      const data = await response.json();
      
      console.log('Server response:', data); // Debug log

      if (data.success) {
        closeModal();
        fetchBlogs();
        setSuccessMessage(editingBlog ? 'Blog updated successfully!' : 'Blog created successfully!');
        setShowSuccessModal(true);
        
        // Auto-hide success modal after 3 seconds
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 3000);
      } else {
        console.error('Validation errors:', data.errors);
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map((err: { msg: string }) => err.msg).join('\n');
          alert(`Validation errors:\n${errorMessages}`);
        } else {
          alert(data.message || 'Failed to save blog');
        }
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Failed to save blog. Please check the console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (blog: BlogPost) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

  // Delete blog
  const handleDelete = async () => {
    if (!blogToDelete) return;

    try {
      const response = await authenticatedFetch(`/api/blog/${blogToDelete._id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        fetchBlogs();
        setShowDeleteModal(false);
        setBlogToDelete(null);
        setSuccessMessage('Blog deleted successfully!');
        setShowSuccessModal(true);
        
        // Auto-hide success modal after 3 seconds
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 3000);
      } else {
        alert(data.message || 'Failed to delete blog');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog');
    }
  };

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

  return (
    <div className="min-h-screen pt-20 pb-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Blog Management</h1>
            <p className="text-gray-400">Create, edit, and manage your blog posts</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            New Blog Post
          </button>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="flex-1 w-full lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search blog posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 backdrop-blur-lg"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCategory === ''
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Blog List */}
        <motion.div variants={itemVariants} className="mb-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <p className="text-gray-400 mt-4">Loading blog posts...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={normalizeImageUrl(blog.image)}
                      alt={blog.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{blog.title}</h3>
                          <p className="text-gray-400 text-sm line-clamp-2">{stripHtmlTags(blog.excerpt)}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {blog.featured && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                              <Star className="w-3 h-3" />
                              Featured
                            </span>
                          )}
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            blog.published 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {blog.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Tag className="w-4 h-4" />
                          {blog.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(blog.publishedAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {blog.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {blog.views} views
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {blog.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {blog.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded">
                              +{blog.tags.length - 3} more
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openModal(blog)}
                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(blog)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg transition-all duration-200 ${
                  page === currentPage
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
            </div>

            <BlogForm
              formData={formData}
              setFormData={setFormData}
              editingBlog={editingBlog}
              isSubmitting={isSubmitting}
              categories={categories}
              setCategories={setCategories}
              showCustomCategory={showCustomCategory}
              setShowCustomCategory={setShowCustomCategory}
              customCategory={customCategory}
              setCustomCategory={setCustomCategory}
              onSubmit={handleSubmit}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-xl rounded-3xl p-8 border border-green-500/30 shadow-2xl max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Success Animation */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", duration: 0.6 }}
                  className="relative mx-auto w-20 h-20 mb-6"
                >
                  <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
                  <div className="relative bg-gradient-to-br from-green-400 to-emerald-500 rounded-full w-20 h-20 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-2 -right-2"
                  >
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                  </motion.div>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-white mb-3"
                >
                  Success! 🎉
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-green-100 text-lg mb-6"
                >
                  {successMessage}
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSuccessModal(false)}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg"
                >
                  Awesome!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && blogToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-gradient-to-br from-red-900/90 to-rose-900/90 backdrop-blur-xl rounded-3xl p-8 border border-red-500/30 shadow-2xl max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Warning Animation */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", duration: 0.6 }}
                  className="relative mx-auto w-20 h-20 mb-6"
                >
                  <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-red-400 to-rose-500 rounded-full w-20 h-20 flex items-center justify-center">
                    <AlertTriangle className="w-10 h-10 text-white" />
                  </div>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-white mb-3"
                >
                  Delete Blog Post?
                </motion.h3>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6"
                >
                  <p className="text-red-100 text-lg mb-3">
                    Are you sure you want to delete this blog post?
                  </p>
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <h4 className="font-semibold text-white text-sm mb-1">
                      "{blogToDelete.title}"
                    </h4>
                    <p className="text-gray-300 text-xs">
                      {blogToDelete.category} • {blogToDelete.readTime}
                    </p>
                  </div>
                  <p className="text-red-200 text-sm mt-3">
                    ⚠️ This action cannot be undone!
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-3 justify-center"
                >
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-gray-300 rounded-xl font-semibold transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDelete}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg"
                  >
                    Delete Forever
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogManagement;
