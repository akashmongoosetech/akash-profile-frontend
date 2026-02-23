import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FolderKanban, 
  Copy, 
  Check, 
  Loader2, 
  AlertCircle,
  Sparkles,
  FileText,
  Globe,
  Briefcase,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { generateProjectDescription } from '../utils/aiApi';

const AIProjectDescriptionGenerator: React.FC = () => {
  const [projectName, setProjectName] = useState('');
  const [technologyStack, setTechnologyStack] = useState('');
  const [purpose, setPurpose] = useState('');
  const [features, setFeatures] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [tone, setTone] = useState('Technical');
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
    if (!projectName.trim() || !technologyStack.trim() || !purpose.trim()) {
      setError('Please fill in all required fields (Project Name, Technology Stack, Purpose)');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const response = await generateProjectDescription(
        projectName,
        technologyStack,
        purpose,
        features,
        targetAudience,
        tone
      );
      setResult(response.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate project description');
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

  const tones = ['Technical', 'Professional', 'Investor-ready', 'Resume-friendly'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-6">
            <FolderKanban className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            AI Project Description Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Create compelling project descriptions for resumes, portfolios, and proposals
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
                <Sparkles className="w-5 h-5 text-blue-500" />
                Project Details
              </h2>

              {/* Project Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., E-Commerce Platform"
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Technology Stack */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Technology Stack <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={technologyStack}
                  onChange={(e) => setTechnologyStack(e.target.value)}
                  placeholder="e.g., React, Node.js, MongoDB, Express"
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Purpose */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Purpose <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="What does your project do? What problem does it solve?"
                  className="w-full h-24 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Features */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Key Features (optional)
                </label>
                <textarea
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="List the main features of your project..."
                  className="w-full h-20 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Target Audience */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Audience (optional)
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g., Small businesses, Students"
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Tone */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tone
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {tones.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        tone === t
                          ? 'bg-blue-500 text-white'
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
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Description
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
                    <FileText className="w-5 h-5 text-blue-500" />
                    Generated Description
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
                  <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                    {result}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                <FileText className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Enter your project details and click generate to see the description
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
                    <FileText className="w-5 h-5 text-blue-500" />
                    Why Project Descriptions Matter
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
                      A well-crafted project description is your secret weapon in today's competitive job market. It's not just about listing what you built—it's about telling a compelling story that demonstrates your technical abilities, problem-solving skills, and impact. Whether you're applying for internships, building your portfolio, or pitching to clients, the way you describe your projects can make the difference between getting noticed and being overlooked.
                    </p>
                    <p>
                      In the resume context, recruiters spend an average of 6-7 seconds scanning each resume. Your project descriptions need to immediately communicate value and relevance. A vague description like "Built an e-commerce website" tells them nothing, while a powerful description like "Developed a full-stack e-commerce platform handling 10,000+ monthly transactions, reducing checkout time by 40% through optimized payment processing" immediately demonstrates real-world impact.
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-6">Importance in Resume & Portfolio</h3>
                    <p>
                      Your project descriptions serve multiple critical purposes. They provide evidence of your technical skills beyond just listing technologies. They demonstrate your ability to deliver business value. They show initiative and passion for your craft. And they give interviewers talking points for follow-up questions.
                    </p>
                    <p>
                      For portfolios, your descriptions help visitors quickly understand the value you can bring. For client proposals, they communicate professionalism and clarity. Each platform requires a slightly different approach—and our AI generates all the versions you need.
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-6">How AI Improves Clarity</h3>
                    <p>
                      AI-powered project description generation transforms vague ideas into polished, professional content. The AI understands what hiring managers and clients want to see: specific metrics, clear value propositions, and relevant technical details. It helps you articulate achievements in ways that resonate with your audience.
                    </p>
                    <p>
                      The technology adapts to different tones and platforms automatically. Need a technical version for GitHub? A concise version for your resume? An engaging version for LinkedIn? The AI generates each variation while maintaining your authentic voice.
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
                    <Globe className="w-5 h-5 text-blue-500" />
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
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">GitHub README</h4>
                        <p className="text-sm">Create comprehensive project documentation that helps visitors understand and contribute to your projects.</p>
                      </div>
                      <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                        <h4 className="font-semibold text-cyan-700 dark:text-cyan-300 mb-2">Internship Applications</h4>
                        <p className="text-sm">Stand out to recruiters with compelling project descriptions that highlight your achievements.</p>
                      </div>
                      <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                        <h4 className="font-semibold text-teal-700 dark:text-teal-300 mb-2">Client Proposals</h4>
                        <p className="text-sm">Impress potential clients with professional project descriptions that demonstrate capability.</p>
                      </div>
                      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                        <h4 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Freelancing</h4>
                        <p className="text-sm">Showcase your work effectively to win more projects on platforms like Upwork and Fiverr.</p>
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
                    <Briefcase className="w-5 h-5 text-blue-500" />
                    Example Output
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
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Input:</h4>
                      <p className="text-sm"><strong>Project Name:</strong> TaskMaster Pro</p>
                      <p className="text-sm"><strong>Tech Stack:</strong> React, Node.js, MongoDB, Express</p>
                      <p className="text-sm"><strong>Purpose:</strong> A project management app for remote teams</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Generated Output:</h4>
                      <p className="text-sm">
                        <strong>Short Summary:</strong> TaskMaster Pro is a full-stack project management application designed specifically for remote teams, featuring real-time collaboration, task tracking, and productivity analytics.
                      </p>
                      <p className="text-sm mt-2">
                        <strong>Resume Version:</strong> Built TaskMaster Pro, a React + Node.js project management app with MongoDB, enabling real-time task collaboration for 50+ remote teams. Implemented WebSocket communication reducing team communication delays by 60%.
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
                    <AlertCircle className="w-5 h-5 text-blue-500" />
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
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Can I customize the generated descriptions?</h4>
                      <p className="text-sm">Yes! The generated descriptions are a starting point. You can edit and customize them to match your specific achievements and preferences.</p>
                    </div>
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">How many versions does it generate?</h4>
                      <p className="text-sm">The AI generates 5 versions: Short Summary, Detailed Description, Key Features, Technical Architecture, Resume Version, and LinkedIn Version.</p>
                    </div>
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Is this free to use?</h4>
                      <p className="text-sm">Yes, the tool is completely free with no hidden costs or limitations.</p>
                    </div>
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">What makes a good project description?</h4>
                      <p className="text-sm">A great project description includes: what the project does, technologies used, your specific role/achievements, and measurable impact whenever possible.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Can I use this for commercial projects?</h4>
                      <p className="text-sm">Absolutely! The generated descriptions are yours to use anywhere—resumes, portfolios, GitHub, client presentations, etc.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Create Professional Project Descriptions
                </h3>
                <p className="text-blue-100 mb-6 max-w-xl mx-auto">
                  Stand out to recruiters, clients, and collaborators with compelling descriptions that showcase your work effectively.
                </p>
                <button
                  onClick={() => {
                    document.querySelector('button')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
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

export default AIProjectDescriptionGenerator;
