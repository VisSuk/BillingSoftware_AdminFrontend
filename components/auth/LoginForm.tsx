
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { loginAPI } from '@/services/allApi';

interface LoginFormProps {
  onLoginSuccess: (user: any, token: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setError(null);
    setIsLoading(true);
    const reqBody = {
      email,
      password 
    }
    const loginResponse = await loginAPI(reqBody)
    console.log(loginResponse)
    // Basic demo validation
    if (loginResponse.status == 200) {
      onLoginSuccess(loginResponse.data.user, loginResponse.data.token);
      setIsLoading(false);
      navigate('/');
    } else {
      setError('Invalid credentials. Please use the demo info below.');
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-500 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={18} className="shrink-0" />
          <p className="text-xs font-bold leading-tight">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5">
          Access Email
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-sky-500 transition-colors">
            <Mail size={18} />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@nexusbill.com"
            className="appearance-none block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] shadow-sm placeholder-slate-300 text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-sky-500/5 focus:border-sky-500/50 transition-all text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5">
          Access Key
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-sky-500 transition-colors">
            <Lock size={18} />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="appearance-none block w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] shadow-sm placeholder-slate-300 text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-sky-500/5 focus:border-sky-500/50 transition-all text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-4 flex items-center text-slate-300 hover:text-sky-500 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-[1.25rem] shadow-xl shadow-sky-500/20 text-[11px] font-black uppercase tracking-[0.2em] text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin mr-2" />
              Initializing...
            </>
          ) : (
            'Authorize Entry'
          )}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
