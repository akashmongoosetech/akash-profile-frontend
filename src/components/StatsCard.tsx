import React from 'react';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  colorClass?: string;
  loading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, label, value, colorClass = '', loading = false }) => {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{label}</p>
          {loading ? (
            <div className="flex items-center gap-2 mt-1">
              <div className="w-6 h-4 bg-gray-600/50 rounded animate-pulse" />
            </div>
          ) : (
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard; 