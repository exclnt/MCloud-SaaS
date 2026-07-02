import React from "react";
import { Loader2, Save } from "lucide-react";

export default function AdminSettingsTab({
  socialSettings,
  setSocialSettings,
  handleSaveSettings,
  isSavingSettings,
}) {
  return (
    <div className="max-w-4xl animate-fade-in py-2">
      <form onSubmit={handleSaveSettings} className="divide-y divide-zinc-800/60">
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
