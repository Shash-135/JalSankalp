import React, { useState } from 'react';
import { HiRefresh, HiSearch } from 'react-icons/hi';
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
        complaint_id: form.complaintId,
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Complaint not found. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-5">
      {/* Page Header */}
      <div className="page-header animate-slide-up grid gap-1.5">
        <div className="flex items-center gap-2 text-white/70 text-xs font-extrabold uppercase tracking-widest">
          <HiRefresh className="h-4 w-4" />
          Live Tracking
        </div>
        <h2 className="text-xl md:text-2xl font-black text-white">Track Grievance</h2>
        <p className="text-sm text-white/75 font-semibold">
          Enter your complaint ID and mobile to see the latest status.
        </p>
      </div>

      {/* Responsive: search left, result right on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <form className="card p-5 grid gap-4" onSubmit={handleTrack}>
          {error && <div className="error-banner">{error}</div>}
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
              placeholder="10-digit mobile number"
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
              placeholder="e.g., 42"
            />
          </div>
          <button type="submit" className="btn-primary flex items-center justify-center gap-2" disabled={loading}>
            <HiSearch className="h-5 w-5" />
            {loading ? 'Searching...' : 'Check Status'}
          </button>
        </form>

        {result && (
          <div className="animate-slide-up">
            <ComplaintStatusCard complaint={result} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackComplaintPage;
