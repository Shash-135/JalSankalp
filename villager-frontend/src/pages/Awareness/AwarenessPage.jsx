import React from 'react';
import AwarenessCard from '../../components/ui/AwarenessCard.jsx';

const tips = [
  'Close taps fully after use to avoid drips.',
  'Report leaks immediately using the complaint form.',
  'Use stored water for plants and cleaning where possible.',
  'Keep the pump area clean to avoid contamination.',
  'Do not tamper with electrical panels or valves.',
];

const contacts = [
  'Gram Panchayat Office: +91 98765 43210',
  'Water Maintenance Dept: +91 98765 43211',
  'Emergency Helpline: 112'
];

const schedule = [
  'Morning Supply: 6:00 AM - 9:00 AM',
  'Evening Supply: 5:00 PM - 8:00 PM',
  'Maintenance Window: Tuesdays 12:00 PM - 4:00 PM'
];

const AwarenessPage = () => {
  return (
    <div className="grid gap-6 pb-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 text-center">
        <div className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Awareness & Guidelines</div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Save Water, Stay Safe</h2>
        <p className="text-sm font-medium text-slate-500">Official directives and information for all residents.</p>
      </div>
      <AwarenessCard title="Water Saving Tips" points={tips} />
      <AwarenessCard title="Emergency Contacts" points={contacts} />
      <AwarenessCard title="Pump Working Hours" points={schedule} />
    </div>
  );
};

export default AwarenessPage;
