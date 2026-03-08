import React, { useState } from 'react';
import { HiCheckCircle } from 'react-icons/hi';
import api from '../../services/api.js';

const FeedbackForm = () => {
  const [form, setForm] = useState({ name: '', mobile: '', comments: '', rating: 5 });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/feedback', { mobile: form.mobile, rating: form.rating, comments: form.comments });
      setSubmitted(true);
    } catch {
      setError('Failed to send feedback. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="card p-8 text-center animate-slide-up">
        <div className="h-14 w-14 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto mb-3">
          <HiCheckCircle className="h-8 w-8" />
        </div>
        <div className="font-black text-ink text-lg">Thank You!</div>
        <p className="text-sm text-muted font-semibold mt-1">Your feedback helps us improve water services.</p>
      </div>
    );
  }

  return (
    <form className="card p-5 grid gap-4" onSubmit={handleSubmit}>
      {error && <div className="error-banner">{error}</div>}

      <div>
        <label className="label">Full Name</label>
        <input name="name" className="input-field" value={form.name} onChange={handleChange} required placeholder="Your name" />
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
          placeholder="10-digit mobile number"
        />
      </div>

      <div>
        <label className="label">Your Rating</label>
        <div className="flex items-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setForm((p) => ({ ...p, rating: star }))}
              className={`text-3xl transition-transform active:scale-90 ${form.rating >= star ? 'text-yellow-400' : 'text-slate-200'}`}
            >
              ★
            </button>
          ))}
          <span className="ml-2 text-sm text-muted font-bold">{form.rating}/5</span>
        </div>
      </div>

      <div>
        <label className="label">Feedback</label>
        <textarea
          name="comments"
          className="input-field resize-none"
          rows={3}
          value={form.comments}
          onChange={handleChange}
          placeholder="Share your experience with the water supply service"
          required
        />
      </div>

      <button type="submit" className="btn-primary">Send Feedback</button>
    </form>
  );
};

export default FeedbackForm;
