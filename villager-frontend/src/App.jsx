import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Header, { BottomNav } from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import HomePage from './pages/Home/HomePage.jsx';
import PumpInfoPage from './pages/PumpInfo/PumpInfoPage.jsx';
import ComplaintPage from './pages/Complaint/ComplaintPage.jsx';
import TrackComplaintPage from './pages/TrackComplaint/TrackComplaintPage.jsx';
import FeedbackPage from './pages/Feedback/FeedbackPage.jsx';
import AwarenessPage from './pages/Awareness/AwarenessPage.jsx';

const AppShell = () => (
  <div className="min-h-screen bg-bg flex flex-col">
    <Header />
    {/* Responsive content container: centered, max-width, full-bleed on small screens */}
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-8 animate-fade-in">
      <Outlet />
    </main>
    <Footer />
    <BottomNav />
  </div>
);

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/pump/:id" element={<PumpInfoPage />} />
        <Route path="/complaint" element={<ComplaintPage />} />
        <Route path="/track" element={<TrackComplaintPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/awareness" element={<AwarenessPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
