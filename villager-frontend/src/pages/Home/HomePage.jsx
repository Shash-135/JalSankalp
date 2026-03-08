import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiExclamationCircle, HiRefresh, HiLightBulb, HiQrcode } from 'react-icons/hi';
import QRScanner from '../../components/ui/QRScanner.jsx';
import api from '../../services/api.js';

const ActionCard = ({ to, icon: Icon, title, subtitle, accent }) => (
  <Link
    to={to}
    className={`card p-5 flex items-center gap-4 hover:shadow-lift active:scale-[.99] transition-all duration-200 border-l-4 ${accent}`}
  >
    <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <div className="font-extrabold text-ink text-base leading-tight">{title}</div>
      <div className="text-xs text-muted font-semibold mt-0.5">{subtitle}</div>
    </div>
    <div className="ml-auto text-slate-300 text-lg">›</div>
  </Link>
);

const HomePage = () => {
  const navigate = useNavigate();
  const [scanError, setScanError] = useState(null);

  const handleQRScan = async (data) => {
    try {
      setScanError(null);
      const res = await api.get(`/pumps/qr/${encodeURIComponent(data.qr_code)}`);
      navigate(`/pump/${res.data.id}`);
    } catch (err) {
      setScanError(
        err.response?.status === 404
          ? 'QR Code not found. Scan an official JalSankalp pump sticker.'
          : 'Failed to verify QR Code. Check your internet connection.'
      );
    }
  };

  return (
    <div className="grid gap-6 pb-4">
      {/* Hero — full width on desktop */}
      <div className="page-header grid gap-2 animate-slide-up">
        <div className="flex items-center gap-2 text-white/70 text-xs font-extrabold uppercase tracking-widest">
          <span className="h-1.5 w-1.5 rounded-full bg-secondary inline-block"></span>
          Live Services
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">
          Water Pump Support Portal
        </h1>
        <p className="text-sm text-white/75 font-semibold leading-relaxed max-w-xl">
          Scan the QR code on any public JalSankalp pump to file a grievance or view its status in real-time.
        </p>
      </div>

      {/* Two-column on desktop: QR scanner left, action cards right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* QR Scanner */}
        <div className="card p-5 grid gap-3 h-fit">
          <div className="flex items-center gap-2">
            <HiQrcode className="h-5 w-5 text-primary" />
            <span className="font-extrabold text-ink text-sm uppercase tracking-wider">Scan Pump QR Code</span>
          </div>
          {scanError && <div className="error-banner">{scanError}</div>}
          <QRScanner onScan={handleQRScan} />
        </div>

        {/* Action Cards */}
        <div className="grid gap-3 content-start">
          <ActionCard
            to="/complaint"
            icon={HiExclamationCircle}
            title="Submit Grievance"
            subtitle="Report a broken pump, leak, or supply issue"
            accent="border-l-secondary"
          />
          <ActionCard
            to="/track"
            icon={HiRefresh}
            title="Track Request"
            subtitle="Check the live status of your complaint"
            accent="border-l-primary"
          />
          <ActionCard
            to="/awareness"
            icon={HiLightBulb}
            title="Water Conservation Tips"
            subtitle="Official directives & schedules for residents"
            accent="border-l-success"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
