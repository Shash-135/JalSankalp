import React from 'react';
import { HiCheckCircle, HiClock } from 'react-icons/hi';

const statusColors = {
  pending:  'text-amber-700 bg-amber-50 border-amber-200',
  resolved: 'text-emerald-700 bg-emerald-50 border-emerald-200',
};

const ComplaintStatusCard = ({ complaint }) => {
  if (!complaint) return null;
  const statusStyle  = statusColors[complaint.status] || 'text-slate-700 bg-slate-50 border-slate-200';
  const isResolved   = complaint.status === 'resolved';

  return (
    <div className="card overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-700 px-5 py-4 text-white grid gap-1">
        <div className="text-xs font-extrabold opacity-70 uppercase tracking-widest">
          Complaint #{complaint.id}
        </div>
        <div className="text-lg font-black">{complaint.pump_name}</div>
        <span className={`badge self-start mt-1 ${statusStyle}`}>
          {isResolved ? <HiCheckCircle className="h-3.5 w-3.5" /> : <HiClock className="h-3.5 w-3.5" />}
          {isResolved ? 'Resolved' : 'Pending'}
        </span>
      </div>

      {/* Status Timeline */}
      <div className="px-5 py-4 grid gap-4">
        <div className="flex items-center gap-0">
          {['Filed', 'Under Review', 'Resolved'].map((step, i) => {
            const done = isResolved ? true : i === 0;
            return (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center gap-1">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-black border-2 transition-colors
                    ${done ? 'bg-primary border-primary text-white' : 'bg-white border-slate-200 text-muted'}`}>
                    {i + 1}
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase tracking-wide ${done ? 'text-primary' : 'text-slate-400'}`}>
                    {step}
                  </span>
                </div>
                {i < 2 && (
                  <div className={`flex-1 h-0.5 mb-5 mx-1 ${done && i < (isResolved ? 2 : 0) ? 'bg-primary' : 'bg-slate-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Issue Details */}
        <div className="bg-slate-50 rounded-xl p-4 grid gap-2 text-sm">
          <div className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">Issue Details</div>
          <div className="flex items-center justify-between">
            <span className="text-muted font-semibold">Type</span>
            <span className="font-extrabold text-ink">{complaint.issue_type || '—'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted font-semibold">Filed On</span>
            <span className="font-extrabold text-ink">
              {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString('en-IN') : '—'}
            </span>
          </div>
          {complaint.description && (
            <div className="pt-1 border-t border-slate-200">
              <span className="text-muted font-semibold block mb-0.5">Description</span>
              <p className="text-ink font-semibold leading-relaxed">{complaint.description}</p>
            </div>
          )}
        </div>

        {/* Submitted Photo */}
        {complaint.photo_url && (
          <div>
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Your Submitted Photo</div>
            <img
              src={complaint.photo_url}
              alt="Submitted by villager"
              className="w-full rounded-xl border border-slate-200 object-cover max-h-52"
            />
          </div>
        )}

        {/* Resolution */}
        {isResolved && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 grid gap-2">
            <div className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest">Admin Resolution</div>
            {complaint.resolved_at && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-700 font-semibold">Resolved On</span>
                <span className="font-extrabold text-emerald-900">
                  {new Date(complaint.resolved_at).toLocaleDateString('en-IN')}
                </span>
              </div>
            )}
            {complaint.admin_notes && (
              <div className="text-sm text-emerald-900 font-semibold">
                <span className="font-extrabold block mb-0.5">Admin Note:</span>
                {complaint.admin_notes}
              </div>
            )}
            {complaint.resolution_photo_url && (
              <div>
                <div className="text-xs font-semibold text-emerald-700 mb-1">Proof of Resolution</div>
                <img
                  src={complaint.resolution_photo_url}
                  alt="Resolution proof"
                  className="w-full rounded-xl border border-emerald-200 object-cover max-h-52"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintStatusCard;
