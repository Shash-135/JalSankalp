import React, { useState } from 'react';
import api from '../../services/api.js';

const FeedbackForm = () => {
  const [form, setForm] = useState({ name: '', mobile: '', comments: '', rating: 5 });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRating = (rating) => {
    setForm((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/feedback', {
        mobile: form.mobile,
        rating: form.rating,
        comments: form.comments
      });
      setSubmitted(true);
      setForm({ name: '', mobile: '', comments: '', rating: 5 });
    } catch (err) {
      alert("Failed to send feedback.");
    }
  };

  return (
    <form className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 grid gap-5" onSubmit={handleSubmit}>
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
        <label className="label">Rating</label>
        <div className="flex gap-2 mt-1">
          {[1,2,3,4,5].map(star => (
            <button 
              key={star} 
              type="button" 
              onClick={() => handleRating(star)}
              className={`text-2xl ${form.rating >= star ? 'text-yellow-400' : 'text-slate-200'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="label">Feedback</label>
        <textarea
          name="comments"
          className="input-field"
          rows={3}
          value={form.comments}
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
