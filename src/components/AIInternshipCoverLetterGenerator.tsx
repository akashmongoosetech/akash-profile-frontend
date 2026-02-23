import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Copy, 
  Check, 
  Loader2, 
  AlertCircle,
  Sparkles,
  FileText,
  Mail,
  User,
  Building,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { generateCoverLetter } from '../utils/aiApi';

const AIInternshipCoverLetterGenerator: React.FC = () => {
  const [studentName, setStudentName] = useState('');
  const [degree, setDegree] = useState('');
  const [college, setCollege] = useState('');
  const [skills, setSkills] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [internshipRole, setInternshipRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [tone, setTone] = useState('Formal');
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
    if (!studentName.trim() || !degree.trim() || !targetCompany.trim() || !internshipRole.trim()) {
      setError('Please fill in all required fields (Name, Degree, Target Company, Internship Role)');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const response = await generateCoverLetter(
        studentName,
        degree,
        college,
        skills,
        targetCompany,
        internshipRole,
        experienceLevel,
        tone
      );
      setResult(response.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate cover letter');
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

  const tones = ['Formal', 'Confident', 'Enthusiastic'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mb-6">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4">
            AI Internship Cover Letter Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Create personalized, professional cover letters that land internships
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
                <Sparkles className="w-5 h-5 text-emerald-500" />
                Your Information
              </h2>

              {/* Student Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Degree */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Degree/Diploma <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="B.Tech in Computer Science"
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* College */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  College/University
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="MIT University"
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Skills */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Skills
                </label>
                <textarea
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Python, JavaScript, Machine Learning, Data Analysis..."
                  className="w-full h-20 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Target Company */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Company <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    placeholder="Google, Microsoft, Startup..."
                    className="w-full pl-10 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Internship Role */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Internship Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={internshipRole}
                  onChange={(e) => setInternshipRole(e.target.value)}
                  placeholder="Software Engineering Intern, Data Analyst..."
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Experience Level */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Experience Level
                </label>
                <input
                  type="text"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  placeholder="Fresher, 1 year, 2 years..."
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                          ? 'bg-emerald-500 text-white'
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
                className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Cover Letter
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
                    <FileText className="w-5 h-5 text-emerald-500" />
                    Generated Cover Letter
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
                <FileText className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Enter your details and click generate to create your cover letter
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
                    <FileText className="w-5 h-5 text-emerald-500" />
                    Why Cover Letters Still Matter
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
                      In an age of automated application tracking systems and quick-scanning recruiters, you might wonder if cover letters are still relevant. The answer is a definitive yes—particularly for internships where you're competing against hundreds of other candidates with similar academic backgrounds. Your cover letter is your opportunity to tell your story, demonstrate genuine interest, and stand out from the crowd.
                    </p>
                    <p>
                      While your resume lists your qualifications, your cover letter explains why those qualifications matter to this specific company and role. It shows personality, enthusiasm, and genuine interest—all things that can't be captured in bullet points. Recruitivers often use cover letters to gauge cultural fit and motivation, making them crucial for internship applications.
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-6">Common Mistakes Students Make</h3>
                    <p>
                      Many students undermine their chances with avoidable cover letter mistakes. The most common include using generic templates that could apply to any company, focusing too much on what they want rather than what they can offer, repeating their resume verbatim, and failing to research the company. Others write too much or too little, use unprofessional email addresses, or make spelling and grammar errors.
                    </p>
                    <p>
                      These mistakes are easy to avoid when you understand what recruiters are looking for. A personalized, well-structured cover letter that demonstrates genuine interest and specific qualifications can dramatically increase your chances of landing an interview.
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-6">How AI Tailors Applications</h3>
                    <p>
                      Our AI-powered cover letter generator solves these problems by creating personalized, compelling letters tailored to each application. It analyzes the role requirements and company culture to emphasize the most relevant skills and experiences. The AI crafts narratives that connect your background to what the company needs, making your application more compelling and memorable.
                    </p>
                    <p>
                      The tool generates multiple versions—a full cover letter for formal applications and a concise email version for quick submissions. It ensures ATS compatibility while maintaining the human touch that makes applications stand out.
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
                    <Mail className="w-5 h-5 text-emerald-500" />
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
                      <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                        <h4 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-2">Tech Internships</h4>
                        <p className="text-sm">Software engineering, data science, AI/ML roles at top tech companies.</p>
                      </div>
                      <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                        <h4 className="font-semibold text-teal-700 dark:text-teal-300 mb-2">Marketing Internships</h4>
                        <p className="text-sm">Digital marketing, content creation, brand management positions.</p>
                      </div>
                      <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                        <h4 className="font-semibold text-cyan-700 dark:text-cyan-300 mb-2">Finance Internships</h4>
                        <p className="text-sm">Investment banking, accounting, financial analysis roles.</p>
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
                    <User className="w-5 h-5 text-emerald-500" />
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
                      <p className="text-sm"><strong>Name:</strong> Sarah Johnson</p>
                      <p className="text-sm"><strong>Degree:</strong> B.Tech in Computer Science</p>
                      <p className="text-sm"><strong>Company:</strong> Google</p>
                      <p className="text-sm"><strong>Role:</strong> Software Engineering Intern</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Generated Output Preview:</h4>
                      <p className="text-sm">
                        "Dear Google Team,<br/><br/>I am writing to express my enthusiastic interest in the Software Engineering Intern position at Google. As a Computer Science student at MIT with a strong foundation in data structures, algorithms, and software development..."
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
                    <AlertCircle className="w-5 h-5 text-emerald-500" />
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
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">How long should my cover letter be?</h4>
                      <p className="text-sm">For internships, aim for 250-400 words. It should be concise enough to read quickly but detailed enough to demonstrate your interest and qualifications.</p>
                    </div>
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Should I customize each cover letter?</h4>
                      <p className="text-sm">Yes! Our AI helps you customize each letter for the specific role and company, but you should always add personal touches and specific examples.</p>
                    </div>
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">What if I don't have much experience?</h4>
                      <p className="text-sm">Focus on academic projects, relevant coursework, extracurricular activities, and transferable skills. The AI highlights these effectively.</p>
                    </div>
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Will it pass ATS systems?</h4>
                      <p className="text-sm">Yes, the generated cover letters are ATS-friendly with proper formatting and keyword optimization for the specific role.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Can I edit the generated letter?</h4>
                      <p className="text-sm">Absolutely! The generated letter is a starting point. Always review and customize it to reflect your genuine voice and specific experiences.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Land Your Dream Internship
                </h3>
                <p className="text-emerald-100 mb-6 max-w-xl mx-auto">
                  Make a lasting impression with a personalized cover letter that showcases your potential.
                </p>
                <button
                  onClick={() => {
                    document.querySelector('button')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-3 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
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

export default AIInternshipCoverLetterGenerator;
