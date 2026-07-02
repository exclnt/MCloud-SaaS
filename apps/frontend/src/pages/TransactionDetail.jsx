import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TransactionReceiptModal from '../components/TransactionReceiptModal';
import { Loader2, AlertCircle, ArrowLeft, CheckCircle2, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { DataLoading } from '../components/DataLoading';

export default function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    document.title = `Struk Transaksi #${id} - MCloud`;
    fetchTransactionDetail();
  }, [id]);

  const fetchTransactionDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      let trx = null;
      try {
        trx = await api.getTransaction(id);
      } catch (err) {
        const list = await api.getUserTransactions();
        trx = list.find(t => t.id === Number(id));
      }

      if (!trx) {
        throw new Error('Data transaksi tidak ditemukan');
      }
      setTransaction(trx);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Gagal memuat transaksi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow py-8 sm:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header Banner */}
          <div className="mb-6 text-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-4 bg-zinc-900/60 hover:bg-zinc-800 px-4 py-2 rounded-xl border border-zinc-800"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Detail Pembelian & Struk</h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Simpan, cetak, atau bagikan bukti pembelian layanan MCloud Anda.
            </p>
          </div>

          {loading ? (
            <DataLoading text="Memuat Struk & Detail Transaksi..." size="lg" />
          ) : error || !transaction ? (
            <div className="glass-panel p-12 rounded-2xl border border-zinc-800 bg-[#101010] text-center max-w-md mx-auto my-8">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <div className="text-lg font-bold text-white mb-2">Gagal Memuat Transaksi</div>
              <div className="text-sm text-zinc-400 mb-6">{error || 'Transaksi tidak ditemukan.'}</div>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-bold transition-colors"
              >
                Kembali ke Dashboard
              </button>
            </div>
          ) : (
            <div>
              {/* Provisioning Error Banner if Docker runtime failed */}
              {transaction.config && (() => {
                try {
                  const cfg = JSON.parse(transaction.config);
                  if (cfg.provisioningError) {
                    return (
                      <div className="mb-4 p-4 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-200 text-xs flex items-start gap-3 max-w-2xl mx-auto shadow-lg shadow-red-500/5">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-sm mb-1 text-red-300">Kendala Sistem Pembuatan / Perpanjangan Server:</div>
                          <div className="font-mono bg-black/40 p-2 rounded border border-red-500/20 my-1.5">{cfg.provisioningError}</div>
                          <div className="mt-1 text-zinc-300">Pembayaran Anda telah tercatat. Jika server belum aktif (karena Docker luring/mati), silakan hubungi Admin atau coba tombol Sinkronisasi di bawah.</div>
                        </div>
                      </div>
                    );
                  }
                } catch (e) {}
                return null;
              })()}

              {/* Status Banner */}
              <div className="mb-6 p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-2xl mx-auto bg-zinc-900/80 border-zinc-800 shadow-xl">
                <div className="flex items-center gap-3">
                  {transaction.status === 'success' ? (
                    <CheckCircle2 className="w-7 h-7 text-emerald-400 flex-shrink-0" />
                  ) : transaction.status === 'pending' ? (
                    <Clock className="w-7 h-7 text-amber-400 flex-shrink-0 animate-pulse" />
                  ) : (
                    <XCircle className="w-7 h-7 text-red-400 flex-shrink-0" />
                  )}
                  <div>
                    <div className="text-base font-extrabold text-white capitalize">
                      Status: {transaction.status === 'success' ? 'Pembayaran Berhasil' : transaction.status === 'pending' ? 'Menunggu Pembayaran / Konfirmasi' : transaction.status}
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      {transaction.status === 'success'
                        ? 'Layanan server Anda telah aktif atau masa sewa berhasil diperpanjang.'
                        : transaction.status === 'pending'
                        ? 'Pesanan menunggu pembayaran atau sinkronisasi dengan sistem Midtrans.'
                        : 'Pembayaran gagal, kadaluarsa, atau dibatalkan.'}
                    </div>
                  </div>
                </div>

                {transaction.status === 'pending' && (
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 border-zinc-800 pt-3 sm:pt-0">
                    {transaction.snapToken && (
                      <button
                        onClick={() => {
                          if (window.snap) {
                            window.snap.pay(transaction.snapToken, {
                              onSuccess: () => {
                                toast.success("Pembayaran berhasil!");
                                fetchTransactionDetail();
                              },
                              onPending: () => {
                                toast("Menunggu konfirmasi pembayaran.", { icon: "⏳" });
                                fetchTransactionDetail();
                              },
                              onError: () => {
                                toast.error("Pembayaran gagal");
                                fetchTransactionDetail();
                              },
                              onClose: () => {
                                fetchTransactionDetail();
                              }
                            });
                          } else {
                            toast.error("Sistem Midtrans Snap belum siap");
                          }
                        }}
                        className="px-3.5 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-primary/20 active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Bayar Sekarang
                      </button>
                    )}
                    <button
                      onClick={async () => {
                        setSyncing(true);
                        try {
                          await api.syncTransaction(transaction.id);
                          toast.success("Status transaksi disinkronisasikan!");
                          fetchTransactionDetail();
                        } catch (err) {
                          toast.error(err.message || "Gagal sinkronisasi");
                        } finally {
                          setSyncing(false);
                        }
                      }}
                      disabled={syncing}
                      className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 border border-zinc-700 active:scale-95 disabled:opacity-50"
                      title="Periksa status real-time ke Midtrans"
                    >
                      {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4 text-amber-400" />}
                      <span>Sinkronisasi</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Struk Card Component in Page Mode */}
              <TransactionReceiptModal
                transaction={transaction}
                isPage={true}
                onBackToDashboard={() => navigate('/dashboard')}
              />
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
