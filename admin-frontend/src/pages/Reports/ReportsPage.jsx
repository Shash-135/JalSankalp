import React from 'react';
import ChartCard from '../../components/dashboard/ChartCard';
import { useAppContext } from '../../context/AppContext';

const ReportsPage = () => {
  const { usageChart, complaintDistribution, operatorPerformanceChart } = useAppContext();

  const handleExport = (reportName) => {
    const csvContent = `Report Type: ${reportName}\nGenerated on: ${new Date().toLocaleString()}\n\nData would appear here in a production environment.`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${reportName.toLowerCase().replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid gap-6">
      <div className="card-surface p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-sm text-slate-500">Analytics and insights</div>
          <h2 className="text-xl font-semibold text-slate-800">Reports &amp; Analytics</h2>
        </div>
        <div className="hidden md:block text-sm text-slate-500 max-w-sm text-right">
          Export summaries for the Gram Panchayat meetings and daily briefings.
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <ChartCard
          title="Weekly Volume Trend"
          description="Kiloliters delivered"
          type="bar"
          data={usageChart}
          options={{ plugins: { legend: { display: false } } }}
        />
        <ChartCard
          title="Complaints by Category"
          description="Issue proportions"
          type="pie"
          data={complaintDistribution}
          options={{ plugins: { legend: { position: 'right' } } }}
        />
        <ChartCard
          title="Operator Performance"
          description="Total operations logged"
          type="bar"
          data={operatorPerformanceChart}
          options={{ plugins: { legend: { display: false } } }}
        />
      </div>

      <div className="card-surface p-6 grid gap-3">
        <div className="section-title">One-click Exports</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {['Daily log', 'Weekly briefing', 'Monthly summary', 'Downtime report', 'Complaint audit', 'Operator roster'].map(
            (item) => (
              <button
                key={item}
                onClick={() => handleExport(item)}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-primary/40 hover:shadow-sm text-sm font-semibold text-slate-700 transition group"
              >
                <span>{item}</span>
                <span className="text-primary opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all">-&gt;</span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
