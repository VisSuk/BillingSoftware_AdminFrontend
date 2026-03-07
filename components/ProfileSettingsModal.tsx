
import React, { useEffect, useState, useRef } from 'react';
import {
  X, Upload, User as UserIcon, Mail, Shield,
  Bell, Check, Loader2, ImageIcon,
  CreditCard, Sparkles, ArrowRight, Lock, Calendar
} from 'lucide-react';
import { User, SubscriptionPlan } from '../types';
import UpgradeModal from './UpgradeModal';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdate: (user: User) => void;
  plans: SubscriptionPlan[];
}

const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({ isOpen, onClose, user, onUpdate, plans }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<any>(user);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  console.log(formData)

  // Simulated settings states
  const [toggles, setToggles] = useState({
    twoFactor: true,
    notifications: true,
    darkModeAuto: false
  });



  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    onUpdate(formData);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  const toggleSwitch = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Derived plan price
  const currentPlan = plans.find(p => p.name === user.currentTier);
  const currentPrice = currentPlan ? currentPlan.price : 0;

  useEffect(() => {
    setFormData(user)
  }, [user])

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
        <div className="bg-[#f0f9ff] w-full max-w-4xl rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh] border border-sky-100 animate-in zoom-in-95 fade-in duration-300">

          {/* Header */}
          <div className="p-10 pb-6 shrink-0 relative">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-[36px] font-black text-slate-800 tracking-tight leading-none">Settings Center</h2>
                <p className="text-slate-500 text-sm font-bold mt-2 uppercase tracking-widest opacity-70">Nexus Platform Node #{user.id}</p>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-white rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto px-10 pb-10">
            <form onSubmit={handleSave} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Profile Avatar & Identity */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-sky-50 flex flex-col items-center">
                    <div className="relative group">
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-32 h-32 rounded-full border-[6px] border-[#f0f9ff] bg-slate-100 overflow-hidden cursor-pointer shadow-lg transition-transform hover:scale-105"
                      >
                        {formData.avatar ? (
                          <img src={formData.avatar} className="w-full h-full object-cover" alt="Profile" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300 font-black text-3xl">
                            {formData.name.charAt(0)}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Upload size={24} />
                        </div>
                      </div>
                      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
                    </div>

                    <h3 className="text-xl font-black text-slate-800 mt-6">{formData.name}</h3>
                    <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest mt-1">Platform Admin</p>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-6 w-full py-3 bg-sky-50 hover:bg-sky-100 text-sky-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                    >
                      <ImageIcon size={14} /> Update Avatar
                    </button>
                  </div>

                  {/* Locked Personal Data */}
                  <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-sky-50 space-y-5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <UserIcon size={14} className="text-sky-500" /> Identity
                      </p>
                      <Lock size={12} className="text-slate-300" />
                    </div>

                    <div className="space-y-4 opacity-70 cursor-not-allowed">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-500">
                          {formData.name}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                        <div className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-500">
                          {formData.email}
                        </div>
                      </div>
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 italic text-center mt-2">Personal data is locked by system protocol.</p>
                  </div>
                </div>

                {/* Right Column: Billing & Plan */}
                <div className="lg:col-span-2 space-y-8">

                  {/* Billing Management Card */}
                  <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-sky-50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

                    <div className="flex justify-between items-start mb-10 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-sky-500 text-white rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-sky-500/20">
                          <Sparkles size={28} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest">Subscription Tier</p>
                          <h4 className="text-2xl font-black text-slate-800">{user.currentTier}</h4>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Billing</p>
                        <p className="text-sm font-bold text-slate-800 flex items-center justify-end gap-2">
                          <Calendar size={14} className="text-sky-500" /> {user.nextBillingDate || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-10">
                      <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Payment Method</p>
                        <div className="flex items-center gap-3">
                          <CreditCard size={18} className="text-sky-500" />
                          <span className="text-sm font-black text-slate-800">
                            {user.paymentMethod?.brand || 'VISA'} •••• {user.paymentMethod?.last4 || '9921'}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Cost</p>
                        <span className="text-lg font-black text-slate-800">${currentPrice}.00 <span className="text-slate-400 text-xs font-bold">/ mo</span></span>
                      </div>
                    </div>

                    <div className="bg-sky-50/50 border border-sky-100 rounded-[2rem] p-8 flex items-center justify-between group-hover:bg-sky-50 transition-colors">
                      <div className="max-w-[60%]">
                        <h5 className="text-sm font-black text-slate-800 mb-1">Need More Power?</h5>
                        <p className="text-xs font-medium text-slate-500">Browse higher tiers to unlock advanced intelligence and unlimited nodes.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsUpgradeModalOpen(true)}
                        className="px-8 py-4 bg-slate-800 text-white hover:bg-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-3 shadow-lg shadow-slate-900/10"
                      >
                        Upgrade Tier <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* System Security Section */}
                  <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-sky-50 space-y-8">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                      <Shield size={14} className="text-sky-500" /> Platform Flow
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                            <Shield size={20} />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-800">2FA Security</h4>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Layered Access</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleSwitch('twoFactor')}
                          className={`w-12 h-6 rounded-full transition-all relative ${toggles.twoFactor ? 'bg-sky-500' : 'bg-slate-200'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${toggles.twoFactor ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center">
                            <Bell size={20} />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-800">Notifications</h4>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Live Updates</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleSwitch('notifications')}
                          className={`w-12 h-6 rounded-full transition-all relative ${toggles.notifications ? 'bg-sky-500' : 'bg-slate-200'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${toggles.notifications ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isSaving}
                className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${saveSuccess
                    ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                    : 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/20'
                  }`}
              >
                {isSaving ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : saveSuccess ? (
                  <Check size={20} />
                ) : <Sparkles size={20} />}
                {isSaving ? 'Synchronizing Nexus Node...' : saveSuccess ? 'Profile Updated' : 'Apply Changes & Close'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Subscription Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        user={user}
        onUpdate={onUpdate}
        plans={plans}
      />
    </>
  );
};

export default ProfileSettingsModal;
