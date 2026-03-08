import React, { useState, useEffect } from 'react';
import { HiX, HiOutlineLocationMarker } from 'react-icons/hi';
import api from '../../services/api';

const AssignedPumpsModal = ({ operator, onClose }) => {
  const [pumps, setPumps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignedPumps = async () => {
      try {
        const res = await api.get(`/operator/${operator.id}/pumps`);
        setPumps(res.data);
      } catch (err) {
        console.error("Failed to load assigned pumps", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignedPumps();
  }, [operator.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Assigned Pumps</h3>
            <p className="text-sm text-slate-500 mt-1">{operator.name}'s responsibilities</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : pumps.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No pumps are currently assigned to this operator.
            </div>
          ) : (
            <div className="space-y-4">
              {pumps.map((pump) => (
                <div key={pump.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-primary/20 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <HiOutlineLocationMarker className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">{pump.name}</div>
                      <div className="text-sm text-slate-500 mt-0.5">ID: {pump.id} • QR: {pump.qr_code.substring(0, 10)}...</div>
                    </div>
                  </div>
                  <div>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                      pump.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {pump.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignedPumpsModal;
