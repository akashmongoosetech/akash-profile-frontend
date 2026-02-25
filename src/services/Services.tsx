import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Code, 
  Smartphone, 
  Cloud, 
  Palette, 
  Database, 
  Shield, 
  Zap, 
  Users,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Services: React.FC = () => {
  const services = [
    {
      icon: Code,
      title: 'Frontend Development',
      description: 'Modern, responsive web applications built with the latest technologies',
      features: ['React & Next.js', 'TypeScript', 'Tailwind CSS', 'Progressive Web Apps'],
      color: 'from-blue-500 to-cyan-500',
      price: 'Starting at ₹6,000'
    },
    {
      icon: Database,
      title: 'Backend Development',
      description: 'Scalable server-side solutions and robust API development',
      features: ['Node.js & Express', 'Python & Django', 'RESTful APIs', 'GraphQL'],
      color: 'from-green-500 to-emerald-500',
      price: 'Starting at ₹7,000'
    },
    {
      icon: Smartphone,
      title: 'Mobile Development',
      description: 'Cross-platform mobile applications for iOS and Android',
      features: ['React Native', 'Flutter', 'Native Performance', 'App Store Deployment'],
      color: 'from-purple-500 to-violet-500',
      price: 'Starting at ₹15,000'
    },
    {
      icon: Cloud,
      title: 'Cloud & DevOps',
      description: 'Cloud infrastructure setup and deployment automation',
      features: ['AWS & Azure', 'Docker & Kubernetes', 'CI/CD Pipelines', 'Monitoring & Scaling'],
      color: 'from-orange-500 to-red-500',
      price: 'Starting at ₹25,000'
    },
    {
      icon: Palette,
      title: 'UI/UX Design',
      description: 'Beautiful, user-centered design that converts visitors to customers',
      features: ['Figma Design', 'Prototyping', 'User Research', 'Design Systems'],
      color: 'from-pink-500 to-rose-500',
      price: 'Starting at ₹4,500'
    },
    {
      icon: Shield,
      title: 'Security & Testing',
      description: 'Comprehensive security audits and automated testing solutions',
      features: ['Security Audits', 'Automated Testing', 'Performance Testing', 'Code Reviews'],
      color: 'from-indigo-500 to-purple-500',
      price: 'Starting at ₹3500'
    }
  ];

  const process = [
    {
      step: '01',
      title: 'Discovery & Planning',
      description: 'We start by understanding your business goals, target audience, and project requirements through detailed consultation.'
    },
    {
      step: '02',
      title: 'Design & Prototyping',
      description: 'Creating wireframes, mockups, and interactive prototypes to visualize the final product before development.'
    },
    {
      step: '03',
      title: 'Development & Testing',
      description: 'Building your solution using best practices, with continuous testing and quality assurance throughout.'
    },
    {
      step: '04',
      title: 'Deployment & Support',
      description: 'Launching your project and providing ongoing support, maintenance, and updates as needed.'
    }
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
        <title>Services — Akash Raikwar</title>
        <meta name="title" content="Services — Akash Raikwar" />
        <meta name="description" content="Professional web development services including frontend development, backend development, full-stack solutions, and custom web applications." />
        <meta property="og:title" content="Services — Akash Raikwar" />
        <meta property="og:description" content="Professional web development services including frontend development, backend development, full-stack solutions, and custom web applications." />
        <meta property="twitter:title" content="Services — Akash Raikwar" />
        <meta property="twitter:description" content="Professional web development services including frontend development, backend development, full-stack solutions, and custom web applications." />
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
            My Services
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive development services to transform your ideas into powerful digital solutions
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:scale-105 transition-all duration-300 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">{service.description}</p>
                
                <div className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400 font-semibold">{service.price}</span>
                    {/* <button className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors">
                      Learn More
                      <ArrowRight className="w-4 h-4" />
                    </button> */}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Process Section */}
        <motion.div variants={itemVariants} className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">My Process</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A proven methodology that ensures successful project delivery every time
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative"
              >
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:scale-105 transition-all duration-300">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                </div>
                
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-blue-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Why Choose Me */}
        <motion.div variants={itemVariants} className="mb-20">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-lg rounded-3xl p-12 border border-white/10">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Why Choose Me?</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Here's what sets me apart from other developers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: 'Fast Delivery',
                  description: 'Quick turnaround times without compromising on quality'
                },
                {
                  icon: Users,
                  title: 'Client-Focused',
                  description: 'Your success is my priority. I work closely with you throughout the project'
                },
                {
                  icon: Shield,
                  title: 'Quality Assured',
                  description: 'Rigorous testing and code reviews ensure bug-free, secure applications'
                }
              ].map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                    <p className="text-gray-400">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-12 border border-white/10">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Let's discuss your project and see how I can help bring your vision to life
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2">
                Start Your Project
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105 backdrop-blur-lg border border-white/20">
                <a href="tel:+919685533878">Schedule a Call</a>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
    </>
  );
};

export default Services;