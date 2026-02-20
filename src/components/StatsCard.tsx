import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  colorClass?: string;
  loading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, label, value, colorClass = '', loading = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -5,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}
      transition={{ duration: 0.3 }}
      className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-sm font-medium group-hover:text-slate-300 transition-colors">{label}</p>
          {loading ? (
            <div className="flex items-center gap-2 mt-2">
              <div className="w-20 h-8 bg-slate-700/50 rounded animate-pulse" />
            </div>
          ) : (
            <motion.p 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl font-bold text-white mt-1"
            >
              {value}
            </motion.p>
          )}
        </div>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorClass} shadow-lg`}
        >
          {icon}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
