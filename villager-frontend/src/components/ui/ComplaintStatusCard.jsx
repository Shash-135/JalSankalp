import React from 'react';

const ComplaintStatusCard = ({ complaint }) => {
  if (!complaint) {
    return (
      <div className="card p-5 text-center text-slate-600">Enter your mobile number and complaint ID to view status.</div>
    );
  }

  return (
    <div className="card p-5 grid gap-3">
      <div className="text-sm text-slate-500">Complaint ID: {complaint.id}</div>
      <div className="text-xl font-bold text-slate-800">{complaint.subject}</div>
      <div className="text-base"><span className="font-semibold">Status:</span> {complaint.status}</div>
      <div className="text-base text-slate-600">Admin response: {complaint.response}</div>
      <div className="text-base text-slate-600">Last update: {complaint.updated}</div>
    </div>
  );
};

export default ComplaintStatusCard;
