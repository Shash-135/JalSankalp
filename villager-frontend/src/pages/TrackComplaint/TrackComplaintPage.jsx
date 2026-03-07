import React, { useState } from 'react';
import api from '../../services/api.js';
import ComplaintStatusCard from '../../components/ui/ComplaintStatusCard.jsx';

const TrackComplaintPage = () => {
  const [form, setForm] = useState({ mobile: '', complaintId: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await api.post('/complaints/track', {
        mobile: form.mobile,
        complaint_id: form.complaintId
      });
      // Pass the full response - ComplaintStatusCard handles display
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Complaint not found. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 text-center">
        <div className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Live Tracking</div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Track Grievance</h2>
        <p className="text-sm font-medium text-slate-500">Enter your official complaint ID to see the latest status.</p>
      </div>

      <form className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 grid gap-5" onSubmit={handleTrack}>
        {error && <div className="text-red-500 bg-red-50 p-2 text-sm text-center">{error}</div>}
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
            placeholder="e.g., 1 or CMP-101"
          />
        </div>
        <button type="submit" className="button-primary" disabled={loading}>
          {loading ? 'Checking...' : 'Check Status'}
        </button>
      </form>

      {result && <ComplaintStatusCard complaint={result} />}
    </div>
  );
};

export default TrackComplaintPage;
