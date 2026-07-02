import React from 'react';
import { Server, X } from 'lucide-react';
import CustomSelect from '../../CustomSelect';

export default function AdminCreateServerModal({ 
  userModal, 
  onClose, 
  onSubmit, 
  newServerData, 
  setNewServerData, 
  plans = [] 
}) {
  if (!userModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-400" /> Buat Server untuk {userModal.username}
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
              Nama Server
            </label>
            <input
              type="text"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-blue-500 transition-colors"
              placeholder="misal: Dunia Alex"
              value={newServerData.name}
              onChange={(e) =>
                setNewServerData({
                  ...newServerData,
                  name: e.target.value,
                })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Paket RAM (Harga)
              </label>
              <CustomSelect
                value={newServerData.memoryLimit}
                onChange={(e) =>
                  setNewServerData({
                    ...newServerData,
                    memoryLimit: e.target.value,
                  })
                }
              >
                {plans && plans.length > 0 ? (
                  plans.map((p) => {
                    const val = p.ram
                      .toLowerCase()
                      .replace("mb", "m")
                      .replace("gb", "g");
                    const finalPrice =
                      p.price - (p.price * (p.discount || 0)) / 100;
                    return (
                      <option key={p.id} value={val}>
                        {p.name} ({p.ram}) - Rp {finalPrice.toLocaleString("id-ID")}/bln
                      </option>
                    );
                  })
                ) : (
                  <>
                    <option value="500m">
                      Villager (500MB) - Rp 30.000/bln
                    </option>
                    <option value="1g">
                      Spider (1GB) - Rp 40.000/bln
                    </option>
                    <option value="2g">
                      Slime (2GB) - Rp 50.000/bln
                    </option>
                    <option value="4g">
                      Wither (4GB) - Rp 60.000/bln
                    </option>
                  </>
                )}
              </CustomSelect>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Masa Aktif
              </label>
              <CustomSelect
                value={newServerData.days}
                onChange={(e) =>
                  setNewServerData({
                    ...newServerData,
                    days: e.target.value,
                  })
                }
              >
                <option value="30">30 Hari</option>
                <option value="60">60 Hari</option>
                <option value="90">90 Hari</option>
                <option value="365">1 Tahun</option>
                <option value="permanent">Permanen</option>
              </CustomSelect>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Mode Permainan
              </label>
              <CustomSelect
                value={newServerData.gamemode}
                onChange={(e) =>
                  setNewServerData({
                    ...newServerData,
                    gamemode: e.target.value,
                  })
                }
              >
                <option value="survival">Survival</option>
                <option value="creative">Creative</option>
                <option value="adventure">Adventure</option>
              </CustomSelect>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Tingkat Kesulitan
              </label>
              <CustomSelect
                value={newServerData.difficulty}
                onChange={(e) =>
                  setNewServerData({
                    ...newServerData,
                    difficulty: e.target.value,
                  })
                }
              >
                <option value="peaceful">Peaceful</option>
                <option value="easy">Easy</option>
                <option value="normal">Normal</option>
                <option value="hard">Hard</option>
              </CustomSelect>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
              Versi Minecraft Server
            </label>
            <CustomSelect
              value={
                newServerData.version === "latest" ||
                newServerData.version === "preview"
                  ? newServerData.version
                  : "custom"
              }
              onChange={(e) => {
                if (e.target.value !== "custom") {
                  setNewServerData({
                    ...newServerData,
                    version: e.target.value,
                  });
                } else {
                  setNewServerData({ ...newServerData, version: "" });
                }
              }}
            >
              <option value="latest">Rilis Terbaru (Latest)</option>
              <option value="preview">Preview (Beta)</option>
              <option value="custom">Versi Kustom...</option>
            </CustomSelect>
            {newServerData.version !== "latest" &&
              newServerData.version !== "preview" && (
                <input
                  type="text"
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-white text-sm outline-none focus:border-blue-500 transition-colors mt-2"
                  placeholder="misal: 1.20.10.01"
                  value={newServerData.version}
                  onChange={(e) =>
                    setNewServerData({
                      ...newServerData,
                      version: e.target.value,
                    })
                  }
                />
              )}
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-blue-600/20"
            >
              Deploy Server
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
