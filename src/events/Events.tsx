import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { isValidImageUrl, normalizeImageUrl } from '../utils/api';
import { formatDate, formatTime, formatDuration } from '../utils/format';
import { eventTypeConfig } from '../constants/eventConfig';
import { useDebounce } from '../hooks/useDebounce';

interface Event {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  eventType: 'webinar' | 'workshop' | 'office-hours' | 'conference';
  category: string;
  image: string;
  videoUrl: string;
  host: {
    name: string;
    title: string;
    image: string;
    shortDescription: string;
  };
  date: string;
  endDate?: string;
  duration: number;
  timezone: string;
  location: string;
  meetingLink: string;
  registrationLink: string;
  price: number;
  currency: string;
  maxAttendees: number;
  currentAttendees: number;
  isFree: boolean;
  published: boolean;
  featured: boolean;
  tags: string[];
  agenda: Array<{
    time: string;
    title: string;
    description?: string;
    speaker?: string;
  }>;
  prerequisites: string[];
  whatYouWillLearn: string[];
  isUpcoming: boolean;
  isSoldOut: boolean;
}

function EventCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700" />
      <div className="p-6 space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
        </div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-full" />
      </div>
    </div>
  );
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [copied, setCopied] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const abortRef = useRef<AbortController | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchEvents = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setLoading(true);
      setError(null);

      const url = `${import.meta.env.VITE_API_BASE_URL}/api/events?limit=50${selectedType ? `&eventType=${selectedType}` : ''}`;

      const response = await fetch(url, { signal: controller.signal });
      const data = await response.json();

      if (data.success) {
        setEvents(data.data);
      } else {
        setError(data.message || 'Failed to fetch events');
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError('Failed to connect to server');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedType]);

  useEffect(() => {
    fetchEvents();
    return () => abortRef.current?.abort();
  }, [fetchEvents]);

  const filteredEvents = useMemo(() => {
    const now = new Date();
    return events.filter(event => {
      const matchesPast = showPastEvents
        ? new Date(event.date) < now
        : new Date(event.date) >= now;
      if (!matchesPast) return false;

      if (!debouncedSearch) return true;
      const q = debouncedSearch.toLowerCase();
      return (
        event.title.toLowerCase().includes(q) ||
        event.shortDescription.toLowerCase().includes(q)
      );
    });
  }, [events, showPastEvents, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / pageSize));
  const paginatedEvents = filteredEvents.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => { setPage(1); }, [showPastEvents, debouncedSearch, selectedType]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback ignored
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Events & Webinars | Akash</title>
        <meta name="description" content="Join our webinars, workshops, and live sessions. Learn from industry experts and level up your skills." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Events & Webinars
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join our live sessions, workshops, and expert-led webinars.
              Learn, connect, and grow with industry professionals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white dark:bg-gray-800 shadow-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
            {/* Event Type Filter */}
            <div className="relative overflow-hidden">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap snap-x snap-mandatory" role="group" aria-label="Event type filter" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <button
                onClick={() => setSelectedType('')}
                aria-pressed={selectedType === ''}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedType === ''
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                All Events
              </button>
              {Object.entries(eventTypeConfig).map(([type, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    aria-pressed={selectedType === type}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                      selectedType === type
                        ? `bg-gradient-to-r ${config.color} text-white`
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {config.label}
                  </button>
                );
              })}
            </div>
            </div>

            {/* Past/Upcoming Toggle & Search */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-full p-1" role="group" aria-label="Event time filter">
                <button
                  onClick={() => setShowPastEvents(false)}
                  aria-pressed={!showPastEvents}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    !showPastEvents
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setShowPastEvents(true)}
                  aria-pressed={showPastEvents}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    showPastEvents
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Past Events
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search events"
                  className="pl-10 pr-9 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                onClick={handleShare}
                className="px-3 py-2 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                aria-label="Copy link to clipboard"
              >
                {copied ? 'Copied!' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20" role="alert">
            <p className="text-red-500 text-lg">{error}</p>
            <button
              onClick={fetchEvents}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredEvents.length === 0 && debouncedSearch ? (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No Matching Events
            </h3>
            <p className="text-gray-500 dark:text-gray-500 mb-4">
              No events match "{debouncedSearch}". Try a different search term.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No Events Found
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              {showPastEvents
                ? 'No past events available. Check back later!'
                : 'No upcoming events scheduled. Stay tuned!'}
            </p>
          </div>
        ) : (
          <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {paginatedEvents.map((event) => {
              const config = eventTypeConfig[event.eventType];
              const Icon = config.icon;
              const isPast = new Date(event.date) < new Date();

              return (
                <motion.div
                  key={event._id}
                  variants={itemVariants}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
                >
                  {/* Event Image */}
                  <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                    {isValidImageUrl(event.image) ? (
                      <img
                        src={normalizeImageUrl(event.image)}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                        <Icon className="w-16 h-16 text-white/50" />
                      </div>
                    )}

                    {/* Event Type Badge */}
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${config.color}`}>
                      {config.label}
                    </div>

                    {/* Featured Badge */}
                    {event.featured && (
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium text-white bg-yellow-500">
                        Featured
                      </div>
                    )}

                    {/* Past Event Overlay */}
                    {isPast && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium">
                          Event Ended
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    {/* Date & Time */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {event.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {event.shortDescription}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(event.date)} &bull; {formatDuration(event.duration)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      {event.host && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Users className="w-4 h-4" />
                          <span>Hosted by {event.host.name}</span>
                        </div>
                      )}
                      {event.maxAttendees > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Users className="w-4 h-4" />
                          <span>{event.currentAttendees}/{event.maxAttendees} registered</span>
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-lg font-bold ${
                        event.isFree ? 'text-green-500' : 'text-blue-600 dark:text-blue-400'
                      }`}>
                        {event.isFree ? 'Free' : `${event.currency} ${event.price}`}
                      </span>
                      {event.isSoldOut && (
                        <span className="text-sm font-medium text-red-500">
                          Sold Out
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    <Link
                      to={`/events/${event.slug}`}
                      className={`block w-full text-center py-3 rounded-xl font-medium transition-all bg-gradient-to-r ${config.color} text-white hover:opacity-90`}
                    >
                      {isPast
                        ? 'View Recording'
                        : event.isSoldOut
                          ? 'Join Waitlist'
                          : event.registrationLink
                            ? 'Register Now'
                            : 'Learn More'}
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-30"
                style={{
                  background: page === 1 ? 'rgba(255,255,255,0.03)' : 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: page === 1 ? 'rgba(255,255,255,0.3)' : '#60a5fa'
                }}
              >
                Previous
              </button>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Space Mono', monospace" }}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-30"
                style={{
                  background: page === totalPages ? 'rgba(255,255,255,0.03)' : 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: page === totalPages ? 'rgba(255,255,255,0.3)' : '#60a5fa'
                }}
              >
                Next
              </button>
            </div>
          )}
          </>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Want to Stay Updated?
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Subscribe to our newsletter to get notified about upcoming events and exclusive sessions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="px-8 py-3 bg-white text-blue-600 rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              to="/tools"
              className="px-8 py-3 bg-white/20 text-white rounded-full font-medium hover:bg-white/30 transition-colors"
            >
              Explore AI Tools
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;
