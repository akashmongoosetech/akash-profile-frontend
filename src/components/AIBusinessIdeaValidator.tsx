/**
 * AI Business Idea Validator (India-Focused)
 * A React component that validates business ideas with India-specific market analysis
 * 
 * Features:
 * - Business idea description input
 * - Target location (City/State in India)
 * - Target audience input
 * - Estimated budget (INR)
 * - Industry type selection
 * - Revenue model (optional)
 * - Comprehensive validation report with viability score
 * - Loading state with spinner
 * - Error handling
 * - Copy to clipboard functionality
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, 
  Check, 
  Loader2, 
  Lightbulb, 
  AlertCircle, 
  MapPin, 
  Users, 
  DollarSign, 
  TrendingUp,
  Rocket,
  Target,
  Globe,
  ArrowRight,
  BookOpen,
  HelpCircle,
  CheckCircle
} from 'lucide-react';
import { validateBusinessIdea } from '../utils/aiApi';

const AIBusinessIdeaValidator: React.FC = () => {
  // Form state
  const [businessIdea, setBusinessIdea] = useState('');
  const [location, setLocation] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [budget, setBudget] = useState('');
  const [industryType, setIndustryType] = useState('');
  const [revenueModel, setRevenueModel] = useState('');
  
  // Response state
  const [validationResult, setValidationResult] = useState('');
  const [copied, setCopied] = useState(false);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Industry types
  const industryTypes = [
    { value: 'E-commerce', label: 'E-commerce & D2C', icon: '🛒' },
    { value: 'SaaS', label: 'SaaS & Software', icon: '☁️' },
    { value: 'Fintech', label: 'Fintech & Finance', icon: '💳' },
    { value: 'EdTech', label: 'EdTech & Education', icon: '📚' },
    { value: 'Healthcare', label: 'Healthcare & Wellness', icon: '🏥' },
    { value: 'Food & Beverage', label: 'Food & Beverage', icon: '🍔' },
    { value: 'Logistics', label: 'Logistics & Delivery', icon: '🚚' },
    { value: 'Real Estate', label: 'Real Estate', icon: '🏠' },
    { value: 'Manufacturing', label: 'Manufacturing', icon: '🏭' },
    { value: 'Services', label: 'Professional Services', icon: '💼' },
    { value: 'Other', label: 'Other', icon: '📦' },
  ];

  // Budget ranges
  const budgetRanges = [
    { value: 'Under ₹1 Lakh', label: 'Under ₹1 Lakh', description: 'Bootstrap/Micro business' },
    { value: '₹1 - ₹5 Lakhs', label: '₹1 - ₹5 Lakhs', description: 'Small business' },
    { value: '₹5 - ₹10 Lakhs', label: '₹5 - ₹10 Lakhs', description: 'Early stage' },
    { value: '₹10 - ₹25 Lakhs', label: '₹10 - ₹25 Lakhs', description: 'Growth stage' },
    { value: '₹25 - ₹50 Lakhs', label: '₹25 - ₹50 Lakhs', description: 'Scaling' },
    { value: '₹50 Lakhs - ₹1 Crore', label: '₹50 Lakhs - ₹1 Crore', description: 'Medium enterprise' },
    { value: 'Above ₹1 Crore', label: 'Above ₹1 Crore', description: 'Large enterprise' },
  ];

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!businessIdea.trim()) {
      setError('Please describe your business idea');
      return;
    }
    if (!location.trim()) {
      setError('Please enter target location');
      return;
    }
    if (!targetAudience.trim()) {
      setError('Please describe your target audience');
      return;
    }
    if (!budget) {
      setError('Please select estimated budget');
      return;
    }
    if (!industryType) {
      setError('Please select industry type');
      return;
    }

    setError('');
    setIsLoading(true);
    setValidationResult('');

    try {
      const result = await validateBusinessIdea(
        businessIdea,
        location,
        targetAudience,
        budget,
        industryType,
        revenueModel || undefined
      );
      setValidationResult(result.validation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate business idea');
    } finally {
      setIsLoading(false);
    }
  };

  // Copy result to clipboard
  const handleCopy = async () => {
    if (!validationResult) return;
    
    try {
      await navigator.clipboard.writeText(validationResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl mb-6">
            <Lightbulb className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
            AI Business Idea Validator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-auto">
            Validate-3xl mx your business idea with comprehensive India-specific market analysis, 
            competitor research, and viability scoring before investing your hard-earned money.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-indigo-500" />
              Enter Your Business Details
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Business Idea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Business Idea Description *
                </label>
                <textarea
                  value={businessIdea}
                  onChange={(e) => setBusinessIdea(e.target.value)}
                  placeholder="Describe your business idea in detail. What problem does it solve? How does it work?"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows={4}
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Location (City/State in India) *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Mumbai, Maharashtra or Bangalore, Karnataka"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Audience *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g., College students, Working professionals, Small businesses"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Budget & Industry Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estimated Budget (INR) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    >
                      <option value="">Select budget</option>
                      {budgetRanges.map((range) => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Industry Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Industry Type *
                  </label>
                  <select
                    value={industryType}
                    onChange={(e) => setIndustryType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select industry</option>
                    {industryTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Revenue Model (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Revenue Model (Optional)
                </label>
                <input
                  type="text"
                  value={revenueModel}
                  onChange={(e) => setRevenueModel(e.target.value)}
                  placeholder="e.g., Subscription, Commission, Advertising"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-600 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Validating Your Business Idea...
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5" />
                    Validate My Business Idea
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {validationResult ? (
              <>
                {/* Copy Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy to Clipboard
                      </>
                    )}
                  </button>
                </div>

                {/* Results */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-indigo-500" />
                    Validation Report
                  </h2>
                  
                  <div className="prose dark:prose-invert max-w-none">
                    {validationResult.split('\n').map((line, index) => {
                      const trimmedLine = line.trim();
                      if (trimmedLine.startsWith('# ')) {
                        return (
                          <h3 key={index} className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-6 mb-3">
                            {trimmedLine.replace('# ', '')}
                          </h3>
                        );
                      }
                      if (trimmedLine.startsWith('## ')) {
                        return (
                          <h4 key={index} className="text-lg font-semibold text-purple-600 dark:text-purple-400 mt-4 mb-2">
                            {trimmedLine.replace('## ', '')}
                          </h4>
                        );
                      }
                      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
                        return (
                          <li key={index} className="ml-4 text-gray-600 dark:text-gray-300">
                            {trimmedLine.replace(/^[-•]\s*/, '')}
                          </li>
                        );
                      }
                      if (trimmedLine.match(/^\d+\./)) {
                        return (
                          <p key={index} className="font-semibold text-gray-700 dark:text-gray-200 mt-4 mb-2">
                            {trimmedLine}
                          </p>
                        );
                      }
                      if (trimmedLine.length > 0) {
                        return (
                          <p key={index} className="text-gray-600 dark:text-gray-300 mb-2">
                            {trimmedLine}
                          </p>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </>
            ) : (
              /* Educational Content when no results */
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Why Validate Your Business Idea in India?
                </h2>
                
                <div className="space-y-6">
                  {/* Section 1: Introduction */}
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      <BookOpen className="w-5 h-5" />
                      What is a Business Idea Validator?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      A business idea validator is an AI-powered tool that analyzes your business concept 
                      against market realities, competition, regulatory requirements, and financial feasibility. 
                      It helps you identify potential pitfalls before investing significant capital.
                    </p>
                  </div>

                  {/* Section 2: Why Validation is Critical */}
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      <Globe className="w-5 h-5" />
                      Why Validation is Critical in India
                    </h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span><strong>Market Diversity:</strong> India spans Tier 1, 2, and 3 cities with vastly different consumer behaviors and purchasing power.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span><strong>Regulatory Challenges:</strong> GST, state-specific licenses, and FDI norms vary by industry and can impact your business model significantly.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span><strong>Funding Ecosystem:</strong> Investors require thorough market validation before committing capital in India's competitive startup landscape.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Section 3: How It Works */}
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      <Lightbulb className="w-5 h-5" />
                      How Our AI Validator Works
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Our AI analyzes millions of data points including market trends, competitor data, 
                      regulatory requirements, and financial benchmarks specific to the Indian market. 
                      It provides a comprehensive viability score (1-10) with clear recommendations.
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6">
                    <p className="text-gray-700 dark:text-gray-300 font-medium text-center">
                      Don't invest lakhs of rupees without validation!
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm text-center mt-2">
                      Fill in your business details on the left to get instant AI-driven insights.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-indigo-500" />
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white">Is this accurate for rural India?</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  Our AI considers data from both urban and rural markets. However, for very specific 
                  rural ventures, we recommend additional local market research.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white">Does it consider government schemes?</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  Yes, the validation includes information about relevant government schemes like 
                  Startup India, Mudra loans, and state-specific incentives.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white">Can I validate multiple ideas?</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  Absolutely! You can run multiple validations to compare different business concepts 
                  and choose the most viable one.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white">Is this better than market research?</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  Our AI provides a fast, cost-effective initial validation. For critical decisions, 
                  we recommend combining this with targeted market research.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white">Is the data real-time?</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  The AI uses training data up to its knowledge cutoff and may not reflect very recent 
                  market changes. Always verify critical information independently.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Use Cases Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-8 text-white"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Who Can Use This Tool?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl mb-3">🎓</div>
              <h4 className="font-semibold mb-2">College Students</h4>
              <p className="text-sm text-white/80">
                Validate a food delivery or tuition center idea before starting
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl mb-3">💻</div>
              <h4 className="font-semibold mb-2">Tech Founders</h4>
              <p className="text-sm text-white/80">
                Validate SaaS or AI startup ideas for the Indian market
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl mb-3">🛍️</div>
              <h4 className="font-semibold mb-2">D2C Founders</h4>
              <p className="text-sm text-white/80">
                Validate D2C brand ideas before inventory investment
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl mb-3">🏢</div>
              <h4 className="font-semibold mb-2">Freelancers</h4>
              <p className="text-sm text-white/80">
                Validate digital agency or consulting business ideas
              </p>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow">
            <Rocket className="w-5 h-5" />
            Validate your business idea before investing lakhs of rupees
            <ArrowRight className="w-5 h-5" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AIBusinessIdeaValidator;
