import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Cpu, MemoryStick, HardDrive, Clock, AlertTriangle, Save, RotateCcw, Trash2, CalendarDays, Network, Play } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';

export default function ServerOverview() {
  const { serverInfo, status, setStatus } = useOutletContext();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ cpu: 0, memory: 0, disk: 0 });
  
  const [displayName, setDisplayName] = useState(serverInfo.name);
  const [motd, setMotd] = useState(serverInfo.motd || '');
  const [savingDisplay, setSavingDisplay] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const getRemainingDays = (expiresAt) => {
    if (!expiresAt) return 0;
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleRenew = () => {
    // Determine plan
    let plan = serverInfo.plan;
    if (!plan) {
      const maxMemForUi = serverInfo.memoryLimit.match(/(\d+)m/i) ? parseInt(serverInfo.memoryLimit.match(/(\d+)m/i)[1]) : 500;
      if (maxMemForUi === 1024) plan = 'spider';
      else if (maxMemForUi === 2048) plan = 'slime';
      else if (maxMemForUi === 4096) plan = 'wither';
      else plan = 'villager';
    }
    
    navigate(`/checkout?renew=true&serverId=${serverInfo.id}&port=${serverInfo.port}&plan=${plan}&serverName=${encodeURIComponent(serverInfo.name)}`);
  };

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

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.deleteServer(serverInfo.port);
      toast.success('Server berhasil dihapus');
      navigate('/dashboard');
    } catch (e) {
      toast.error("Gagal menghapus: " + e.message);
    }
  };

  const handleSaveDisplay = async () => {
    setSavingDisplay(true);
    try {
      await api.updateServerConfig(serverInfo.port, { name: displayName, motd: motd });
      toast.success("Pengaturan Tampilan Server Berhasil Disimpan!");
    } catch (e) {
      toast.error("Gagal menyimpan Pengaturan Tampilan: " + e.message);
    }
    setSavingDisplay(false);
  };

  const getMemoryPercentage = () => {
    const memMatch = serverInfo.memoryLimit.match(/(\d+)m/i);
    const maxMem = memMatch ? parseInt(memMatch[1]) : 500;
    return Math.min(100, ((stats.memory || 0) / maxMem) * 100);
  };

  const maxMemForUi = serverInfo.memoryLimit.match(/(\d+)m/i) ? parseInt(serverInfo.memoryLimit.match(/(\d+)m/i)[1]) : 500;

  const getPlanIcon = () => {
    if (serverInfo.plan === 'spider' || maxMemForUi === 1024) return 'MHF_Spider';
    if (serverInfo.plan === 'slime' || maxMemForUi === 2048) return 'MHF_Slime';
    if (serverInfo.plan === 'wither' || maxMemForUi === 4096) return 'MHF_Wither';
    return 'MHF_Villager';
  };
  
  const getPlanName = () => {
    if (serverInfo.plan) return serverInfo.plan.toUpperCase();
    if (maxMemForUi === 1024) return 'SPIDER';
    if (maxMemForUi === 2048) return 'SLIME';
    if (maxMemForUi === 4096) return 'WITHER';
    return 'VILLAGER';
  };

  const getDiskPercentage = () => {
    // Assume 10GB disk limit
    const maxDisk = 10240;
    return Math.min(100, ((stats.disk || 0) / maxDisk) * 100);
  };

  return (
    <div className="w-full px-4 sm:px-8 py-4 sm:py-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <ServerIcon />
          </div>
          Dasbor
        </h1>
        <p className="text-zinc-500">Gambaran umum server Anda</p>
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
          <div className="text-xs text-zinc-500">dari maksimal 100%</div>
        </div>

        {/* Memory */}
        <div className="bg-[#101010] border border-zinc-800/60 rounded-xl p-5">
          <div className="flex items-center gap-2 text-zinc-400 mb-4 text-xs font-bold uppercase tracking-wider">
            <MemoryStick className="w-4 h-4 text-emerald-400" /> Memori
          </div>
          <div className="text-2xl font-bold text-white mb-2">{stats.memory ? stats.memory.toFixed(1) : '0'} MB</div>
          <div className="w-full bg-zinc-900 rounded-full h-1.5 mb-2 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${getMemoryPercentage()}%` }}></div>
          </div>
          <div className="text-xs text-zinc-500">dari {maxMemForUi} MB ({getMemoryPercentage().toFixed(1)}%)</div>
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
          <div className="text-xs text-zinc-500">dari 10 GB ({getDiskPercentage().toFixed(1)}%)</div>
        </div>

        {/* Uptime */}
        <div className="bg-[#101010] border border-zinc-800/60 rounded-xl p-5">
          <div className="flex items-center gap-2 text-zinc-400 mb-4 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4 text-blue-400" /> Waktu Aktif
          </div>
          <div className="text-2xl font-bold text-white mb-2">{status === 'running' ? 'Online' : 'Offline'}</div>
          <div className="w-full bg-zinc-900 rounded-full h-1.5 mb-2 overflow-hidden">
            <div className={`h-1.5 rounded-full transition-all ${status === 'running' ? 'bg-blue-500 w-full' : 'w-0'}`}></div>
          </div>
          <div className="text-xs text-zinc-500">{status === 'running' ? 'Server sedang berjalan' : 'Saat ini tidak berjalan'}</div>
        </div>
      </div>

      {/* Clean Connection Info */}
      <div className="bg-[#101010] border border-zinc-800/60 rounded-xl p-6 md:p-8 relative overflow-hidden mb-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative z-10">
          <div className="flex-1 w-full">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Network className="w-5 h-5 text-blue-400" />
              Alamat Server Minecraft
            </h2>
            <p className="text-sm text-zinc-400 mb-6">Gunakan alamat IP ini untuk masuk ke dalam server. Bagikan hanya dengan teman yang Anda percayai.</p>
            
            <div className="flex flex-col sm:flex-row items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg p-1.5">
              <input 
                type="text" 
                value={`${serverInfo.ip}:${serverInfo.port}`}
                readOnly
                className="w-full bg-transparent p-3 sm:px-4 text-base sm:text-lg text-white focus:outline-none transition font-mono font-bold tracking-wider text-center sm:text-left selection:bg-blue-500/30"
              />
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`${serverInfo.ip}:${serverInfo.port}`);
                  toast.success('Alamat IP berhasil disalin!');
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md transition text-sm font-medium shrink-0 border border-zinc-700"
              >
                Salin
              </button>
            </div>
          </div>
          
          <div className="hidden lg:block w-px h-32 bg-zinc-800/60"></div>

          <div className="flex-1 w-full lg:max-w-md">
            <h4 className="text-sm font-bold text-zinc-200 mb-4 flex items-center gap-2">
              <Play className="w-4 h-4 text-primary" /> Cara Bergabung
            </h4>
            <ul className="text-sm text-zinc-400 space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 text-blue-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">1</span>
                <span>Buka menu <strong className="text-zinc-200 font-semibold px-1">Multiplayer</strong> di game Minecraft Anda.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 text-blue-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">2</span>
                <span>Pilih <strong className="text-zinc-200 font-semibold px-1">Add Server</strong> atau <strong className="text-zinc-200 font-semibold px-1">Direct Connection</strong>.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 text-blue-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">3</span>
                <span>Tempel (Paste) alamat IP ke kolom <strong className="text-zinc-200 font-semibold px-1">Server Address</strong> dan Join!</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          <div className="bg-[#101010] border border-zinc-800/60 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-1">Paket Server</h2>
            <p className="text-sm text-zinc-500 mb-6">Sesuaikan sumber daya server Anda</p>
            
            <div className="flex items-center justify-center p-8 bg-zinc-900/30 rounded-xl border border-zinc-800/50 mb-8 relative overflow-hidden group hover:border-primary/50 transition cursor-pointer">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition"></div>
              <div className="flex items-center gap-6 relative z-10">
                <div className="shrink-0">
                  <img 
                    src={`https://mc-heads.net/avatar/${getPlanIcon()}/64`} 
                    alt="Plan Icon" 
                    className="w-16 h-16 rounded-xl bg-zinc-900 border border-zinc-800 p-1 group-hover:scale-105 transition transform"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                      <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-xl font-bold text-white uppercase">{getPlanName()}</span>
                    <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-md border border-zinc-700">Paket Berbayar</span>
                  </div>
                  <div className="space-y-1 text-sm text-zinc-400">
                    <div className="flex items-center gap-2"><MemoryStick className="w-4 h-4 text-primary" /> {maxMemForUi} MB RAM</div>
                    <div className="flex items-center gap-2"><HardDrive className="w-4 h-4 text-primary" /> 10GB Penyimpanan</div>
                    <div className="flex items-center gap-2"><Cpu className="w-4 h-4 text-primary" /> 100% CPU</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
              <div>
                <h4 className="text-sm font-bold text-zinc-200 flex items-center gap-2"><CalendarDays className="w-4 h-4 text-blue-400"/> Masa Aktif</h4>
                <p className="text-xs text-zinc-500 mt-1">
                  {getRemainingDays(serverInfo.expiresAt) > 0 
                    ? `${getRemainingDays(serverInfo.expiresAt)} Hari Tersisa` 
                    : 'Telah Kedaluwarsa'}
                </p>
              </div>
              <button 
                onClick={handleRenew} 
                className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary hover:bg-primary-hover text-black text-xs sm:text-sm font-bold rounded-md transition shadow-[0_0_10px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
              >
                Perpanjang Sewa
              </button>
            </div>
          </div>
          
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <div className="bg-[#101010] border border-zinc-800/60 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Tampilan Server</h2>
                <p className="text-sm text-zinc-500">Sesuaikan MOTD server Anda</p>
              </div>
              <button onClick={handleSaveDisplay} disabled={savingDisplay} className="flex items-center gap-2 px-4 py-1.5 sm:px-6 sm:py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-semibold text-xs sm:text-sm rounded-md transition disabled:opacity-50">
                <Save className="w-4 h-4" /> {savingDisplay ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Pesan Hari Ini (MOTD)</label>
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
              Gunakan \u00A7[kode] untuk warna. Contoh: \u00A7aHijau \u00A7bBiru Muda \u00A7cMerah
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#101010] border border-red-900/30 rounded-xl p-6">
        <div className="flex items-center gap-2 text-red-500 font-bold mb-1">
          <AlertTriangle className="w-5 h-5" /> Zona Bahaya
        </div>
        <p className="text-sm text-zinc-500 mb-6">Tindakan merusak dan tidak dapat diubah.</p>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-red-950/10 border border-red-900/20 rounded-xl gap-4 sm:gap-0">
            <div className="flex-1">
              <h4 className="text-sm font-bold text-zinc-200">Setel Ulang Server</h4>
              <p className="text-xs text-zinc-500 mt-1">Hapus semua file dan instal ulang server dari awal.</p>
            </div>
            <button className="w-fit flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-zinc-900 hover:bg-zinc-800 border border-red-900/50 text-red-400 text-xs sm:text-sm font-semibold rounded-md transition shrink-0">
              <RotateCcw className="w-4 h-4" /> Setel Ulang
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-red-950/10 border border-red-900/20 rounded-xl gap-4 sm:gap-0">
            <div className="flex-1">
              <h4 className="text-sm font-bold text-zinc-200">Hapus Server</h4>
              <p className="text-xs text-zinc-500 mt-1">Setelah Anda menghapus server, tidak ada jalan kembali. Ini akan secara permanen menghancurkan server dan semua datanya.</p>
            </div>
            <button onClick={handleDelete} className="w-fit flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-950 hover:bg-red-900 border border-red-800 text-red-400 hover:text-white text-xs sm:text-sm font-semibold rounded-md transition shrink-0">
              <Trash2 className="w-4 h-4" /> Hapus Server
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Server"
        message="Apakah Anda yakin ingin MENGHAPUS server ini secara PERMANEN? Tindakan ini tidak dapat dibatalkan dan akan menghancurkan semua data yang ada di server."
        confirmText="Hapus Permanen"
        cancelText="Batal"
        isDanger={true}
      />
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
