import React, { useState } from "react";
import { Loader2, Save, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../services/api";

export default function AdminSettingsTab({
  socialSettings,
  setSocialSettings,
  handleSaveSettings,
  isSavingSettings,
}) {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleMaintenance = async () => {
    if (isToggling) return;
    setIsToggling(true);
    const newMode = socialSettings.maintenance_mode === 'true' ? 'false' : 'true';
    const updatedSettings = { ...socialSettings, maintenance_mode: newMode };
    setSocialSettings(updatedSettings);
    try {
      const res = await api.updateSettings(updatedSettings);
      if (res && res.settings) {
        setSocialSettings(prev => ({ ...prev, ...res.settings }));
      }
      toast.success(newMode === 'true' ? 'Mode Pemeliharaan BERHASIL DIAKTIFKAN!' : 'Mode Pemeliharaan BERHASIL DINONAKTIFKAN!');
      window.dispatchEvent(new Event('settingsUpdated'));
    } catch (err) {
      toast.error('Gagal mengubah mode maintenance: ' + err.message);
      setSocialSettings(prev => ({ ...prev, maintenance_mode: prev.maintenance_mode === 'true' ? 'false' : 'true' }));
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="max-w-4xl animate-fade-in py-2">
      <form onSubmit={handleSaveSettings} className="divide-y divide-zinc-800/60">
        {/* Maintenance Mode Section */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 mb-8 ${
          socialSettings.maintenance_mode === 'true' 
            ? 'bg-gradient-to-br from-amber-500/10 via-zinc-900/90 to-zinc-900 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.1)]' 
            : 'bg-zinc-900/50 border-zinc-800/80'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
            <div className="flex items-center gap-3.5">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                socialSettings.maintenance_mode === 'true'
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  : 'bg-zinc-800/80 border-zinc-700/50 text-zinc-400'
              }`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Mode Pemeliharaan (Maintenance Mode)</h3>
                  {socialSettings.maintenance_mode === 'true' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500 text-black uppercase tracking-wider animate-pulse">
                      Aktif
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Tutup akses pengguna publik sementara waktu dan alihkan ke halaman maintenance. Admin tetap dapat mengakses sistem.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <span className="text-xs font-semibold text-zinc-400">
                {socialSettings.maintenance_mode === 'true' ? 'Aktif' : 'Nonaktif'}
              </span>
              <button
                type="button"
                disabled={isToggling}
                onClick={handleToggleMaintenance}
                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                  socialSettings.maintenance_mode === 'true' ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-zinc-800'
                }`}
              >
                <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  socialSettings.maintenance_mode === 'true' ? 'translate-x-7' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Judul Halaman Maintenance
              </label>
              <input
                type="text"
                className="mt-1.5 w-full bg-zinc-950/80 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-white text-sm outline-none focus:border-amber-500 transition-colors"
                placeholder="Pemeliharaan Sistem MCloud"
                value={socialSettings.maintenance_title || ""}
                onChange={(e) => setSocialSettings({ ...socialSettings, maintenance_title: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Estimasi Selesai (ETA)
              </label>
              <input
                type="text"
                className="mt-1.5 w-full bg-zinc-950/80 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-white text-sm font-mono outline-none focus:border-amber-500 transition-colors"
                placeholder="Contoh: Segera / 18:00 WIB / 2 Jam"
                value={socialSettings.maintenance_eta || ""}
                onChange={(e) => setSocialSettings({ ...socialSettings, maintenance_eta: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Pesan Penjelasan kepada Klien
              </label>
              <textarea
                rows="2"
                className="mt-1.5 w-full bg-zinc-950/80 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-white text-sm outline-none focus:border-amber-500 transition-colors resize-none"
                placeholder="Kami sedang melakukan pemeliharaan rutin..."
                value={socialSettings.maintenance_message || ""}
                onChange={(e) => setSocialSettings({ ...socialSettings, maintenance_message: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="pt-4 pb-2">
          <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Tautan Sosial Media & Bantuan</h4>
        </div>

        <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div>
            <label className="text-sm font-semibold text-zinc-200">
              Discord
            </label>
            <p className="text-xs text-zinc-500 mt-0.5">
              Tautan undangan server komunitas Discord resmi.
            </p>
          </div>
          <div className="md:col-span-2">
            <input
              type="url"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-white text-sm outline-none focus:border-emerald-500 transition-colors"
              placeholder="https://discord.gg/mcloud"
              value={socialSettings.social_discord || ""}
              onChange={(e) =>
                setSocialSettings({
                  ...socialSettings,
                  social_discord: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div>
            <label className="text-sm font-semibold text-zinc-200">
              WhatsApp
            </label>
            <p className="text-xs text-zinc-500 mt-0.5">
              Tautan kontak bantuan cepat WhatsApp (format wa.me).
            </p>
          </div>
          <div className="md:col-span-2">
            <input
              type="text"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-white text-sm outline-none focus:border-emerald-500 transition-colors"
              placeholder="https://wa.me/6281234567890"
              value={socialSettings.social_whatsapp || ""}
              onChange={(e) =>
                setSocialSettings({
                  ...socialSettings,
                  social_whatsapp: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div>
            <label className="text-sm font-semibold text-zinc-200">
              Instagram
            </label>
            <p className="text-xs text-zinc-500 mt-0.5">
              Tautan profil Instagram resmi MCloud.
            </p>
          </div>
          <div className="md:col-span-2">
            <input
              type="url"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-white text-sm outline-none focus:border-emerald-500 transition-colors"
              placeholder="https://instagram.com/mcloud.id"
              value={socialSettings.social_instagram || ""}
              onChange={(e) =>
                setSocialSettings({
                  ...socialSettings,
                  social_instagram: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div>
            <label className="text-sm font-semibold text-zinc-200">
              X (Twitter)
            </label>
            <p className="text-xs text-zinc-500 mt-0.5">
              Tautan profil akun X (Twitter) resmi.
            </p>
          </div>
          <div className="md:col-span-2">
            <input
              type="url"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-white text-sm outline-none focus:border-emerald-500 transition-colors"
              placeholder="https://x.com/mcloud_id"
              value={socialSettings.social_twitter || ""}
              onChange={(e) =>
                setSocialSettings({
                  ...socialSettings,
                  social_twitter: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div>
            <label className="text-sm font-semibold text-zinc-200">
              Email Bantuan
            </label>
            <p className="text-xs text-zinc-500 mt-0.5">
              Alamat surel atau tautan mailto untuk dukungan teknis.
            </p>
          </div>
          <div className="md:col-span-2">
            <input
              type="text"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-white text-sm outline-none focus:border-emerald-500 transition-colors"
              placeholder="mailto:support@mcloud.id"
              value={socialSettings.social_email || ""}
              onChange={(e) =>
                setSocialSettings({
                  ...socialSettings,
                  social_email: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="py-6 flex items-center justify-end">
          <button
            type="submit"
            disabled={isSavingSettings}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 text-black font-bold rounded-lg transition-colors flex items-center gap-2 text-sm shadow-sm"
          >
            {isSavingSettings ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
