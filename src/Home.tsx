import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Star, 
  Database,
  Cloud,
  CheckCircle,
  Quote,
  MessageCircle,
  Rocket,
  Palette,
  Zap,
  ChevronDown,
  ChevronUp,
  Layout,
  Layers,
  FileText,
  Server,
  Package,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroSection from './home/Herosection';
import StatsSection from './home/Statssection';
import ServicesSection from './home/Servicessection';
import SkillsSection from './home/Skillssection';
import Projectssection from './home/Projectssection';
import PipelineSection from './home/Pipelinesection';
import ArchitectureSection from './home/Architecturesection';
import PerformanceSection from './home/Performancesection';
import AchievementsSection from './home/Achievementssection';
import ProcessSection from './home/Processsection';

const Home: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
      text: 'Akash transformed our outdated web application into a modern, responsive platform. His expertise in React and UI/UX design principles resulted in a 60% improvement in user engagement. Highly recommend for any web development project.',
      rating: 5
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


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Helmet>
        <title>Akash Raikwar — Full Stack Developer</title>
        <meta name="title" content="Akash Raikwar — Full Stack Developer" />
        <meta name="description" content="Full-stack software engineer specializing in React, Node.js, TypeScript, and MongoDB. I build scalable, responsive web apps and APIs." />
        <meta property="og:title" content="Akash Raikwar — Full Stack Developer" />
        <meta property="og:description" content="Full-stack software engineer specializing in React, Node.js, TypeScript, and MongoDB. I build scalable, responsive web apps and APIs." />
        <meta property="twitter:title" content="Akash Raikwar — Full Stack Developer" />
        <meta property="twitter:description" content="Full-stack software engineer specializing in React, Node.js, TypeScript, and MongoDB. I build scalable, responsive web apps and APIs." />
      </Helmet>
      <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <div className="mt-1">
        <HeroSection />
      </div>

      {/* Enhanced Stats Section */}
      <StatsSection/>

      {/* Enhanced Services Section */}
      <ServicesSection/>

      {/* Skills Preview Section */}
      <SkillsSection/>

      {/* Featured Projects Section */}
      <Projectssection/>

      {/* Live Project Pipeline Section */}
      <PipelineSection/>

      {/* Architecture Snapshot Section */}
      <ArchitectureSection/>

      {/* Performance & Reliability Section */}
      <PerformanceSection/>

      {/* Achievements Section */}
      <AchievementsSection/>

      {/* Process Section */}
      <ProcessSection/>

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
    </>
  );
};

export default Home;
