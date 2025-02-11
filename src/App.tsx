import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import Pricing from './components/Pricing';
import Itinerary from './components/itinerary/Itinerary';
import MapSection from './components/map/MapSection';
import EmailCapture from './components/EmailCapture';
import AuthProvider from './components/auth/AuthProvider';
import AdminRoute from './components/admin/AdminRoute';
import MembershipPortal from './components/portal/MembershipPortal';
import DueDiligenceChecklist from './components/resources/DueDiligenceChecklist';
import TaxBenefitsGuide from './components/resources/tax-guide/TaxBenefitsGuide';
import InvestmentCalculator from './components/resources/calculator/InvestmentCalculator';
import { LanguageProvider } from './lib/context/LanguageContext';

const HomePage = () => (
  <div className="min-h-screen bg-gray-50">
    <Hero />
    <Countdown />
    <Itinerary />
    <MapSection />
    <Pricing />
    <EmailCapture />
  </div>
);

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin/*" element={<AdminRoute />} />
            <Route path="/portal" element={<MembershipPortal />} />
            <Route path="/resources/checklist" element={<DueDiligenceChecklist />} />
            <Route path="/resources/tax-guide" element={<TaxBenefitsGuide />} />
            <Route path="/resources/calculator" element={<InvestmentCalculator />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}