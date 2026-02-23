import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Download, 
  Printer, 
  FileText, 
  Building2, 
  User, 
  Calendar,
  ChevronDown,
  RefreshCw,
  Check,
  Edit3
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * QuotationGenerator Component
 * 
 * A professional quotation generator with PDF export capabilities.
 * Features:
 * - Company and client details
 * - Dynamic product/service items
 * - Auto calculation
 * - Validity date
 * - Editable terms & conditions
 * - Status badge (Draft/Final)
 * - PDF download
 * - Print functionality
 */

// ==================== TypeScript Interfaces ====================

export interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  price: number;
  discountPercent: number;
}

export interface CompanyDetails {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  gstin: string;
}

export interface ClientDetails {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  gstin: string;
}

export interface QuotationData {
  quotationNumber: string;
  quotationDate: string;
  validUntil: string;
  company: CompanyDetails;
  client: ClientDetails;
  items: QuotationItem[];
  currency: string;
  terms: string;
  notes: string;
  status: 'draft' | 'final';
}

// ==================== Currency Configuration ====================

const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
];

const UNITS = ['pcs', 'kg', 'lbs', 'hrs', 'days', 'units', 'sets', 'lot'];

// ==================== Default Data ====================

const generateQuotationNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `QUO-${year}${month}-${random}`;
};

const getDefaultCompany = (): CompanyDetails => ({
  name: '',
  address: '',
  city: '',
  phone: '',
  email: '',
  gstin: '',
});

const getDefaultClient = (): ClientDetails => ({
  name: '',
  address: '',
  city: '',
  phone: '',
  email: '',
  gstin: '',
});

const createEmptyItem = (): QuotationItem => ({
  id: crypto.randomUUID(),
  description: '',
  quantity: 1,
  unit: 'pcs',
  price: 0,
  discountPercent: 0,
});

const DEFAULT_TERMS = `1. This quotation is valid for 30 days from the date of issue.
2. Payment terms: 50% advance, 50% on delivery.
3. Prices are exclusive of applicable taxes.
4. Delivery timeline: To be discussed.
5. Extra charges may apply for additional requirements.`;

// ==================== Component ====================

const QuotationGenerator: React.FC = () => {

  // Quotation Data State
  const [quotationNumber, setQuotationNumber] = useState<string>(generateQuotationNumber());
  const [quotationDate, setQuotationDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  });
  const [company, setCompany] = useState<CompanyDetails>(getDefaultCompany());
  const [client, setClient] = useState<ClientDetails>(getDefaultClient());
  const [items, setItems] = useState<QuotationItem[]>([createEmptyItem()]);
  const [currency, setCurrency] = useState<string>('INR');
  const [terms, setTerms] = useState<string>(DEFAULT_TERMS);
  const [notes, setNotes] = useState<string>('');
  const [status, setStatus] = useState<'draft' | 'final'>('draft');

  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get currency symbol
  const getCurrencySymbol = (curr: string): string => {
    return CURRENCIES.find(c => c.code === curr)?.symbol || '₹';
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    const symbol = getCurrencySymbol(currency);
    return `${symbol}${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Calculate item totals
  const calculateItemTotals = (item: QuotationItem) => {
    const subtotal = item.quantity * item.price;
    const discountAmount = subtotal * (item.discountPercent / 100);
    const total = subtotal - discountAmount;
    return { subtotal, discountAmount, total };
  };

  // Calculate quotation totals
  const quotationTotals = useMemo(() => {
    let subtotal = 0;
    let totalDiscount = 0;
    let grandTotal = 0;

    items.forEach(item => {
      const { subtotal: itemSubtotal, discountAmount, total } = calculateItemTotals(item);
      subtotal += itemSubtotal;
      totalDiscount += discountAmount;
      grandTotal += total;
    });

    return {
      subtotal,
      totalDiscount,
      grandTotal
    };
  }, [items]);

  // Add new item
  const addItem = () => {
    setItems([...items, createEmptyItem()]);
  };

  // Remove item
  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  // Update item field
  const updateItem = (id: string, field: keyof QuotationItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Toggle status
  const toggleStatus = () => {
    setStatus(prev => prev === 'draft' ? 'final' : 'draft');
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!company.name.trim()) newErrors.companyName = 'Company name is required';
    if (!client.name.trim()) newErrors.clientName = 'Client name is required';
    
    const hasValidItem = items.some(item => 
      item.description.trim() && item.quantity > 0 && item.price > 0
    );
    if (!hasValidItem) newErrors.items = 'At least one item with description, quantity and price is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Generate PDF
  const generatePDF = () => {
    if (!validateForm()) return;

    const doc = new jsPDF();
    const currencySymbol = getCurrencySymbol(currency);

    // Header
    doc.setFontSize(24);
    doc.setTextColor(40, 40, 40);
    doc.text('QUOTATION', 20, 25);

    // Status Badge
    if (status === 'final') {
      doc.setFillColor(34, 197, 94);
      doc.roundedRect(150, 15, 35, 10, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text('FINAL', 167.5, 21, { align: 'center' });
    }

    // Quotation Details
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Quotation #: ${quotationNumber}`, 140, 20);
    doc.text(`Date: ${quotationDate}`, 140, 26);
    doc.text(`Valid Until: ${validUntil}`, 140, 32);

    // Company Details
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text('From:', 20, 45);
    doc.setFontSize(10);
    doc.text(company.name || 'Company Name', 20, 52);
    if (company.address) doc.text(company.address, 20, 58);
    if (company.city) doc.text(company.city, 20, 64);
    if (company.phone) doc.text(`Phone: ${company.phone}`, 20, 70);
    if (company.email) doc.text(`Email: ${company.email}`, 20, 76);
    if (company.gstin) doc.text(`GSTIN: ${company.gstin}`, 20, 82);

    // Client Details
    doc.setFontSize(12);
    doc.text('Quotation For:', 110, 45);
    doc.setFontSize(10);
    doc.text(client.name || 'Client Name', 110, 52);
    if (client.address) doc.text(client.address, 110, 58);
    if (client.city) doc.text(client.city, 110, 64);
    if (client.phone) doc.text(`Phone: ${client.phone}`, 110, 70);
    if (client.email) doc.text(`Email: ${client.email}`, 110, 76);
    if (client.gstin) doc.text(`GSTIN: ${client.gstin}`, 110, 82);

    // Items Table
    const tableData = items.map(item => {
      const { discountAmount, total } = calculateItemTotals(item);
      return [
        item.description || '-',
        item.quantity.toString(),
        item.unit,
        `${currencySymbol}${item.price.toFixed(2)}`,
        `${item.discountPercent}%`,
        `${currencySymbol}${discountAmount.toFixed(2)}`,
        `${currencySymbol}${total.toFixed(2)}`
      ];
    });

    doc.autoTable({
      startY: 95,
      head: [['Description', 'Qty', 'Unit', 'Price', 'Disc%', 'Disc Amt', 'Total']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [66, 66, 66] },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 45 },
        6: { fontStyle: 'bold' }
      }
    });

    // Totals
    // @ts-expect-error - lastAutoTable is added by jspdf-autotable
    const tableResult = doc.lastAutoTable;
    const finalY = tableResult ? tableResult.finalY + 10 : 200;
    
    doc.setFontSize(10);
    doc.text('Subtotal:', 140, finalY);
    doc.text(`${currencySymbol}${quotationTotals.subtotal.toFixed(2)}`, 175, finalY, { align: 'right' });
    
    doc.text('Total Discount:', 140, finalY + 6);
    doc.text(`-${currencySymbol}${quotationTotals.totalDiscount.toFixed(2)}`, 175, finalY + 6, { align: 'right' });
    
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text('Grand Total:', 140, finalY + 16);
    doc.text(`${currencySymbol}${quotationTotals.grandTotal.toFixed(2)}`, 175, finalY + 16, { align: 'right' });

    // Terms & Conditions
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    doc.text('Terms & Conditions:', 20, finalY + 30);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    const termLines = terms.split('\n');
    termLines.forEach((line, index) => {
      doc.text(line, 20, finalY + 38 + (index * 5));
    });

    // Notes
    if (notes) {
      const notesY = finalY + 30 + (termLines.length * 5) + 10;
      doc.setFontSize(10);
      doc.setTextColor(40, 40, 40);
      doc.text('Notes:', 20, notesY);
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      const noteLines = doc.splitTextToSize(notes, 170);
      doc.text(noteLines, 20, notesY + 7);
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for your inquiry!', 105, 285, { align: 'center' });

    // Save PDF
    doc.save(`${quotationNumber}.pdf`);
  };

  // Print quotation
  const handlePrint = () => {
    if (!validateForm()) return;
    window.print();
  };

  // Reset form
  const handleReset = () => {
    setQuotationNumber(generateQuotationNumber());
    setQuotationDate(new Date().toISOString().split('T')[0]);
    const newValidUntil = new Date();
    newValidUntil.setDate(newValidUntil.getDate() + 30);
    setValidUntil(newValidUntil.toISOString().split('T')[0]);
    setCompany(getDefaultCompany());
    setClient(getDefaultClient());
    setItems([createEmptyItem()]);
    setCurrency('INR');
    setTerms(DEFAULT_TERMS);
    setNotes('');
    setStatus('draft');
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Quotation Generator</h1>
          <p className="text-gray-400">Create professional quotations for your clients</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-end mb-6 no-print">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={generatePDF}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Quotation Details */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  Quotation Details
                </h3>
                <button
                  onClick={toggleStatus}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                    status === 'final' 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-gray-600 hover:bg-gray-500 text-gray-200'
                  }`}
                >
                  {status === 'final' ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  {status === 'final' ? 'Final' : 'Draft'}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Quotation Number</label>
                  <input
                    type="text"
                    value={quotationNumber}
                    onChange={(e) => setQuotationNumber(e.target.value)}
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Quotation Date</label>
                  <input
                    type="date"
                    value={quotationDate}
                    onChange={(e) => setQuotationDate(e.target.value)}
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Valid Until</label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-green-400" />
                Your Company Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Company Name *</label>
                  <input
                    type="text"
                    value={company.name}
                    onChange={(e) => setCompany({ ...company, name: e.target.value })}
                    className={`w-full h-11 px-3 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:border-emerald-500 ${
                      errors.companyName ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">GSTIN</label>
                  <input
                    type="text"
                    value={company.gstin}
                    onChange={(e) => setCompany({ ...company, gstin: e.target.value })}
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Address</label>
                  <input
                    type="text"
                    value={company.address}
                    onChange={(e) => setCompany({ ...company, address: e.target.value })}
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">City</label>
                  <input
                    type="text"
                    value={company.city}
                    onChange={(e) => setCompany({ ...company, city: e.target.value })}
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Phone</label>
                  <input
                    type="text"
                    value={company.phone}
                    onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Email</label>
                  <input
                    type="email"
                    value={company.email}
                    onChange={(e) => setCompany({ ...company, email: e.target.value })}
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Client Details */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-400" />
                Client Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Client Name *</label>
                  <input
                    type="text"
                    value={client.name}
                    onChange={(e) => setClient({ ...client, name: e.target.value })}
                    className={`w-full h-11 px-3 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:border-emerald-500 ${
                      errors.clientName ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">GSTIN</label>
                  <input
                    type="text"
                    value={client.gstin}
                    onChange={(e) => setClient({ ...client, gstin: e.target.value })}
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Address</label>
                  <input
                    type="text"
                    value={client.address}
                    onChange={(e) => setClient({ ...client, address: e.target.value })}
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">City</label>
                  <input
                    type="text"
                    value={client.city}
                    onChange={(e) => setClient({ ...client, city: e.target.value })}
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Phone</label>
                  <input
                    type="text"
                    value={client.phone}
                    onChange={(e) => setClient({ ...client, phone: e.target.value })}
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Email</label>
                  <input
                    type="email"
                    value={client.email}
                    onChange={(e) => setClient({ ...client, email: e.target.value })}
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Currency Selection */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <label className="block text-white font-semibold mb-3">Currency</label>
              <div className="relative">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                >
                  {CURRENCIES.map(curr => (
                    <option key={curr.code} value={curr.code}>
                      {curr.symbol} {curr.code} - {curr.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <label className="block text-white font-semibold mb-3">Terms & Conditions</label>
              <textarea
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Notes */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <label className="block text-white font-semibold mb-3">Additional Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes for the client..."
                rows={3}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>
          </div>

          {/* Items & Preview Section */}
          <div className="space-y-6">
            {/* Items */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg">Products/Services</h3>
                <button
                  onClick={addItem}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>

              {errors.items && (
                <p className="text-red-400 text-sm mb-4">{errors.items}</p>
              )}

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className="bg-gray-700/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-400 text-sm">Item #{index + 1}</span>
                      {items.length > 1 && (
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div className="sm:col-span-2 lg:col-span-3">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          placeholder="Description *"
                          className="w-full h-10 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          placeholder="Qty *"
                          min="0"
                          className="w-full h-10 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <select
                          value={item.unit}
                          onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                          className="w-full h-10 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                        >
                          {UNITS.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                          placeholder="Price *"
                          min="0"
                          step="0.01"
                          className="w-full h-10 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="sm:col-span-2 lg:col-span-1">
                        <input
                          type="number"
                          value={item.discountPercent}
                          onChange={(e) => updateItem(item.id, 'discountPercent', parseFloat(e.target.value) || 0)}
                          placeholder="Discount %"
                          min="0"
                          max="100"
                          className="w-full h-10 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <div className="h-10 px-3 bg-gray-600/30 border border-gray-600 rounded-lg flex items-center justify-end">
                          <span className="text-white font-medium">
                            {formatCurrency(calculateItemTotals(item).total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white">
              <h3 className="font-semibold text-lg mb-4">Quotation Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-emerald-200">Subtotal</span>
                  <span className="font-medium">{formatCurrency(quotationTotals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-red-300">
                  <span>Discount</span>
                  <span>-{formatCurrency(quotationTotals.totalDiscount)}</span>
                </div>
                <div className="border-t border-white/20 pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Grand Total</span>
                    <span>{formatCurrency(quotationTotals.grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationGenerator;
