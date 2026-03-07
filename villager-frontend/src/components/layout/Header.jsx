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
    <div className="sticky top-0 z-20">
      <div className="bg-primary text-white text-xs font-bold py-1 px-4 text-center tracking-widest uppercase">
        An Official Government Portal
      </div>
      <header className="bg-white border-b-4 border-secondary shadow-sm">
        <div className="w-full mx-auto px-4 py-3 flex flex-col items-center justify-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 border-2 border-primary bg-slate-50 text-primary grid place-items-center font-bold font-serif text-xl">
              JS
            </div>
            <div className="text-center">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Gram Panchayat</div>
              <div className="text-lg font-black text-primary leading-tight">JalSankalp Portal</div>
            </div>
          </Link>
          <nav className="flex items-center justify-center flex-wrap gap-2 text-xs font-bold text-slate-600 uppercase w-full">
            {links.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-1.5 rounded border transition-all ${
                    active 
                      ? 'border-secondary text-primary bg-slate-100 shadow-sm' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 bg-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Header;
