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
        const res = await api.get(`/pump/${id}`);
        setPump(res.data);
      } catch (err) {
        console.error("Error fetching pump details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPump();
  }, [id]);

  if (loading) return <div className="text-center p-10">Loading Pump Info...</div>;
  if (!pump) return <div className="text-center p-10 text-red-500">Pump not found or invalid QR code.</div>;

  return (
    <div className="grid gap-4">
      <PumpInfoCard
        name={pump.name}
        location={pump.location || 'Unknown'}
        status={pump.status}
        lastMaintenance={pump.created_at ? new Date(pump.created_at).toLocaleDateString() : 'N/A'}
        qrId={pump.qr_code || id}
      />
      <Link to="/complaint" className="button-primary text-center">
        Report an Issue
      </Link>
    </div>
  );
};

export default PumpInfoPage;
