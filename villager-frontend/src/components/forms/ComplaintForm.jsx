import React, { useState } from 'react';
import api from '../../services/api.js';

const issueTypes = ['No water', 'Low pressure', 'Leakage', 'Noise', 'Electrical issue', 'Other'];

const ComplaintForm = ({ pumpId, pumpName, onSubmitted }) => {
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    otp: '',
    area: '',
    issue_type: '',
    description: '',
    pump_id: pumpId || '',
    image: null,
  });
  const [sending, setSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const sendOtp = async () => {
    try {
      setError(null);
      await api.post('/otp/send', { mobile_number: form.mobile });
      setOtpSent(true);
    } catch {
      setError('Failed to send OTP. Check your mobile number and try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const verifyRes = await api.post('/otp/verify', { mobile_number: form.mobile, otp: form.otp });
      const token = verifyRes.data.token;

      const formData = new FormData();
      formData.append('villager_name', form.name);
      formData.append('mobile', form.mobile);
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
      setError(err.response?.data?.error || 'Failed to submit complaint. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="card p-5 grid gap-4" onSubmit={handleSubmit}>
      {error && <div className="error-banner">{error}</div>}

      <div>
        <label className="label">Full Name</label>
        <input name="name" className="input-field" value={form.name} onChange={handleChange} required placeholder="Your name" />
      </div>

      <div>
        <label className="label">Mobile Number</label>
        <div className="flex gap-2 mt-1">
          <input
            name="mobile"
            className="input-field flex-1 mt-0"
            value={form.mobile}
            onChange={handleChange}
            required
            inputMode="tel"
            pattern="[0-9]{10}"
            placeholder="10-digit number"
          />
          <button
            type="button"
            onClick={sendOtp}
            className="px-4 py-3 rounded-xl bg-primary text-white font-extrabold text-sm hover:bg-primary/90 active:scale-[.98] transition-all whitespace-nowrap"
          >
            {otpSent ? 'Resend' : 'Get OTP'}
          </button>
        </div>
      </div>

      {otpSent && (
        <div className="animate-slide-up">
          <label className="label">OTP Verification</label>
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
          <p className="mt-1.5 text-xs text-muted font-semibold">OTP sent to +91 {form.mobile}</p>
        </div>
      )}

      <div>
        <label className="label">Area / Landmark</label>
        <input name="area" className="input-field" value={form.area} onChange={handleChange} required placeholder="Nearest landmark" />
      </div>

      <div>
        <label className="label">Issue Type</label>
        <select name="issue_type" className="input-field" value={form.issue_type} onChange={handleChange} required>
          <option value="">Select issue type</option>
          {issueTypes.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>

      <div>
        <label className="label">Description</label>
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
        <label className="label">Photo (Optional)</label>
        <div className="mt-1 border-2 border-dashed border-slate-200 rounded-xl p-4 text-center text-sm text-muted font-semibold hover:border-primary/40 transition-colors cursor-pointer">
          <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full opacity-0 absolute pointer-events-none" id="imgUpload" />
          <label htmlFor="imgUpload" className="cursor-pointer">
            {form.image ? `📷 ${form.image.name}` : '📷 Tap to attach a photo'}
          </label>
        </div>
      </div>

      <button type="submit" className="btn-primary" disabled={sending || !otpSent}>
        {sending ? 'Submitting...' : 'Submit Complaint'}
      </button>
    </form>
  );
};

export default ComplaintForm;
