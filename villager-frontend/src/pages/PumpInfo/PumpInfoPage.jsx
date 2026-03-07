import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import PumpInfoCard from '../../components/pump/PumpInfoCard.jsx';

const PumpInfoPage = () => {
  const { id } = useParams();
  const [pump, setPump] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPump = async () => {
      try {
        const res = await api.get(`/pumps/${id}`);
        setPump(res.data);
      } catch (err) {
        console.error("Error fetching pump details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPump();
  }, [id]);

  if (loading) return <div className="text-center p-10 text-slate-500 font-semibold">Loading Pump Info...</div>;
  if (!pump) return (
    <div className="text-center p-10">
      <div className="text-red-500 font-bold text-lg mb-4">Pump not found.</div>
      <Link to="/" className="button-primary">← Scan Again</Link>
    </div>
  );

  return (
    <div className="grid gap-4">
      <PumpInfoCard
        name={pump.name}
        location={pump.location || 'Unknown'}
        status={pump.status}
        lastMaintenance={pump.created_at ? new Date(pump.created_at).toLocaleDateString() : 'N/A'}
        qrId={pump.qr_code || id}
      />
      <Link
        to="/complaint"
        state={{ pump_id: pump.id, pump_name: pump.name }}
        className="button-primary text-center block"
      >
        ⚠ Report an Issue with this Pump
      </Link>
    </div>
  );
};

export default PumpInfoPage;
