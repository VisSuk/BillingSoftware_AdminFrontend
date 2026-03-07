
import React, { useState, useEffect, useRef } from 'react';
import { Search, Moon, Sun, Bell } from 'lucide-react';
import NotificationPopup from './NotificationPopup';
import { AppNotification } from '../types';

const Header: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: '1',
      title: 'Payment Received',
      message: 'Client Acme Inc. successfully paid invoice #INV-001 for $1,500.00 via Credit Card.',
      timestamp: 'Just Now',
      type: 'PAYMENT',
      isRead: false
    },
    {
      id: '2',
      title: 'Subscription Overdue',
      message: 'Stark Ind. is 5 days overdue for their Business Pro monthly renewal.',
      timestamp: '2 hours ago',
      type: 'ALERT',
      isRead: false
    },
    {
      id: '3',
      title: 'New Client Onboarded',
      message: 'NexusBill successfully initialized a new project ledger for Globex Corp.',
      timestamp: 'Yesterday at 4:30 PM',
      type: 'SUCCESS',
      isRead: true
    }
  ]);

  const notificationRef = useRef<HTMLDivElement>(null);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications([]);
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Handle outside click to close notifications
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="h-16 bg-transparent flex items-center justify-end px-8 gap-6 relative">
      <div className="relative w-64">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400 dark:text-slate-500" />
        </div>
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-full pl-10 pr-12 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 dark:text-slate-100 dark:placeholder-slate-500 transition-colors"
        />
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800 px-1 rounded">⌘ K</span>
        </div>
      </div>
      
      <button 
        onClick={toggleDarkMode}
        className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        aria-label="Toggle Dark Mode"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="relative" ref={notificationRef}>
        <button 
          onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          className={`relative text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${isNotificationsOpen ? 'bg-slate-100 dark:bg-slate-800 text-sky-500 dark:text-sky-400 scale-110' : ''}`}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-[#f8fafc] dark:border-slate-950 rounded-full animate-pulse"></span>
          )}
        </button>

        {isNotificationsOpen && (
          <NotificationPopup 
            notifications={notifications}
            onClose={() => setIsNotificationsOpen(false)}
            onMarkRead={handleMarkRead}
            onMarkAllRead={handleMarkAllRead}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
