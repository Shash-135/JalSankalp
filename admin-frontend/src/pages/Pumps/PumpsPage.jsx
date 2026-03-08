import React, { useState, useMemo } from 'react';
import DataTable from '../../components/tables/DataTable';
import { useAppContext } from '../../context/AppContext';
import AddPumpModal from '../../components/forms/AddPumpModal';
import AddAreaModal from '../../components/forms/AddAreaModal';
import EditPumpModal from '../../components/forms/EditPumpModal';
import ViewQRCodeModal from '../../components/forms/ViewQRCodeModal';

const PumpsPage = () => {
  const { pumps, refreshData, searchQuery } = useAppContext();
  const [showPumpModal, setShowPumpModal] = useState(false);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [editingPump, setEditingPump] = useState(null);
  const [viewingQRFor, setViewingQRFor] = useState(null);

  const strSearch = (searchQuery || '').toLowerCase();
  const searchFilteredPumps = useMemo(() => pumps.filter(p => 
    !strSearch || 
    p.name?.toLowerCase().includes(strSearch) || 
    p.location?.toLowerCase().includes(strSearch) || 
    p.id?.toString().includes(strSearch) ||
    p.status?.toLowerCase().includes(strSearch)
  ), [pumps, strSearch]);

  return (
    <div className="grid gap-6">
      <div className="card-surface p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-sm text-slate-500">Asset performance</div>
          <h2 className="text-xl font-semibold text-slate-800">Pump & Area Management</h2>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full md:w-auto mt-2 md:mt-0">
          <button onClick={() => setShowAreaModal(true)} className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold shadow-sm hover:bg-slate-200">Add Area</button>
          <button onClick={() => setShowPumpModal(true)} className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-secondary text-white font-semibold shadow hover:bg-secondary/90">Add Pump</button>
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
        data={searchFilteredPumps}
        renderActions={(row) => (
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => setViewingQRFor(row)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
            >
              QR Code
            </button>
            <button 
              onClick={() => setEditingPump(row)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              Edit
            </button>
          </div>
        )}
      />

      {showPumpModal && (
        <AddPumpModal 
          onClose={() => setShowPumpModal(false)} 
          onSaved={refreshData} 
        />
      )}
      
      {showAreaModal && (
        <AddAreaModal 
          onClose={() => setShowAreaModal(false)} 
          onSaved={refreshData} 
        />
      )}

      {editingPump && (
        <EditPumpModal 
          pump={editingPump}
          onClose={() => setEditingPump(null)}
          onSaved={refreshData}
        />
      )}

      {viewingQRFor && (
        <ViewQRCodeModal 
          pump={viewingQRFor}
          onClose={() => setViewingQRFor(null)}
        />
      )}
    </div>
  );
};

export default PumpsPage;
