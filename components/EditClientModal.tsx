
import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Trash2, ImageIcon, ChevronDown } from 'lucide-react';
import { Client, SubscriptionPlan } from '../types';

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  onUpdate: (client: Client) => void;
  plans: SubscriptionPlan[];
}

const EditClientModal: React.FC<EditClientModalProps> = ({ isOpen, onClose, client, onUpdate, plans }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Client>(client);

  useEffect(() => {
    if (client) {
      setFormData(client);
    }
  }, [client, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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

  const handleSave = () => {
    onUpdate(formData);
    onClose();
  };

  const toggleAutopay = () => {
    setFormData(prev => ({ ...prev, autopayEnabled: !prev.autopayEnabled }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4">
      <div className="bg-[#f0f9ff] w-full max-w-lg rounded-[2.5rem] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileChange} 
          accept="image/*" 
        />
        
        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-start shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Update Profile</h2>
            <p className="text-slate-500 text-sm mt-1">Modify account details for <span className="text-sky-600">{client.name}</span></p>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-white rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-8 pt-0 space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div 
              onClick={() => fileInputRef.current?.click()} 
              className="w-28 h-28 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden cursor-pointer group relative transition-transform hover:scale-105"
            >
              {formData.avatar ? (
                <img src={formData.avatar} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                <div className="w-full h-full bg-sky-50 flex items-center justify-center">
                  <ImageIcon className="text-sky-200" size={32} />
                </div>
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Upload size={20} />
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="text-[10px] font-black uppercase text-sky-500 tracking-widest hover:text-sky-600 transition-colors"
              >
                Change Photo
              </button>
              {formData.avatar && (
                <button 
                  onClick={() => setFormData(p => ({ ...p, avatar: undefined }))} 
                  className="text-[10px] font-black uppercase text-red-400 tracking-widest hover:text-red-500 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-sky-500 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="John Doe"
                className="w-full px-5 py-3.5 bg-white border border-sky-100 rounded-2xl font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all text-slate-800" 
              />
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-sky-500 uppercase tracking-widest ml-1">Email</label>
                <input 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="john@example.com"
                  className="w-full px-5 py-3.5 bg-white border border-sky-100 rounded-2xl font-bold text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all text-slate-800" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-sky-500 uppercase tracking-widest ml-1">Phone</label>
                <input 
                  name="phone" 
                  value={formData.phone || ''} 
                  onChange={handleChange} 
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-5 py-3.5 bg-white border border-sky-100 rounded-2xl font-bold text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all text-slate-800" 
                />
              </div>
            </div>

            {/* Subscription Selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-sky-500 uppercase tracking-widest ml-1">Subscription Plan</label>
              <div className="relative">
                <select 
                  name="subscription" 
                  value={formData.subscription} 
                  onChange={handleChange} 
                  className="w-full px-5 py-3.5 bg-white border border-sky-100 rounded-2xl font-bold text-sm shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all text-slate-800 pr-12"
                >
                  {plans.map(plan => (
                    <option key={plan.id} value={plan.name}>
                      {plan.name} - ${plan.price}/{plan.frequency.toLowerCase()}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-sky-500" />
              </div>
            </div>

            {/* Status & Payment Method Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-sky-500 uppercase tracking-widest ml-1">Account Status</label>
                <div className="relative">
                  <select 
                    name="status" 
                    value={formData.status} 
                    onChange={handleChange} 
                    className="w-full px-5 py-3.5 bg-white border border-sky-100 rounded-2xl font-bold text-sm shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all text-slate-800 pr-10"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Paused">Paused</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-sky-500" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-sky-500 uppercase tracking-widest ml-1">Payment Method</label>
                <div className="relative">
                  <select 
                    name="paymentMethod" 
                    value={formData.paymentMethod || 'Credit Card/Debit Card'} 
                    onChange={handleChange} 
                    className="w-full px-5 py-3.5 bg-white border border-sky-100 rounded-2xl font-bold text-sm shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all text-slate-800 pr-10"
                  >
                    <option value="Credit Card/Debit Card">Credit/Debit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-sky-500" />
                </div>
              </div>
            </div>

            {/* Autopay Toggle Section */}
            <div className="bg-[#e0f2fe] border border-sky-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <div>
                <h4 className="text-sm font-black text-slate-800">Enable Autopay</h4>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Automatically charge client for renewals</p>
              </div>
              <button 
                type="button"
                onClick={toggleAutopay}
                className={`relative w-11 h-6 rounded-full transition-all duration-300 ${formData.autopayEnabled ? 'bg-sky-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${formData.autopayEnabled ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 pt-4 bg-white/20 border-t border-sky-100/50 flex gap-4 shrink-0">
          <button 
            onClick={onClose} 
            className="flex-1 bg-white border border-slate-200 py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all active:scale-[0.98]"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="flex-1 bg-[#0ea5e9] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-sky-500/20 hover:bg-sky-600 transition-all active:scale-[0.98]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditClientModal;
