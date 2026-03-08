import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import api from '../services/api';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [data, setData] = useState({
    stats: { totalPumps: 0, activePumps: 0, inactivePumps: 0, pendingComplaints: 0, resolvedComplaints: 0 },
    pumps: [],
    operators: [],
    complaints: [],
    areas: [],
    usageChart: { labels: [], datasets: [] },
    complaintDistribution: { labels: [], datasets: [] },
    operatorPerformanceChart: { labels: [], datasets: [] },
    adminUser: null
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [pumpsRes, opsRes, compsRes, usageRes, distRes, areasRes, operatorPerfRes, adminRes] = await Promise.all([
        api.get('/pumps').catch(() => ({ data: [] })),
        api.get('/operator').catch(() => ({ data: [] })),
        api.get('/complaints').catch(() => ({ data: [] })),
        api.get('/reports/pump-usage').catch(() => ({ data: [] })),
        api.get('/reports/complaints').catch(() => ({ data: { summary: {}, breakdownByType: [] } })),
        api.get('/areas').catch(() => ({ data: [] })),
        api.get('/reports/operator-performance').catch(() => ({ data: [] })),
        api.get('/admin/me').catch(() => ({ data: null }))
      ]);

      const pumps = pumpsRes.data;
      const operators = opsRes.data;
      const complaints = compsRes.data;
      const areas = areasRes.data;
      const adminUser = adminRes.data;
      
      const activePumps = pumps.filter(p => p.status === 'active').length;
      const pendingComplaints = complaints.filter(c => c.status === 'pending').length;
      const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;
      const inactivePumps = pumps.length - activePumps;

      const usageData = usageRes.data || [];
      const usageChart = {
        labels: usageData.map(u => u.name),
        datasets: [{
          label: 'Total Pump Usage (mins)',
          data: usageData.map(u => u.total_duration_minutes || 0),
          backgroundColor: '#2563eb',
          borderRadius: 12,
        }]
      };

      const distData = distRes.data?.breakdownByType || [];
      const complaintDistribution = {
        labels: distData.map(d => d.type),
        datasets: [{
          label: 'Complaints',
          data: distData.map(d => d.count),
          backgroundColor: ['#1e3a8a', '#0f766e', '#38bdf8', '#f59e0b', '#ef4444'],
          borderWidth: 0,
        }]
      };

      const perfData = operatorPerfRes.data || [];
      const operatorPerformanceChart = {
        labels: perfData.map(o => o.name),
        datasets: [{
          label: 'Operations Logged',
          data: perfData.map(o => o.logs_submitted || 0),
          backgroundColor: '#0f766e',
          borderRadius: 8,
        }]
      };

      setData({
        stats: { totalPumps: pumps.length, activePumps, inactivePumps, pendingComplaints, resolvedComplaints },
        // Keep full raw objects so all pages get every field they need
        pumps: pumps.map(p => ({ ...p, uptime: 'N/A' })),
        operators: operators.map(o => ({ ...o, shift: 'Standard' })),
        complaints: complaints, // raw rows — photo_url, villager_name, pump_name etc. all preserved
        areas,
        usageChart,
        complaintDistribution,
        operatorPerformanceChart,
        adminUser
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const contextValue = useMemo(() => ({
    ...data,
    loading,
    refreshData,
    searchQuery,
    setSearchQuery
  }), [data, loading, refreshData, searchQuery]);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};
