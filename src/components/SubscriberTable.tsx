import React, { useEffect, useState } from 'react';
import { RefreshCw, Trash2, CheckCircle, XCircle, Mail } from 'lucide-react';

interface Subscriber {
  _id: string;
  email: string;
  status: 'active' | 'unsubscribed' | 'pending';
  createdAt: string;
}

interface SubscriberTableProps {
  className?: string;
  onDataChange?: () => void;
}

const SubscriberTable: React.FC<SubscriberTableProps> = ({ className = '', onDataChange }) => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subscription`);
      const data = await response.json();
      if (response.ok) {
        setSubscribers(data.subscriptions || []);
      } else {
        setError(data.message || 'Failed to fetch subscribers');
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const deleteSubscriber = async (subscriberId: string) => {
    if (!window.confirm('Are you sure you want to delete this subscriber?')) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subscription/${subscriberId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setSubscribers(prev => prev.filter(sub => sub._id !== subscriberId));
        onDataChange?.();
      } else {
        setError('Failed to delete subscriber');
      }
    } catch (error) {
      setError('Network error');
    }
  };

  const getStatusInfo = (status: string) => {
    const statusConfig = {
      active: { color: 'text-green-400', bg: 'bg-green-400/10', icon: CheckCircle },
      unsubscribed: { color: 'text-red-400', bg: 'bg-red-400/10', icon: XCircle },
      pending: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: Mail },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
          <span className="text-gray-400">Loading subscribers...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 mt-[100px] ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Newsletter Subscribers</h2>
          <p className="text-gray-400">Manage newsletter subscriptions</p>
        </div>
        <button
          onClick={fetchSubscribers}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date Subscribed</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {subscribers.map((subscriber) => {
                const statusInfo = getStatusInfo(subscriber.status);
                const StatusIcon = statusInfo.icon;
                return (
                  <tr key={subscriber._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white">{subscriber.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {subscriber.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{formatDate(subscriber.createdAt)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteSubscriber(subscriber._id)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {subscribers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No subscribers found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriberTable; 