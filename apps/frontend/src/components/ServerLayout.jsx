import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { 
  LayoutDashboard, 
  TerminalSquare, 
  Folder, 
  Users, 
  Database, 
  Network, 
  Calendar, 
  Download, 
  Settings, 
  Server,
  Play,
  RotateCw,
  LogOut,
  ChevronDown,
  Globe,
  Plus,
  Loader2,
  Square
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ServerLayout() {
  const { port } = useParams();
  const navigate = useNavigate();
  const [serverInfo, setServerInfo] = useState(null);
  const [status, setStatus] = useState('offline');
  const [processingAction, setProcessingAction] = useState(null);

  useEffect(() => {
    const fetchServer = async () => {
      try {
        const servers = await api.getServers();
        const current = servers.find(s => s.port === parseInt(port));
        if (current) {
          setServerInfo(current);
          setStatus(current.status);
        } else {
          navigate('/dashboard');
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchServer();
    
    // Poll status every 5s
    const interval = setInterval(fetchServer, 5000);
    return () => clearInterval(interval);
  }, [port, navigate]);

  const handleStart = async () => {
    if (status === 'running' || processingAction) return;
    setProcessingAction('start');
    try {
      await api.startServer(port);
      setStatus('running');
    } catch (e) {
      alert('Gagal memulai server');
    }
    setProcessingAction(null);
  };

  const handleStop = async () => {
    if (status !== 'running' || processingAction) return;
    setProcessingAction('stop');
    try {
      await api.stopServer(port);
      setStatus('stopped');
    } catch (e) {
      alert('Gagal menghentikan server');
    }
    setProcessingAction(null);
  };

  const handleRestart = async () => {
    if (status !== 'running' || processingAction) return;
    setProcessingAction('restart');
    try {
      await api.restartServer(port);
      setStatus('running');
    } catch (e) {
      alert('Gagal merestart server');
    }
    setProcessingAction(null);
  };

  if (!serverInfo) return <div className="min-h-screen bg-[#0a0a0a]" />;

  return (
    <div className="h-screen bg-[#0a0a0a] text-zinc-300 font-sans flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-zinc-800/60 bg-[#0a0a0a] flex flex-col overflow-y-auto shrink-0">
          <div className="p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                    <Server className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-zinc-100">{serverInfo.name}</h2>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-primary font-medium">Paket {
                        serverInfo.plan 
                          ? serverInfo.plan.charAt(0).toUpperCase() + serverInfo.plan.slice(1) 
                          : (serverInfo.memoryLimit.includes('1024') ? 'Spider' 
                            : serverInfo.memoryLimit.includes('2048') ? 'Slime' 
                            : serverInfo.memoryLimit.includes('4096') ? 'Wither' 
                            : 'Villager')
                      }</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {status === 'running' ? (
                  <button 
                    onClick={handleStop}
                    disabled={processingAction !== null}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-semibold border border-red-900/30 text-red-500 hover:bg-red-500/10 bg-red-500/5 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processingAction === 'stop' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Square className="w-3.5 h-3.5 fill-current" />} 
                    {processingAction === 'stop' ? 'Menghentikan...' : 'Berhenti'}
                  </button>
                ) : (
                  <button 
                    onClick={handleStart}
                    disabled={processingAction !== null}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-semibold border border-primary/30 text-primary hover:bg-primary/10 bg-primary/5 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processingAction === 'start' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />} 
                    {processingAction === 'start' ? 'Memulai...' : 'Mulai'}
                  </button>
                )}
                <button 
                  onClick={handleRestart}
                  disabled={processingAction !== null || status !== 'running'}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-semibold border border-zinc-800 text-zinc-300 hover:bg-zinc-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processingAction === 'restart' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCw className="w-3.5 h-3.5" />} 
                  {processingAction === 'restart' ? 'Merestart...' : 'Restart'}
                </button>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-0.5">
            <div className="px-3 pb-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Navigasi</div>
            
            <NavLink to={`/server/${port}`} end className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${isActive ? 'bg-primary/10 text-primary' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}>
              <LayoutDashboard className="w-4 h-4" /> Dasbor
            </NavLink>
            <NavLink to={`/server/${port}/console`} className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${isActive ? 'bg-primary/10 text-primary' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}>
              <TerminalSquare className="w-4 h-4" /> Konsol Server
            </NavLink>
            <NavLink to={`/server/${port}/files`} className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${isActive ? 'bg-primary/10 text-primary' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}>
              <Folder className="w-4 h-4" /> Pengelola File
            </NavLink>
            <NavLink to={`/server/${port}/players`} className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${isActive ? 'bg-primary/10 text-primary' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}>
              <Users className="w-4 h-4" /> Pemain
            </NavLink>
            <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-zinc-500 cursor-not-allowed">
              <Database className="w-4 h-4" /> Databases
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-zinc-500 cursor-not-allowed">
              <Network className="w-4 h-4" /> Pengaturan Jaringan
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-zinc-500 cursor-not-allowed">
              <Calendar className="w-4 h-4" /> Jadwal
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-zinc-500 cursor-not-allowed">
              <Download className="w-4 h-4" /> Pengimpor Server
            </div>
            <NavLink to={`/server/${port}/settings`} className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${isActive ? 'bg-primary/10 text-primary' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}>
              <Settings className="w-4 h-4" /> Pengaturan Server
            </NavLink>

            <div className="px-3 pt-6 pb-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Perangkat Lunak</div>
            <div className="flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-zinc-400 cursor-default">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 flex items-center justify-center font-bold text-xs">M</span> Minecraft
              </div>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-3 px-3 py-2 pl-10 rounded-md text-sm font-medium text-zinc-500 cursor-not-allowed">
              {'<>'} Perangkat Lunak Server
            </div>
          </nav>

          <div className="p-4 border-t border-zinc-800/60">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-300 transition">
              <LogOut className="w-3.5 h-3.5" /> Kembali ke Server
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#0a0a0a]">
          <Outlet context={{ serverInfo, status, setStatus }} />
          <Footer />
        </main>
      </div>
    </div>
  );
}
