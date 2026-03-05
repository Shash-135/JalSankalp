import React, { useState } from 'react';
import api from '../../services/api.js';

const issueTypes = ['No water', 'Low pressure', 'Leakage', 'Noise', 'Electrical issue', 'Other'];

const ComplaintForm = ({ onSubmitted }) => {
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    otp: '',
    area: '',
    issueType: '',
    description: '',
    image: null,
  });
  const [sending, setSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const sendOtp = async () => {
    setOtpSent(true);
    // Placeholder API call
    await api.post('/otp/send', { mobile: form.mobile }).catch(() => {});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      // Placeholder submission
      await api.post('/complaints', form);
      onSubmitted?.({ complaintId: 'CMP-10234', mobile: form.mobile });
    } catch (err) {
      onSubmitted?.({ complaintId: 'CMP-10234', mobile: form.mobile });
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="card p-5 grid gap-4" onSubmit={handleSubmit}>
      <div>
        <label className="label">Name</label>
        <input name="name" className="input-field" value={form.name} onChange={handleChange} required />
      </div>
      <div>
        <label className="label">Mobile Number</label>
        <div className="flex gap-2">
          <input
            name="mobile"
            className="input-field flex-1"
            value={form.mobile}
            onChange={handleChange}
            required
            inputMode="tel"
            pattern="[0-9]{10}"
            placeholder="10-digit mobile"
          />
          <button type="button" className="px-4 rounded-xl bg-secondary text-white font-semibold" onClick={sendOtp}>
            {otpSent ? 'Resend' : 'Send OTP'}
          </button>
        </div>
      </div>
      <div>
        <label className="label">OTP Verification</label>
        <input
          name="otp"
          className="input-field"
          value={form.otp}
          onChange={handleChange}
          required
          placeholder="Enter 6-digit OTP"
          inputMode="numeric"
          pattern="[0-9]{6}"
        />
      </div>
      <div>
        <label className="label">Area / Landmark</label>
        <input name="area" className="input-field" value={form.area} onChange={handleChange} required />
      </div>
      <div>
        <label className="label">Issue Type</label>
        <select name="issueType" className="input-field" value={form.issueType} onChange={handleChange} required>
          <option value="">Select issue</option>
          {issueTypes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">Description</label>
        <textarea
          name="description"
          className="input-field"
          rows={3}
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the problem"
          required
        />
      </div>
      <div>
        <label className="label">Image Upload (optional)</label>
        <input name="image" type="file" accept="image/*" className="mt-2" onChange={handleChange} />
      </div>
      <button type="submit" className="button-primary" disabled={sending}>
        {sending ? 'Submitting...' : 'Submit Complaint'}
      </button>
    </form>
  );
};

export default ComplaintForm;
