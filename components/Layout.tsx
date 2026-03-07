
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { User, SubscriptionPlan } from '../types';

interface LayoutProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  plans: SubscriptionPlan[];
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, setUser, plans, onLogout }) => {
  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-200">
      <Sidebar user={user} setUser={setUser} plans={plans} onLogout={onLogout} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="p-8 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
