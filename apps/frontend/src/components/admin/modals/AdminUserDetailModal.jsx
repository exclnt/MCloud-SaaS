import React from 'react';
import { Server, X, StopCircle, Trash2 } from 'lucide-react';

export default function AdminUserDetailModal({ 
  userModal, 
  onClose, 
  servers = [], 
  onOpenCreateServer, 
  handleServerAction, 
  handleExtendServer, 
  formatUptime, 
  formatRemainingDays 
}) {
  if (!userModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-6 w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6 border-b border-zinc-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">
                {userModal.username}
              </h3>
              <span
                className={`px-2 py-0.5 rounded text-xs ${userModal.role === "admin" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-zinc-800 text-zinc-400 border border-zinc-700"}`}
              >
                {userModal.role}
              </span>
            </div>
            <p className="text-sm text-zinc-400 mt-1">
              {userModal.email} · ID: #{userModal.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-400" /> Daftar Server Milik {userModal.username}
          </h4>
          <button
            onClick={() => onOpenCreateServer(userModal)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-lg shadow-blue-600/20"
          >
            + Buat Server untuk Pengguna Ini
          </button>
        </div>

        <div className="overflow-x-auto bg-[#0a0a0a] border border-zinc-800/80 rounded-xl mb-6">
          <table className="w-full text-left text-xs text-zinc-400">
            <thead className="uppercase bg-zinc-800/50 text-zinc-300 border-b border-zinc-800">
              <tr>
                <th className="px-3 py-2.5">ID</th>
                <th className="px-3 py-2.5">Nama Server</th>
                <th className="px-3 py-2.5">Status</th>
                <th className="px-3 py-2.5">Port</th>
                <th className="px-3 py-2.5">Masa Aktif</th>
                <th className="px-3 py-2.5">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {servers
                .filter(
                  (s) =>
                    s.userId === userModal.id ||
                    s.owner === userModal.username,
                )
                .map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="px-3 py-2.5 font-mono">#{s.id}</td>
                    <td className="px-3 py-2.5 font-medium text-white">
                      {s.name}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${s.status === "running" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono" : "bg-red-500/20 text-red-400 border border-red-500/30 uppercase"}`}
                      >
                        {s.status === "running" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        )}
                        <span>
                          {s.status === "running"
                            ? `Aktif: ${formatUptime ? formatUptime(s.uptime || 0) : ''}`
                            : s.status === "stopped"
                            ? "Berhenti"
                            : s.status === "offline"
                            ? "Offline"
                            : s.status}
                        </span>
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-zinc-300">
                      {s.port}
                    </td>
                    <td className="px-3 py-2.5">
                      {formatRemainingDays ? formatRemainingDays(s.expiresAt) : ''}
                    </td>
                    <td className="px-3 py-2.5 flex flex-wrap gap-1">
                      {s.status === "running" && (
                        <button
                          onClick={() => handleServerAction(s.port, "stop")}
                          className="p-1 text-zinc-400 hover:text-amber-400 hover:bg-amber-400/10 rounded transition-colors"
                          title="Matikan Server"
                        >
                          <StopCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleServerAction(s.port, "delete")}
                        className="p-1 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                        title="Hapus Server"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleExtendServer(s.id, 30)}
                        className="px-2 py-0.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[10px] rounded border border-blue-500/20 transition-colors"
                      >
                        +30 Hari
                      </button>
                      <button
                        onClick={() => handleExtendServer(s.id, "permanent")}
                        className="px-2 py-0.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-[10px] rounded border border-purple-500/20 transition-colors"
                      >
                        Permanen
                      </button>
                    </td>
                  </tr>
                ))}
              {servers.filter(
                (s) =>
                  s.userId === userModal.id ||
                  s.owner === userModal.username,
              ).length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-zinc-500">
                    Pengguna ini belum memiliki server
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            Tutup Detail
          </button>
        </div>
      </div>
    </div>
  );
}
