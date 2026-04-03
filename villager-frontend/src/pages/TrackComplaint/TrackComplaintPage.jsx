import React, { useState } from 'react';
import { HiRefresh, HiSearch } from 'react-icons/hi';
import api from '../../services/api.js';
import ComplaintStatusCard from '../../components/ui/ComplaintStatusCard.jsx';
import { useTranslation } from 'react-i18next';

const TrackComplaintPage = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ email: '', complaintId: '' });
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
        email: form.email,
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
    <div className="grid gap-6 pb-4">
      {/* HEADER */}
      <div className="page-header grid gap-2 animate-slide-up">
        <div className="flex items-center gap-2 text-white/70 text-xs font-extrabold uppercase tracking-widest">
          <HiRefresh className="h-4 w-4" />
          {t('track.liveTracking')}
        </div>
        <h2 className="text-xl md:text-2xl font-black text-white">{t('track.trackGrievance')}</h2>
        <p className="text-sm text-white/75 font-semibold">
          {t('track.enterDetails')}
        </p>
      </div>

      {/* FORM & RESULT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <form className="card p-5 grid gap-4" onSubmit={handleTrack}>
          {error && <div className="error-banner">{error}</div>}
          <div>
            <label className="label">{t('complaint.emailAddress')}</label>
            <input
              name="email"
              type="email"
              className="input-field"
              value={form.email}
              onChange={handleChange}
              required
              inputMode="email"
              placeholder="village@mail.com"
            />
          </div>
          <div>
            <label className="label">{t('track.complaintId')}</label>
            <input
              name="complaintId"
              className="input-field"
              value={form.complaintId}
              onChange={handleChange}
              required
              placeholder="e.g. 42"
            />
          </div>
          <button type="submit" className="btn-primary flex items-center justify-center gap-2" disabled={loading}>
            <HiSearch className="h-5 w-5" />
            {loading ? t('track.searching') : t('track.checkStatus')}
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
