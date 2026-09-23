import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_BASE_URL, normalizeHtmlImageSources, normalizeImageUrl, stripHtmlTags } from '../utils/api';
import {
  ArrowLeft,
  ArrowRight,
  Code,
  Palette,
  Database,
  Cloud,
  Smartphone,
  TrendingUp,
  Target,
  Users,
  Star,
  Clock,
  Lightbulb,
  Rocket,
} from 'lucide-react';

interface CaseStudy {
  _id: string;
  title: string;
  slug: string;
  category: string;
  client: string;
  duration: string;
  thumbnail: string;
  color: string;
  icon: string;
  overview: string;
  challenge: string;
  solution: string;
  results: { label: string; value: string; icon: string }[];
  technologies: string[];
  testimonial?: {
    text: string;
    author: string;
    position: string;
    avatar: string;
  };
  published: boolean;
}

const CaseStudyDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [related, setRelated] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ElementType } = {
      Code,
      Palette,
      Database,
      Cloud,
      Smartphone,
      TrendingUp,
      Target,
      Users,
      Star,
      Clock,
    };
    return iconMap[iconName] || Code;
  };

  const fetchRelated = useCallback(async (category: string, excludeId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/case-studies/public`);
      const data = await response.json();
      if (data.success) {
        const filtered = (data.caseStudies || [])
          .filter((c: CaseStudy) => c._id !== excludeId && c.category === category)
          .slice(0, 3);
        setRelated(filtered);
      }
    } catch {
      /* ignore related fetch errors */
    }
  }, []);

  const fetchCaseStudy = useCallback(async (caseSlug: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/case-studies/slug/${caseSlug}`, {
        signal: controller.signal,
      });
      const data = await response.json();
      if (data.success && data.caseStudy) {
        setCaseStudy(data.caseStudy);
        fetchRelated(data.caseStudy.category, data.caseStudy._id);
      } else {
        setError(data.message || 'Case study not found');
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      console.error('Error fetching case study:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  }, [fetchRelated]);

  useEffect(() => {
    if (slug) fetchCaseStudy(slug);
    return () => abortRef.current?.abort();
  }, [slug, fetchCaseStudy]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 pt-14 sm:pt-16">
        <div className="text-white text-xl">Loading case study...</div>
      </div>
    );
  }

  if (error || !caseStudy) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 px-4 pt-14 sm:pt-16">
        <h1 className="text-3xl font-bold text-white mb-4">Case study not found</h1>
        <p className="text-gray-400 mb-8">{error || 'This case study does not exist.'}</p>
        <Link
          to="/case-studies"
          className="inline-flex items-center px-6 py-3 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Case Studies
        </Link>
      </div>
    );
  }

  const plainOverview = stripHtmlTags(caseStudy.overview);

  return (
    <>
      <Helmet>
        <title>{`${caseStudy.title} | Case Study`}</title>
        <meta name="description" content={plainOverview.substring(0, 160)} />
        <link rel="canonical" href={`${window.location.origin}/case-studies/${caseStudy.slug}`} />
      </Helmet>

      <div className="min-h-screen bg-gray-900 pt-14 sm:pt-16">
        {/* Hero */}
        <div className="max-w-5xl mx-auto px-4 pt-8">
          <Link
            to="/case-studies"
            className="inline-flex items-center text-gray-300 hover:text-white mb-5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            All Case Studies
          </Link>
          <div className="relative h-[320px] md:h-[420px] overflow-hidden rounded-3xl border border-white/10">
            <img
              src={normalizeImageUrl(caseStudy.thumbnail)}
              alt={caseStudy.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://placehold.co/1200x600/1e293b/475569?text=No+Image';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-gray-900/20" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium mb-3 backdrop-blur">
                {caseStudy.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{caseStudy.title}</h1>
              <div className="flex items-center gap-2 text-gray-300">
                <span>{caseStudy.client}</span>
                <span>•</span>
                <span>{caseStudy.duration}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
                Overview
              </h2>
              <div
                className="blog-content text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: normalizeHtmlImageSources(caseStudy.overview) }}
              />
            </div>

            {caseStudy.challenge && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6 text-red-400" />
                  The Challenge
                </h2>
                <div
                  className="blog-content text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: normalizeHtmlImageSources(caseStudy.challenge) }}
                />
              </div>
            )}

            {caseStudy.solution && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Rocket className="w-6 h-6 text-green-400" />
                  The Solution
                </h2>
                <div
                  className="blog-content text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: normalizeHtmlImageSources(caseStudy.solution) }}
                />
              </div>
            )}

            {caseStudy.results && caseStudy.results.filter((r) => r.value?.trim() || r.label?.trim()).length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">Results & Impact</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                    {caseStudy.results.filter((r) => r.value?.trim() || r.label?.trim()).length} outcomes
                  </span>
                </div>
                <div className="h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400 mb-6" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {caseStudy.results
                    .filter((r) => r.value?.trim() || r.label?.trim())
                    .map((result, index) => {
                      const IconComponent = getIconComponent(result.icon);
                      const accents = [
                        { text: 'text-blue-400', tile: 'from-blue-500/25 to-blue-500/5 border-blue-500/30', glow: 'group-hover:shadow-blue-500/20', hairline: 'from-blue-500 to-transparent' },
                        { text: 'text-purple-400', tile: 'from-purple-500/25 to-purple-500/5 border-purple-500/30', glow: 'group-hover:shadow-purple-500/20', hairline: 'from-purple-500 to-transparent' },
                        { text: 'text-emerald-400', tile: 'from-emerald-500/25 to-emerald-500/5 border-emerald-500/30', glow: 'group-hover:shadow-emerald-500/20', hairline: 'from-emerald-500 to-transparent' },
                        { text: 'text-amber-400', tile: 'from-amber-500/25 to-amber-500/5 border-amber-500/30', glow: 'group-hover:shadow-amber-500/20', hairline: 'from-amber-500 to-transparent' },
                      ];
                      const accent = accents[index % accents.length];
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.08, duration: 0.4 }}
                          className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gray-900/60 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-xl ${accent.glow}`}
                        >
                          <div className={`absolute top-0 left-0 h-0.5 w-full bg-gradient-to-r ${accent.hairline}`} />
                          <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border bg-gradient-to-br ${accent.tile}`}>
                            <IconComponent className={`h-5 w-5 ${accent.text}`} />
                          </div>
                          {result.value?.trim() && (
                            <div className="break-words text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                              {result.value}
                            </div>
                          )}
                          {result.label?.trim() && (
                            <div className="mt-1 break-words text-sm leading-snug text-gray-400">
                              {result.label}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                </div>
              </div>
            )}

            {caseStudy.technologies && caseStudy.technologies.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">Technologies Used</h2>
                <div className="flex flex-wrap gap-2">
                  {caseStudy.technologies.map((tech, index) => (
                    <span key={index} className="px-4 py-2 rounded-full bg-white/10 text-gray-300 text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {caseStudy.testimonial && caseStudy.testimonial.text && (
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-white/10 mb-10">
                <div className="flex items-start gap-4">
                  {caseStudy.testimonial.avatar && (
                    <img
                      src={normalizeImageUrl(caseStudy.testimonial.avatar)}
                      alt={caseStudy.testimonial.author}
                      className="w-14 h-14 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://placehold.co/100x100/1e293b/475569?text=No+Image';
                      }}
                    />
                  )}
                  <div>
                    <p className="text-gray-300 italic mb-3">"{caseStudy.testimonial.text}"</p>
                    <div className="text-white font-semibold">{caseStudy.testimonial.author}</div>
                    <div className="text-gray-400 text-sm">{caseStudy.testimonial.position}</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-white mb-6">Related Case Studies</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((item) => (
                  <Link
                    key={item._id}
                    to={`/case-studies/${item.slug}`}
                    className="group bg-gray-900/50 rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all"
                  >
                    <div className="h-40 overflow-hidden">
                      <img
                        src={normalizeImageUrl(item.thumbnail)}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://placehold.co/600x300/1e293b/475569?text=No+Image';
                        }}
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-white font-bold group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h3>
                      <div className="mt-3 flex items-center text-blue-400 text-sm font-medium">
                        View Case Study
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CaseStudyDetail;
