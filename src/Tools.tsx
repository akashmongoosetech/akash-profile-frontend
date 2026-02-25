import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  TrendingUp, 
  Search, 
  FileText, 
  FileCheck, 
  Users, 
  Clock, 
  Briefcase,
  FileSignature,
  Send,
  Sparkles,
  Linkedin,
  Lightbulb,
  Rocket,
  Palette,
  Stethoscope,
  FileSpreadsheet,
  Globe,
  Database,
  FolderKanban,
  GraduationCap,
  Award,
  User,
  MessageSquare,
  Bot
} from 'lucide-react';

interface Tool {
  name: string;
  description: string;
  path: string;
  icon: React.ReactNode;
}

interface Category {
  name: string;
  icon: React.ReactNode;
  tools: Tool[];
  color: string;
}

const toolsData: Category[] = [
  {
    name: 'Advanced Strategy',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-500',
    tools: [
      {
        name: 'Website Cost Calculator',
        description: 'Estimate the cost of building your website based on features and requirements',
        path: '/website-cost-calculator',
        icon: <Calculator className="w-8 h-8" />
      },
      {
        name: 'EMI Calculator',
        description: 'Calculate your Equated Monthly Installments for loans and financing',
        path: '/emi-calculator',
        icon: <Calculator className="w-8 h-8" />
      },
      {
        name: 'SEO Audit Mini Tool',
        description: 'Analyze and audit your website SEO performance with actionable insights',
        path: '/seo-audit-mini-tool',
        icon: <Search className="w-8 h-8" />
      }
    ]
  },
  {
    name: 'Productivity Tools',
    icon: <Briefcase className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-500',
    tools: [
      {
        name: 'Invoice Generator',
        description: 'Create professional invoices for your clients quickly and easily',
        path: '/invoice-generator',
        icon: <FileText className="w-8 h-8" />
      },
      {
        name: 'Quotation Generator',
        description: 'Generate detailed quotations for your products and services',
        path: '/quotation-generator',
        icon: <FileCheck className="w-8 h-8" />
      },
      {
        name: 'Resume Builder (Tech Version)',
        description: 'Build a professional tech resume that stands out to recruiters',
        path: '/resume-builder',
        icon: <Users className="w-8 h-8" />
      },
      {
        name: 'Meeting Agenda Generator',
        description: 'Create structured meeting agendas to maximize productivity',
        path: '/meeting-agenda-generator',
        icon: <Clock className="w-8 h-8" />
      },
      {
        name: 'Contract Template Generator',
        description: 'Generate professional contract templates for your business needs',
        path: '/contract-template-generator',
        icon: <FileSignature className="w-8 h-8" />
      },
      {
        name: 'Freelance Proposal Generator',
        description: 'Create compelling freelance proposals to win more clients',
        path: '/freelance-proposal-generator',
        icon: <Send className="w-8 h-8" />
      }
    ]
  },
  {
    name: 'AI Tools',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'from-indigo-500 to-purple-500',
    tools: [
      {
        name: 'AI Email Reply Generator',
        description: 'Generate contextual email replies with the perfect tone and length',
        path: '/ai-email-reply-generator',
        icon: <Send className="w-8 h-8" />
      },
      {
        name: 'LinkedIn Post Generator',
        description: 'Create engaging LinkedIn posts tailored for developers',
        path: '/linkedIn-post-generator-for-developers',
        icon: <Linkedin className="w-8 h-8" />
      },
      {
        name: 'Project Idea Generator',
        description: 'Generate creative project ideas for students based on technology and difficulty',
        path: '/project-idea-generator-for-students',
        icon: <Lightbulb className="w-8 h-8" />
      },
      {
        name: 'AI Business Idea Validator',
        description: 'Validate your business idea with India-specific market analysis and viability scoring',
        path: '/ai-business-idea-validator',
        icon: <Rocket className="w-8 h-8" />
      },
      {
        name: 'AI Startup Name Generator',
        description: 'Generate creative startup names with meanings, taglines, and domain suggestions',
        path: '/ai-startup-name-generator',
        icon: <Palette className="w-8 h-8" />
      },
      {
        name: 'AI Business Plan Generator',
        description: 'Generate professional investor-ready business plans with financial projections',
        path: '/ai-business-plan-generator',
        icon: <FileText className="w-8 h-8" />
      },
      {
        name: 'AI SQL Query Generator',
        description: 'Transform natural language requirements into optimized SQL queries',
        path: '/ai-sql-query-generator',
        icon: <Database className="w-8 h-8" />
      },
      {
        name: 'AI Project Description Generator',
        description: 'Create compelling project descriptions for resumes and portfolios',
        path: '/ai-project-description-generator',
        icon: <FolderKanban className="w-8 h-8" />
      },
      {
        name: 'AI Internship Cover Letter Generator',
        description: 'Generate personalized cover letters for internship applications',
        path: '/ai-internship-cover-letter-generator',
        icon: <GraduationCap className="w-8 h-8" />
      },
      {
        name: 'AI Personal Statement Generator',
        description: 'Write powerful personal statements for university applications',
        path: '/ai-personal-statement-generator',
        icon: <Award className="w-8 h-8" />
      },
      {
        name: 'AI Portfolio Bio Generator',
        description: 'Create professional bios for websites, LinkedIn, and freelance profiles',
        path: '/ai-portfolio-bio-generator',
        icon: <User className="w-8 h-8" />
      },
      {
        name: 'AI Meeting Summary Generator',
        description: 'Transform meeting transcripts into organized summaries with action items',
        path: '/ai-meeting-summary-generator',
        icon: <MessageSquare className="w-8 h-8" />
      },
      {
        name: 'AI Chat Assistant',
        description: 'Chat with AI in real-time with streaming responses and markdown support',
        path: '/ai-chat',
        icon: <Bot className="w-8 h-8" />
      }
    ]
  },
  {
    name: 'Healthcare AI Tools',
    icon: <Stethoscope className="w-6 h-6" />,
    color: 'from-teal-500 to-cyan-500',
    tools: [
      {
        name: 'AI Medical Note Formatter',
        description: 'Transform raw clinical notes into structured SOAP, Progress Notes, and EMR formats',
        path: '/ai-medical-note-formatter',
        icon: <FileText className="w-8 h-8" />
      },
      {
        name: 'AI Discharge Summary Generator',
        description: 'Generate professional patient discharge summaries from case data',
        path: '/ai-patient-discharge-summary-generator',
        icon: <FileSpreadsheet className="w-8 h-8" />
      },
      {
        name: 'AI Clinic Website Content Generator',
        description: 'Create SEO-optimized website content for medical clinics',
        path: '/ai-clinic-website-content-generator',
        icon: <Globe className="w-8 h-8" />
      }
    ]
  }
];

const Tools: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Free Tools — Akash Raikwar</title>
        <meta name="title" content="Free Tools — Akash Raikwar" />
        <meta name="description" content="Access free online tools including EMI calculator, SEO audit tool, invoice generator, resume builder, and more. Boost your productivity with these free utilities." />
        <meta property="og:title" content="Free Tools — Akash Raikwar" />
        <meta property="og:description" content="Access free online tools including EMI calculator, SEO audit tool, invoice generator, resume builder, and more. Boost your productivity with these free utilities." />
        <meta property="twitter:title" content="Free Tools — Akash Raikwar" />
        <meta property="twitter:description" content="Access free online tools including EMI calculator, SEO audit tool, invoice generator, resume builder, and more. Boost your productivity with these free utilities." />
      </Helmet>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Tools
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Explore our collection of free online tools designed to boost your productivity 
            and help your business grow.
          </p>
        </motion.div>

        {/* Categories */}
        <div className="space-y-16">
          {toolsData.map((category, categoryIndex) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.2 }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-8">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color}`}>
                  <div className="text-white">{category.icon}</div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                  {category.name}
                </h2>
              </div>

              {/* Tools Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.tools.map((tool, toolIndex) => (
                  <motion.div
                    key={tool.path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: categoryIndex * 0.2 + toolIndex * 0.1 }}
                  >
                    <Link
                      to={tool.path}
                      className="group block p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                    >
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <div className="text-white">{tool.icon}</div>
                      </div>

                      {/* Content */}
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {tool.description}
                      </p>

                      {/* Arrow */}
                      <div className="mt-4 flex items-center text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-sm font-medium">Try Now</span>
                        <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default Tools;
