import React from 'react';

const AwarenessCard = ({ title, points, icon: Icon, accent = 'border-l-primary' }) => (
  <div className={`card p-5 border-l-4 ${accent} animate-slide-up`}>
    <div className="flex items-center gap-2 mb-3">
      {Icon && <Icon className="h-5 w-5 text-muted shrink-0" />}
      <div className="font-extrabold text-ink text-base">{title}</div>
    </div>
    <ul className="grid gap-2">
      {points.map((p) => (
        <li key={p} className="flex items-start gap-2 text-sm text-muted font-semibold">
          <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
          {p}
        </li>
      ))}
    </ul>
  </div>
);

export default AwarenessCard;
