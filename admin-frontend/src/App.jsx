import React, { Suspense, lazy } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';

// Lazy loading route components for code splitting
const PrivateRoute = lazy(() => import('./components/layout/PrivateRoute'));
const DashboardPage = lazy(() => import('./pages/Dashboard/DashboardPage'));
const PumpsPage = lazy(() => import('./pages/Pumps/PumpsPage'));
const OperatorsPage = lazy(() => import('./pages/Operators/OperatorsPage'));
const ComplaintsPage = lazy(() => import('./pages/Complaints/ComplaintsPage'));
const ReportsPage = lazy(() => import('./pages/Reports/ReportsPage'));
const LoginPage = lazy(() => import('./pages/Login/LoginPage'));
const ProfilePage = lazy(() => import('./pages/Profile/ProfilePage'));
const LogsPage = lazy(() => import('./pages/Logs/LogsPage'));

const PageLoader = () => (
  <div className="flex h-[50vh] w-full items-center justify-center">
    <div className="flex flex-col items-center gap-3 text-slate-400">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-primary"></div>
      <div className="text-sm font-medium animate-pulse">Loading module...</div>
    </div>
  </div>
);

const AppLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex bg-transparent w-full">
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8 grid gap-4 sm:gap-6 w-full max-w-[1600px] mx-auto">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Secure all dashboard routes with the PrivateRoute wrapper */}
      <Route element={<Suspense fallback={<PageLoader />}><PrivateRoute /></Suspense>}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pumps" element={<PumpsPage />} />
          <Route path="/operators" element={<OperatorsPage />} />
          <Route path="/complaints" element={<ComplaintsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/logs" element={<LogsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
