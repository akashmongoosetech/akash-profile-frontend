import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Users, Briefcase, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Testimonials: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: 'Dr. Shashank Bhargava',
      position: 'Director.',
      company: 'Bhargava Clinic.',
      image: 'https://lh3.googleusercontent.com/p/AF1QipMu2qECS8hvAogiZ1bDWUDBA5AGg7dXT_g4834m=s680-w680-h510-rw',
      rating: 5,
      text: 'Akash delivered an outstanding prescription generator website that perfectly meets our clinical needs. The system is fast, user-friendly, and highly efficient for managing patient prescriptions. His technical expertise, attention to detail, and understanding of healthcare workflows truly exceeded our expectations.',
      project: 'Health Care Platform Development',
      duration: '1 months'
    },
    {
      name: 'Jitendra Thakur',
      position: 'Founder',
      company: 'Sneh Jeet Social Welfare Society',
      image: 'https://thispersonnotexist.org/downloadimage/Ac3RhdGljL21hbi9zZWVkMjUzOTcuanBlZw==',
      rating: 5,
      text: 'Working with Akash was a game-changer for our startup. He built a scalable backend that handles millions of requests daily.',
      project: 'NGO Management & Backend API Development',
      duration: '1.5 months'
    },
    {
      name: 'Rajesh Verma',
      position: 'Director & CEO',
      company: 'Azad Infrastructure',
      image: 'https://gos3.ibcdn.com/28165e14-1544-49fa-a88e-e0e6e3707244.jpeg',
      rating: 5,
      text: 'Akash transformed our outdated web application into a modern, responsive platform. His expertise in React and UI/UX design principles resulted in a 60% improvement in user engagement. Highly recommend for any web development project.',
      project: 'Web Application Redesign',
      duration: '2 months'
    },
    {
      name: 'Saurabh Agarawal',
      position: 'Founder',
      company: 'Agarawal Enterprises',
      image: 'https://ik.imagekit.io/sentyaztie/cd5ceab0-0fa9-4733-9e4d-ee2673288132.jpg',
      rating: 5,
      text: 'Akash delivered a secure, high-performance enterprise website that perfectly reflects our brand. His technical expertise and professionalism ensured a smooth development process and measurable business growth.',
      project: 'Enterprise Website Development & Digital Platform',
      duration: '4 months'
    },
    {
      name: 'Daniel Thompson',
      position: 'CEO',
      company: 'MapleTech Solutions Inc.',
      // image: 'https://randomuser.me/api/portraits/men/45.jpg',
      image: 'https://ik.imagekit.io/sentyaztie/81afa2f2-7f8b-4c26-9477-a05c2f610169.jpg',
      rating: 5,
      text: 'Akash developed a scalable and modern website that strengthened our digital presence across Canada. His attention to performance, security, and user experience made a real impact on our client acquisition.',
      project: 'Corporate Website Development',
      duration: '3 months'
    },
    {
      name: 'Emily Carter',
      position: 'Managing Director',
      company: 'Northern Edge Consulting Ltd.',
      image: 'https://ik.imagekit.io/sentyaztie/3dc9aa0f-6671-4535-b9da-0d2ac3b4fbc5.jpg',
      rating: 5,
      text: 'Akash delivered a clean, high-performing corporate website that aligned perfectly with our brand strategy. His structured approach and technical expertise helped us improve online visibility and client engagement significantly.',
      project: 'Enterprise Website Redesign & Development',
      duration: '4 months'
    },


    {
  name: 'Ryan Mitchell',
  position: 'Founder',
  company: 'TrueNorth Digital Group',
  image: 'https://ik.imagekit.io/sentyaztie/1289b3bb-b680-431e-9795-9ad3bc503824.jpg',
  rating: 5,
  text: 'Akash built a fast, secure, and conversion-focused website that elevated our online presence. His professionalism and technical depth made the entire process smooth and results-driven.',
  project: 'Corporate Website Development',
  duration: '3 months'
},
{
  name: 'Sophia Laurent',
  position: 'Operations Director',
  company: 'Aurora Business Solutions Inc.',
  image: 'https://ik.imagekit.io/sentyaztie/744fa877-7a90-4efe-bb85-cb1aa848d358.jpg',
  rating: 5,
  text: 'The enterprise platform Akash developed for us is modern, scalable, and performance-optimized. We’ve seen improved engagement and stronger brand credibility since launch.',
  project: 'Enterprise Web Platform Development',
  duration: '5 months'
},
{
  name: 'Jason Clarke',
  position: 'CEO',
  company: 'Pacific Crest Innovations Ltd.',
  image: 'https://ik.imagekit.io/sentyaztie/1ac721ee-099e-4a82-88a0-41cde1452b94.jpg',
  rating: 5,
  text: 'Akash delivered a secure and user-friendly corporate website tailored to our business goals. His strategic thinking and attention to detail exceeded our expectations.',
  project: 'Corporate Website Design & Development',
  duration: '4 months'
}
  ];

  const stats = [
    { number: '50+', label: 'Projects Completed', icon: <Briefcase className="w-6 h-6" /> },
    { number: '25+', label: 'Happy Clients', icon: <Users className="w-6 h-6" /> },
    { number: '4.9/5', label: 'Average Rating', icon: <Star className="w-6 h-6" /> },
    { number: '100%', label: 'Client Satisfaction', icon: <Heart className="w-6 h-6" /> }
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
    <>
      <Helmet>
        <title>Testimonials — Akash Raikwar</title>
        <meta name="title" content="Testimonials — Akash Raikwar" />
        <meta name="description" content="Read what clients and colleagues say about working with Akash Raikwar. View testimonials for web development projects and collaborations." />
        <meta property="og:title" content="Testimonials — Akash Raikwar" />
        <meta property="og:description" content="Read what clients and colleagues say about working with Akash Raikwar. View testimonials for web development projects and collaborations." />
        <meta property="twitter:title" content="Testimonials — Akash Raikwar" />
        <meta property="twitter:description" content="Read what clients and colleagues say about working with Akash Raikwar. View testimonials for web development projects and collaborations." />
      </Helmet>
      <div className="min-h-screen pt-20 pb-16 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 mb-6"
          >
            <Star className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Client Reviews</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-gray-300 bg-clip-text text-transparent mb-6">
            Client Testimonials
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Don't just take my word for it. Here's what my clients have to say about working with me.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300 group"
            >
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                  <div className="text-blue-400 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Testimonial */}
        <motion.div variants={itemVariants} className="mb-20">
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-8 right-8 opacity-10">
              <Quote className="w-32 h-32 text-blue-400" />
            </div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50, rotate: 1 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                exit={{ opacity: 0, x: -50, rotate: -1 }}
                transition={{ duration: 0.5, type: 'spring', damping: 20 }}
                className="relative z-10"
              >
                <div className="flex flex-col lg:flex-row items-center gap-10">
                  {/* Client Image */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-50 animate-pulse" />
                      <img
                        src={testimonials[currentTestimonial].image}
                        alt={testimonials[currentTestimonial].name}
                        className="relative w-28 h-28 rounded-full object-cover border-4 border-white/20 shadow-2xl"
                      />
                    </div>
                  </div>

                  {/* Testimonial Content */}
                  <div className="flex-1 text-center lg:text-left">
                    {/* Rating */}
                    <div className="flex justify-center lg:justify-start gap-1 mb-4">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        </motion.div>
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-xl md:text-2xl text-gray-200 mb-6 leading-relaxed font-light">
                      "{testimonials[currentTestimonial].text}"
                    </blockquote>

                    {/* Client Info */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white">
                        {testimonials[currentTestimonial].name}
                      </h3>
                      <p className="text-blue-400 font-medium">
                        {testimonials[currentTestimonial].position}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {testimonials[currentTestimonial].company}
                      </p>
                    </div>

                    {/* Project Info */}
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <div className="flex flex-col sm:flex-row gap-4 text-sm">
                        <span className="bg-white/5 px-4 py-2 rounded-lg">
                          <strong className="text-white">Project:</strong> <span className="text-gray-300">{testimonials[currentTestimonial].project}</span>
                        </span>
                        <span className="bg-white/5 px-4 py-2 rounded-lg">
                          <strong className="text-white">Duration:</strong> <span className="text-gray-300">{testimonials[currentTestimonial].duration}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-10">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevTestimonial}
                className="w-14 h-14 bg-white/10 hover:bg-blue-500/30 rounded-full flex items-center justify-center transition-all duration-200 border border-white/10 hover:border-blue-500/50"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </motion.button>

              {/* Dots */}
              <div className="flex gap-3">
                {testimonials.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? 'w-10 h-3 bg-gradient-to-r from-blue-500 to-purple-500'
                        : 'w-3 h-3 bg-white/30 hover:bg-white/50'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextTestimonial}
                className="w-14 h-14 bg-white/10 hover:bg-blue-500/30 rounded-full flex items-center justify-center transition-all duration-200 border border-white/10 hover:border-blue-500/50"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* All Testimonials Grid */}
        <motion.div variants={itemVariants} className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">All Reviews</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => setCurrentTestimonial(index)}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 cursor-pointer transition-all duration-300 group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="relative w-14 h-14 rounded-full object-cover border-2 border-white/20"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">{testimonial.name}</h3>
                    <p className="text-sm text-gray-400">{testimonial.position}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-4">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    <span className="text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full">{testimonial.project}</span>
                  </div>
                  <span className="text-xs text-gray-500">{testimonial.duration}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div variants={itemVariants}>
          <div className="relative bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl p-12 border border-white/10 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-2xl">
                  <Users className="w-12 h-12 text-blue-400" />
                </div>
              </div>
              <h2 className="text-4xl font-bold text-white text-center mb-6">
                Ready to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Join My Happy Clients?</span>
              </h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto text-center leading-relaxed">
                Let's work together to create something amazing. I'm committed to delivering exceptional results that exceed your expectations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/contact" 
                    className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                  >
                    Start Your Project
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <a 
                    href="tel:+919685533878"
                    className="inline-block bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-200 backdrop-blur-lg border border-white/20 hover:border-white/40"
                  >
                    Schedule a Call
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
    </>
  );
};

export default Testimonials;