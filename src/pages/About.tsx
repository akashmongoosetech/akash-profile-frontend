import React from 'react';
import { motion } from 'framer-motion';
import { Download, Calendar, MapPin, Code, Award, Users } from 'lucide-react';

const About: React.FC = () => {
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

  const stats = [
    { icon: Code, value: '4+', label: 'Years Experience' },
    { icon: Award, value: '50+', label: 'Projects Completed' },
    { icon: Users, value: '20+', label: 'Happy Clients' },
  ];

  const timeline = [
    {
      type: 'experience',
      title: 'Senior Software Engineer',
      company: 'Profilics Systems',
      period: '2025 - Present (Project Based)',
      description: 'Spearheading end-to-end web development initiatives, guiding junior engineers, and designing robust, scalable solutions with React, Node.js, and AWS infrastructure.'
    },
    {
      type: 'experience',
      title: 'Software Engineer II',
      company: 'Kataria Group',
      period: '2024 - 2024',
      description: 'Leading full-stack development projects, mentoring junior developers, and architecting scalable web applications using React, Node.js, and AWS.'
    },
    {
      type: 'experience',
      title: 'Software Engineer',
      company: 'Knocial India Limited',
      period: '2023 - 2024',
      description: 'Developed and maintained multiple client projects, implemented CI/CD pipelines, and improved application performance by 40%.'
    },
    {
      type: 'education',
      title: 'Bachelor of Technology',
      company: 'Electronics & Computer Science Engineering',
      period: '2018 - 2022',
      description: 'Graduated with honors, specialized in software engineering and data structures. Active member of coding club and hackathon organizer.'
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            About Me
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Passionate software engineer with a love for creating innovative solutions and turning ideas into reality.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Profile & Bio */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="relative">
              <div className="w-full max-w-md mx-auto lg:mx-0">
                <img
                  src="./my-pic.jpg"
                  alt="Akash Raikwar"
                  className="w-full rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">Quick Info</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300">Ujjain, India</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300">Available for opportunities</span>
                </div>
              </div>
              
              {/* <button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Download Resume
              </button> */}
            </div>
          </motion.div>

          {/* Right Column - Bio & Stats */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold text-white mb-6">My Story</h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  I'm a passionate software engineer with over 4 years of experience in building scalable web applications 
                  and leading development teams. My journey started with a curiosity about how things work, which led me 
                  to pursue computer science and eventually specialize in full-stack development.
                </p>
                <p>
                  I believe in writing clean, maintainable code and creating user experiences that make a difference. 
                  When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, 
                  or sharing knowledge with the developer community.
                </p>
                <p>
                  My expertise spans across modern JavaScript frameworks, cloud technologies, and database design. 
                  I'm particularly passionate about React, Node.js, and building performant, accessible web applications.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 text-center"
                  >
                    <Icon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div variants={itemVariants} className="mt-20">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Experience & Education</h2>
          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative pl-8 pb-8 border-l-2 border-blue-500/30 last:border-l-0 last:pb-0"
              >
                <div className="absolute -left-3 top-0 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full border-4 border-gray-900" />
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 ml-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    <span className="text-blue-400 font-medium">{item.period}</span>
                  </div>
                  <h4 className="text-lg text-gray-300 mb-3">{item.company}</h4>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;