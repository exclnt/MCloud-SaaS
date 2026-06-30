import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Checkout from './pages/Checkout';
import ServerConsole from './pages/ServerConsole';
import ServerFiles from './pages/ServerFiles';
import ServerList from './pages/ServerList';
import ServerSettings from './pages/ServerSettings';
import Pricing from './pages/Pricing';

import ServerLayout from './components/ServerLayout';
import ServerOverview from './pages/ServerOverview';
import ServerPlayers from './pages/ServerPlayers';
import ClientArea from './pages/ClientArea';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
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
        <div className="w-20 h-20 bg-zinc-800 rounded-2xl flex items-center justify-center animate-logo border border-zinc-700 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <span className="text-primary font-bold text-4xl">M</span>
        </div>
        <span className="font-bold text-white text-2xl tracking-widest animate-text-reveal">MCLOUD</span>
      </div>
    </div>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
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
        
        <Route path="/clientarea" element={
          <ProtectedRoute>
            <ClientArea />
          </ProtectedRoute>
        } />
        
        <Route path="/checkout" element={<Checkout />} />
        
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
      </Routes>
    </BrowserRouter>
    </>
  );
}
