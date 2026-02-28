import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Calendar,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  Video,
  GraduationCap,
  Award,
  Users
} from 'lucide-react';
import { authenticatedFetch, normalizeImageUrl, isValidImageUrl } from '../utils/api';

interface Event {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  eventType: string;
  category: string;
  image: string;
  date: string;
  duration: number;
  location: string;
  price: number;
  currency: string;
  maxAttendees: number;
  currentAttendees: number;
  isFree: boolean;
  published: boolean;
  featured: boolean;
}

interface Registration {
  _id: string;
  eventId: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'attended';
  registeredAt: string;
}

const EventManagement: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPublished, setFilterPublished] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  // Registrations state
  const [showRegistrationsModal, setShowRegistrationsModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    shortDescription: '',
    eventType: 'webinar',
    category: '',
    image: '',
    date: '',
    duration: 60,
    location: 'Online',
    price: 0,
    currency: 'USD',
    maxAttendees: 0,
    published: false,
    featured: false
  });

  useEffect(() => {
    fetchEvents();
  }, [currentPage, filterPublished]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `/api/events/admin/all?page=${currentPage}&limit=10`;
      if (filterPublished !== null) {
        url += `&published=${filterPublished}`;
      }

      const response = await authenticatedFetch(url);
      const data = await response.json();

      if (data.success) {
        setEvents(data.data);
        setTotalPages(data.pagination.pages);
      } else {
        setError(data.message || 'Failed to fetch events');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        slug: event.slug,
        description: event.description,
        shortDescription: event.shortDescription,
        eventType: event.eventType,
        category: event.category,
        image: event.image,
        date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
        duration: event.duration,
        location: event.location,
        price: event.price,
        currency: event.currency,
        maxAttendees: event.maxAttendees,
        published: event.published,
        featured: event.featured
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: '',
        slug: '',
        description: '',
        shortDescription: '',
        eventType: 'webinar',
        category: '',
        image: '',
        date: '',
        duration: 60,
        location: 'Online',
        price: 0,
        currency: 'USD',
        maxAttendees: 0,
        published: false,
        featured: false
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEvent(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const eventData = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: formData.description,
        shortDescription: formData.shortDescription,
        eventType: formData.eventType,
        category: formData.category,
        image: formData.image,
        date: formData.date,
        duration: formData.duration,
        location: formData.location,
        price: formData.price,
        currency: formData.currency,
        maxAttendees: formData.maxAttendees,
        published: formData.published,
        featured: formData.featured
      };

      const url = editingEvent
        ? `/api/events/admin/${editingEvent._id}`
        : `/api/events/admin`;

      const method = editingEvent ? 'PUT' : 'POST';

      const response = await authenticatedFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });

      const data = await response.json();

      if (data.success) {
        closeModal();
        fetchEvents();
      } else {
        setError(data.message || 'Failed to save event');
      }
    } catch (err) {
      setError('Failed to save event');
      console.error('Error saving event:', err);
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (id: string) => {
    try {
      const response = await authenticatedFetch(`/api/events/admin/${id}/toggle-publish`, {
        method: 'PATCH'
      });
      const data = await response.json();
      if (data.success) {
        fetchEvents();
      }
    } catch (err) {
      console.error('Error toggling publish status:', err);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await authenticatedFetch(`/api/events/admin/${id}/toggle-featured`, {
        method: 'PATCH'
      });
      const data = await response.json();
      if (data.success) {
        fetchEvents();
      }
    } catch (err) {
      console.error('Error toggling featured status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await authenticatedFetch(`/api/events/admin/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setDeleteConfirm(null);
        fetchEvents();
      }
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const viewRegistrations = async (eventId: string) => {
    setSelectedEventId(eventId);
    setShowRegistrationsModal(true);
    setLoadingRegistrations(true);
    try {
      const response = await authenticatedFetch(`/api/events/admin/${eventId}/registrations`);
      const data = await response.json();
      if (data.success) {
        setRegistrations(data.data);
      }
    } catch (err) {
      console.error('Error fetching registrations:', err);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const updateRegistrationStatus = async (registrationId: string, status: string) => {
    try {
      const response = await authenticatedFetch(`/api/events/admin/registrations/${registrationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (data.success && selectedEventId) {
        viewRegistrations(selectedEventId);
      }
    } catch (err) {
      console.error('Error updating registration:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'webinar': return Video;
      case 'workshop': return GraduationCap;
      case 'conference': return Award;
      case 'office-hours': return Users;
      default: return Calendar;
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Event Management</h1>
          <p className="text-gray-400">Manage your events, webinars, and workshops</p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Event
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterPublished(null)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterPublished === null ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterPublished(true)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterPublished === true ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Published
          </button>
          <button
            onClick={() => setFilterPublished(false)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterPublished === false ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Draft
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Events Table */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No events found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Event</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Registrations</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredEvents.map((event) => {
                  const TypeIcon = getEventTypeIcon(event.eventType);
                  return (
                    <motion.tr
                      key={event._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-700/30"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {isValidImageUrl(event.image) ? (
                            <img
                              src={normalizeImageUrl(event.image)}
                              alt={event.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                              <TypeIcon className="w-6 h-6 text-white" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-white">{event.title}</p>
                            <p className="text-sm text-gray-400 truncate max-w-xs">{event.shortDescription}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300 capitalize">
                          <TypeIcon className="w-3 h-3" />
                          {event.eventType}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-300">
                        {event.date ? formatDate(event.date) : '-'}
                      </td>
                      <td className="px-4 py-4">
                        <span className={event.isFree ? 'text-green-400' : 'text-white'}>
                          {event.isFree ? 'Free' : `${event.currency} ${event.price}`}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => togglePublish(event._id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              event.published
                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                : 'bg-gray-600/20 text-gray-400 hover:bg-gray-600/30'
                            }`}
                            title={event.published ? 'Unpublish' : 'Publish'}
                          >
                            {event.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => toggleFeatured(event._id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              event.featured
                                ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                                : 'bg-gray-600/20 text-gray-400 hover:bg-gray-600/30'
                            }`}
                            title={event.featured ? 'Unfeature' : 'Feature'}
                          >
                            {event.featured ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => viewRegistrations(event._id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors text-sm"
                          title="View Registrations"
                        >
                          <Users className="w-4 h-4" />
                          {event.currentAttendees || 0}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openModal(event)}
                            className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(event._id)}
                            className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  {editingEvent ? 'Edit Event' : 'Create New Event'}
                </h2>
                <button onClick={closeModal} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-300" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Event Type *</label>
                    <select
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="webinar">Webinar</option>
                      <option value="workshop">Workshop</option>
                      <option value="office-hours">Office Hours</option>
                      <option value="conference">Conference</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Short Description *</label>
                  <textarea
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    required
                    rows={2}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Date & Time *</label>
                    <input
                      type="datetime-local"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Duration (minutes)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      min={1}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Price (0 for free)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      min={0}
                      step="0.01"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Max Attendees (0 for unlimited)</label>
                    <input
                      type="number"
                      value={formData.maxAttendees}
                      onChange={(e) => setFormData({ ...formData, maxAttendees: parseInt(e.target.value) })}
                      min={0}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-300">Published</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-300">Featured</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-800 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-2">Delete Event?</h3>
              <p className="text-gray-400 mb-6">This action cannot be undone. Are you sure you want to delete this event?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Registrations Modal */}
      <AnimatePresence>
        {showRegistrationsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowRegistrationsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  Event Registrations
                </h2>
                <button onClick={() => setShowRegistrationsModal(false)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-300" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                {loadingRegistrations ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
                  </div>
                ) : registrations.length === 0 ? (
                  <div className="text-center py-10">
                    <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No registrations yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {registrations.map((reg) => (
                      <div key={reg._id} className="p-4 bg-gray-700/50 rounded-xl">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-white">{reg.fullName}</p>
                            <p className="text-sm text-gray-400">{reg.email}</p>
                            {reg.company && <p className="text-sm text-gray-400">{reg.company}</p>}
                            {reg.jobTitle && <p className="text-sm text-gray-400">{reg.jobTitle}</p>}
                            {reg.phone && <p className="text-sm text-gray-400">{reg.phone}</p>}
                            <p className="text-xs text-gray-500 mt-2">
                              Registered: {new Date(reg.registeredAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={reg.status}
                              onChange={(e) => updateRegistrationStatus(reg._id, e.target.value)}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                reg.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                                reg.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                reg.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                                'bg-blue-500/20 text-blue-400'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="attended">Attended</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                        {reg.notes && (
                          <p className="text-sm text-gray-400 mt-2 italic">Note: {reg.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventManagement;
