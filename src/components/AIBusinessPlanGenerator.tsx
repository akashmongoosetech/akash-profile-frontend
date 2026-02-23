/**
 * AI Business Plan Generator
 * A React component that generates comprehensive business plans with PDF export
 * 
 * Features:
 * - Business name and description
 * - Industry and location
 * - Funding required
 * - Target market and revenue model
 * - Comprehensive business plan output
 * - Download as PDF functionality
 * - Loading state with spinner
 * - Error handling
 * - Copy to clipboard functionality
 */

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, 
  Check, 
  Loader2, 
  FileText, 
  AlertCircle, 
  Building2, 
  MapPin, 
  DollarSign, 
  Users,
  Download,
  Printer,
  ArrowRight,
  BookOpen,
  HelpCircle,
  CheckCircle,
  Briefcase,
  Target,
  Rocket,
  Globe
} from 'lucide-react';
import { generateBusinessPlan } from '../utils/aiApi';

const AIBusinessPlanGenerator: React.FC = () => {
  // Form state
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [fundingRequired, setFundingRequired] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const [revenueModel, setRevenueModel] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  
  // Response state
  const [businessPlan, setBusinessPlan] = useState('');
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Industry types
  const industries = [
    { value: 'SaaS', label: 'SaaS & Software', icon: '☁️' },
    { value: 'E-commerce', label: 'E-commerce & D2C', icon: '🛒' },
    { value: 'Fintech', label: 'Fintech', icon: '💳' },
    { value: 'EdTech', label: 'EdTech & Education', icon: '📚' },
    { value: 'Healthcare', label: 'Healthcare', icon: '🏥' },
    { value: 'FoodTech', label: 'FoodTech', icon: '🍔' },
    { value: 'Logistics', label: 'Logistics', icon: '🚚' },
    { value: 'AI/ML', label: 'AI & Machine Learning', icon: '🤖' },
    { value: 'Manufacturing', label: 'Manufacturing', icon: '🏭' },
    { value: 'Services', label: 'Professional Services', icon: '💼' },
    { value: 'Retail', label: 'Retail', icon: '🏪' },
    { value: 'Other', label: 'Other', icon: '📦' },
  ];

  // Funding ranges
  const fundingRanges = [
    { value: 'Under ₹5 Lakhs', label: 'Under ₹5 Lakhs', description: 'Bootstrap' },
    { value: '₹5 - ₹25 Lakhs', label: '₹5 - ₹25 Lakhs', description: 'Seed' },
    { value: '₹25 Lakhs - ₹1 Crore', label: '₹25 Lakhs - ₹1 Crore', description: 'Early Stage' },
    { value: '₹1 - ₹5 Crores', label: '₹1 - ₹5 Crores', description: 'Growth' },
    { value: '₹5 - ₹10 Crores', label: '₹5 - ₹10 Crores', description: 'Expansion' },
    { value: 'Above ₹10 Crores', label: 'Above ₹10 Crores', description: 'Scale' },
  ];

  // Revenue models
  const revenueModels = [
    { value: 'Subscription', label: 'Subscription', icon: '🔄' },
    { value: 'One-time Sale', label: 'One-time Sale', icon: '💰' },
    { value: 'Freemium', label: 'Freemium', icon: '🎁' },
    { value: 'Advertising', label: 'Advertising', icon: '📺' },
    { value: 'Commission', label: 'Commission', icon: '🤝' },
    { value: 'SaaS Pricing', label: 'SaaS Pricing', icon: '☁️' },
    { value: 'Mixed', label: 'Mixed', icon: '📊' },
  ];

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!businessName.trim()) {
      setError('Please enter business name');
      return;
    }
    if (!industry) {
      setError('Please select industry');
      return;
    }
    if (!location.trim()) {
      setError('Please enter location');
      return;
    }
    if (!fundingRequired) {
      setError('Please select funding required');
      return;
    }
    if (!targetMarket.trim()) {
      setError('Please describe target market');
      return;
    }
    if (!businessDescription.trim()) {
      setError('Please provide business description');
      return;
    }

    setError('');
    setIsLoading(true);
    setBusinessPlan('');

    try {
      const result = await generateBusinessPlan(
        businessName,
        industry,
        location,
        fundingRequired,
        targetMarket,
        revenueModel || 'To be defined',
        businessDescription
      );
      setBusinessPlan(result.businessPlan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate business plan');
    } finally {
      setIsLoading(false);
    }
  };

  // Copy result to clipboard
  const handleCopy = async () => {
    if (!businessPlan) return;
    
    try {
      await navigator.clipboard.writeText(businessPlan);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Download as text file (simplified PDF alternative)
  const handleDownload = () => {
    if (!businessPlan) return;
    
    const blob = new Blob([businessPlan], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${businessName.replace(/\s+/g, '-').toLowerCase()}-business-plan.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Print functionality
  const handlePrint = () => {
    if (!businessPlan) return;
    window.print();
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mb-6">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4">
            AI Business Plan Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Generate professional, investor-ready business plans instantly. Complete with 
            financial projections, market analysis, and funding breakdown.
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
              <Briefcase className="w-6 h-6 text-emerald-500" />
              Business Details
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Business Name *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Your startup name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Industry & Location Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Industry */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Industry *
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select industry</option>
                    {industries.map((ind) => (
                      <option key={ind.value} value={ind.value}>
                        {ind.icon} {ind.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, State"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Funding & Revenue Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Funding Required */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Funding Required *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <select
                      value={fundingRequired}
                      onChange={(e) => setFundingRequired(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    >
                      <option value="">Select funding</option>
                      {fundingRanges.map((range) => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Revenue Model */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Revenue Model
                  </label>
                  <select
                    value={revenueModel}
                    onChange={(e) => setRevenueModel(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select model</option>
                    {revenueModels.map((model) => (
                      <option key={model.value} value={model.value}>
                        {model.icon} {model.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Target Market */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Market *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={targetMarket}
                    onChange={(e) => setTargetMarket(e.target.value)}
                    placeholder="e.g., Small businesses in Tier 1 cities, College students"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Business Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Business Description *
                </label>
                <textarea
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  placeholder="Describe what your business does, the problem it solves, and your unique solution..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows={4}
                  required
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
                className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-600 focus:ring-4 focus:ring-emerald-300 dark:focus:ring-emerald-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Business Plan...
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5" />
                    Generate Business Plan
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
          >
            {businessPlan ? (
              <div className="space-y-4">
                {/* Action Buttons */}
                <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                    Your Business Plan
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-green-500" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={handlePrint}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Printer className="w-4 h-4" />
                      Print
                    </button>
                  </div>
                </div>

                {/* Business Plan Content */}
                <div 
                  ref={printRef}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-h-[700px] overflow-y-auto"
                >
                  <div className="prose dark:prose-invert max-w-none text-sm">
                    {businessPlan.split('\n').map((line, index) => {
                      const trimmedLine = line.trim();
                      if (trimmedLine.startsWith('# ')) {
                        return (
                          <h1 key={index} className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-8 mb-4 pb-2 border-b border-emerald-200 dark:border-emerald-800">
                            {trimmedLine.replace('# ', '')}
                          </h1>
                        );
                      }
                      if (trimmedLine.startsWith('## ')) {
                        return (
                          <h2 key={index} className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-6 mb-3">
                            {trimmedLine.replace('## ', '')}
                          </h2>
                        );
                      }
                      if (trimmedLine.startsWith('### ')) {
                        return (
                          <h3 key={index} className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mt-4 mb-2">
                            {trimmedLine.replace('### ', '')}
                          </h3>
                        );
                      }
                      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
                        return (
                          <li key={index} className="ml-4 text-gray-600 dark:text-gray-300 mb-1">
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
                      return <br key={index} />;
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  What is a Business Plan?
                </h2>
                
                <div className="space-y-6">
                  {/* Definition */}
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 mb-2">
                      <BookOpen className="w-5 h-5" />
                      Definition
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      A business plan is a comprehensive document that outlines your business goals, strategies, 
                      market analysis, financial projections, and operational details. It's essential for securing 
                      funding, guiding operations, and measuring progress.
                    </p>
                  </div>

                  {/* Why Investors Need It */}
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5" />
                      Why Investors Require It
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Investors need a business plan to evaluate the viability of your venture, understand your 
                      market opportunity, assess your team, and determine the potential return on their investment.
                    </p>
                  </div>

                  {/* Indian Ecosystem */}
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 mb-2">
                      <Globe className="w-5 h-5" />
                      Importance in Indian Startup Ecosystem
                    </h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span><strong>Angel Investors:</strong> Most angel networks require a detailed business plan before investing.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span><strong>Seed Funding:</strong> VCs and seed funds need clear projections and market analysis.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span><strong>Government Schemes:</strong> Startup India and other schemes require business plans for registration.</span>
                      </li>
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6">
                    <p className="text-gray-700 dark:text-gray-300 font-medium text-center">
                      Generate a professional investor-ready business plan instantly
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm text-center mt-2">
                      Fill in your business details on the left to get started.
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
            <HelpCircle className="w-6 h-6 text-emerald-500" />
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white">How detailed is the business plan?</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  The plan includes all major sections: executive summary, problem/solution, market analysis, 
                  competitive analysis, revenue model, marketing strategy, operations, financial projections, 
                  and funding breakdown.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white">Can I use this for bank loans?</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  Yes! The generated business plan includes financial projections and operational details that 
                  banks typically require for loan approval.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white">Is the financial data accurate?</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  The AI provides estimates based on industry benchmarks. You should verify and adjust all 
                  financial projections based on your actual market research.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white">Can I download as PDF?</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  Yes! You can download the business plan as a text file or use the Print feature to save 
                  it as a PDF from your browser.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white">Can I edit the business plan?</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  Yes, you can copy the plan and edit it in any word processor. The AI generates a solid 
                  foundation that you can customize.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white">Is this useful for investor meetings?</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  Absolutely! The business plan is formatted to meet investor expectations and includes 
                  all key sections they typically evaluate.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Use Cases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 text-white"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Who Can Use This Tool?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl mb-3">📊</div>
              <h4 className="font-semibold mb-2">Pitch Deck Preparation</h4>
              <p className="text-sm text-white/80">
                Create detailed business plans for investor presentations
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl mb-3">🏦</div>
              <h4 className="font-semibold mb-2">Bank Loan</h4>
              <p className="text-sm text-white/80">
                Generate professional plans for loan applications
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl mb-3">🇮🇳</div>
              <h4 className="font-semibold mb-2">Startup India</h4>
              <p className="text-sm text-white/80">
                Prepare documentation for government scheme registration
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl mb-3">🤝</div>
              <h4 className="font-semibold mb-2">Investor Meeting</h4>
              <p className="text-sm text-white/80">
                Have detailed answers ready for investor questions
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
          <div className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow">
            <FileText className="w-5 h-5" />
            Generate a professional investor-ready business plan instantly
            <ArrowRight className="w-5 h-5" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AIBusinessPlanGenerator;
