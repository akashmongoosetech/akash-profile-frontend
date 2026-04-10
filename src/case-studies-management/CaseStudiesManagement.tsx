import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authenticatedFetch, normalizeImageUrl, API_BASE_URL } from '../utils/api';
import Loader from '../components/Loader';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  CheckCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FileText,
  EyeOff,
  Eye as EyeIcon,
} from 'lucide-react';

interface CaseStudyResult {
  label: string;
  value: string;
  icon: string;
}

interface Testimonial {
  text: string;
  author: string;
  position: string;
  avatar: string;
}

interface CaseStudy {
  _id: string;
  title: string;
  category: string;
  client: string;
  duration: string;
  thumbnail: string;
  color: string;
  icon: string;
  overview: string;
  challenge: string;
  solution: string;
  results: CaseStudyResult[];
  technologies: string[];
  testimonial?: Testimonial;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CaseStudyFormData {
  title: string;
  category: string;
  client: string;
  duration: string;
  thumbnail: string | File;
  color: string;
  icon: string;
  overview: string;
  challenge: string;
  solution: string;
  results: CaseStudyResult[];
  technologies: string[];
  testimonial?: Testimonial;
  published: boolean;
}

const DEFAULT_FORM_DATA: CaseStudyFormData = {
  title: '',
  category: 'Web Development',
  client: '',
  duration: '',
  thumbnail: '',
  color: 'from-blue-500 to-purple-500',
  icon: 'Code',
  overview: '',
  challenge: '',
  solution: '',
  results: [
    { label: '', value: '', icon: 'TrendingUp' },
    { label: '', value: '', icon: 'Target' },
    { label: '', value: '', icon: 'Users' },
    { label: '', value: '', icon: 'Star' },
  ],
  technologies: [],
  published: true,
};

const CATEGORIES = ['Web Development', 'Mobile App', 'AI Solutions'];
const ICONS = ['Code', 'Palette', 'Database', 'Cloud', 'Smartphone'];
const RESULT_ICONS = ['TrendingUp', 'Target', 'Users', 'Star', 'Clock'];

const CaseStudiesManagement: React.FC = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingCaseStudy, setEditingCaseStudy] = useState<CaseStudy | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [caseStudyToDelete, setCaseStudyToDelete] = useState<CaseStudy | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState<CaseStudyFormData>(DEFAULT_FORM_DATA);

  // ─── Fetch case studies ───────────────────────────────────────────────────────────
  const fetchCaseStudies = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      params.append('page', currentPage.toString());
      params.append('limit', '10');

      const response = await authenticatedFetch(`/api/case-studies/admin/all?${params}`);
      const data = await response.json();

      if (data.success) {
        setCaseStudies(data.caseStudies ?? []);
        setTotalPages(data.pagination?.totalPages ?? 1);
      }
    } catch (error) {
      console.error('Error fetching case studies:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, currentPage]);

  useEffect(() => {
    fetchCaseStudies();
  }, [fetchCaseStudies]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // ─── Modal helpers ─────────────────────────────────────────────────────────
  const openModal = (caseStudy?: CaseStudy) => {
    if (caseStudy) {
      setEditingCaseStudy(caseStudy);
      setFormData({
        title: caseStudy.title ?? '',
        category: caseStudy.category ?? '',
        client: caseStudy.client ?? '',
        duration: caseStudy.duration ?? '',
        thumbnail: caseStudy.thumbnail ?? '',
        color: caseStudy.color ?? '',
        icon: caseStudy.icon ?? '',
        overview: caseStudy.overview ?? '',
        challenge: caseStudy.challenge ?? '',
        solution: caseStudy.solution ?? '',
        results: caseStudy.results ?? DEFAULT_FORM_DATA.results,
        technologies: caseStudy.technologies ?? [],
        testimonial: caseStudy.testimonial,
        published: caseStudy.published,
      });
    } else {
      setEditingCaseStudy(null);
      setFormData(DEFAULT_FORM_DATA);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCaseStudy(null);
    setFormData(DEFAULT_FORM_DATA);
  };

  // ─── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.title?.trim()) { alert('Title is required'); return; }
      if (!formData.client?.trim()) { alert('Client is required'); return; }
      if (!formData.overview?.trim()) { alert('Overview is required'); return; }

      const url = editingCaseStudy
        ? `/api/case-studies/${editingCaseStudy._id}`
        : '/api/case-studies';
      const method = editingCaseStudy ? 'PUT' : 'POST';

      const formDataToSend = new FormData();

      // Add all form data
      Object.keys(formData).forEach(key => {
        const value = formData[key as keyof CaseStudyFormData];
        if (value !== undefined && value !== null) {
          if (key === 'results' || key === 'technologies') {
            formDataToSend.append(key, JSON.stringify(value));
          } else if (key === 'testimonial' && value) {
            formDataToSend.append(key, JSON.stringify(value));
          } else if (key === 'thumbnail' && value instanceof File) {
            formDataToSend.append('thumbnail', value);
          } else if (key !== 'thumbnail' || typeof value === 'string') {
            formDataToSend.append(key, String(value));
          }
        }
      });

      // If editing and no new file uploaded, don't send thumbnail
      if (editingCaseStudy && typeof formData.thumbnail === 'string') {
        // Keep existing thumbnail
      }

      const response = await fetch(`${API_BASE_URL}${url}`, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(editingCaseStudy ? 'Case study updated successfully!' : 'Case study created successfully!');
        setShowSuccessModal(true);
        closeModal();
        fetchCaseStudies();
      } else {
        alert(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error saving case study:', error);
      alert('Error saving case study');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Toggle publish ────────────────────────────────────────────────────────
  const togglePublish = async (caseStudy: CaseStudy) => {
    try {
      const response = await authenticatedFetch(`/api/case-studies/${caseStudy._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !caseStudy.published }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(`Case study ${!caseStudy.published ? 'published' : 'unpublished'} successfully!`);
        setShowSuccessModal(true);
        fetchCaseStudies();
      } else {
        alert(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error toggling publish:', error);
      alert('Error toggling publish status');
    }
  };

  // ─── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!caseStudyToDelete) return;

    try {
      const response = await authenticatedFetch(`/api/case-studies/${caseStudyToDelete._id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Case study deleted successfully!');
        setShowSuccessModal(true);
        setShowDeleteModal(false);
        setCaseStudyToDelete(null);
        fetchCaseStudies();
      } else {
        alert(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error deleting case study:', error);
      alert('Error deleting case study');
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="font-body space-y-6">
        {/* ── Header ────────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl text-white">Case Studies Management</h1>
            <p className="text-white/60">Manage your portfolio case studies</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-cyan-500/25"
          >
            <Plus className="w-4 h-4" />
            Add Case Study
          </button>
        </div>

        {/* ── Filters ───────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search case studies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-white/[0.06] border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* ── Table ─────────────────────────────────────────────────────────── */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8"><Loader /></div>
          ) : caseStudies.length === 0 ? (
            <div className="p-8 text-center text-white/40">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No case studies found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/[0.02]">
                  <tr className="text-left">
                    <th className="px-6 py-4 text-white/60 font-medium">Title</th>
                    <th className="px-6 py-4 text-white/60 font-medium">Client</th>
                    <th className="px-6 py-4 text-white/60 font-medium">Category</th>
                    <th className="px-6 py-4 text-white/60 font-medium">Status</th>
                    <th className="px-6 py-4 text-white/60 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {caseStudies.map((caseStudy) => (
                    <tr key={caseStudy._id} className="border-t border-white/5 hover:bg-white/[0.02]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={normalizeImageUrl(caseStudy.thumbnail)}
                            alt={caseStudy.title}
                            className="w-10 h-10 rounded-lg object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40x40?text=No+Image';
                            }}
                          />
                          <div>
                            <p className="text-white font-medium truncate max-w-xs">{caseStudy.title}</p>
                            <p className="text-white/40 text-sm">{caseStudy.duration}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/80">{caseStudy.client}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-white/10 rounded-lg text-white/80 text-sm">
                          {caseStudy.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          caseStudy.published
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {caseStudy.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => togglePublish(caseStudy)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              caseStudy.published
                                ? 'text-green-400 hover:bg-green-500/20'
                                : 'text-yellow-400 hover:bg-yellow-500/20'
                            }`}
                            title={caseStudy.published ? 'Unpublish' : 'Publish'}
                          >
                            {caseStudy.published ? <EyeIcon className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => openModal(caseStudy)}
                            className="p-1.5 text-cyan-400 hover:bg-cyan-500/20 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setCaseStudyToDelete(caseStudy);
                              setShowDeleteModal(true);
                            }}
                            className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Pagination ────────────────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-white/[0.06] border border-white/10 text-white/60 hover:text-white hover:border-white/25 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 text-white/60">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-white/[0.06] border border-white/10 text-white/60 hover:text-white hover:border-white/25 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ── Add/Edit Modal ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-20 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#0d1526] border border-white/10 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-bold text-2xl text-white">
                    {editingCaseStudy ? 'Edit Case Study' : 'Add Case Study'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors"
                        placeholder="Case study title"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Client *</label>
                      <input
                        type="text"
                        value={formData.client}
                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                        className="w-full px-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors"
                        placeholder="Client name"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                      >
                        {CATEGORIES.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Duration</label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full px-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors"
                        placeholder="e.g., 3 months"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Icon</label>
                      <select
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        className="w-full px-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                      >
                        {ICONS.map((icon) => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Color</label>
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="w-full px-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors"
                        placeholder="from-blue-500 to-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Thumbnail</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files?.[0] || '' })}
                      className="w-full px-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-white file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-cyan-500 file:text-white hover:file:bg-cyan-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                    {formData.thumbnail && typeof formData.thumbnail === 'string' && (
                      <p className="text-white/60 text-sm mt-2">Current: {formData.thumbnail}</p>
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Overview *</label>
                    <textarea
                      value={formData.overview}
                      onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                      className="w-full px-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                      rows={3}
                      placeholder="Brief overview of the project"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Challenge</label>
                    <textarea
                      value={formData.challenge}
                      onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                      className="w-full px-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                      rows={3}
                      placeholder="The challenge faced"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Solution</label>
                    <textarea
                      value={formData.solution}
                      onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                      className="w-full px-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                      rows={3}
                      placeholder="The solution implemented"
                    />
                  </div>

                  {/* Results */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-4">Results</label>
                    <div className="space-y-3">
                      {formData.results.map((result, index) => (
                        <div key={index} className="flex gap-3">
                          <select
                            value={result.icon}
                            onChange={(e) => {
                              const newResults = [...formData.results];
                              newResults[index].icon = e.target.value;
                              setFormData({ ...formData, results: newResults });
                            }}
                            className="px-3 py-2 bg-white/[0.06] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                          >
                            {RESULT_ICONS.map((icon) => (
                              <option key={icon} value={icon}>{icon}</option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={result.label}
                            onChange={(e) => {
                              const newResults = [...formData.results];
                              newResults[index].label = e.target.value;
                              setFormData({ ...formData, results: newResults });
                            }}
                            className="flex-1 px-3 py-2 bg-white/[0.06] border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors text-sm"
                            placeholder="Label"
                          />
                          <input
                            type="text"
                            value={result.value}
                            onChange={(e) => {
                              const newResults = [...formData.results];
                              newResults[index].value = e.target.value;
                              setFormData({ ...formData, results: newResults });
                            }}
                            className="flex-1 px-3 py-2 bg-white/[0.06] border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors text-sm"
                            placeholder="Value"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Technologies</label>
                    <input
                      type="text"
                      value={formData.technologies.join(', ')}
                      onChange={(e) => setFormData({ ...formData, technologies: e.target.value.split(', ').filter(t => t.trim()) })}
                      className="w-full px-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors"
                      placeholder="React, Node.js, MongoDB"
                    />
                  </div>

                  {/* Testimonial */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Testimonial (Optional)</label>
                    <textarea
                      value={formData.testimonial?.text || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        testimonial: {
                          ...formData.testimonial,
                          text: e.target.value,
                          author: formData.testimonial?.author || '',
                          position: formData.testimonial?.position || '',
                          avatar: formData.testimonial?.avatar || '',
                        }
                      })}
                      className="w-full px-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                      rows={3}
                      placeholder="Client testimonial text"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      <input
                        type="text"
                        value={formData.testimonial?.author || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          testimonial: {
                            ...formData.testimonial,
                            text: formData.testimonial?.text || '',
                            author: e.target.value,
                            position: formData.testimonial?.position || '',
                            avatar: formData.testimonial?.avatar || '',
                          }
                        })}
                        className="px-3 py-2 bg-white/[0.06] border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors text-sm"
                        placeholder="Author name"
                      />
                      <input
                        type="text"
                        value={formData.testimonial?.position || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          testimonial: {
                            ...formData.testimonial,
                            text: formData.testimonial?.text || '',
                            author: formData.testimonial?.author || '',
                            position: e.target.value,
                            avatar: formData.testimonial?.avatar || '',
                          }
                        })}
                        className="px-3 py-2 bg-white/[0.06] border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors text-sm"
                        placeholder="Position"
                      />
                    </div>
                    <input
                      type="url"
                      value={formData.testimonial?.avatar || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        testimonial: {
                          ...formData.testimonial,
                          text: formData.testimonial?.text || '',
                          author: formData.testimonial?.author || '',
                          position: formData.testimonial?.position || '',
                          avatar: e.target.value,
                        }
                      })}
                      className="w-full px-3 py-2 mt-3 bg-white/[0.06] border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors text-sm"
                      placeholder="Avatar URL"
                    />
                  </div>

                  {/* Published */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="published"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="w-4 h-4 text-cyan-500 bg-white/[0.06] border border-white/10 rounded focus:ring-cyan-500 focus:ring-2"
                    />
                    <label htmlFor="published" className="text-white/80 text-sm font-medium">
                      Publish immediately
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white/60 hover:text-white transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium transition-all duration-200 shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Saving...' : (editingCaseStudy ? 'Update' : 'Create')}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.45 }}
              className="bg-[#0d1526] border border-white/10 rounded-2xl p-6 shadow-2xl w-full max-w-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="font-display font-bold text-white text-center text-lg mb-1">Delete Case Study?</h3>
              <p className="text-white/35 text-sm text-center mb-5">This action cannot be undone.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white/60 hover:text-white text-sm font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/25 text-red-400 hover:text-red-300 text-sm font-medium transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Success Modal ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.45 }}
              className="bg-[#0d1526] border border-white/10 rounded-2xl p-6 shadow-2xl w-full max-w-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="font-display font-bold text-white text-center text-lg mb-1">Success!</h3>
              <p className="text-white/60 text-sm text-center mb-5">{successMessage}</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm font-medium transition-all shadow-lg shadow-cyan-500/25"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CaseStudiesManagement;