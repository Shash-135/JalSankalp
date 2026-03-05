import React, { useState } from 'react';
import ComplaintForm from '../../components/forms/ComplaintForm.jsx';

const ComplaintPage = () => {
  const [submitted, setSubmitted] = useState(null);

  return (
    <div className="grid gap-4">
      <div className="card p-5 text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-primary">Step 2</div>
        <h2 className="text-xl font-bold text-slate-800">Submit a Complaint</h2>
        <p className="text-base text-slate-600">Provide details about the pump issue. You will receive a complaint ID.</p>
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
