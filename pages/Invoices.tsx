
import React, { useState } from 'react';
import {
  Search, Plus, Download,
  Trash2, Loader2, CheckCircle2, X, FileText, Edit2
} from 'lucide-react';
import InvoiceDetailsModal from '../components/InvoiceDetailsModal';
import CreateInvoiceModal from '../components/CreateInvoiceModal';
import EditInvoiceModal from '../components/EditInvoiceModal';
import { Invoice, Client } from '../types';
import jsPDF from 'jspdf';

interface InvoicesProps {
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  clients: Client[];
}

const Invoices: React.FC<InvoicesProps> = ({ invoices, setInvoices, clients }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [invoiceToEdit, setInvoiceToEdit] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; visible: boolean } | null>(null);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleRowClick = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setIsModalOpen(true);
  };

  const handleCreateInvoice = (newInvoice: Invoice) => {
    setInvoices(prev => [newInvoice, ...prev]);
    showToast(`Invoice ${newInvoice.id} created successfully.`);
  };

  const handleUpdateInvoice = (updatedInvoice: Invoice) => {
    setInvoices(prev => prev.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv));
    showToast(`Invoice ${updatedInvoice.id} updated successfully.`);
  };

  const handleEditClick = (inv: Invoice) => {
    setInvoiceToEdit(inv);
    setIsEditModalOpen(true);
  };

  const handleDeleteInvoice = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (deletingId) return;
    setDeletingId(id);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setInvoices(prev => prev.filter(inv => inv.id !== id));
    setDeletingId(null);
    showToast(`Invoice ${id} has been permanently removed.`);
  };

  // const handleDownloadInvoice = async (e: React.MouseEvent, id: string) => {
  //   e.stopPropagation();
  //   setDownloadingId(id);
  //   await new Promise(resolve => setTimeout(resolve, 1500));
  //   const element = document.createElement("a");
  //   const file = new Blob([`Official Invoice Data for ${id}`], {type: 'application/pdf'});
  //   element.href = URL.createObjectURL(file);
  //   element.download = `Invoice-${id}.pdf`;
  //   document.body.appendChild(element);
  //   element.click();
  //   document.body.removeChild(element);
  //   setDownloadingId(null);
  // };
  const handleDownloadInvoice = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDownloadingId(id);

    await new Promise(resolve => setTimeout(resolve, 800));

    const invoice = invoices.find(inv => inv.id === id);
    if (!invoice) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Invoice", 20, 20);

    doc.setFontSize(12);
    doc.text(`Invoice ID: ${invoice.id}`, 20, 40);
    doc.text(`Client: ${invoice.clientName}`, 20, 50);
    doc.text(`Email: ${invoice.clientEmail}`, 20, 60);
    doc.text(`Amount: $${invoice.amount}`, 20, 70);
    doc.text(`Status: ${invoice.status}`, 20, 80);
    doc.text(`Issue Date: ${invoice.issueDate}`, 20, 90);
    doc.text(`Expiry Date: ${invoice.expiryDate}`, 20, 100);

    doc.save(`Invoice-${invoice.id}.pdf`);

    setDownloadingId(null);
  };
  const filteredInvoices = invoices.filter(inv =>
    inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadAll = async () => {
    if (filteredInvoices.length === 0) return;

    setIsDownloadingAll(true);
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // Define CSV Headers
      const headers = ["Invoice ID", "Client Name", "Client Email", "Status", "Start Date", "End Date", "Amount", "Description"];

      // Map data to CSV rows
      const rows = filteredInvoices.map(inv => [
        `"${inv.id}"`,
        `"${inv.clientName}"`,
        `"${inv.clientEmail}"`,
        `"${inv.status}"`,
        `"${inv.issueDate}"`,
        `"${inv.expiryDate}"`,
        `"${inv.amount}"`,
        `"${inv.description.replace(/"/g, '""')}"`
      ]);

      // Combine into one CSV string
      const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      const dateStr = new Date().toISOString().split('T')[0];
      link.setAttribute("href", url);
      link.setAttribute("download", `NexusBill_Ledger_${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast(`Successfully exported ${filteredInvoices.length} records to CSV.`);
    } catch (error) {
      console.error("Export failed:", error);
      showToast("Error generating export file.");
    } finally {
      setIsDownloadingAll(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-8 right-8 z-[100] animate-in slide-in-from-right-10 fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/30 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center text-emerald-500">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Success</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="ml-4 text-slate-300 hover:text-slate-500 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Invoices</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">View and manage all invoices.</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2">
            <button
              onClick={handleDownloadAll}
              disabled={filteredInvoices.length === 0 || isDownloadingAll}
              className={`bg-sky-50 dark:bg-sky-900/20 hover:bg-sky-100 dark:hover:bg-sky-900/40 text-sky-600 dark:text-sky-400 px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold transition-all border border-sky-100 dark:border-sky-900/50 disabled:opacity-50 disabled:cursor-not-allowed group/bulk active:scale-95`}
            >
              {isDownloadingAll ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Download size={18} className="group-hover/bulk:translate-y-0.5 transition-transform" />
              )}
              {isDownloadingAll ? 'Preparing...' : `Download All (${filteredInvoices.length})`}
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-lg active:scale-95"
            >
              <Plus size={18} />
              Create Invoice
            </button>
          </div>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400 dark:text-slate-500 group-focus-within:text-sky-500 transition-colors" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by client or invoice ID..."
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/10 dark:text-slate-200 dark:placeholder-slate-600 transition-all shadow-sm"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <th className="px-6 py-5 text-[11px] font-bold text-sky-500 uppercase tracking-widest">Invoice ID</th>
                <th className="px-6 py-5 text-[11px] font-bold text-sky-500 uppercase tracking-widest">Client</th>
                <th className="px-6 py-5 text-[11px] font-bold text-sky-500 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-5 text-[11px] font-bold text-sky-500 uppercase tracking-widest text-center">End Date</th>
                <th className="px-6 py-5 text-[11px] font-bold text-sky-500 uppercase tracking-widest text-right">Amount</th>
                <th className="px-6 py-5 text-[11px] font-bold text-sky-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all duration-300 cursor-pointer group/row ${deletingId === inv.id ? 'opacity-50 grayscale scale-[0.98]' : 'opacity-100'
                      }`}
                    onClick={() => handleRowClick(inv)}
                  >
                    <td className="px-6 py-6 font-bold text-slate-800 dark:text-slate-200 text-sm">{inv.id}</td>
                    <td className="px-6 py-6">
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200 text-sm leading-tight">{inv.clientName}</div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{inv.clientEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className={`inline-block text-[10px] font-black px-3 py-1 rounded-lg tracking-wider uppercase ${inv.status === 'Paid' ? 'bg-sky-500 text-white shadow-sm' :
                          inv.status === 'Overdue' ? 'bg-red-500 text-white shadow-sm' : 'bg-amber-500 text-white shadow-sm'
                        }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-sm text-slate-600 dark:text-slate-400 text-center font-medium">{inv.expiryDate}</td>
                    <td className="px-6 py-6 font-black text-slate-900 dark:text-slate-100 text-sm text-right">$ {inv.amount.toLocaleString()}.00</td>
                    <td className="px-6 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2 text-slate-300 dark:text-slate-600">
                        <button
                          onClick={() => handleEditClick(inv)}
                          className="p-2 hover:text-sky-500 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-xl transition-all group/edit"
                          title="Edit Invoice"
                        >
                          <Edit2 size={18} className="group-hover/edit:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={(e) => handleDownloadInvoice(e, inv.id)}
                          disabled={downloadingId === inv.id || deletingId === inv.id}
                          className="p-2 hover:text-sky-500 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-xl transition-all"
                        >
                          {downloadingId === inv.id ? <Loader2 size={18} className="animate-spin text-sky-500" /> : <Download size={18} />}
                        </button>
                        <button
                          onClick={(e) => handleDeleteInvoice(e, inv.id)}
                          disabled={deletingId === inv.id}
                          className={`p-2 rounded-xl transition-all ${deletingId === inv.id ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'hover:text-red-500 hover:bg-red-50'}`}
                        >
                          {deletingId === inv.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center opacity-40">
                      <FileText size={48} className="text-slate-400 mb-2" />
                      <p className="text-sm font-bold text-slate-500 italic uppercase tracking-widest">No invoices found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <InvoiceDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        invoice={selectedInvoice}
        onEdit={handleEditClick}
      />

      <CreateInvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateInvoice}
        clients={clients}
      />

      <EditInvoiceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdateInvoice}
        invoice={invoiceToEdit}
        clients={clients}
      />
    </div>
  );
};

export default Invoices;
