import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PumpInfoCard from '../../components/pump/PumpInfoCard.jsx';
import { pumps } from '../../utils/mockData.js';

const PumpInfoPage = () => {
  const { id } = useParams();
  const pump = pumps.find((p) => p.id === id) || pumps[0];

  return (
    <div className="grid gap-4">
      <PumpInfoCard
        name={pump.name}
        location={pump.location}
        status={pump.status}
        lastMaintenance={pump.lastMaintenance}
        qrId={pump.id}
      />
      <Link to="/complaint" className="button-primary text-center">
        Report an Issue
      </Link>
    </div>
  );
};

export default PumpInfoPage;
