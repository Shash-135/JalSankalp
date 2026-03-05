import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import DashboardPage from './pages/Dashboard/DashboardPage';
import PumpsPage from './pages/Pumps/PumpsPage';
import OperatorsPage from './pages/Operators/OperatorsPage';
import ComplaintsPage from './pages/Complaints/ComplaintsPage';
import ReportsPage from './pages/Reports/ReportsPage';
import LoginPage from './pages/Login/LoginPage';
import ProfilePage from './pages/Profile/ProfilePage';

const AppLayout = () => (
  <div className="min-h-screen flex bg-slate-50">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <Navbar />
      <main className="p-6 lg:p-8 grid gap-6">
        <Outlet />
      </main>
    </div>
  </div>
);

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/pumps" element={<PumpsPage />} />
        <Route path="/operators" element={<OperatorsPage />} />
        <Route path="/complaints" element={<ComplaintsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
