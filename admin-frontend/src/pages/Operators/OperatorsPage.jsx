import React, { useState, useMemo } from 'react';
import DataTable from '../../components/tables/DataTable';
import { useAppContext } from '../../context/AppContext';
import AddOperatorModal from '../../components/forms/AddOperatorModal';
import EditOperatorModal from '../../components/forms/EditOperatorModal';
import AssignedPumpsModal from '../../components/forms/AssignedPumpsModal';

const OperatorsPage = () => {
  const { operators, refreshData, searchQuery } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [editingOperator, setEditingOperator] = useState(null);
  const [viewingPumpsOperator, setViewingPumpsOperator] = useState(null);

  const strSearch = (searchQuery || '').toLowerCase();
  const searchFilteredOperators = useMemo(() => operators.filter(o => 
    !strSearch || 
    o.name?.toLowerCase().includes(strSearch) || 
    o.region?.toLowerCase().includes(strSearch) ||
    o.status?.toLowerCase().includes(strSearch)
  ), [operators, strSearch]);

  return (
    <div className="grid gap-6">
      <div className="card-surface p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-sm text-slate-500">Shift allocation</div>
          <h2 className="text-xl font-semibold text-slate-800">Operator Management</h2>
        </div>
        <button onClick={() => setShowModal(true)} className="w-full md:w-auto px-4 py-2 rounded-xl bg-primary text-white font-semibold shadow hover:bg-primary/90 mt-2 md:mt-0">Add Operator</button>
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
        data={searchFilteredOperators}
        renderActions={(row) => (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setViewingPumpsOperator(row)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
            >
              View Pumps
            </button>
            <button 
              onClick={() => setEditingOperator(row)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        )}
      />

      {showModal && (
        <AddOperatorModal 
          onClose={() => setShowModal(false)}
          onSaved={refreshData}
        />
      )}

      {editingOperator && (
        <EditOperatorModal 
          operator={editingOperator}
          onClose={() => setEditingOperator(null)}
          onSaved={refreshData}
        />
      )}

      {viewingPumpsOperator && (
        <AssignedPumpsModal
          operator={viewingPumpsOperator}
          onClose={() => setViewingPumpsOperator(null)}
        />
      )}
    </div>
  );
};

export default OperatorsPage;
