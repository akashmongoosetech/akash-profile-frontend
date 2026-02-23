import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Globe, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Lightbulb,
  RefreshCw
} from 'lucide-react';

/**
 * SEOAuditMiniTool Component
 * 
 * A mini SEO audit tool for analyzing basic on-page SEO elements.
 * Features:
 * - URL validation
 * - Title length check (50-60 characters optimal)
 * - Meta description length check (150-160 characters optimal)
 * - Keyword density estimation
 * - SEO score calculation (0-100)
 * - Dynamic improvement suggestions
 * - Real-time analysis
 */

interface SEOAnalysis {
  urlValid: boolean;
  urlScore: number;
  titleLength: number;
  titleScore: number;
  titleOptimal: boolean;
  descriptionLength: number;
  descriptionScore: number;
  descriptionOptimal: boolean;
  keywords: string[];
  keywordCount: number;
  keywordDensityScore: number;
  totalScore: number;
  suggestions: SEOSuggestion[];
}

interface SEOSuggestion {
  type: 'success' | 'warning' | 'error';
  message: string;
  impact: 'high' | 'medium' | 'low';
}

// URL validation regex
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;

// Optimal lengths
const TITLE_MIN_LENGTH = 50;
const TITLE_MAX_LENGTH = 60;
const DESCRIPTION_MIN_LENGTH = 150;
const DESCRIPTION_MAX_LENGTH = 160;

const SEOAuditMiniTool: React.FC = () => {
  // State for form inputs
  const [websiteUrl, setWebsiteUrl] = useState<string>('');
  const [metaTitle, setMetaTitle] = useState<string>('');
  const [metaDescription, setMetaDescription] = useState<string>('');
  const [keywords, setKeywords] = useState<string>('');

  // State for analysis results
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);

  // Analyze SEO when inputs change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (websiteUrl || metaTitle || metaDescription || keywords) {
        performAnalysis();
      } else {
        setAnalysis(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [websiteUrl, metaTitle, metaDescription, keywords]);

  // Perform SEO analysis
  const performAnalysis = () => {
    const suggestions: SEOSuggestion[] = [];
    let urlScore = 0;
    let titleScore = 0;
    let descriptionScore = 0;
    let keywordDensityScore = 0;

    // URL Validation
    const urlValid = URL_REGEX.test(websiteUrl);
    if (urlValid) {
      urlScore = 100;
      suggestions.push({
        type: 'success',
        message: 'URL format is valid',
        impact: 'high'
      });
    } else if (websiteUrl) {
      suggestions.push({
        type: 'error',
        message: 'Please enter a valid URL (e.g., example.com)',
        impact: 'high'
      });
    }

    // Title Analysis
    const titleLength = metaTitle.length;
    if (titleLength === 0) {
      titleScore = 0;
      suggestions.push({
        type: 'error',
        message: 'Meta title is missing - add a compelling title',
        impact: 'high'
      });
    } else if (titleLength < TITLE_MIN_LENGTH) {
      titleScore = Math.round((titleLength / TITLE_MIN_LENGTH) * 60);
      suggestions.push({
        type: 'warning',
        message: `Title is too short (${titleLength} chars). Aim for ${TITLE_MIN_LENGTH}-${TITLE_MAX_LENGTH} characters`,
        impact: 'medium'
      });
    } else if (titleLength > TITLE_MAX_LENGTH) {
      titleScore = Math.round(((TITLE_MAX_LENGTH * 2 - titleLength) / TITLE_MAX_LENGTH) * 100);
      if (titleScore < 0) titleScore = 0;
      suggestions.push({
        type: 'warning',
        message: `Title is too long (${titleLength} chars). Keep it under ${TITLE_MAX_LENGTH} characters`,
        impact: 'medium'
      });
    } else {
      titleScore = 100;
      suggestions.push({
        type: 'success',
        message: `Title length is optimal (${titleLength} characters)`,
        impact: 'high'
      });
    }

    // Description Analysis
    const descriptionLength = metaDescription.length;
    if (descriptionLength === 0) {
      descriptionScore = 0;
      suggestions.push({
        type: 'error',
        message: 'Meta description is missing - add a descriptive summary',
        impact: 'high'
      });
    } else if (descriptionLength < DESCRIPTION_MIN_LENGTH) {
      descriptionScore = Math.round((descriptionLength / DESCRIPTION_MIN_LENGTH) * 60);
      suggestions.push({
        type: 'warning',
        message: `Description is too short (${descriptionLength} chars). Aim for ${DESCRIPTION_MIN_LENGTH}-${DESCRIPTION_MAX_LENGTH} characters`,
        impact: 'medium'
      });
    } else if (descriptionLength > DESCRIPTION_MAX_LENGTH) {
      descriptionScore = Math.round(((DESCRIPTION_MAX_LENGTH * 2 - descriptionLength) / DESCRIPTION_MAX_LENGTH) * 100);
      if (descriptionScore < 0) descriptionScore = 0;
      suggestions.push({
        type: 'warning',
        message: `Description is too long (${descriptionLength} chars). Keep it under ${DESCRIPTION_MAX_LENGTH} characters`,
        impact: 'medium'
      });
    } else {
      descriptionScore = 100;
      suggestions.push({
        type: 'success',
        message: `Description length is optimal (${descriptionLength} characters)`,
        impact: 'high'
      });
    }

    // Keywords Analysis
    const keywordList = keywords
      .split(',')
      .map(k => k.trim().toLowerCase())
      .filter(k => k.length > 0);
    
    const keywordCount = keywordList.length;
    
    if (keywordCount === 0) {
      keywordDensityScore = 0;
      suggestions.push({
        type: 'warning',
        message: 'No keywords defined - add target keywords',
        impact: 'medium'
      });
    } else if (keywordCount < 3) {
      keywordDensityScore = 50;
      suggestions.push({
        type: 'warning',
        message: `Only ${keywordCount} keyword(s) defined - consider adding more relevant keywords`,
        impact: 'medium'
      });
    } else if (keywordCount > 10) {
      keywordDensityScore = 60;
      suggestions.push({
        type: 'warning',
        message: 'Too many keywords - focus on 3-5 primary keywords for better targeting',
        impact: 'medium'
      });
    } else {
      keywordDensityScore = 100;
      suggestions.push({
        type: 'success',
        message: `Good keyword variety (${keywordCount} keywords)`,
        impact: 'medium'
      });
    }

    // Calculate total score
    const totalScore = Math.round(
      (urlScore * 0.15) + 
      (titleScore * 0.30) + 
      (descriptionScore * 0.30) + 
      (keywordDensityScore * 0.25)
    );

    setAnalysis({
      urlValid,
      urlScore,
      titleLength,
      titleScore,
      titleOptimal: titleLength >= TITLE_MIN_LENGTH && titleLength <= TITLE_MAX_LENGTH,
      descriptionLength,
      descriptionScore,
      descriptionOptimal: descriptionLength >= DESCRIPTION_MIN_LENGTH && descriptionLength <= DESCRIPTION_MAX_LENGTH,
      keywords: keywordList,
      keywordCount,
      keywordDensityScore,
      totalScore,
      suggestions
    });
  };

  // Get score color
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    if (score >= 40) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-red-700';
  };

  // Get score status
  const getScoreStatus = (score: number): { label: string; color: string } => {
    if (score >= 80) return { label: 'Excellent', color: 'text-green-400' };
    if (score >= 60) return { label: 'Good', color: 'text-yellow-400' };
    if (score >= 40) return { label: 'Needs Work', color: 'text-orange-400' };
    return { label: 'Poor', color: 'text-red-400' };
  };

  // Get suggestion icon
  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
    }
  };

  // Get impact badge color
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-500/20 text-red-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'low':
        return 'bg-blue-500/20 text-blue-400';
    }
  };

  // Reset form
  const handleReset = () => {
    setWebsiteUrl('');
    setMetaTitle('');
    setMetaDescription('');
    setKeywords('');
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 mb-4">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            SEO Audit Mini Tool
          </h1>
          <p className="text-gray-400 text-lg">
            Analyze your page's basic SEO elements instantly
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-lg">
                  Page Details
                </h3>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </button>
              </div>

              {/* Website URL */}
              <div className="mb-6">
                <label className="block text-gray-300 font-medium mb-2">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Website URL
                </label>
                <input
                  type="text"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  className={`w-full h-12 px-4 bg-gray-700/50 border-2 rounded-xl text-white focus:outline-none transition-colors ${
                    analysis?.urlValid === false && websiteUrl
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-600 focus:border-indigo-500'
                  }`}
                />
                <p className="text-gray-500 text-xs mt-2">
                  Enter your website or page URL
                </p>
              </div>

              {/* Meta Title */}
              <div className="mb-6">
                <label className="block text-gray-300 font-medium mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Meta Title
                </label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Enter your page title"
                  className="w-full h-12 px-4 bg-gray-700/50 border-2 border-gray-600 focus:border-indigo-500 rounded-xl text-white focus:outline-none transition-colors"
                />
                <div className="flex justify-between mt-2">
                  <p className="text-gray-500 text-xs">
                    {TITLE_MIN_LENGTH}-{TITLE_MAX_LENGTH} characters recommended
                  </p>
                  <p className={`text-xs ${metaTitle.length > TITLE_MAX_LENGTH ? 'text-red-400' : metaTitle.length >= TITLE_MIN_LENGTH ? 'text-green-400' : 'text-gray-500'}`}>
                    {metaTitle.length} / {TITLE_MAX_LENGTH}
                  </p>
                </div>
                {/* Title length bar */}
                <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      metaTitle.length >= TITLE_MIN_LENGTH && metaTitle.length <= TITLE_MAX_LENGTH
                        ? 'bg-green-500'
                        : metaTitle.length > TITLE_MAX_LENGTH
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                    }`}
                    style={{ width: `${Math.min((metaTitle.length / TITLE_MAX_LENGTH) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Meta Description */}
              <div className="mb-6">
                <label className="block text-gray-300 font-medium mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Meta Description
                </label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Enter your page description"
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700/50 border-2 border-gray-600 focus:border-indigo-500 rounded-xl text-white focus:outline-none transition-colors resize-none"
                />
                <div className="flex justify-between mt-2">
                  <p className="text-gray-500 text-xs">
                    {DESCRIPTION_MIN_LENGTH}-{DESCRIPTION_MAX_LENGTH} characters recommended
                  </p>
                  <p className={`text-xs ${metaDescription.length > DESCRIPTION_MAX_LENGTH ? 'text-red-400' : metaDescription.length >= DESCRIPTION_MIN_LENGTH ? 'text-green-400' : 'text-gray-500'}`}>
                    {metaDescription.length} / {DESCRIPTION_MAX_LENGTH}
                  </p>
                </div>
                {/* Description length bar */}
                <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      metaDescription.length >= DESCRIPTION_MIN_LENGTH && metaDescription.length <= DESCRIPTION_MAX_LENGTH
                        ? 'bg-green-500'
                        : metaDescription.length > DESCRIPTION_MAX_LENGTH
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                    }`}
                    style={{ width: `${Math.min((metaDescription.length / DESCRIPTION_MAX_LENGTH) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  <Search className="w-4 h-4 inline mr-1" />
                  Keywords (comma separated)
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g., web design, seo, marketing"
                  className="w-full h-12 px-4 bg-gray-700/50 border-2 border-gray-600 focus:border-indigo-500 rounded-xl text-white focus:outline-none transition-colors"
                />
                <p className="text-gray-500 text-xs mt-2">
                  Add 3-5 relevant keywords separated by commas
                </p>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {analysis ? (
              <>
                {/* Score Card */}
                <div className={`bg-gradient-to-br ${getScoreColor(analysis.totalScore)} rounded-2xl p-8 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-6 h-6" />
                      <span className="text-white/80 font-medium">SEO Score</span>
                    </div>
                    <span className={`font-bold text-lg ${getScoreStatus(analysis.totalScore).color}`}>
                      {getScoreStatus(analysis.totalScore).label}
                    </span>
                  </div>
                  <div className="text-6xl font-bold mb-2">
                    {analysis.totalScore}
                    <span className="text-2xl text-white/60">/100</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <Lightbulb className="w-4 h-4" />
                    <span className="text-sm">Based on URL, title, description & keywords</span>
                  </div>
                </div>

                {/* Individual Scores */}
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
                  <h3 className="text-white font-semibold text-lg mb-4">
                    Score Breakdown
                  </h3>
                  <div className="space-y-4">
                    {/* URL Score */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">URL</span>
                        <span className={analysis.urlScore === 100 ? 'text-green-400' : 'text-red-400'}>
                          {analysis.urlScore}/100
                        </span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${analysis.urlScore === 100 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${analysis.urlScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Title Score */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Title ({analysis.titleLength} chars)</span>
                        <span className={analysis.titleScore >= 80 ? 'text-green-400' : analysis.titleScore >= 50 ? 'text-yellow-400' : 'text-red-400'}>
                          {analysis.titleScore}/100
                        </span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            analysis.titleOptimal 
                              ? 'bg-green-500' 
                              : analysis.titleScore >= 50 
                              ? 'bg-yellow-500' 
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${analysis.titleScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Description Score */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Description ({analysis.descriptionLength} chars)</span>
                        <span className={analysis.descriptionScore >= 80 ? 'text-green-400' : analysis.descriptionScore >= 50 ? 'text-yellow-400' : 'text-red-400'}>
                          {analysis.descriptionScore}/100
                        </span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            analysis.descriptionOptimal 
                              ? 'bg-green-500' 
                              : analysis.descriptionScore >= 50 
                              ? 'bg-yellow-500' 
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${analysis.descriptionScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Keywords Score */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Keywords ({analysis.keywordCount})</span>
                        <span className={analysis.keywordDensityScore >= 80 ? 'text-green-400' : analysis.keywordDensityScore >= 50 ? 'text-yellow-400' : 'text-red-400'}>
                          {analysis.keywordDensityScore}/100
                        </span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            analysis.keywordDensityScore >= 80 
                              ? 'bg-green-500' 
                              : analysis.keywordDensityScore >= 50 
                              ? 'bg-yellow-500' 
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${analysis.keywordDensityScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
                  <h3 className="text-white font-semibold text-lg mb-4">
                    Recommendations
                  </h3>
                  <div className="space-y-3">
                    {analysis.suggestions.map((suggestion, index) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-xl flex items-start gap-3 ${
                          suggestion.type === 'success' 
                            ? 'bg-green-500/10 border border-green-500/30'
                            : suggestion.type === 'warning'
                            ? 'bg-yellow-500/10 border border-yellow-500/30'
                            : 'bg-red-500/10 border border-red-500/30'
                        }`}
                      >
                        {getSuggestionIcon(suggestion.type)}
                        <div className="flex-1">
                          <p className="text-white text-sm">{suggestion.message}</p>
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-2 ${getImpactColor(suggestion.impact)}`}>
                            {suggestion.impact} impact
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-12 border border-gray-700/50 text-center">
                <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white font-semibold text-xl mb-2">
                  Start Your SEO Audit
                </h3>
                <p className="text-gray-400">
                  Fill in the details on the left to analyze your page's SEO performance
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOAuditMiniTool;
