import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { Loader } from './components/Loader';

// Pages Import
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { Analytics } from './pages/Analytics';
import { Wallet } from './pages/Wallet';
import { TrustScore } from './pages/TrustScore';
import { Marketplace } from './pages/Marketplace';
import { Certificates } from './pages/Certificates';
import { AIAssistant } from './pages/AIAssistant';
import { ESGReports } from './pages/ESGReports';
import { Leaderboard } from './pages/Leaderboard';
import { Settings } from './pages/Settings';
import { AdminPortal } from './pages/AdminPortal';

import { useStore } from './store/useStore';

import { useEffect } from 'react';

export const App: React.FC = () => {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const initializeStore = useStore((state) => state.initializeStore);

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  if (!loadingComplete) {
    return <Loader onComplete={() => setLoadingComplete(true)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Layout wrapper wrapping all routes */}
        <Route element={<RootLayout />}>
          {/* Public Landing Hub */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Guest Auth login card */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Secured App Routes */}
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/analytics"
            element={isAuthenticated ? <Analytics /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/wallet"
            element={isAuthenticated ? <Wallet /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/trust-score"
            element={isAuthenticated ? <TrustScore /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/marketplace"
            element={isAuthenticated ? <Marketplace /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/certificates"
            element={isAuthenticated ? <Certificates /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/ai-assistant"
            element={isAuthenticated ? <AIAssistant /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/esg-reports"
            element={isAuthenticated ? <ESGReports /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/leaderboard"
            element={isAuthenticated ? <Leaderboard /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/settings"
            element={isAuthenticated ? <Settings /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/admin"
            element={isAuthenticated ? <AdminPortal /> : <Navigate to="/auth" replace />}
          />

          {/* Fallback route redirection */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
