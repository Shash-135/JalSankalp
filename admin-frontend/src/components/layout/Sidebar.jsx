import React from 'react';
import { NavLink } from 'react-router-dom';
import { HiOutlineChartBar, HiOutlineCog, HiOutlineHome, HiOutlineUserGroup, HiOutlineViewGrid, HiOutlineDocumentReport, HiOutlinePhoneIncoming } from 'react-icons/hi';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: HiOutlineHome },
  { label: 'Pumps', to: '/pumps', icon: HiOutlineViewGrid },
  { label: 'Operators', to: '/operators', icon: HiOutlineUserGroup },
  { label: 'Complaints', to: '/complaints', icon: HiOutlinePhoneIncoming },
  { label: 'Reports', to: '/reports', icon: HiOutlineChartBar },
  { label: 'Profile', to: '/profile', icon: HiOutlineCog },
];

const Sidebar = () => {
  return (
    <aside className="hidden lg:flex flex-col w-72 min-h-screen bg-primary text-white shadow-xl sticky top-0">
      <div className="px-6 py-5 border-b border-white/10">
        <div className="text-xs uppercase tracking-[0.4em] text-white/70">JANSANKALP</div>
        <div className="mt-2 text-2xl font-semibold">Water Pump</div>
        <div className="text-sm text-white/70">Smart Monitoring System</div>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive ? 'bg-white text-primary shadow-lg' : 'text-white/80 hover:bg-white/10'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-6 py-5 border-t border-white/10 text-sm text-white/70">
        Gram Panchayat - Live Operations
      </div>
    </aside>
  );
};

export default Sidebar;
