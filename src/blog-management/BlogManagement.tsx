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
  Sparkles,
  ChevronLeft,
  ChevronRight,
  FileText,
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

const DEFAULT_FORM_DATA: BlogFormData = {
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
  seoKeywords: '',
};

const INITIAL_CATEGORIES = ['React', 'Backend', 'DevOps', 'Database', 'Trends', 'Tutorial', 'Technology'];

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
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<BlogPost | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState<BlogFormData>(DEFAULT_FORM_DATA);

  // ─── Fetch blogs ───────────────────────────────────────────────────────────
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
        setBlogs(data.blogs ?? []);
        setTotalPages(data.pagination?.totalPages ?? 1);
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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // ─── Modal helpers ─────────────────────────────────────────────────────────
  const openModal = (blog?: BlogPost) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title ?? '',
        slug: blog.slug ?? '',
        excerpt: blog.excerpt ?? '',
        content: blog.content ?? '',
        contentSections: blog.contentSections ?? [],
        image: blog.image ?? '',
        author: blog.author ?? '',
        authorProfile: blog.authorProfile ?? DEFAULT_FORM_DATA.authorProfile,
        authorProfilePic: blog.authorProfilePic ?? '',
        category: blog.category ?? '',
        tags: blog.tags ?? [],
        readTime: blog.readTime ?? '',
        featured: blog.featured,
        published: blog.published,
        seoTitle: blog.seoTitle ?? '',
        seoDescription: blog.seoDescription ?? '',
        seoKeywords: blog.seoKeywords ?? '',
      });
    } else {
      setEditingBlog(null);
      setFormData(DEFAULT_FORM_DATA);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBlog(null);
    setFormData(DEFAULT_FORM_DATA);
  };

  // ─── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.title?.trim()) { alert('Title is required'); return; }
      if (!formData.excerpt?.trim()) { alert('Excerpt is required'); return; }
      if (!formData.content?.trim()) { alert('Content is required'); return; }
      if (!formData.image?.trim()) { alert('Image URL is required'); return; }

      const cleanedFormData = {
        ...formData,
        authorProfilePic: formData.authorProfilePic?.trim() || undefined,
        contentSections: formData.contentSections
          .map((section) => ({
            ...section,
            image: section.image?.trim() || undefined,
          }))
          .filter(
            (section) =>
              section.title?.trim() ||
              section.content?.trim() ||
              section.image ||
              section.code?.trim()
          ),
        tags: formData.tags.filter((tag) => tag?.trim().length > 0),
      };

      const url = editingBlog
        ? `/api/blog/${editingBlog._id}`
        : `/api/blog`;

      const response = await authenticatedFetch(url, {
        method: editingBlog ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedFormData),
      });

      const data = await response.json();

      if (data.success) {
        closeModal();
        fetchBlogs();
        setSuccessMessage(editingBlog ? 'Blog updated successfully!' : 'Blog created successfully!');
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 3000);
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          alert(`Validation errors:\n${data.errors.map((err: { msg: string }) => err.msg).join('\n')}`);
        } else {
          alert(data.message ?? 'Failed to save blog');
        }
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Failed to save blog. Please check the console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Delete ────────────────────────────────────────────────────────────────
  const openDeleteModal = (blog: BlogPost) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

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
        setTimeout(() => setShowSuccessModal(false), 3000);
      } else {
        alert(data.message ?? 'Failed to delete blog');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog');
    }
  };

  // ─── Pagination helpers ────────────────────────────────────────────────────
  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (currentPage > 3) pages.push('...');
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  // ─── Animation variants ────────────────────────────────────────────────────
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-12"
      >
        {/* ── Header ── */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Blog Management</h1>
            <p className="text-slate-400 text-sm md:text-base">Create, edit, and manage your blog posts</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-blue-500/25 w-full sm:w-auto justify-center flex-shrink-0"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            <span>New Blog Post</span>
          </motion.button>
        </motion.div>

        {/* ── Filters ── */}
        <motion.div variants={itemVariants} className="mb-6 md:mb-8">
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-4 md:p-5 border border-slate-700/60 shadow-2xl">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm"
              />
            </div>

            {/* Category pills — horizontally scrollable on mobile */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
              {['', ...categories].map((cat) => (
                <button
                  key={cat === '' ? '__all__' : cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 border ${
                    selectedCategory === cat
                      ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                      : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  {cat === '' ? 'All' : cat}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Blog List ── */}
        <motion.div variants={itemVariants} className="mb-6">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mb-4" />
              <p className="text-slate-400 text-sm">Loading blog posts…</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16 bg-slate-800/30 rounded-2xl border border-slate-700/40">
              <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">No blog posts found</p>
              <p className="text-slate-600 text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  onEdit={() => openModal(blog)}
                  onDelete={() => openDeleteModal(blog)}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-1.5 flex-wrap">
            {/* Prev */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {getPageNumbers().map((page, idx) =>
              page === '...' ? (
                <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-slate-500 text-sm select-none">
                  …
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page as number)}
                  className={`w-9 h-9 rounded-lg transition-all duration-200 text-sm font-medium ${
                    page === currentPage
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white/10 hover:bg-white/20 text-slate-300'
                  }`}
                >
                  {page}
                </button>
              )
            )}

            {/* Next */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* ── Create / Edit Modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-[#0A0F1C] rounded-t-2xl sm:rounded-2xl border border-white/10 w-full sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden"
            >
              {/* Rainbow top bar */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

              {/* Modal header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
                <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
                  {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Scrollable form body */}
              <div className="overflow-y-auto flex-1">
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Success Modal ── */}
      <AnimatePresence>
        {showSuccessModal && (
          <Overlay onClick={() => setShowSuccessModal(false)}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-xl rounded-3xl p-7 md:p-8 border border-green-500/30 shadow-2xl w-[calc(100%-2rem)] max-w-sm mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15, type: 'spring', duration: 0.6 }}
                  className="relative mx-auto w-20 h-20 mb-5"
                >
                  <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                  <div className="relative bg-gradient-to-br from-green-400 to-emerald-500 rounded-full w-20 h-20 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute -top-2 -right-2"
                  >
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                  </motion.div>
                </motion.div>

                <h3 className="text-2xl font-bold text-white mb-2">Success! 🎉</h3>
                <p className="text-green-100 text-base mb-6">{successMessage}</p>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setShowSuccessModal(false)}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg"
                >
                  Awesome!
                </motion.button>
              </div>
            </motion.div>
          </Overlay>
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation Modal ── */}
      <AnimatePresence>
        {showDeleteModal && blogToDelete && (
          <Overlay onClick={() => setShowDeleteModal(false)}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-gradient-to-br from-red-900/90 to-rose-900/90 backdrop-blur-xl rounded-3xl p-7 md:p-8 border border-red-500/30 shadow-2xl w-[calc(100%-2rem)] max-w-sm mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', duration: 0.6 }}
                  className="relative mx-auto w-20 h-20 mb-5"
                >
                  <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse" />
                  <div className="relative bg-gradient-to-br from-red-400 to-rose-500 rounded-full w-20 h-20 flex items-center justify-center">
                    <AlertTriangle className="w-10 h-10 text-white" />
                  </div>
                </motion.div>

                <h3 className="text-2xl font-bold text-white mb-2">Delete Blog Post?</h3>

                <p className="text-red-100 text-sm md:text-base mb-3">
                  Are you sure you want to delete this post?
                </p>

                <div className="bg-white/10 rounded-xl p-3 border border-white/20 mb-3 text-left">
                  <h4 className="font-semibold text-white text-sm truncate">"{blogToDelete.title}"</h4>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {blogToDelete.category} · {blogToDelete.readTime}
                  </p>
                </div>

                <p className="text-red-200 text-xs mb-5">⚠️ This action cannot be undone!</p>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 sm:flex-none px-5 py-2.5 bg-white/10 hover:bg-white/20 text-slate-300 rounded-xl font-semibold transition-all duration-200 text-sm"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleDelete}
                    className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg text-sm"
                  >
                    Delete Forever
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </Overlay>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── BlogCard sub-component ────────────────────────────────────────────────────
interface BlogCardProps {
  blog: BlogPost;
  onEdit: () => void;
  onDelete: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onEdit, onDelete }) => (
  <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/60 hover:border-slate-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl group overflow-hidden relative">
    {/* Ambient glow */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />

    <div className="flex flex-col sm:flex-row gap-0 sm:gap-5 p-4 sm:p-5 relative z-10">
      {/* Thumbnail */}
      <div className="w-full sm:w-40 md:w-48 aspect-video sm:aspect-auto sm:h-32 md:h-36 flex-shrink-0 overflow-hidden rounded-xl border border-slate-700/50 mb-3 sm:mb-0">
        <img
          src={normalizeImageUrl(blog.image)}
          alt={blog.title}
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'https://placehold.co/400x225/1e293b/475569?text=No+Image';
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Title + badges */}
        <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-2 mb-2">
          <h3 className="text-base md:text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 flex-1 min-w-0">
            {blog.title}
          </h3>
          <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap">
            {blog.featured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs rounded-full font-medium whitespace-nowrap">
                <Star className="w-3 h-3" />
                Featured
              </span>
            )}
            <span
              className={`px-2 py-0.5 text-xs rounded-full font-medium border whitespace-nowrap ${
                blog.published
                  ? 'bg-green-400/10 border-green-400/20 text-green-400'
                  : 'bg-slate-500/10 border-slate-500/30 text-slate-400'
              }`}
            >
              {blog.published ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>

        {/* Excerpt */}
        <p className="text-slate-400 text-xs md:text-sm line-clamp-2 mb-3">
          {stripHtmlTags(blog.excerpt)}
        </p>

        {/* Meta row — scrollable on tiny screens */}
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-3 overflow-x-auto pb-0.5 scrollbar-none flex-nowrap">
          <span className="flex items-center gap-1 flex-shrink-0">
            <Tag className="w-3.5 h-3.5" />
            {blog.category}
          </span>
          <span className="flex items-center gap-1 flex-shrink-0">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(blog.publishedAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1 flex-shrink-0">
            <Clock className="w-3.5 h-3.5" />
            {blog.readTime}
          </span>
          <span className="flex items-center gap-1 flex-shrink-0">
            <Eye className="w-3.5 h-3.5" />
            {blog.views.toLocaleString()} views
          </span>
        </div>

        {/* Tags + actions */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-wrap gap-1 min-w-0">
            {blog.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-blue-500/15 text-blue-400 text-xs rounded-md">
                {tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="px-2 py-0.5 bg-slate-500/15 text-slate-400 text-xs rounded-md">
                +{blog.tags.length - 3}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={onEdit}
              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
              aria-label="Edit blog post"
            >
              <Edit className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
              aria-label="Delete blog post"
            >
              <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─── Overlay wrapper ───────────────────────────────────────────────────────────
const Overlay: React.FC<{ children: React.ReactNode; onClick: () => void }> = ({
  children,
  onClick,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    onClick={onClick}
  >
    {children}
  </motion.div>
);

export default BlogManagement;