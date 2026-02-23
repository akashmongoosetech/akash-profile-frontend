/**
 * LinkedIn Post Generator for Developers
 * A React component that generates engaging LinkedIn posts for developers
 * 
 * Features:
 * - Multiple experience levels (Student, Junior, Mid, Senior)
 * - Multiple post types (Educational, Storytelling, Achievement, Hiring, Opinion)
 * - Optional hashtags
 * - Copy to clipboard functionality
 * - Loading state with spinner
 * - Error handling
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Copy, Check, Loader2, Linkedin, AlertCircle } from 'lucide-react';
import { generateLinkedInPost } from '../utils/aiApi';

const LinkedInPostGenerator: React.FC = () => {
  // Form state
  const [topic, setTopic] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Junior');
  const [postType, setPostType] = useState('Educational');
  const [includeHashtags, setIncludeHashtags] = useState(true);
  
  // Response state
  const [generatedPost, setGeneratedPost] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Experience level options
  const experienceLevels = [
    { value: 'Student', label: 'Student', description: 'Learning & exploring' },
    { value: 'Junior', label: 'Junior', description: '0-2 years exp' },
    { value: 'Mid', label: 'Mid-Level', description: '2-5 years exp' },
    { value: 'Senior', label: 'Senior', description: '5+ years exp' },
  ];

  // Post type options
  const postTypes = [
    { value: 'Educational', label: 'Educational', icon: '📚', description: 'Teach something new' },
    { value: 'Storytelling', label: 'Storytelling', icon: '📖', description: 'Share your journey' },
    { value: 'Achievement', label: 'Achievement', icon: '🏆', description: 'Celebrate wins' },
    { value: 'Hiring', label: 'Hiring', icon: '💼', description: 'Recruitment posts' },
    { value: 'Opinion', label: 'Opinion', icon: '💡', description: 'Share your views' },
  ];

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!topic.trim()) {
      setError('Please enter a topic for your post');
      return;
    }

    setError('');
    setIsLoading(true);
    setGeneratedPost('');

    try {
      const result = await generateLinkedInPost(topic, experienceLevel, postType, includeHashtags);
      setGeneratedPost(result.post);
      setHashtags(result.hashtags);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate LinkedIn post');
    } finally {
      setIsLoading(false);
    }
  };

  // Copy to clipboard
  const handleCopy = async () => {
    if (!generatedPost) return;
    
    // Include hashtags in copy if available
    const contentToCopy = hashtags.length > 0 
      ? `${generatedPost}\n\n${hashtags.join(' ')}`
      : generatedPost;
    
    try {
      await navigator.clipboard.writeText(contentToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Failed to copy to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl mb-4">
            <Linkedin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            LinkedIn Post Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Create engaging LinkedIn posts tailored for developers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Topic Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Topic <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., React hooks, coding interview tips, my first job..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Experience Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {experienceLevels.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setExperienceLevel(level.value)}
                      className={`p-3 rounded-xl text-left transition-all duration-200 ${
                        experienceLevel === level.value
                          ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className="font-medium text-sm">{level.label}</div>
                      <div className={`text-xs ${
                        experienceLevel === level.value ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {level.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Post Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Post Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {postTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setPostType(type.value)}
                      className={`p-3 rounded-xl text-center transition-all duration-200 ${
                        postType === type.value
                          ? 'bg-purple-500 text-white ring-2 ring-purple-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className="text-lg mb-1">{type.icon}</div>
                      <div className="font-medium text-xs">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hashtags Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div>
                  <div className="font-medium text-gray-800 dark:text-white">Include Hashtags</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Add relevant hashtags to boost visibility</div>
                </div>
                <button
                  type="button"
                  onClick={() => setIncludeHashtags(!includeHashtags)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    includeHashtags ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      includeHashtags ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !topic.trim()}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Post...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Generate Post
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Output Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Generated Post
              </h2>
              {generatedPost && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">Copy</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Result Area */}
            <div className="min-h-[350px] bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Creating your LinkedIn post...
                  </p>
                </div>
              ) : generatedPost ? (
                <div className="space-y-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-sans">
                    {generatedPost}
                  </pre>
                  
                  {/* Hashtags */}
                  {hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                      {hashtags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-12 text-gray-400 dark:text-gray-500">
                  <Linkedin className="w-12 h-12 mb-4 opacity-50" />
                  <p>Your generated post will appear here</p>
                </div>
              )}
            </div>

            {/* Metadata */}
            {generatedPost && (
              <div className="mt-4 flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                  {experienceLevel}
                </span>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                  {postType}
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInPostGenerator;
