import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Share2, TrendingUp, Brain, Zap, Globe, Smartphone, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const FutureOfWebDevelopment: React.FC = () => {
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
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
              Trends
            </span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center gap-1 text-gray-400 text-sm">
              <Calendar className="w-4 h-4" />
              February 28, 2024
            </span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center gap-1 text-gray-400 text-sm">
              <Clock className="w-4 h-4" />
              10 min read
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
            The Future of Web Development: Trends to Watch in 2024
          </h1>
          
          <p className="text-xl text-gray-400 leading-relaxed">
            Discover the latest trends and technologies shaping the future of web development, from AI integration to edge computing.
          </p>
        </motion.div>

        {/* Hero Image */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src="https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Future of Web Development"
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
              <TrendingUp className="w-6 h-6 text-green-400" />
              The AI Revolution in Web Development
            </h2>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Artificial Intelligence is transforming every aspect of web development, from code generation to user experience optimization. In 2024, we're seeing AI become an integral part of the development workflow.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  AI-Powered Development
                </h4>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Code generation with GitHub Copilot</li>
                  <li>• Automated testing and debugging</li>
                  <li>• Intelligent code reviews</li>
                  <li>• Performance optimization</li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  AI-Enhanced UX
                </h4>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Personalized content delivery</li>
                  <li>• Smart search and recommendations</li>
                  <li>• Voice and gesture interfaces</li>
                  <li>• Predictive user behavior</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Edge Computing and Performance</h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Edge computing is revolutionizing how we deliver web applications, bringing computation closer to users for faster response times and better performance.
            </p>

            <div className="bg-gray-900/50 rounded-lg p-6 mb-6 border border-gray-700">
              <h4 className="font-bold text-white mb-3">Edge Computing Benefits</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Zap className="w-6 h-6 text-blue-400" />
                  </div>
                  <h5 className="font-bold text-white text-sm">Faster Response</h5>
                  <p className="text-gray-400 text-xs">Reduced latency by 50-80%</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Globe className="w-6 h-6 text-green-400" />
                  </div>
                  <h5 className="font-bold text-white text-sm">Global Reach</h5>
                  <p className="text-gray-400 text-xs">Consistent performance worldwide</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Cpu className="w-6 h-6 text-purple-400" />
                  </div>
                  <h5 className="font-bold text-white text-sm">Scalability</h5>
                  <p className="text-gray-400 text-xs">Automatic scaling based on demand</p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Progressive Web Apps (PWAs) Evolution</h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              PWAs continue to evolve, offering native app-like experiences with web technologies. In 2024, we're seeing enhanced capabilities and broader adoption.
            </p>

            <div className="bg-gray-900/50 rounded-lg p-6 mb-6 border border-gray-700">
              <h4 className="font-bold text-white mb-3">Advanced PWA Features</h4>
              <div className="bg-black/30 rounded p-3 text-sm font-mono text-green-400">
                {`// Service Worker with Advanced Caching
const CACHE_NAME = 'my-app-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/scripts/app.js',
  '/images/logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Background Sync for Offline Support
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Push Notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/images/icon-192x192.png',
    badge: '/images/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('New Message', options)
  );
});`}
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">WebAssembly (WASM) and Performance</h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              WebAssembly is enabling high-performance applications on the web, allowing developers to run code at near-native speeds in the browser.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-bold text-white mb-2">WASM Use Cases</h4>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Video and image processing</li>
                  <li>• 3D graphics and gaming</li>
                  <li>• Scientific computing</li>
                  <li>• Audio processing</li>
                  <li>• Cryptography</li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-bold text-white mb-2">Performance Gains</h4>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• 10-20x faster than JavaScript</li>
                  <li>• Near-native performance</li>
                  <li>• Smaller bundle sizes</li>
                  <li>• Cross-platform compatibility</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Micro-Frontends Architecture</h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Micro-frontends are gaining popularity as organizations look to scale their frontend development teams and improve maintainability.
            </p>

            <div className="bg-gray-900/50 rounded-lg p-6 mb-6 border border-gray-700">
              <h4 className="font-bold text-white mb-3">Micro-Frontend Implementation</h4>
              <div className="bg-black/30 rounded p-3 text-sm font-mono text-green-400">
                {`// Module Federation Configuration
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      remotes: {
        header: 'header@http://localhost:3001/remoteEntry.js',
        footer: 'footer@http://localhost:3002/remoteEntry.js',
        product: 'product@http://localhost:3003/remoteEntry.js'
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true }
      }
    })
  ]
};

// Dynamic Component Loading
const Header = React.lazy(() => import('header/Header'));
const Footer = React.lazy(() => import('footer/Footer'));
const ProductList = React.lazy(() => import('product/ProductList'));`}
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Responsive Design Evolution</h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Responsive design is evolving beyond just screen sizes to include new form factors and interaction methods.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Smartphone className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="font-bold text-white mb-2">Mobile-First</h4>
                <p className="text-gray-400 text-sm">Optimized for mobile devices with touch interfaces</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="font-bold text-white mb-2">Adaptive Design</h4>
                <p className="text-gray-400 text-sm">Content adapts to user preferences and context</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-green-400" />
                </div>
                <h4 className="font-bold text-white mb-2">Performance-First</h4>
                <p className="text-gray-400 text-sm">Optimized for speed and user experience</p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Sustainability in Web Development</h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Green web development is becoming increasingly important as we focus on reducing the environmental impact of digital products.
            </p>

            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 mb-6">
              <h4 className="font-bold text-green-400 mb-3">🌱 Sustainable Development Practices</h4>
              <ul className="text-gray-300 space-y-2">
                <li><strong>Optimized Assets:</strong> Compress images, minify code, and use efficient formats</li>
                <li><strong>Efficient Algorithms:</strong> Choose algorithms that minimize computational complexity</li>
                <li><strong>Green Hosting:</strong> Use hosting providers powered by renewable energy</li>
                <li><strong>Lazy Loading:</strong> Load content only when needed to reduce bandwidth</li>
                <li><strong>CDN Optimization:</strong> Use edge computing to reduce server load</li>
              </ul>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Emerging Technologies</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-bold text-white mb-3">Web3 and Blockchain</h4>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Decentralized applications (dApps)</li>
                  <li>• Smart contracts integration</li>
                  <li>• Web3 wallets and authentication</li>
                  <li>• NFT marketplaces</li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-bold text-white mb-3">Extended Reality (XR)</h4>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• WebXR for VR/AR experiences</li>
                  <li>• 3D web applications</li>
                  <li>• Spatial computing interfaces</li>
                  <li>• Immersive storytelling</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Developer Experience (DX) Trends</h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Improving developer experience is crucial for productivity and code quality:
            </p>

            <div className="bg-gray-900/50 rounded-lg p-6 mb-6 border border-gray-700">
              <h4 className="font-bold text-white mb-3">Modern Development Tools</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-bold text-white text-sm mb-2">Build Tools</h5>
                  <ul className="text-gray-400 text-xs space-y-1">
                    <li>• Vite - Lightning fast builds</li>
                    <li>• Turbopack - Rust-based bundler</li>
                    <li>• esbuild - Ultra-fast JavaScript bundler</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white text-sm mb-2">Development Environment</h5>
                  <ul className="text-gray-400 text-xs space-y-1">
                    <li>• GitHub Codespaces</li>
                    <li>• VS Code Dev Containers</li>
                    <li>• AI-powered code completion</li>
                  </ul>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Conclusion</h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              The future of web development in 2024 is characterized by AI integration, performance optimization, and new interaction paradigms. Developers who embrace these trends will be well-positioned to create innovative, efficient, and user-friendly web applications.
            </p>

            <p className="text-gray-300 leading-relaxed">
              The key to success lies in staying adaptable, continuously learning new technologies, and focusing on creating value for users while maintaining high performance and accessibility standards.
            </p>
          </div>
        </motion.div>

        {/* Author Info */}
        <motion.div variants={itemVariants} className="mt-12">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">Alex Thompson</h3>
                <p className="text-gray-400 text-sm">Technology Evangelist & Future Trends Analyst</p>
                <p className="text-gray-500 text-sm">Passionate about emerging technologies and their impact on web development, with expertise in AI and next-generation web platforms.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FutureOfWebDevelopment; 