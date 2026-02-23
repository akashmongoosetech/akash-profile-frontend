import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  Copy, 
  Check, 
  Loader2, 
  AlertCircle,
  Sparkles,
  FileText,
  GraduationCap,
  Target,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { generatePersonalStatement } from '../utils/aiApi';

const AIPersonalStatementGenerator: React.FC = () => {
  const [name, setName] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [academicAchievements, setAcademicAchievements] = useState('');
  const [careerGoals, setCareerGoals] = useState('');
  const [targetUniversity, setTargetUniversity] = useState('');
  const [tone, setTone] = useState('Academic');
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
    if (!name.trim() || !fieldOfStudy.trim() || !careerGoals.trim()) {
      setError('Please fill in all required fields (Name, Field of Study, Career Goals)');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const response = await generatePersonalStatement(
        name,
        fieldOfStudy,
        academicAchievements,
        careerGoals,
        targetUniversity,
        tone
      );
      setResult(response.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate personal statement');
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

  const tones = ['Inspirational', 'Academic', 'Professional'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl mb-6">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-4">
            AI Personal Statement Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Write compelling personal statements for university and scholarship applications
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
                <Sparkles className="w-5 h-5 text-amber-500" />
                Your Details
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
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              {/* Field of Study */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Field of Study <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  placeholder="Computer Science, MBA, Psychology..."
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              {/* Academic Achievements */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Academic Achievements
                </label>
                <textarea
                  value={academicAchievements}
                  onChange={(e) => setAcademicAchievements(e.target.value)}
                  placeholder="GPA, awards, research projects, publications..."
                  className="w-full h-24 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              {/* Career Goals */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Career Goals <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={careerGoals}
                  onChange={(e) => setCareerGoals(e.target.value)}
                  placeholder="What do you want to achieve professionally?"
                  className="w-full h-24 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              {/* Target University */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target University/Program
                </label>
                <input
                  type="text"
                  value={targetUniversity}
                  onChange={(e) => setTargetUniversity(e.target.value)}
                  placeholder="MIT, Stanford, Harvard..."
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              {/* Tone */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tone
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {tones.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        tone === t
                          ? 'bg-amber-500 text-white'
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
                className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Statement
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
                    <FileText className="w-5 h-5 text-amber-500" />
                    Generated Personal Statement
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
                <Award className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Enter your details and click generate to create your personal statement
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
                    <FileText className="w-5 h-5 text-amber-500" />
                    What is a Personal Statement?
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
                      A personal statement is a critical component of your graduate school or scholarship application. Unlike your academic transcript or resume, it provides a narrative glimpse into who you are—your motivations, experiences, aspirations, and what makes you uniquely qualified for your chosen program. This 500-1000 word essay is your opportunity to speak directly to the admissions committee and make a compelling case for your admission.
                    </p>
                    <p>
                      Think of your personal statement as your story told in your own voice. While your grades and test scores speak to your academic capability, your personal statement reveals your character, passion, and potential. It answers questions that numbers cannot: Why do you want to pursue this field? What drives you? What experiences have shaped your journey? What unique perspective do you bring?
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-6">Why Universities Value It</h3>
                    <p>
                      Admissions committees receive thousands of applications with similar academic credentials. The personal statement is their primary tool for differentiating between candidates. They're not just looking for smart students—they're looking for students who will contribute to their community, demonstrate genuine passion, and succeed in their program.
                    </p>
                    <p>
                      A well-crafted personal statement reveals qualities that transcripts don't show: your ability to articulate ideas, your maturity, your self-awareness, and your fit with the program. It's also an opportunity to address any weaknesses in your application—such as a lower GPA or gaps in your resume—by explaining circumstances and demonstrating continued growth.
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-6">Common Errors to Avoid</h3>
                    <p>
                      Many applicants undermine their chances with common mistakes. These include starting with a cliché opening, making it all about themselves without connecting to the program, using overly complex language, repeating information from other parts of the application, and failing to proofread. Others write something too generic that could apply to any applicant, or conversely, something so focused on minor details that they lose the bigger picture.
                    </p>
                    <p>
                      The key is authenticity. Admissions officers read hundreds of essays and can spot insincerity instantly. Your goal is to be genuine, specific, and compelling while avoiding these common pitfalls.
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
                    <GraduationCap className="w-5 h-5 text-amber-500" />
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-2">Master's Applications</h4>
                        <p className="text-sm">Graduate programs in CS, Engineering, Sciences, and more.</p>
                      </div>
                      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">MBA Applications</h4>
                        <p className="text-sm">Business school applications requiring leadership stories.</p>
                      </div>
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <h4 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-2">Scholarships</h4>
                        <p className="text-sm">Competitive scholarship applications needing strong narratives.</p>
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
                    <Target className="w-5 h-5 text-amber-500" />
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
                      <p className="text-sm"><strong>Name:</strong> Emily Chen</p>
                      <p className="text-sm"><strong>Field:</strong> Computer Science (AI/ML)</p>
                      <p className="text-sm"><strong>Goals:</strong> Work in AI research, develop ethical AI systems</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Generated Output Preview:</h4>
                      <p className="text-sm">
                        "The moment I realized AI's potential to transform lives wasn't in a research lab—it was in my grandmother's kitchen. Watching her struggle with simple technology while AI assistants made life easier for others..."
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
                    <AlertCircle className="w-5 h-5 text-amber-500" />
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
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">How long should a personal statement be?</h4>
                      <p className="text-sm">Most programs ask for 500-1000 words. Always check specific requirements for each school or scholarship.</p>
                    </div>
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Should I include weaknesses in my application?</h4>
                      <p className="text-sm">Briefly addressing challenges can show maturity, but focus on growth and what you learned rather than making excuses.</p>
                    </div>
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">How many drafts should I write?</h4>
                      <p className="text-sm">Plan for at least 3-5 drafts. The first is rarely the best. Start early to give yourself time for revisions.</p>
                    </div>
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Can I reuse my statement for different programs?</h4>
                      <p className="text-sm">Use a base version but customize for each program. Show specific interest in that school's unique offerings.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">How do I make my statement memorable?</h4>
                      <p className="text-sm">Use specific stories and details, show your unique voice, be authentic, and connect your past to your future goals.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ace Your University Application
                </h3>
                <p className="text-amber-100 mb-6 max-w-xl mx-auto">
                  Create a compelling personal statement that tells your unique story and gets you accepted.
                </p>
                <button
                  onClick={() => {
                    document.querySelector('button')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-3 bg-white text-amber-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
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

export default AIPersonalStatementGenerator;
