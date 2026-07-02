import React from 'react';
import { Save, Loader2, Edit2, X } from 'lucide-react';

export default function AdminPlansTab({
  resourcePool,
  poolInput,
  setPoolInput,
  handleSaveResourcePool,
  isSavingPool,
  plans,
  editingPlan,
  setEditingPlan,
  editPrice,
  setEditPrice,
  editDiscount,
  setEditDiscount,
  handleSavePlan
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Resource Pool Card */}
      <div className="bg-[#101010] border border-primary/30 shadow-[0_0_20px_rgba(16,185,129,0.1)] rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse inline-block"></span>
              Ketersediaan Resource Server (Total Pool RAM)
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Atur total RAM fisik yang tersedia untuk disewa oleh seluruh pengguna MCloud. Paket yang melebihi sisa RAM tidak akan dapat dibeli.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="number"
                value={poolInput}
                onChange={(e) => setPoolInput(e.target.value)}
                placeholder="Total RAM (MB)"
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm w-36 focus:border-primary outline-none pr-12 font-mono"
              />
              <span className="absolute right-3 top-2.5 text-xs text-zinc-500 font-bold">
                MB
              </span>
            </div>
            <button
              onClick={handleSaveResourcePool}
              disabled={isSavingPool}
              className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-bold text-sm transition flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSavingPool ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Simpan
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-zinc-800/80">
          <div className="bg-zinc-900/60 p-4 rounded-lg border border-zinc-800">
            <div className="text-xs text-zinc-400 mb-1">
              Total Pool RAM
            </div>
            <div className="text-xl font-extrabold text-white font-mono">
              {resourcePool?.totalRamMB >= 1024
                ? `${(resourcePool.totalRamMB / 1024).toFixed(1)} GB`
                : `${resourcePool?.totalRamMB || 0} MB`}
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">
              ({resourcePool?.totalRamMB || 0} MB)
            </div>
          </div>
          <div className="bg-zinc-900/60 p-4 rounded-lg border border-zinc-800">
            <div className="text-xs text-zinc-400 mb-1">
              RAM Terpakai
            </div>
            <div className="text-xl font-extrabold text-amber-400 font-mono">
              {resourcePool?.usedRamMB >= 1024
                ? `${(resourcePool.usedRamMB / 1024).toFixed(1)} GB`
                : `${resourcePool?.usedRamMB || 0} MB`}
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">
              Oleh {resourcePool?.totalServers || 0} Server Aktif
            </div>
          </div>
          <div className="bg-zinc-900/60 p-4 rounded-lg border border-zinc-800">
            <div className="text-xs text-zinc-400 mb-1">
              Sisa RAM Tersedia
            </div>
            <div
              className={`text-xl font-extrabold font-mono ${resourcePool?.availableRamMB <= 500 ? "text-red-400" : "text-emerald-400"}`}
            >
              {resourcePool?.availableRamMB >= 1024
                ? `${(resourcePool.availableRamMB / 1024).toFixed(1)} GB`
                : `${resourcePool?.availableRamMB || 0} MB`}
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">
              Siap dialokasikan
            </div>
          </div>
          <div className="bg-zinc-900/60 p-4 rounded-lg border border-zinc-800 flex flex-col justify-center">
            <div className="text-xs text-zinc-400 mb-1.5">
              Status Penyewaan
            </div>
            <div>
              {resourcePool?.totalRamMB <= 0 ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                  Ditutup (0 MB)
                </span>
              ) : resourcePool?.availableRamMB < 500 ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Kapasitas Penuh
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Tersedia Normal
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map((p) => (
          <div
            key={p.id}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 hover:border-zinc-700 transition"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">
                  {p.name}
                </h3>
                {p.available === false && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wider">
                    Stok Habis
                  </span>
                )}
              </div>
              <span className="text-zinc-500 text-sm font-mono">
                RAM: {p.ram}
              </span>
            </div>

            {editingPlan === p.id ? (
              <div className="space-y-4 bg-zinc-950 p-4 rounded-md border border-zinc-800 animate-in fade-in">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">
                    Harga (IDR)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white outline-none focus:border-emerald-500 font-mono"
                    value={editPrice}
                    onChange={(e) =>
                      setEditPrice(e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">
                    Diskon (%)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white outline-none focus:border-emerald-500 font-mono"
                    value={editDiscount}
                    onChange={(e) =>
                      setEditDiscount(e.target.value)
                    }
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={() => setEditingPlan(null)}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleSavePlan(p.id)}
                    className="p-2 text-emerald-400 hover:bg-emerald-500/20 bg-emerald-500/10 rounded transition"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Harga:</span>
                  <span className="text-white font-medium font-mono">
                    Rp {p.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">
                    Diskon:
                  </span>
                  <span
                    className={
                      p.discount > 0
                        ? "text-emerald-400 font-medium font-mono"
                        : "text-zinc-500 font-mono"
                    }
                  >
                    {p.discount}%
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-zinc-800 mt-2">
                  <span className="text-zinc-400">
                    Harga Akhir:
                  </span>
                  <span className="text-emerald-500 font-bold font-mono">
                    Rp {(
                      p.price -
                      (p.price * p.discount) / 100
                    ).toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setEditingPlan(p.id);
                    setEditPrice(p.price);
                    setEditDiscount(p.discount);
                  }}
                  className="mt-4 w-full py-2 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded transition-colors text-sm font-semibold"
                >
                  <Edit2 className="w-4 h-4" /> Edit Paket
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
