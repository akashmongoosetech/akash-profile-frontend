import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Filter } from 'lucide-react';

const Projects: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'React', 'Node.js', 'Full Stack', 'Mobile'];

  const projects = [
    {
      id: 1,
      title: 'Hotel Management & Booking System',
      description: 'A full-stack hotel management and booking platform developed using React, Node.js, and MongoDB. The system enables customers to browse rooms, check real-time availability, make secure online bookings, and manage reservations. The admin panel provides complete control over room management, pricing, booking status, customer data, and analytics.',
      image: 'https://ik.imagekit.io/sentyaztie/WhatsApp%20Image%202026-02-21%20at%2010.33.36%20AM.jpeg?updatedAt=1771650381217',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      category: 'Full Stack',
      demoUrl: 'http://shribalajihomestay.in',
    },
    {
      id: 2,
      title: 'Event & Catering Management',
      description: 'A full-stack event management and catering platform with a modern, responsive design. The system allows clients to book events, select catering services, customize menus, and track event details in real time. The admin panel provides complete control over event scheduling, package management, customer data, payments, and analytics.',
      image: 'https://ik.imagekit.io/sentyaztie/eve.jpeg?updatedAt=1771650621892',
      tags: ['React', 'Tailwind CSS', 'Sass', 'Shadcn UI', 'Chart.js, React Chartjs 2'],
      category: 'React',
      demoUrl: 'https://anjanievents.in/',
    },
    {
      id: 3,
      title: 'Massage & SPA',
      description: 'A beautifully designed and fully responsive massage & spa website built with a modern UI/UX approach. The platform allows customers to explore services, book appointments online, view therapist profiles, and make secure payments. The admin panel enables complete control over services, pricing, therapist schedules, customer bookings, and business analytics.',      image: 'https://ik.imagekit.io/sentyaztie/tri.jpeg?updatedAt=1771651123575',
      tags: ['React', 'API Integration', 'Charts', 'Mongodb', 'Frame-Motion'],
      category: 'React',
      demoUrl: 'https://tripod-wellness.netlify.app/',
    },
    {
      id: 4,
      title: 'Social Media API',
      description: 'A modern NGO website and RESTful API developed for Snehjeet Social Welfare Society, focused on LGBTQ+ support, animal welfare, and old-age care initiatives. The platform includes volunteer registration, donation management, event updates, case tracking, and secure user authentication. An advanced admin panel allows administrators to manage campaigns, beneficiaries, volunteers, content, donations, and real-time updates efficiently.',
      image: 'https://ik.imagekit.io/sentyaztie/sneh.png?updatedAt=1771652576086',
      tags: ['Node.js', 'Express', 'PostgreSQL', 'React', 'Zod'],
      category: 'Node.js',
      demoUrl: 'https://sneh-jeet-social-welfare-society.netlify.app/',
    },
    {
      id: 5,
      title: 'Pride Community',
      description: 'Pride Voice is a modern, mobile-responsive community and awareness platform designed to support and empower the LGBTQ+ community. The website features event updates, blog posts, educational resources, member registration, and a secure admin panel for managing content, users, campaigns, and announcements.',
      image: 'https://ik.imagekit.io/sentyaztie/pride.jpeg?updatedAt=1771650786179',
      tags: ['React Native', 'Redux', 'API'],
      category: 'Mobile',
      demoUrl: 'http://pridevoice.netlify.app/',
    },
    {
      id: 6,
      title: 'Prescription Generator',
      description: 'A modern prescription generator web application built with a secure admin panel. The system allows doctors to create, manage, and generate patient prescriptions with structured medical details. Features include patient record management, prescription history tracking, automated PDF generation for download/print, and a responsive, user-friendly interface.',
      image: 'https://ik.imagekit.io/sentyaztie/pre.jpeg?updatedAt=1771651761087',
      tags: ['React', 'D3.js', 'Financial API'],
      category: 'Full Stack',
      demoUrl: 'https://bhargava-prescriptions-maker.netlify.app/',
      codeUrl: 'https://github.com'
    }
  ];

  const filteredProjects = selectedFilter === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedFilter);

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
        <title>Projects — Akash Raikwar</title>
        <meta name="title" content="Projects — Akash Raikwar" />
        <meta name="description" content="Explore my portfolio of web development projects. View case studies of web applications, React apps, Node.js projects, and more." />
        <meta property="og:title" content="Projects — Akash Raikwar" />
        <meta property="og:description" content="Explore my portfolio of web development projects. View case studies of web applications, React apps, Node.js projects, and more." />
        <meta property="twitter:title" content="Projects — Akash Raikwar" />
        <meta property="twitter:description" content="Explore my portfolio of web development projects. View case studies of web applications, React apps, Node.js projects, and more." />
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
            My Projects
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A showcase of my recent work and side projects that demonstrate my skills and passion for development.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mb-12">
          <Filter className="w-5 h-5 text-gray-400 mt-2" />
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedFilter === filter
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedFilter}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                layout
                className="group bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden hover:scale-105 transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-white/20 backdrop-blur-lg rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-white" />
                    </a>
                    <a
                      href={project.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-white/20 backdrop-blur-lg rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <Github className="w-4 h-4 text-white" />
                    </a>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-400 mb-4 text-sm leading-relaxed">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-center py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                    >
                      Live Demo
                    </a>
                  {/* <a
                      href={project.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white text-center py-2 rounded-lg font-medium transition-all duration-200"
                    >
                      Source Code
                    </a>*/}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-gray-400 text-lg">No projects found for the selected filter.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
    </>
  );
};

export default Projects;