import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Search,
  RefreshCw,
  Calendar,
  Mail,
  MessageSquare,
  Users,
  TrendingUp,
  Download,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import StatsCard from '../components/StatsCard';
import DeleteModal from '../components/DeleteModal';

interface Contact {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  subject: string;
  message: string;
  status: 'pending' | 'review' | 'worked' | 'done' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContactStats {
  _id: string;
  count: number;
}

interface ContactTableProps {
  className?: string;
  onDataChange?: () => void;
}

const ContactTable: React.FC<ContactTableProps> = ({ className = '', onDataChange }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [stats, setStats] = useState({
    totalContacts: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const itemsPerPage = 10;

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/contact`);
      const data = await response.json();
      
      if (response.ok) {
        setContacts(data.contacts);
      } else {
        setError(data.message || 'Failed to fetch contacts');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/contact/stats`);
      const data = await response.json();
      if (response.ok) {
        const statsArr = data.stats as ContactStats[];
        const totalContacts = statsArr.reduce((sum, stat) => sum + stat.count, 0);
        const pending = statsArr.find(stat => stat._id === 'pending')?.count || 0;
        const review = statsArr.find(stat => stat._id === 'review')?.count || 0;
        const worked = statsArr.find(stat => stat._id === 'worked')?.count || 0;
        const done = statsArr.find(stat => stat._id === 'done')?.count || 0;
        setStats({
          totalContacts,
          pending,
          inProgress: review + worked,
          completed: done
        });
      }
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Filter contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Update contact status
  const updateContactStatus = async (contactId: string, newStatus: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/contact/${contactId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setContacts(prev => 
          prev.map(contact => 
            contact._id === contactId 
              ? { ...contact, status: newStatus as Contact['status'] }
              : contact
          )
        );
        onDataChange?.();
        fetchStats();
      } else {
        setError('Failed to update status');
      }
    } catch {
      setError('Network error');
    }
  };

  // Delete contact
  const deleteContact = async (contactId: string) => {
    setContactToDelete(contacts.find(contact => contact._id === contactId) || null);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!contactToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/contact/${contactToDelete._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setContacts(prev => prev.filter(contact => contact._id !== contactToDelete._id));
        onDataChange?.();
        fetchStats();
      } else {
        setError('Failed to delete contact');
      }
    } catch {
      setError('Network error');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setContactToDelete(null);
    }
  };

  // Update contact
  const updateContact = async (contactId: string, updates: Partial<Contact>) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/contact/${contactId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        setContacts(prev => 
          prev.map(contact => 
            contact._id === contactId 
              ? { ...contact, ...updates }
              : contact
          )
        );
        setShowEditModal(false);
        setEditingContact(null);
        onDataChange?.();
        fetchStats();
      } else {
        setError('Failed to update contact');
      }
    } catch {
      setError('Network error');
    }
  };

  // Get status color and icon
  const getStatusInfo = (status: string) => {
    const statusConfig = {
      pending: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: Clock },
      review: { color: 'text-blue-400', bg: 'bg-blue-400/10', icon: Eye },
      worked: { color: 'text-purple-400', bg: 'bg-purple-400/10', icon: MessageSquare },
      done: { color: 'text-green-400', bg: 'bg-green-400/10', icon: CheckCircle },
      rejected: { color: 'text-red-400', bg: 'bg-red-400/10', icon: XCircle },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    const priorityColors = {
      low: 'text-gray-400',
      medium: 'text-blue-400',
      high: 'text-orange-400',
      urgent: 'text-red-400',
    };
    return priorityColors[priority as keyof typeof priorityColors] || 'text-gray-400';
  };

  // Format date
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
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentContacts = useMemo(() => {
    return filteredContacts.slice(startIndex, endIndex);
  }, [filteredContacts, startIndex, endIndex]);

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
      doc.text('Contact Management Report', 14, 22);
      
      // Add date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      
      // Prepare table data
      const tableData = filteredContacts.map(contact => [
        contact.name,
        contact.email,
        contact.mobile || 'N/A',
        contact.subject,
        contact.status,
        contact.priority,
        formatDate(contact.createdAt)
      ]);
      
      // Add table
      (doc as unknown as { autoTable: (options: unknown) => void }).autoTable({
        head: [['Name', 'Email', 'Mobile', 'Subject', 'Status', 'Priority', 'Date']],
        body: tableData,
        startY: 40,
        theme: 'grid',
        styles: {
          fontSize: 7,
          cellPadding: 2
        },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255
        },
        columnStyles: {
          3: { cellWidth: 40 }, // Subject column wider
        }
      });
      
      doc.save('contact-management-report.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      setError('Failed to export PDF');
    } finally {
      setExporting(false);
    }
  };

  const exportToCSV = async () => {
    try {
      setExporting(true);
      
      // Create CSV data
      const csvData = [
        ['Name', 'Email', 'Mobile', 'Subject', 'Message', 'Status', 'Priority', 'Admin Notes', 'Date Created'],
        ...filteredContacts.map(contact => [
          contact.name,
          contact.email,
          contact.mobile || '',
          contact.subject,
          contact.message,
          contact.status,
          contact.priority,
          contact.adminNotes || '',
          formatDate(contact.createdAt)
        ])
      ];
      
      // Convert to CSV string
      const csvString = csvData.map(row => 
        row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(',')
      ).join('\n');
      
      // Create blob and download
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'contact-management-report.csv');
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

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
          <span className="text-gray-400">Loading contacts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Dashboard Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        {statsConfig.map((stat) => (
          <StatsCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            colorClass={stat.color}
            loading={statsLoading}
          />
        ))}
      </div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Contact Management</h2>
          <p className="text-slate-400">Manage and respond to contact form submissions ({filteredContacts.length} contacts)</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Export Buttons */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportToPDF}
            disabled={exporting || filteredContacts.length === 0}
            className="flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            PDF
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportToCSV}
            disabled={exporting || filteredContacts.length === 0}
            className="flex items-center gap-2 px-3 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet className="w-4 h-4" />
            CSV
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { fetchContacts(); fetchStats(); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="review">Review</option>
          <option value="worked">Worked</option>
          <option value="done">Done</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-xl p-4"
        >
          <p className="text-red-400 text-sm">{error}</p>
        </motion.div>
      )}

      {/* Table */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {currentContacts.map((contact) => {
                const statusInfo = getStatusInfo(contact.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <motion.tr
                    key={contact._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-white">{contact.name}</div>
                        <div className="text-sm text-gray-400">{contact.email}</div>
                        {contact.mobile && (
                          <div className="text-sm text-gray-400">{contact.mobile}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white max-w-xs truncate" title={contact.subject}>
                        {contact.subject}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${getPriorityColor(contact.priority)}`}>
                        {contact.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {formatDate(contact.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedContact(contact);
                            setShowModal(true);
                          }}
                          className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingContact(contact);
                            setShowEditModal(true);
                          }}
                          className="p-1 text-green-400 hover:text-green-300 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteContact(contact._id)}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="relative">
                          <select
                            value={contact.status}
                            onChange={(e) => updateContactStatus(contact._id, e.target.value)}
                            className="text-xs bg-gray border border-white/20 rounded px-2 py-1 text-black focus:outline-none focus:border-blue-400"
                          >
                            <option value="pending">Pending</option>
                            <option value="review">Review</option>
                            <option value="worked">Worked</option>
                            <option value="done">Done</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No contacts found</p>
          </div>
        )}
        
        {/* Pagination */}
        {filteredContacts.length > 0 && (
          <div className="px-6 py-4 bg-white/5 border-t border-white/10">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-400">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredContacts.length)} of {filteredContacts.length} contacts
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

      {/* View Modal */}
      {showModal && selectedContact && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-white">Contact Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Name</label>
                  <p className="text-white">{selectedContact.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Email</label>
                  <p className="text-white">{selectedContact.email}</p>
                </div>
                {selectedContact.mobile && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Mobile</label>
                    <p className="text-white">{selectedContact.mobile}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-400">Subject</label>
                  <p className="text-white">{selectedContact.subject}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-400">Message</label>
                <div className="mt-1 p-3 bg-white/10 rounded-lg">
                  <p className="text-white whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Status</label>
                  <div className="mt-1">
                    {(() => {
                      const statusInfo = getStatusInfo(selectedContact.status);
                      const StatusIcon = statusInfo.icon;
                      return (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {selectedContact.status}
                        </span>
                      );
                    })()}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Priority</label>
                  <p className={`text-white ${getPriorityColor(selectedContact.priority)}`}>
                    {selectedContact.priority}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Created</label>
                  <p className="text-white text-sm">{formatDate(selectedContact.createdAt)}</p>
                </div>
              </div>

              {selectedContact.adminNotes && (
                <div>
                  <label className="text-sm font-medium text-gray-400">Admin Notes</label>
                  <p className="text-white mt-1">{selectedContact.adminNotes}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingContact && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-white">Edit Contact</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const status = formData.get('status') as Contact['status'];
                const priority = formData.get('priority') as Contact['priority'];
                const adminNotes = formData.get('adminNotes') as string;
                
                updateContact(editingContact._id, {
                  status,
                  priority,
                  adminNotes,
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                <select
                  name="status"
                  defaultValue={editingContact.status}
                  className="w-full px-3 py-2 bg-gray border border-white/20 rounded-lg text-black focus:outline-none focus:border-blue-400"
                >
                  <option value="pending">Pending</option>
                  <option value="review">Review</option>
                  <option value="worked">Worked</option>
                  <option value="done">Done</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Priority</label>
                <select
                  name="priority"
                  defaultValue={editingContact.priority}
                  className="w-full px-3 py-2 bg-gray border border-white/20 rounded-lg text-black focus:outline-none focus:border-blue-400"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Admin Notes</label>
                <textarea
                  name="adminNotes"
                  defaultValue={editingContact.adminNotes}
                  rows={3}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
                  placeholder="Add admin notes..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setContactToDelete(null);
        }}
        onDelete={handleDeleteConfirm}
        title="Delete Contact?"
        itemName={contactToDelete?.name}
        itemDescription={`${contactToDelete?.email} • ${contactToDelete?.subject}`}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ContactTable; 