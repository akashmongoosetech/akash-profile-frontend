import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  GraduationCap,
  Award,
  ArrowLeft,
  ExternalLink,
  Play,
  CheckCircle,
  Share2,
  Globe,
  User,
  Loader2,
  X,
  Mail,
  Phone,
  Building,
  Briefcase,
  FileText,
  Check
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { isValidImageUrl, normalizeImageUrl } from '../utils/api';

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

const eventTypeConfig = {
  webinar: {
    icon: Video,
    label: 'Webinar',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30'
  },
  workshop: {
    icon: GraduationCap,
    label: 'Workshop',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30'
  },
  'office-hours': {
    icon: Users,
    label: 'Office Hours',
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30'
  },
  conference: {
    icon: Award,
    label: 'Conference',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30'
  }
};

const EventDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
   // Registration state
  const [showRegistration, setShowRegistration] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    notes: ''
  });

  useEffect(() => {
    if (slug) {
      fetchEvent(slug);
    }
  }, [slug]);

  const fetchEvent = async (eventSlug: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/events/slug/${eventSlug}`);
      const data = await response.json();

      if (data.success) {
        setEvent(data.data);
      } else {
        setError(data.message || 'Event not found');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error fetching event:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  const shareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.shortDescription,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    setRegistering(true);
    setRegistrationError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/events/register/${event._id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        }
      );
      const data = await response.json();

      if (data.success) {
        setRegistrationSuccess(true);
        // Update the attendee count
        setEvent(prev => prev ? { ...prev, currentAttendees: prev.currentAttendees + 1 } : null);
      } else {
        setRegistrationError(data.message || 'Registration failed');
      }
    } catch (err) {
      setRegistrationError('Failed to register. Please try again.');
      console.error('Error registering:', err);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Event Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error || 'The event you are looking for does not exist.'}</p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const config = eventTypeConfig[event.eventType];
  const Icon = config.icon;
  const isPastEvent = new Date(event.date) < new Date();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>{event.title} | Events</title>
        <meta name="description" content={event.shortDescription} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] bg-gray-900 overflow-hidden">
        {isValidImageUrl(event.image) ? (
          <img
            src={normalizeImageUrl(event.image)}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${config.color} flex items-center justify-center`}>
            <Icon className="w-24 h-24 text-white/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative -mt-32 z-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
              >
                {/* Event Type Badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r ${config.color} mb-4`}>
                  <Icon className="w-4 h-4" />
                  {config.label}
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {event.title}
                </h1>

                {/* Short Description */}
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  {event.shortDescription}
                </p>

                {/* Event Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDate(event.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <Clock className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatTime(event.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {event.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <Users className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDuration(event.duration)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    About This Event
                  </h2>
                  <div 
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: event.description }}
                  />
                </div>

                {/* What You'll Learn */}
                {event.whatYouWillLearn && event.whatYouWillLearn.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      What You'll Learn
                    </h2>
                    <ul className="space-y-3">
                      {event.whatYouWillLearn.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Prerequisites */}
                {event.prerequisites && event.prerequisites.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Prerequisites
                    </h2>
                    <ul className="space-y-2">
                      {event.prerequisites.map((item, index) => (
                        <li key={index} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Agenda */}
                {event.agenda && event.agenda.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Event Agenda
                    </h2>
                    <div className="space-y-4">
                      {event.agenda.map((item, index) => (
                        <div key={index} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                          <div className="flex-shrink-0 w-20 text-sm font-medium text-blue-600 dark:text-blue-400">
                            {item.time}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {item.title}
                            </h3>
                            {item.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                                {item.description}
                              </p>
                            )}
                            {item.speaker && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Speaker: {item.speaker}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Registration Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <div className="text-center mb-6">
                    <span className={`text-3xl font-bold ${
                      event.isFree ? 'text-green-500' : 'text-blue-600 dark:text-blue-400'
                    }`}>
                      {event.isFree ? 'Free' : `${event.currency} ${event.price}`}
                    </span>
                    {event.maxAttendees > 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {event.currentAttendees}/{event.maxAttendees} registered
                      </p>
                    )}
                  </div>

                  {registrationSuccess ? (
                    <div className="text-center py-4">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-green-500" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Registration Successful!
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Thank you for registering. Check your email for confirmation.
                      </p>
                    </div>
                  ) : isPastEvent ? (
                    event.videoUrl ? (
                      <a
                        href={event.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                      >
                        <Play className="w-5 h-5" />
                        Watch Recording
                      </a>
                    ) : (
                      <div className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-xl font-medium text-center">
                        Recording Not Available
                      </div>
                    )
                  ) : event.isSoldOut ? (
                    <button
                      disabled
                      className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-xl font-medium cursor-not-allowed"
                    >
                      Sold Out
                    </button>
                  ) : event.registrationLink ? (
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                    >
                      Register Now
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowRegistration(!showRegistration)}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                      >
                        {showRegistration ? 'Cancel' : 'Register Now'}
                      </button>

                      {/* Inline Registration Form */}
                      <AnimatePresence>
                        {showRegistration && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 overflow-hidden"
                          >
                            <form onSubmit={handleRegister} className="space-y-4">
                              {registrationError && (
                                <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm">
                                  {registrationError}
                                </div>
                              )}

                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Full Name *
                                </label>
                                <div className="relative">
                                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                  <input
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="John Doe"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Email *
                                </label>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                  <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="john@example.com"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Phone
                                </label>
                                <div className="relative">
                                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                  <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="+1 234 567 8900"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Company
                                </label>
                                <div className="relative">
                                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                  <input
                                    type="text"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Acme Inc."
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Job Title
                                </label>
                                <div className="relative">
                                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                  <input
                                    type="text"
                                    value={formData.jobTitle}
                                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Software Engineer"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Notes
                                </label>
                                <div className="relative">
                                  <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                  <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    rows={2}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Any special requirements..."
                                  />
                                </div>
                              </div>

                              <button
                                type="submit"
                                disabled={registering}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                              >
                                {registering ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Registering...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4" />
                                    Confirm Registration
                                  </>
                                )}
                              </button>
                            </form>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={shareEvent}
                      className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>

                {/* Host Info */}
                {event.host && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Host Information
                    </h3>
                    <div className="flex items-center gap-4">
                      {isValidImageUrl(event.host.image) ? (
                        <img
                          src={normalizeImageUrl(event.host.image)}
                          alt={event.host.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="w-8 h-8 text-white" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {event.host.name}
                        </p>
                        {event.host.title && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {event.host.title}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Event Details */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Event Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{event.timezone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    {event.category && (
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                        <Award className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{event.category}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventDetail;
