import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { DataLoading } from './components/DataLoading';
import SupportWidget from './components/SupportWidget';

// Lazy loading halaman dan layout untuk optimasi ukuran bundle dan waktu muat (Code-Splitting)
const Landing = lazy(() => import('./pages/Landing'));
const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminOverviewPage = lazy(() => import('./pages/admin/AdminOverviewPage'));
const AdminServersPage = lazy(() => import('./pages/admin/AdminServersPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminPlansPage = lazy(() => import('./pages/admin/AdminPlansPage'));
const AdminTransactionsPage = lazy(() => import('./pages/admin/AdminTransactionsPage'));
const AdminLogsPage = lazy(() => import('./pages/admin/AdminLogsPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));
const AdminTicketsPage = lazy(() => import('./pages/admin/AdminTicketsPage'));
const Checkout = lazy(() => import('./pages/Checkout'));
const ServerConsole = lazy(() => import('./pages/ServerConsole'));
const ServerFiles = lazy(() => import('./pages/ServerFiles'));
const ServerList = lazy(() => import('./pages/ServerList'));
const ServerSettings = lazy(() => import('./pages/ServerSettings'));
const Pricing = lazy(() => import('./pages/Pricing'));
const TransactionDetail = lazy(() => import('./pages/TransactionDetail'));
const ServerLayout = lazy(() => import('./components/ServerLayout'));
const ServerOverview = lazy(() => import('./pages/ServerOverview'));
const ServerPlayers = lazy(() => import('./pages/ServerPlayers'));
const ClientArea = lazy(() => import('./pages/ClientArea'));
const Tickets = lazy(() => import('./pages/Tickets'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const NotFound = lazy(() => import('./pages/NotFound'));
const DocsLayout = lazy(() => import('./components/DocsLayout'));
const DocsHome = lazy(() => import('./pages/DocsHome'));
const DocsArticle = lazy(() => import('./pages/DocsArticle'));

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token || role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
};

function LoadingScreen({ onComplete }) {
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHiding(true);
      setTimeout(onComplete, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center loading-container ${isHiding ? 'hide' : ''}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 flex items-center justify-center animate-logo">
          <img src="/creep.png" alt="MCloud" className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(16,185,129,0.2)]" />
        </div>
        <span className="font-bold text-white text-2xl tracking-widest animate-text-reveal">MCLOUD</span>
      </div>
    </div>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Toaster 
        position={isMobile ? "top-center" : "bottom-right"} 
        toastOptions={{ style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' } }} 
      />
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <BrowserRouter>
        <Suspense fallback={
          <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
            <DataLoading text="Memuat halaman..." size="lg" />
          </div>
        }>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/clientarea" element={
              <ProtectedRoute>
                <ClientArea />
              </ProtectedRoute>
            } />

            <Route path="/tickets" element={
              <ProtectedRoute>
                <Tickets />
              </ProtectedRoute>
            } />

            <Route path="/pricing" element={<Pricing />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/transaction/:id" element={
              <ProtectedRoute>
                <TransactionDetail />
              </ProtectedRoute>
            } />
            
            <Route path="/server-list" element={<ServerList />} />

            <Route path="/server/:port" element={
              <ProtectedRoute>
                <ServerLayout />
              </ProtectedRoute>
            }>
              <Route index element={<ServerOverview />} />
              <Route path="console" element={<ServerConsole />} />
              <Route path="players" element={<ServerPlayers />} />
              <Route path="files" element={<ServerFiles />} />
              <Route path="settings" element={<ServerSettings />} />
            </Route>

            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              <Route index element={<Navigate to="/admin/overview" replace />} />
              <Route path="overview" element={<AdminOverviewPage />} />
              <Route path="servers" element={<AdminServersPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="plans" element={<AdminPlansPage />} />
              <Route path="transactions" element={<AdminTransactionsPage />} />
              <Route path="logs" element={<AdminLogsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="tickets" element={<AdminTicketsPage />} />
            </Route>

            <Route path="/docs" element={<DocsLayout />}>
              <Route index element={<DocsHome />} />
              <Route path=":category/:slug" element={<DocsArticle />} />
            </Route>

            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <SupportWidget />
      </BrowserRouter>
    </>
  );
}
