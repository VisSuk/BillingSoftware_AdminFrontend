
import React, { useState, useEffect } from 'react';
import { X, Trash2, AlertCircle, RotateCcw } from 'lucide-react';
import { SubscriptionPlan } from '../types';
import { deletePlanAPI, updatePlanAPI } from '@/services/allApi';

interface ManageSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onDelete: (id: string) => void;
  // onUpdate: (plan: SubscriptionPlan) => void;
  plan: SubscriptionPlan | null;
  refreshPlans: () => void;
}

const ManageSubscriptionModal: React.FC<ManageSubscriptionModalProps> = ({ isOpen, onClose, plan, refreshPlans }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    frequency: 'monthly' as SubscriptionPlan['frequency'],
    features: ''
  });
  console.log(formData)

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        price: plan.price,
        frequency: plan.frequency.toLowerCase(),
        features: plan.features.join(', ')
      });
      setIsConfirmingDelete(false);
    }
  }, [plan, isOpen]);

  if (!isOpen || !plan) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
  };

  // const handleSave = () => {
  //   onUpdate({
  //     ...plan,
  //     name: formData.name,
  //     price: formData.price,
  //     frequency: formData.frequency,
  //     features: formData.features.split(',').map(f => f.trim()).filter(f => f !== '')
  //   });
  //   onClose();
  // };

  const handleDeletePlan = async() => {
    if (isConfirmingDelete) {
    const deleteResponse = await deletePlanAPI(plan.id)
    if(deleteResponse.status == 200){
      refreshPlans()
      onClose()
    }
    } else {
      setIsConfirmingDelete(true);
    }
  };
  
  const handleUpdatePlan = async () => {
    const { name, price, frequency, features } = formData
    const reqBody = {
      name,
      price: Number(price),
      frequency: frequency.toLowerCase(),
      features: features.split(',').map(f => f.trim())
    }
    const updateResponse = await updatePlanAPI(reqBody, plan.id)
    if (updateResponse.status === 200) {
      refreshPlans()
      onClose()
    }
  }

  // const handleDeletePlan = async () => {
  //   const deleteResponse = await deletePlanAPI(plan.id)
  //   if(deleteResponse.status == 200){
  //     refreshPlans()
  //     onClose()
  //   }
  // }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-[#eef8ff] w-full max-w-md rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] text-slate-800 border border-sky-100">
        <div className="p-8 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Manage {plan.name}</h2>
              <p className="text-slate-500 text-sm mt-0.5 font-medium">Edit details for this service tier.</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-white rounded-full"><X size={20} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 pt-0 space-y-5">
          {isConfirmingDelete ? (
            <div className="bg-red-50 border-2 border-red-100 rounded-3xl p-6 text-center space-y-4 animate-in fade-in zoom-in duration-200">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="font-black text-red-900">Are you absolutely sure?</h3>
                <p className="text-sm text-red-700 font-medium mt-1">
                  Deleting this plan will remove it from all new client selection dropdowns. This cannot be undone.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-sky-500 uppercase tracking-widest ml-1">Plan Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  className="w-full px-5 py-3.5 bg-white border border-sky-100 rounded-2xl text-sm font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-sky-500 uppercase tracking-widest ml-1">Price ($)</label>
                  <input
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    type="number"
                    className="w-full px-5 py-3.5 bg-white border border-sky-100 rounded-2xl text-sm font-bold shadow-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-sky-500 uppercase tracking-widest ml-1">Frequency</label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-white border border-sky-100 rounded-2xl text-sm font-bold shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-sky-500 uppercase tracking-widest ml-1">Features</label>
                <textarea
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-5 py-4 bg-white border border-sky-100 rounded-2xl text-sm font-bold shadow-sm focus:outline-none resize-none"
                  placeholder="Feature 1, Feature 2, Feature 3..."
                />
              </div>
            </>
          )}
        </div>

        <div className="p-8 pt-4 flex gap-3">
          {isConfirmingDelete ? (
            <button
              onClick={() => setIsConfirmingDelete(false)}
              className="flex-1 bg-white border-2 border-slate-100 text-slate-400 font-black py-4 rounded-2xl transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50"
            >
              <RotateCcw size={16} />
              Cancel
            </button>
          ) : (
            <button
              onClick={handleUpdatePlan}
              className="flex-1 bg-[#0ea5e9] hover:bg-sky-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-sky-500/20 text-xs uppercase tracking-widest active:scale-95"
            >
              Save Changes
            </button>
          )}

          <button
            onClick={handleDeletePlan}
            className={`flex-1 font-black py-4 rounded-2xl transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2 border-2 active:scale-95 ${isConfirmingDelete
                ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20'
                : 'bg-white border-red-100 text-red-400 hover:bg-red-50'
              }`}
          >
            <Trash2 size={16} />
            {isConfirmingDelete ? 'Confirm Delete' : 'Delete Plan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageSubscriptionModal;
