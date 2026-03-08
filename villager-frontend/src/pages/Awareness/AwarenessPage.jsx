import React from 'react';
import { HiLightBulb, HiPhone, HiClock } from 'react-icons/hi';
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
  'Emergency Helpline: 112',
];

const schedule = [
  'Morning Supply: 6:00 AM – 9:00 AM',
  'Evening Supply: 5:00 PM – 8:00 PM',
  'Maintenance Window: Tuesdays 12:00 PM – 4:00 PM',
];

const AwarenessPage = () => (
  <div className="grid gap-5 pb-4">
    <div className="page-header animate-slide-up grid gap-1.5">
      <div className="flex items-center gap-2 text-white/70 text-xs font-extrabold uppercase tracking-widest">
        <HiLightBulb className="h-4 w-4" />
        Awareness & Guidelines
      </div>
      <h2 className="text-xl md:text-2xl font-black text-white">Save Water, Stay Safe</h2>
      <p className="text-sm text-white/75 font-semibold">
        Official directives and information for all residents.
      </p>
    </div>

    {/* 3-column on large screens, 1 column on mobile */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <AwarenessCard title="Water Saving Tips"  points={tips}     icon={HiLightBulb} accent="border-l-success" />
      <AwarenessCard title="Emergency Contacts" points={contacts} icon={HiPhone}     accent="border-l-secondary" />
      <AwarenessCard title="Pump Working Hours" points={schedule} icon={HiClock}     accent="border-l-primary" />
    </div>
  </div>
);

export default AwarenessPage;
