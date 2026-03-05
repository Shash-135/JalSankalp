import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/complaint', label: 'Submit' },
  { to: '/track', label: 'Track' },
  { to: '/awareness', label: 'Awareness' },
];

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-20 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-primary text-white grid place-items-center font-bold">J</div>
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-primary">JANSANKALP</div>
            <div className="text-base font-semibold text-slate-800">Water Pump Helpdesk</div>
          </div>
        </Link>
        <nav className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          {links.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3 py-2 rounded-xl ${active ? 'bg-primary text-white' : 'hover:bg-slate-100'}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;
