import React from 'react';

const AwarenessCard = ({ title, points }) => {
  return (
    <div className="card p-5 grid gap-2">
      <div className="text-lg font-bold text-slate-800">{title}</div>
      <ul className="list-disc list-inside text-slate-600 text-base grid gap-1">
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </div>
  );
};

export default AwarenessCard;
