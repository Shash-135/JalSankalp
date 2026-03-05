import React from 'react';
import FeedbackForm from '../../components/forms/FeedbackForm.jsx';

const FeedbackPage = () => {
  return (
    <div className="grid gap-4">
      <div className="card p-5 text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-primary">Feedback</div>
        <h2 className="text-xl font-bold text-slate-800">Share Your Experience</h2>
        <p className="text-base text-slate-600">Help us improve the water supply service.</p>
      </div>
      <FeedbackForm />
    </div>
  );
};

export default FeedbackPage;
