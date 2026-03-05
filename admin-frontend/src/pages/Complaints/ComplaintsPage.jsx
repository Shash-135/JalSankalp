import React from 'react';
import DataTable from '../../components/tables/DataTable';
import { useAppContext } from '../../context/AppContext';

const ComplaintsPage = () => {
  const { complaints } = useAppContext();

  return (
    <div className="grid gap-6">
      <div className="card-surface p-6 flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">Citizen feedback</div>
          <h2 className="text-xl font-semibold text-slate-800">Complaint Management</h2>
        </div>
        <button className="px-4 py-2 rounded-xl bg-accent text-primary font-semibold shadow">New Ticket</button>
      </div>

      <DataTable
        title="Complaints"
        description="Recent submissions"
        columns={[
          { key: 'id', label: 'Ticket' },
          { key: 'subject', label: 'Subject' },
          { key: 'village', label: 'Village' },
          { key: 'status', label: 'Status' },
          { key: 'logged', label: 'Logged' },
        ]}
        data={complaints}
      />
    </div>
  );
};

export default ComplaintsPage;
