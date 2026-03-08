import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiExclamationCircle } from 'react-icons/hi';
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
        console.error('Error fetching pump details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPump();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted">
      <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      <span className="font-bold text-sm">Loading pump info...</span>
    </div>
  );

  if (!pump) return (
    <div className="max-w-sm mx-auto card p-8 text-center grid gap-4 mt-6">
      <div className="h-14 w-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
        <HiExclamationCircle className="h-8 w-8" />
      </div>
      <div className="font-black text-ink text-lg">Pump Not Found</div>
      <p className="text-sm text-muted font-semibold">Make sure you scanned an official JalSankalp QR sticker.</p>
      <Link to="/" className="btn-ghost text-center">← Scan Again</Link>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start animate-slide-up">
      <PumpInfoCard
        name={pump.name}
        location={pump.location || 'Unknown'}
        status={pump.status}
        lastMaintenance={pump.created_at ? new Date(pump.created_at).toLocaleDateString('en-IN') : 'N/A'}
        qrId={pump.qr_code || id}
      />
      <div className="grid gap-4">
        <div className="card p-5 bg-primary/5 border-primary/10">
          <h3 className="font-extrabold text-ink text-base mb-1">Found the pump?</h3>
          <p className="text-sm text-muted font-semibold mb-4">
            If this pump is damaged, leaking, or not working, file an official grievance and we'll dispatch a technician.
          </p>
          <Link
            to="/complaint"
            state={{ pump_id: pump.id, pump_name: pump.name }}
            className="btn-secondary flex items-center justify-center gap-2 text-center"
          >
            <HiExclamationCircle className="h-5 w-5" />
            Report an Issue with this Pump
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PumpInfoPage;
