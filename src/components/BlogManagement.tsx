import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Calendar, 
  Clock, 
  Star,
  Save,
  X,
  Tag,
  FileText,
  BarChart3,
  Code,
  Move
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
  const [categories] = useState(['React', 'Backend', 'DevOps', 'Database', 'Trends', 'Tutorial', 'Technology']);

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
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      params.append('page', currentPage.toString());
      params.append('limit', '10');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/blog/admin/all?${params}`);
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
  };

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, selectedCategory, searchTerm]);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, ''); // Remove leading and trailing dashes
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'tags') {
      const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
      setFormData(prev => ({ ...prev, tags }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        ...(name === 'title' && { slug: generateSlug(value) })
      }));
    }
  };

  // Handle content section changes
  const handleContentSectionChange = (index: number, field: keyof ContentSection, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      contentSections: prev.contentSections.map((section, i) => 
        i === index ? { ...section, [field]: value } : section
      )
    }));
  };

  // Add new content section
  const addContentSection = () => {
    setFormData(prev => ({
      ...prev,
      contentSections: [...prev.contentSections, {
        title: '',
        content: '',
        image: '',
        code: '',
        order: prev.contentSections.length
      }]
    }));
  };

  // Remove content section
  const removeContentSection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contentSections: prev.contentSections.filter((_, i) => i !== index)
        .map((section, i) => ({ ...section, order: i }))
    }));
  };

  // Move content section up/down
  const moveContentSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formData.contentSections.length) return;

    setFormData(prev => {
      const sections = [...prev.contentSections];
      [sections[index], sections[newIndex]] = [sections[newIndex], sections[index]];
      return {
        ...prev,
        contentSections: sections.map((section, i) => ({ ...section, order: i }))
      };
    });
  };

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
        )
      };

      const url = editingBlog 
        ? `${import.meta.env.VITE_API_BASE_URL}/api/blog/${editingBlog._id}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/blog`;
      
      const method = editingBlog ? 'PUT' : 'POST';
      
      console.log('Sending blog data:', cleanedFormData); // Debug log
      
      const response = await fetch(url, {
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
        alert(editingBlog ? 'Blog updated successfully!' : 'Blog created successfully!');
      } else {
        console.error('Validation errors:', data.errors);
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map((err: any) => err.msg).join('\n');
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

  // Delete blog
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/blog/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        fetchBlogs();
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
                      src={blog.image}
                      alt={blog.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{blog.title}</h3>
                          <p className="text-gray-400 text-sm line-clamp-2">{blog.excerpt}</p>
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
                            onClick={() => handleDelete(blog._id)}
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

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category} className="bg-slate-800">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Read Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Read Time
                  </label>
                  <input
                    type="text"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleInputChange}
                    placeholder="5 min read"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Excerpt *
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  placeholder="Brief description of the blog post..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={10}
                  placeholder="Write your blog post content here..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags.join(', ')}
                  onChange={handleInputChange}
                  placeholder="react, javascript, tutorial"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
              </div>

              {/* Author Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Author Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                    placeholder="Author Name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  />
                </div>

                {/* Author Profile */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Author Profile
                  </label>
                  <textarea
                    name="authorProfile"
                    value={formData.authorProfile}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Brief author bio or description..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
                  />
                </div>
              </div>

              {/* Author Profile Picture */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Author Profile Picture URL
                </label>
                <input
                  type="url"
                  name="authorProfilePic"
                  value={formData.authorProfilePic}
                  onChange={handleInputChange}
                  placeholder="https://example.com/profile-pic.jpg"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
              </div>

              {/* Content Sections */}
              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Additional Content Sections
                  </h3>
                  <button
                    type="button"
                    onClick={addContentSection}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Section
                  </button>
                </div>

                {formData.contentSections.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">No additional content sections. Click "Add Section" to create rich content blocks.</p>
                ) : (
                  <div className="space-y-4">
                    {formData.contentSections.map((section, index) => (
                      <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-white font-medium">Section {index + 1}</h4>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => moveContentSection(index, 'up')}
                              disabled={index === 0}
                              className="p-1 hover:bg-white/10 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Move className="w-4 h-4 text-gray-400 rotate-180" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveContentSection(index, 'down')}
                              disabled={index === formData.contentSections.length - 1}
                              className="p-1 hover:bg-white/10 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Move className="w-4 h-4 text-gray-400" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeContentSection(index)}
                              className="p-1 hover:bg-red-500/20 text-red-400 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Section Title */}
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Section Title
                            </label>
                            <input
                              type="text"
                              value={section.title}
                              onChange={(e) => handleContentSectionChange(index, 'title', e.target.value)}
                              placeholder="Section heading..."
                              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 text-sm"
                            />
                          </div>

                          {/* Section Content */}
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Content
                            </label>
                            <textarea
                              value={section.content}
                              onChange={(e) => handleContentSectionChange(index, 'content', e.target.value)}
                              rows={4}
                              placeholder="Section content..."
                              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none text-sm"
                            />
                          </div>

                          {/* Section Image */}
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Image URL
                            </label>
                            <input
                              type="url"
                              value={section.image}
                              onChange={(e) => handleContentSectionChange(index, 'image', e.target.value)}
                              placeholder="https://example.com/image.jpg"
                              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 text-sm"
                            />
                          </div>

                          {/* Section Code */}
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-1">
                              <Code className="w-4 h-4" />
                              Code Block
                            </label>
                            <textarea
                              value={section.code}
                              onChange={(e) => handleContentSectionChange(index, 'code', e.target.value)}
                              rows={4}
                              placeholder="Code snippet..."
                              className="w-full px-3 py-2 bg-slate-900 border border-white/20 rounded-lg text-green-400 placeholder-gray-500 focus:outline-none focus:border-blue-400 resize-none text-sm font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SEO Settings */}
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  SEO Settings
                </h3>
                
                <div className="space-y-4">
                  {/* SEO Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Meta Title
                      <span className="text-gray-500 text-xs ml-2">(Max 60 characters)</span>
                    </label>
                    <input
                      type="text"
                      name="seoTitle"
                      value={formData.seoTitle}
                      onChange={handleInputChange}
                      maxLength={60}
                      placeholder="SEO optimized title for search engines"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {formData.seoTitle.length}/60 characters
                    </div>
                  </div>

                  {/* SEO Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Meta Description
                      <span className="text-gray-500 text-xs ml-2">(Max 160 characters)</span>
                    </label>
                    <textarea
                      name="seoDescription"
                      value={formData.seoDescription}
                      onChange={handleInputChange}
                      maxLength={160}
                      rows={3}
                      placeholder="Brief description for search engine results..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {formData.seoDescription.length}/160 characters
                    </div>
                  </div>

                  {/* SEO Keywords */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      SEO Keywords
                      <span className="text-gray-500 text-xs ml-2">(Max 200 characters, comma-separated)</span>
                    </label>
                    <input
                      type="text"
                      name="seoKeywords"
                      value={formData.seoKeywords}
                      onChange={handleInputChange}
                      maxLength={200}
                      placeholder="react, javascript, web development, tutorial"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {formData.seoKeywords.length}/200 characters
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-300">Featured</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-300">Published</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-gray-300 rounded-lg font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                >
                  <Save className="w-5 h-5" />
                  {isSubmitting ? 'Saving...' : (editingBlog ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
