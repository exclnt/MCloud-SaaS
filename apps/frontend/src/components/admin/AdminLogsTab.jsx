import React from 'react';
import { Search, X } from 'lucide-react';

export default function AdminLogsTab({
  filteredLogs,
  paginatedLogs,
  logSearchQuery,
  setLogSearchQuery,
  logCurrentPage,
  setLogCurrentPage,
  totalLogPages,
  logsPerPage,
  setLogsPerPage,
  renderPaginationFooter
}) {
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-[#121212] p-4 rounded-xl border border-zinc-800/80">
        <div className="text-sm text-zinc-400">
          Menampilkan{" "}
          <span className="font-bold text-white">
            {filteredLogs.length}
          </span>{" "}
          log aktivitas
          {logSearchQuery && (
            <span className="text-zinc-500">
              {" "}
              untuk "{logSearchQuery}"
            </span>
          )}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari user, aksi, atau detail..."
            value={logSearchQuery}
            onChange={(e) => {
              setLogSearchQuery(e.target.value);
              setLogCurrentPage(1);
            }}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-9 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
          />
          {logSearchQuery && (
            <button
              onClick={() => {
                setLogSearchQuery("");
                setLogCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto bg-[#0a0a0a] border border-zinc-800/80 rounded-xl">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="text-xs uppercase bg-zinc-800/50 text-zinc-300">
            <tr>
              <th className="px-4 py-3.5">Waktu</th>
              <th className="px-4 py-3.5">Pengguna</th>
              <th className="px-4 py-3.5">Aksi</th>
              <th className="px-4 py-3.5">Detail</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.map((log) => (
              <tr
                key={log.id}
                className="border-b border-zinc-800/60 hover:bg-zinc-800/20 transition-colors"
              >
                <td className="px-4 py-3.5 whitespace-nowrap text-xs">
                  {new Date(log.createdAt).toLocaleString("id-ID")}
                </td>
                <td className="px-4 py-3.5 font-medium ">
                  {log.username || "Sistem"}
                </td>
                <td className="px-4 py-3.5">
                  <span className="px-2.5 py-1 bg-zinc-800/80 border border-zinc-700/50 rounded-md text-xs font-medium text-zinc-300">
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-xs font-mono break-all max-w-md text-zinc-300">
                  {log.details || "-"}
                </td>
              </tr>
            ))}
            {paginatedLogs.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-12 text-zinc-500"
                >
                  {logSearchQuery
                    ? `Tidak ada log yang cocok dengan pencarian "${logSearchQuery}"`
                    : "Tidak ada log aktivitas ditemukan"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {renderPaginationFooter(
        logCurrentPage,
        totalLogPages,
        filteredLogs.length,
        logsPerPage,
        setLogCurrentPage,
        setLogsPerPage,
        "log",
      )}
    </div>
  );
}
