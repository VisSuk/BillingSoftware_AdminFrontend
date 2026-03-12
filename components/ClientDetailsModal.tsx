
import React, { useState, useEffect } from 'react';
import {
  X, Pause, Play, Ban, RotateCcw, Mail, Building2, Calendar,
  CreditCard, RefreshCw, Phone, DollarSign, CheckCircle2,
  Plus, ArrowUpRight, ArrowDownLeft, AlertTriangle, User as UserIcon,
  Users, MessageSquare, ShieldCheck, Activity, Settings, AlertCircle
} from 'lucide-react';
import { Client, Interaction, SubscriptionPlan, ActivityLog } from '../types';
import EditClientModal from './EditClientModal';
import LogInteractionModal from './LogInteractionModal';
import { cancelSubscriptionAPI, pauseSubscriptionAPI, resumeSubscriptionAPI } from '@/services/allApi';
import { useNavigate } from 'react-router-dom';

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  onUpdate: (client: Client) => void;
  plans: SubscriptionPlan[];
  refreshClients: () => void
}

const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({ isOpen, onClose, client, onUpdate, plans, refreshClients }) => {

  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<'Overview' | 'History' | 'Activity'>('Overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isRestartMenuOpen, setIsRestartMenuOpen] = useState(false);

  if (!isOpen) return null;

  const handleToggleAutopay = () => {
    onUpdate({ ...client, autopayEnabled: !client.autopayEnabled });
  };

  // const handleStatusToggle = (newStatus: Client['status']) => {
  //   onUpdate({ ...client, status: newStatus });
  // };

  const handlePause = async () => {
    await pauseSubscriptionAPI(client.subscriptionId);
    refreshClients();
  };

  const handleResume = async () => {
    await resumeSubscriptionAPI(client.subscriptionId);
    refreshClients();
  };

  const handleCancel = async () => {
    await cancelSubscriptionAPI(client.subscriptionId);
    refreshClients();
  };

  const handleLogInteraction = (interaction: Interaction) => {
    onUpdate({ ...client, history: [interaction, ...client.history] });
  };

  const getTypeIcon = (type: Interaction['type']) => {
    switch (type) {
      case 'EMAIL': return Mail;
      case 'CALL': return Phone;
      case 'MEETING': return Users;
      default: return MessageSquare;
    }
  };

  const getActivityIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'LOGIN': return ShieldCheck;
      case 'PAYMENT': return CreditCard;
      case 'PROFILE_CHANGE': return Settings;
      default: return Activity;
    }
  };

  const getActivityColors = (status: ActivityLog['status'], type: ActivityLog['type']) => {
    if (status === 'FAILURE') return 'text-red-500 bg-red-50 border-red-100';
    switch (type) {
      case 'LOGIN': return 'text-blue-500 bg-blue-50 border-blue-100';
      case 'PAYMENT': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'PROFILE_CHANGE': return 'text-amber-500 bg-amber-50 border-amber-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 text-slate-800">
        <div className="bg-[#eef8ff] w-full max-w-4xl rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-10 pb-4 shrink-0">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-full border-[4px] border-[#0ea5e9] bg-white flex items-center justify-center overflow-hidden">
                  {client.avatar ? <img src={client.avatar} className="w-full h-full object-cover" /> : <div className={`w-10 h-10 rounded-full border-[5px] ${client.status === 'Cancelled' ? 'border-red-400' : 'border-sky-400'}`}></div>}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none">{client.name}</h2>
                  <div className="flex gap-2.5 mt-2">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white ${client.status === 'Cancelled' ? 'bg-red-500' : 'bg-[#0ea5e9]'}`}>
                      {client.status.toUpperCase()}
                    </span>
                    {client.status === 'Paused' && (
                      <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 flex items-center gap-1.5">
                        <AlertTriangle size={10} /> PAUSED
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-4 w-1/3 justify-end">
                {client.status !== 'cancelled' ? (
                  <>
                    {client.status === 'paused' ? (
                      <button
                        onClick={handleResume}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-sky-100 rounded-2xl text-xs font-black shadow-sm"
                      >
                        <Play size={16} fill="currentColor" /> Resume
                      </button>
                    ) : (
                      <button
                        onClick={handlePause}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-sky-100 rounded-2xl text-xs font-black shadow-sm"
                      >
                        <Pause size={16} fill="currentColor" /> Pause
                      </button>
                    )}
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-red-500/20"
                    >
                      <Ban size={16} /> Cancel
                    </button>
                  </>
                ) : (
                  <div className="relative w-1/2">

                    <button
                      onClick={() => setIsRestartMenuOpen(prev => !prev)}
                      className="px-6 py-5 bg-emerald-500 text-white rounded-2xl text-xs font-black w-full flex items-center justify-center gap-2"
                    >
                      <RotateCcw size={16} />
                      Restart
                    </button>

                    {isRestartMenuOpen && (
                      <div className="absolute top-full mt-2 flex flex-col bg-white border border-slate-200 shadow-md rounded-lg z-50 w-full">

                        <button
                          onClick={() => {
                            onClose();
                            navigate(`/cash-pay?subId=${client.subscriptionId}`);
                          }}
                          className="px-4 py-2 text-xs hover:bg-slate-100 text-left"
                        >
                          Cash
                        </button>

                        <button
                          onClick={() => {
                            onClose();
                            navigate(`/online-pay?subId=${client.subscriptionId}`);
                          }}
                          className="px-4 py-2 text-xs hover:bg-slate-100 text-left"
                        >
                          Online
                        </button>

                      </div>
                    )}

                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-4 mt-10">
              {[
                { id: 'Overview', label: 'Overview' },
                { id: 'History', label: 'Communications' },
                { id: 'Activity', label: 'System Log' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-8 py-3 font-black text-[11px] rounded-2xl uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#d1e9f6] text-sky-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-10 pb-8 flex-1 overflow-y-auto">
            <div className={`bg-white rounded-[3rem] p-12 shadow-sm min-h-[450px] ${client.status === 'Cancelled' ? 'grayscale opacity-75' : ''}`}>
              {activeTab === 'Overview' && (
                <>
                  <h3 className="text-2xl font-black mb-12">Operational Data</h3>
                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-10">
                      {[
                        { label: 'Email Address', value: client.email, icon: Mail },
                        { label: 'Phone Reference', value: client.phone || 'N/A', icon: Phone },
                        { label: 'Member Since', value: new Date(client.joiningDate).toLocaleDateString("hi-IN"), icon: Calendar }
                      ].map(item => (
                        <div key={item.label} className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400"><item.icon size={24} /></div>
                          <div>
                            <p className="text-[11px] font-black text-sky-500 uppercase tracking-widest">{item.label}</p>
                            <p className="text-[15px] font-bold">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-10">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-500"><DollarSign size={24} /></div>
                        <div>
                          <p className="text-[11px] font-black text-sky-500 uppercase tracking-widest">Spending</p>
                          <p className="text-[18px] font-black text-emerald-600">$ {client.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pr-4">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-sky-500">
                            <RefreshCw size={24} className={client.autopayEnabled ? 'animate-spin' : ''} style={{ animationDuration: '4s' }} />
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-sky-500 uppercase tracking-widest">Autopay Status</p>
                            <p className="text-[15px] font-bold">{client.autopayEnabled ? 'Enabled' : 'Disabled'}</p>
                          </div>
                        </div>
                        <button
                          onClick={handleToggleAutopay}
                          disabled={client.status === 'Cancelled'}
                          className={`w-14 h-7 rounded-full flex items-center px-1 transition-all ${client.autopayEnabled ? 'bg-[#0ea5e9]' : 'bg-slate-200'}`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all ${client.autopayEnabled ? 'translate-x-7' : 'translate-x-0'}`} />
                        </button>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-sky-400"><CreditCard size={24} /></div>
                        <div>
                          <p className="text-[11px] font-black text-sky-500 uppercase tracking-widest">Current Plan</p>
                          <p className="text-[15px] font-black">{client.planName}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'History' && (
                <div>
                  <div className="flex justify-between items-center mb-12">
                    <h3 className="text-2xl font-black">Interaction History</h3>
                    <button onClick={() => setIsLogModalOpen(true)} className="bg-sky-50 text-sky-600 px-6 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2">
                      <Plus size={16} /> Log Interaction
                    </button>
                  </div>
                  {client.history.length > 0 ? (
                    <div className="relative pl-10 space-y-12">
                      <div className="absolute left-[19px] top-6 bottom-4 w-[2px] bg-slate-50"></div>
                      {client.history.map(item => {
                        const Icon = getTypeIcon(item.type);
                        return (
                          <div key={item.id} className="relative">
                            <div className="absolute -left-10 top-0 w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border-2 border-white z-10 shadow-sm">
                              <Icon size={18} className="text-sky-500" />
                            </div>
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-[15px] font-black">{item.title}</h4>
                                <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                                <div className="flex items-center gap-4 mt-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                  <span>{item.direction}</span>
                                  <span>•</span>
                                  <span>By {item.agent}</span>
                                  <span>•</span>
                                  <span>{item.timestamp}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                      <MessageSquare size={48} className="mb-4" />
                      <p className="text-sm font-black uppercase tracking-widest">No interactions logged</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Activity' && (
                <div>
                  <div className="flex justify-between items-center mb-12">
                    <h3 className="text-2xl font-black">System Activity Log</h3>
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <ShieldCheck size={14} /> Encrypted Ledger
                    </div>
                  </div>
                  {client.activity && client.activity.length > 0 ? (
                    <div className="space-y-6">
                      {client.activity.map(log => {
                        const Icon = getActivityIcon(log.type);
                        const colors = getActivityColors(log.status, log.type);
                        return (
                          <div key={log.id} className={`flex gap-6 p-6 rounded-3xl border-2 transition-all hover:scale-[1.01] ${colors}`}>
                            <div className="shrink-0 w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                              {log.status === 'FAILURE' ? <AlertCircle size={22} className="text-red-500" /> : <Icon size={22} />}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h4 className="font-black text-[15px] leading-tight">{log.message}</h4>
                                <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 shrink-0 ml-4">{log.timestamp}</span>
                              </div>
                              {log.details && (
                                <p className="mt-2 text-sm font-medium opacity-80 bg-white/40 p-3 rounded-xl border border-current/10">
                                  {log.details}
                                </p>
                              )}
                              <div className="mt-3 flex gap-3">
                                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-white/50 border border-current/10">
                                  {log.type.replace('_', ' ')}
                                </span>
                                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-white/50 border border-current/10">
                                  {log.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                      <Activity size={48} className="mb-4" />
                      <p className="text-sm font-black uppercase tracking-widest">No activity recorded</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-10 bg-white/20 border-t border-sky-100 flex justify-end gap-4">
            {/* <button onClick={() => setIsEditModalOpen(true)} className="bg-[#0ea5e9] text-white font-black py-4 px-12 rounded-2xl shadow-xl shadow-sky-500/20 uppercase tracking-widest text-xs">Update Profile</button> */}
            <button onClick={onClose} className="bg-white border text-slate-400 font-black py-4 px-12 rounded-2xl uppercase tracking-widest text-xs">Exit</button>
          </div>
        </div>
      </div>
      <EditClientModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} client={client} onUpdate={onUpdate} plans={plans} />
      <LogInteractionModal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} onSave={handleLogInteraction} />
    </>
  );
};

export default ClientDetailsModal;
