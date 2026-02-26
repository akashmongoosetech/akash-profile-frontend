import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  X, 
  Code, 
  Palette, 
  Database, 
  Cloud, 
  Smartphone,
  TrendingUp,
  Users,
  Clock,
  Star,
  Briefcase,
  Lightbulb,
  Target,
  Rocket
} from 'lucide-react';

interface CaseStudy {
  id: number;
  title: string;
  category: string;
  client: string;
  duration: string;
  thumbnail: string;
  color: string;
  icon: React.ElementType;
  overview: string;
  challenge: string;
  solution: string;
  results: { label: string; value: string; icon: React.ElementType }[];
  technologies: string[];
  testimonial?: {
    text: string;
    author: string;
    position: string;
    avatar: string;
  };
}

const CaseStudies: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [filter, setFilter] = useState('all');

  const caseStudies: CaseStudy[] = [
    {
      id: 1,
      title: 'E-Commerce Platform for Fashion Brand',
      category: 'Web Development',
      client: 'StyleHub India',
      duration: '3 months',
      thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=500&fit=crop',
      color: 'from-pink-500 to-rose-500',
      icon: Code,
      overview: 'A full-featured e-commerce platform with modern design, seamless checkout experience, and inventory management system.',
      challenge: 'The client needed a scalable e-commerce solution that could handle thousands of products, provide fast loading times, and offer a smooth mobile shopping experience while maintaining brand aesthetics.',
      solution: 'Built a Next.js-based e-commerce platform with optimized images, lazy loading, and a custom checkout flow. Implemented Redis caching for performance and integrated payment gateways including Razorpay.',
      results: [
        { label: 'Performance Boost', value: '85%', icon: TrendingUp },
        { label: 'Mobile Traffic', value: '68%', icon: Smartphone },
        { label: 'Conversion Rate', value: '3.2x', icon: Target },
        { label: 'User Satisfaction', value: '4.8/5', icon: Star }
      ],
      technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'MongoDB', 'Redis', 'Razorpay'],
      // testimonial: {
      //   text: "The team delivered an exceptional e-commerce platform that transformed our online business. Sales increased by 150% within the first quarter.",
      //   author: 'Priya Sharma',
      //   position: 'CEO, ModernHub India',
      //   avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
      // }
    },
    {
      id: 2,
      title: 'AI-Powered Healthcare Dashboard',
      category: 'AI Solutions',
      client: 'MediCare Plus',
      duration: '4 months',
      thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=500&fit=crop',
      color: 'from-blue-500 to-cyan-500',
      icon: Database,
      overview: 'An intelligent healthcare management system with AI-driven patient analytics, appointment scheduling, and medical record management.',
      challenge: 'Healthcare providers needed a centralized system to manage patient data, visualize health trends, and streamline appointment scheduling while ensuring HIPAA compliance.',
      solution: 'Developed a comprehensive dashboard with React and Python backend. Implemented machine learning models for patient risk prediction and automated appointment reminders.',
      results: [
        { label: 'Time Saved', value: '40hrs/week', icon: Clock },
        { label: 'Data Accuracy', value: '99.9%', icon: Target },
        { label: 'Patient Engagement', value: '65%', icon: Users },
        { label: 'ROI', value: '220%', icon: TrendingUp }
      ],
      technologies: ['React', 'Python', 'TensorFlow', 'PostgreSQL', 'FastAPI', 'Docker', 'AWS'],
      // testimonial: {
      //   text: "The AI-powered analytics helped us identify at-risk patients early and improve overall care quality. Truly revolutionary for our practice.",
      //   author: 'Dr. Rajesh Kumar',
      //   position: 'Medical Director, MediCare Plus',
      //   avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop'
      // }
    },
    {
      id: 3,
      title: 'Restaurant Management System',
      category: 'Web Development',
      client: 'Taste of India Restaurants',
      duration: '2.5 months',
      thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=500&fit=crop',
      color: 'from-orange-500 to-amber-500',
      icon: Palette,
      overview: 'Complete restaurant management solution with online ordering, table reservation, inventory tracking, and staff management.',
      challenge: 'Multiple restaurant locations needed a unified system to manage orders, track inventory in real-time, and provide customers with seamless dining experience.',
      solution: 'Created a centralized dashboard with real-time synchronization across all locations. Built custom modules for kitchen display system and customer loyalty program.',
      results: [
        { label: 'Order Processing', value: '60% faster', icon: TrendingUp },
        { label: 'Inventory Waste', value: '45% reduction', icon: Target },
        { label: 'Customer Retention', value: '35% increase', icon: Users },
        { label: 'Revenue Growth', value: '28%', icon: Star }
      ],
      technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'Redis', 'AWS S3'],
      // testimonial: {
      //   text: "This system revolutionized how we operate. From kitchen management to customer service, everything is streamlined and efficient.",
      //   author: 'Amit Patel',
      //   position: 'Owner, Taste of India',
      //   avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
      // }
    },
    {
      id: 4,
      title: 'Real Estate Property Portal',
      category: 'Web Development',
      client: 'EstatePro Realty',
      duration: '3.5 months',
      thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop',
      color: 'from-green-500 to-emerald-500',
      icon: Cloud,
      overview: 'A feature-rich real estate platform with property listings, virtual tours, agent management, and lead generation system.',
      challenge: 'The real estate agency needed a modern platform to showcase properties with virtual tours, manage agent profiles, and capture quality leads effectively.',
      solution: 'Built a Next.js application with 360° virtual tour integration, advanced search filters, and automated lead nurturing system with CRM integration.',
      results: [
        { label: 'Lead Generation', value: '200% increase', icon: Users },
        { label: 'Property Views', value: '5x growth', icon: TrendingUp },
        { label: 'Conversion Rate', value: '4.5%', icon: Target },
        { label: 'Page Load Time', value: '<1s', icon: Clock }
      ],
      technologies: ['Next.js', 'React', 'Three.js', 'PostgreSQL', 'Prisma', 'Vercel']
    },
    {
      id: 5,
      title: 'Fitness Tracking Mobile App',
      category: 'Mobile App',
      client: 'FitLife Gym Chain',
      duration: '4 months',
      thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=500&fit=crop',
      color: 'from-purple-500 to-violet-500',
      icon: Smartphone,
      overview: 'A comprehensive fitness application with workout tracking, nutrition planning, progress analytics, and social features.',
      challenge: 'A gym chain wanted to engage members with a mobile app that tracks workouts, provides personalized training plans, and builds community.',
      solution: 'Developed a React Native app with wearable device integration, AI-powered workout recommendations, and in-app social features with challenges.',
      results: [
        { label: 'Active Users', value: '10,000+', icon: Users },
        { label: 'User Retention', value: '78%', icon: Target },
        { label: 'Daily Engagement', value: '45 min avg', icon: Clock },
        { label: 'App Rating', value: '4.7/5', icon: Star }
      ],
      technologies: ['React Native', 'Firebase', 'Node.js', 'TensorFlow Lite', 'HealthKit', 'Google Fit']
    },
    {
      id: 6,
      title: 'SaaS Project Management Tool',
      category: 'Web Development',
      client: 'TaskFlow Solutions',
      duration: '5 months',
      thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop',
      color: 'from-indigo-500 to-blue-500',
      icon: Briefcase,
      overview: 'A cloud-based project management platform with team collaboration, time tracking, reporting, and workflow automation.',
      challenge: 'Remote teams needed a comprehensive tool to manage projects, track time, collaborate seamlessly, and generate insightful reports.',
      solution: 'Built a full-featured SaaS application with real-time collaboration, Gantt charts, time tracking, and customizable workflows with automation rules.',
      results: [
        { label: 'Team Productivity', value: '40% boost', icon: TrendingUp },
        { label: 'Time Saved', value: '15hrs/week', icon: Clock },
        { label: 'Project Delivery', value: '30% faster', icon: Target },
        { label: 'Customer NPS', value: '72', icon: Star }
      ],
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Socket.io', 'AWS', 'Redis', 'Stripe']
    }
  ];

  const categories = ['all', 'Web Development', 'Mobile App', 'AI Solutions'];

  const filteredCaseStudies = filter === 'all' 
    ? caseStudies 
    : caseStudies.filter(c => c.category === filter);

  return (
    <>
      <Helmet>
        <title>Case Studies | Akash - Portfolio</title>
        <meta name="description" content="Explore my successful projects and case studies showcasing web development, mobile apps, and AI solutions." />
      </Helmet>

      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              My Work
            </span>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Case Studies
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Explore how I've helped businesses transform their digital presence with innovative solutions. 
              Each project tells a unique story of challenges, creativity, and measurable results.
            </p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center"
          >
            <motion.div className="w-1 h-2 bg-gray-500 rounded-full mt-2" />
          </motion.div>
        </motion.div>
      </div>

      {/* Filter Section */}
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  filter === category
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                {category === 'all' ? 'All Projects' : category}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Case Studies Grid */}
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCaseStudies.map((study, index) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => setSelectedCase(study)}
              >
                <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${study.color} opacity-20`} />
                    <img
                      src={study.thumbnail}
                      alt={study.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium">
                        {study.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                      <span>{study.client}</span>
                      <span>•</span>
                      <span>{study.duration}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                      {study.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                      {study.overview}
                    </p>
                    
                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {study.technologies.slice(0, 3).map((tech, i) => (
                        <span key={i} className="px-2 py-1 rounded-md bg-white/5 text-gray-400 text-xs">
                          {tech}
                        </span>
                      ))}
                      {study.technologies.length > 3 && (
                        <span className="px-2 py-1 rounded-md bg-white/5 text-gray-400 text-xs">
                          +{study.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Results Preview */}
                    <div className="flex gap-4 pt-4 border-t border-white/10">
                      {study.results.slice(0, 2).map((result, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <result.icon className="w-4 h-4 text-blue-400" />
                          <span className="text-white font-semibold">{result.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* View More */}
                    <div className="mt-4 flex items-center text-blue-400 font-medium group-hover:text-blue-300 transition-colors">
                      View Case Study
                      <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 px-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Impact by Numbers
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Every project is an opportunity to create meaningful change
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Briefcase, value: '50+', label: 'Projects Completed' },
              { icon: Users, value: '25+', label: 'Happy Clients' },
              { icon: Clock, value: '2+', label: 'Years Experience' },
              { icon: Star, value: '4.9', label: 'Average Rating' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
            <div className="relative p-12 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Have a Project in Mind?
              </h2>
              <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                Let's discuss how I can help bring your vision to life. I'm always excited 
                to work on innovative projects and challenging problems.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center px-8 py-4 rounded-full bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
              >
                Start a Conversation
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedCase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-20 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedCase(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pt-20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative h-64">
                <img
                  src={selectedCase.thumbnail}
                  alt={selectedCase.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                <button
                  onClick={() => setSelectedCase(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium mb-3">
                    {selectedCase.category}
                  </span>
                  <h2 className="text-3xl font-bold text-white">{selectedCase.title}</h2>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 md:p-8">
                {/* Overview */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    Overview
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{selectedCase.overview}</p>
                </div>

                {/* Challenge */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-red-400" />
                    The Challenge
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{selectedCase.challenge}</p>
                </div>

                {/* Solution */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-green-400" />
                    The Solution
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{selectedCase.solution}</p>
                </div>

                {/* Results */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">Results & Impact</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedCase.results.map((result, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-white/10"
                      >
                        <result.icon className="w-6 h-6 text-blue-400 mb-2" />
                        <div className="text-2xl font-bold text-white">{result.value}</div>
                        <div className="text-sm text-gray-400">{result.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCase.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 rounded-full bg-white/10 text-gray-300 text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Testimonial */}
                {selectedCase.testimonial && (
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-start gap-4">
                      <img
                        src={selectedCase.testimonial.avatar}
                        alt={selectedCase.testimonial.author}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-gray-300 italic mb-3">"{selectedCase.testimonial.text}"</p>
                        <div className="text-white font-semibold">{selectedCase.testimonial.author}</div>
                        <div className="text-gray-400 text-sm">{selectedCase.testimonial.position}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CaseStudies;
