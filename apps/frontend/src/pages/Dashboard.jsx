import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

export default function Dashboard() {
  const [servers, setServers] = useState([]);
  const [processing, setProcessing] = useState({});
  const navigate = useNavigate();

  const fetchServers = async () => {
    try {
      const data = await api.getServers();
      setServers(data);
    } catch (err) {
      if (err.message === 'Unauthorized') navigate('/login');
    }
  };

  useEffect(() => {
    fetchServers();
    const interval = setInterval(fetchServers, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  const handleStart = async (port) => {
    setProcessing(prev => ({ ...prev, [port]: 'start' }));
    try {
      await api.startServer(port);
      await fetchServers();
    } catch (e) {
      alert("Failed to start: " + e.message);
    }
    setProcessing(prev => ({ ...prev, [port]: null }));
  };

  const handleStop = async (port) => {
    setProcessing(prev => ({ ...prev, [port]: 'stop' }));
    try {
      await api.stopServer(port);
      await fetchServers();
    } catch (e) {
      alert("Failed to stop: " + e.message);
    }
    setProcessing(prev => ({ ...prev, [port]: null }));
  };

  const handleRestart = async (port) => {
    setProcessing(prev => ({ ...prev, [port]: 'restart' }));
    try {
      await api.restartServer(port);
      await fetchServers();
    } catch (e) {
      alert("Failed to restart: " + e.message);
    }
    setProcessing(prev => ({ ...prev, [port]: null }));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans flex flex-col">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Your Servers</h1>
            <p className="text-sm text-zinc-500">Manage all your game servers in one place</p>
          </div>
          
          <button 
            onClick={() => navigate('/checkout')}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-black font-bold rounded-xl transition shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <Plus className="w-5 h-5" /> Create Server
          </button>
        </div>

        <div className="flex gap-4 mb-8">
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-700 text-white rounded-lg text-sm font-medium">
            <ServerIcon className="w-4 h-4" /> Minecraft <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-xs ml-1">{servers.length}</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-transparent border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-lg text-sm font-medium transition">
            <Globe className="w-4 h-4" /> External
          </button>
        </div>

        <div className="space-y-4">
          {servers.length === 0 ? (
            <div className="bg-[#101010] border border-zinc-800/60 rounded-xl p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                <ServerIcon className="w-8 h-8 text-zinc-600" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">No servers found</h2>
              <p className="text-zinc-500 max-w-sm">You haven't created any servers yet. Click the button above to deploy your first Minecraft server.</p>
            </div>
          ) : (
            servers.map(server => (
              <div 
                key={server.id} 
                onClick={() => navigate(`/server/${server.port}`)}
                className="group flex items-center justify-between bg-[#101010] border border-zinc-800/60 p-4 rounded-xl hover:border-zinc-700 hover:bg-zinc-900/50 transition cursor-pointer relative overflow-hidden"
              >
                {/* Active indicator bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${server.status === 'running' ? 'bg-primary shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`}></div>
                
                <div className="flex items-center gap-4 pl-2">
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center border border-zinc-800 group-hover:border-primary/50 transition">
                    <img src="https://minecraft.net/favicon.ico" alt="MC" className="w-6 h-6 opacity-80 group-hover:opacity-100" onError={(e) => { e.target.style.display = 'none'; }} />
                    <ServerIcon className="w-6 h-6 text-zinc-500 absolute" style={{ zIndex: -1 }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-zinc-100 group-hover:text-white">{server.name}</h3>
                      <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded uppercase font-bold">Free Server</span>
                    </div>
                    <p className="text-xs text-zinc-500 font-mono">{server.ip}:{server.port}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className={`text-xs font-bold px-2 py-1 rounded-md border ${server.status === 'running' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-red-950/30 text-red-500 border-red-900/50'}`}>
                    {server.status}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleStart(server.port); }}
                      disabled={server.status === 'running' || processing[server.port]}
                      className={`p-2 rounded-lg transition ${server.status === 'running' || processing[server.port] ? 'text-zinc-600 cursor-not-allowed' : 'text-zinc-400 hover:text-primary hover:bg-zinc-800'}`}
                    >
                      {processing[server.port] === 'start' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleRestart(server.port); }}
                      disabled={server.status !== 'running' || processing[server.port]}
                      className={`p-2 rounded-lg transition ${server.status !== 'running' || processing[server.port] ? 'text-zinc-600 cursor-not-allowed' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                    >
                      {processing[server.port] === 'restart' ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCw className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleStop(server.port); }}
                      disabled={server.status !== 'running' || processing[server.port]}
                      className={`p-2 rounded-lg transition ${server.status !== 'running' || processing[server.port] ? 'text-zinc-600 cursor-not-allowed' : 'text-zinc-400 hover:text-red-500 hover:bg-zinc-800'}`}
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

      <Footer />
    </div>
  );
}
