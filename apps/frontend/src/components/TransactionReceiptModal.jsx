import React, { useRef, useState } from 'react';
import { DollarSign, X, Printer, Download, Share2, Check, Shield, Server, Calendar, User, CreditCard, ExternalLink, Loader2, ArrowLeft, LayoutDashboard, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import * as htmlToImage from 'html-to-image';
import { api } from '../services/api';

export default function TransactionReceiptModal({ transaction, onClose, isPage = false, onBackToDashboard }) {
  const receiptRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [syncing, setSyncing] = useState(false);

  if (!transaction) return null;

  let parsedConfig = {};
  try {
    if (transaction.config) parsedConfig = JSON.parse(transaction.config);
  } catch (e) {}

  const descText = parsedConfig.note || parsedConfig.type || (transaction.snapToken ? 'Pembayaran Layanan Cloud MCloud' : 'Transaksi Layanan MCloud');
  const serverName = parsedConfig.serverName || parsedConfig.name || '-';
  const memoryLimit = parsedConfig.memoryLimit || parsedConfig.ram || '-';
  const durationDays = parsedConfig.days || parsedConfig.duration || '-';

  // Handle Print
  const handlePrint = () => {
    window.print();
  };

  // Handle Download Image
  const handleDownloadImage = async () => {
    if (!receiptRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = await htmlToImage.toPng(receiptRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#0d0d0d',
      });
      const link = document.createElement('a');
      link.download = `Struk-MCloud-TRX-${transaction.id}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Struk berhasil diunduh sebagai gambar PNG!');
    } catch (err) {
      toast.error('Gagal menghasilkan gambar: ' + err.message);
    }
    setIsGenerating(false);
  };

  // Handle Share to WhatsApp / Social Media
  const handleShare = async () => {
    if (!receiptRef.current) return;
    setIsGenerating(true);
    try {
      const blob = await htmlToImage.toBlob(receiptRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#0d0d0d',
      });

      const file = new File([blob], `Struk-MCloud-${transaction.id}.png`, { type: 'image/png' });
      const shareText = `*STRUK TRANSAKSI MCLOUD*\nNo. Order: #${transaction.id}\nLayanan: ${descText}\nTotal: Rp ${(transaction.amount || 0).toLocaleString('id-ID')}\nStatus: ${transaction.status.toUpperCase()}\n\nTerima kasih telah menggunakan layanan MCloud!`;

      // Check if browser supports Web Share API with files (mobile & supported desktop browsers)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Struk Transaksi #${transaction.id}`,
          text: shareText,
        });
        toast.success('Berhasil membagikan struk!');
      } else {
        // Fallback: Download image and open WhatsApp with formatted text
        const dataUrl = await htmlToImage.toPng(receiptRef.current, { quality: 1.0, pixelRatio: 2, backgroundColor: '#0d0d0d' });
        const link = document.createElement('a');
        link.download = `Struk-MCloud-TRX-${transaction.id}.png`;
        link.href = dataUrl;
        link.click();

        const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n\n*(Gambar struk telah diunduh, silakan lampirkan gambar tersebut di chat ini)*')}`;
        window.open(waUrl, '_blank');
        toast.success('Struk diunduh & mengarahkan ke WhatsApp...');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        toast.error('Gagal membagikan struk: ' + err.message);
      }
    }
    setIsGenerating(false);
  };

  return (
    <>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-receipt, #printable-receipt * {
              visibility: visible;
            }
            #printable-receipt {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              max-width: 100% !important;
              background: #0d0d0d !important;
              color: #ffffff !important;
              box-shadow: none !important;
              border: 1px solid #333 !important;
              padding: 20px !important;
              margin: 0 !important;
            }
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>

      <div className={isPage ? "w-full py-4" : "fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto"}>
        <div className={isPage ? "w-full max-w-2xl mx-auto my-2 animate-scale-up" : "w-full max-w-xl my-8 animate-scale-up"}>
          
          {/* Action Toolbar (No Print) */}
          <div className="no-print flex flex-wrap items-center justify-between gap-3 mb-4 bg-[#141414] border border-zinc-800 p-3.5 rounded-2xl shadow-xl">
            <div className="flex items-center gap-2 text-sm font-bold text-white pl-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span>Digital Invoice / Struk</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 justify-end">
              {!isPage && transaction.status === 'pending' && (
                <>
                  {transaction.snapToken && (
                    <button
                      onClick={() => {
                        if (window.snap) {
                          window.snap.pay(transaction.snapToken, {
                            onSuccess: () => {
                              toast.success("Pembayaran berhasil!");
                              window.location.reload();
                            },
                            onPending: () => {
                              toast("Menunggu konfirmasi pembayaran.", { icon: "⏳" });
                              window.location.reload();
                            },
                            onError: () => {
                              toast.error("Pembayaran gagal");
                              window.location.reload();
                            },
                            onClose: () => {
                              window.location.reload();
                            }
                          });
                        } else {
                          toast.error("Sistem Midtrans Snap belum siap");
                        }
                      }}
                      className="px-3 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-extrabold rounded-xl transition-all flex items-center gap-1 shadow-lg shadow-primary/20 active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Bayar
                    </button>
                  )}
                  <button
                    onClick={async () => {
                      setSyncing(true);
                      try {
                        await api.syncTransaction(transaction.id);
                        toast.success("Status transaksi disinkronisasikan!");
                        window.location.reload();
                      } catch (err) {
                        toast.error(err.message || "Gagal sinkronisasi");
                      } finally {
                        setSyncing(false);
                      }
                    }}
                    disabled={syncing}
                    className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1 border border-zinc-700 active:scale-95 disabled:opacity-50"
                    title="Sinkronisasi ke Midtrans"
                  >
                    {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4 text-amber-400" />}
                    <span>Sync</span>
                  </button>
                </>
              )}
              <button
                onClick={handlePrint}
                className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5"
                title="Cetak Struk"
              >
                <Printer className="w-4 h-4 text-zinc-400" />
                <span className="hidden sm:inline">Cetak</span>
              </button>
              <button
                onClick={handleDownloadImage}
                disabled={isGenerating}
                className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-50"
                title="Unduh Gambar PNG"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 text-blue-400" />}
                <span className="hidden sm:inline">Unduh PNG</span>
              </button>
              <button
                onClick={handleShare}
                disabled={isGenerating}
                className="px-3.5 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 shadow-lg shadow-primary/20 disabled:opacity-50"
                title="Bagikan ke WhatsApp / Sosmed"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                <span>Bagikan</span>
              </button>
              {!isPage && (
                <button
                  onClick={onClose}
                  className="p-2 bg-zinc-800/80 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-xl transition-colors ml-1"
                  title="Tutup Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Printable Receipt Card */}
          <div
            id="printable-receipt"
            ref={receiptRef}
            className="bg-[#0d0d0d] border-2 border-zinc-800/80 rounded-3xl p-6 sm:p-8 text-zinc-200 shadow-2xl relative overflow-hidden font-sans"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.08) 0%, transparent 60%)',
            }}
          >
            {/* Top Watermark Pattern */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500"></div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-zinc-800/80">
              <div className="flex items-center gap-3">
                <img src="/creep.png" alt="MCloud Logo" className="w-12 h-12 object-contain filter drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider">MCLOUD HOSTING</h1>
                  <p className="text-xs text-zinc-500 font-mono">https://mcloud.host • Official Cloud Partner</p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">STATUS PEMBAYARAN</div>
                <div className="mt-1">
                  {transaction.status === 'success' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                      <Check className="w-3.5 h-3.5" /> PAID / LUNAS
                    </span>
                  )}
                  {transaction.status === 'admin_manual' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase bg-purple-500/10 text-purple-400 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                      <Shield className="w-3.5 h-3.5" /> ADMIN SYSTEM
                    </span>
                  )}
                  {transaction.status === 'pending' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      PENDING ORDER
                    </span>
                  )}
                  {!['success', 'admin_manual', 'pending'].includes(transaction.status) && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase bg-red-500/10 text-red-400 border border-red-500/30">
                      {transaction.status || 'UNKNOWN'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Receipt Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-zinc-800/80 text-xs">
              <div>
                <span className="text-zinc-500 block font-bold uppercase tracking-wider mb-1">NO. INVOICE</span>
                <span className="font-mono font-bold text-white text-sm">#INV-{transaction.id}</span>
              </div>
              <div>
                <span className="text-zinc-500 block font-bold uppercase tracking-wider mb-1">TANGGAL</span>
                <span className="text-zinc-300 font-medium">
                  {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block font-bold uppercase tracking-wider mb-1">METODE BAYAR</span>
                <span className="text-zinc-300 font-medium">
                  {transaction.status === 'admin_manual' ? 'System Provisioning' : 'Midtrans Gateway'}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block font-bold uppercase tracking-wider mb-1">PENGGUNA</span>
                <span className="text-white font-bold truncate block">
                  {transaction.username || `User #${transaction.userId}`}
                </span>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="py-6 border-b border-zinc-800/80">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">RINCIAN LAYANAN & ITEM</div>
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-900 text-[11px] text-zinc-400 uppercase font-bold tracking-wider border-b border-zinc-800">
                      <th className="py-3 px-4">Deskripsi Layanan</th>
                      <th className="py-3 px-4 text-center">Spesifikasi</th>
                      <th className="py-3 px-4 text-right">Harga</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-xs sm:text-sm">
                    <tr>
                      <td className="py-4 px-4 font-medium text-white">
                        <div className="font-bold">{descText}</div>
                        {serverName !== '-' && (
                          <div className="text-xs text-emerald-400 font-mono mt-0.5">Server Name: {serverName}</div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center text-zinc-400 font-mono text-xs">
                        {memoryLimit !== '-' ? `${memoryLimit} RAM` : 'Standard'}
                        {durationDays !== '-' ? ` / ${durationDays} Hari` : ''}
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-white">
                        Rp {(transaction.amount || 0).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Summary & Total */}
            <div className="py-6 border-b border-zinc-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="w-full sm:w-1/2">
                <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">CATATAN TRANSAKSI</div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {transaction.status === 'success' ? 'Pembayaran telah diproses secara otomatis oleh sistem. Layanan server aktif sesuai masa durasi.' : 
                   transaction.status === 'admin_manual' ? 'Aksi administratif dilakukan oleh tim Admin MCloud untuk penyesuaian atau perpanjangan layanan.' :
                   'Pesanan dalam proses konfirmasi pembayaran.'}
                </p>
                {transaction.snapToken && (
                  <div className="mt-2 font-mono text-[10px] text-zinc-500 bg-zinc-900/50 p-1.5 rounded border border-zinc-800/50 inline-block truncate max-w-full">
                    Token: {transaction.snapToken}
                  </div>
                )}
              </div>

              <div className="w-full sm:w-56 space-y-2 bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/60">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-mono">Rp {(transaction.amount || 0).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Diskon & Promo</span>
                  <span className="font-mono text-emerald-400">Rp 0</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Biaya Admin</span>
                  <span className="font-mono">Rp 0</span>
                </div>
                <div className="pt-2 border-t border-zinc-800 flex justify-between items-center">
                  <span className="text-xs font-bold uppercase text-white">TOTAL</span>
                  <span className="text-lg font-black font-mono text-emerald-400">
                    Rp {(transaction.amount || 0).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer / Verification Stamp */}
            <div className="pt-6 text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-900/80 border border-zinc-800 rounded-full text-[11px] font-mono text-zinc-400">
                <Shield className="w-3.5 h-3.5 text-emerald-500" /> Struk ini adalah bukti pembayaran digital sah MCloud Hosting
              </div>
              <p className="text-[10px] text-zinc-600 font-mono">
                Dicetak/Diunduh pada: {new Date().toLocaleString('id-ID')} • MCloud Server Platform
              </p>
            </div>

          </div>

          <div className="no-print mt-3 text-center text-xs text-zinc-500">
            Tip: Klik <strong className="text-zinc-300">Bagikan</strong> untuk mengirim langsung gambar struk ke WhatsApp atau media sosial lainnya.
          </div>

          {isPage && (
            <div className="no-print mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onBackToDashboard}
                className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary-hover text-white font-extrabold rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <LayoutDashboard className="w-5 h-5" />
                Kembali ke Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
