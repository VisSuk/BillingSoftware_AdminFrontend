
import React from 'react';
import { Bell, CreditCard, AlertTriangle, Cpu, CheckCircle2, X, Settings } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationPopupProps {
  notifications: AppNotification[];
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ 
  notifications, 
  onClose, 
  onMarkRead, 
  onMarkAllRead 
}) => {
  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'PAYMENT': return <CreditCard size={18} className="text-emerald-500" />;
      case 'ALERT': return <AlertTriangle size={18} className="text-amber-500" />;
      case 'SUCCESS': return <CheckCircle2 size={18} className="text-sky-500" />;
      default: return <Cpu size={18} className="text-slate-400" />;
    }
  };

  const getBg = (type: AppNotification['type']) => {
    switch (type) {
      case 'PAYMENT': return 'bg-emerald-50 dark:bg-emerald-900/20';
      case 'ALERT': return 'bg-amber-50 dark:bg-amber-900/20';
      case 'SUCCESS': return 'bg-sky-50 dark:bg-sky-900/20';
      default: return 'bg-slate-50 dark:bg-slate-800';
    }
  };

  return (
    <div className="absolute top-full right-0 mt-3 w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
        <div>
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none">Notifications</h3>
          <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mt-1.5">Your Recent Activity</p>
        </div>
        <button 
          onClick={onMarkAllRead}
          className="text-[10px] font-black uppercase text-sky-600 hover:text-sky-700 dark:text-sky-400 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Body */}
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length > 0 ? (
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {notifications.map((notif) => (
              <div 
                key={notif.id}
                onClick={() => onMarkRead(notif.id)}
                className={`p-5 flex gap-4 transition-colors cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-800/50 ${!notif.isRead ? 'bg-sky-50/30 dark:bg-sky-900/10' : ''}`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border border-white dark:border-slate-700 shadow-sm ${getBg(notif.type)}`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className={`text-sm tracking-tight leading-tight ${notif.isRead ? 'font-bold text-slate-600 dark:text-slate-400' : 'font-black text-slate-900 dark:text-slate-100'}`}>
                      {notif.title}
                    </h4>
                    {!notif.isRead && (
                      <div className="w-2 h-2 bg-sky-500 rounded-full mt-1 shrink-0 shadow-sm shadow-sky-500/50"></div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2.5">
                    {notif.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={24} className="text-slate-300" />
            </div>
            <p className="text-sm font-bold text-slate-400 italic">No new notifications</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
        <button className="w-full py-2.5 text-[11px] font-black uppercase text-slate-500 hover:text-sky-500 transition-colors tracking-[0.15em]">
          View All History
        </button>
      </div>
    </div>
  );
};

export default NotificationPopup;
