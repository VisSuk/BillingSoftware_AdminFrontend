
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { SubscriptionPlan } from '../types';
import { createPlanAPI } from '@/services/allApi';

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  refreshPlans: () => void;
}

const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({ isOpen, onClose, refreshPlans }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    frequency: 'Monthly' as SubscriptionPlan['frequency'],
    features: ''
  });
  // console.log(formData)

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const { name, price, frequency, features } = formData
    if (!name || !price || !frequency || !features) {
      alert("Fill All Fields!")
      return
    }
    const reqBody = {
      name,
      price: Number(price),
      frequency: frequency.toLowerCase(),
      features: features.split(',').map(f => f.trim())
    }
    const addResponse = await createPlanAPI(reqBody)
    if (addResponse?.status === 200) {
      refreshPlans()
      setFormData({
        name: '',
        price: '',
        frequency: 'Monthly',
        features: ''
      })
      onClose();
    }

  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-[#f0f9ff] w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden transition-all border border-sky-100">
        <div className="p-8 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Create Plan</h2>
            <p className="text-slate-500 text-sm mt-0.5 font-medium">Define a new subscription offering.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1"><X size={24} /></button>
        </div>

        <div className="px-8 pb-10 space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-sky-500 uppercase tracking-widest ml-1">Plan Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Enterprise"
              className="w-full px-5 py-3.5 bg-white border border-sky-100 rounded-2xl text-sm font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-sky-500 uppercase tracking-widest ml-1">Price ($)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0"
                className="w-full px-5 py-3.5 bg-white border border-sky-100 rounded-2xl text-sm font-bold shadow-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-sky-500 uppercase tracking-widest ml-1">Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                className="w-full px-5 py-3.5 bg-white border border-sky-100 rounded-2xl text-sm font-bold shadow-sm appearance-none cursor-pointer"
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
                <option value="Quarterly">Quarterly</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-sky-500 uppercase tracking-widest ml-1">Features (comma separated)</label>
            <textarea
              rows={3}
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              placeholder="Cloud storage, API access, Support..."
              className="w-full px-5 py-3.5 bg-white border border-sky-100 rounded-2xl text-sm font-bold shadow-sm focus:outline-none resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-[#0ea5e9] hover:bg-sky-600 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-sky-500/20 text-xs uppercase tracking-widest mt-4"
          >
            Deploy Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSubscriptionModal;
