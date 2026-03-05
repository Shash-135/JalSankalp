import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import HomePage from './pages/Home/HomePage.jsx';
import PumpInfoPage from './pages/PumpInfo/PumpInfoPage.jsx';
import ComplaintPage from './pages/Complaint/ComplaintPage.jsx';
import TrackComplaintPage from './pages/TrackComplaint/TrackComplaintPage.jsx';
import FeedbackPage from './pages/Feedback/FeedbackPage.jsx';
import AwarenessPage from './pages/Awareness/AwarenessPage.jsx';

const AppShell = () => (
  <div className="min-h-screen flex flex-col bg-bg">
    <Header />
    <main className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full">
      <Outlet />
    </main>
    <Footer />
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
