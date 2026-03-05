import React, { createContext, useContext, useMemo } from 'react';
import { stats, pumps, operators, complaints, usageChart, complaintDistribution } from '../utils/mockData';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const value = useMemo(
    () => ({
      stats,
      pumps,
      operators,
      complaints,
      usageChart,
      complaintDistribution,
    }),
    []
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};
