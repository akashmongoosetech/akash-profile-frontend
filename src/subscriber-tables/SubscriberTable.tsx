import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Trash2, CheckCircle, XCircle, Mail, Download, FileSpreadsheet, ChevronLeft, ChevronRight } from 'lucide-react';
import DeleteModal from '../components/DeleteModal';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState<Subscriber | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const itemsPerPage = 10;

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/subscription`);
      const data = await response.json();
      if (response.ok) {
        setSubscribers(data.subscriptions || []);
      } else {
        setError(data.message || 'Failed to fetch subscribers');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const deleteSubscriber = async (subscriberId: string) => {
    setSubscriberToDelete(subscribers.find(sub => sub._id === subscriberId) || null);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!subscriberToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/subscription/${subscriberToDelete._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setSubscribers(prev => prev.filter(sub => sub._id !== subscriberToDelete._id));
        onDataChange?.();
      } else {
        setError('Failed to delete subscriber');
      }
    } catch {
      setError('Network error');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSubscriberToDelete(null);
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

  // Pagination calculations
  const totalPages = Math.ceil(subscribers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSubscribers = useMemo(() => {
    return subscribers.slice(startIndex, endIndex);
  }, [subscribers, startIndex, endIndex]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Export functions
  const exportToPDF = async () => {
    try {
      setExporting(true);
      const { jsPDF } = await import('jspdf');
      await import('jspdf-autotable');
      
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('Newsletter Subscribers', 14, 22);
      
      // Add date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      
      // Prepare table data
      const tableData = subscribers.map(subscriber => [
        subscriber.email,
        subscriber.status,
        formatDate(subscriber.createdAt)
      ]);
      
      // Add table
      (doc as unknown as { autoTable: (options: unknown) => void }).autoTable({
        head: [['Email', 'Status', 'Date Subscribed']],
        body: tableData,
        startY: 40,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 3
        },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255
        }
      });
      
      doc.save('newsletter-subscribers.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      setError('Failed to export PDF');
    } finally {
      setExporting(false);
    }
  };

  const exportToGoogleSheets = async () => {
    try {
      setExporting(true);
      
      // Create CSV data
      const csvData = [
        ['Email', 'Status', 'Date Subscribed'],
        ...subscribers.map(subscriber => [
          subscriber.email,
          subscriber.status,
          formatDate(subscriber.createdAt)
        ])
      ];
      
      // Convert to CSV string
      const csvString = csvData.map(row => 
        row.map(cell => `"${cell}"`).join(',')
      ).join('\n');
      
      // Create blob and download
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'newsletter-subscribers.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error exporting CSV:', error);
      setError('Failed to export CSV');
    } finally {
      setExporting(false);
    }
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
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Newsletter Subscribers</h2>
          <p className="text-slate-400">Manage newsletter subscriptions ({subscribers.length} total)</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Export Buttons */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportToPDF}
            disabled={exporting || subscribers.length === 0}
            className="flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            PDF
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportToGoogleSheets}
            disabled={exporting || subscribers.length === 0}
            className="flex items-center gap-2 px-3 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet className="w-4 h-4" />
            CSV
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchSubscribers}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </motion.button>
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-xl p-4"
        >
          <p className="text-red-400 text-sm">{error}</p>
        </motion.div>
      )}

      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/30">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Date Subscribed</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {currentSubscribers.map((subscriber) => {
                const statusInfo = getStatusInfo(subscriber.status);
                const StatusIcon = statusInfo.icon;
                return (
                  <tr key={subscriber._id} className="hover:bg-slate-700/30 transition-colors">
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
        
        {/* Pagination */}
        {subscribers.length > 0 && (
          <div className="px-6 py-4 bg-white/5 border-t border-white/10">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-400">
                Showing {startIndex + 1} to {Math.min(endIndex, subscribers.length)} of {subscribers.length} subscribers
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                            page === currentPage
                              ? 'bg-blue-500 text-white'
                              : 'bg-white/10 hover:bg-white/20 text-gray-300'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span key={page} className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
                
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSubscriberToDelete(null);
        }}
        onDelete={handleDeleteConfirm}
        title="Delete Subscriber?"
        itemName={subscriberToDelete?.email}
        itemDescription={`Status: ${subscriberToDelete?.status}`}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default SubscriberTable; 