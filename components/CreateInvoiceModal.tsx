
import React, { useState } from 'react';
import { X, ChevronDown, DollarSign, Calendar, FileText, User } from 'lucide-react';
import { Client, Invoice } from '../types';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (invoice: Invoice) => void;
  clients: Client[];
}

const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({ isOpen, onClose, onCreate, clients }) => {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [amount, setAmount] = useState('');
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  // Status removed from UI, defaulting to 'Paid' as per requirement
  const [status] = useState<'Paid' | 'Pending' | 'Overdue'>('Paid');
  const [description, setDescription] = useState('Monthly Subscription');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find(c => c.id === selectedClientId);
    if (!client || !amount) return;

    const newInvoice: Invoice = {
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: client.name,
      clientEmail: client.email,
      amount: parseFloat(amount),
      issueDate: new Date(issueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      dueDate: new Date(dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: status,
      description: description
    };

    onCreate(newInvoice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-[#f0f9ff] w-full max-w-xl rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh] border border-sky-100 animate-in zoom-in-95 fade-in duration-200">
        
        {/* Header */}
        <div className="p-10 pb-4 shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none">Create Invoice</h2>
              <p className="text-slate-500 text-sm font-bold mt-2 uppercase tracking-widest opacity-70">Billing Ledger Entry</p>
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

            {/* Amount Field */}
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
                  className="w-full pl-9 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all"
                />
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
                  value={dueDate}
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
            <FileText size={18} />
            Deploy Official Invoice
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoiceModal;
