import React, { useState, useMemo } from 'react';
import DataTable from '../../components/tables/DataTable';
import { useAppContext } from '../../context/AppContext';
import ResolveComplaintModal from '../../components/forms/ResolveComplaintModal';

import api from '../../services/api';

// Derive backend base from the configured Axios baseURL (removes trailing /api)
const BASE = api.defaults.baseURL.replace(/\/api$/, '');

const ComplaintsPage = () => {
  const { complaints, refreshData, searchQuery } = useAppContext();
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [previewImg, setPreviewImg] = useState(null);

  const strSearch = (searchQuery || '').toLowerCase();

  const filteredComplaints = useMemo(() => complaints.filter(c => {
    // Dropdown match
    const matchesType = filterType === 'all' || c.status === filterType;
    if (!matchesType) return false;

    // Search text match
    if (!strSearch) return true;
    return c.id?.toString().includes(strSearch) || 
           c.villager_name?.toLowerCase().includes(strSearch) || 
           c.pump_name?.toLowerCase().includes(strSearch) || 
           c.issue_type?.toLowerCase().includes(strSearch) || 
           c.status?.toLowerCase().includes(strSearch);
  }), [complaints, filterType, strSearch]);

  const enrichedComplaints = filteredComplaints.map(c => ({
    ...c,
    villager: c.villager_name || '—',
    pump: c.pump_name || '—',
    type: c.issue_type || '—',
    photo: c.photo_url ? (
      <img
        src={`${BASE}${c.photo_url}`}
        alt="Villager photo"
        className="w-12 h-12 object-cover rounded-lg cursor-pointer border border-slate-200 hover:scale-105 transition-transform"
        onClick={() => setPreviewImg(`${BASE}${c.photo_url}`)}
      />
    ) : <span className="text-slate-300 text-xs">No photo</span>,
    action: c.status !== 'resolved' ? (
      <button 
        onClick={() => setSelectedComplaintId(c.id)} 
        className="text-xs bg-accent text-primary px-3 py-1 rounded-full font-bold hover:bg-opacity-80 transition"
      >
        Resolve
      </button>
    ) : (
      <span className="text-xs text-green-600 font-bold">✓ Done</span>
    )
  }));

  const columns = [
    { key: 'id', label: '#' },
    { key: 'villager', label: 'Villager' },
    { key: 'pump', label: 'Pump' },
    { key: 'type', label: 'Issue' },
    { key: 'photo', label: 'Photo' },
    { key: 'status', label: 'Status' },
    { key: 'action', label: 'Action' },
  ];

  return (
    <div className="grid gap-6">
      <div className="card-surface p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-sm text-slate-500">Citizen feedback</div>
          <h2 className="text-xl font-semibold text-slate-800">Complaint Management</h2>
        </div>
        <div className="w-full md:w-auto mt-2 md:mt-0">
          <select 
            className="w-full md:w-auto px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Complaints</option>
            <option value="pending">Pending Only</option>
            <option value="resolved">Resolved Only</option>
          </select>
        </div>
      </div>

      <DataTable
        title="Complaints"
        description="Recent submissions"
        columns={columns}
        data={enrichedComplaints}
      />

      {/* Full-size photo preview */}
      {previewImg && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setPreviewImg(null)}>
          <img src={previewImg} alt="Full size" className="max-w-full max-h-full rounded-xl shadow-2xl" />
          <div className="absolute top-4 right-4 text-white text-2xl cursor-pointer">✕</div>
        </div>
      )}

      {selectedComplaintId && (
        <ResolveComplaintModal
          complaintId={selectedComplaintId}
          onClose={() => setSelectedComplaintId(null)}
          onSaved={refreshData}
        />
      )}
    </div>
  );
};

export default ComplaintsPage;
