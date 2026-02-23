import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Copy, 
  Check, 
  Loader2, 
  AlertCircle,
  Sparkles,
  FileText,
  Palette,
  Globe,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { generatePortfolioBio } from '../utils/aiApi';

const AIPortfolioBioGenerator: React.FC = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [skills, setSkills] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [achievements, setAchievements] = useState('');
  const [tone, setTone] = useState('Professional');
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
    if (!name.trim() || !role.trim() || !skills.trim()) {
      setError('Please fill in all required fields (Name, Role, Skills)');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const response = await generatePortfolioBio(
        name,
        role,
        skills,
        yearsOfExperience,
        achievements,
        tone
      );
      setResult(response.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate portfolio bio');
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

  const tones = ['Professional', 'Friendly', 'Bold', 'Minimal'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl mb-6">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent mb-4">
            AI Portfolio Bio Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Create compelling professional bios for your website, LinkedIn, and freelance profiles
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
                <Sparkles className="w-5 h-5 text-rose-500" />
                Your Information
              </h2>

              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              {/* Role */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Full Stack Developer, Designer, Data Scientist..."
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              {/* Skills */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Skills <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, Node.js, Python, UI/UX Design..."
                  className="w-full h-24 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              {/* Years of Experience */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Years of Experience
                </label>
                <input
                  type="text"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                  placeholder="5 years, Fresher, 10+ years..."
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              {/* Achievements */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Key Achievements
                </label>
                <textarea
                  value={achievements}
                  onChange={(e) => setAchievements(e.target.value)}
                  placeholder="Awards, certifications, notable projects..."
                  className="w-full h-20 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
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
                          ? 'bg-rose-500 text-white'
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
                className="w-full py-4 px-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Bio
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
                    <FileText className="w-5 h-5 text-rose-500" />
                    Generated Bio
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
                <User className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Enter your details and click generate to create your professional bio
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
                    <FileText className="w-5 h-5 text-rose-500" />
                    Why Personal Branding Matters
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
                      In today's digital age, your professional bio is often the first impression you make on potential clients, employers, and collaborators. Whether it's on your personal website, LinkedIn profile, freelance platforms, or social media, your bio communicates who you are, what you do, and why someone should work with you—all in a matter of seconds.
                    </p>
                    <p>
                      Personal branding goes beyond just listing your skills. It's about crafting a narrative that resonates with your target audience and differentiates you from thousands of others offering similar services. A powerful bio can open doors to new opportunities, attract ideal clients, and establish you as an authority in your field.
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-6">First Impression Psychology</h3>
                    <p>
                      Studies show that it takes only 7 seconds to make a first impression, and in the online world, your bio is that moment of truth. People decide whether to engage with you, hire you, or connect with you based on what they read in those critical first lines.
                    </p>
                    <p>
                      A well-crafted bio triggers trust and curiosity. It should answer the unspoken question: "What's in it for them?" Whether you're a freelancer seeking clients or a professional seeking career opportunities, your bio is your elevator pitch to the world.
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-6">Bio Writing Framework</h3>
                    <p>
                      Effective bios follow a proven framework: Start with a hook that captures attention, add your professional identity and expertise, highlight unique value or achievements, and end with a call to action or clear next step. Each platform requires a different length and tone, but the core message remains consistent.
                    </p>
                    <p>
                      Our AI generator creates multiple versions optimized for different platforms—from a punchy 1-2 line tagline to detailed professional profiles. You get short, medium, and long versions, plus social media variations—all tailored to your selected tone.
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
                    <Globe className="w-5 h-5 text-rose-500" />
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
                      <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
                        <h4 className="font-semibold text-rose-700 dark:text-rose-300 mb-2">Personal Website</h4>
                        <p className="text-sm">About page for your portfolio or business website.</p>
                      </div>
                      <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                        <h4 className="font-semibold text-pink-700 dark:text-pink-300 mb-2">LinkedIn</h4>
                        <p className="text-sm">Professional headline and summary sections.</p>
                      </div>
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Upwork</h4>
                        <p className="text-sm">Profile bio for freelance clients.</p>
                      </div>
                      <div className="p-4 bg-fuchsia-50 dark:bg-fuchsia-900/20 rounded-lg">
                        <h4 className="font-semibold text-fuchsia-700 dark:text-fuchsia-300 mb-2">Freelancer</h4>
                        <p className="text-sm">Profile optimization on Freelancer.com.</p>
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
                    <Palette className="w-5 h-5 text-rose-500" />
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
                      <p className="text-sm"><strong>Name:</strong> Michael Chen</p>
                      <p className="text-sm"><strong>Role:</strong> UX Designer</p>
                      <p className="text-sm"><strong>Skills:</strong> UI Design, User Research, Figma, Prototyping</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Generated Output:</h4>
                      <p className="text-sm"><strong>Short Bio:</strong> UX Designer crafting intuitive digital experiences. 🎨</p>
                      <p className="text-sm mt-2"><strong>Medium Bio:</strong> Michael Chen is a passionate UX Designer with expertise in creating user-centered digital products...</p>
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
                    <AlertCircle className="w-5 h-5 text-rose-500" />
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
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">How long should my bio be?</h4>
                      <p className="text-sm">It depends on the platform. LinkedIn summaries are typically 2-3 paragraphs, while Twitter/X bios should be under 160 characters. Our tool generates multiple lengths.</p>
                    </div>
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Should I include keywords in my bio?</h4>
                      <p className="text-sm">Yes! Include relevant keywords for discoverability, especially on freelance platforms and LinkedIn where people search for specific skills.</p>
                    </div>
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">How often should I update my bio?</h4>
                      <p className="text-sm">Update your bio whenever you acquire new skills, complete major projects, or change your professional focus. Keep it current and relevant.</p>
                    </div>
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Can I use different tones for different platforms?</h4>
                      <p className="text-sm">Absolutely! LinkedIn might benefit from a professional tone while Upwork could be more friendly. Our generator creates platform-specific versions.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">What's the difference between a bio and a tagline?</h4>
                      <p className="text-sm">A tagline is a memorable 1-2 line hook (like "Helping businesses grow through design"). A bio is longer and provides more context and details.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Build Your Personal Brand
                </h3>
                <p className="text-rose-100 mb-6 max-w-xl mx-auto">
                  Create professional bios that make lasting impressions and attract opportunities.
                </p>
                <button
                  onClick={() => {
                    document.querySelector('button')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-3 bg-white text-rose-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
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

export default AIPortfolioBioGenerator;
