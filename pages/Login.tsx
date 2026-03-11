
import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { ShieldCheck, Info } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="w-16 h-16 bg-sky-500 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-xl shadow-sky-500/20 rotate-3 hover:rotate-0 transition-transform duration-300">
          <div className="w-8 h-8 border-[4px] border-white rounded-full"></div>
        </div>
        <h2 className="text-center text-[32px] font-black text-slate-800 tracking-tight leading-none">NexusBill Admin</h2>
        <p className="mt-2 text-center text-sm font-bold text-slate-400 uppercase tracking-widest">
          Secure Access Node
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-4 shadow-2xl border border-slate-100 sm:rounded-[2.5rem] sm:px-10 relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
          
          <LoginForm onLoginSuccess={onLoginSuccess} />
          

          {/* Demo Credentials */}
          {/* <div className="mt-10 pt-6 border-t border-slate-50">
            <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
              <div className="flex items-center gap-2 mb-3 text-sky-600">
                <Info size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Demo Credentials</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-tight">Email:</span>
                  <code className="bg-white px-2 py-1 rounded-lg border border-slate-100 font-black text-slate-700">admin@nexusbill.com</code>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-tight">Password:</span>
                  <code className="bg-white px-2 py-1 rounded-lg border border-slate-100 font-black text-slate-700">password123</code>
                </div>
              </div>
            </div>
            <p className="mt-4 text-[10px] text-center font-bold text-slate-300 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
              <ShieldCheck size={12} /> Encrypted Session
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
