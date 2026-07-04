import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";

const CHANGELOG_TAGS = [
  { id: "all", label: "Semua Rilis" },
  { id: "feature", label: "Fitur Baru" },
  { id: "improvement", label: "Peningkatan" },
  { id: "security", label: "Keamanan" },
  { id: "bugfix", label: "Perbaikan" },
];

const CHANGELOG_DATA = [
  {
    version: "v1.5.0",
    date: "3 Juli 2026",
    title: "Peningkatan Dasbor Admin, Real-Time Polling & Ikhtisar Tiket",
    isLatest: true,
    verified: true,
    summary:
      "Rilis pembaruan besar yang memfokuskan efisiensi alur kerja Administrator, otomatisasi sinkronisasi status tiket bantuan, serta perbaikan tampilan area pengguna.",
    changes: [
      {
        type: "feature",
        tag: "Feature",
        text: "Ikhtisar Tiket Bantuan Terbaru: Widget 2-kolom baru pada halaman Dasbor Admin untuk memantau 5 tiket terbaru secara dinamis beserta visualisasi progress bar distribusi status tiket.",
      },
      {
        type: "improvement",
        tag: "Improvement",
        text: "Sinkronisasi Balasan Klien & Polling: Integrasi real-time polling dan otomatisasi perubahan status tiket dari in_progress atau resolved kembali ke Open ketika pengguna membalas pesan.",
      },
      {
        type: "feature",
        tag: "Feature",
        text: "Paginasi Riwayat Transaksi: Kustomisasi jumlah item per halaman (5, 10, 25, 50) dengan smart page numbering dan elipsis pada halaman Area Klien.",
      },
      {
        type: "improvement",
        tag: "Improvement",
        text: "Header Khusus Dasbor Admin: Pemisahan komponen AdminNavbar berdesain ultra-minimalis yang menghapus reduksi navigasi klien pada Dasbor Admin.",
      },
      {
        type: "bugfix",
        tag: "Bugfix",
        text: "Perbaikan Tampilan Lampiran Gambar: Memperbaiki bug z-index pada lampiran gambar di dalam percakapan tiket agar ditampilkan dengan rapi di atas gelembung chat.",
      },
    ],
  },
  {
    version: "v1.4.0",
    date: "18 Juni 2026",
    title: "Sistem Auto-Deploy Docker & Konsol Server Interaktif",
    verified: true,
    summary:
      "Menghadirkan konsol terminal real-time berbasis WebSocket dan manajer berkas web interaktif untuk seluruh server Minecraft.",
    changes: [
      {
        type: "feature",
        tag: "Feature",
        text: "Konsol Server Real-Time: Integrasi terminal xterm.js dengan koneksi WebSocket untuk memantau log server Minecraft dan mengirim perintah langsung dari browser.",
      },
      {
        type: "feature",
        tag: "Feature",
        text: "Web File Manager: Manajemen berkas berbasis web dengan editor teks sintaks highlight, drag-and-drop upload, serta ekstraksi ZIP instan.",
      },
      {
        type: "improvement",
        tag: "Improvement",
        text: "Payment Gateway QRIS Instan: Otomatisasi verifikasi pembayaran via QRIS dan Virtual Account dengan durasi aktivasi server di bawah 60 detik.",
      },
      {
        type: "security",
        tag: "Security",
        text: "Enkripsi Sesi Terminal: Peningkatan protokol keamanan token autentikasi pada saat terhubung ke port konsol kontainer.",
      },
    ],
  },
  {
    version: "v1.3.0",
    date: "25 Mei 2026",
    title: "Upgrade Node RAM DDR5 & Proteksi Anti-DDoS Berlapis",
    verified: true,
    summary:
      "Peningkatan spesifikasi perangkat keras infrastruktur MCloud dan implementasi proteksi serangan siber khusus game server.",
    changes: [
      {
        type: "improvement",
        tag: "Improvement",
        text: "Infrastruktur Node Gen-4: Upgrade perangkat keras ke prosesor berkecepatan tinggi dengan penyimpanan NVMe SSD Enterprise.",
      },
      {
        type: "security",
        tag: "Security",
        text: "Anti-DDoS Game Shield: Filter perlindungan Layer 3/4/7 khusus untuk mitigasi serangan UDP flood pada port Minecraft 25565 dan Bedrock 19132.",
      },
      {
        type: "feature",
        tag: "Feature",
        text: "Sub-Users Kolaborator: Fitur undang anggota tim atau admin tambahan dengan hak akses perizinan yang dapat dikustomisasi.",
      },
    ],
  },
  {
    version: "v1.2.0",
    date: "14 April 2026",
    title: "Peluncuran Area Klien & Manajemen Tagihan Terpadu",
    verified: true,
    summary:
      "Perilisan sistem manajemen tagihan dan perpanjangan layanan otomatis untuk kenyamanan pelanggan.",
    changes: [
      {
        type: "feature",
        tag: "Feature",
        text: "Area Klien Terpadu: Dasbor manajemen pesanan, pemantauan status tagihan, dan histori transaksi lengkap.",
      },
      {
        type: "feature",
        tag: "Feature",
        text: "Sistem Tiket CS & Live Chat: Fitur kirim pesan dan lampiran gambar untuk komunikasi langsung antara klien dan teknisi.",
      },
      {
        type: "bugfix",
        tag: "Bugfix",
        text: "Perbaikan Kalkulasi Prorata: Penyempurnaan logika penghitungan biaya selisih saat upgrade dan downgrade spesifikasi server.",
      },
    ],
  },
  {
    version: "v1.0.0",
    date: "1 Maret 2026",
    title: "Peluncuran Perdana MCloud Hosting Platform",
    verified: true,
    summary:
      "Peluncuran resmi platform hosting Minecraft mCloud di Indonesia dengan dukungan penuh untuk modpack dan kustomisasi server.",
    changes: [
      {
        type: "feature",
        tag: "Feature",
        text: "Peluncuran Resmi: MCloud resmi beroperasi melayani komunitas Minecraft Indonesia dengan harga terjangkau dan performa maksimal.",
      },
      {
        type: "feature",
        tag: "Feature",
        text: "Dukungan Berbagai Modpack: Pilihan instalasi instan Paper, Purpur, Forge, Fabric, Vanilla, BungeeCord, dan Velocity.",
      },
      {
        type: "feature",
        tag: "Feature",
        text: "Dasbor Monitoring: Grafik penggunaan CPU, RAM, dan penyimpanan aktual secara real-time.",
      },
    ],
  },
];

export default function ChangelogPage() {
  const [activeTag, setActiveTag] = useState("all");
  const navigate = useNavigate();

  const getBadgeStyle = (type) => {
    switch (type) {
      case "feature":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "improvement":
        return "bg-sky-500/10 text-sky-400 border-sky-500/30";
      case "security":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "bugfix":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      default:
        return "bg-zinc-800 text-zinc-400 border-zinc-700";
    }
  };

  // Filter perubahan di dalam tiap versi
  const filteredChangelogs = useMemo(() => {
    if (activeTag === "all") return CHANGELOG_DATA;

    return CHANGELOG_DATA.map((release) => {
      const matchingChanges = release.changes.filter((c) => c.type === activeTag);
      if (matchingChanges.length === 0) return null;
      return {
        ...release,
        changes: matchingChanges,
      };
    }).filter(Boolean);
  }, [activeTag]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-zinc-800 pb-20">
      {/* Gunakan max-w-4xl agar tidak terlalu sempit dan mengurangi wrap teks yang memakan tinggi layar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        {/* Navigasi Atas Compact & Rapi */}
        <div className="mb-6 flex items-center justify-between pb-4 border-b border-zinc-800/80">
          <button
            onClick={() => navigate(-1)}
            className="px-3.5 py-1.5 rounded-[0.75rem] bg-[#111115] hover:bg-zinc-900 text-zinc-300 hover:text-white text-xs font-mono border border-zinc-800 transition-colors flex items-center gap-2"
          >
            ← Kembali
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-400">Riwayat Pembaruan Sistem</span>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-[0.75rem] border border-emerald-500/20">
              v1.5.0
            </span>
          </div>
        </div>

        {/* Hero Header Compact & Tanpa Ruang Kosong Berlebih */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Catatan Pembaruan MCloud
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Ikuti histori penambahan fitur baru, peningkatan performa, hingga optimasi keamanan server.
            </p>
          </div>

          {/* Filter Tag Tab Rapi & Sejajar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 no-scrollbar">
            {CHANGELOG_TAGS.map((tag) => {
              const isActive = activeTag === tag.id;
              return (
                <button
                  key={tag.id}
                  onClick={() => setActiveTag(tag.id)}
                  className={`px-3 py-1.5 rounded-[0.75rem] text-xs font-semibold transition-colors shrink-0 border ${
                    isActive
                      ? "bg-zinc-100 text-black border-white"
                      : "bg-[#111115] hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 border-zinc-800"
                  }`}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Daftar Rilis (Tanpa Box-in-Box yang Menimbulkan Ruang Kosong) */}
        <div className="space-y-4 mb-10">
          {filteredChangelogs.length === 0 ? (
            <div className="bg-[#111115] border border-zinc-800 rounded-[0.75rem] p-8 text-center space-y-2">
              <h3 className="text-sm font-bold text-white">Tidak ada pembaruan pada kategori ini</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Pilih tag rilis lain atau klik "Semua Rilis" untuk melihat daftar histori pembaruan MCloud.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveTag("all")}
                  className="px-4 py-1.5 rounded-[0.75rem] bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition border border-zinc-700"
                >
                  Tampilkan Semua Rilis
                </button>
              </div>
            </div>
          ) : (
            filteredChangelogs.map((release) => (
              <div
                key={release.version}
                className={`border rounded-[0.75rem] p-5 sm:p-6 transition-colors ${
                  release.isLatest
                    ? "bg-[#111115] border-zinc-700 shadow-lg"
                    : "bg-[#0e0e12] border-zinc-800/80 hover:border-zinc-700"
                }`}
              >
                {/* Header Kartu Rilis */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-sm sm:text-base font-bold text-white bg-zinc-900 px-3 py-1 rounded-[0.75rem] border border-zinc-800">
                      {release.version}
                    </span>
                    {release.isLatest && (
                      <span className="px-2 py-0.5 rounded-[0.75rem] text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-mono tracking-wider">
                        Latest Release
                      </span>
                    )}
                    {release.verified && (
                      <span className="text-[11px] font-medium text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-[0.75rem] border border-zinc-800">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-zinc-400">
                    {release.date}
                  </div>
                </div>

                {/* Judul & Ringkasan */}
                <div className="mb-4">
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    {release.title}
                  </h2>
                  {release.summary && (
                    <p className="text-zinc-400 text-xs sm:text-sm mt-1 leading-relaxed">
                      {release.summary}
                    </p>
                  )}
                </div>

                {/* Daftar Poin Perubahan (Rapi, Padat, Tanpa Kotak-Kotak Bersarang) */}
                <div className="space-y-2.5 pt-2 border-t border-zinc-800/50">
                  {release.changes.map((item, cIdx) => (
                    <div
                      key={cIdx}
                      className="text-zinc-300 text-xs sm:text-sm leading-relaxed flex items-start gap-3"
                    >
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-[0.375rem] border shrink-0 mt-0.5 ${getBadgeStyle(item.type)}`}>
                        {item.tag}
                      </span>
                      <span className="flex-1 text-zinc-300">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom CTA Card Padat & Rapi */}
        <div className="rounded-[0.75rem] p-5 sm:p-6 border border-zinc-800 bg-[#111115] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1 max-w-xl">
            <h2 className="text-base sm:text-lg font-bold text-white">
              Ingin Mengajukan Request Fitur MCloud?
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Sampaikan saran dan ide pengembangan Anda melalui Discord atau Tiket Bantuan.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href="https://discord.gg/mcloud"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-[0.75rem] bg-zinc-100 hover:bg-white text-black font-semibold text-xs sm:text-sm transition flex items-center gap-1.5"
            >
              <span>Discord</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <Link
              to="/faq"
              className="px-4 py-2 rounded-[0.75rem] bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-semibold text-xs sm:text-sm transition border border-zinc-800"
            >
              Lihat FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
