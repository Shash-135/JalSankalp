import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import QRScanner from '../../components/ui/QRScanner.jsx';
import api from '../../services/api.js';

const HomePage = () => {
  const navigate = useNavigate();
  const [scanError, setScanError] = useState(null);

  const handleQRScan = async (data) => {
    try {
      setScanError(null);
      // Directly look up the pump by its QR code value
      const res = await api.get(`/pumps/qr/${encodeURIComponent(data.qr_code)}`);
      navigate(`/pump/${res.data.id}`);
    } catch (err) {
      setScanError(err.response?.status === 404
        ? `QR Code not found. Make sure you scan an official JalSankalp pump sticker.`
        : 'Failed to verify QR Code. Check connection.'
      );
    }
  };

  return (
    <div className="grid gap-6 pb-6">
      <div className="bg-white p-6 rounded-lg border-l-4 border-primary shadow-sm grid gap-2">
        <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-secondary"></span> Live Services
        </div>
        <h1 className="text-2xl font-black text-slate-900 leading-tight">Water Pump Support Portal</h1>
        <p className="text-base text-slate-600 font-medium leading-relaxed">
          Scan the official QR code located on any public JalSankalp pump to view maintenance logs, file a repair grievance, and track your request in real-time.
        </p>
      </div>

      {scanError && <div className="p-3 bg-red-100 text-red-700 font-bold rounded text-center text-sm">{scanError}</div>}
      <QRScanner onScan={handleQRScan} />

      <div className="grid md:grid-cols-2 gap-4">
        <Link to="/complaint" className="card p-5 text-center flex flex-col items-center justify-center border-t-4 border-t-primary hover:bg-slate-50 transition-colors">
          <div className="text-primary text-3xl mb-2">⚠</div>
          <div className="font-bold text-lg text-slate-900 uppercase">Submit Grievance</div>
          <div className="text-sm text-slate-500 font-medium mt-1">Report a broken pump or leak</div>
        </Link>
        <Link to="/track" className="card p-5 text-center flex flex-col items-center justify-center border-t-4 border-t-secondary hover:bg-slate-50 transition-colors">
          <div className="text-secondary text-3xl mb-2">◷</div>
          <div className="font-bold text-lg text-slate-900 uppercase">Track Request</div>
          <div className="text-sm text-slate-500 font-medium mt-1">Check grievance status</div>
        </Link>
      </div>

      <Link to="/awareness" className="card p-4 text-center text-sm font-bold text-primary uppercase hover:bg-slate-50 transition-colors">
        View Water Conservation Directives →
      </Link>
    </div>
  );
};

export default HomePage;
