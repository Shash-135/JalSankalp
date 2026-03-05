import React, { useState } from 'react';
import api from '../../services/api.js';

const FeedbackForm = () => {
  const [form, setForm] = useState({ name: '', mobile: '', feedback: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/feedback', form).catch(() => {});
    setSubmitted(true);
  };

  return (
    <form className="card p-5 grid gap-4" onSubmit={handleSubmit}>
      <div>
        <label className="label">Name</label>
        <input name="name" className="input-field" value={form.name} onChange={handleChange} required />
      </div>
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
        <label className="label">Feedback</label>
        <textarea
          name="feedback"
          className="input-field"
          rows={3}
          value={form.feedback}
          onChange={handleChange}
          placeholder="Share your experience"
          required
        />
      </div>
      <button type="submit" className="button-primary">{submitted ? 'Thank you!' : 'Send Feedback'}</button>
    </form>
  );
};

export default FeedbackForm;
