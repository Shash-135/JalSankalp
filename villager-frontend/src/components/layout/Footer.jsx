import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 mt-8">
      <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-slate-600">
        <div>JANSANKALP • Gram Panchayat Water Support</div>
        <div className="flex gap-3">
          <Link to="/awareness" className="hover:text-primary">Awareness</Link>
          <Link to="/feedback" className="hover:text-primary">Feedback</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
