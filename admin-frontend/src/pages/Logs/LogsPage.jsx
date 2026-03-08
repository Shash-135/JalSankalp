import React, { useState, useEffect } from 'react';
import DataTable from '../../components/tables/DataTable';
import api from '../../services/api';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      // Create a mock date formatter helper
      const formatTime = (isoString) => {
        const d = new Date(isoString);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + d.toLocaleDateString();
      };

      // We'll hit a new endpoint if it exists, otherwise we'll gracefully fallback or map the data
      // For now, let's mock it using pumps/operators if no direct logs endpoint is ready in backend
      // But keeping with the prompt requirement: we EXPECT an endpoint or we simulate it visually for the DB structure
      // Call the newly created backend endpoint
      const res = await api.get('/admin/logs');

      const formattedLogs = res.data.map(log => ({
        id: log.id,
        operator: log.operator_name || 'Unknown Operator',
        pump: log.pump_name || 'Unknown Pump',
        rawAction: log.action.toUpperCase(),
        action: (
          <span className={`px-2 py-1 text-xs font-bold rounded-md ${
            log.action.toLowerCase() === 'start' ? 'bg-emerald-100 text-emerald-700' :
            log.action.toLowerCase() === 'stop' ? 'bg-rose-100 text-rose-700' :
            'bg-amber-100 text-amber-700'
          }`}>
            {log.action.toUpperCase()}
          </span>
        ),
        time: formatTime(log.time),
        duration: log.duration ? `${log.duration} mins` : '-'
      }));

      setLogs(formattedLogs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    let csv = 'Log ID,Operator,Pump Station,Action,Timestamp,Duration\n';
    logs.forEach(log => {
      const actionText = log.rawAction || 'UNKNOWN';
      csv += `"${log.id}","${log.operator}","${log.pump}","${actionText}","${log.time}","${log.duration}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'pump_logs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid gap-6">
      <div className="card-surface p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-sm text-slate-500">Security & Tracking</div>
          <h2 className="text-xl font-semibold text-slate-800">Operator & Pump Logs</h2>
          <p className="hidden md:block text-sm text-slate-500 mt-1">Review historical attendance and pump actuation times</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full md:w-auto mt-2 md:mt-0">
           <button onClick={fetchLogs} className="flex-1 sm:flex-none px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">Refresh</button>
           <button onClick={exportCSV} className="flex-1 sm:flex-none px-4 py-2 text-sm font-semibold rounded-xl bg-slate-800 text-white hover:bg-slate-700 shadow transition-colors">Export List</button>
        </div>
      </div>

      <DataTable
        title="Activity Ledger"
        description="Latest system actions"
        columns={[
          { key: 'id', label: 'Log ID' },
          { key: 'operator', label: 'Operator' },
          { key: 'pump', label: 'Pump Station' },
          { key: 'action', label: 'Action Taken' },
          { key: 'time', label: 'Timestamp' },
          { key: 'duration', label: 'Duration' },
        ]}
        data={logs}
      />
    </div>
  );
};

export default LogsPage;
