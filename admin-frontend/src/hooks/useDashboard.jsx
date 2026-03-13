import React from 'react';
import { useAppContext } from '../context/AppContext';
import {
  HiOutlineCubeTransparent,
  HiOutlineCheckCircle,
  HiOutlineExclamation,
  HiOutlineInboxIn,
  HiOutlineTrendingUp,
} from 'react-icons/hi';

const useDashboard = () => {
  const { stats, pumps, operators, complaints, usageChart, complaintDistribution, operatorPerformanceChart, searchQuery } = useAppContext();

  const cards = [
    {
      title: 'Total Pumps',
      value: stats.totalPumps,
      subtitle: 'Installed across Gram Panchayat',
      icon: <HiOutlineCubeTransparent className="h-6 w-6" />,
    },
    {
      title: 'Active Pumps',
      value: stats.activePumps,
      subtitle: 'Operational in last 24h',
      icon: <HiOutlineCheckCircle className="h-6 w-6" />,
    },
    {
      title: 'Inactive Pumps',
      value: stats.inactivePumps,
      subtitle: 'Needs maintenance check',
      icon: <HiOutlineExclamation className="h-6 w-6" />,
    },
    {
      title: 'Pending Complaints',
      value: stats.pendingComplaints,
      subtitle: 'Awaiting resolution',
      icon: <HiOutlineInboxIn className="h-6 w-6" />,
    },
    {
      title: 'Resolved Complaints',
      value: stats.resolvedComplaints,
      subtitle: 'Closed in last 30 days',
      icon: <HiOutlineTrendingUp className="h-6 w-6" />,
    },
  ];

  // Map raw rows to the shape the dashboard summary table expects
  const dashboardComplaints = complaints.slice(0, 10).map(c => ({
    id: c.id,
    subject: c.issue_type || '—',
    village: c.villager_name || c.location || '—',
    status: c.status,
    logged: c.created_at ? new Date(c.created_at).toLocaleDateString('en-IN') : '—',
  }));

  return { cards, pumps, operators, complaints: dashboardComplaints, usageChart, complaintDistribution, searchQuery };
};

export default useDashboard;
