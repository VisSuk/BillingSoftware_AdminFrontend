import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, ImageIcon, ChevronDown } from 'lucide-react';
import { SubscriptionPlan } from '../types';
import { addClientSubscriptionAPI } from '@/services/allApi';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: SubscriptionPlan[];
  refreshClients: () => void;
  existingClient?: any | null;
}

const AddClientModal: React.FC<AddClientModalProps> = ({
  isOpen,
  onClose,
  plans,
  refreshClients,
  existingClient
}) => {

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subscription: '',
    status: 'pending',
    paymentMethod: 'Credit Card/Debit Card',
    autopayEnabled: true,
    avatar: undefined as string | undefined
  });

  useEffect(() => {
    if (existingClient) {
      setFormData(prev => ({
        ...prev,
        name: existingClient.fullname,
        email: existingClient.email,
        phone: existingClient.mobile
      }));
    }
  }, [existingClient]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        avatar: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.subscription) return;

    const selectedPlan = plans.find(
      p => p.name === formData.subscription
    );

    if (!selectedPlan) return;

    const reqBody = {
      fullname: formData.name,
      email: formData.email,
      mobile: formData.phone,
      subscriptionTierId: selectedPlan.id,
      paymentMethod:
        formData.paymentMethod === "Cash" ? "cash" : "online"
    };

    try {
      const res = await addClientSubscriptionAPI(reqBody);

      if (res.status === 200) {
        refreshClients();
        onClose();
      }
    } catch (err) {
      console.log("Failed to add client");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-[#f0f9ff] w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh]">

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />

        <div className="p-8 pb-0 flex justify-between items-start">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            {existingClient ? "Add Subscription" : "Add New Client"}
          </h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">

          <div className="space-y-1">
            <label className="text-xs font-black text-sky-500 uppercase">
              Full Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              className="w-full px-5 py-3.5 border rounded-2xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black text-sky-500 uppercase">
                Email
              </label>
              <input
                disabled={!!existingClient}
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                className="w-full px-5 py-3.5 border rounded-2xl"
              />
            </div>

            <div>
              <label className="text-xs font-black text-sky-500 uppercase">
                Mobile
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
                className="w-full px-5 py-3.5 border rounded-2xl"
              />
            </div>
          </div>

          <div>
            <select
              name="subscription"
              value={formData.subscription}
              onChange={handleChange}
              className="w-full px-5 py-3.5 border rounded-2xl"
            >
              <option value="">Select plan</option>
              {plans.map(plan => (
                <option key={plan.id} value={plan.name}>
                  {plan.name} - ${plan.price}/{plan.frequency}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-sky-500 text-white py-4 rounded-2xl"
          >
            {existingClient ? "Add Subscription" : "Add Client"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default AddClientModal;