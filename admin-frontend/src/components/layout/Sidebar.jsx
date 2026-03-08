import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HiOutlineChartBar, HiOutlineCog, HiOutlineHome, HiOutlineUserGroup, HiOutlineViewGrid, HiOutlineDocumentReport, HiOutlinePhoneIncoming, HiOutlineLogout, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: HiOutlineHome },
  { label: 'Pumps', to: '/pumps', icon: HiOutlineViewGrid },
  { label: 'Operators', to: '/operators', icon: HiOutlineUserGroup },
  { label: 'Complaints', to: '/complaints', icon: HiOutlinePhoneIncoming },
  { label: 'Logs & Activity', to: '/logs', icon: HiOutlineDocumentReport },
  { label: 'Reports', to: '/reports', icon: HiOutlineChartBar },
  { label: 'Profile', to: '/profile', icon: HiOutlineCog },
];

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`fixed lg:sticky top-0 inset-y-0 left-0 z-50 flex flex-col ${isCollapsed ? 'w-20' : 'w-72'} max-w-[80vw] h-screen bg-primary text-white shadow-xl transition-all duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className={`px-6 py-5 border-b border-white/10 relative flex items-center ${isCollapsed ? 'justify-center px-0' : ''}`}>
        {!isCollapsed && (
          <div>
            <div className="text-xs uppercase tracking-[0.4em] text-white/70">JALSANKALP</div>
            <div className="mt-2 text-2xl font-semibold truncate">Water Pump</div>
            <div className="text-sm text-white/70 truncate">Smart Monitoring</div>
          </div>
        )}
        {isCollapsed && (
          <div className="text-2xl font-bold text-white">JS</div>
        )}
        {/* Desktop Collapse Toggle */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`hidden lg:flex absolute top-6 -right-3 bg-white text-primary border border-slate-200 h-6 w-6 rounded-full items-center justify-center shadow hover:bg-slate-50 transition-colors z-50`}
        >
          {isCollapsed ? <HiChevronRight className="h-4 w-4" /> : <HiChevronLeft className="h-4 w-4" />}
        </button>
      </div>
      <nav className="flex-1 px-4 py-6 flex flex-col justify-between overflow-y-auto overflow-x-hidden">
        <div className="space-y-1">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => { if (window.innerWidth < 1024) onClose(); }}
              title={isCollapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-white text-primary shadow-lg' : 'text-white/80 hover:bg-white/10'
                } ${isCollapsed ? 'justify-center px-0' : ''}`
              }
            >
              <Icon className="h-6 w-6 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </div>
        
        <button
          onClick={handleLogout}
          title={isCollapsed ? "Logout" : undefined}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-white/80 hover:bg-white/10 hover:text-red-400 mt-auto ${isCollapsed ? 'justify-center px-0' : ''}`}
        >
          <HiOutlineLogout className="h-6 w-6 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </nav>
      <div className={`py-5 border-t border-white/10 text-sm text-white/70 transition-all ${isCollapsed ? 'px-2 text-center text-[10px]' : 'px-6'}`}>
        {!isCollapsed ? 'Gram Panchayat - Live Operations' : 'Live Ops'}
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
