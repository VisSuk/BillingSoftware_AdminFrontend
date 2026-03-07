
import React, { useState } from 'react';
import { X, Mail, Download, Loader2, Check, Edit3 } from 'lucide-react';
import { Invoice } from '../types';

interface InvoiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onEdit?: (invoice: Invoice) => void;
}

const InvoiceDetailsModal: React.FC<InvoiceDetailsModalProps> = ({ isOpen, onClose, invoice, onEdit }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);

  if (!isOpen || !invoice) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const element = document.createElement("a");
    const file = new Blob([`Official Invoice ${invoice.id}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Invoice-${invoice.id}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setIsDownloading(false);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleEmailClient = async () => {
    if (isEmailing) return;
    setIsEmailing(true);
    await new Promise(resolve => setTimeout(resolve, 1800));
    setIsEmailing(false);
    setEmailSuccess(true);
    setTimeout(() => setEmailSuccess(false), 3000);
  };

  const handleEditInternal = () => {
    if (onEdit) {
      onEdit(invoice);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-slate-900/60 backdrop-blur-sm p-6 overflow-y-auto ">
      <div className="bg-[#f0f9ff] w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl relative flex flex-col transition-all duration-300 animate-in zoom-in-95 fade-in">
        
        {/* Header Section */}
        <div className="p-10 pb-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X size={24} />
          </button>

          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-[44px] font-bold text-slate-800 tracking-tight leading-none mb-2">Invoice</h2>
              <p className="text-slate-500 font-bold text-lg">Invoice #{invoice.id}</p>
              <div className="mt-4 flex gap-2">
                <span className={`inline-block text-[11px] font-black px-5 py-1.5 rounded-2xl uppercase tracking-[0.15em] shadow-sm text-white ${
                  invoice.status === 'Overdue' ? 'bg-[#0ea5e9]' : invoice.status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}>
                  {invoice.status}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleEditInternal}
                className="flex items-center gap-3 px-6 py-3 bg-white text-slate-700 hover:bg-slate-50 border-none rounded-2xl text-[13px] font-bold transition-all shadow-md active:scale-95 min-w-[180px] justify-center"
              >
                <Edit3 size={18} className="text-[#0ea5e9]" />
                <span className="ml-1">Edit Details</span>
              </button>

              <button 
                onClick={handleEmailClient}
                disabled={isEmailing}
                className={`flex items-center gap-3 px-6 py-3 border-none rounded-2xl text-[13px] font-bold transition-all shadow-md active:scale-95 group min-w-[180px] justify-center ${
                  emailSuccess 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {isEmailing ? (
                  <Loader2 size={18} className="animate-spin text-sky-500" />
                ) : emailSuccess ? (
                  <Check size={18} className="text-white" />
                ) : (
                  <Mail size={18} className="text-[#0ea5e9]" />
                )}
                <span className="ml-1">{isEmailing ? 'Emailing...' : emailSuccess ? 'Sent!' : 'Email Client'}</span>
              </button>
              
              <button 
                onClick={handleDownload}
                disabled={isDownloading}
                className={`flex items-center gap-3 px-6 py-3 border-none rounded-2xl text-[13px] font-bold transition-all shadow-md active:scale-95 min-w-[180px] justify-center ${
                  downloadSuccess 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {isDownloading ? (
                  <Loader2 size={18} className="animate-spin text-sky-500" />
                ) : downloadSuccess ? (
                  <Check size={18} className="text-white" />
                ) : (
                  <Download size={18} className="text-[#0ea5e9]" />
                )}
                <span className="ml-1">{isDownloading ? 'Generating...' : downloadSuccess ? 'Downloaded!' : 'Download PDF'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="px-10 pb-16 space-y-16">
          {/* Billing Info Grid */}
          <div className="flex justify-between">
            <div className="w-1/2">
              <p className="text-[12px] font-black text-[#0ea5e9] uppercase tracking-[0.2em] mb-4">Billed To</p>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-slate-800 leading-tight">{invoice.clientName}</h4>
                <p className="text-base text-slate-500 font-bold">Client Account</p>
                <p className="text-base text-slate-400 font-medium">{invoice.clientEmail}</p>
              </div>
            </div>
            <div className="w-1/2 text-right">
              <p className="text-[12px] font-black text-[#0ea5e9] uppercase tracking-[0.2em] mb-4">Billed From</p>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-slate-800 leading-tight">NexusBill Inc.</h4>
                <p className="text-base text-slate-500 font-medium">123 App St, Dev City, 10101</p>
                <p className="text-base text-slate-400 font-medium">billing@nexusbill.com</p>
              </div>
            </div>
          </div>

          {/* Dates Grid */}
          <div className="flex justify-between">
            <div className="w-1/2">
              <p className="text-[12px] font-black text-[#0ea5e9] uppercase tracking-[0.2em] mb-3">Start Date</p>
              <p className="text-lg font-bold text-slate-800">{invoice.issueDate || 'June 22nd, 2024'}</p>
            </div>
            <div className="w-1/2 text-right">
              <p className="text-[12px] font-black text-[#0ea5e9] uppercase tracking-[0.2em] mb-3">End Date</p>
              <p className="text-lg font-bold text-slate-800">{invoice.expiryDate}</p>
            </div>
          </div>

          {/* Table Header */}
          <div className="border-b border-sky-100/50 pb-4 flex justify-between items-center">
            <p className="text-[12px] font-black text-[#0ea5e9] uppercase tracking-[0.2em]">Description</p>
            <p className="text-[12px] font-black text-[#0ea5e9] uppercase tracking-[0.2em]">Amount</p>
          </div>

          {/* Table Row */}
          <div className="flex justify-between items-start pt-2">
            <div>
              <h4 className="text-xl font-bold text-slate-800">{invoice.description || 'Monthly Pro'}</h4>
              <p className="text-[12px] text-slate-500 font-bold mt-1.5 uppercase tracking-widest opacity-60">Services Ledger Entry</p>
            </div>
            <p className="text-xl font-bold text-slate-900">${invoice.amount.toLocaleString()}.00</p>
          </div>

          {/* Totals Section */}
          <div className="pt-10 flex flex-col items-end gap-5 border-t border-sky-50">
            <div className="flex items-center gap-24">
              <span className="text-[14px] font-black text-[#0ea5e9] uppercase tracking-[0.15em]">Subtotal</span>
              <span className="text-xl font-bold text-slate-800">${invoice.amount.toLocaleString()}.00</span>
            </div>
            <div className="flex items-center gap-24">
              <span className="text-[14px] font-black text-[#0ea5e9] uppercase tracking-[0.15em]">Tax (0%)</span>
              <span className="text-xl font-bold text-slate-800">$0.00</span>
            </div>
            <div className="w-full h-px bg-slate-200 mt-2"></div>
            <div className="flex items-center gap-24 pt-2">
              <span className="text-2xl font-bold text-slate-800 uppercase tracking-tighter">Total</span>
              <span className="text-3xl font-bold text-slate-900">${invoice.amount.toLocaleString()}.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsModal;
