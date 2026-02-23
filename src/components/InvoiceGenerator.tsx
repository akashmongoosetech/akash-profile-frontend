import React, { useState, useMemo, useRef } from 'react';
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
  RefreshCw
} from 'lucide-react';
import jsPDF from 'jspdf';
// @ts-expect-error - jspdf-autotable adds autoTable to jsPDF prototype
import 'jspdf-autotable';

/**
 * InvoiceGenerator Component
 * 
 * A fully functional invoice generator with PDF export capabilities.
 * Features:
 * - Company and client details
 * - Dynamic item management (add/remove)
 * - Auto calculation of subtotal, tax, discount, and total
 * - Multiple currency support
 * - Invoice number generation
 * - PDF download with proper formatting
 * - Print functionality
 */

// ==================== TypeScript Interfaces ====================

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  taxPercent: number;
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

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  company: CompanyDetails;
  client: ClientDetails;
  items: InvoiceItem[];
  currency: string;
  notes: string;
  bankDetails: string;
}

// ==================== Currency Configuration ====================

const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];

// ==================== Default Data ====================

const generateInvoiceNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}${month}-${random}`;
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

const createEmptyItem = (): InvoiceItem => ({
  id: crypto.randomUUID(),
  description: '',
  quantity: 1,
  price: 0,
  taxPercent: 0,
  discountPercent: 0,
});

// ==================== Component ====================

const InvoiceGenerator: React.FC = () => {
  const printRef = useRef<HTMLDivElement>(null);

  // Invoice Data State
  const [invoiceNumber, setInvoiceNumber] = useState<string>(generateInvoiceNumber());
  const [invoiceDate, setInvoiceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  });
  const [company, setCompany] = useState<CompanyDetails>(getDefaultCompany());
  const [client, setClient] = useState<ClientDetails>(getDefaultClient());
  const [items, setItems] = useState<InvoiceItem[]>([createEmptyItem()]);
  const [currency, setCurrency] = useState<string>('INR');
  const [notes, setNotes] = useState<string>('');
  const [bankDetails, setBankDetails] = useState<string>('');

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
  const calculateItemTotals = (item: InvoiceItem) => {
    const subtotal = item.quantity * item.price;
    const discountAmount = subtotal * (item.discountPercent / 100);
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * (item.taxPercent / 100);
    const total = afterDiscount + taxAmount;
    return { subtotal, discountAmount, taxAmount, total };
  };

  // Calculate invoice totals
  const invoiceTotals = useMemo(() => {
    let subtotal = 0;
    let totalTax = 0;
    let totalDiscount = 0;
    let grandTotal = 0;

    items.forEach(item => {
      const { subtotal: itemSubtotal, discountAmount, taxAmount, total } = calculateItemTotals(item);
      subtotal += itemSubtotal;
      totalTax += taxAmount;
      totalDiscount += discountAmount;
      grandTotal += total;
    });

    return {
      subtotal,
      totalTax,
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
  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
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
    doc.text('INVOICE', 20, 25);

    // Invoice Details
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Invoice #: ${invoiceNumber}`, 140, 20);
    doc.text(`Date: ${invoiceDate}`, 140, 26);
    doc.text(`Due Date: ${dueDate}`, 140, 32);

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
    doc.text('Bill To:', 110, 45);
    doc.setFontSize(10);
    doc.text(client.name || 'Client Name', 110, 52);
    if (client.address) doc.text(client.address, 110, 58);
    if (client.city) doc.text(client.city, 110, 64);
    if (client.phone) doc.text(`Phone: ${client.phone}`, 110, 70);
    if (client.email) doc.text(`Email: ${client.email}`, 110, 76);
    if (client.gstin) doc.text(`GSTIN: ${client.gstin}`, 110, 82);

    // Items Table
    const tableData = items.map(item => {
      const { discountAmount, taxAmount, total } = calculateItemTotals(item);
      return [
        item.description || '-',
        item.quantity.toString(),
        `${currencySymbol}${item.price.toFixed(2)}`,
        `${item.discountPercent}%`,
        `${currencySymbol}${discountAmount.toFixed(2)}`,
        `${item.taxPercent}%`,
        `${currencySymbol}${taxAmount.toFixed(2)}`,
        `${currencySymbol}${total.toFixed(2)}`
      ];
    });

    // @ts-expect-error - autoTable is added by jspdf-autotable
    autoTable(doc, {
      startY: 95,
      head: [['Description', 'Qty', 'Price', 'Disc%', 'Disc Amt', 'Tax%', 'Tax Amt', 'Total']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [66, 66, 66] },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 40 },
        7: { fontStyle: 'bold' }
      }
    });

    // Totals
    // Get the final Y position after the table
    // @ts-expect-error - lastAutoTable is added by jspdf-autotable
    const tableResult = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable;
    const finalY = tableResult ? tableResult.finalY + 10 : 200;
    
    doc.setFontSize(10);
    doc.text('Subtotal:', 140, finalY);
    doc.text(`${currencySymbol}${invoiceTotals.subtotal.toFixed(2)}`, 175, finalY, { align: 'right' });
    
    doc.text('Total Discount:', 140, finalY + 6);
    doc.text(`-${currencySymbol}${invoiceTotals.totalDiscount.toFixed(2)}`, 175, finalY + 6, { align: 'right' });
    
    doc.text('Total Tax:', 140, finalY + 12);
    doc.text(`${currencySymbol}${invoiceTotals.totalTax.toFixed(2)}`, 175, finalY + 12, { align: 'right' });
    
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text('Grand Total:', 140, finalY + 22);
    doc.text(`${currencySymbol}${invoiceTotals.grandTotal.toFixed(2)}`, 175, finalY + 22, { align: 'right' });

    // Bank Details
    if (bankDetails) {
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Bank Details:', 20, finalY + 35);
      const bankLines = bankDetails.split('\n');
      bankLines.forEach((line, index) => {
        doc.text(line, 20, finalY + 42 + (index * 5));
      });
    }

    // Notes
    if (notes) {
      doc.setTextColor(100, 100, 100);
      doc.text('Notes:', 20, finalY + 60);
      const noteLines = doc.splitTextToSize(notes, 170);
      doc.text(noteLines, 20, finalY + 67);
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for your business!', 105, 285, { align: 'center' });

    // Save PDF
    doc.save(`${invoiceNumber}.pdf`);
  };

  // Print invoice
  const handlePrint = () => {
    if (!validateForm()) return;
    window.print();
  };

  // Reset form
  const handleReset = () => {
    setInvoiceNumber(generateInvoiceNumber());
    setInvoiceDate(new Date().toISOString().split('T')[0]);
    const newDueDate = new Date();
    newDueDate.setDate(newDueDate.getDate() + 30);
    setDueDate(newDueDate.toISOString().split('T')[0]);
    setCompany(getDefaultCompany());
    setClient(getDefaultClient());
    setItems([createEmptyItem()]);
    setCurrency('INR');
    setNotes('');
    setBankDetails('');
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Invoice Generator</h1>
          <p className="text-gray-400">Create and manage professional invoices</p>
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
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Invoice Details */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Invoice Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Invoice Number</label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Invoice Date</label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-green-400" />
                Company Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Company Name *</label>
                  <input
                    type="text"
                    value={company.name}
                    onChange={(e) => setCompany({ ...company, name: e.target.value })}
                    className={`w-full h-11 px-3 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:border-blue-500 ${
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
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Address</label>
                  <input
                    type="text"
                    value={company.address}
                    onChange={(e) => setCompany({ ...company, address: e.target.value })}
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">City</label>
                  <input
                    type="text"
                    value={company.city}
                    onChange={(e) => setCompany({ ...company, city: e.target.value })}
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Phone</label>
                  <input
                    type="text"
                    value={company.phone}
                    onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Email</label>
                  <input
                    type="email"
                    value={company.email}
                    onChange={(e) => setCompany({ ...company, email: e.target.value })}
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
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
                    className={`w-full h-11 px-3 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:border-blue-500 ${
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
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Address</label>
                  <input
                    type="text"
                    value={client.address}
                    onChange={(e) => setClient({ ...client, address: e.target.value })}
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">City</label>
                  <input
                    type="text"
                    value={client.city}
                    onChange={(e) => setClient({ ...client, city: e.target.value })}
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Phone</label>
                  <input
                    type="text"
                    value={client.phone}
                    onChange={(e) => setClient({ ...client, phone: e.target.value })}
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Email</label>
                  <input
                    type="email"
                    value={client.email}
                    onChange={(e) => setClient({ ...client, email: e.target.value })}
                    className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
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
                  className="w-full h-11 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
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

            {/* Bank Details */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <label className="block text-white font-semibold mb-3">Bank Details</label>
              <textarea
                value={bankDetails}
                onChange={(e) => setBankDetails(e.target.value)}
                placeholder="Bank Name:&#10;Account Number:&#10;IFSC Code:&#10;Branch:"
                rows={4}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* Notes */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <label className="block text-white font-semibold mb-3">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes or terms..."
                rows={3}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
          </div>

          {/* Items & Preview Section */}
          <div className="space-y-6">
            {/* Items */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg">Invoice Items</h3>
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
                          className="w-full h-10 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          placeholder="Qty"
                          min="0"
                          className="w-full h-10 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                          placeholder="Price"
                          min="0"
                          step="0.01"
                          className="w-full h-10 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={item.discountPercent}
                          onChange={(e) => updateItem(item.id, 'discountPercent', parseFloat(e.target.value) || 0)}
                          placeholder="Disc %"
                          min="0"
                          max="100"
                          className="w-full h-10 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={item.taxPercent}
                          onChange={(e) => updateItem(item.id, 'taxPercent', parseFloat(e.target.value) || 0)}
                          placeholder="Tax %"
                          min="0"
                          max="100"
                          className="w-full h-10 px-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="sm:col-span-2 lg:col-span-1">
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
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
              <h3 className="font-semibold text-lg mb-4">Invoice Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-blue-200">Subtotal</span>
                  <span className="font-medium">{formatCurrency(invoiceTotals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-red-300">
                  <span>Discount</span>
                  <span>-{formatCurrency(invoiceTotals.totalDiscount)}</span>
                </div>
                <div className="flex justify-between text-yellow-300">
                  <span>Tax</span>
                  <span>+{formatCurrency(invoiceTotals.totalTax)}</span>
                </div>
                <div className="border-t border-white/20 pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Grand Total</span>
                    <span>{formatCurrency(invoiceTotals.grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section (Print Only) */}
        <div ref={printRef} className="hidden print:block bg-white p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
                <p className="text-gray-600 mt-1">#{invoiceNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Date: {invoiceDate}</p>
                <p className="text-gray-600">Due: {dueDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">From:</h3>
                <p className="text-gray-600">{company.name}</p>
                <p className="text-gray-600">{company.address}</p>
                <p className="text-gray-600">{company.city}</p>
                {company.phone && <p className="text-gray-600">Phone: {company.phone}</p>}
                {company.email && <p className="text-gray-600">Email: {company.email}</p>}
                {company.gstin && <p className="text-gray-600">GSTIN: {company.gstin}</p>}
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Bill To:</h3>
                <p className="text-gray-600">{client.name}</p>
                <p className="text-gray-600">{client.address}</p>
                <p className="text-gray-600">{client.city}</p>
                {client.phone && <p className="text-gray-600">Phone: {client.phone}</p>}
                {client.email && <p className="text-gray-600">Email: {client.email}</p>}
                {client.gstin && <p className="text-gray-600">GSTIN: {client.gstin}</p>}
              </div>
            </div>

            <table className="w-full mb-8">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 border">Description</th>
                  <th className="text-right p-3 border">Qty</th>
                  <th className="text-right p-3 border">Price</th>
                  <th className="text-right p-3 border">Disc</th>
                  <th className="text-right p-3 border">Tax</th>
                  <th className="text-right p-3 border">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td className="p-3 border">{item.description}</td>
                    <td className="p-3 border text-right">{item.quantity}</td>
                    <td className="p-3 border text-right">{formatCurrency(item.price)}</td>
                    <td className="p-3 border text-right">{item.discountPercent}%</td>
                    <td className="p-3 border text-right">{item.taxPercent}%</td>
                    <td className="p-3 border text-right font-medium">{formatCurrency(calculateItemTotals(item).total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>{formatCurrency(invoiceTotals.subtotal)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Discount:</span>
                  <span>-{formatCurrency(invoiceTotals.totalDiscount)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Tax:</span>
                  <span>+{formatCurrency(invoiceTotals.totalTax)}</span>
                </div>
                <div className="flex justify-between py-2 border-t-2 border-gray-800 font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatCurrency(invoiceTotals.grandTotal)}</span>
                </div>
              </div>
            </div>

            {bankDetails && (
              <div className="mt-8">
                <h3 className="font-semibold text-gray-700 mb-2">Bank Details:</h3>
                <pre className="text-gray-600 whitespace-pre-wrap">{bankDetails}</pre>
              </div>
            )}

            {notes && (
              <div className="mt-8">
                <h3 className="font-semibold text-gray-700 mb-2">Notes:</h3>
                <p className="text-gray-600">{notes}</p>
              </div>
            )}

            <div className="mt-8 text-center text-gray-500 text-sm">
              Thank you for your business!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
