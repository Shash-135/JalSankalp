import React from 'react';
import DataTable from '../../components/tables/DataTable';
import { useAppContext } from '../../context/AppContext';

const OperatorsPage = () => {
  const { operators } = useAppContext();

  return (
    <div className="grid gap-6">
      <div className="card-surface p-6 flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">Shift allocation</div>
          <h2 className="text-xl font-semibold text-slate-800">Operator Management</h2>
        </div>
        <button className="px-4 py-2 rounded-xl bg-primary text-white font-semibold shadow">Add Operator</button>
      </div>

      <DataTable
        title="Operator List"
        description="On-duty staff"
        columns={[
          { key: 'name', label: 'Operator' },
          { key: 'region', label: 'Region' },
          { key: 'shift', label: 'Shift' },
          { key: 'status', label: 'Status' },
        ]}
        data={operators}
      />
    </div>
  );
};

export default OperatorsPage;
