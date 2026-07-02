import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { api } from '../services/api';
import { 
  Play, 
  RotateCw, 
  Square,
  Plus,
  Server as ServerIcon,
  Globe,
  Loader2,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ConfirmModal from '../components/ConfirmModal';
import { SkeletonServerRow } from '../components/DataLoading';

const getRemainingDays = (expiresAt) => {
  if (!expiresAt) return 0;
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const getPlanName = (memoryLimit) => {
  switch (memoryLimit) {
    case '500m': return 'Villager';
    case '1g': return 'Spider';
    case '2g': return 'Slime';
    case '4g': return 'Wither';
    default: return 'Khusus';
  }
};

export default function Dashboard() {
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {}, isDanger: false, confirmText: 'Konfirmasi' });
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});
  const [currentUser, setCurrentUser] = useState({ username: '' });
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const fetchServers = async () => {
    try {
      const data = await api.getServers();
      setServers(data);
    } catch (err) {
      if (err.message === 'Unauthorized') navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Dasbor - MCloud';
    fetchServers();
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.username) {
          setCurrentUser({ username: payload.username });
        }
      } catch (e) {}
    }
    setRole(localStorage.getItem('role') || '');
    const interval = setInterval(fetchServers, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  const handleStart = async (port) => {
    setProcessing(prev => ({ ...prev, [port]: 'start' }));
    try {
      await api.startServer(port);
      await fetchServers();
      toast.success('Server berhasil dimulai');
    } catch (e) {
      toast.error("Gagal memulai: " + e.message);
    }
    setProcessing(prev => ({ ...prev, [port]: null }));
  };

  const handleStop = (port) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Matikan Server',
      message: `Apakah Anda yakin ingin mematikan server port ${port}? Pemain yang aktif akan terputus.`,
      isDanger: true,
      confirmText: 'Matikan Server',
      onConfirm: async () => {
        setProcessing(prev => ({ ...prev, [port]: 'stop' }));
        try {
          await api.stopServer(port);
          await fetchServers();
          toast.success('Server berhasil dihentikan');
        } catch (e) {
          toast.error("Gagal menghentikan: " + e.message);
        }
        setProcessing(prev => ({ ...prev, [port]: null }));
      }
    });
  };

  const handleRestart = (port) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Restart Server',
      message: `Apakah Anda yakin ingin merestart server port ${port}?`,
      isDanger: false,
      confirmText: 'Restart Server',
      onConfirm: async () => {
        setProcessing(prev => ({ ...prev, [port]: 'restart' }));
        try {
          await api.restartServer(port);
          await fetchServers();
          toast.success('Server berhasil direstart');
        } catch (e) {
          toast.error("Gagal merestart: " + e.message);
        }
        setProcessing(prev => ({ ...prev, [port]: null }));
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans flex flex-col">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 w-full min-h-[calc(100dvh-12rem)] md:min-h-0 px-6 md:px-10 py-6 md:py-10 max-w-7xl mx-auto shrink-0 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {currentUser.username ? `Halo, ${currentUser.username}` : 'Server Anda'}
            </h1>
            <p className="text-sm text-zinc-500">Kelola semua server game Anda di satu tempat</p>
          </div>
          <div className="flex gap-2">
            {role === 'admin' && (
              <button 
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-md transition border border-zinc-700"
              >
                Admin Panel
              </button>
            )}
            <button 
              onClick={() => navigate('/pricing')}
              className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base bg-primary hover:bg-primary-hover text-black font-bold rounded-md transition shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
            >
              <Plus className="w-5 h-5" /> Buat Server
            </button>
          </div>
        </div>

        <div className="flex gap-3 sm:gap-4 mb-8">
          <button className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-zinc-900 border border-zinc-700 text-white rounded-md text-xs sm:text-sm font-medium">
            <ServerIcon className="w-4 h-4" /> Minecraft <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-[10px] sm:text-xs ml-1">{servers.length}</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-transparent border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-md text-xs sm:text-sm font-medium transition">
            <Globe className="w-4 h-4" /> Eksternal
          </button>
        </div>

        <div className="space-y-4">
          {loading && servers.length === 0 ? (
            <SkeletonServerRow count={3} />
          ) : servers.length === 0 ? (
            <div className="bg-[#101010] border border-zinc-800/60 rounded-xl p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                <ServerIcon className="w-8 h-8 text-zinc-600" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Tidak ada server</h2>
              <p className="text-zinc-500 max-w-sm">Anda belum membuat server apapun. Klik tombol di atas untuk menyebarkan server Minecraft pertama Anda.</p>
            </div>
          ) : (
            servers.map(server => (
              <div 
                key={server.id} 
                onClick={() => navigate(`/server/${server.port}`)}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#101010] border border-zinc-800/60 p-4 rounded-xl hover:border-zinc-700 hover:bg-zinc-900/50 transition cursor-pointer relative overflow-hidden gap-4 sm:gap-0"
              >
                {/* Active indicator bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${server.status === 'running' ? 'bg-primary shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`}></div>
                
                <div className="flex items-center gap-4 pl-2">
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center border border-zinc-800 group-hover:border-primary/50 transition">
                    <img src="https://minecraft.net/favicon.ico" alt="MC" className="w-6 h-6 opacity-80 group-hover:opacity-100" onError={(e) => { e.target.style.display = 'none'; }} />
                    <ServerIcon className="w-6 h-6 text-zinc-500 absolute" style={{ zIndex: -1 }} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-zinc-100 group-hover:text-white">{server.name}</h3>
                      <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded uppercase font-bold">Paket {server.plan ? server.plan : getPlanName(server.memoryLimit)}</span>
                      {getRemainingDays(server.expiresAt) > 0 ? (
                        <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded font-bold">Sisa {getRemainingDays(server.expiresAt)} Hari</span>
                      ) : (
                        <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded font-bold uppercase">Kedaluwarsa</span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 font-mono">{server.ip}:{server.port}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pl-2 sm:pl-0">
                  <div className={`text-xs font-bold px-2 py-1 rounded-md border ${server.status === 'running' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-red-950/30 text-red-500 border-red-900/50'}`}>
                    {server.status}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleStart(server.port); }}
                      disabled={server.status === 'running' || processing[server.port]}
                      className={`p-2 rounded-md transition ${server.status === 'running' || processing[server.port] ? 'text-zinc-600 cursor-not-allowed' : 'text-zinc-400 hover:text-primary hover:bg-zinc-800'}`}
                    >
                      {processing[server.port] === 'start' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleRestart(server.port); }}
                      disabled={server.status !== 'running' || processing[server.port]}
                      className={`p-2 rounded-md transition ${server.status !== 'running' || processing[server.port] ? 'text-zinc-600 cursor-not-allowed' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                    >
                      {processing[server.port] === 'restart' ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCw className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleStop(server.port); }}
                      disabled={server.status !== 'running' || processing[server.port]}
                      className={`p-2 rounded-md transition ${server.status !== 'running' || processing[server.port] ? 'text-zinc-600 cursor-not-allowed' : 'text-zinc-400 hover:text-red-500 hover:bg-zinc-800'}`}
                    >
                      {processing[server.port] === 'stop' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Square className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        isDanger={confirmConfig.isDanger}
      />
      <Footer />
    </div>
  );
}
