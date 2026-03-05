import React from 'react';
import ChartCard from '../../components/dashboard/ChartCard';
import { useAppContext } from '../../context/AppContext';

const ReportsPage = () => {
  const { usageChart, complaintDistribution } = useAppContext();

  return (
    <div className="grid gap-6">
      <div className="card-surface p-6">
        <div className="text-sm text-slate-500">Analytics and insights</div>
        <h2 className="text-xl font-semibold text-slate-800">Reports & Analytics</h2>
        <p className="text-sm text-slate-500 mt-2">
          Export summaries for the Gram Panchayat meetings and daily briefings.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
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
      </div>

      <div className="card-surface p-6 grid gap-3">
        <div className="section-title">One-click Exports</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {['Daily log', 'Weekly briefing', 'Monthly summary', 'Downtime report', 'Complaint audit', 'Operator roster'].map(
            (item) => (
              <button
                key={item}
                className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 hover:border-primary/40 hover:shadow-sm text-sm font-semibold text-slate-700"
              >
                {item}
                <span className="text-primary">&gt;</span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
