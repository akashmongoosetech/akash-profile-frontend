import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Code, Award, Users } from 'lucide-react';

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
      title: 'Software Engineer',
      company: 'Profilics Systems Pvt. Ltd.',
      location: 'Ujjain, India',
      period: 'Feb 2025 - Present',
      description: 'Developing scalable and responsive web applications using MERN Stack. Building reusable UI components and integrating RESTful APIs. Collaborating with cross-functional Agile teams to deliver reliable software solutions.',
      achievements: [
        'Developing scalable web applications using MERN Stack',
        'Building reusable UI components for improved efficiency',
        'Integrating RESTful APIs for seamless data flow',
        'Optimizing application performance and user experience'
      ],
      technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'REST APIs']
    },
    {
      type: 'experience',
      title: 'Graduate Software Engineer',
      company: 'Knocial India Limited',
      location: 'Gurgaon, India',
      period: 'June 2023 - Nov 2024',
      description: 'Worked on full stack development following Agile and SDLC best practices. Implemented new features, resolved bugs, and improved application performance. Participated in code reviews and collaborated closely with senior engineers.',
      achievements: [
        'Implemented new features following Agile methodology',
        'Resolved bugs and improved application performance',
        'Participated in code reviews and team collaborations',
        'Delivered scalable solutions aligned with business needs'
      ],
      technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'JavaScript']
    },
    {
      type: 'experience',
      title: 'Software Trainee Intern',
      company: 'Allsoft Infotech & Multimedia',
      location: 'Ujjain, India',
      period: 'Oct 2022 - May 2023',
      description: 'Assisted in developing user-friendly web interfaces using HTML, CSS, and JavaScript. Supported backend integration, testing, and deployment activities. Gained hands-on experience working on live projects under senior developer guidance.',
      achievements: [
        'Assisted in developing user-friendly web interfaces',
        'Supported backend integration and testing activities',
        'Gained hands-on experience with live projects',
        'Collaborated with senior developers on implementation'
      ],
      technologies: ['HTML', 'CSS', 'JavaScript', 'Backend Integration', 'Testing']
    },
    {
      type: 'education',
      title: 'Bachelor of Technology',
      company: 'Electronics & Computer Science Engineering',
      institution: 'Ujjain Engineering College, Ujjain',
      period: '2018 - 2022',
      description: 'Graduated with First Class Honors. Specialized in software engineering, data structures, and algorithms. Active member of the coding club and organized multiple hackathons.',
      achievements: [
        'CGPA: 7.7/10.0 - First Class with Honors',
        'Winner of Inter-College Coding Competition 2018',
        'Led team of 20+ students in organizing TechFest 2019',
        'Published research paper on Machine Learning applications'
      ]
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
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 ml-6 hover:scale-[1.02] transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{item.title}</h3>
                      <h4 className="text-lg text-blue-400">{item.company}</h4>
                    </div>
                    <span className="text-blue-400 font-medium">{item.period}</span>
                  </div>
                  {'location' in item && (
                    <p className="text-gray-400 text-sm mb-3">{item.location}</p>
                  )}
                  <p className="text-gray-400 leading-relaxed mb-4">{item.description}</p>
                  {'achievements' in item && item.achievements && (
                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-white mb-2">Key Achievements:</h5>
                      <ul className="space-y-1">
                        {item.achievements.map((achievement, achIndex) => (
                          <li key={achIndex} className="text-gray-300 text-sm flex items-start gap-2">
                            <span className="text-green-400">•</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {'technologies' in item && item.technologies && (
                    <div className="flex flex-wrap gap-2">
                      {item.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
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