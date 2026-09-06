import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Database, Cloud, Palette, Globe, Smartphone, Bot, TrendingUp, Sparkles, Cpu, Layers } from 'lucide-react';

interface Skill {
  name: string;
  level: number;
}

interface SkillCategory {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgGlow: string;
  skills: Skill[];
}

const Skills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const skillCategories: SkillCategory[] = [
    {
      title: 'Frontend Development',
      icon: Palette,
      color: 'from-pink-500 to-rose-500',
      bgGlow: 'group-hover:shadow-pink-500/20',
      skills: [
        { name: 'React.js', level: 95 },
        { name: 'TypeScript', level: 90 },
        { name: 'Next.js', level: 85 },
        { name: 'Tailwind CSS', level: 92 },
        { name: 'Vue.js', level: 75 },
        { name: 'SASS/SCSS', level: 88 }
      ]
    },
    {
      title: 'Backend Development',
      icon: Database,
      color: 'from-blue-500 to-cyan-500',
      bgGlow: 'group-hover:shadow-blue-500/20',
      skills: [
        { name: 'Node.js', level: 92 },
        { name: 'Express.js', level: 90 },
        { name: 'Python', level: 80 },
        { name: 'PostgreSQL', level: 85 },
        { name: 'MongoDB', level: 88 },
        { name: 'GraphQL', level: 75 }
      ]
    },
    {
      title: 'DevOps & Cloud',
      icon: Cloud,
      color: 'from-green-500 to-emerald-500',
      bgGlow: 'group-hover:shadow-green-500/20',
      skills: [
        { name: 'AWS', level: 82 },
        { name: 'Docker', level: 85 },
        { name: 'Kubernetes', level: 70 },
        { name: 'CI/CD', level: 88 },
        { name: 'Nginx', level: 78 },
        { name: 'Linux', level: 85 }
      ]
    },
    {
      title: 'Mobile Development',
      icon: Smartphone,
      color: 'from-purple-500 to-violet-500',
      bgGlow: 'group-hover:shadow-purple-500/20',
      skills: [
        { name: 'React Native', level: 88 },
        { name: 'Flutter', level: 75 },
        { name: 'iOS (Swift)', level: 65 },
        { name: 'Android (Kotlin)', level: 70 },
        { name: 'Expo', level: 85 },
        { name: 'React Native CLI', level: 90 }
      ]
    },
    {
      title: 'AI & Automation',
      icon: Bot,
      color: 'from-violet-500 to-fuchsia-500',
      bgGlow: 'group-hover:shadow-violet-500/20',
      skills: [
        { name: 'AI Integration & API Development', level: 95 },
        { name: 'LLM / Generative AI', level: 92 },
        { name: 'AI Chatbots', level: 90 },
        { name: 'RAG — Retrieval-Augmented Generation', level: 88 },
        { name: 'Vector Databases', level: 85 },
        { name: 'AI Agents & Agentic AI', level: 88 },
        { name: 'AI Automation', level: 90 },
        { name: 'n8n Skills & AI Agent', level: 85 },
        { name: 'AI + Backend Development', level: 92 },
        { name: 'AI + Database', level: 88 },
        { name: 'AI Frameworks & Libraries', level: 85 },
        { name: 'Machine Learning', level: 80 },
        { name: 'NLP (Natural Language Processing)', level: 82 },
        { name: 'Computer Vision / Multimodal AI', level: 78 },
        { name: 'AI Voice Applications', level: 75 },
        { name: 'AI Security', level: 80 },
        { name: 'AI Testing & Evaluation', level: 82 },
        { name: 'AI DevOps / MLOps', level: 78 },
        { name: 'AI + Business Applications', level: 88 },
        { name: 'AI Cloud Services', level: 85 }
      ]
    },
    {
      title: 'Digital Marketing',
      icon: TrendingUp,
      color: 'from-amber-500 to-orange-500',
      bgGlow: 'group-hover:shadow-amber-500/20',
      skills: [
        { name: 'Digital Marketing Strategy', level: 95 },
        { name: 'SEO — Search Engine Optimization', level: 92 },
        { name: 'Local SEO', level: 88 },
        { name: 'Content Marketing', level: 90 },
        { name: 'Social Media Marketing', level: 88 },
        { name: 'Paid Advertising / PPC', level: 90 },
        { name: 'Social Media Advertising', level: 88 },
        { name: 'Email Marketing', level: 85 },
        { name: 'Marketing Automation', level: 85 },
        { name: 'Conversion Rate Optimization — CRO', level: 82 },
        { name: 'Analytics & Tracking', level: 90 },
        { name: 'E-commerce Marketing', level: 85 },
        { name: 'Affiliate & Influencer Marketing', level: 80 },
        { name: 'Brand & Reputation Marketing', level: 82 },
        { name: 'Video & YouTube Marketing', level: 85 },
        { name: 'Mobile Marketing', level: 80 },
        { name: 'WhatsApp & Conversational Marketing', level: 82 },
        { name: 'B2B Marketing', level: 85 },
        { name: 'Growth Marketing', level: 90 },
        { name: 'AI-Powered Digital Marketing', level: 92 }
      ]
    }
  ];

  const tools = [
    'VS Code', 'Git', 'GitHub', 'Postman', 'Figma', 'Slack', 'Jira', 'Firebase', 
    'Vercel', 'Netlify', 'Heroku', 'Redis', 'Elasticsearch', 'Jest', 'Cypress', 'Webpack'
  ];

  const filteredCategories = activeCategory === 'All' 
    ? skillCategories 
    : skillCategories.filter(cat => cat.title === activeCategory);

  return (
    <>
      <Helmet>
        <title>Skills & Expertise — Akash Raikwar</title>
        <meta name="title" content="Skills & Expertise — Akash Raikwar" />
        <meta name="description" content="Explore my technical expertise in Frontend, Backend, AI & Automation, Cloud, DevOps, and Digital Marketing." />
      </Helmet>

      <div className="min-h-screen pt-24 pb-20 bg-[#020617] text-white relative overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-4"
            >
              <Sparkles className="w-3.5 h-3.5" /> Core Competencies
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
            >
              Skills & Expertise
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-400 leading-relaxed font-light"
            >
              An interactive exploration of my technical proficiency, modern tooling, and domain expertise across software engineering and digital innovation.
            </motion.p>
          </div>

          {/* Interactive Category Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2.5 mb-14"
          >
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                activeCategory === 'All'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/25 border border-transparent'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              <Layers className="w-4 h-4" /> All Expertise
            </button>
            {skillCategories.map((cat) => {
              const IconComp = cat.icon;
              const isActive = activeCategory === cat.title;
              return (
                <button
                  key={cat.title}
                  onClick={() => setActiveCategory(cat.title)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/25 border border-transparent'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <IconComp className="w-4 h-4" /> {cat.title}
                </button>
              );
            })}
          </motion.div>

          {/* Dynamic Bento Grid of Skill Categories */}
          <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            <AnimatePresence mode="popLayout">
              {filteredCategories.map((category, idx) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    key={category.title}
                    className={`group relative bg-gradient-to-b from-white/[0.07] to-white/[0.02] backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 shadow-2xl ${category.bgGlow}`}
                  >
                    {/* Top Accent Glow */}
                    <div className={`absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r ${category.color} opacity-60 group-hover:opacity-100 transition-opacity`} />

                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                            {category.title}
                          </h2>
                          <p className="text-xs text-gray-400 mt-0.5">{category.skills.length} Specialized Skills</p>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-white/10 transition-all">
                        <Cpu className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Skill List with Progress / Mastery Indicators */}
                    <div className="space-y-5">
                      {category.skills.map((skill, sIdx) => (
                        <div key={sIdx} className="space-y-1.5">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-300 font-medium tracking-wide">{skill.name}</span>
                            <span className="text-gray-400 font-mono text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/5">{skill.level}%</span>
                          </div>
                          <div className="w-full bg-gray-900/80 rounded-full h-2.5 p-0.5 border border-white/5 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.2, delay: sIdx * 0.04, ease: 'easeOut' }}
                              className={`h-full bg-gradient-to-r ${category.color} rounded-full shadow-sm`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Tools & Technologies Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-b from-white/[0.06] to-white/[0.01] backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/10 mb-20 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-red-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Code className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Tools & Technologies</h2>
                <p className="text-xs text-gray-400 mt-0.5">Everyday environment and developer stack</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3.5">
              {tools.map((tool, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-white/[0.03] hover:bg-white/[0.08] rounded-xl p-3.5 text-center border border-white/10 hover:border-white/25 transition-all duration-300 shadow-sm cursor-pointer group"
                >
                  <span className="text-gray-300 group-hover:text-white font-medium text-xs tracking-wide">{tool}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Skill Summary / What I Bring to the Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-blue-950/30 via-purple-950/20 to-blue-950/30 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl text-center relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl pointer-events-none" />
            <h2 className="text-3xl font-extrabold text-white mb-4">What I Bring to the Table</h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-sm font-light">
              Bridging robust engineering foundations with forward-looking intelligence and scalable execution.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <motion.div 
                whileHover={{ y: -5 }} 
                transition={{ duration: 0.3 }}
                className="bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-blue-500/20">
                    <Globe className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Full-Stack Architecture</h3>
                  <p className="text-gray-400 text-sm font-light leading-relaxed">
                    Designing seamless end-to-end web systems from performant React frontends to scalable Node.js microservices and robust database structures.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }} 
                transition={{ duration: 0.3 }}
                className="bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-green-500/20">
                    <Cloud className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Cloud & DevOps Excellence</h3>
                  <p className="text-gray-400 text-sm font-light leading-relaxed">
                    Deploying resilient applications with containerization, automated CI/CD pipelines, and cloud infrastructure on AWS and modern platforms.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }} 
                transition={{ duration: 0.3 }}
                className="bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-purple-500/20">
                    <Bot className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">AI & Automation Mastery</h3>
                  <p className="text-gray-400 text-sm font-light leading-relaxed">
                    Integrating cutting-edge generative AI, RAG systems, vector search, and intelligent automation workflows to build next-gen smart applications.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default Skills;
