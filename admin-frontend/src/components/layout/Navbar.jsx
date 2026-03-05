import React from 'react';
import { useLocation } from 'react-router-dom';
import SearchInput from '../forms/SearchInput';

const pageTitles = {
  '/dashboard': 'Dashboard Overview',
  '/pumps': 'Pump Management',
  '/operators': 'Operator Management',
  '/complaints': 'Complaint Management',
  '/reports': 'Reports & Analytics',
  '/profile': 'Profile Settings',
};

const Navbar = () => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'JANSANKALP';

  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/80 border-b border-slate-200">
      <div className="px-6 lg:px-8 py-4 flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-[0.2em] text-primary">Live Dashboard</span>
          <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
        </div>
        <div className="flex-1" />
        <div className="hidden md:block w-72">
          <SearchInput placeholder="Search pumps, operators, complaints" />
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-semibold text-slate-800">A. Kumar</div>
            <div className="text-xs text-slate-500">Control Room Admin</div>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
            JK
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
