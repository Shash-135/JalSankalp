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
    pump_id: pumpId || '', // Use pump from QR scan, fallback to empty
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
    } catch (err) {
      setError("Failed to send OTP. Try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      // First verify OTP
      const verifyRes = await api.post('/otp/verify', { mobile_number: form.mobile, otp: form.otp });
      const token = verifyRes.data.token;

      // Submit actual multipart form data
      const formData = new FormData();
      formData.append('villager_name', form.name);
      formData.append('mobile', form.mobile);
      formData.append('area', form.area);
      formData.append('issue_type', form.issue_type);
      formData.append('description', form.description);
      formData.append('pump_id', form.pump_id);
      if (form.image) {
        formData.append('photo', form.image);
      }

      const compRes = await api.post('/complaints', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      onSubmitted?.(compRes.data); // Backend returns { id, message }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit complaint.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 grid gap-5" onSubmit={handleSubmit}>
      {error && <div className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-md text-sm font-semibold text-center">{error}</div>}
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
          <button type="button" className="px-5 rounded-md bg-slate-800 text-white font-bold text-sm hover:bg-slate-700 transition" onClick={sendOtp}>
            {otpSent ? 'RESEND' : 'GET OTP'}
          </button>
        </div>
      </div>
      {otpSent && (
        <div>
          <label className="label">OTP Verification</label>
          <input
            name="otp"
            className="input-field"
            value={form.otp}
            onChange={handleChange}
            required
            placeholder="Enter 6-digit OTP (e.g. 123456)"
            inputMode="numeric"
            pattern="[0-9]{6}"
          />
        </div>
      )}
      <div>
        <label className="label">Area / Landmark</label>
        <input name="area" className="input-field" value={form.area} onChange={handleChange} required />
      </div>
      <div>
        <label className="label">Issue Type</label>
        <select name="issue_type" className="input-field" value={form.issue_type} onChange={handleChange} required>
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
      <button type="submit" className="button-primary" disabled={sending || !otpSent}>
        {sending ? 'Submitting...' : 'Submit Complaint'}
      </button>
    </form>
  );
};

export default ComplaintForm;
