import React from 'react';
import { statusBadge } from '../../utils/formatters';

const DataTable = ({ title, description, columns, data }) => {
  return (
    <div className="card-surface p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-slate-500">{description}</div>
          <div className="text-lg font-semibold text-slate-800">{title}</div>
        </div>
        <button className="px-3 py-2 text-sm font-semibold rounded-xl bg-primary text-white hover:bg-primary/90 shadow">
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-100">
              {columns.map((col) => (
                <th key={col.key} className="py-2 pr-4 font-semibold">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/70">
                {columns.map((col) => (
                  <td key={col.key} className="py-2 pr-4 text-slate-800">
                    {col.key === 'status' ? statusBadge(row[col.key]) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
