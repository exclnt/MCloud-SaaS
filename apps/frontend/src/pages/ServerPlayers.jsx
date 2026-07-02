import { useState, useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { Users, Shield, ShieldOff, UserX, Ban, Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';
import { DataLoading } from '../components/DataLoading';

export default function ServerPlayers() {
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {}, isDanger: false, confirmText: 'Konfirmasi' });
  const { port } = useParams();
  const { status } = useOutletContext();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchPlayers = async () => {
    if (status !== 'running') {
      setPlayers([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await api.getOnlinePlayers(port);
      setPlayers(data || []);
    } catch (e) {
      console.error('Failed to fetch players:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
    const interval = setInterval(fetchPlayers, 10000);
    return () => clearInterval(interval);
  }, [port, status]);

  const handleAction = (player, action) => {
    if (actionLoading) return;
    let title = 'Tindakan Pemain';
    let message = `Apakah Anda yakin ingin melakukan aksi pada ${player}?`;
    let isDanger = false;
    let confirmText = 'Ya, Lanjutkan';

    if (action === 'ban') {
      title = 'Ban Pemain';
      message = `Apakah Anda yakin ingin memblokir permanen (ban) ${player} dari server ini?`;
      isDanger = true;
      confirmText = 'Ban Pemain';
    } else if (action === 'kick') {
      title = 'Kick Pemain';
      message = `Apakah Anda yakin ingin mengeluarkan (kick) ${player} dari permainan?`;
      isDanger = true;
      confirmText = 'Kick Pemain';
    } else if (action === 'op') {
      title = 'Jadikan Operator';
      message = `Apakah Anda yakin ingin memberikan hak akses Operator (OP) kepada ${player}?`;
      confirmText = 'Jadikan Operator';
    } else if (action === 'deop') {
      title = 'Hapus Operator';
      message = `Apakah Anda yakin ingin mencabut hak akses Operator (OP) dari ${player}?`;
      confirmText = 'Hapus Operator';
    }

    setConfirmConfig({
      isOpen: true,
      title,
      message,
      isDanger,
      confirmText,
      onConfirm: async () => {
        setActionLoading(`${player}-${action}`);
        try {
          if (action === 'ban') {
            await api.banPlayer(port, player);
            toast.success(`${player} telah diblokir.`);
          } else {
            let command = '';
            if (action === 'op') command = `op "${player}"`;
            if (action === 'deop') command = `deop "${player}"`;
            if (action === 'kick') command = `kick "${player}" "Anda telah dikeluarkan oleh Admin."`;
            
            await api.sendCommand(port, command);
            
            if (action === 'kick') toast.success(`${player} berhasil dikeluarkan.`);
            if (action === 'op') toast.success(`${player} sekarang adalah Operator.`);
            if (action === 'deop') toast.success(`${player} bukan lagi Operator.`);
          }
          setTimeout(fetchPlayers, 1500);
        } catch (e) {
          toast.error(`Gagal mengeksekusi aksi: ${e.message}`);
        } finally {
          setActionLoading(null);
        }
      }
    });
  };

  if (status !== 'running') {
    return (
      <div className="p-6 md:p-10 pt-32 md:pt-48 text-center animate-fade-in flex-1 flex flex-col items-center justify-start h-full">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Server Tidak Berjalan</h2>
        <p className="text-zinc-400 max-w-sm mx-auto">Anda hanya dapat mengelola pemain saat server sedang aktif.</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 py-6 md:py-10 max-w-5xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manajemen Pemain</h1>
          <p className="text-zinc-400">Lihat pemain yang online dan atur akses mereka.</p>
        </div>
        <button 
          onClick={fetchPlayers}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md transition border border-zinc-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Segarkan
        </button>
      </div>

      <div className="bg-[#101010] border border-zinc-800/60 rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-zinc-800/60 bg-zinc-900/50 flex justify-between items-center">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> Pemain Online ({players.length})
          </h2>
        </div>
        
        {loading && players.length === 0 ? (
          <DataLoading text="Memuat daftar pemain online..." size="sm" />
        ) : players.length === 0 ? (
          <div className="p-10 text-center text-zinc-500">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p>Tidak ada pemain yang online saat ini.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/60">
            {players.map((player) => (
              <div key={player} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-900/30 transition">
                <div className="flex items-center gap-3">
                  <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${player}`} alt={player} className="w-10 h-10 rounded-md bg-zinc-800" />
                  <div>
                    <h3 className="font-bold text-zinc-100">{player}</h3>
                    <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">Online</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <button 
                    onClick={() => handleAction(player, 'op')}
                    disabled={actionLoading !== null}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition disabled:opacity-50"
                  >
                    {actionLoading === `${player}-op` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5" />} OP
                  </button>
                  <button 
                    onClick={() => handleAction(player, 'deop')}
                    disabled={actionLoading !== null}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 transition disabled:opacity-50"
                  >
                    {actionLoading === `${player}-deop` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldOff className="w-3.5 h-3.5" />} De-OP
                  </button>
                  <button 
                    onClick={() => handleAction(player, 'kick')}
                    disabled={actionLoading !== null}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 transition disabled:opacity-50"
                  >
                    {actionLoading === `${player}-kick` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserX className="w-3.5 h-3.5" />} Kick
                  </button>
                  <button 
                    onClick={() => handleAction(player, 'ban')}
                    disabled={actionLoading !== null}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition disabled:opacity-50"
                  >
                    {actionLoading === `${player}-ban` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Ban className="w-3.5 h-3.5" />} Ban
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        isDanger={confirmConfig.isDanger}
      />
    </div>
  );
}
