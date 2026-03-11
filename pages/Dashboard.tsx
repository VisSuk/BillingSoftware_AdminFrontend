
import React, { useState, useMemo } from 'react';
import {
  DollarSign, Users, Clock, CreditCard,
  FileText, X, ArrowUpRight, TrendingUp,
  AlertCircle, CheckCircle2, ChevronRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Client, Invoice } from '../types';

interface DashboardProps {
  clients: Client[];
  invoices: Invoice[];
}

interface StatModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const StatModal: React.FC<StatModalProps> = ({ isOpen, onClose, title, icon, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
        <div className="p-8 pb-4 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-sky-50 dark:bg-sky-900/20 text-sky-500 rounded-2xl flex items-center justify-center shadow-sm">
              {icon}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{title}</h3>
              <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest mt-0.5">Nexus Data Node</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-8 pt-4">
          {children}
        </div>
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-all"
          >
            Close Node
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ title, value, subtext, icon, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md hover:border-sky-200 dark:hover:border-sky-900/50 group active:scale-[0.98]"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-sky-500 transition-colors">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</h3>
      </div>
      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700 group-hover:bg-sky-500 group-hover:text-white transition-all">
        {icon}
      </div>
    </div>
    <div className="flex items-center justify-between">
      <p className="text-xs text-slate-400 dark:text-slate-500">{subtext}</p>
      <ArrowUpRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0" />
    </div>
  </button>
);

const Dashboard: React.FC<DashboardProps> = ({ clients, invoices }) => {
  const [activeModal, setActiveModal] = useState<'revenue' | 'clients' | 'due' | 'cash' | null>(null);

  const now = new Date()

  console.log("CLIENTS: ", clients)
  console.log("INVOICES: ", invoices)

  const data = [
    { month: 'Jan', amount: 4000 },
    { month: 'Feb', amount: 3000 },
    { month: 'Mar', amount: 5000 },
    { month: 'Apr', amount: 2000 },
    { month: 'May', amount: 6000 },
    { month: 'Jun', amount: 4000 },
    { month: 'Jul', amount: 7000 },
  ];

const onlinePayments = useMemo(
  () => invoices.filter(i => i.paymentMethod === "online" && i.status === "Paid" && new Date(i.expiryDate) > now),
  [invoices]
)
  console.log("ONLINE PAYMENTS: ", onlinePayments)
const cashPayments = useMemo(
  () => invoices.filter(i => i.paymentMethod === "cash" && i.status === "Paid" && new Date(i.expiryDate) > now),
  [invoices]
)
  console.log("CASH PAYMENTS: ", cashPayments)
  const onlineRevenue = useMemo(() => onlinePayments.reduce((acc, i) => acc + i.amount, 0))
  const cashRevenue = useMemo(() => cashPayments.reduce((acc, i) => acc + i.amount, 0))
const pendingClients = useMemo(
  () => clients.filter(client => client.status === "pending"),
  [clients]
)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${onlineRevenue.toLocaleString()}`}
          subtext="Online payments only"
          icon={<DollarSign size={20} />}
          onClick={() => setActiveModal('revenue')}
        />
        <StatCard
          title="Total Clients"
          value={clients.length.toString()}
          subtext="No change from last month"
          icon={<Users size={20} />}
          onClick={() => setActiveModal('clients')}
        />
        <StatCard
          title="Due Payments"
value={pendingClients.length.toString()}
          subtext="Total pending and overdue"
          icon={<Clock size={20} />}
          onClick={() => setActiveModal('due')}
        />
        <StatCard
          title="Clients Paying by Hand"
          value={cashPayments.length.toString()}
          subtext={`Total revenue of $${cashRevenue.toLocaleString()}`}
          icon={<CreditCard size={20} />}
          onClick={() => setActiveModal('cash')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm h-[450px] flex flex-col transition-colors">
          <div className="mb-8">
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Revenue Overview</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Monthly revenue tracking.</p>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Bar
                  dataKey="amount"
                  fill="currentColor"
                  className="text-slate-200 dark:text-slate-700 hover:text-sky-500 dark:hover:text-sky-500 transition-colors"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm h-[450px] flex flex-col transition-colors overflow-hidden">
          <div className="mb-6">
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Recent Invoices Overview</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Latest activity from your billing ledger.</p>
          </div>

          <div className="flex-1 overflow-auto">
            {invoices.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-sky-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                    <th className="pb-4">Client</th>
                    <th className="pb-4 text-center">Status</th>
                    <th className="pb-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {invoices.slice(0, 5).map((inv) => (
                    <tr key={inv.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{inv.clientName}</span>
                          <span className="text-[11px] text-slate-400 font-medium">{inv.clientEmail}</span>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <span className={`inline-block text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider ${inv.status === 'Paid'
                          ? 'bg-[#0ea5e9] text-white'
                          : inv.status === 'overdue'
                            ? 'bg-red-500 text-white'
                            : 'bg-amber-500 text-white'
                          }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <span className="text-sm font-black text-slate-900 dark:text-white">${inv.amount.toLocaleString()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
                <FileText size={40} className="mb-3 opacity-20" />
                <p className="text-sm font-bold uppercase tracking-widest italic opacity-50">No recent invoices found</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800">
            <button className="text-[10px] font-black text-sky-500 uppercase tracking-widest hover:text-sky-600 transition-colors">View all invoices →</button>
          </div>
        </div>
      </div>

      {/* --- DETAIL POPUPS --- */}

      {/* Total Revenue Modal */}
      <StatModal
        isOpen={activeModal === 'revenue'}
        onClose={() => setActiveModal(null)}
        title="Revenue Breakdown"
        icon={<TrendingUp size={24} />}
      >
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl flex items-center justify-between border border-emerald-100 dark:border-emerald-900/30">
            <div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Total Combined</p>
              <h4 className="text-2xl font-black text-emerald-700 dark:text-emerald-400">${onlineRevenue.toLocaleString()}</h4>
            </div>
            <TrendingUp size={32} className="text-emerald-200 dark:text-emerald-900/50" />
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800">
                <th className="py-3">Client Source</th>
                <th className="py-3 text-right">LTV Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {onlinePayments.map(inv => (
                <tr key={inv.id}>
                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {inv.clientName}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {inv.clientEmail}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      ${inv.amount.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </StatModal>

      {/* Total Clients Modal */}
      <StatModal
        isOpen={activeModal === 'clients'}
        onClose={() => setActiveModal(null)}
        title="Client Registry"
        icon={<Users size={24} />}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Nodes</p>
              <h4 className="text-xl font-black text-slate-800 dark:text-slate-100">{clients.length}</h4>
            </div>
            <div className="p-4 bg-sky-50 dark:bg-sky-900/10 rounded-2xl border border-sky-100 dark:border-sky-900/30">
              <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest">Active Status</p>
              <h4 className="text-xl font-black text-sky-700 dark:text-sky-400">{clients.filter(c => c.status === 'active').length}</h4>
            </div>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800">
                <th className="py-3">Node Name</th>
                <th className="py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {clients.map(c => (
                <tr key={c.id}>
                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{c.name}</span>
                      <span className="text-[11px] text-slate-400">{c.planName}</span>
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    <span className={`inline-block text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider ${c.status === 'Active' ? 'bg-sky-500 text-white' :
                      c.status === 'Paused' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </StatModal>

      {/* Due Payments Modal */}
      <StatModal
        isOpen={activeModal === 'due'}
        onClose={() => setActiveModal(null)}
        title="Outstanding Invoices"
        icon={<Clock size={24} />}
      >
        <div className="space-y-4">
          {pendingClients.length > 0 ? (
            <div className="space-y-3">
              {pendingClients.map(inv => (
                <div key={inv.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-sm hover:border-sky-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${inv.status === 'Overdue' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
                      <AlertCircle size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">{inv.clientName}</h4>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">{inv.id} • Due {inv.dueDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900 dark:text-white">${inv.price.toLocaleString()}</p>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${inv.status === 'Overdue' ? 'text-red-500' : 'text-amber-500'}`}>{inv.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400">
              <CheckCircle2 size={48} className="mx-auto mb-4 text-emerald-500 opacity-50" />
              <p className="text-sm font-black uppercase tracking-widest italic">All ledgers balanced</p>
            </div>
          )}
        </div>
      </StatModal>

      {/* Cash Pay Modal */}
      <StatModal
        isOpen={activeModal === 'cash'}
        onClose={() => setActiveModal(null)}
        title="Manual Pay Registry"
        icon={<CreditCard size={24} />}
      >
        <div className="space-y-4">
          <div className="p-4 bg-sky-50 dark:bg-sky-900/10 rounded-2xl border border-sky-100 dark:border-sky-900/30 mb-4">
            <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest">Manual Revenue Capture</p>
            <h4 className="text-2xl font-black text-sky-700 dark:text-sky-400">${cashRevenue.toLocaleString()}</h4>
          </div>
          <div className="space-y-3">
            {cashPayments.map(inv => (
              <div key={inv.id} className="p-4 flex items-center justify-between border-b border-slate-50 dark:border-slate-800 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                    <Users size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {inv.clientName}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {inv.clientEmail}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-black text-slate-900 dark:text-white">
                    ${inv.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </StatModal>
    </div>
  );
};

export default Dashboard;
