import React from 'react';
import DataTable from '../../components/tables/DataTable';
import { useAppContext } from '../../context/AppContext';

const PumpsPage = () => {
  const { pumps } = useAppContext();

  return (
    <div className="grid gap-6">
      <div className="card-surface p-6 flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">Asset performance</div>
          <h2 className="text-xl font-semibold text-slate-800">Pump Management</h2>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-xl bg-secondary text-white font-semibold shadow">Add Pump</button>
          <button className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-700">Export</button>
        </div>
      </div>

      <DataTable
        title="All Pumps"
        description="Live telemetry snapshot"
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Name' },
          { key: 'location', label: 'Location' },
          { key: 'status', label: 'Status' },
          { key: 'uptime', label: 'Uptime' },
        ]}
        data={pumps}
      />
    </div>
  );
};

export default PumpsPage;
