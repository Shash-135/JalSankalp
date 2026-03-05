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
  const { stats, pumps, operators, complaints, usageChart, complaintDistribution } = useAppContext();

  const cards = [
    {
      title: 'Total Pumps',
      value: stats.totalPumps,
      trend: 2.4,
      subtitle: 'Installed across Gram Panchayat',
      icon: <HiOutlineCubeTransparent className="h-6 w-6" />,
    },
    {
      title: 'Active Pumps',
      value: stats.activePumps,
      trend: 1.2,
      subtitle: 'Operational in last 24h',
      icon: <HiOutlineCheckCircle className="h-6 w-6" />,
    },
    {
      title: 'Inactive Pumps',
      value: stats.inactivePumps,
      trend: -0.6,
      subtitle: 'Needs maintenance check',
      icon: <HiOutlineExclamation className="h-6 w-6" />,
    },
    {
      title: 'Pending Complaints',
      value: stats.pendingComplaints,
      trend: 3.2,
      subtitle: 'Awaiting resolution',
      icon: <HiOutlineInboxIn className="h-6 w-6" />,
    },
    {
      title: 'Resolved Complaints',
      value: stats.resolvedComplaints,
      trend: 4.8,
      subtitle: 'Closed in last 30 days',
      icon: <HiOutlineTrendingUp className="h-6 w-6" />,
    },
  ];

  return { cards, pumps, operators, complaints, usageChart, complaintDistribution };
};

export default useDashboard;
