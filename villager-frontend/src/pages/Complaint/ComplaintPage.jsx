import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { HiCheckCircle, HiClipboardList } from 'react-icons/hi';
import ComplaintForm from '../../components/forms/ComplaintForm.jsx';

const ComplaintPage = () => {
  const [submitted, setSubmitted] = useState(null);
  const location = useLocation();
  const pumpContext = location.state || {};

  return (
    <div className="grid gap-5">
      {/* Page Header */}
      <div className="page-header animate-slide-up grid gap-1.5">
        <div className="flex items-center gap-2 text-white/70 text-xs font-extrabold uppercase tracking-widest">
          <HiClipboardList className="h-4 w-4" />
          Submit Grievance
        </div>
        <h2 className="text-xl md:text-2xl font-black text-white">File a Complaint</h2>
        {pumpContext.pump_name ? (
          <div className="mt-1 inline-flex items-center gap-2 bg-white/20 text-white font-bold text-xs px-3 py-1.5 rounded-full self-start">
            📍 {pumpContext.pump_name}
          </div>
        ) : (
          <p className="text-sm text-white/75 font-semibold">
            Provide your details and describe the pump issue to receive a tracking ID.
          </p>
        )}
      </div>

      {/* Responsive: form + success side by side on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <ComplaintForm pumpId={pumpContext.pump_id} pumpName={pumpContext.pump_name} onSubmitted={setSubmitted} />

        {submitted && (
          <div className="card p-6 text-center animate-slide-up border-2 border-success/30">
            <div className="h-14 w-14 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto mb-3">
              <HiCheckCircle className="h-8 w-8" />
            </div>
            <div className="text-lg font-black text-ink mb-1">Complaint Submitted!</div>
            {pumpContext.pump_name && (
              <div className="text-sm text-muted mb-3">Pump: <strong>{pumpContext.pump_name}</strong></div>
            )}
            <div className="text-xs text-muted font-semibold mb-2">Your Complaint ID</div>
            <div className="text-4xl font-black tracking-widest text-primary bg-primary/5 border-2 border-primary/20 rounded-2xl py-3 px-6 inline-block mb-4">
              #{submitted.id || submitted.complaintId}
            </div>
            <p className="text-xs text-muted font-bold bg-slate-50 rounded-xl p-3">
              📌 Save this ID. You'll need it to track your complaint status.
            </p>
            <Link to="/track" className="mt-4 btn-primary block">Track This Complaint →</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintPage;
