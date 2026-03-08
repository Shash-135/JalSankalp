import React from 'react';
import { HiStar } from 'react-icons/hi';
import FeedbackForm from '../../components/forms/FeedbackForm.jsx';

const FeedbackPage = () => (
  <div className="grid gap-5">
    <div className="page-header animate-slide-up grid gap-1.5">
      <div className="flex items-center gap-2 text-white/70 text-xs font-extrabold uppercase tracking-widest">
        <HiStar className="h-4 w-4" />
        Feedback
      </div>
      <h2 className="text-xl md:text-2xl font-black text-white">Share Your Experience</h2>
      <p className="text-sm text-white/75 font-semibold">
        Help us improve the water supply service for everyone.
      </p>
    </div>
    {/* Constrain form to a readable width on desktop */}
    <div className="max-w-xl">
      <FeedbackForm />
    </div>
  </div>
);

export default FeedbackPage;
