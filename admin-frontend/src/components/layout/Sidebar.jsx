import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HiOutlineChartBar, HiOutlineCog, HiOutlineHome, HiOutlineUserGroup, HiOutlineViewGrid, HiOutlineDocumentReport, HiOutlinePhoneIncoming, HiOutlineLogout } from 'react-icons/hi';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: HiOutlineHome },
  { label: 'Pumps', to: '/pumps', icon: HiOutlineViewGrid },
  { label: 'Operators', to: '/operators', icon: HiOutlineUserGroup },
  { label: 'Complaints', to: '/complaints', icon: HiOutlinePhoneIncoming },
  { label: 'Logs & Activity', to: '/logs', icon: HiOutlineDocumentReport },
  { label: 'Reports', to: '/reports', icon: HiOutlineChartBar },
  { label: 'Profile', to: '/profile', icon: HiOutlineCog },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-72 min-h-screen bg-primary text-white shadow-xl sticky top-0">
      <div className="px-6 py-5 border-b border-white/10">
        <div className="text-xs uppercase tracking-[0.4em] text-white/70">JALSANKALP</div>
        <div className="mt-2 text-2xl font-semibold">Water Pump</div>
        <div className="text-sm text-white/70">Smart Monitoring System</div>
      </div>
      <nav className="flex-1 px-4 py-6 flex flex-col justify-between">
        <div className="space-y-1">
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
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-white/80 hover:bg-white/10 hover:text-red-400 mt-auto"
        >
          <HiOutlineLogout className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </nav>
      <div className="px-6 py-5 border-t border-white/10 text-sm text-white/70">
        Gram Panchayat - Live Operations
      </div>
    </aside>
  );
};

export default Sidebar;
