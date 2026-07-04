import React from 'react';
import { Search, X, StopCircle, Trash2 } from 'lucide-react';

export default function AdminServersTab({
  filteredServers,
  serverSearchQuery,
  setServerSearchQuery,
  setServerCurrentPage,
  paginatedServers,
  formatUptime,
  formatRemainingDays,
  handleServerAction,
  handleExtendServer,
  serverCurrentPage,
  totalServerPages,
  serversPerPage,
  setServersPerPage,
  renderPaginationFooter
}) {
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-[#121212] p-4 rounded-xl border border-zinc-800/80">
        <div className="text-sm text-zinc-400">
          Menampilkan{" "}
          <span className="font-bold text-white">
            {filteredServers.length}
          </span>{" "}
          server
          {serverSearchQuery && (
            <span className="text-zinc-500">
              {" "}
              untuk "{serverSearchQuery}"
            </span>
          )}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari server, pemilik, port, ID..."
            value={serverSearchQuery}
            onChange={(e) => {
              setServerSearchQuery(e.target.value);
              setServerCurrentPage(1);
            }}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-9 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
          />
          {serverSearchQuery && (
            <button
              onClick={() => {
                setServerSearchQuery("");
                setServerCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto bg-[#101010] border border-zinc-800 rounded-xl">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="text-xs uppercase bg-zinc-800/50 text-zinc-300 border-b border-zinc-800">
            <tr>
              <th className="px-4 py-3.5">ID</th>
              <th className="px-4 py-3.5">Nama</th>
              <th className="px-4 py-3.5">Pemilik</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Port</th>
              <th className="px-4 py-3.5">Masa Aktif</th>
              <th className="px-4 py-3.5">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedServers.map((s) => (
              <tr
                key={s.id}
                className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
              >
                <td className="px-4 py-3.5 font-mono">
                  #{s.id}
                </td>
                <td className="px-4 py-3.5 font-medium text-white">
                  {s.name}
                </td>
                <td className="px-4 py-3.5">{s.owner}</td>
                <td className="px-4 py-3.5">
                  <span
                    className={` py-1 text-xs font-bold inline-flex items-center gap-1.5 ${s.status === "running" ? " text-emerald-400  font-mono" : " text-red-400  uppercase"}`}
                  >
                    {s.status === "running" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    )}
                    <span>
                      {s.status === "running"
                        ? `Aktif: ${formatUptime(s.uptime || 0)}`
                        : s.status === "stopped"
                        ? "Berhenti"
                        : s.status === "offline"
                        ? "Offline"
                        : s.status}
                    </span>
                  </span>
                </td>
                <td className="px-4 py-3.5 font-mono text-zinc-300">
                  {s.port}
                </td>
                <td className="px-4 py-3.5">
                  {formatRemainingDays(s.expiresAt)}
                </td>
                <td className="px-4 py-3.5 flex flex-wrap items-center gap-1.5">
                  {s.status === "running" && (
                    <button
                      onClick={() =>
                        handleServerAction(s.port, "stop")
                      }
                      className="p-1.5 text-zinc-400 hover:text-amber-400 hover:bg-amber-400/10 rounded border border-transparent hover:border-amber-400/30 transition-colors"
                      title="Matikan Server"
                    >
                      <StopCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() =>
                      handleServerAction(s.port, "delete")
                    }
                    className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded border border-transparent hover:border-red-400/30 transition-colors"
                    title="Hapus Server"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleExtendServer(s.id, 30)}
                    className="px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/20 transition-colors font-semibold"
                    title="Perpanjang 30 Hari"
                  >
                    +30 Hari
                  </button>
                  <button
                    onClick={() =>
                      handleExtendServer(s.id, "permanent")
                    }
                    className="px-2 py-1 bg-zinc-500/10 hover:bg-zinc-500/20 text-zinc-200 text-xs rounded border border-zinc-500/20 transition-colors font-semibold"
                    title="Jadikan Permanen"
                  >
                    Permanen
                  </button>
                </td>
              </tr>
            ))}
            {paginatedServers.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-12 text-zinc-500"
                >
                  {serverSearchQuery
                    ? `Tidak ada server yang cocok dengan pencarian "${serverSearchQuery}"`
                    : "Tidak ada server ditemukan"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {renderPaginationFooter(
        serverCurrentPage,
        totalServerPages,
        filteredServers.length,
        serversPerPage,
        setServerCurrentPage,
        setServersPerPage,
        "server",
      )}
    </div>
  );
}
