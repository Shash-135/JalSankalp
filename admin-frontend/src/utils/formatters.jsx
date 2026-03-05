import React from 'react';

export const statusBadge = (status) => {
  const map = {
    Active: 'bg-green-50 text-green-700',
    Inactive: 'bg-red-50 text-red-700',
    Pending: 'bg-amber-50 text-amber-700',
    Resolved: 'bg-blue-50 text-blue-700',
    Escalated: 'bg-purple-50 text-purple-700',
  };
  const cls = map[status] || 'bg-slate-100 text-slate-700';
  return <span className={`pill ${cls}`}>{status}</span>;
};
