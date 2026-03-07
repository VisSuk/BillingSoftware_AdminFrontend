
import React, { useState, useMemo } from 'react';
import { Cpu, Calendar, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Client } from '../types';

interface AutopayProps {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
}

const AutopayProcessor: React.FC<AutopayProps> = ({ clients, setClients }) => {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const selectedClient = useMemo(() => 
    clients.find(c => c.id === selectedClientId) || null
  , [clients, selectedClientId]);

  const handleRun = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setClients(prev => prev.map(c => 
        c.id === selectedClientId ? { ...c, status: 'Active' } : c
      ));
      setIsProcessing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl p-10 transition-colors">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Autopay Simulation</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Test the automated renewal logic for your clients.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleRun}>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-sky-500 uppercase tracking-widest ml-1">Client Target</label>
            <div className="relative">
              <select 
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full px-5 py-4 bg-sky-50/50 dark:bg-slate-800 border border-sky-100 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-800 dark:text-slate-200 appearance-none focus:outline-none"
              >
                <option value="">Select client to process...</option>
                {clients.filter(c => c.autopayEnabled).map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.subscription})</option>
                ))}
              </select>
              <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-sky-500" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-sky-500 uppercase tracking-widest ml-1">Simulation Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-sky-500">
                <Calendar size={18} />
              </div>
              <input 
                type="text" 
                readOnly
                value={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                className="w-full pl-12 pr-5 py-4 bg-sky-50/50 dark:bg-slate-800 border border-sky-100 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none cursor-default"
              />
            </div>
            <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">Runs against client's scheduled renewal date.</p>
          </div>

          <button 
            type="submit"
            disabled={!selectedClientId || isProcessing}
            className={`w-full font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl text-xs uppercase tracking-widest ${
              success 
                ? 'bg-emerald-500 text-white' 
                : 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/20 active:scale-95 disabled:opacity-50'
            }`}
          >
            {isProcessing ? (
              <Cpu size={20} className="animate-spin" />
            ) : success ? (
              <CheckCircle2 size={20} />
            ) : (
              <Cpu size={20} />
            )}
            {isProcessing ? 'Simulating AI...' : success ? 'Success' : 'Run Autopay Simulation'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AutopayProcessor;
