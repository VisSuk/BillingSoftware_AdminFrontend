
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Users,
  Box,
  FileText,
  Send,
  Cpu,
  LogOut,
  Settings,
  ChevronUp,
  Loader2,
  SendToBack,
  MousePointerClick,
  HandCoins
} from 'lucide-react';
import { User, SubscriptionPlan } from '../types';
import ProfileSettingsModal from './ProfileSettingsModal';

interface SidebarProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  plans: SubscriptionPlan[];
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, setUser, plans, onLogout }) => {
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: BarChart3 },
    { name: 'Users', path: '/clients', icon: Users },
    { name: 'Subscriptions', path: '/subscriptions', icon: Box },
    { name: 'Invoices', path: '/invoices', icon: FileText },
  ];

  const aiTools = [
    { name: 'Cash Pay By Hand', path: '/cash-pay', icon: HandCoins },
    // { name: 'Autopay Processor', path: '/autopay', icon: Cpu },
    { name: 'Online Payment', path: '/online-pay', icon: MousePointerClick }
  ];

  const handleLogoutAction = async () => {
    setIsLoggingOut(true);
    // Simulate disconnecting from the platform node
    await new Promise(resolve => setTimeout(resolve, 800));

    onLogout()
  };

  const handleOpenSettings = () => {
    setIsUserMenuOpen(false);
    setIsProfileModalOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0 transition-colors duration-200 relative">
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/20">
            <div className="w-4 h-4 border-2 border-white rounded-full"></div>
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">NexusBill</h1>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive
                  ? 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`
              }
            >
              <item.icon size={18} />
              <span className="text-sm">{item.name}</span>
            </NavLink>
          ))}

          <div className="pt-6 pb-2 px-3">
            <p className="text-[10px] font-black text-sky-500 uppercase tracking-[0.2em]">PAYMENT OPTIONS</p>
          </div>

          {aiTools.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive
                  ? 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`
              }
            >
              <item.icon size={18} />
              <span className="text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 mt-auto relative" ref={userMenuRef}>
          {isUserMenuOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="px-3 py-3 mb-2 border-b border-slate-50 dark:border-slate-800">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Account</p>
              </div>
              <button
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors group text-left"
                onClick={handleOpenSettings}
              >
                <div className="p-1.5 bg-sky-50 dark:bg-sky-900/20 text-sky-500 rounded-lg group-hover:scale-110 transition-transform">
                  <Settings size={16} />
                </div>
                Profile & Settings
              </button>
              <button
                onClick={handleLogoutAction}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors group text-left mt-1 disabled:opacity-50"
              >
                <div className="p-1.5 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg group-hover:scale-110 transition-transform">
                  {isLoggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
                </div>
                {isLoggingOut ? 'Disconnecting...' : 'Logout Session'}
              </button>
            </div>
          )}

          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={`w-full flex items-center gap-3 p-2 rounded-2xl transition-all duration-300 group ${isUserMenuOpen ? 'bg-slate-50 dark:bg-slate-800 ring-2 ring-sky-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
          >
            <div className="w-10 h-10 bg-slate-800 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} className="w-full h-full object-cover" alt="User" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <div className="flex flex-col text-left flex-1 min-w-0">
              <span className="text-sm font-black text-slate-800 dark:text-slate-200 truncate leading-tight">{user.name}</span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">Nexus Management</span>
            </div>
            <ChevronUp
              size={16}
              className={`text-slate-300 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180 text-sky-500' : ''}`}
            />
          </button>
        </div>
      </aside>

      <ProfileSettingsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onUpdate={setUser}
        plans={plans}
      />
    </>
  );
};

export default Sidebar;
