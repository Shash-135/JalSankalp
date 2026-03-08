import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiHome, HiExclamationCircle, HiRefresh, HiLightBulb, HiChatAlt2 } from 'react-icons/hi';

const navItems = [
  { to: '/',          label: 'Home',      Icon: HiHome },
  { to: '/complaint', label: 'Grievance', Icon: HiExclamationCircle },
  { to: '/track',     label: 'Track',     Icon: HiRefresh },
  { to: '/awareness', label: 'Tips',      Icon: HiLightBulb },
  { to: '/feedback',  label: 'Feedback',  Icon: HiChatAlt2 },
];

const Header = () => {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-20 bg-primary text-white shadow-lift">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="h-9 w-9 rounded-xl bg-white/15 flex items-center justify-center font-black text-base leading-none">
            JS
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">Gram Panchayat</div>
            <div className="text-base font-black leading-tight tracking-tight">JalSankalp</div>
          </div>
        </Link>

        {/* Desktop Nav (hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ to, label, Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-extrabold transition-all duration-150
                  ${active ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block text-[10px] font-extrabold uppercase tracking-widest bg-white/15 px-2.5 py-1 rounded-full shrink-0">
          Official Portal
        </div>
        <div className="md:hidden text-[10px] font-extrabold uppercase tracking-widest bg-white/15 px-2.5 py-1 rounded-full shrink-0">
          Official Portal
        </div>
      </div>
    </header>
  );
};

// Bottom nav shown ONLY on mobile (md:hidden)
export const BottomNav = () => {
  const { pathname } = useLocation();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-100 shadow-lift"
         style={{ paddingBottom: 'calc(8px + var(--safe-bottom))' }}>
      <div className="flex items-center justify-around px-2 pt-2">
        {navItems.map(({ to, label, Icon }) => {
          const active = pathname === to;
          return (
            <Link key={to} to={to} className={`nav-item ${active ? 'nav-item-active' : 'nav-item-default'}`}>
              <Icon className={`h-5 w-5 ${active ? 'text-primary' : 'text-slate-400'}`} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Header;
