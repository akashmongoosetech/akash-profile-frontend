import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Mail, TrendingUp, Calendar, User, Inbox } from 'lucide-react';
import ContactTable from '../components/ContactTable';
import StatsCard from '../components/StatsCard';

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
  const [stats, setStats] = useState<AdminStats>({
    totalContacts: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    review: 0,
    worked: 0,
    rejected: 0
  });
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch contact statistics and recent contacts
  const fetchStats = async () => {
    try {
      setLoading(true);
      // Stats
      const statsRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/contact/stats`);
      const statsData = await statsRes.json();
      // Recent contacts
      const contactsRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/contact`);
      const contactsData = await contactsRes.json();
      
      if (statsRes.ok && contactsRes.ok) {
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
          rejected
        });
        // Get 3 most recent contacts
        setRecentContacts((contactsData.contacts as Contact[]).slice(0, 3));
      } else {
        setError(statsData.message || contactsData.message || 'Failed to fetch dashboard data');
      }
    } catch (error) {
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
      icon: <Mail className="w-6 h-6 text-white" />,
      label: 'Pending',
      value: stats.pending.toString(),
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      label: 'In Progress',
      value: stats.inProgress.toString(),
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    {
      icon: <Calendar className="w-6 h-6 text-white" />,
      label: 'Completed',
      value: stats.completed.toString(),
      color: 'bg-gradient-to-r from-green-500 to-emerald-500'
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

  // Recent Contacts Card
  const RecentContactsCard = () => (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 flex-1 min-w-[260px]">
      <div className="flex items-center gap-2 mb-4">
        <Inbox className="w-5 h-5 text-blue-400" />
        <span className="text-white font-semibold">Recent Contacts</span>
      </div>
      {loading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => (
            <div key={i} className="h-6 bg-gray-700/40 rounded animate-pulse" />
          ))}
        </div>
      ) : recentContacts.length === 0 ? (
        <p className="text-gray-400 text-sm">No recent contacts</p>
      ) : (
        <ul className="divide-y divide-white/10">
          {recentContacts.map(contact => (
            <li key={contact._id} className="py-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                <span className="text-white font-medium">{contact.name}</span>
                <span className="text-xs text-gray-400 ml-2">{contact.subject}</span>
              </div>
              <div className="text-xs text-gray-400 ml-6">{new Date(contact.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  // Status Breakdown Card
  const StatusBreakdownCard = () => (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 flex-1 min-w-[260px]">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-purple-400" />
        <span className="text-white font-semibold">Status Breakdown</span>
      </div>
      <ul className="space-y-2">
        <li className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
          <span className="text-gray-300">Pending</span>
          <span className="ml-auto text-white font-bold">{stats.pending}</span>
        </li>
        <li className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-full bg-blue-400 inline-block" />
          <span className="text-gray-300">Review</span>
          <span className="ml-auto text-white font-bold">{stats.review}</span>
        </li>
        <li className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-full bg-purple-400 inline-block" />
          <span className="text-gray-300">Worked</span>
          <span className="ml-auto text-white font-bold">{stats.worked}</span>
        </li>
        <li className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />
          <span className="text-gray-300">Done</span>
          <span className="ml-auto text-white font-bold">{stats.completed}</span>
        </li>
        <li className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
          <span className="text-gray-300">Rejected</span>
          <span className="ml-auto text-white font-bold">{stats.rejected}</span>
        </li>
      </ul>
    </div>
  );

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
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Manage your portfolio website, view contact submissions, and monitor your online presence.
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div variants={itemVariants} className="mb-6">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Dashboard Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {statsConfig.map((stat, index) => (
            <StatsCard
              key={stat.label}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              colorClass={stat.color}
              loading={loading}
            />
          ))}
        </motion.div>
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
          <RecentContactsCard />
          <StatusBreakdownCard />
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