import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Server, Play, Square, RefreshCw, PowerOff, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();

  const fetchServers = async () => {
    try {
      const data = await api.getServers();
      setServers(data);
    } catch (err) {
      if (err.message === 'Unauthorized' || err.message === 'Invalid or expired token') {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServers();
    const interval = setInterval(fetchServers, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (port, action) => {
    setActionLoading(port);
    try {
      if (action === 'start') await api.startServer(port);
      if (action === 'stop') await api.stopServer(port);
      if (action === 'restart') await api.restartServer(port);
      await fetchServers();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen p-8 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10"></div>
      
      <header className="flex justify-between items-center mb-12 glass-panel p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <Server className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold">MCloud Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/checkout')} className="btn-primary !w-auto shadow-none">
            + New Server
          </button>
          <button onClick={handleLogout} className="p-2 text-zinc-400 hover:text-red-400 transition-colors">
            <PowerOff className="w-6 h-6" />
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : servers.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center max-w-lg mx-auto">
          <Server className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No servers found</h2>
          <p className="text-zinc-400 mb-6">Create your first Bedrock server to get started.</p>
          <button onClick={() => navigate('/checkout')} className="btn-primary !w-auto inline-flex items-center gap-2">
            Create Server
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {servers.map(server => (
            <div key={server.id} className="glass-panel rounded-2xl p-6 relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className={`absolute top-0 left-0 w-full h-1 ${server.status === 'running' ? 'bg-primary' : server.status === 'stopped' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{server.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      {server.status === 'running' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>}
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${server.status === 'running' ? 'bg-primary' : server.status === 'stopped' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                    </span>
                    <span className="text-sm text-zinc-400 capitalize">{server.status}</span>
                  </div>
                </div>
                <div className="bg-zinc-900 px-3 py-1 rounded-lg text-sm font-mono border border-zinc-800 text-zinc-300">
                  {server.ip}:{server.port}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
                  <div className="text-xs text-zinc-500 mb-1">Memory</div>
                  <div className="font-semibold text-zinc-200">{server.memoryLimit}</div>
                </div>
                <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
                  <div className="text-xs text-zinc-500 mb-1">Type</div>
                  <div className="font-semibold text-zinc-200">Bedrock</div>
                </div>
              </div>

              <div className="flex gap-3">
                {server.status !== 'running' && (
                  <button 
                    onClick={() => handleAction(server.port, 'start')}
                    disabled={actionLoading === server.port}
                    className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 py-2 rounded-xl flex justify-center items-center gap-2 transition-colors disabled:opacity-50 font-medium"
                  >
                    {actionLoading === server.port ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    Start
                  </button>
                )}
                {server.status === 'running' && (
                  <>
                    <button 
                      onClick={() => handleAction(server.port, 'stop')}
                      disabled={actionLoading === server.port}
                      className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/50 py-2 rounded-xl flex justify-center items-center gap-2 transition-colors disabled:opacity-50 font-medium"
                    >
                      {actionLoading === server.port ? <Loader2 className="w-4 h-4 animate-spin" /> : <Square className="w-4 h-4" />}
                      Stop
                    </button>
                    <button 
                      onClick={() => handleAction(server.port, 'restart')}
                      disabled={actionLoading === server.port}
                      className="flex-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 border border-yellow-500/50 py-2 rounded-xl flex justify-center items-center gap-2 transition-colors disabled:opacity-50 font-medium"
                    >
                      {actionLoading === server.port ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                      Restart
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
