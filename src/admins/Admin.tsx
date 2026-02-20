import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  TrendingUp, 
  User, 
  Inbox, 
  BookOpen, 
  UserPlus,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import ContactTable from '../contact-tables/ContactTable';
import StatsCard from '../components/StatsCard';
import { isAuthenticated } from '../utils/api';

interface ContactStats {
  _id: string;
  count: number;
}

interface AdminStats {
  totalContacts: number;
  pending: number;
  inProgress: number;
  completed: number;
  review: number;
  worked: number;
  rejected: number;
  totalBlogs: number;
  publishedBlogs: number;
  totalSubscribers: number;
  activeSubscribers: number;
}

interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  status: string;
  createdAt: string;
}

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats>({
    totalContacts: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    review: 0,
    worked: 0,
    rejected: 0,
    totalBlogs: 0,
    publishedBlogs: 0,
    totalSubscribers: 0,
    activeSubscribers: 0
  });
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Fetch contact statistics and recent contacts
  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all stats in parallel
      const [statsRes, contactsRes, blogStatsRes, subscriberStatsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/contact/stats`),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/contact`),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/blog/stats`),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/subscription/stats`)
      ]);
      
      const [statsData, contactsData, blogStatsData, subscriberStatsData] = await Promise.all([
        statsRes.json(),
        contactsRes.json(),
        blogStatsRes.json(),
        subscriberStatsRes.json()
      ]);
      
      if (statsRes.ok && contactsRes.ok && blogStatsRes.ok && subscriberStatsRes.ok) {
        // Process contact stats
        const statsArr = statsData.stats as ContactStats[];
        const totalContacts = statsArr.reduce((sum, stat) => sum + stat.count, 0);
        const pending = statsArr.find(stat => stat._id === 'pending')?.count || 0;
        const review = statsArr.find(stat => stat._id === 'review')?.count || 0;
        const worked = statsArr.find(stat => stat._id === 'worked')?.count || 0;
        const done = statsArr.find(stat => stat._id === 'done')?.count || 0;
        const rejected = statsArr.find(stat => stat._id === 'rejected')?.count || 0;
        
        setStats({
          totalContacts,
          pending,
          inProgress: review + worked,
          completed: done,
          review,
          worked,
          rejected,
          totalBlogs: blogStatsData.totalCount || 0,
          publishedBlogs: blogStatsData.publishedCount || 0,
          totalSubscribers: subscriberStatsData.activeCount || 0,
          activeSubscribers: subscriberStatsData.activeCount || 0
        });
        
        // Get 3 most recent contacts
        setRecentContacts((contactsData.contacts as Contact[]).slice(0, 3));
      } else {
        setError(statsData.message || contactsData.message || blogStatsData.message || subscriberStatsData.message || 'Failed to fetch dashboard data');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statsConfig = [
    {
      icon: <Users className="w-6 h-6 text-white" />,
      label: 'Total Contacts',
      value: stats.totalContacts.toString(),
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500'
    },
    {
      icon: <Clock className="w-6 h-6 text-white" />,
      label: 'Pending',
      value: stats.pending.toString(),
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500'
    },
    {
      icon: <Activity className="w-6 h-6 text-white" />,
      label: 'In Progress',
      value: stats.inProgress.toString(),
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-white" />,
      label: 'Completed',
      value: stats.completed.toString(),
      color: 'bg-gradient-to-r from-green-500 to-emerald-500'
    },
    {
      icon: <BookOpen className="w-6 h-6 text-white" />,
      label: 'Total Blogs',
      value: stats.totalBlogs.toString(),
      color: 'bg-gradient-to-r from-indigo-500 to-purple-500'
    },
    {
      icon: <BookOpen className="w-6 h-6 text-white" />,
      label: 'Published',
      value: stats.publishedBlogs.toString(),
      color: 'bg-gradient-to-r from-teal-500 to-cyan-500'
    },
    {
      icon: <UserPlus className="w-6 h-6 text-white" />,
      label: 'Subscribers',
      value: stats.totalSubscribers.toString(),
      color: 'bg-gradient-to-r from-pink-500 to-rose-500'
    },
    {
      icon: <UserPlus className="w-6 h-6 text-white" />,
      label: 'Active Subs',
      value: stats.activeSubscribers.toString(),
      color: 'bg-gradient-to-r from-emerald-500 to-green-500'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500',
      review: 'bg-blue-500',
      worked: 'bg-purple-500',
      done: 'bg-green-500',
      rejected: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-4 mb-4"
          >
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30"
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-gray-300 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-slate-400 max-w-3xl mx-auto"
          >
            Manage your portfolio, monitor contacts, and track your online presence
          </motion.p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div 
            variants={itemVariants}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Dashboard Cards Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {statsConfig.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <StatsCard
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                colorClass={stat.color}
                loading={loading}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Info Cards Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Recent Contacts Card */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Inbox className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Recent Contacts</h3>
                <p className="text-sm text-slate-400">Latest submissions</p>
              </div>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="h-16 bg-slate-700/30 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : recentContacts.length === 0 ? (
              <div className="text-center py-8">
                <User className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No recent contacts</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {recentContacts.map((contact, index) => (
                  <motion.li 
                    key={contact._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(contact.status)}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{contact.name}</p>
                      <p className="text-xs text-slate-400 truncate">{contact.subject}</p>
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </span>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>

          {/* Status Breakdown Card */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Status Breakdown</h3>
                <p className="text-sm text-slate-400">Contact status overview</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Pending', value: stats.pending, color: 'bg-yellow-500', text: 'text-yellow-400' },
                { label: 'In Review', value: stats.review, color: 'bg-blue-500', text: 'text-blue-400' },
                { label: 'Worked', value: stats.worked, color: 'bg-purple-500', text: 'text-purple-400' },
                { label: 'Completed', value: stats.completed, color: 'bg-green-500', text: 'text-green-400' },
                { label: 'Rejected', value: stats.rejected, color: 'bg-red-500', text: 'text-red-400' }
              ].map((item, index) => (
                <motion.div 
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-slate-300 flex-1">{item.label}</span>
                  <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.totalContacts > 0 ? (item.value / stats.totalContacts) * 100 : 0}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                      className={`h-full ${item.color}`}
                    />
                  </div>
                  <span className={`${item.text} font-bold w-8 text-right`}>{item.value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Contact Management */}
        <motion.div variants={itemVariants}>
          <ContactTable onDataChange={fetchStats} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Admin;
