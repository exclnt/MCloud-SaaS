import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Checkout from './pages/Checkout';
import ServerConsole from './pages/ServerConsole';
import ServerFiles from './pages/ServerFiles';
import ServerList from './pages/ServerList';
import ServerSettings from './pages/ServerSettings';

import ServerLayout from './components/ServerLayout';
import ServerOverview from './pages/ServerOverview';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/checkout" element={
          <ProtectedRoute>
            <Checkout />
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
          <Route path="files" element={<ServerFiles />} />
          <Route path="settings" element={<ServerSettings />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}
