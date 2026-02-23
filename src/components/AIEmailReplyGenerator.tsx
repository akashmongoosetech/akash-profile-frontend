/**
 * AI Email Reply Generator
 * A React component that generates contextual email replies using AI
 * 
 * Features:
 * - Multiple tone options (Professional, Friendly, Formal, Apology, Follow-up)
 * - Length selection (Short, Medium, Long)
 * - Copy to clipboard functionality
 * - Loading state with spinner
 * - Error handling
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Copy, Check, Loader2, Mail, AlertCircle } from 'lucide-react';
import { generateEmailReply } from '../utils/aiApi';

const AIEmailReplyGenerator: React.FC = () => {
  // Form state
  const [originalEmail, setOriginalEmail] = useState('');
  const [tone, setTone] = useState('Professional');
  const [length, setLength] = useState('Medium');
  
  // Response state
  const [generatedReply, setGeneratedReply] = useState('');
  const [copied, setCopied] = useState(false);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Tone options
  const toneOptions = [
    { value: 'Professional', label: 'Professional', description: 'Business-like and formal' },
    { value: 'Friendly', label: 'Friendly', description: 'Warm and casual' },
    { value: 'Formal', label: 'Formal', description: 'Highly official and structured' },
    { value: 'Apology', label: 'Apology', description: 'Sincere and apologetic' },
    { value: 'Follow-up', label: 'Follow-up', description: 'Reminder and persistence' },
  ];

  // Length options
  const lengthOptions = [
    { value: 'Short', label: 'Short', description: '2-3 sentences' },
    { value: 'Medium', label: 'Medium', description: '1 paragraph' },
    { value: 'Long', label: 'Long', description: '2-3 paragraphs' },
  ];

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!originalEmail.trim()) {
      setError('Please enter the original email content');
      return;
    }

    setError('');
    setIsLoading(true);
    setGeneratedReply('');

    try {
      const result = await generateEmailReply(originalEmail, tone, length);
      setGeneratedReply(result.reply);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate email reply');
    } finally {
      setIsLoading(false);
    }
  };

  // Copy to clipboard
  const handleCopy = async () => {
    if (!generatedReply) return;
    
    try {
      await navigator.clipboard.writeText(generatedReply);
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AI Email Reply Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Generate contextual email replies with the perfect tone and length
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
              {/* Original Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Original Email <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={originalEmail}
                  onChange={(e) => setOriginalEmail(e.target.value)}
                  placeholder="Paste the original email you want to reply to..."
                  rows={8}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Tone Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tone
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {toneOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setTone(option.value)}
                      className={`p-3 rounded-xl text-left transition-all duration-200 ${
                        tone === option.value
                          ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className={`text-xs ${
                        tone === option.value ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {option.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Length Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reply Length
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {lengthOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setLength(option.value)}
                      className={`p-3 rounded-xl text-center transition-all duration-200 ${
                        length === option.value
                          ? 'bg-purple-500 text-white ring-2 ring-purple-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className={`text-xs ${
                        length === option.value ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {option.description}
                      </div>
                    </button>
                  ))}
                </div>
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
                disabled={isLoading || !originalEmail.trim()}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Reply...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Generate Reply
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
                Generated Reply
              </h2>
              {generatedReply && (
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
            <div className="min-h-[400px] bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    AI is crafting your reply...
                  </p>
                </div>
              ) : generatedReply ? (
                <div className="prose dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-sans">
                    {generatedReply}
                  </pre>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-12 text-gray-400 dark:text-gray-500">
                  <Mail className="w-12 h-12 mb-4 opacity-50" />
                  <p>Your generated reply will appear here</p>
                </div>
              )}
            </div>

            {/* Metadata */}
            {generatedReply && (
              <div className="mt-4 flex gap-2">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                  {tone}
                </span>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                  {length}
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AIEmailReplyGenerator;
