import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Checkout from './pages/Checkout';
import ServerConsole from './pages/ServerConsole';
import ServerFiles from './pages/ServerFiles';
import ServerList from './pages/ServerList';
import ServerSettings from './pages/ServerSettings';
import Pricing from './pages/Pricing';
import TransactionDetail from './pages/TransactionDetail';

import ServerLayout from './components/ServerLayout';
import ServerOverview from './pages/ServerOverview';
import ServerPlayers from './pages/ServerPlayers';
import ClientArea from './pages/ClientArea';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
import DocsLayout from './components/DocsLayout';
import DocsHome from './pages/DocsHome';
import DocsArticle from './pages/DocsArticle';
import SupportWidget from './components/SupportWidget';

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
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        
        <Route path="/clientarea" element={
          <ProtectedRoute>
            <ClientArea />
          </ProtectedRoute>
        } />
        
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/transaction/:id" element={
          <ProtectedRoute>
            <TransactionDetail />
          </ProtectedRoute>
        } />
        
        <Route path="/pricing" element={<Pricing />} />
        
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

        <Route path="/docs" element={<DocsLayout />}>
          <Route index element={<DocsHome />} />
          <Route path=":category/:slug" element={<DocsArticle />} />
        </Route>

        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <SupportWidget />
    </BrowserRouter>
    </>
  );
}
