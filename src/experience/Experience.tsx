import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  Calendar,
  MapPin,
  ExternalLink,
} from 'lucide-react';

const Experience: React.FC = () => {
  const experiences = [
    {
      type: 'work',
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
      technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'REST APIs'],
      logo: '🏢'
    },
    {
      type: 'work',
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
      technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'JavaScript'],
      logo: '💡'
    },
    {
      type: 'work',
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
      technologies: ['HTML', 'CSS', 'JavaScript', 'Backend Integration', 'Testing'],
      logo: '🚀'
    }
  ];

  const education = [
    {
      type: 'education',
      title: 'Bachelor of Technology',
      company: 'Electronics & Computer Science Engineering',
      institution: 'Ujjain Engineering College, Ujjain',
      location: 'Ujjain, India',
      period: '2018 - 2022',
      description: 'Graduated with First Class Honors. Specialized in software engineering, data structures, and algorithms. Active member of the coding club and organized multiple hackathons.',
      achievements: [
        'CGPA: 7.7/10.0 - First Class with Honors',
        'Winner of Inter-College Coding Competition 2018',
        'Led team of 20+ students in organizing TechFest 2019',
        'Published research paper on Machine Learning applications'
      ],
      logo: '🎓'
    },
    // {
    //   type: 'education',
    //   title: 'Mater of Technology',
    //   company: 'Information Technology',
    //   institution: 'Mahakal Institute of Technology',
    //   location: 'Ujjain, India',
    //   period: '2024 - Present',
    //   description: 'Pursued advanced studies in Information Technology with a focus on software architecture, cloud computing, data analytics, and machine learning. Engaged in academic research and hands-on development projects.',
    //   achievements: [
    //     'CGPA: 9.1/10 - First Class with Distinction',
    //     'Published research paper on "Optimized Data Routing in Cloud Networks" in IEEE Xplore',
    //     'Graduate Teaching Assistant for Advanced Web Technologies',
    //     'Final year project selected for national-level tech symposium'
    //   ],
    //   logo: '📚'
    // }
  ];

  const certifications = [
    {
      title: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: 'March 2023',
      credentialId: 'AWS-CSA-2023-001',
      logo: '☁️'
    },
    {
      title: 'Google Cloud Professional Developer',
      issuer: 'Google Cloud',
      date: 'January 2023',
      credentialId: 'GCP-PD-2023-001',
      logo: '🌐'
    },
    {
      title: 'Certified Kubernetes Administrator',
      issuer: 'Cloud Native Computing Foundation',
      date: 'November 2022',
      credentialId: 'CKA-2022-001',
      logo: '⚙️'
    },
    {
      title: 'MongoDB Certified Developer',
      issuer: 'MongoDB Inc.',
      date: 'September 2022',
      credentialId: 'MDB-DEV-2022-001',
      logo: '🍃'
    }
  ];

  const badges = [
    {
      title: 'Data Science for Business - Level 1',
      issuer: 'IBM',
      verifyLink: 'https://www.credly.com/badges/a3af8295-9513-4d5d-bc7a-b1d61080a439/public_url',
      image: 'https://images.credly.com/size/340x340/images/547b89ab-8749-4dfa-8ace-edf4fc6af3be/blob',
    },
    {
      title: 'IBM Blockchain Essentials V2',
      issuer: 'IBM',
      verifyLink: 'https://www.credly.com/badges/8225afdb-e459-4149-bf09-14ed9199fcfe/public_url',
      image: 'https://images.credly.com/size/340x340/images/2f9eee24-6834-4595-b2b6-e8e585190a0d/IBM-Blockchain-Essentials-V2.png',
    },
    {
      title: 'Deep Learning using TensorFlow',
      issuer: 'IBM',
      verifyLink: 'https://www.credly.com/badges/09064042-1c44-42a7-8d69-ecca98568a27/public_url',
      image: 'https://images.credly.com/size/340x340/images/ba85e07d-8263-4f30-b39b-d79883ee558c/blob',
    },
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

  return (
    <>
      <Helmet>
        <title>Experience — Akash Raikwar</title>
        <meta name="title" content="Experience — Akash Raikwar" />
        <meta name="description" content="View my professional experience and work history. Learn about my roles as a full-stack developer and software engineer." />
        <meta property="og:title" content="Experience — Akash Raikwar" />
        <meta property="og:description" content="View my professional experience and work history. Learn about my roles as a full-stack developer and software engineer." />
        <meta property="twitter:title" content="Experience — Akash Raikwar" />
        <meta property="twitter:description" content="View my professional experience and work history. Learn about my roles as a full-stack developer and software engineer." />
      </Helmet>
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
            Experience & Education
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            My professional journey, educational background, and continuous learning path
          </p>
        </motion.div>

        {/* Experience Timeline */}
        <motion.div variants={itemVariants} className="mb-20">
          <div className="flex items-center gap-3 mb-12">
            <Briefcase className="w-8 h-8 text-blue-400" />
            <h2 className="text-3xl font-bold text-white">Professional Experience</h2>
          </div>

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative pl-8 border-l-2 border-blue-500/30 last:border-l-0"
              >
                <div className="absolute -left-4 top-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-lg border-4 border-gray-900">
                  {exp.logo}
                </div>
                
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 ml-6 hover:scale-[1.02] transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{exp.title}</h3>
                      <h4 className="text-xl text-blue-400 mb-2">{exp.company}</h4>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{exp.period}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{exp.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-6 leading-relaxed">{exp.description}</p>

                  <div className="mb-6">
                    <h5 className="text-lg font-semibold text-white mb-3">Key Achievements:</h5>
                    <ul className="space-y-2">
                      {exp.achievements.map((achievement, achIndex) => (
                        <li key={achIndex} className="flex items-start gap-3">
                          <Award className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300 text-sm">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="text-lg font-semibold text-white mb-3">Technologies Used:</h5>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Education Timeline */}
        <motion.div variants={itemVariants} className="mb-20">
          <div className="flex items-center gap-3 mb-12">
            <GraduationCap className="w-8 h-8 text-purple-400" />
            <h2 className="text-3xl font-bold text-white">Education</h2>
          </div>

          <div className="space-y-8">
            {education.map((edu, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative pl-8 border-l-2 border-purple-500/30 last:border-l-0"
              >
                <div className="absolute -left-4 top-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-lg border-4 border-gray-900">
                  {edu.logo}
                </div>
                
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 ml-6 hover:scale-[1.02] transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{edu.title}</h3>
                      <h4 className="text-xl text-purple-400 mb-2">{edu.company}</h4>
                      <h5 className="text-lg text-gray-300 mb-2">{edu.institution}</h5>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{edu.period}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{edu.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-6 leading-relaxed">{edu.description}</p>

                  <div>
                    <h5 className="text-lg font-semibold text-white mb-3">Achievements:</h5>
                    <ul className="space-y-2">
                      {edu.achievements.map((achievement, achIndex) => (
                        <li key={achIndex} className="flex items-start gap-3">
                          <Award className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300 text-sm">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div variants={itemVariants} className="mb-20">
          <div className="flex items-center gap-3 mb-12">
            <Award className="w-8 h-8 text-green-400" />
            <h2 className="text-3xl font-bold text-white">Certifications</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{cert.logo}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">{cert.title}</h3>
                    <p className="text-blue-400 mb-2">{cert.issuer}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">{cert.date}</span>
                      <button className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors text-sm">
                        <ExternalLink className="w-4 h-4" />
                        Verify
                      </button>
                    </div>
                    <p className="text-gray-500 text-xs mt-2">ID: {cert.credentialId}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Badges Section */}
        <motion.div variants={itemVariants} className="mb-20">
          <div className="flex items-center gap-3 mb-12">
            <Award className="w-8 h-8 text-yellow-400" />
            <h2 className="text-3xl font-bold text-white">Badges</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:scale-105 transition-all duration-300 flex flex-col items-center text-center"
              >
                <img
                  src={badge.image}
                  alt={badge.title}
                  className="w-20 h-20 object-contain mb-4  bg-white"
                />
                <h3 className="text-lg font-bold text-white mb-2">{badge.title}</h3>
                <p className="text-yellow-400 mb-2">{badge.issuer}</p>
                <a
                  href={badge.verifyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm justify-center"
                >
                  <ExternalLink className="w-4 h-4" />
                  Verify
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Download Resume */}
        {/* <motion.div variants={itemVariants} className="text-center">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-lg rounded-2xl p-12 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-6">Want to Know More?</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Download my detailed resume to get a comprehensive overview of my experience and skills
            </p>
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 mx-auto">
              <Download className="w-5 h-5" />
              Download Resume
            </button>
          </div>
        </motion.div> */}

        
      </motion.div>
    </div>
    </>
  );
};

export default Experience;