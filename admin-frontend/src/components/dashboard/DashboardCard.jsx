import React from 'react';

const DashboardCard = ({ title, value, trend, subtitle, icon }) => {
  const isPositive = trend >= 0;
  return (
    <div className="card-surface p-5 flex items-start gap-4">
      <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl font-semibold">
        {icon || '•'}
      </div>
      <div className="flex-1">
        <div className="text-sm text-slate-500">{subtitle}</div>
        <div className="text-lg font-semibold text-slate-800">{title}</div>
        <div className="mt-2 flex items-center gap-2">
          <div className="text-3xl font-bold text-slate-900">{value}</div>
          <span
            className={`pill ${
              isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {isPositive ? '▲' : '▼'} {Math.abs(trend)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
