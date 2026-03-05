import React from 'react';

const PumpInfoCard = ({ name, location, status, lastMaintenance, qrId }) => {
  return (
    <div className="card p-5 grid gap-2">
      <div className="text-sm text-slate-500">Pump ID: {qrId}</div>
      <div className="text-2xl font-bold text-slate-800">{name}</div>
      <div className="text-base text-slate-600">Location: {location}</div>
      <div className="text-base">
        <span className="font-semibold">Status:</span> {status}
      </div>
      <div className="text-base text-slate-600">Last checked: {lastMaintenance}</div>
    </div>
  );
};

export default PumpInfoCard;
