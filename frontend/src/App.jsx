import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LoginPage      from './pages/LoginPage';
import DashboardPage  from './pages/DashboardPage';
import LeadsPage      from './pages/LeadsPage';
import PropertiesPage from './pages/PropertiesPage';
import ClientsPage    from './pages/ClientsPage';
import DealsPage      from './pages/DealsPage';

// Layout
import Sidebar from './components/Sidebar';

// Protects any route — redirects to /login if not logged in
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen text-gray-500">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
};

const AppLayout = ({ children }) => (
  <div className="flex h-screen bg-gray-50">
    <Sidebar />
    <main className="flex-1 overflow-y-auto p-6">{children}</main>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout><DashboardPage /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/leads" element={
            <ProtectedRoute>
              <AppLayout><LeadsPage /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/properties" element={
            <ProtectedRoute>
              <AppLayout><PropertiesPage /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/clients" element={
            <ProtectedRoute>
              <AppLayout><ClientsPage /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/deals" element={
            <ProtectedRoute>
              <AppLayout><DealsPage /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
