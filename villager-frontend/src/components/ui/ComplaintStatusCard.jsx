import React from 'react';
import api from '../../services/api';

// Photo URLs are relative (/uploads/...) — served through Vite proxy over HTTPS
// No need for an absolute BASE URL

const statusColors = {
  pending: 'text-yellow-700 bg-yellow-50 border-yellow-200',
  resolved: 'text-green-700 bg-green-50 border-green-200',
  default: 'text-slate-700 bg-slate-50 border-slate-200',
};

const ComplaintStatusCard = ({ complaint }) => {
  if (!complaint) {
    return (
      <div className="bg-white p-5 rounded-lg border border-slate-200 text-center text-slate-500 font-medium">
        Enter your mobile number and complaint ID to view status.
      </div>
    );
  }

  const statusStyle = statusColors[complaint.status] || statusColors.default;

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-primary p-4 text-white">
        <div className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Complaint #{complaint.id}</div>
        <div className="text-lg font-black">{complaint.pump_name}</div>
        <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${statusStyle}`}>
          {complaint.status === 'resolved' ? '✅ Resolved' : '⏳ Pending'}
        </div>
      </div>

      <div className="p-5 grid gap-4">
        {/* Issue Details */}
        <div className="grid gap-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Issue Details</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="font-semibold text-slate-600">Type:</span> {complaint.issue_type || '—'}</div>
            <div><span className="font-semibold text-slate-600">Filed:</span> {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString('en-IN') : '—'}</div>
          </div>
          {complaint.description && (
            <div className="text-sm text-slate-700"><span className="font-semibold text-slate-600">Description:</span> {complaint.description}</div>
          )}
        </div>

        {/* Villager Photo */}
        {complaint.photo_url && (
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Your Submitted Photo</div>
            <img 
              src={complaint.photo_url}
              alt="Submitted by villager"
              className="w-full rounded-lg border border-slate-200 object-cover max-h-52"
            />
          </div>
        )}

        {/* Admin Resolution */}
        {complaint.status === 'resolved' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 grid gap-3">
            <div className="text-xs font-bold uppercase tracking-wider text-green-700">Admin Resolution</div>
            {complaint.resolved_at && (
              <div className="text-sm text-green-800">
                <span className="font-semibold">Resolved on:</span> {new Date(complaint.resolved_at).toLocaleDateString('en-IN')}
              </div>
            )}
            {complaint.admin_notes && (
              <div className="text-sm text-green-900">
                <span className="font-semibold">Admin Notes:</span> {complaint.admin_notes}
              </div>
            )}
            {complaint.resolution_photo_url && (
              <div>
                <div className="text-xs font-semibold text-green-700 mb-1">Proof of Resolution</div>
                <img 
                  src={complaint.resolution_photo_url}
                  alt="Resolution proof"
                  className="w-full rounded-lg border border-green-200 object-cover max-h-52"
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
