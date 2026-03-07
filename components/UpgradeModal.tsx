
import React, { useState } from 'react';
import { 
  X, Check, Loader2, CreditCard, Sparkles, 
  ArrowRight, ArrowLeft, CheckCircle2, Info, 
  Box, AlertCircle, Shield, Landmark
} from 'lucide-react';
import { User, SubscriptionPlan } from '../types';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdate: (user: User) => void;
  plans: SubscriptionPlan[];
}

type Step = 'plans' | 'checkout' | 'confirm';

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, user, onUpdate, plans }) => {
  const [step, setStep] = useState<Step>('plans');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  if (!isOpen) return null;

  // Logic: Only show plans with a higher price than current user plan
  const currentPlan = plans.find(p => p.name === user.currentTier);
  const currentPrice = currentPlan ? currentPlan.price : 0;
  const upgradePlans = plans.filter(p => p.price > currentPrice);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setStep('checkout');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.cardNumber && formData.cardName) {
      setStep('confirm');
    }
  };

  const finalizeUpgrade = async () => {
    if (!selectedPlan) return;
    setIsProcessing(true);
    
    // Simulate payment gateway delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const updatedUser: User = {
      ...user,
      currentTier: selectedPlan.name as any,
      paymentMethod: {
        brand: 'Visa',
        last4: formData.cardNumber.slice(-4) || '9921'
      },
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };

    onUpdate(updatedUser);
    setIsProcessing(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      onClose();
      // Reset state for next time
      setStep('plans');
      setIsSuccess(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/70 backdrop-blur-xl p-4">
      <div className="bg-[#f0f9ff] w-full max-w-5xl rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh] border border-sky-100 animate-in zoom-in-95 fade-in duration-300">
        
        {/* Header */}
        <div className="p-10 pb-6 flex justify-between items-start shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-sky-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
                <Sparkles size={20} />
              </div>
              <h2 className="text-[32px] font-black text-slate-800 tracking-tight leading-none">Upgrade Subscription</h2>
            </div>
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest opacity-70">
              {step === 'plans' ? 'Step 1: Choose Intelligence Tier' : step === 'checkout' ? 'Step 2: Payment Configuration' : 'Step 3: Final Verification'}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-white rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-10 pb-10">
          
          {step === 'plans' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {upgradePlans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upgradePlans.map((plan) => (
                    <div 
                      key={plan.id}
                      onClick={() => handleSelectPlan(plan)}
                      className="bg-white rounded-[2.5rem] p-8 border-2 border-slate-100 transition-all cursor-pointer group flex flex-col hover:border-sky-300 hover:shadow-2xl hover:-translate-y-2"
                    >
                      <div className="mb-6">
                        <div className="inline-block px-4 py-1.5 bg-sky-50 text-sky-600 rounded-xl text-[10px] font-black uppercase tracking-widest mb-3">
                          Expansion Tier
                        </div>
                        <h4 className="text-xl font-black text-slate-800 group-hover:text-sky-600 transition-colors">{plan.name}</h4>
                      </div>
                      
                      <div className="mb-8">
                        <span className="text-5xl font-black text-slate-900">${plan.price}</span>
                        <span className="text-slate-400 text-sm font-bold tracking-tight"> /{plan.frequency.toLowerCase()}</span>
                      </div>

                      <ul className="space-y-3 mb-10 flex-1">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-3 text-xs font-bold text-slate-500">
                            <Check size={14} className="text-sky-500 mt-0.5 shrink-0" strokeWidth={3} /> {f}
                          </li>
                        ))}
                      </ul>

                      <button className="w-full py-5 bg-slate-800 group-hover:bg-sky-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 group-hover:shadow-sky-500/20">
                        Choose This Plan
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-[3rem] p-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-100">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                    <Box size={40} />
                  </div>
                  <h4 className="text-xl font-black text-slate-800 mb-2">Maximum Deployment Reached</h4>
                  <p className="text-sm text-slate-400 max-w-sm">
                    You are already on our highest available tier. Contact enterprise support for custom node infrastructure.
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 'checkout' && selectedPlan && (
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-sky-50">
                  <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest mb-4">Plan Summary</p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-500">{selectedPlan.name}</span>
                      <span className="text-sm font-black text-slate-800">${selectedPlan.price}.00</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-500">
                      <span className="text-[10px] font-black uppercase tracking-widest">Pro-rated Discount</span>
                      <span className="text-sm font-black">-$0.00</span>
                    </div>
                    <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                      <span className="text-sm font-black text-slate-800 uppercase tracking-widest">Initial Total</span>
                      <span className="text-2xl font-black text-slate-900">${selectedPlan.price}.00</span>
                    </div>
                  </div>
                </div>
                <div className="bg-sky-50 rounded-2xl p-4 flex gap-3 items-start">
                   <Info size={16} className="text-sky-500 shrink-0 mt-0.5" />
                   <p className="text-[10px] text-sky-700 font-bold leading-relaxed uppercase tracking-tight">
                     Billing cycles refresh automatically. Your next charge will occur on the {user.nextBillingDate || 'next cycle'}.
                   </p>
                </div>
              </div>

              <div className="md:col-span-3">
                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-sky-50 space-y-8">
                  <div className="flex gap-4 p-1.5 bg-slate-50 rounded-2xl">
                    <button 
                      onClick={() => setPaymentMethod('card')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'card' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      <CreditCard size={14} /> Credit Card
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('bank')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'bank' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      <Landmark size={14} /> Bank Transfer
                    </button>
                  </div>

                  <form onSubmit={handlePaymentSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cardholder Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.cardName}
                        onChange={(e) => setFormData({...formData, cardName: e.target.value})}
                        placeholder="EX: ALEX NEXUS"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Number</label>
                      <div className="relative">
                        <input 
                          required
                          type="text" 
                          value={formData.cardNumber}
                          onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                          placeholder="4444 •••• •••• 1234"
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none"
                        />
                        <CreditCard size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiry</label>
                        <input required type="text" placeholder="MM/YY" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CVV</label>
                        <input required type="text" placeholder="•••" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none" />
                      </div>
                    </div>
                    <div className="pt-4 flex gap-4">
                      <button 
                        type="button"
                        onClick={() => setStep('plans')}
                        className="flex-1 py-5 bg-white border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all"
                      >
                        Change Plan
                      </button>
                      <button 
                        type="submit"
                        className="flex-[2] py-5 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-sky-500/20"
                      >
                        Review Order
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {step === 'confirm' && selectedPlan && (
            <div className="max-w-2xl mx-auto space-y-8 text-center animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="w-24 h-24 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-xl shadow-amber-500/10">
                <AlertCircle size={44} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">Confirm Your Upgrade</h3>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2 opacity-60">Verification of Node Deployment</p>
              </div>

              <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-sky-50 space-y-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-sky-500" />
                
                <div className="flex flex-col items-center gap-2">
                   <p className="text-[10px] font-black text-sky-500 uppercase tracking-[0.2em]">Deployment Tier</p>
                   <h4 className="text-4xl font-black text-slate-800 tracking-tight">{selectedPlan.name}</h4>
                   <div className="mt-4 px-8 py-2.5 bg-slate-50 rounded-full text-xs font-black text-slate-700 uppercase tracking-widest border border-slate-100">
                     ${selectedPlan.price}.00 / {selectedPlan.frequency}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-10 py-10 border-y border-slate-50">
                  <div className="text-left space-y-1.5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Source</p>
                    <div className="flex items-center gap-3 text-sm font-black text-slate-700">
                       <div className="p-2 bg-sky-50 rounded-lg text-sky-500">
                         <CreditCard size={16} />
                       </div>
                       VISA •••• {formData.cardNumber.slice(-4) || '9921'}
                    </div>
                  </div>
                  <div className="text-right space-y-1.5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Activation Mode</p>
                    <p className="text-sm font-black text-slate-700 flex items-center justify-end gap-2">
                      <Sparkles size={16} className="text-sky-500" /> Immediate Activation
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 font-bold leading-relaxed max-w-sm mx-auto uppercase tracking-tight">
                  By confirming, you authorize NexusBill to process ${selectedPlan.price}.00 and update your subscription node instantly.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={finalizeUpgrade}
                  disabled={isProcessing || isSuccess}
                  className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-2xl ${
                    isSuccess 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/20'
                  }`}
                >
                  {isProcessing ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : isSuccess ? (
                    <CheckCircle2 size={24} />
                  ) : (
                    <Shield size={24} />
                  )}
                  {isProcessing ? 'Processing Transaction...' : isSuccess ? 'Node Synchronized' : `Confirm & Deploy Upgrade`}
                </button>
                
                <button 
                  onClick={() => setStep('checkout')}
                  disabled={isProcessing}
                  className="text-[10px] font-black text-slate-400 hover:text-sky-600 uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={14} /> Back to Payment Config
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
