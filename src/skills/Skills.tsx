import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Code, Database, Cloud, Palette, Globe, Smartphone } from 'lucide-react';

const Skills: React.FC = () => {
  const skillCategories = [
    {
      title: 'Frontend Development',
      icon: Palette,
      color: 'from-pink-500 to-rose-500',
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
      skills: [
        { name: 'React Native', level: 88 },
        { name: 'Flutter', level: 75 },
        { name: 'iOS (Swift)', level: 65 },
        { name: 'Android (Kotlin)', level: 70 },
        { name: 'Expo', level: 85 },
        { name: 'React Native CLI', level: 90 }
      ]
    }
  ];

  const tools = [
    'VS Code', 'Git', 'GitHub', 'Postman', 'Figma', 'Slack', 'Jira', 'Firebase', 
    'Vercel', 'Netlify', 'Heroku', 'Redis', 'Elasticsearch', 'Jest', 'Cypress', 'Webpack'
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const skillVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: (level: number) => ({
      width: `${level}%`,
      opacity: 1,
      transition: {
        duration: 1.5,
        delay: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <>
      <Helmet>
        <title>Skills — Akash Raikwar</title>
        <meta name="title" content="Skills — Akash Raikwar" />
        <meta name="description" content="Explore my technical skills in React, Node.js, TypeScript, MongoDB, and more. View my expertise in full-stack web development." />
        <meta property="og:title" content="Skills — Akash Raikwar" />
        <meta property="og:description" content="Explore my technical skills in React, Node.js, TypeScript, MongoDB, and more. View my expertise in full-stack web development." />
        <meta property="twitter:title" content="Skills — Akash Raikwar" />
        <meta property="twitter:description" content="Explore my technical skills in React, Node.js, TypeScript, MongoDB, and more. View my expertise in full-stack web development." />
      </Helmet>
      <div className="min-h-screen pt-20 pb-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            Skills & Expertise
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A comprehensive overview of my technical skills and proficiency levels across different technologies.
          </p>
        </motion.div>

        {/* Skills Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {skillCategories.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={categoryIndex}
                variants={itemVariants}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">{category.title}</h2>
                </div>

                <div className="space-y-6">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-medium">{skill.name}</span>
                        <span className="text-gray-400 text-sm">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                        <motion.div
                          variants={skillVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          custom={skill.level}
                          className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tools & Technologies */}
        <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Tools & Technologies</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {tools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg p-4 text-center border border-white/10 hover:border-white/20 transition-all duration-200 hover:scale-105"
              >
                <span className="text-gray-300 font-medium text-sm">{tool}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skill Summary */}
        <motion.div variants={itemVariants} className="mt-16 text-center">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-6">What I Bring to the Table</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Full-Stack Expertise</h3>
                <p className="text-gray-400">
                  End-to-end development experience from frontend interfaces to backend APIs and database design.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto">
                  <Cloud className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Cloud & DevOps</h3>
                <p className="text-gray-400">
                  Modern deployment strategies with containerization, CI/CD pipelines, and cloud infrastructure.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Mobile Development</h3>
                <p className="text-gray-400">
                  Cross-platform mobile applications with native performance and modern user experiences.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
    </>
  );
};

export default Skills;