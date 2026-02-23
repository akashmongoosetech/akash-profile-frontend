/**
 * AI Startup Name Generator
 * A React component that generates creative startup names with branding suggestions
 * 
 * Features:
 * - Industry selection
 * - Brand personality selection
 * - Target audience input
 * - Name preference (One-word/Two-word)
 * - Domain availability toggle
 * - 15-20 name suggestions with meanings and taglines
 * - Loading state with spinner
 * - Error handling
 * - Copy to clipboard functionality
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, 
  Check, 
  Loader2, 
  Lightbulb, 
  AlertCircle, 
  Building2, 
  Users, 
  Heart,
  Globe,
  Sparkles,
  Tag,
  Palette,
  Target,
  ArrowRight,
  BookOpen,
  HelpCircle,
  CheckCircle,
  RefreshCw,
  Download
} from 'lucide-react';
import { generateStartupNames } from '../utils/aiApi';

interface StartupName {
  name: string;
  meaning: string;
  positioning: string;
  tagline: string;
  domainStyle: string;
  isFavorite?: boolean;
}

// Number of names options
const nameCountOptions = [
  { value: 5, label: '5 Names' },
  { value: 10, label: '10 Names' },
  { value: 15, label: '15 Names' },
  { value: 20, label: '20 Names' },
  { value: 25, label: '25 Names' },
  { value: 'custom', label: 'Custom' },
];

const AIStartupNameGenerator: React.FC = () => {
  // Form state
  const [industry, setIndustry] = useState('');
  const [brandPersonality, setBrandPersonality] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [namePreference, setNamePreference] = useState('Two-word');
  const [checkDomain, setCheckDomain] = useState(false);
  const [numberOfNames, setNumberOfNames] = useState<number | 'custom'>(10);
  const [customNumber, setCustomNumber] = useState<number>(15);
  
  // Response state
  const [names, setNames] = useState<StartupName[]>([]);
  const [filteredNames, setFilteredNames] = useState<StartupName[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<StartupName[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [nameFilter, setNameFilter] = useState<'all' | 'one-word' | 'two-word'>('all');
  
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
    { value: 'RealEstate', label: 'Real Estate', icon: '🏠' },
    { value: 'Fashion', label: 'Fashion & Apparel', icon: '👗' },
    { value: 'Travel', label: 'Travel & Tourism', icon: '✈️' },
    { value: 'Services', label: 'Professional Services', icon: '💼' },
  ];

  // Brand personalities
  const brandPersonalities = [
    { value: 'Modern', label: 'Modern', description: 'Sleek, contemporary, innovative', icon: '⚡' },
    { value: 'Premium', label: 'Premium', description: 'Luxurious, exclusive, high-end', icon: '👑' },
    { value: 'Bold', label: 'Bold', description: 'Daring, confident, memorable', icon: '🔥' },
    { value: 'Minimal', label: 'Minimal', description: 'Clean, simple, elegant', icon: '🎯' },
    { value: 'Techy', label: 'Techy', description: 'Technical, futuristic, smart', icon: '💻' },
    { value: 'Indian Cultural', label: 'Indian Cultural', description: 'Traditional, rooted, proud', icon: '🇮🇳' },
    { value: 'Friendly', label: 'Friendly', description: 'Warm, approachable, casual', icon: '😊' },
    { value: 'Professional', label: 'Professional', description: 'Corporate, trustworthy, reliable', icon: '💼' },
  ];

  // Name preferences
  const namePreferences = [
    { value: 'One-word', label: 'One-word', description: 'Short, punchy names like "Zomato", "Swiggy"' },
    { value: 'Two-word', label: 'Two-word', description: 'Descriptive names like "Flipkart", "Paytm"' },
    { value: 'Either', label: 'Either', description: 'Mix of both styles' },
  ];

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('startupNameFavorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Failed to parse favorites:', e);
      }
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('startupNameFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Filter names when filter or names change
  useEffect(() => {
    if (showFavorites) {
      setFilteredNames(favorites);
    } else {
      let filtered = [...names];
      if (nameFilter === 'one-word') {
        filtered = filtered.filter(name => !name.name.includes(' ') && !name.name.includes('-'));
      } else if (nameFilter === 'two-word') {
        filtered = filtered.filter(name => name.name.includes(' ') || name.name.includes('-'));
      }
      setFilteredNames(filtered);
    }
  }, [names, nameFilter, showFavorites, favorites]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!industry) {
      setError('Please select an industry');
      return;
    }
    if (!brandPersonality) {
      setError('Please select brand personality');
      return;
    }
    if (!targetAudience.trim()) {
      setError('Please describe your target audience');
      return;
    }

    setError('');
    setIsLoading(true);
    setNames([]);
    setShowFavorites(false);

    const count = numberOfNames === 'custom' ? customNumber : numberOfNames;

    try {
      const result = await generateStartupNames(
        industry,
        brandPersonality,
        targetAudience,
        namePreference,
        checkDomain,
        count
      );
      
      // Add favorites status to names
      const namesWithFavorites = result.names.map((name: StartupName) => ({
        ...name,
        isFavorite: favorites.some(f => f.name === name.name)
      }));
      setNames(namesWithFavorites);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate startup names');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle favorite
  const toggleFavorite = (name: StartupName) => {
    setFavorites(prev => {
      const isFav = prev.some(f => f.name === name.name);
      if (isFav) {
        return prev.filter(f => f.name !== name.name);
      }
      return [...prev, { ...name, isFavorite: true }];
    });
    
    // Update names list
    setNames(prev => prev.map(n => 
      n.name === name.name ? { ...n, isFavorite: !n.isFavorite } : n
    ));
  };

  // Download favorites as text
  const downloadFavorites = () => {
    const content = favorites.map(f => 
      `🚀 ${f.name}\n📖 Meaning: ${f.meaning}\n🎯 Positioning: ${f.positioning}\n💬 Tagline: ${f.tagline}\n🌐 Domain: ${f.domainStyle}\n---\n`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'startup-names-favorites.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy single name to clipboard
  const handleCopy = async (name: StartupName, index: number) => {
    const content = `🚀 ${name.name}

📖 Meaning: ${name.meaning}
🎯 Positioning: ${name.positioning}
💬 Tagline: ${name.tagline}
🌐 Domain: ${name.domainStyle}`;

    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-4">
            AI Startup Name Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Generate creative, memorable startup names with meanings, taglines, and domain suggestions. 
            Perfect for your next unicorn!
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
              <Palette className="w-6 h-6 text-pink-500" />
              Describe Your Brand
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Industry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Industry *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
              </div>

              {/* Brand Personality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Brand Personality *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {brandPersonalities.map((personality) => (
                    <button
                      key={personality.value}
                      type="button"
                      onClick={() => setBrandPersonality(personality.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        brandPersonality === personality.value
                          ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-pink-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{personality.icon}</div>
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {personality.label}
                      </div>
                    </button>
                  ))}
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
                    placeholder="e.g., Young professionals, Small businesses, Students"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Name Preference */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name Preference
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {namePreferences.map((pref) => (
                    <button
                      key={pref.value}
                      type="button"
                      onClick={() => setNamePreference(pref.value)}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        namePreference === pref.value
                          ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-pink-300'
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {pref.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Names to Generate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  How Many Names?
                </label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {nameCountOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setNumberOfNames(option.value as number | 'custom')}
                      className={`p-2 rounded-lg border-2 text-center text-sm transition-all ${
                        numberOfNames === option.value
                          ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-pink-300'
                      }`}
                    >
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
                {numberOfNames === 'custom' && (
                  <div className="mt-3">
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={customNumber}
                      onChange={(e) => setCustomNumber(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter number (1-50)"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter a number between 1 and 50</p>
                  </div>
                )}
              </div>

              {/* Domain Check Toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCheckDomain(!checkDomain)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    checkDomain ? 'bg-pink-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                    checkDomain ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Check domain availability (mock)
                </label>
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
                className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-rose-600 focus:ring-4 focus:ring-pink-300 dark:focus:ring-pink-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Names...
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-5 h-5" />
                    Generate Startup Names
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
            {names.length > 0 || favorites.length > 0 ? (
              <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                {/* Filter and Controls Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                      {showFavorites ? `${favorites.length} Favorites` : `${names.length} Name Suggestions`}
                    </h2>
                    {!showFavorites && (
                      <span className="text-sm text-gray-500">({filteredNames.length} shown)</span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Filter Buttons */}
                    {!showFavorites && (
                      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                        <button
                          onClick={() => setNameFilter('all')}
                          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                            nameFilter === 'all'
                              ? 'bg-pink-500 text-white'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setNameFilter('one-word')}
                          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                            nameFilter === 'one-word'
                              ? 'bg-pink-500 text-white'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          One-word
                        </button>
                        <button
                          onClick={() => setNameFilter('two-word')}
                          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                            nameFilter === 'two-word'
                              ? 'bg-pink-500 text-white'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          Two-word
                        </button>
                      </div>
                    )}
                    
                    {/* Favorites Toggle */}
                    <button
                      onClick={() => {
                        setShowFavorites(!showFavorites);
                        if (!showFavorites) {
                          setFilteredNames(favorites);
                        } else {
                          setFilteredNames(names);
                        }
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        showFavorites
                          ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-900/20'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'fill-pink-500' : ''}`} />
                      {favorites.length > 0 && (
                        <span className="text-sm font-medium">{favorites.length}</span>
                      )}
                    </button>
                    
                    {/* Download Favorites */}
                    {favorites.length > 0 && (
                      <button
                        onClick={downloadFavorites}
                        className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                    
                    {/* Regenerate */}
                    {!showFavorites && (
                      <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                      </button>
                    )}
                  </div>
                </div>
                
                {showFavorites && favorites.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                    <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      No favorites yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Click the heart icon on any name to save it to your favorites
                    </p>
                    <button
                      onClick={() => setShowFavorites(false)}
                      className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                    >
                      Generate Names
                    </button>
                  </div>
                ) : (
                  (showFavorites ? filteredNames : names).map((name, index) => (
                    <motion.div
                      key={showFavorites ? name.name : index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow relative group"
                    >
                      {/* Favorite Button */}
                      <button
                        onClick={() => toggleFavorite(name)}
                        className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                          name.isFavorite || showFavorites
                            ? 'text-pink-500 bg-pink-50 dark:bg-pink-900/30'
                            : 'text-gray-400 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 opacity-0 group-hover:opacity-100'
                        }`}
                        title={name.isFavorite || showFavorites ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart className={`w-5 h-5 ${name.isFavorite || showFavorites ? 'fill-current' : ''}`} />
                      </button>
                      
                      <div className="flex items-start justify-between pr-12">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-pink-600 dark:text-pink-400 mb-2">
                            {name.name}
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <BookOpen className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600 dark:text-gray-300">
                                <span className="font-medium">Meaning:</span> {name.meaning}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Target className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600 dark:text-gray-300">
                                <span className="font-medium">Positioning:</span> {name.positioning}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Tag className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600 dark:text-gray-300">
                                <span className="font-medium">Tagline:</span> {name.tagline}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Globe className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600 dark:text-gray-300">
                                <span className="font-medium">Domain:</span> {name.domainStyle}
                              </span>
                            </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopy(name, index)}
                        className="ml-4 p-2 text-gray-400 hover:text-pink-500 transition-colors"
                      >
                        {copiedIndex === index ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                )))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Why Startup Naming Matters
                </h2>
                
                <div className="space-y-6">
                  {/* Branding Psychology */}
                  <div>
                    <h3 className="text-lg font-semibold text-pink-600 dark:text-pink-400 flex items-center gap-2 mb-2">
                      <Heart className="w-5 h-5" />
                      Branding Psychology
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Your startup name is the first impression you make on customers, investors, and partners. 
                      A great name builds brand recognition, creates emotional connections, and sets the tone 
                      for your entire brand identity.
                    </p>
                  </div>

                  {/* Indian Naming Trends */}
                  <div>
                    <h3 className="text-lg font-semibold text-pink-600 dark:text-pink-400 flex items-center gap-2 mb-2">
                      <Globe className="w-5 h-5" />
                      Indian Startup Naming Trends
                    </h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span><strong>Sanskrit Roots:</strong> Names like "Myntra", "Zomato" draw from Indian languages</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span><strong>Hybrid English:</strong> Combining English words for global appeal</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span><strong>One-word Brands:</strong> Short, memorable names like "Swiggy", "Cred"</span>
                      </li>
                    </ul>
                  </div>

                  {/* How AI Generates Names */}
                  <div>
                    <h3 className="text-lg font-semibold text-pink-600 dark:text-pink-400 flex items-center gap-2 mb-2">
                      <Lightbulb className="w-5 h-5" />
                      How AI Generates Smart Brand Names
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Our AI uses linguistic pattern matching, industry context mapping, and emotional tone 
                      analysis to generate names that resonate with your target audience while being memorable 
                      and available as domain names.
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl p-6">
                    <p className="text-gray-700 dark:text-gray-300 font-medium text-center">
                      Generate your future unicorn's name in seconds!
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm text-center mt-2">
                      Fill in your brand details on the left to get started.
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
            <HelpCircle className="w-6 h-6 text-pink-500" />
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white">Are these names available as domains?</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  We provide domain style suggestions (.com, .in, .ai, etc.) but cannot guarantee availability. 
                  You'll need to check with a domain registrar.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white">Can I use these names commercially?</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  These are AI-generated suggestions. You should conduct a trademark search before using any name commercially.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white">How many names can I generate?</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  Each generation produces 15-20 name suggestions. You can regenerate as many times as you like.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white">Do you consider Indian cultural names?</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  Yes! Our AI can generate Sanskrit/Hindi-inspired names when you select "Indian Cultural" as the brand personality.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white">What if I want to save my favorite names?</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  Click the copy button to save any name with its details to your clipboard.
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
          className="mt-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-8 text-white"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Who Can Use This Tool?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl mb-3">💻</div>
              <h4 className="font-semibold mb-2">SaaS Founders</h4>
              <p className="text-sm text-white/80">
                Find the perfect tech-forward name for your software startup
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl mb-3">🛍️</div>
              <h4 className="font-semibold mb-2">E-commerce Brands</h4>
              <p className="text-sm text-white/80">
                Generate memorable names for your online store
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl mb-3">🤖</div>
              <h4 className="font-semibold mb-2">AI Startups</h4>
              <p className="text-sm text-white/80">
                Create innovative names for your AI venture
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl mb-3">🏪</div>
              <h4 className="font-semibold mb-2">Local Businesses</h4>
              <p className="text-sm text-white/80">
                Find names that resonate with your local audience
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
          <div className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow">
            <Sparkles className="w-5 h-5" />
            Generate your future unicorn's name in seconds
            <ArrowRight className="w-5 h-5" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AIStartupNameGenerator;
