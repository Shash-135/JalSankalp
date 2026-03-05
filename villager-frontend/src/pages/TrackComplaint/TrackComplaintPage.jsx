import React, { useState } from 'react';
import ComplaintStatusCard from '../../components/ui/ComplaintStatusCard.jsx';
import { sampleComplaint } from '../../utils/mockData.js';

const TrackComplaintPage = () => {
  const [form, setForm] = useState({ mobile: '', complaintId: '' });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTrack = (e) => {
    e.preventDefault();
    setResult({ ...sampleComplaint, id: form.complaintId || sampleComplaint.id });
  };

  return (
    <div className="grid gap-4">
      <div className="card p-5 text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-primary">Track</div>
        <h2 className="text-xl font-bold text-slate-800">Track Your Complaint</h2>
        <p className="text-base text-slate-600">Enter your mobile number and complaint ID to see the latest status.</p>
      </div>

      <form className="card p-5 grid gap-4" onSubmit={handleTrack}>
        <div>
          <label className="label">Mobile Number</label>
          <input
            name="mobile"
            className="input-field"
            value={form.mobile}
            onChange={handleChange}
            required
            inputMode="tel"
            pattern="[0-9]{10}"
            placeholder="10-digit mobile"
          />
        </div>
        <div>
          <label className="label">Complaint ID</label>
          <input
            name="complaintId"
            className="input-field"
            value={form.complaintId}
            onChange={handleChange}
            required
            placeholder="e.g., CMP-10234"
          />
        </div>
        <button type="submit" className="button-primary">Check Status</button>
      </form>

      <ComplaintStatusCard complaint={result} />
    </div>
  );
};

export default TrackComplaintPage;
