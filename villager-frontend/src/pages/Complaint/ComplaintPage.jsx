import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ComplaintForm from '../../components/forms/ComplaintForm.jsx';

const ComplaintPage = () => {
  const [submitted, setSubmitted] = useState(null);
  const location = useLocation();
  // pump context passed from PumpInfoPage via Link state
  const pumpContext = location.state || {};

  return (
    <div className="grid gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 text-center">
        <div className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Step 2</div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Submit a Grievance</h2>
        {pumpContext.pump_name ? (
          <div className="mt-2 inline-flex items-center gap-2 bg-primary/10 text-primary font-bold text-sm px-4 py-2 rounded-full">
            <span>📍</span> {pumpContext.pump_name}
          </div>
        ) : (
          <p className="text-sm font-medium text-slate-500">Provide official details about the pump issue to receive a tracking ID.</p>
        )}
      </div>

      <ComplaintForm pumpId={pumpContext.pump_id} pumpName={pumpContext.pump_name} onSubmitted={setSubmitted} />

      {submitted && (
        <div className="bg-green-50 border-2 border-green-400 rounded-xl p-6 text-center shadow-sm">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-lg font-black text-green-800 mb-1">Complaint Submitted!</div>
          {pumpContext.pump_name && (
            <div className="text-sm text-green-700 mb-3">Pump: <strong>{pumpContext.pump_name}</strong></div>
          )}
          <div className="text-sm text-green-700 mb-2">Your Complaint ID is:</div>
          <div className="text-4xl font-black tracking-widest text-primary bg-white border-2 border-primary rounded-xl py-3 px-6 inline-block mb-3">
            #{submitted.id || submitted.complaintId}
          </div>
          <p className="text-xs text-green-700 font-medium">📌 Save this ID. You'll need it to track your complaint status.</p>
        </div>
      )}
    </div>
  );
};

export default ComplaintPage;
