import React from 'react';

const QRScanner = ({ onScan }) => {
  const handleScan = () => {
    // Placeholder: simulate scanning a QR code that contains pump ID
    onScan?.({ pumpId: 'P-014', name: 'Community Pump', location: 'Ward 4' });
  };

  return (
    <div className="card p-5 grid gap-3 text-center">
      <div className="text-lg font-bold text-slate-800">Scan Pump QR</div>
      <p className="text-sm text-slate-600">Point your camera at the QR sticker on the pump.</p>
      <button className="button-primary" onClick={handleScan}>Start Scan</button>
      <div className="text-xs text-slate-500">Camera-based scanning can be integrated later.</div>
    </div>
  );
};

export default QRScanner;
