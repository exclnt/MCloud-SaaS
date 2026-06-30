import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Cpu, MemoryStick, HardDrive, Clock, AlertTriangle, Save, RotateCcw, Trash2 } from 'lucide-react';
import { api } from '../services/api';

export default function ServerOverview() {
  const { serverInfo, status, setStatus } = useOutletContext();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ cpu: 0, memory: 0, disk: 0 });
  
  const [displayName, setDisplayName] = useState(serverInfo.name);
  const [motd, setMotd] = useState(serverInfo.motd || '');
  const [savingDisplay, setSavingDisplay] = useState(false);

  useEffect(() => {
    let interval;
    if (status === 'running') {
      const fetchStats = async () => {
        try {
          const data = await api.getServerStats(serverInfo.port);
          if (data && typeof data.cpu !== 'undefined') {
            setStats(data);
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchStats();
      interval = setInterval(fetchStats, 5000);
    } else {
      setStats({ cpu: 0, memory: 0, disk: 0 });
    }
    return () => clearInterval(interval);
  }, [status, serverInfo.port]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to PERMANENTLY DELETE this server? This cannot be undone.")) {
      try {
        await api.deleteServer(serverInfo.port);
        navigate('/dashboard');
      } catch (e) {
        alert("Failed to delete: " + e.message);
      }
    }
  };

  const handleSaveDisplay = async () => {
    setSavingDisplay(true);
    try {
      await api.updateServerConfig(serverInfo.port, { name: displayName, motd: motd });
      alert("Server Display Settings Saved Successfully!");
    } catch (e) {
      alert("Failed to save Display Settings: " + e.message);
    }
    setSavingDisplay(false);
  };

  const getMemoryPercentage = () => {
    const memMatch = serverInfo.memoryLimit.match(/(\d+)m/i);
    const maxMem = memMatch ? parseInt(memMatch[1]) : 500;
    return Math.min(100, ((stats.memory || 0) / maxMem) * 100);
  };

  const maxMemForUi = serverInfo.memoryLimit.match(/(\d+)m/i) ? parseInt(serverInfo.memoryLimit.match(/(\d+)m/i)[1]) : 500;

  const getDiskPercentage = () => {
    // Assume 10GB disk limit
    const maxDisk = 10240;
    return Math.min(100, ((stats.disk || 0) / maxDisk) * 100);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <ServerIcon />
          </div>
          Dashboard
        </h1>
        <p className="text-zinc-500">Overview of your server</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* CPU */}
        <div className="bg-[#101010] border border-zinc-800/60 rounded-xl p-5">
          <div className="flex items-center gap-2 text-zinc-400 mb-4 text-xs font-bold uppercase tracking-wider">
            <Cpu className="w-4 h-4 text-primary" /> CPU
          </div>
          <div className="text-2xl font-bold text-white mb-2">{stats.cpu ? stats.cpu.toFixed(2) : '0.00'}%</div>
          <div className="w-full bg-zinc-900 rounded-full h-1.5 mb-2 overflow-hidden">
            <div className="bg-primary h-1.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, stats.cpu || 0)}%` }}></div>
          </div>
          <div className="text-xs text-zinc-500">of 100% max</div>
        </div>

        {/* Memory */}
        <div className="bg-[#101010] border border-zinc-800/60 rounded-xl p-5">
          <div className="flex items-center gap-2 text-zinc-400 mb-4 text-xs font-bold uppercase tracking-wider">
            <MemoryStick className="w-4 h-4 text-emerald-400" /> Memory
          </div>
          <div className="text-2xl font-bold text-white mb-2">{stats.memory ? stats.memory.toFixed(1) : '0'} MB</div>
          <div className="w-full bg-zinc-900 rounded-full h-1.5 mb-2 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${getMemoryPercentage()}%` }}></div>
          </div>
          <div className="text-xs text-zinc-500">of {maxMemForUi} MB ({getMemoryPercentage().toFixed(1)}%)</div>
        </div>

        {/* Disk */}
        <div className="bg-[#101010] border border-zinc-800/60 rounded-xl p-5">
          <div className="flex items-center gap-2 text-zinc-400 mb-4 text-xs font-bold uppercase tracking-wider">
            <HardDrive className="w-4 h-4 text-orange-400" /> Disk
          </div>
          <div className="text-2xl font-bold text-white mb-2">{stats.disk ? stats.disk.toFixed(1) : '0'} MB</div>
          <div className="w-full bg-zinc-900 rounded-full h-1.5 mb-2 overflow-hidden">
            <div className="bg-orange-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${getDiskPercentage()}%` }}></div>
          </div>
          <div className="text-xs text-zinc-500">of 10 GB ({getDiskPercentage().toFixed(1)}%)</div>
        </div>

        {/* Uptime */}
        <div className="bg-[#101010] border border-zinc-800/60 rounded-xl p-5">
          <div className="flex items-center gap-2 text-zinc-400 mb-4 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4 text-blue-400" /> Uptime
          </div>
          <div className="text-2xl font-bold text-white mb-2">{status === 'running' ? 'Online' : 'Offline'}</div>
          <div className="w-full bg-zinc-900 rounded-full h-1.5 mb-2 overflow-hidden">
            <div className={`h-1.5 rounded-full transition-all ${status === 'running' ? 'bg-blue-500 w-full' : 'w-0'}`}></div>
          </div>
          <div className="text-xs text-zinc-500">{status === 'running' ? 'Server is running' : 'Not currently running'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          <div className="bg-[#101010] border border-zinc-800/60 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-1">Server Plan</h2>
            <p className="text-sm text-zinc-500 mb-6">Adjust your server resources</p>
            
            <div className="flex items-center justify-center p-8 bg-zinc-900/30 rounded-xl border border-zinc-800/50 mb-8 relative overflow-hidden group hover:border-primary/50 transition cursor-pointer">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition"></div>
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-20 h-20 bg-zinc-800 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-zinc-700/50 group-hover:scale-105 transition transform">
                  📦
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                      <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-xl font-bold text-white uppercase">{maxMemForUi === 500 ? 'STANDARD' : 'PREMIUM'}</span>
                    <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-md border border-zinc-700">Paid Plan</span>
                  </div>
                  <div className="space-y-1 text-sm text-zinc-400">
                    <div className="flex items-center gap-2"><MemoryStick className="w-4 h-4 text-primary" /> {maxMemForUi} MB RAM</div>
                    <div className="flex items-center gap-2"><HardDrive className="w-4 h-4 text-primary" /> 10GB Storage</div>
                    <div className="flex items-center gap-2"><Cpu className="w-4 h-4 text-primary" /> 100% CPU</div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-zinc-500 text-center mb-4">Drag the slider to select a different plan (Coming Soon)</p>
            <div className="relative h-2 bg-zinc-800 rounded-full mb-8 opacity-50 cursor-not-allowed">
              <div className="absolute left-0 top-0 h-full w-[15%] bg-primary rounded-l-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              <div className="absolute left-[15%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-primary"></div>
            </div>
            
            <div className="flex justify-between text-[10px] font-bold text-zinc-600 uppercase opacity-50">
              <span className="text-primary">Free</span>
              <span>Zombie</span>
              <span>Spider</span>
              <span>Creeper</span>
              <span>Slime</span>
              <span>Blaze</span>
              <span>Wither</span>
            </div>
          </div>
          
          <div className="bg-[#101010] border border-red-900/30 rounded-xl p-6">
            <div className="flex items-center gap-2 text-red-500 font-bold mb-1">
              <AlertTriangle className="w-5 h-5" /> Danger Zone
            </div>
            <p className="text-sm text-zinc-500 mb-6">Irreversible and destructive actions.</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-950/10 border border-red-900/20 rounded-xl">
                <div>
                  <h4 className="text-sm font-bold text-zinc-200">Reset Server</h4>
                  <p className="text-xs text-zinc-500 mt-1">Delete all files and reinstall the server from scratch.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-red-900/50 text-red-400 text-sm font-semibold rounded-lg transition">
                  <RotateCcw className="w-4 h-4" /> Reset Server
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-red-950/10 border border-red-900/20 rounded-xl">
                <div>
                  <h4 className="text-sm font-bold text-zinc-200">Delete Server</h4>
                  <p className="text-xs text-zinc-500 mt-1">Once you delete a server, there is no going back. This will permanently destroy the server and all its data.</p>
                </div>
                <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 bg-red-950 hover:bg-red-900 border border-red-800 text-red-400 hover:text-white text-sm font-semibold rounded-lg transition">
                  <Trash2 className="w-4 h-4" /> Delete Server
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <div className="bg-[#101010] border border-zinc-800/60 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Server Display</h2>
                <p className="text-sm text-zinc-500">Customize your server's MOTD</p>
              </div>
              <button onClick={handleSaveDisplay} disabled={savingDisplay} className="flex items-center gap-2 px-6 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-semibold text-sm rounded-lg transition disabled:opacity-50">
                <Save className="w-4 h-4" /> {savingDisplay ? 'Saving...' : 'Save'}
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Message of the Day</label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-300 focus:outline-none focus:border-primary transition"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Edit MOTD</label>
                <textarea 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-300 focus:outline-none focus:border-primary transition min-h-[100px] resize-none"
                  value={motd}
                  onChange={(e) => setMotd(e.target.value)}
                />
              </div>
            </div>
            <p className="text-xs text-zinc-500 mt-6 pt-4 border-t border-zinc-800/50">
              Use \u00A7[code] for colors. Example: \u00A7aGreen \u00A7bAqua \u00A7cRed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServerIcon() {
  return (
    <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
  );
}
