import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Github, 
  Linkedin, 
  Instagram,
  Facebook,
  Mail, 
  Star, 
  Users, 
  Award, 
  Coffee, 
  MapPin, 
  Calendar,
  Code,
  Shield,
  Smartphone,
  Database,
  Cloud,
  CheckCircle,
  Quote,
  ExternalLink,
  MessageCircle,
  TrendingUp,
  Target,
  Rocket,
  Lightbulb,
  Palette,
  Hammer,
  Bug,
  Zap,
  Heart,
  Send,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Layout,
  Layers,
  FileText,
  Server,
  Package
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const stats = [
    { icon: Award, value: '4+', label: 'Years Experience', color: 'from-blue-500 to-cyan-500' },
    { icon: Users, value: '50+', label: 'Projects Completed', color: 'from-green-500 to-emerald-500' },
    { icon: Star, value: '25+', label: 'Happy Clients', color: 'from-purple-500 to-violet-500' },
    { icon: Coffee, value: '1000+', label: 'Cups of Coffee', color: 'from-orange-500 to-red-500' }
  ];

  const services = [
    {
      title: 'Frontend Development',
      description: 'Modern, responsive web applications using React, Next.js, and TypeScript',
      icon: Code,
      color: 'from-blue-500 to-cyan-500',
      features: ['React & Next.js', 'TypeScript', 'Tailwind CSS', 'PWA Development']
    },
    {
      title: 'Backend Development',
      description: 'Scalable APIs and server-side solutions with Node.js and Python',
      icon: Database,
      color: 'from-green-500 to-emerald-500',
      features: ['Node.js & Express', 'Python & Django', 'RESTful APIs', 'GraphQL']
    },
    {
      title: 'Mobile Development',
      description: 'Cross-platform mobile apps with React Native and Flutter',
      icon: Smartphone,
      color: 'from-purple-500 to-violet-500',
      features: ['React Native', 'Flutter', 'iOS & Android', 'App Store Deployment']
    },
    {
      title: 'Cloud & DevOps',
      description: 'AWS deployment, Docker containerization, and CI/CD pipelines',
      icon: Cloud,
      color: 'from-orange-500 to-red-500',
      features: ['AWS & Azure', 'Docker & Kubernetes', 'CI/CD Pipelines', 'Monitoring']
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Shashank Bhargava',
      position: 'Director, Bhargava Clinic.',
      image: 'https://lh3.googleusercontent.com/p/AF1QipMu2qECS8hvAogiZ1bDWUDBA5AGg7dXT_g4834m=s680-w680-h510-rw',
      text: 'Akash delivered an outstanding prescription generator website that perfectly meets our clinical needs. The system is fast, user-friendly, and highly efficient for managing patient prescriptions. His technical expertise, attention to detail, and understanding of healthcare workflows truly exceeded our expectations.',
      rating: 5
    },
    {
      name: 'Jitendra Thakur',
      position: 'Founder, Sneh Jeet Social Welfare Society',
      image: 'https://thispersonnotexist.org/downloadimage/Ac3RhdGljL21hbi9zZWVkMjUzOTcuanBlZw==',
      text: 'Working with Akash was a game-changer for our startup. He built a scalable backend that handles millions of requests daily.',
      rating: 5
    },
    {
      name: 'Rajesh Verma',
      position: 'Director & CEO, Azad Infrastructure',
      image: 'https://gos3.ibcdn.com/28165e14-1544-49fa-a88e-e0e6e3707244.jpeg',
      text: 'Akash transformed our outdated application into a modern, responsive platform. The results speak for themselves.',
      rating: 5
    }
  ];

  const featuredProjects = [
    {
      id: 1,
      title: 'Hotel Management & Booking System',
      description: 'A full-stack hotel management and booking platform developed using React, Node.js, and MongoDB. The system enables customers to browse rooms, check real-time availability, make secure online bookings, and manage reservations. The admin panel provides complete control over room management, pricing, booking status, customer data, and analytics.',
      image: 'https://ik.imagekit.io/sentyaztie/WhatsApp%20Image%202026-02-21%20at%2010.33.36%20AM.jpeg?updatedAt=1771650381217',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      demoUrl: 'http://shribalajihomestay.in',
      codeUrl: '#'
    },
    {
      id: 2,
      title: 'Event & Catering Management',
      description: 'A full-stack event management and catering platform with a modern, responsive design. The system allows clients to book events, select catering services, customize menus, and track event details in real time. The admin panel provides complete control over event scheduling, package management, customer data, payments, and analytics.',
      image: 'https://ik.imagekit.io/sentyaztie/eve.jpeg?updatedAt=1771650621892',
      tags: ['React', 'Tailwind CSS', 'Sass', 'Shadcn UI', 'Chart.js'],
      demoUrl: 'https://anjanievents.in/',
      codeUrl: '#'
    },
    {
      id: 3,
      title: 'Massage & SPA',
      description: 'A beautifully designed and fully responsive massage & spa website built with a modern UI/UX approach. The platform allows customers to explore services, book appointments online, view therapist profiles, and make secure payments. The admin panel enables complete control over services, pricing, therapist schedules, customer bookings, and business analytics.',
      image: 'https://ik.imagekit.io/sentyaztie/tri.jpeg?updatedAt=1771651123575',
      tags: ['React', 'API Integration', 'Charts', 'MongoDB', 'Frame-Motion'],
      demoUrl: 'https://tripod-wellness.netlify.app/',
      codeUrl: '#'
    },
    {
      id: 4,
      title: 'Prescription Generator',
      description: 'A comprehensive prescription generator system for healthcare providers. Features include patient management, prescription creation, drug interaction checking, PDF generation, and print-friendly layouts. Built with modern React and Node.js technologies.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
      tags: ['React', 'Node.js', 'MongoDB', 'PDF'],
      demoUrl: '#',
      codeUrl: '#'
    },
    {
      id: 5,
      title: 'E-Commerce Platform',
      description: 'A full-featured e-commerce platform with product catalog, shopping cart, payment integration, order management, and admin dashboard. Includes user authentication, wishlist, reviews, and responsive design for all devices.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
      tags: ['React', 'Node.js', 'Stripe', 'MongoDB'],
      demoUrl: '#',
      codeUrl: '#'
    },
    {
      id: 6,
      title: 'Social Welfare Platform',
      description: 'A comprehensive platform for social welfare organizations to manage campaigns, donations, volunteers, and events. Features include real-time tracking, reporting, and donor management.',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800',
      tags: ['React', 'Express', 'MongoDB', 'Analytics'],
      demoUrl: '#',
      codeUrl: '#'
    }
  ];

  const skills = [
    { name: 'React.js', level: 95, color: 'from-blue-500 to-cyan-500' },
    { name: 'Node.js', level: 92, color: 'from-green-500 to-emerald-500' },
    { name: 'TypeScript', level: 90, color: 'from-purple-500 to-violet-500' },
    { name: 'AWS', level: 85, color: 'from-orange-500 to-red-500' },
    { name: 'MongoDB', level: 88, color: 'from-pink-500 to-rose-500' },
    { name: 'Docker', level: 82, color: 'from-indigo-500 to-purple-500' }
  ];

  const achievements = [
    {
      icon: TrendingUp,
      title: '200% Performance Boost',
      description: 'Optimized applications for better user experience'
    },
    {
      icon: Shield,
      title: 'Zero Security Issues',
      description: 'Implemented robust security measures'
    },
    {
      icon: Target,
      title: '98% Client Satisfaction',
      description: 'Consistently delivering quality solutions'
    },
    {
      icon: Rocket,
      title: 'Fast Delivery',
      description: 'Always meeting project deadlines'
    }
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Discovery & Planning',
      description: 'We start by understanding your vision, goals, and requirements. I analyze your needs and create a detailed project roadmap.',
      icon: Lightbulb,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      step: '02',
      title: 'Design & Prototype',
      description: 'I create stunning UI/UX designs and interactive prototypes to visualize the final product before development begins.',
      icon: Palette,
      color: 'from-pink-500 to-rose-500'
    },
    {
      step: '03',
      title: 'Development',
      description: 'Using cutting-edge technologies, I build robust and scalable solutions with clean, maintainable code.',
      icon: Hammer,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      step: '04',
      title: 'Testing & QA',
      description: 'Rigorous testing ensures your application is bug-free, secure, and performs optimally across all devices.',
      icon: Bug,
      color: 'from-green-500 to-emerald-500'
    },
    {
      step: '05',
      title: 'Deployment & Launch',
      description: 'I deploy your application to production servers and ensure a smooth launch with zero downtime.',
      icon: Rocket,
      color: 'from-purple-500 to-violet-500'
    },
    {
      step: '06',
      title: 'Support & Maintenance',
      description: 'Post-launch support includes updates, optimizations, and ongoing maintenance to keep your app running perfectly.',
      icon: Heart,
      color: 'from-red-500 to-pink-500'
    }
  ];

  const techStack = [
    { name: 'React.js', icon: Layout, color: 'from-blue-400 to-blue-600' },
    { name: 'Next.js', icon: Layers, color: 'from-gray-300 to-gray-500' },
    { name: 'TypeScript', icon: FileText, color: 'from-blue-500 to-blue-700' },
    { name: 'Node.js', icon: Server, color: 'from-green-500 to-green-700' },
    { name: 'Express', icon: Package, color: 'from-gray-400 to-gray-600' },
    { name: 'MongoDB', icon: Database, color: 'from-green-400 to-green-600' },
    { name: 'PostgreSQL', icon: Database, color: 'from-blue-600 to-indigo-700' },
    { name: 'AWS', icon: Cloud, color: 'from-orange-400 to-orange-600' },
    { name: 'Docker', icon: Package, color: 'from-blue-500 to-cyan-500' },
    { name: 'Tailwind CSS', icon: Palette, color: 'from-cyan-400 to-cyan-600' },
    { name: 'GraphQL', icon: Zap, color: 'from-pink-500 to-rose-500' },
    { name: 'Redis', icon: Server, color: 'from-red-500 to-red-700' }
  ];

  const faqs = [
    {
      question: 'What is your development process?',
      answer: 'My development process follows a structured approach: Discovery & Planning, Design & Prototype, Development, Testing & QA, Deployment, and Post-launch Support. I keep you updated at every step and ensure transparent communication throughout the project lifecycle.'
    },
    {
      question: 'How long does it take to build a project?',
      answer: 'Project timeline depends on complexity and scope. A simple website takes 1-2 weeks, while complex web applications can take 2-6 months. I provide detailed timelines during the planning phase and keep you updated on progress.'
    },
    {
      question: 'Do you offer post-launch support?',
      answer: 'Yes! I offer comprehensive post-launch support including bug fixes, security updates, performance optimizations, and new feature implementations. We can discuss a maintenance plan that fits your needs.'
    },
    {
      question: 'What technologies do you specialize in?',
      answer: 'I specialize in modern web technologies including React.js, Next.js, TypeScript, Node.js, MongoDB, PostgreSQL, AWS, Docker, and more. I choose the best tech stack based on your project requirements.'
    },
    {
      question: 'How do you handle payments and contracts?',
      answer: 'I offer flexible payment structures including fixed-price projects and hourly rates. For large projects, I typically work with milestones: 30% upfront, 30% at midpoint, and 40% upon completion.'
    },
    {
      question: 'Can you work with existing codebases?',
      answer: 'Absolutely! I have experience taking over existing projects, understanding the current architecture, and making improvements or adding new features without disrupting existing functionality.'
    }
  ];

  const partners = [
    { name: 'Bhargava Clinic', logo: '🏥' },
    { name: 'Sneh Jeet', logo: '🤝' },
    { name: 'Azad Infrastructure', logo: '🏗️' },
    { name: 'Shri Balaji', logo: '🏨' },
    { name: 'Anjani Events', logo: '🎉' },
    { name: 'Tripod Wellness', logo: '💆' }
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribing(true);
    // Simulate subscription
    setTimeout(() => {
      setIsSubscribing(false);
      setEmail('');
      alert('Thank you for subscribing!');
    }, 1000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
        {/* Enhanced Floating shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              y: [-20, 20, -20],
              rotate: [0, 180, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              y: [20, -20, 20],
              rotate: [360, 180, 0],
              scale: [1, 0.8, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              x: [-30, 30, -30],
              y: [10, -10, 10],
              rotate: [0, 90, 180, 270, 360]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-lg"
          />
          <motion.div
            animate={{
              x: [20, -20, 20],
              y: [-15, 15, -15],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-r from-green-500/15 to-teal-500/15 rounded-full blur-xl"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Enhanced Text Content */}
            <div className="space-y-8 order-2 lg:order-1">
              <motion.div variants={itemVariants} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                  <p className="text-blue-400 font-medium text-lg">Hello, I'm</p>
                </motion.div>
                
                <motion.h1
                  className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                    Akash
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Raikwar
                  </span>
                </motion.h1>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-6">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-200">
                  Software Engineer &
                  <span className="block text-blue-400">Full Stack Developer</span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-400 max-w-2xl leading-relaxed">
                  Crafting scalable and modern web solutions with passion for clean code and innovative technologies. 
                  Specializing in React, Node.js, and cloud architecture.
                </p>
              </motion.div>

              {/* Enhanced Quick Info */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-lg rounded-lg p-3 border border-white/10">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300">Ujjain, India</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-lg rounded-lg p-3 border border-white/10">
                  <Calendar className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300"><a href="tel:+919685533878">Available for hire</a></span>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 group"
                >
                  Hire Me
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/projects"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-lg border border-white/20"
                >
                  View Projects
                </Link>
                {/* <button className="inline-flex items-center justify-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-lg border border-green-500/30">
                  <Download className="w-5 h-5" />
                  Resume
                </button> */}
              </motion.div>

              <motion.div variants={itemVariants} className="flex gap-5">
                {[
                  { icon: Github, href: 'https://github.com/akash007123', color: 'hover:text-gray-400' },
                  { icon: Linkedin, href: 'https://www.linkedin.com/in/akash-raikwar-4a67bb171/', color: 'hover:text-blue-400' },
                  { icon: Mail, href: 'mailto:akashraikwar763@gmail.com', color: 'hover:text-red-400' },
                  { icon: Instagram, href: 'https://www.instagram.com/akashraikwar_007', color: 'hover:text-pink-400' },
                  { icon: Facebook, href: 'https://www.facebook.com/akashraikwar007', color: 'hover:text-blue-400' },
                ].map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-lg border border-white/20 group ${social.color}`}
                    >
                      <Icon className="w-6 h-6 transition-colors" />
                    </a>
                  );
                })}
              </motion.div>
            </div>

            {/* Enhanced Profile Image */}
            <motion.div
              variants={imageVariants}
              className="relative order-1 lg:order-2 flex justify-center"
            >
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                {/* Multiple Animated rings */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-blue-500/30 border-dashed"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 rounded-full border-2 border-purple-500/30 border-dashed"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-8 rounded-full border border-pink-500/20 border-dotted"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-10 rounded-full border border-cyan-500/15 border-dotted"
                />
                
                {/* Enhanced Profile image container */}
                <div className="absolute inset-12 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg border border-white/20 overflow-hidden shadow-2xl">
                  <img
                    src="./my-pic.jpg"
                    alt="Akash Raikwar"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
                </div>

                {/* Enhanced Floating icons */}
                <motion.div
                  animate={{ 
                    y: [-10, 10, -10],
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg border border-white/20"
                >
                  <span className="text-2xl">⚡</span>
                </motion.div>
                <motion.div
                  animate={{ 
                    y: [10, -10, 10],
                    rotate: [0, -5, 5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg border border-white/20"
                >
                  <span className="text-2xl">🚀</span>
                </motion.div>
                <motion.div
                  animate={{ 
                    x: [-5, 5, -5],
                    y: [5, -5, 5],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute top-1/2 -left-8 w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg border border-white/20"
                >
                  <span className="text-xl">💡</span>
                </motion.div>
                <motion.div
                  animate={{ 
                    x: [5, -5, 5],
                    y: [-5, 5, -5],
                    rotate: [0, -10, 10, 0]
                  }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="absolute top-1/4 -right-8 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg border border-white/20"
                >
                  <span className="text-xl">🎯</span>
                </motion.div>
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 15, -15, 0]
                  }}
                  transition={{ duration: 7, repeat: Infinity }}
                  className="absolute bottom-1/4 -right-6 w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg flex items-center justify-center shadow-lg border border-white/20"
                >
                  <span className="text-lg">✨</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Numbers That Matter
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Here's what I've accomplished in my journey as a developer
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-center bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:scale-105 transition-all duration-300 group"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              What I Do Best
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive development services to transform your ideas into powerful digital solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:scale-105 transition-all duration-300 group"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">{service.description}</p>
                  
                  <div className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              View All Services
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Skills Preview Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Technical Expertise
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Proficiency in modern technologies and frameworks
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:scale-105 transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white font-semibold text-lg">{skill.name}</span>
                  <span className="text-gray-400 text-sm">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 1.5, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className={`h-full bg-gradient-to-r ${skill.color} rounded-full relative`}
                  >
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/skills"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-lg border border-white/20"
            >
              View All Skills
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Featured Projects
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A showcase of my recent work and innovative solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                viewport={{ once: true }}
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
                      className="w-8 h-8 bg-white/20 backdrop-blur-lg rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-white" />
                    </a>
                    <a
                      href={project.codeUrl}
                      className="w-8 h-8 bg-white/20 backdrop-blur-lg rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <Github className="w-4 h-4 text-white" />
                    </a>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-400 mb-4 text-sm leading-relaxed">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              View All Projects
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Key Achievements
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Results that demonstrate my commitment to excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-center bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:scale-105 transition-all duration-300 group"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{achievement.title}</h3>
                  <p className="text-gray-400 text-sm">{achievement.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              How I Work
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A systematic approach to deliver exceptional results every time
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processSteps.map((process, index) => {
              const Icon = process.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="group relative bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:scale-105 transition-all duration-300"
                >
                  <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {process.step}
                  </div>
                  <div className={`w-14 h-14 bg-gradient-to-r ${process.color} rounded-xl flex items-center justify-center mb-4 mt-2 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{process.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{process.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Technology Stack
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Modern tools and frameworks I use to build powerful applications
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {techStack.map((tech, index) => {
              const Icon = tech.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 hover:scale-110 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${tech.color} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:rotate-12 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-center text-gray-300 text-sm font-medium">{tech.name}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Trusted By
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Organizations I've had the privilege to work with
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:scale-105 transition-all duration-300 flex flex-col items-center gap-3 min-w-[150px]"
              >
                <span className="text-4xl">{partner.logo}</span>
                <span className="text-gray-300 font-medium text-center">{partner.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Common questions about my services and working process
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-white font-semibold pr-4">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            
            <div className="relative z-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Mail className="w-8 h-8 text-white" />
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Stay Updated
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Subscribe to my newsletter for the latest tech insights, project updates, and exclusive content delivered to your inbox.
              </p>
              
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors backdrop-blur-lg"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubscribing ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Subscribe
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
              
              <p className="text-gray-500 text-sm mt-4">
                No spam, unsubscribe at any time. Your privacy is guaranteed.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              What Clients Say
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Don't just take my word for it - here's what my clients have to say
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative bg-white/5 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10 overflow-hidden"
          >
            <div className="absolute top-8 right-8 opacity-10">
              <Quote className="w-32 h-32 text-blue-400" />
            </div>

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <img
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-500/30"
                  />
                </div>

                <div className="flex-1 text-center lg:text-left">
                  <div className="flex justify-center lg:justify-start gap-1 mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <blockquote className="text-xl md:text-2xl text-gray-200 mb-6 leading-relaxed">
                    "{testimonials[currentTestimonial].text}"
                  </blockquote>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">
                      {testimonials[currentTestimonial].name}
                    </h3>
                    <p className="text-blue-400">
                      {testimonials[currentTestimonial].position}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentTestimonial
                        ? 'bg-blue-400'
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            {/* <Link
              to="/testimonials"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-lg border border-white/20"
            >
              View All Testimonials
              <ArrowRight className="w-5 h-5" />
            </Link> */}
          </motion.div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-lg rounded-3xl p-12 border border-white/10 text-center relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            
            <div className="relative z-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8"
              >
                <Rocket className="w-10 h-10 text-white" />
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Start Your Project?
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
                Let's collaborate and bring your vision to life with cutting-edge technology and innovative solutions. 
                I'm here to help you build something amazing.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 group"
                >
                  Get In Touch
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-lg border border-white/20"
                >
                  View My Work
                </Link>
                <button className="inline-flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-lg border border-green-500/30">
                  <MessageCircle className="w-5 h-5" />
                  <a href="tel:+919685533878">Schedule Call</a>
                </button>
              </div>
              
              <div className="mt-8 flex justify-center gap-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Free Consultation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Quick Response</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Quality Guaranteed</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;