import React, { useState } from 'react';
import ComplaintForm from '../../components/forms/ComplaintForm.jsx';

const ComplaintPage = () => {
  const [submitted, setSubmitted] = useState(null);

  return (
    <div className="grid gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 text-center">
        <div className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Step 2</div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Submit a Grievance</h2>
        <p className="text-sm font-medium text-slate-500">Provide official details about the pump issue to receive a tracking ID.</p>
      </div>

      <ComplaintForm onSubmitted={setSubmitted} />

      {submitted && (
        <div className="card p-4 text-center text-base text-slate-700">
          Complaint submitted. Your ID: <span className="font-bold text-primary">{submitted.complaintId}</span>. Save this ID to track the status.
        </div>
      )}
    </div>
  );
};

export default ComplaintPage;
