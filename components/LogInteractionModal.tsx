
import React, { useState } from 'react';
import { X, Mail, Phone, Users, ArrowUpRight, ArrowDownLeft, Calendar as CalendarIcon, MessageSquare } from 'lucide-react';

interface LogInteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (interaction: any) => void;
}

const LogInteractionModal: React.FC<LogInteractionModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    type: 'EMAIL' as 'EMAIL' | 'CALL' | 'MEETING',
    direction: 'Outbound' as 'Outbound' | 'Inbound',
    title: '',
    description: '',
    agent: 'Admin User'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    onSave({
      id: Date.now().toString(),
      ...formData,
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    });
    setFormData({ type: 'EMAIL', direction: 'Outbound', title: '', description: '', agent: 'Admin User' });
    onClose();
  };

  const types = [
    { id: 'EMAIL', icon: Mail, label: 'Email', color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'CALL', icon: Phone, label: 'Call', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'MEETING', icon: Users, label: 'Meeting', color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-[#f8fafc] w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col transition-all border border-sky-100/50">
        <div className="p-10 pb-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none">Log Interaction</h2>
            <p className="text-slate-500 text-xs font-bold mt-2 uppercase tracking-widest opacity-70">Record client communication</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 pt-0 space-y-8">
          {/* Interaction Type Selector */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-sky-500 uppercase tracking-[0.2em] ml-1">Interaction Type</label>
            <div className="grid grid-cols-3 gap-3">
              {types.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: t.id as any })}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                    formData.type === t.id 
                      ? 'border-[#0ea5e9] bg-white shadow-md scale-105' 
                      : 'border-transparent bg-slate-100/50 grayscale hover:grayscale-0 hover:bg-white hover:border-sky-100'
                  }`}
                >
                  <t.icon className={t.color} size={24} />
                  <span className="text-xs font-black text-slate-700">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Direction Toggle */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-sky-500 uppercase tracking-[0.2em] ml-1">Direction</label>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, direction: 'Outbound' })}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${
                  formData.direction === 'Outbound' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <ArrowUpRight size={16} className={formData.direction === 'Outbound' ? 'text-blue-500' : ''} />
                Outbound
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, direction: 'Inbound' })}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${
                  formData.direction === 'Inbound' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <ArrowDownLeft size={16} className={formData.direction === 'Inbound' ? 'text-emerald-500' : ''} />
                Inbound
              </button>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-sky-500 uppercase tracking-[0.2em] ml-1">Subject</label>
              <input 
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., Discussion about plan upgrade"
                className="w-full px-5 py-4 bg-white border border-sky-100 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all placeholder:text-slate-300"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-sky-500 uppercase tracking-[0.2em] ml-1">Notes / Details</label>
              <textarea 
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="What was discussed? Any follow-up actions?"
                className="w-full px-5 py-4 bg-white border border-sky-100 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all resize-none placeholder:text-slate-300"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#0ea5e9] hover:bg-sky-600 text-white font-black py-5 rounded-[1.5rem] transition-all shadow-xl shadow-sky-500/20 text-sm uppercase tracking-[0.2em] active:scale-[0.98]"
          >
            Save to Log
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogInteractionModal;
