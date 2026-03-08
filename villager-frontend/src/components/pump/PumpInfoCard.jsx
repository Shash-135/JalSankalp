import React from 'react';
import { HiLocationMarker, HiCalendar, HiQrcode } from 'react-icons/hi';

const statusMap = {
  active:      { label: 'Active',      cls: 'badge-active'   },
  maintenance: { label: 'Maintenance', cls: 'badge-pending'  },
  inactive:    { label: 'Inactive',    cls: 'badge-inactive' },
};

const PumpInfoCard = ({ name, location, status, lastMaintenance, qrId }) => {
  const st = statusMap[status] || { label: status, cls: 'badge' };
  return (
    <div className="card overflow-hidden animate-slide-up">
      {/* Header Band */}
      <div className="bg-gradient-to-r from-primary to-blue-700 px-5 py-5 grid gap-2">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl font-black text-white leading-tight">{name}</h2>
          <span className={`badge shrink-0 mt-0.5 bg-white/20 border-white/30 text-white`}>{st.label}</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/75 text-xs font-semibold">
          <HiLocationMarker className="h-4 w-4 shrink-0" />
          {location}
        </div>
      </div>

      {/* Details */}
      <div className="px-5 py-4 grid gap-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted font-semibold">
            <HiCalendar className="h-4 w-4" />
            Installation Date
          </div>
          <span className="font-extrabold text-ink">{lastMaintenance}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted font-semibold">
            <HiQrcode className="h-4 w-4" />
            QR Identifier
          </div>
          <span className="font-extrabold text-ink font-mono text-xs bg-slate-100 px-2 py-1 rounded-lg">
            {typeof qrId === 'string' && qrId.length > 20 ? qrId.slice(0, 20) + '…' : qrId}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PumpInfoCard;
