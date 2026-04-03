import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiHome, HiExclamationCircle, HiRefresh, HiLightBulb, HiChatAlt2 } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };
  
  const navItems = [
    { to: '/',          label: t('app.home'),      Icon: HiHome },
    { to: '/complaint', label: t('app.grievance'), Icon: HiExclamationCircle },
    { to: '/track',     label: t('app.track'),     Icon: HiRefresh },
    { to: '/awareness', label: t('app.tips'),      Icon: HiLightBulb },
    { to: '/feedback',  label: t('app.feedback'),  Icon: HiChatAlt2 },
  ];

  return (
    <header className="sticky top-0 z-20 bg-primary text-white shadow-lift">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-6">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="h-9 w-9 rounded-xl bg-white/15 flex items-center justify-center font-black text-base leading-none">
            JS
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">{t('app.subtitle')}</div>
            <div className="text-base font-black leading-tight tracking-tight">{t('app.title')}</div>
          </div>
        </Link>

        {/* DESKTOP NAV */}
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

        <div className="flex items-center gap-3">
          <select 
            onChange={changeLanguage} 
            value={i18n.language}
            className="bg-white/15 text-white border-0 outline-none rounded px-2 py-1 text-xs font-bold leading-none cursor-pointer"
          >
            <option value="en" className="text-slate-800">English</option>
            <option value="hi" className="text-slate-800">हिंदी</option>
            <option value="mr" className="text-slate-800">मराठी</option>
          </select>
          <div className="hidden md:block text-[10px] font-extrabold uppercase tracking-widest bg-white/15 px-2.5 py-1 rounded-full shrink-0">
            {t('app.officialPortal')}
          </div>
        </div>
      </div>
    </header>
  );
};


export const BottomNav = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  
  const navItems = [
    { to: '/',          label: t('app.home'),      Icon: HiHome },
    { to: '/complaint', label: t('app.grievance'), Icon: HiExclamationCircle },
    { to: '/track',     label: t('app.track'),     Icon: HiRefresh },
    { to: '/awareness', label: t('app.tips'),      Icon: HiLightBulb },
    { to: '/feedback',  label: t('app.feedback'),  Icon: HiChatAlt2 },
  ];

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
