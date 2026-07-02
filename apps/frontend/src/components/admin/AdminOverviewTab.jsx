import React from 'react';
import { Server, CheckCircle, Users, DollarSign } from 'lucide-react';

export default function AdminOverviewTab({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 animate-fade-in">
      {/* Total Servers */}
      <div className="bg-[#101010] border border-zinc-800/60 rounded-xl p-5 hover:border-zinc-700/80 transition">
        <div className="flex items-center gap-2 text-zinc-400 mb-4 text-xs font-bold uppercase tracking-wider">
          <Server className="w-4 h-4 text-primary" /> Total Server
        </div>
        <div className="text-3xl font-bold text-white mb-1">
          {stats?.totalServers || 0}
        </div>
        <div className="text-xs text-zinc-500">
          Semua server terdaftar
        </div>
      </div>

      {/* Active Servers */}
      <div className="bg-[#101010] border border-zinc-800/60 rounded-xl p-5 hover:border-zinc-700/80 transition">
        <div className="flex items-center gap-2 text-zinc-400 mb-4 text-xs font-bold uppercase tracking-wider">
          <CheckCircle className="w-4 h-4 text-emerald-400" /> Server Aktif
        </div>
        <div className="text-3xl font-bold text-white mb-1">
          {stats?.activeServers || 0}
        </div>
        <div className="text-xs text-zinc-500">
          Server yang sedang berjalan
        </div>
      </div>

      {/* Total Users */}
      <div className="bg-[#101010] border border-zinc-800/60 rounded-xl p-5 hover:border-zinc-700/80 transition">
        <div className="flex items-center gap-2 text-zinc-400 mb-4 text-xs font-bold uppercase tracking-wider">
          <Users className="w-4 h-4 text-blue-400" /> Total Pengguna
        </div>
        <div className="text-3xl font-bold text-white mb-1">
          {stats?.totalUsers || 0}
        </div>
        <div className="text-xs text-zinc-500">
          Semua pengguna terdaftar
        </div>
      </div>

      {/* Total Revenue */}
      <div className="bg-[#101010] border border-zinc-800/60 rounded-xl p-5 hover:border-zinc-700/80 transition">
        <div className="flex items-center gap-2 text-zinc-400 mb-4 text-xs font-bold uppercase tracking-wider">
          <DollarSign className="w-4 h-4 text-emerald-400" /> Pendapatan
        </div>
        <div className="text-3xl font-bold  font-mono mb-1">
          Rp {(stats?.totalRevenue || 0).toLocaleString("id-ID")}
        </div>
        <div className="text-xs text-zinc-500">
          Total pembayaran sukses
        </div>
      </div>
    </div>
  );
}
