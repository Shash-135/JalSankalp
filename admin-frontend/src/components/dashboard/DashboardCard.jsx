import React from 'react';

const DashboardCard = ({ title, value, trend, subtitle, icon }) => {
  const isPositive = trend >= 0;
  return (
    <div className="card-surface p-5 flex flex-col justify-center min-h-[140px] relative overflow-hidden group hover:border-primary/20 transition-colors">
      <div className="flex items-center gap-4 mb-2">
        <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl font-semibold shadow-inner">
          {icon || '•'}
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-medium text-slate-500 uppercase tracking-wider">{subtitle}</div>
          <div className="text-base sm:text-lg font-semibold text-slate-800 leading-tight">{title}</div>
        </div>
      </div>
      <div className="flex items-end justify-between mt-auto pt-2">
        <div className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">{value}</div>
        {trend !== undefined && (
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 shadow-sm ${
              isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}
          >
            {isPositive ? '▲' : '▼'} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
