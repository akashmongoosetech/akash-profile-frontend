import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Testimonials: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: 'Sarah Johnson',
      position: 'CEO, TechStart Inc.',
      company: 'TechStart Inc.',
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      text: 'Akash delivered an exceptional e-commerce platform that exceeded our expectations. His attention to detail and technical expertise helped us launch ahead of schedule. The performance optimizations he implemented resulted in a 40% increase in conversion rates.',
      project: 'E-commerce Platform Development',
      duration: '3 months'
    },
    {
      name: 'Michael Chen',
      position: 'CTO, DataFlow Solutions',
      company: 'DataFlow Solutions',
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      text: 'Working with Akash was a game-changer for our startup. He built a scalable backend infrastructure that handles millions of requests daily. His proactive communication and problem-solving skills made the entire development process smooth and efficient.',
      project: 'Backend API Development',
      duration: '4 months'
    },
    {
      name: 'Emily Rodriguez',
      position: 'Product Manager, InnovateLab',
      company: 'InnovateLab',
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      text: 'Akash transformed our outdated web application into a modern, responsive platform. His expertise in React and UI/UX design principles resulted in a 60% improvement in user engagement. Highly recommend for any web development project.',
      project: 'Web Application Redesign',
      duration: '2 months'
    },
    {
      name: 'David Thompson',
      position: 'Founder, FinanceFlow',
      company: 'FinanceFlow',
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      text: 'The mobile app Akash developed for us has been a huge success. His understanding of both iOS and Android platforms, combined with his attention to security in financial applications, made him the perfect choice for our project.',
      project: 'Mobile Banking App',
      duration: '5 months'
    },
    {
      name: 'Lisa Wang',
      position: 'Marketing Director, GrowthHack',
      company: 'GrowthHack',
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      text: 'Akash created a beautiful, high-performing website that perfectly represents our brand. The SEO optimizations and performance improvements he implemented resulted in a 200% increase in organic traffic within the first month.',
      project: 'Corporate Website Development',
      duration: '6 weeks'
    },
    {
      name: 'James Miller',
      position: 'Operations Manager, LogiTech Pro',
      company: 'LogiTech Pro',
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      text: 'The inventory management system Akash built has revolutionized our operations. His ability to understand complex business requirements and translate them into efficient code is remarkable. The system has reduced our processing time by 70%.',
      project: 'Inventory Management System',
      duration: '4 months'
    }
  ];

  const stats = [
    { number: '50+', label: 'Projects Completed' },
    { number: '25+', label: 'Happy Clients' },
    { number: '4.9/5', label: 'Average Rating' },
    { number: '100%', label: 'Client Satisfaction' }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

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
            Client Testimonials
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Don't just take my word for it. Here's what my clients have to say about working with me.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Testimonial */}
        <motion.div variants={itemVariants} className="mb-20">
          <div className="relative bg-white/5 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10 overflow-hidden">
            {/* Background Quote */}
            <div className="absolute top-8 right-8 opacity-10">
              <Quote className="w-32 h-32 text-blue-400" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
              >
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  {/* Client Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={testimonials[currentTestimonial].image}
                      alt={testimonials[currentTestimonial].name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-blue-500/30"
                    />
                  </div>

                  {/* Testimonial Content */}
                  <div className="flex-1 text-center lg:text-left">
                    {/* Rating */}
                    <div className="flex justify-center lg:justify-start gap-1 mb-4">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-xl md:text-2xl text-gray-200 mb-6 leading-relaxed">
                      "{testimonials[currentTestimonial].text}"
                    </blockquote>

                    {/* Client Info */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white">
                        {testimonials[currentTestimonial].name}
                      </h3>
                      <p className="text-blue-400">
                        {testimonials[currentTestimonial].position}
                      </p>
                      <p className="text-gray-400">
                        {testimonials[currentTestimonial].company}
                      </p>
                    </div>

                    {/* Project Info */}
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-400">
                        <span>
                          <strong className="text-white">Project:</strong> {testimonials[currentTestimonial].project}
                        </span>
                        <span>
                          <strong className="text-white">Duration:</strong> {testimonials[currentTestimonial].duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Dots */}
              <div className="flex gap-2">
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

              <button
                onClick={nextTestimonial}
                className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* All Testimonials Grid */}
        <motion.div variants={itemVariants} className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">All Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-white">{testimonial.name}</h3>
                    <p className="text-sm text-gray-400">{testimonial.position}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-4">
                  "{testimonial.text}"
                </p>

                <div className="text-xs text-gray-500">
                  <span className="text-blue-400">{testimonial.project}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-lg rounded-2xl p-12 border border-white/10">
            <Users className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Join My Happy Clients?</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Let's work together to create something amazing. I'm committed to delivering exceptional results that exceed your expectations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105">
                Start Your Project
              </Link>
              <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105 backdrop-blur-lg border border-white/20">
                <a href="tel:+919685533878">Schedule a Call</a>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Testimonials;