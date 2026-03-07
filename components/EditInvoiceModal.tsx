
import React, { useState, useEffect } from 'react';
import { X, ChevronDown, DollarSign, Calendar, FileText, User } from 'lucide-react';
import { Client, Invoice } from '../types';

interface EditInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (invoice: Invoice) => void;
  invoice: Invoice | null;
  clients: Client[];
}

const EditInvoiceModal: React.FC<EditInvoiceModalProps> = ({ isOpen, onClose, onUpdate, invoice, clients }) => {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [amount, setAmount] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('')
  const [status, setStatus] = useState<'Paid' | 'Pending' | 'Overdue'>('Pending');
  const [description, setDescription] = useState('');

  // Helper to safely convert display date strings back to YYYY-MM-DD for input[type="date"]
  const getISOStringFromDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      // Remove ordinals like "1st", "2nd", etc. as they cause invalid date parsing in some environments
      const sanitized = dateStr.replace(/(\d+)(st|nd|rd|th)/, '$1');
      const d = new Date(sanitized);
      if (isNaN(d.getTime())) return '';
      return d.toISOString().split('T')[0];
    } catch (e) {
      console.error("Date parsing error:", e);
      return '';
    }
  };

  useEffect(() => {
    if (invoice && isOpen) {
      const client = clients.find(c => c.name === invoice.clientName);
      setSelectedClientId(client?.id || '');
      setAmount(invoice.amount.toString());
      setIssueDate(getISOStringFromDisplayDate(invoice.issueDate));
      setDueDate(getISOStringFromDisplayDate(invoice.dueDate));
      setExpiryDate(getISOStringFromDisplayDate(invoice.expiryDate));
      setStatus(invoice.status);
      setDescription(invoice.description);
    }
  }, [invoice, isOpen, clients]);

  if (!isOpen || !invoice) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find(c => c.id === selectedClientId);
    if (!client || !amount) return;

    // Convert local date picker values back to long display format
    const formatDisplayDate = (val: string) => {
      if (!val) return '';
      const d = new Date(val);
      // We use standard long format without ordinals for maximum compatibility
      return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    const updatedInvoice: Invoice = {
      ...invoice,
      clientName: client.name,
      clientEmail: client.email,
      amount: parseFloat(amount),
      issueDate: formatDisplayDate(issueDate),
      dueDate: formatDisplayDate(dueDate),
      expiryDate: formatDisplayDate(expiryDate),
      status: status,
      description: description
    };

    onUpdate(updatedInvoice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-[#f0f9ff] w-full max-w-xl rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh] border border-sky-100 animate-in zoom-in-95 fade-in duration-200">
        
        {/* Header */}
        <div className="p-10 pb-4 shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none">Edit Invoice</h2>
              <p className="text-slate-500 text-sm font-bold mt-2 uppercase tracking-widest opacity-70">Modify Ledger Entry #{invoice.id}</p>
            </div>
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-slate-600 p-2 hover:bg-white rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-10 pb-10 space-y-8">
          
          <div className="space-y-6 bg-white rounded-[2rem] p-8 shadow-sm border border-sky-50">
            
            {/* Client Selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-sky-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                <User size={12} /> Target Client
              </label>
              <div className="relative">
                <select 
                  required
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 appearance-none focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all"
                >
                  <option value="">Select a client to bill...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-sky-500" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-sky-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                <FileText size={12} /> Description
              </label>
              <input 
                required
                type="text" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Monthly Subscription..."
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all"
              />
            </div>

            {/* Amount & Status Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-sky-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                  <DollarSign size={12} /> Total Amount
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-9 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-sky-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                   Status
                </label>
                <div className="relative">
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 appearance-none focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-sky-500" />
                </div>
              </div>
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-sky-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                  <Calendar size={12} /> Start Date
                </label>
                <input 
                  required
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-sky-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                  <Calendar size={12} /> End Date
                </label>
                <input 
                  required
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none"
                />
              </div>
            </div>

          </div>

          {/* Action Button */}
          <button 
            type="submit"
            className="w-full bg-[#0ea5e9] hover:bg-sky-600 text-white font-black py-5 rounded-[1.5rem] transition-all shadow-xl shadow-sky-500/20 text-xs uppercase tracking-[0.2em] active:scale-[0.98] flex items-center justify-center gap-3"
          >
            Update Ledger Record
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditInvoiceModal;
