import React from 'react';
import { Link } from 'react-router-dom';
import QRScanner from '../../components/ui/QRScanner.jsx';

const HomePage = () => {
  return (
    <div className="grid gap-4">
      <div className="card p-5 grid gap-2 text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-primary">JANSANKALP</div>
        <h1 className="text-2xl font-bold text-slate-800">Water Pump Support Portal</h1>
        <p className="text-base text-slate-600">
          Scan the QR on the pump to view details, submit a complaint, and track its status. Simple and mobile friendly for every villager.
        </p>
      </div>

      <QRScanner />

      <div className="grid md:grid-cols-2 gap-3">
        <Link to="/complaint" className="card p-4 text-center font-semibold text-lg text-white bg-primary">
          Submit Complaint
        </Link>
        <Link to="/track" className="card p-4 text-center font-semibold text-lg bg-white text-primary border border-primary">
          Track Complaint
        </Link>
      </div>

      <Link to="/awareness" className="card p-4 text-center text-base text-slate-700">
        Learn water saving tips and good practices
      </Link>
    </div>
  );
};

export default HomePage;
