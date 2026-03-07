
import React, { useState } from 'react';
import { Box, Plus, Check } from 'lucide-react';
import AddSubscriptionModal from '../components/AddSubscriptionModal';
import ManageSubscriptionModal from '../components/ManageSubscriptionModal';
import { SubscriptionPlan } from '../types';

// interface SubscriptionsProps {
//   plans: SubscriptionPlan[];
//   setPlans: React.Dispatch<React.SetStateAction<SubscriptionPlan[]>>;
// }

interface Props {
  plans: SubscriptionPlan[],
  refreshPlans: () => void
}

const Subscriptions: React.FC<Props> = ({ plans, refreshPlans }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  
  const selectedPlan = plans.find(p => p.id === selectedPlanId) || null;

  const handleManagePlan = (plan: SubscriptionPlan) => {
    setSelectedPlanId(plan.id);
    setIsManageModalOpen(true);
  };

  // const handleDeletePlan = (id: string) => {
  //   setPlans(prevPlans => prevPlans.filter(p => p.id !== id));
  // };

  // const handleAddPlan = (newPlan: SubscriptionPlan) => {
  //   setPlans(prev => [...prev, newPlan]);
  // };

  // const handleUpdatePlan = (updatedPlan: SubscriptionPlan) => {
  //   setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
  // };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Subscription Plans</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your product offerings and pricing tiers.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#0ea5e9] hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-lg"
        >
          <Plus size={18} />
          Create New Plan
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-20 flex flex-col items-center justify-center text-center">
          <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-300">
            <Box size={48} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">No subscription plans found</h3>
          <p className="text-sm text-slate-400 max-w-xs">Create a plan to start offering services.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 flex flex-col transition-all hover:shadow-md"
            >
              <div className="space-y-2 mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">${plan.price}</span>
                  <span className="text-slate-400 text-sm font-medium">/{plan.frequency.toLowerCase()}</span>
                </div>
              </div>

              <div className="flex-1 mb-8">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                      <Check size={16} className="text-sky-500 mt-0.5 shrink-0" strokeWidth={3} />
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <button 
                onClick={() => handleManagePlan(plan)}
                className="w-full py-3 px-4 rounded-xl text-sky-700 font-bold text-sm bg-[#eef8ff] hover:bg-sky-100 transition-all border border-sky-100/50"
              >
                Manage Plan
              </button>
            </div>
          ))}
        </div>
      )}

      <AddSubscriptionModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        // onAdd={handleAddPlan}
        refreshPlans={refreshPlans}
      />

      {selectedPlan && (
        <ManageSubscriptionModal
          isOpen={isManageModalOpen}
          onClose={() => setIsManageModalOpen(false)}
          // onDelete={handleDeletePlan}
          // onUpdate={handleUpdatePlan}
          plan={selectedPlan}
          refreshPlans={refreshPlans}
        />
      )}
    </div>
  );
};

export default Subscriptions;
