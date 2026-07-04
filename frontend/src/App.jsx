import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';

// Layout & Components
import Layout from './components/Layout';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AlertsPage from './pages/AlertsPage';
import CentresPage from './pages/CentresPage';
import CentreProfilePage from './pages/CentreProfilePage';
import StockPage from './pages/StockPage';
import FootfallPage from './pages/FootfallPage';
import AttendancePage from './pages/AttendancePage';
import AshaPage from './pages/AshaPage';
import LabsPage from './pages/LabsPage';
import AgentsPage from './pages/AgentsPage';
import CommunityImpactPage from './pages/CommunityImpactPage';
import PublicHealthMapPage from './pages/PublicHealthMapPage';
import CostAnalyticsPage from './pages/CostAnalyticsPage';

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { userRole } = useApp();
  if (!userRole) {
    return <Navigate to="/" replace />;
  }
  return children;
}

// Role restriction for ASHA Workers (only Dashboard and Asha pages allowed)
function AshaRoleGuard({ children, path }) {
  const { userRole } = useApp();
  if (userRole === 'ASHA Worker' && path !== '/dashboard' && path !== '/asha') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/public/map" element={<PublicHealthMapPage />} />
        <Route path="/map" element={
          <ProtectedRoute>
            <AshaRoleGuard path="/map">
              <Layout>
                <PublicHealthMapPage />
              </Layout>
            </AshaRoleGuard>
          </ProtectedRoute>
        } />

        {/* Protected Dashboard and Panel Routes wrapped in main Layout */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/alerts" element={
          <ProtectedRoute>
            <AshaRoleGuard path="/alerts">
              <Layout>
                <AlertsPage />
              </Layout>
            </AshaRoleGuard>
          </ProtectedRoute>
        } />

        <Route path="/centres" element={
          <ProtectedRoute>
            <AshaRoleGuard path="/centres">
              <Layout>
                <CentresPage />
              </Layout>
            </AshaRoleGuard>
          </ProtectedRoute>
        } />

        <Route path="/centres/:id" element={
          <ProtectedRoute>
            <AshaRoleGuard path="/centres/:id">
              <Layout>
                <CentreProfilePage />
              </Layout>
            </AshaRoleGuard>
          </ProtectedRoute>
        } />

        <Route path="/stock" element={
          <ProtectedRoute>
            <AshaRoleGuard path="/stock">
              <Layout>
                <StockPage />
              </Layout>
            </AshaRoleGuard>
          </ProtectedRoute>
        } />

        <Route path="/footfall" element={
          <ProtectedRoute>
            <AshaRoleGuard path="/footfall">
              <Layout>
                <FootfallPage />
              </Layout>
            </AshaRoleGuard>
          </ProtectedRoute>
        } />

        <Route path="/attendance" element={
          <ProtectedRoute>
            <AshaRoleGuard path="/attendance">
              <Layout>
                <AttendancePage />
              </Layout>
            </AshaRoleGuard>
          </ProtectedRoute>
        } />

        <Route path="/asha" element={
          <ProtectedRoute>
            <Layout>
              <AshaPage />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/labs" element={
          <ProtectedRoute>
            <AshaRoleGuard path="/labs">
              <Layout>
                <LabsPage />
              </Layout>
            </AshaRoleGuard>
          </ProtectedRoute>
        } />

        <Route path="/agents" element={
          <ProtectedRoute>
            <AshaRoleGuard path="/agents">
              <Layout>
                <AgentsPage />
              </Layout>
            </AshaRoleGuard>
          </ProtectedRoute>
        } />

        <Route path="/impact" element={
          <ProtectedRoute>
            <AshaRoleGuard path="/impact">
              <Layout>
                <CommunityImpactPage />
              </Layout>
            </AshaRoleGuard>
          </ProtectedRoute>
        } />

        <Route path="/cost-analytics" element={
          <ProtectedRoute>
            <AshaRoleGuard path="/cost-analytics">
              <Layout>
                <CostAnalyticsPage />
              </Layout>
            </AshaRoleGuard>
          </ProtectedRoute>
        } />

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
