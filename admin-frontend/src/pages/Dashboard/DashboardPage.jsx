import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../../components/dashboard/DashboardCard';
import ChartCard from '../../components/dashboard/ChartCard';
import DataTable from '../../components/tables/DataTable';
import useDashboard from '../../hooks/useDashboard';

const DashboardPage = () => {
  const { cards, pumps, operators, complaints, usageChart, complaintDistribution, searchQuery } = useDashboard();
  const navigate = useNavigate();

  const strSearch = (searchQuery || '').toLowerCase();
  
  const filteredPumps = useMemo(() => pumps.filter(p => 
    !strSearch || p.name?.toLowerCase().includes(strSearch) || p.location?.toLowerCase().includes(strSearch) || p.id?.toString().includes(strSearch)
  ), [pumps, strSearch]);

  const filteredOperators = useMemo(() => operators.filter(o => 
    !strSearch || o.name?.toLowerCase().includes(strSearch) || o.region?.toLowerCase().includes(strSearch)
  ), [operators, strSearch]);

  const filteredComplaints = useMemo(() => complaints.filter(c => 
    !strSearch || c.id?.toString().includes(strSearch) || c.villager_name?.toLowerCase().includes(strSearch) || c.pump_name?.toLowerCase().includes(strSearch) || c.issue_type?.toLowerCase().includes(strSearch) || c.status?.toLowerCase().includes(strSearch)
  ).slice(0, 5), [complaints, strSearch]); // Dashboard shows limited list

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">System Overview</h2>
          <p className="text-sm text-slate-500 mt-1">Live metrics from Gram Panchayat water pumps</p>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
            onViewAll={() => navigate('/pumps')}
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'name', label: 'Name' },
              { key: 'location', label: 'Location' },
              { key: 'status', label: 'Status' },
              { key: 'uptime', label: 'Uptime' },
            ]}
            data={filteredPumps.slice(0, 5)}
          />
        </div>
        <DataTable
          title="Operator Roster"
          description="Current shifts"
          onViewAll={() => navigate('/operators')}
          columns={[
            { key: 'name', label: 'Operator' },
            { key: 'region', label: 'Region' },
            { key: 'shift', label: 'Shift' },
            { key: 'status', label: 'Status' },
          ]}
          data={filteredOperators.slice(0, 5)}
        />
      </div>

      <DataTable
        title="Complaint Queue"
        description="Recent tickets"
        onViewAll={() => navigate('/complaints')}
        columns={[
          { key: 'id', label: 'Ticket' },
          { key: 'subject', label: 'Subject' },
          { key: 'village', label: 'Village' },
          { key: 'status', label: 'Status' },
          { key: 'logged', label: 'Logged' },
        ]}
        data={filteredComplaints.map(c => ({
          ...c,
          subject: c.issue_type,
          village: c.pump_name,
          logged: new Date(c.created_at).toLocaleDateString()
        }))}
      />
    </div>
  );
};

export default DashboardPage;
