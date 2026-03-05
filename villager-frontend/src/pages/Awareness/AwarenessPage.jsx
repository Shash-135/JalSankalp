import React from 'react';
import AwarenessCard from '../../components/ui/AwarenessCard.jsx';

const tips = [
  'Close taps fully after use to avoid drips.',
  'Report leaks immediately using the complaint form.',
  'Use stored water for plants and cleaning where possible.',
  'Keep the pump area clean to avoid contamination.',
  'Do not tamper with electrical panels or valves.',
];

const AwarenessPage = () => {
  return (
    <div className="grid gap-4">
      <div className="card p-5 text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-primary">Awareness</div>
        <h2 className="text-xl font-bold text-slate-800">Save Water, Stay Safe</h2>
        <p className="text-base text-slate-600">Simple tips for every villager.</p>
      </div>
      <AwarenessCard title="Water Saving Tips" points={tips} />
    </div>
  );
};

export default AwarenessPage;
