import React, { useState } from 'react';
import { HiPaperAirplane } from 'react-icons/hi';
import api from '../../services/api.js';
import { useTranslation } from 'react-i18next';

const issueTypes = ['No water', 'Low pressure', 'Leakage', 'Noise', 'Electrical issue', 'Other'];

const ComplaintForm = ({ pumpId, pumpName, onSubmitted }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '',
    email: '',
    otp: '',
    area: '',
    issue_type: '',
    description: '',
    pump_id: pumpId || '',
    image: null,
  });
  const [sending, setSending] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const sendOtp = async () => {
    if (!form.email) {
      setError('Please enter a valid email address first.');
      return;
    }
    
    try {
      setError(null);
      setIsSendingOtp(true);
      await api.post('/otp/send', { email: form.email });
      setOtpSent(true);
    } catch {
      setError('Failed to send OTP. Check your email address and try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const verifyRes = await api.post('/otp/verify', { email: form.email, otp: form.otp });
      const token = verifyRes.data.token;

      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('area', form.area);
      formData.append('issue_type', form.issue_type);
      formData.append('description', form.description);
      formData.append('pump_id', form.pump_id);
      if (form.image) formData.append('photo', form.image);

      const compRes = await api.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      });
      onSubmitted?.(compRes.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit complaint. Please check OTP and try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="card p-5 grid gap-4" onSubmit={handleSubmit}>
      {error && <div className="error-banner text-red-500 font-semibold">{error}</div>}

      <div>
        <label className="label">{t('complaint.fullName')}</label>
        <input name="name" className="input-field" value={form.name} onChange={handleChange} required placeholder="Your full name" />
      </div>

      <div>
        <label className="label">{t('complaint.emailAddress')}</label>
        <div className="flex flex-col sm:flex-row gap-3 mt-1">
          <input
            name="email"
            type="email"
            className="input-field flex-1 mt-0"
            value={form.email}
            onChange={handleChange}
            required
            inputMode="email"
            placeholder="village@mail.com"
          />
          <button
            type="button"
            onClick={sendOtp}
            disabled={isSendingOtp}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-white font-extrabold text-sm hover:bg-primary/90 active:scale-[.98] transition-all whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSendingOtp ? t('complaint.submitting') : (otpSent ? t('complaint.resend') : t('complaint.getOtp'))}
          </button>
        </div>
      </div>

      {otpSent && (
        <div className="animate-slide-up">
          <label className="label">{t('complaint.otpVerification')}</label>
          <input
            name="otp"
            className="input-field"
            value={form.otp}
            onChange={handleChange}
            required
            placeholder="6-digit OTP"
            inputMode="numeric"
            pattern="[0-9]{6}"
          />
          <p className="mt-1.5 text-xs text-muted font-semibold">{t('complaint.otpSentTo')} {form.email}</p>
        </div>
      )}

      {!pumpId && (
        <div className="animate-slide-up">
          <label className="label">{t('complaint.pumpId')}</label>
          <input
            name="pump_id"
            className="input-field"
            value={form.pump_id}
            onChange={handleChange}
            required
            placeholder="Enter Pump ID Number"
            inputMode="numeric"
            pattern="[0-9]+"
          />
        </div>
      )}

      <div>
        <label className="label">{t('complaint.areaLandmark')}</label>
        <input name="area" className="input-field" value={form.area} onChange={handleChange} required placeholder="Nearest landmark" />
      </div>

      <div>
        <label className="label">{t('complaint.issueType')}</label>
        <select name="issue_type" className="input-field" value={form.issue_type} onChange={handleChange} required>
          <option value="">Select issue type</option>
          {issueTypes.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>

      <div>
        <label className="label">{t('complaint.description')}</label>
        <textarea
          name="description"
          className="input-field resize-none"
          rows={3}
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the problem in detail"
          required
        />
      </div>

      <div>
        <label className="label">{t('complaint.photo')}</label>
        <div className="relative mt-1 border-2 border-dashed border-slate-200 rounded-xl p-4 text-center text-sm text-muted font-semibold hover:border-primary/40 transition-colors cursor-pointer">
          <input type="file" name="image" accept="image/*" onChange={handleChange} className="absolute inset-0 w-full h-full opacity-0 pointer-events-none z-10 cursor-pointer" id="imgUpload" />
          <label htmlFor="imgUpload" className="cursor-pointer relative z-0">
            {form.image ? `📷 ${form.image.name}` : '📷 Tap to attach a photo'}
          </label>
        </div>
      </div>

      <button type="submit" className="btn-primary flex items-center justify-center gap-2" disabled={sending || !otpSent}>
        <HiPaperAirplane className="h-5 w-5 rotate-90" />
        {sending ? t('complaint.submitting') : t('complaint.submit')}
      </button>
    </form>
  );
};

export default ComplaintForm;
