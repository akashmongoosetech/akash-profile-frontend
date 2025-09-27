import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Share2, BookOpen, Code, Zap, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const BuildingScalableReactApplications: React.FC = () => {
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
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Back Button */}
        <motion.div variants={itemVariants} className="mb-8">
          <Link 
            to="/blog"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
              React
            </span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center gap-1 text-gray-400 text-sm">
              <Calendar className="w-4 h-4" />
              March 15, 2024
            </span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center gap-1 text-gray-400 text-sm">
              <Clock className="w-4 h-4" />
              8 min read
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
            Building Scalable React Applications: Best Practices and Patterns
          </h1>
          
          <p className="text-xl text-gray-400 leading-relaxed">
            Learn how to structure and optimize React applications for scale, including component architecture, state management, and performance optimization techniques.
          </p>
        </motion.div>

        {/* Hero Image */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src="https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="React Development"
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        </motion.div>

        {/* Share Button */}
        <motion.div variants={itemVariants} className="mb-12">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-300 hover:bg-white/20 transition-all duration-200">
            <Share2 className="w-4 h-4" />
            Share Article
          </button>
        </motion.div>

        {/* Content */}
        <motion.div variants={itemVariants} className="prose prose-invert prose-lg max-w-none">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Code className="w-6 h-6 text-blue-400" />
              Introduction
            </h2>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Building scalable React applications requires careful consideration of architecture, performance, and maintainability. As applications grow in complexity, developers face challenges in managing state, optimizing performance, and maintaining clean, readable code.
            </p>

            <p className="text-gray-300 mb-8 leading-relaxed">
              In this comprehensive guide, we'll explore the best practices and patterns that help create robust, scalable React applications that can handle growth and complexity while maintaining excellent user experience.
            </p>

            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Key Principles for Scalable React Applications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-bold text-white mb-2">Component Architecture</h4>
                <p className="text-gray-400 text-sm">
                  Design components with single responsibility, proper prop interfaces, and clear separation of concerns.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-bold text-white mb-2">State Management</h4>
                <p className="text-gray-400 text-sm">
                  Choose appropriate state management solutions based on application complexity and requirements.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-bold text-white mb-2">Performance Optimization</h4>
                <p className="text-gray-400 text-sm">
                  Implement code splitting, lazy loading, and memoization to ensure optimal performance.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-bold text-white mb-2">Testing Strategy</h4>
                <p className="text-gray-400 text-sm">
                  Establish comprehensive testing practices including unit, integration, and end-to-end tests.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-400" />
              Component Design Patterns
            </h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Effective component design is the foundation of scalable React applications. Here are some essential patterns:
            </p>

            <div className="bg-gray-900/50 rounded-lg p-6 mb-6 border border-gray-700">
              <h4 className="font-bold text-white mb-3">1. Container/Presentational Pattern</h4>
              <p className="text-gray-300 mb-4">
                Separate business logic from presentation by creating container components that handle data and state, while presentational components focus purely on rendering.
              </p>
              <div className="bg-black/30 rounded p-3 text-sm font-mono text-green-400">
                {`// Container Component
const UserListContainer = () => {
  const [users, setUsers] = useState([]);
  // ... data fetching logic
  return <UserList users={users} />;
};

// Presentational Component
const UserList = ({ users }) => {
  return (
    <div>
      {users.map(user => <UserCard key={user.id} user={user} />)}
    </div>
  );
};`}
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-6 mb-6 border border-gray-700">
              <h4 className="font-bold text-white mb-3">2. Higher-Order Components (HOCs)</h4>
              <p className="text-gray-300 mb-4">
                Use HOCs to share functionality between components without duplicating code.
              </p>
              <div className="bg-black/30 rounded p-3 text-sm font-mono text-green-400">
                {`const withLoading = (WrappedComponent) => {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) return <Spinner />;
    return <WrappedComponent {...props} />;
  };
};`}
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Performance Optimization Techniques
            </h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Performance is crucial for user experience, especially as applications scale. Here are key optimization strategies:
            </p>

            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li><strong>React.memo:</strong> Memoize components to prevent unnecessary re-renders</li>
              <li><strong>useMemo & useCallback:</strong> Optimize expensive calculations and function references</li>
              <li><strong>Code Splitting:</strong> Split your bundle to load only what's needed</li>
              <li><strong>Lazy Loading:</strong> Load components and routes on demand</li>
              <li><strong>Virtual Scrolling:</strong> Handle large lists efficiently</li>
            </ul>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 mb-6">
              <h4 className="font-bold text-blue-400 mb-3">💡 Pro Tip</h4>
              <p className="text-gray-300">
                Always measure performance before and after optimizations. Use React DevTools Profiler and browser performance tools to identify bottlenecks.
              </p>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">State Management Strategies</h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Choosing the right state management solution depends on your application's complexity:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-bold text-white mb-2">Local State</h4>
                <p className="text-gray-400 text-sm mb-2">useState, useReducer</p>
                <p className="text-gray-400 text-xs">For component-specific state</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-bold text-white mb-2">Context API</h4>
                <p className="text-gray-400 text-sm mb-2">React Context</p>
                <p className="text-gray-400 text-xs">For shared state across components</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-bold text-white mb-2">External Libraries</h4>
                <p className="text-gray-400 text-sm mb-2">Redux, Zustand, Recoil</p>
                <p className="text-gray-400 text-xs">For complex global state</p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Conclusion</h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Building scalable React applications requires a combination of good architecture, performance optimization, and maintainable code practices. By following these patterns and principles, you can create applications that grow with your business needs while maintaining excellent user experience.
            </p>

            <p className="text-gray-300 leading-relaxed">
              Remember that scalability is not just about handling more users or data, but also about maintaining code quality and developer productivity as your team and codebase grow.
            </p>
          </div>
        </motion.div>

        {/* Author Info */}
        <motion.div variants={itemVariants} className="mt-12">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">John Doe</h3>
                <p className="text-gray-400 text-sm">Senior React Developer & Technical Lead</p>
                <p className="text-gray-500 text-sm">Passionate about building scalable web applications and sharing knowledge with the developer community.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BuildingScalableReactApplications; 