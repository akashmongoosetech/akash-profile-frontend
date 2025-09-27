import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Share2, Database, Zap, TrendingUp, Shield, BarChart3, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const DatabasePerformanceOptimization: React.FC = () => {
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
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm font-medium">
              Database
            </span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center gap-1 text-gray-400 text-sm">
              <Calendar className="w-4 h-4" />
              February 20, 2024
            </span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center gap-1 text-gray-400 text-sm">
              <Clock className="w-4 h-4" />
              9 min read
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
            Optimizing Database Performance in Production
          </h1>
          
          <p className="text-xl text-gray-400 leading-relaxed">
            Learn essential database optimization techniques including indexing strategies, query optimization, and monitoring best practices.
          </p>
        </motion.div>

        {/* Hero Image */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src="https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Database Performance"
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
              <Database className="w-6 h-6 text-blue-400" />
              Understanding Database Performance
            </h2>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Database performance is critical for application success. Slow queries can lead to poor user experience, increased costs, and scalability issues. Understanding how to optimize database performance is essential for any production system.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-red-400" />
                </div>
                <h4 className="font-bold text-white mb-2">Query Speed</h4>
                <p className="text-gray-400 text-sm">Optimize query execution time</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <h4 className="font-bold text-white mb-2">Throughput</h4>
                <p className="text-gray-400 text-sm">Handle more concurrent requests</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="font-bold text-white mb-2">Reliability</h4>
                <p className="text-gray-400 text-sm">Ensure consistent performance</p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Indexing Strategies</h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Proper indexing is the foundation of database performance. Understanding when and how to create indexes can dramatically improve query performance.
            </p>

            <div className="bg-gray-900/50 rounded-lg p-6 mb-6 border border-gray-700">
              <h4 className="font-bold text-white mb-3">B-Tree Indexes (Most Common)</h4>
              <div className="bg-black/30 rounded p-3 text-sm font-mono text-green-400">
                {`-- Single column index
CREATE INDEX idx_users_email ON users(email);

-- Composite index for multiple columns
CREATE INDEX idx_orders_user_date ON orders(user_id, order_date);

-- Partial index for specific conditions
CREATE INDEX idx_active_users ON users(email) WHERE status = 'active';

-- Unique index to prevent duplicates
CREATE UNIQUE INDEX idx_users_username ON users(username);`}
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Query Optimization Techniques</h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Writing efficient queries is crucial for database performance. Here are key techniques to optimize your SQL queries:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-bold text-white mb-3">SELECT Optimization</h4>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Use specific columns instead of SELECT *</li>
                  <li>• Limit result sets with LIMIT</li>
                  <li>• Use DISTINCT only when necessary</li>
                  <li>• Avoid subqueries in SELECT</li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-bold text-white mb-3">JOIN Optimization</h4>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Use appropriate JOIN types</li>
                  <li>• Index foreign key columns</li>
                  <li>• Avoid CROSS JOINs</li>
                  <li>• Use EXISTS instead of IN for large datasets</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Caching Strategies</h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Implementing effective caching can dramatically reduce database load and improve response times:
            </p>

            <div className="bg-gray-900/50 rounded-lg p-6 mb-6 border border-gray-700">
              <h4 className="font-bold text-white mb-3">Redis Caching Implementation</h4>
              <div className="bg-black/30 rounded p-3 text-sm font-mono text-green-400">
                {`// Redis caching with Node.js
const redis = require('redis');
const client = redis.createClient();

async function getUserWithCache(userId) {
  const cacheKey = \`user:\${userId}\`;
  
  // Try to get from cache first
  let user = await client.get(cacheKey);
  
  if (user) {
    return JSON.parse(user);
  }
  
  // If not in cache, get from database
  const result = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [userId]
  );
  
  user = result.rows[0];
  
  if (user) {
    // Cache for 1 hour
    await client.setex(cacheKey, 3600, JSON.stringify(user));
  }
  
  return user;
}`}
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-yellow-400" />
              Monitoring and Performance Analysis
            </h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Continuous monitoring is essential for maintaining optimal database performance:
            </p>

            <div className="bg-gray-900/50 rounded-lg p-6 mb-6 border border-gray-700">
              <h4 className="font-bold text-white mb-3">Performance Monitoring Queries</h4>
              <div className="bg-black/30 rounded p-3 text-sm font-mono text-green-400">
                {`-- PostgreSQL slow queries
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Index usage statistics
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;`}
              </div>
            </div>

            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-6 mb-6">
              <h4 className="font-bold text-indigo-400 mb-3">💡 Performance Checklist</h4>
              <ul className="text-gray-300 space-y-2">
                <li>✅ <strong>Indexes:</strong> Create appropriate indexes for frequently queried columns</li>
                <li>✅ <strong>Queries:</strong> Optimize slow queries and use query plans</li>
                <li>✅ <strong>Caching:</strong> Implement application and database-level caching</li>
                <li>✅ <strong>Monitoring:</strong> Set up comprehensive performance monitoring</li>
                <li>✅ <strong>Connection Pooling:</strong> Configure proper connection management</li>
                <li>✅ <strong>Schema:</strong> Optimize database design and normalization</li>
              </ul>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Conclusion</h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Database performance optimization is an ongoing process that requires continuous monitoring, analysis, and improvement. By implementing these strategies, you can ensure your database performs efficiently under load and scales with your application's growth.
            </p>

            <p className="text-gray-300 leading-relaxed">
              Remember that optimization should be data-driven. Always measure performance before and after changes, and focus on the areas that provide the most significant impact for your specific use case.
            </p>
          </div>
        </motion.div>

        {/* Author Info */}
        <motion.div variants={itemVariants} className="mt-12">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <Database className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">Maria Santos</h3>
                <p className="text-gray-400 text-sm">Database Administrator & Performance Engineer</p>
                <p className="text-gray-500 text-sm">Expert in database optimization and performance tuning with over 10 years of experience in production environments.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DatabasePerformanceOptimization; 