import React, { useState } from 'react';
import DataTable from '../../components/tables/DataTable';
import { useAppContext } from '../../context/AppContext';
import ResolveComplaintModal from '../../components/forms/ResolveComplaintModal';

const ComplaintsPage = () => {
  const { complaints, areas, refreshData } = useAppContext();
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [filterType, setFilterType] = useState('all');

  const columns = [
    { key: 'id', label: 'Ticket' },
    { key: 'subject', label: 'Subject' },
    { key: 'village', label: 'Village' },
    { key: 'status', label: 'Status' },
    { key: 'logged', label: 'Logged' },
    { key: 'action', label: 'Action' }
  ];

  const filteredComplaints = complaints.filter(c => {
    if (filterType === 'all') return true;
    if (filterType === 'pending') return c.status === 'pending';
    if (filterType === 'resolved') return c.status === 'resolved';
    return true;
  });

  const enrichedComplaints = filteredComplaints.map(c => ({
    ...c,
    action: c.status !== 'resolved' && c.status !== 'Resolved' ? (
      <button 
        onClick={() => setSelectedComplaintId(c.id)} 
        className="text-xs bg-accent text-primary px-3 py-1 rounded-full font-bold hover:bg-opacity-80 transition"
      >
        Resolve
      </button>
    ) : (
      <span className="text-xs text-green-600 font-bold">Done</span>
    )
  }));

  return (
    <div className="grid gap-6">
      <div className="card-surface p-6 flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">Citizen feedback</div>
          <h2 className="text-xl font-semibold text-slate-800">Complaint Management</h2>
        </div>
        <div>
          <select 
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
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
