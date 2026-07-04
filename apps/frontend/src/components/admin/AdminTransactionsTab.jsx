import React from 'react';
import { DollarSign, Activity, CheckCircle, Shield, Search, X, Eye } from 'lucide-react';
import AdminStatCard from './AdminStatCard';

export default function AdminTransactionsTab({
  totalRevenueIdr,
  transactions,
  successTrxCount,
  adminManualTrxCount,
  filteredTransactions,
  trxSearchQuery,
  setTrxSearchQuery,
  setTrxCurrentPage,
  paginatedTransactions,
  setShowTrxDetailModal,
  trxCurrentPage,
  totalTrxPages,
  trxPerPage,
  setTrxPerPage,
  renderPaginationFooter
}) {
  return (
    <div className="animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <AdminStatCard
          title="Total Pendapatan"
          icon={<DollarSign className="w-4 h-4 text-emerald-400" />}
          value={`Rp ${totalRevenueIdr.toLocaleString("id-ID")}`}
          subtitle="Pembayaran sukses Midtrans"
        />
        <AdminStatCard
          title="Total Transaksi"
          icon={<Activity className="w-4 h-4 text-blue-400" />}
          value={transactions.length}
          subtitle="Semua riwayat pesanan"
        />
        <AdminStatCard
          title="Transaksi Berhasil"
          icon={<CheckCircle className="w-4 h-4 text-emerald-400" />}
          value={successTrxCount}
          subtitle="Status success / dibayar"
        />
        <AdminStatCard
          title="Admin Manual"
          icon={<Shield className="w-4 h-4 text-purple-400" />}
          value={adminManualTrxCount}
          subtitle="Aksi perpanjangan / pembuatan admin"
        />
      </div>

      {/* Search & List */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-[#121212] p-4 rounded-xl border border-zinc-800/80">
        <div className="text-sm text-zinc-400">
          Menampilkan{" "}
          <span className="font-bold text-white">
            {filteredTransactions.length}
          </span>{" "}
          transaksi
          {trxSearchQuery && (
            <span className="text-zinc-500">
              {" "}
              untuk "{trxSearchQuery}"
            </span>
          )}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari order ID, username, paket..."
            value={trxSearchQuery}
            onChange={(e) => {
              setTrxSearchQuery(e.target.value);
              setTrxCurrentPage(1);
            }}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-9 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
          />
          {trxSearchQuery && (
            <button
              onClick={() => {
                setTrxSearchQuery("");
                setTrxCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto bg-[#121212] border border-zinc-800/80 rounded-xl">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="text-xs uppercase bg-zinc-900/80 text-zinc-300">
            <tr>
              <th className="px-4 py-3.5">Order ID</th>
              <th className="px-4 py-3.5">Tanggal</th>
              <th className="px-4 py-3.5">Pengguna</th>
              <th className="px-4 py-3.5">Paket</th>
              <th className="px-4 py-3.5">Jumlah</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-right">Struk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {paginatedTransactions.map((trx) => {
              let cfg = {};
              try {
                if (trx.config) cfg = typeof trx.config === 'string' ? JSON.parse(trx.config) : trx.config;
              } catch (e) {}
              const orderId = trx.orderId || cfg.orderId || (trx.snapToken ? `MCLOUD-${trx.id}` : `TRX-${trx.id}`);
              let planName = trx.planName || cfg.planName || cfg.plan || '-';
              if (planName === '-') {
                if (cfg.renew) planName = 'Perpanjangan Server';
                else if (cfg.memoryLimit || cfg.ram) {
                  const ram = String(cfg.memoryLimit || cfg.ram).toLowerCase();
                  if (ram === '500m' || ram === '500mb') planName = 'Villager';
                  else if (ram === '1g' || ram === '1gb') planName = 'Spider';
                  else if (ram === '2g' || ram === '2gb') planName = 'Slime';
                  else if (ram === '4g' || ram === '4gb') planName = 'Wither';
                  else planName = `Custom (${ram.toUpperCase()})`;
                } else if (trx.amount) {
                  if (trx.amount === 15000 || trx.amount === 30000) planName = 'Villager';
                  else if (trx.amount === 25000 || trx.amount === 40000) planName = 'Spider';
                  else if (trx.amount === 50000 || trx.amount === 80000) planName = 'Slime';
                  else if (trx.amount === 100000 || trx.amount === 160000) planName = 'Wither';
                  else planName = 'Layanan MCloud';
                }
              }
              return (
                <tr
                  key={trx.id}
                  className="hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-4 py-3.5 font-mono text-xs text-white">
                    {orderId}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-xs">
                    {new Date(trx.createdAt).toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3.5 font-medium ">
                    {trx.username}
                  </td>
                  <td className="px-4 py-3.5 text-white">
                    {planName}
                  </td>
                  <td className="px-4 py-3.5 font-mono ">
                    Rp {trx.amount.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        trx.status === "success" || trx.status === "settlement"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : trx.status === "pending"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {trx.status === "success" || trx.status === "settlement"
                        ? "Sukses"
                        : trx.status === "pending"
                        ? "Tertunda"
                        : trx.status === "failed" || trx.status === "cancel" || trx.status === "expire" || trx.status === "deny"
                        ? "Gagal"
                        : trx.status === "admin_manual"
                        ? "Admin Manual"
                        : trx.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => setShowTrxDetailModal(trx)}
                      className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 ml-auto border border-zinc-700"
                    >
                      <Eye className="w-3.5 h-3.5 " /> Lihat Struk
                    </button>
                  </td>
                </tr>
              );
            })}
            {paginatedTransactions.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-12 text-zinc-500">
                  {trxSearchQuery
                    ? `Tidak ada transaksi untuk "${trxSearchQuery}"`
                    : "Belum ada transaksi di sistem"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {renderPaginationFooter(
        trxCurrentPage,
        totalTrxPages,
        filteredTransactions.length,
        trxPerPage,
        setTrxCurrentPage,
        setTrxPerPage,
        "transaksi",
      )}
    </div>
  );
}
