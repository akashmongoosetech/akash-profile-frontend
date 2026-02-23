import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Copy, Check, AlertCircle, Sparkles, Search, Users, Building, Award, TrendingUp, Palette, Rocket } from 'lucide-react';
import { generateClinicContent } from '../utils/aiApi';

const AIClinicWebsiteContentGenerator: React.FC = () => {
  const [clinicName, setClinicName] = useState('');
  const [specialty, setSpecialty] = useState('General Practice');
  const [location, setLocation] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [servicesOffered, setServicesOffered] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [tone, setTone] = useState('Professional');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const specialties = [
    'General Practice',
    'Cardiology',
    'Dermatology',
    'Orthopedics',
    'Pediatrics',
    'Neurology',
    'Gynecology',
    'Ophthalmology',
    'ENT',
    'Dental',
    'Psychiatry',
    'Physiotherapy',
    'Multispecialty'
  ];

  const tones = ['Professional', 'Friendly', 'Premium', 'Community-focused'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clinicName.trim() || !specialty.trim() || !location.trim()) {
      setError('Please fill in required fields: Clinic Name, Specialty, and Location');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await generateClinicContent(
        clinicName,
        specialty,
        location,
        yearsExperience,
        servicesOffered,
        targetAudience,
        tone
      );
      setResult(response.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate clinic content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 mb-4">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            AI Clinic Website Content Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
            Generate SEO-optimized, professional website content for your medical clinic instantly
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-500" />
              Clinic Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Clinic Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Clinic Name *
                </label>
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  placeholder="e.g., City Health Clinic"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Specialty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Specialty *
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  {specialties.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Downtown, New York"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Years of Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Years of Experience
                </label>
                <input
                  type="text"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  placeholder="e.g., 15+ years"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Services Offered */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Services Offered
                </label>
                <textarea
                  value={servicesOffered}
                  onChange={(e) => setServicesOffered(e.target.value)}
                  placeholder="List your main services...

Example: General Checkups, Vaccination, Lab Tests, X-Ray, Health Screening, Chronic Disease Management"
                  className="w-full h-32 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g., Families, Seniors, Athletes, Working professionals"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Tone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content Tone
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {tones.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(t)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                        tone === t
                          ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !clinicName.trim() || !specialty.trim() || !location.trim()}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating Content...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Website Content
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Output Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-teal-500" />
                Generated Content
              </h2>
              {result && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>

            {!result && !loading && (
              <div className="h-96 flex items-center justify-center text-gray-400 dark:text-gray-500">
                <div className="text-center">
                  <Globe className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Generated content will appear here</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Generating SEO-optimized content...</p>
                </div>
              </div>
            )}

            {result && (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 max-h-[600px] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                  {result}
                </pre>
              </div>
            )}
          </motion.div>
        </div>

        {/* Educational Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">
              Building Your Medical Practice Online
            </h2>

            {/* Why Clinics Need Professional Websites */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-teal-500 mb-3 flex items-center gap-2">
                <Building className="w-5 h-5" />
                Why Clinics Need Professional Websites
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Patient Trust</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    A professional website builds credibility and trust with potential patients researching healthcare options.
                  </p>
                </div>
                <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Online Visibility</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Most patients search online for healthcare providers. Your website ensures you're found.
                  </p>
                </div>
                <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Local SEO</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Appear in local search results when patients look for clinics in your area.
                  </p>
                </div>
                <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Appointment Conversions</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Easy-to-find contact info and service descriptions convert visitors into patients.
                  </p>
                </div>
              </div>
            </div>

            {/* Medical SEO Importance */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-teal-500 mb-3 flex items-center gap-2">
                <Search className="w-5 h-5" />
                Medical SEO Importance
              </h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Google Ranking</strong> - Higher visibility in search results leads to more patient inquiries</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Local Search Visibility</strong> - Appear in "near me" searches and Google Maps</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Specialty Keywords</strong> - Rank for specific treatments and conditions you offer</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Patient Education</strong> - Quality content signals expertise to search engines</span>
                </li>
              </ul>
            </div>

            {/* How AI Generates Content */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-teal-500 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                How AI Generates Clinic Content
              </h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-teal-500 text-white flex items-center justify-center mx-auto mb-3 font-bold">1</div>
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Context Mapping</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Analyzes clinic details and specialty</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-teal-500 text-white flex items-center justify-center mx-auto mb-3 font-bold">2</div>
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Tone Adaptation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Adjusts writing style to match preference</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-teal-500 text-white flex items-center justify-center mx-auto mb-3 font-bold">3</div>
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">SEO Optimization</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Incorporates location-based keywords</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-teal-500 text-white flex items-center justify-center mx-auto mb-3 font-bold">4</div>
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Section Generation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Creates all website sections at once</p>
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-teal-500 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Use Cases
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <Rocket className="w-8 h-8 text-teal-500 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">New Clinic Launch</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Quickly create professional web presence</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <Palette className="w-8 h-8 text-teal-500 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Website Redesign</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Refresh outdated website content</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <Building className="w-8 h-8 text-teal-500 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Multispecialty Hospital</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Generate content for multiple departments</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <Award className="w-8 h-8 text-teal-500 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Dental Practice</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Create patient-friendly dental content</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Example Output */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-teal-500 mb-3">Example Output</h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-4">
                <div>
                  <h4 className="font-medium text-teal-600 dark:text-teal-400 mb-2">Homepage Hero Section</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    "Your Trusted Healthcare Partner in [Location]. Expert Medical Care for You and Your Family. Book Your Appointment Today."
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-teal-600 dark:text-teal-400 mb-2">SEO Meta Title</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    "[Clinic Name] | Best [Specialty] Care in [Location] | Expert Doctors"
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-teal-600 dark:text-teal-400 mb-2">SEO Meta Description</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    "Looking for expert [specialty] care in [location]? [Clinic Name] offers comprehensive healthcare services with experienced specialists. Book your appointment today."
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-teal-500 mb-3">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <details className="group bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <summary className="cursor-pointer p-4 font-medium text-gray-800 dark:text-white flex items-center justify-between">
                    Is the content SEO optimized?
                    <span className="transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-600 dark:text-gray-300 text-sm">
                    Yes, all generated content includes SEO-friendly keywords, meta titles, and meta descriptions optimized for local search.
                  </div>
                </details>
                <details className="group bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <summary className="cursor-pointer p-4 font-medium text-gray-800 dark:text-white flex items-center justify-between">
                    Can I edit the generated text?
                    <span className="transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-600 dark:text-gray-300 text-sm">
                    Absolutely! The generated content is a starting point. You can edit, customize, and refine it to match your brand voice perfectly.
                  </div>
                </details>
                <details className="group bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <summary className="cursor-pointer p-4 font-medium text-gray-800 dark:text-white flex items-center justify-between">
                    Does it include keywords for my specialty?
                    <span className="transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-600 dark:text-gray-300 text-sm">
                    Yes, the AI automatically incorporates relevant medical keywords and location-based terms throughout the content.
                  </div>
                </details>
                <details className="group bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <summary className="cursor-pointer p-4 font-medium text-gray-800 dark:text-white flex items-center justify-between">
                    Is the content unique?
                    <span className="transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-600 dark:text-gray-300 text-sm">
                    Yes, each piece of content is generated uniquely based on your specific clinic information and requirements.
                  </div>
                </details>
                <details className="group bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <summary className="cursor-pointer p-4 font-medium text-gray-800 dark:text-white flex items-center justify-between">
                    Can I generate different versions?
                    <span className="transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-600 dark:text-gray-300 text-sm">
                    Yes! Simply adjust your inputs (tone, specialty, etc.) and generate new content. You can create multiple versions and choose the best one.
                  </div>
                </details>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Launch Your Clinic Website Content</h3>
              <p className="text-teal-100 mb-4">Create professional, SEO-optimized content in minutes</p>
              <button
                onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 bg-white text-teal-600 font-semibold rounded-lg hover:bg-teal-50 transition-colors"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AIClinicWebsiteContentGenerator;
