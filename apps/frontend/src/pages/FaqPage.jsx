import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ChevronDown, ThumbsUp, ThumbsDown, ExternalLink } from "lucide-react";

const FAQ_CATEGORIES = [
  { id: "all", label: "Semua Pertanyaan" },
  { id: "teknis", label: "Teknis & Server" },
  { id: "billing", label: "Billing & Pembayaran" },
  { id: "game", label: "Minecraft & Modpack" },
  { id: "keamanan", label: "Keamanan & Akun" },
];

const FAQ_DATA = [
  {
    id: 1,
    category: "teknis",
    question: "Bagaimana cara kerja instant auto-deploy setelah pemesanan server?",
    answer:
      "Setelah pembayaran Anda terverifikasi oleh sistem (otomatis untuk QRIS & Virtual Account), mesin provisioning MCloud akan langsung mengalokasikan kontainer Docker isolated di node server berkecepatan tinggi kami. Dalam waktu kurang dari 60 detik, server Anda sudah dalam kondisi aktif (Running) dan siap digunakan beserta IP dan Port khusus.",
    popular: true,
  },
  {
    id: 2,
    category: "game",
    question: "Apakah saya bisa menginstal Custom Modpack (Forge, Fabric, atau Paper)?",
    answer:
      "Tentu saja! MCloud mendukung penuh berbagai jenis server Minecraft Java dan Bedrock. Anda dapat mengubah tipe server (Paper, Purpur, Forge, Fabric, Vanilla, BungeeCord, atau Velocity) langsung melalui panel Server Settings atau mengunggah berkas .jar kustom melalui fitur Web File Manager maupun akses FTP yang kami sediakan.",
    popular: true,
  },
  {
    id: 3,
    category: "billing",
    question: "Metode pembayaran apa saja yang didukung oleh MCloud?",
    answer:
      "Kami mendukung berbagai metode pembayaran instan Indonesia, termasuk QRIS (GoPay, OVO, DANA, ShopeePay, LinkAja, BCA QR), Virtual Account berbagai bank (BCA, Mandiri, BNI, BRI, Permata), serta transfer bank manual dan kartu kredit/debit melalui gerbang pembayaran teraman.",
    popular: true,
  },
  {
    id: 4,
    category: "teknis",
    question: "Apakah saya bisa melakukan upgrade atau downgrade spesifikasi RAM/CPU sewaktu-waktu?",
    answer:
      "Ya, Anda dapat melakukan upgrade paket hosting kapan saja melalui Client Area. Sistem akan menghitung selisih biaya secara prorata (prorated calculation) tanpa menghilangkan data atau konfigurasi server Anda. Setelah tagihan terbayar, restart server Anda agar spesifikasi baru langsung aktif.",
  },
  {
    id: 5,
    category: "keamanan",
    question: "Bagaimana sistem proteksi Anti-DDoS MCloud bekerja melindungi server saya?",
    answer:
      "Semua node server MCloud dilengkapi dengan perlindungan Anti-DDoS enterprise berlapis hingga kapasitas multi-terabits per detik (Tbps). Sistem filter kami secara spesifik mendeteksi dan meredam serangan Layer 3, 4, dan Layer 7 (termasuk serangan UDP flood khusus game server) sebelum mencapai kontainer Anda, menjaga latensi tetap rendah dan server online 99.9%.",
    popular: true,
  },
  {
    id: 6,
    category: "game",
    question: "Bagaimana cara mengakses dan mengedit file server (server.properties, plugins, world)?",
    answer:
      "MCloud menyediakan dua metode akses berkas yang mudah: 1) Web File Manager bawaan di Dasbor Server yang mendukung editor teks sintaks highlight, upload/download ZIP, serta ekstraksi arsip secara langsung; dan 2) Kredensial SFTP/FTP khusus yang dapat Anda hubungkan menggunakan aplikasi seperti FileZilla atau WinSCP.",
  },
  {
    id: 7,
    category: "billing",
    question: "Bagaimana kebijakan perpanjangan layanan dan masa tenggang (grace period)?",
    answer:
      "Tagihan perpanjangan (renewal invoice) akan diterbitkan secara otomatis 7 hari sebelum masa aktif berakhir. Jika layanan tidak diperpanjang hingga tanggal jatuh tempo, server akan masuk ke status 'Suspended' (dinonaktifkan sementara) selama 3 hari masa tenggang. Setelah melewati masa tenggang tersebut tanpa pembayaran, sistem akan menghapus data server secara permanen.",
  },
  {
    id: 8,
    category: "teknis",
    question: "Berapa kapasitas penyimpanan (NVMe SSD) yang disediakan dan apakah di-backup?",
    answer:
      "Kapasitas penyimpanan bervariasi bergantung pada paket yang Anda pilih (mulai dari 15GB hingga 100GB+ NVMe SSD kelas enterprise dengan kecepatan read/write ekstrem). Kami juga melakukan snapshot cadangan berkala secara otomatis, dan Anda dapat membuat backup manual kapan saja melalui tab Backup di konsol server Anda.",
  },
  {
    id: 9,
    category: "keamanan",
    question: "Apakah saya bisa menambahkan anggota tim atau admin lain untuk mengelola server?",
    answer:
      "Bisa! Melalui fitur Sub-Users (Kolaborator) di pengaturan server, Anda dapat mengundang akun MCloud lain dengan memberikan izin akses (permissions) spesifik, seperti hanya mengelola konsol, memulai/menghentikan server, atau mengakses file manager tanpa perlu memberikan kata sandi akun utama Anda.",
  },
  {
    id: 10,
    category: "game",
    question: "Apakah MCloud mendukung cross-play antara Minecraft Java dan Bedrock Edition?",
    answer:
      "Ya! Anda hanya perlu menginstal plugin GeyserMC dan Floodgate ke dalam server berbasis Paper, Purpur, atau Velocity Anda. Dengan setup tersebut, pemain dari PC Java Edition dan pemain dari Android, iOS, Windows 10/11, atau Konsol (Bedrock Edition) dapat bermain bersama dalam satu server yang sama.",
  },
  {
    id: 11,
    category: "billing",
    question: "Apakah MCloud menyediakan kebijakan pengembalian dana (Refund Policy)?",
    answer:
      "Kami memberikan garansi kepuasan dengan kebijakan pengembalian dana dalam waktu 24 jam pertama setelah pembelian apabila terdapat kendala teknis dari sisi infrastruktur kami yang tidak dapat diselesaikan oleh tim dukungan teknis. Syarat dan ketentuan lengkap dapat dilihat pada halaman Syarat & Ketentuan.",
  },
  {
    id: 12,
    category: "teknis",
    question: "Apakah saya bisa menggunakan domain khusus (misal: play.namaserver.com)?",
    answer:
      "Tentu! Anda dapat mengarahkan domain kustom milik Anda ke IP dan Port server MCloud menggunakan A Record (jika menggunakan port default 25565) atau SRV Record pada pengaturan DNS domain Anda. Panduan lengkap konfigurasi DNS tersedia di halaman Dokumentasi kami.",
  },
];

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openItems, setOpenItems] = useState(new Set([1, 2])); // Default buka 2 pertanyaan populer
  const [feedbackState, setFeedbackState] = useState({}); // { [id]: 'yes' | 'no' }
  const navigate = useNavigate();

  const toggleItem = (id) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleFeedback = (id, type, e) => {
    e.stopPropagation();
    setFeedbackState((prev) => ({ ...prev, [id]: type }));
  };

  // Filter FAQ berdasarkan keyword dan kategori
  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchCategory = activeCategory === "all" || item.category === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchQuery =
        !query ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query);
      return matchCategory && matchQuery;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-zinc-800 pb-20">
      {/* Menggunakan max-w-4xl agar padat, hemat ruang, dan tidak terlalu sempit */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        {/* Navigasi Atas Compact & Rapi */}
        <div className="mb-6 flex items-center justify-between pb-4 border-b border-zinc-800/80">
          <button
            onClick={() => navigate(-1)}
            className="px-3.5 py-1.5 rounded-[0.75rem] bg-[#111115] hover:bg-zinc-900 text-zinc-300 hover:text-white text-xs font-mono border border-zinc-800 transition-colors flex items-center gap-2"
          >
            ← Kembali
          </button>
          <div className="text-xs font-mono text-zinc-400">
            Pusat Bantuan & Komunitas
          </div>
        </div>

        {/* Hero Header Compact */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Tanya Jawab MCloud
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Temukan jawaban untuk seluruh pertanyaan teknis, billing, hingga konfigurasi server game Anda.
            </p>
          </div>

          {/* Live Search Bar Compact */}
          <div className="w-full md:w-72 shrink-0">
            <div className="relative flex items-center bg-[#111115] border border-zinc-800 rounded-[0.75rem] px-3.5 py-2 focus-within:border-zinc-600 transition-colors">
              <Search className="w-4 h-4 text-zinc-400 mr-2.5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari (misal: auto-deploy, QRIS)..."
                className="w-full bg-transparent text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-[10px] font-mono text-zinc-400 hover:text-white bg-zinc-800 px-1.5 py-0.5 rounded transition"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Kategori Tab Compact & Tanpa Ikon Repetitif */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 shrink-0 no-scrollbar">
          {FAQ_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count = cat.id === "all" 
              ? FAQ_DATA.length 
              : FAQ_DATA.filter((i) => i.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-[0.75rem] text-xs font-semibold transition-colors shrink-0 border flex items-center gap-2 ${
                  isActive
                    ? "bg-zinc-100 text-black border-white"
                    : "bg-[#111115] hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 border-zinc-800"
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? "bg-black/10 text-black" : "bg-zinc-800 text-zinc-400"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Daftar Accordion FAQ (Dense, Tanpa Kotak Bersarang, Bebas Ruang Kosong) */}
        <div className="space-y-3 mb-10">
          {filteredFaqs.length === 0 ? (
            <div className="bg-[#111115] border border-zinc-800 rounded-[0.75rem] p-8 text-center space-y-2">
              <h3 className="text-sm font-bold text-white">Tidak ada pertanyaan yang cocok</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Kami tidak menemukan hasil untuk kata kunci "{searchQuery}" pada kategori ini.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                  className="px-4 py-1.5 rounded-[0.75rem] bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition border border-zinc-700"
                >
                  Tampilkan Semua Pertanyaan
                </button>
              </div>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openItems.has(faq.id);
              const feedback = feedbackState[faq.id];
              const categoryObj = FAQ_CATEGORIES.find((c) => c.id === faq.category) || {};

              return (
                <div
                  key={faq.id}
                  className={`border rounded-[0.75rem] transition-colors overflow-hidden ${
                    isOpen
                      ? "bg-[#111115] border-zinc-700"
                      : "bg-[#0e0e12] border-zinc-800/80 hover:border-zinc-700"
                  }`}
                >
                  {/* Tombol Header Accordion Padat & Rapi */}
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between gap-4 text-left focus:outline-none group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-[0.375rem] border border-zinc-800">
                          {categoryObj.label || faq.category}
                        </span>
                        {faq.popular && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-[0.375rem] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Populer
                          </span>
                        )}
                      </div>
                      <h3 className={`font-bold text-sm sm:text-base transition-colors ${
                        isOpen ? "text-white" : "text-zinc-200 group-hover:text-white"
                      }`}>
                        {faq.question}
                      </h3>
                    </div>
                    <div className={`p-1 text-zinc-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-white" : "group-hover:text-white"
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Isi Jawaban Compact */}
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-zinc-800/60">
                      <div className="text-zinc-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </div>

                      {/* Footer Umpan Balik Compact */}
                      <div className="mt-4 pt-3 border-t border-zinc-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
                        <div className="flex items-center gap-2">
                          <span>Apakah jawaban ini membantu?</span>
                          {feedback ? (
                            <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-[0.375rem] border border-emerald-500/20">
                              Terima kasih atas masukan Anda!
                            </span>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={(e) => handleFeedback(faq.id, "yes", e)}
                                className="px-2 py-0.5 rounded-[0.375rem] bg-zinc-900 hover:bg-emerald-500/20 text-zinc-300 hover:text-emerald-400 border border-zinc-800 hover:border-emerald-500/30 transition flex items-center gap-1 font-semibold text-[11px]"
                              >
                                <ThumbsUp className="w-3 h-3" /> Ya
                              </button>
                              <button
                                onClick={(e) => handleFeedback(faq.id, "no", e)}
                                className="px-2 py-0.5 rounded-[0.375rem] bg-zinc-900 hover:bg-red-500/20 text-zinc-300 hover:text-red-400 border border-zinc-800 hover:border-red-500/30 transition flex items-center gap-1 font-semibold text-[11px]"
                              >
                                <ThumbsDown className="w-3 h-3" /> Tidak
                              </button>
                            </div>
                          )}
                        </div>

                        <Link
                          to="/tickets"
                          className="font-semibold text-sky-400 hover:text-sky-300 transition text-xs"
                        >
                          Butuh bantuan teknis? →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Call to Action Card Padat & Rapi */}
        <div className="rounded-[0.75rem] p-5 sm:p-6 border border-zinc-800 bg-[#111115] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1 max-w-xl">
            <h2 className="text-base sm:text-lg font-bold text-white">
              Pertanyaan Anda Belum Terjawab di Atas?
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Tim Engineer dan CS MCloud siap membantu Anda kapan pun melalui Tiket Bantuan maupun Discord.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/tickets"
              className="px-4 py-2 rounded-[0.75rem] bg-zinc-100 hover:bg-white text-black font-semibold text-xs sm:text-sm transition"
            >
              Buka Tiket Bantuan
            </Link>
            <a
              href="https://discord.gg/mcloud"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-[0.75rem] bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-semibold text-xs sm:text-sm transition border border-zinc-800 flex items-center gap-1.5"
            >
              <span>Discord</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
