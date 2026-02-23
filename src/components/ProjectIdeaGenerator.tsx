/**
 * Project Idea Generator for Students
 * A React component that generates project ideas for students based on technology and difficulty
 * 
 * Features:
 * - Multiple technology options (React, Node, Python, AI, Full Stack)
 * - Difficulty levels (Beginner, Intermediate, Advanced)
 * - Project types (Web App, Mobile App, AI Tool, SaaS, Automation)
 * - Number of ideas (1-5)
 * - Detailed project breakdowns with features and tech stack
 * - Loading state with spinner
 * - Error handling
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Loader2, Lightbulb, AlertCircle, Code, Rocket, Sparkles } from 'lucide-react';
import { generateProjectIdeas } from '../utils/aiApi';

interface Project {
  name: string;
  description: string;
  features: string[];
  techStack: string;
  bonusFeature: string;
}

const ProjectIdeaGenerator: React.FC = () => {
  // Form state
  const [technology, setTechnology] = useState('React');
  const [difficultyLevel, setDifficultyLevel] = useState('Intermediate');
  const [projectType, setProjectType] = useState('Web App');
  const [numberOfIdeas, setNumberOfIdeas] = useState(3);
  
  // Response state
  const [projects, setProjects] = useState<Project[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Technology options
  const technologies = [
    { value: 'React', label: 'React', icon: '⚛️' },
    { value: 'Node', label: 'Node.js', icon: '🟢' },
    { value: 'Python', label: 'Python', icon: '🐍' },
    { value: 'AI', label: 'AI/ML', icon: '🤖' },
    { value: 'Full Stack', label: 'Full Stack', icon: '🚀' },
  ];

  // Difficulty levels
  const difficultyLevels = [
    { value: 'Beginner', label: 'Beginner', color: 'green', description: 'Basic concepts' },
    { value: 'Intermediate', label: 'Intermediate', color: 'yellow', description: 'Moderate complexity' },
    { value: 'Advanced', label: 'Advanced', color: 'red', description: 'Complex systems' },
  ];

  // Project types
  const projectTypes = [
    { value: 'Web App', label: 'Web App', icon: '🌐' },
    { value: 'Mobile App', label: 'Mobile App', icon: '📱' },
    { value: 'AI Tool', label: 'AI Tool', icon: '🧠' },
    { value: 'SaaS', label: 'SaaS', icon: '☁️' },
    { value: 'Automation', label: 'Automation', icon: '⚙️' },
  ];

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!technology) {
      setError('Please select a technology');
      return;
    }

    setError('');
    setIsLoading(true);
    setProjects([]);

    try {
      const result = await generateProjectIdeas(technology, difficultyLevel, projectType, numberOfIdeas);
      setProjects(result.projects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate project ideas');
    } finally {
      setIsLoading(false);
    }
  };

  // Copy single project to clipboard
  const handleCopy = async (project: Project, index: number) => {
    const content = `📌 ${project.name}

${project.description}

🔧 Tech Stack:
${project.techStack}

✨ Key Features:
${project.features.map(f => `- ${f}`).join('\n')}

🚀 Bonus Feature:
${project.bonusFeature}`;

    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      setError('Failed to copy to clipboard');
    }
  };

  // Get difficulty color
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Advanced':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl mb-4">
            <Lightbulb className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Project Idea Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Generate creative project ideas tailored to your technology and skill level
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form - Takes 1 column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg h-fit"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Technology Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Technology
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {technologies.map((tech) => (
                    <button
                      key={tech.value}
                      type="button"
                      onClick={() => setTechnology(tech.value)}
                      className={`p-3 rounded-xl text-center transition-all duration-200 ${
                        technology === tech.value
                          ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className="text-xl mb-1">{tech.icon}</div>
                      <div className="font-medium text-sm">{tech.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty Level
                </label>
                <div className="space-y-2">
                  {difficultyLevels.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setDifficultyLevel(level.value)}
                      className={`w-full p-3 rounded-xl text-left transition-all duration-200 ${
                        difficultyLevel === level.value
                          ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className="font-medium text-sm">{level.label}</div>
                      <div className={`text-xs ${
                        difficultyLevel === level.value ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {level.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Project Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {projectTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setProjectType(type.value)}
                      className={`p-2 rounded-xl text-center transition-all duration-200 ${
                        projectType === type.value
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

              {/* Number of Ideas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Number of Ideas: {numberOfIdeas}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={numberOfIdeas}
                  onChange={(e) => setNumberOfIdeas(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>3</span>
                  <span>5</span>
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
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Ideas...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Ideas
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Output Panel - Takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg min-h-[600px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Generated Project Ideas
                </h2>
                {projects.length > 0 && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                    {projects.length} projects
                  </span>
                )}
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-[400px]">
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Generating creative project ideas...
                  </p>
                </div>
              )}

              {/* Project Cards */}
              {!isLoading && projects.length > 0 && (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {projects.map((project, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
                    >
                      {/* Project Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                            <Rocket className="w-4 h-4 text-blue-500" />
                            {project.name}
                          </h3>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getDifficultyColor(difficultyLevel)}`}>
                            {difficultyLevel}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(project, index)}
                          className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          {copiedIndex === index ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {project.description}
                      </p>

                      {/* Tech Stack */}
                      <div className="flex items-center gap-2 mb-3">
                        <Code className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {project.techStack}
                        </span>
                      </div>

                      {/* Features */}
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          Key Features
                        </h4>
                        <ul className="space-y-1">
                          {project.features.slice(0, 4).map((feature, fIndex) => (
                            <li key={fIndex} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <span className="text-blue-500 mt-0.5">•</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Bonus Feature */}
                      {project.bonusFeature && (
                        <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">
                            🎁 Bonus: {project.bonusFeature}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isLoading && projects.length === 0 && (
                <div className="flex flex-col items-center justify-center h-[400px] text-gray-400 dark:text-gray-500">
                  <Lightbulb className="w-12 h-12 mb-4 opacity-50" />
                  <p>Your project ideas will appear here</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectIdeaGenerator;
