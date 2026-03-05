import React from 'react';
import DashboardCard from '../../components/dashboard/DashboardCard';
import ChartCard from '../../components/dashboard/ChartCard';
import DataTable from '../../components/tables/DataTable';
import useDashboard from '../../hooks/useDashboard';

const DashboardPage = () => {
  const { cards, pumps, operators, complaints, usageChart, complaintDistribution } = useDashboard();

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <DashboardCard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartCard
            title="Daily Pump Usage"
            description="Volume pumped in kiloliters"
            type="bar"
            data={usageChart}
            options={{
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                y: { grid: { display: false }, ticks: { color: '#334155' } },
                x: { grid: { display: false }, ticks: { color: '#334155' } },
              },
            }}
          />
        </div>
        <ChartCard
          title="Complaint Distribution"
          description="By issue type"
          type="pie"
          data={complaintDistribution}
          options={{
            plugins: {
              legend: { position: 'bottom', labels: { usePointStyle: true } },
            },
          }}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DataTable
            title="Pump List"
            description="Priority overview"
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
        <DataTable
          title="Operator Roster"
          description="Current shifts"
          columns={[
            { key: 'name', label: 'Operator' },
            { key: 'region', label: 'Region' },
            { key: 'shift', label: 'Shift' },
            { key: 'status', label: 'Status' },
          ]}
          data={operators}
        />
      </div>

      <DataTable
        title="Complaint Queue"
        description="Recent tickets"
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

export default DashboardPage;
