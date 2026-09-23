import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_BASE_URL, normalizeImageUrl, stripHtmlTags } from '../utils/api';
import {
  ArrowRight,
  Code,
  Palette,
  Database,
  Cloud,
  Smartphone,
  TrendingUp,
  Target,
  Users,
  Clock,
  Star,
  Briefcase,
} from 'lucide-react';

interface CaseStudy {
  _id: string;
  title: string;
  slug: string;
  category: string;
  client: string;
  duration: string;
  thumbnail: string;
  color: string;
  icon: string;
  overview: string;
  challenge: string;
  solution: string;
  results: { label: string; value: string; icon: string }[];
  technologies: string[];
  testimonial?: {
    text: string;
    author: string;
    position: string;
    avatar: string;
  };
  published: boolean;
}

const CaseStudies: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch case studies
  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/case-studies/public`);
        const data = await response.json();
        if (data.success) {
          setCaseStudies(data.caseStudies || []);
        }
      } catch (error) {
        console.error('Error fetching case studies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudies();
  }, []);

  // Map icon string to component
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ElementType } = {
      Code,
      Palette,
      Database,
      Cloud,
      Smartphone,
      TrendingUp,
      Target,
      Users,
      Star,
      Clock,
    };
    return iconMap[iconName] || Code;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading case studies...</div>
      </div>
    );
  }



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
                key={study._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link
                  to={`/case-studies/${study.slug || study._id}`}
                  className="block cursor-pointer"
                  aria-label={`View ${study.title}`}
                >
                <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${study.color} opacity-20`} />
                    <img
                      src={normalizeImageUrl(study.thumbnail)}
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
                      {stripHtmlTags(study.overview)}
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
                      {study.results.slice(0, 2).map((result, i) => {
                        const IconComponent = getIconComponent(result.icon);
                        return (
                          <div key={i} className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4 text-blue-400" />
                            <span className="text-white font-semibold">{result.value}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* View More */}
                    <div className="mt-4 flex items-center text-blue-400 font-medium group-hover:text-blue-300 transition-colors">
                      View Case Study
                      <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
                </Link>
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

    </>
  );
};

export default CaseStudies;
