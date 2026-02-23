import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Copy, 
  Check, 
  Loader2, 
  AlertCircle,
  Sparkles,
  FileText,
  MessageSquare,
  ClipboardList,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { generateMeetingSummary } from '../utils/aiApi';

const AIMeetingSummaryGenerator: React.FC = () => {
  const [meetingTranscript, setMeetingTranscript] = useState('');
  const [meetingType, setMeetingType] = useState('Internal');
  const [outputStyle, setOutputStyle] = useState('Bullet Summary');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    explanation: true,
    usecases: true,
    examples: true,
    faq: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleGenerate = async () => {
    if (!meetingTranscript.trim()) {
      setError('Please enter the meeting transcript');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const response = await generateMeetingSummary(
        meetingTranscript,
        meetingType,
        outputStyle
      );
      setResult(response.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate meeting summary');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const meetingTypes = ['Client', 'Internal', 'Sales', 'Scrum'];
  const outputStyles = ['Bullet Summary', 'Detailed Report', 'Action Items Only'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-2xl mb-6">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent mb-4">
            AI Meeting Summary Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Transform meeting transcripts into organized summaries with action items
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-500" />
                Meeting Details
              </h2>

              {/* Meeting Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meeting Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {meetingTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setMeetingType(type)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        meetingType === type
                          ? 'bg-violet-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
              </div>

                </div>
              {/* Output Style */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Output Style
                </label>
                <div className="space-y-2">
                  {outputStyles.map((style) => (
                    <button
                      key={style}
                      onClick={() => setOutputStyle(style)}
                      className={`w-full p-3 rounded-lg text-sm font-medium transition-all ${
                        outputStyle === style
                          ? 'bg-violet-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meeting Transcript */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meeting Transcript <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={meetingTranscript}
                  onChange={(e) => setMeetingTranscript(e.target.value)}
                  placeholder="Paste your meeting transcript here...

Example:
John: Let's discuss the project timeline for Q2.
Sarah: I think we should aim for a June launch.
Mike: That seems tight. I recommend August instead.
John: What about the budget constraints we discussed?"
                  className="w-full h-64 p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent font-mono text-sm"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-4 px-6 bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-violet-600 hover:to-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Summary
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Output Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            {result ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-violet-500" />
                    Meeting Summary
                  </h2>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="p-6">
                  <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 font-sans">
                    {result}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                <MessageSquare className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Enter your meeting transcript and click generate to create a summary
                </p>
              </div>
            )}

            {/* Content Sections */}
            <div className="mt-8 space-y-4">
              {/* Explanation */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  onClick={() => toggleSection('explanation')}
                  className="w-full p-6 flex items-center justify-between text-left"
                >
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-violet-500" />
                    Why Meeting Summaries Are Critical
                  </h2>
                  {expandedSections.explanation ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedSections.explanation && (
                  <div className="px-6 pb-6 text-gray-600 dark:text-gray-300 space-y-4">
                    <p>
                      Meetings are the backbone of organizational communication, but without proper documentation, they often lead to confusion, missed deadlines, and duplicated efforts. A well-crafted meeting summary ensures that everyone stays aligned, nothing falls through the cracks, and teams can reference decisions long after the meeting ends.
                    </p>
                    <p>
                      Studies consistently show that professionals spend significant time in meetings, yet a large percentage of this time is wasted due to poor follow-through. Meeting summaries transform discussions into actionable items, create accountability, and serve as a historical record of decisions and rationale.
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-6">Productivity Loss Without Notes</h3>
                    <p>
                      The cost of not documenting meetings is staggering. Teams experience: action items being forgotten, the same discussions happening repeatedly because no one remembers decisions, confusion about who is responsible for what, difficulty onboarding new team members, and disputes about what was actually agreed upon.
                    </p>
                    <p>
                      Remote and hybrid work has amplified these challenges. Without the casual hallway conversations that happen in offices, written documentation becomes even more critical for team alignment and productivity.
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-6">AI Summarization Technology</h3>
                    <p>
                      Our AI-powered meeting summary generator uses advanced language models to analyze your transcript and extract the most important information. It identifies key decisions, action items, and responsibilities with impressive accuracy. The AI understands context, recognizes different speaker voices, and can adapt the output style based on your needs.
                    </p>
                    <p>
                      Whether you need a quick bullet-point summary for email distribution, a detailed report for stakeholders, or just the action items for task management, the AI delivers exactly what you need in seconds.
                    </p>
                  </div>
                )}
              </div>

              {/* Use Cases */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  onClick={() => toggleSection('usecases')}
                  className="w-full p-6 flex items-center justify-between text-left"
                >
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-violet-500" />
                    Use Cases
                  </h2>
                  {expandedSections.usecases ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedSections.usecases && (
                  <div className="px-6 pb-6 text-gray-600 dark:text-gray-300 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                        <h4 className="font-semibold text-violet-700 dark:text-violet-300 mb-2">Corporate Teams</h4>
                        <p className="text-sm">Document executive meetings, town halls, and strategy sessions.</p>
                      </div>
                      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                        <h4 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Startups</h4>
                        <p className="text-sm">Keep everyone aligned with fast-paced standups and planning sessions.</p>
                      </div>
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Agencies</h4>
                        <p className="text-sm">Track client meetings and ensure deliverables are clearly defined.</p>
                      </div>
                      <div className="p-4 bg-fuchsia-50 dark:bg-fuchsia-900/20 rounded-lg">
                        <h4 className="font-semibold text-fuchsia-700 dark:text-fuchsia-300 mb-2">Remote Teams</h4>
                        <p className="text-sm">Compensate for lack of in-person communication with thorough documentation.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Example */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  onClick={() => toggleSection('examples')}
                  className="w-full p-6 flex items-center justify-between text-left"
                >
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-violet-500" />
                    Example Transcript → Summary
                  </h2>
                  {expandedSections.examples ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedSections.examples && (
                  <div className="px-6 pb-6 text-gray-600 dark:text-gray-300 space-y-4">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Input Transcript:</h4>
                      <p className="text-sm">
                        John: Let's review the Q3 marketing budget.<br/>
                        Sarah: I propose increasing social media spend by 20%.<br/>
                        Mike: That sounds reasonable. What about the website redesign?<br/>
                        John: Let's push that to Q4. Sarah, can you prepare the revised budget?<br/>
                        Sarah: Sure, I'll have it by Friday.<br/>
                        Mike: Great. Let's reconvene next week to finalize.
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Generated Summary:</h4>
                      <p className="text-sm">
                        <strong>Summary:</strong> Discussion of Q3 marketing budget and website redesign timeline.<br/>
                        <strong>Key Decision:</strong> Increase social media spend by 20%; postpone website redesign to Q4.<br/>
                        <strong>Action Items:</strong> Sarah to prepare revised budget by Friday.<br/>
                        <strong>Next Steps:</strong> Reconvene next week to finalize budget.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* FAQ */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  onClick={() => toggleSection('faq')}
                  className="w-full p-6 flex items-center justify-between text-left"
                >
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-violet-500" />
                    Frequently Asked Questions
                  </h2>
                  {expandedSections.faq ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedSections.faq && (
                  <div className="px-6 pb-6 text-gray-600 dark:text-gray-300 space-y-4">
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">How accurate is the AI summary?</h4>
                      <p className="text-sm">The AI is highly accurate for clear, well-structured transcripts. For best results, ensure speakers are clearly identified and discussions are coherent.</p>
                    </div>
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Can it handle multiple speakers?</h4>
                      <p className="text-sm">Yes! The AI can identify and track multiple speakers. For best results, use speaker labels like "John:", "Sarah:", etc.</p>
                    </div>
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Is my meeting data secure?</h4>
                      <p className="text-sm">Absolutely. We don't store your transcripts. All processing is done securely and your data is never shared.</p>
                    </div>
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">What if my transcript has errors?</h4>
                      <p className="text-sm">The AI is trained to handle imperfect transcripts and can still extract meaningful summaries. However, clean transcripts produce better results.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Can I export summaries to other tools?</h4>
                      <p className="text-sm">Yes! Copy the summary and paste it into your project management tools, email, or documentation systems.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-violet-500 to-indigo-500 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Never Miss a Meeting Detail
                </h3>
                <p className="text-violet-100 mb-6 max-w-xl mx-auto">
                  Transform your meeting transcripts into actionable summaries that keep teams aligned and productive.
                </p>
                <button
                  onClick={() => {
                    document.querySelector('button')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-3 bg-white text-violet-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Generate Now - It's Free
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AIMeetingSummaryGenerator;
