import React from 'react';

const AwarenessCard = ({ title, points }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 grid gap-3">
      <div className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2 mb-1">{title}</div>
      <ul className="list-disc list-inside text-slate-600 font-medium text-sm grid gap-2">
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </div>
  );
};

export default AwarenessCard;
