import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { User, Lock, Mail, Save, Shield, Loader2, DollarSign, Eye, X, Printer, Share2, Download, Check, Headphones, MessageSquare, ExternalLink, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ConfirmModal from '../components/ConfirmModal';
import TransactionReceiptModal from '../components/TransactionReceiptModal';
import { SkeletonTable } from '../components/DataLoading';

export default function ClientArea() {
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {}, isDanger: false, confirmText: 'Konfirmasi' });
  const [activeTab, setActiveTab] = useState('profile');
  const location = useLocation();
  
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
  });
  
  const [passData, setPassData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [loadingTx, setLoadingTx] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [showTrxDetailModal, setShowTrxDetailModal] = useState(null);

  useEffect(() => {
    document.title = 'Client Area - MCloud';
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setProfileData({
          username: payload.username || '',
          email: payload.email || ''
        });
      } catch(e) {}
    }
    setLoadingTx(true);
    api.getUserTransactions()
      .then(res => setTransactions(res || []))
      .catch(() => {})
      .finally(() => setLoadingTx(false));
  }, []);

  useEffect(() => {
    const queryTab = new URLSearchParams(location.search).get('tab');
    if (queryTab) {
      setActiveTab(queryTab);
    }
  }, [location.search]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setConfirmConfig({
      isOpen: true,
      title: 'Konfirmasi Perubahan Profil',
      message: 'Apakah Anda yakin ingin memperbarui informasi profil akun Anda?',
      confirmText: 'Ya, Perbarui',
      onConfirm: async () => {
        setLoading(true);
        try {
          await api.updateProfile(profileData);
          toast.success('Profil berhasil diperbarui!');
          const token = localStorage.getItem('token');
          if (token) {
            const parts = token.split('.');
            const payload = JSON.parse(atob(parts[1]));
            payload.username = profileData.username;
            payload.email = profileData.email;
            const newToken = `${parts[0]}.${btoa(JSON.stringify(payload))}.${parts[2]}`;
            localStorage.setItem('token', newToken);
            localStorage.setItem('username', profileData.username);
          }
        } catch (err) {
          toast.error(err.message || 'Gagal memperbarui profil');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      return toast.error('Sandi baru dan konfirmasi tidak cocok');
    }
    setConfirmConfig({
      isOpen: true,
      title: 'Konfirmasi Keamanan Sandi',
      message: 'Anda akan mengubah kata sandi akun. Pastikan Anda mengingat sandi baru Anda.',
      confirmText: 'Ubah Sandi',
      isDanger: true,
      onConfirm: async () => {
        setLoading(true);
        try {
          await api.updatePassword({
            currentPassword: passData.currentPassword,
            newPassword: passData.newPassword
          });
          toast.success('Sandi berhasil diperbarui! Silakan gunakan sandi baru untuk login berikutnya.');
          setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
          toast.error(err.message || 'Gagal mengubah sandi');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <User className="w-8 h-8 text-primary" /> Area Klien & Pengaturan Akun
          </h1>
          <p className="text-zinc-400 mt-1 text-sm md:text-base">Kelola informasi profil, keamanan kata sandi, serta riwayat transaksi layanan hosting Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 items-start">
          
          {/* Navigation Sidebar */}
          <div className="bg-[#101010] border border-zinc-800/60 rounded-xl p-3 flex flex-wrap sm:flex-nowrap md:flex-col gap-1.5 shadow-lg static md:sticky md:top-24">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg text-xs md:text-sm font-semibold transition w-full text-left ${activeTab === 'profile' ? 'bg-primary text-white font-bold shadow-md' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
            >
              <User className="w-4 h-4 shrink-0" /> <span className="whitespace-nowrap">Profil Saya</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg text-xs md:text-sm font-semibold transition w-full text-left ${activeTab === 'security' ? 'bg-primary text-white font-bold shadow-md' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
            >
              <Shield className="w-4 h-4 shrink-0" /> <span className="whitespace-nowrap">Keamanan Akun</span>
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg text-xs md:text-sm font-semibold transition w-full text-left ${activeTab === 'transactions' ? 'bg-primary text-white font-bold shadow-md' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
            >
              <DollarSign className="w-4 h-4 shrink-0" /> <span className="whitespace-nowrap">Riwayat Transaksi</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="md:col-span-3">
            
            {activeTab === 'profile' && (
              <div className="bg-[#101010] border border-zinc-800/60 rounded-xl p-6 md:p-8 shadow-lg animate-fade-in">
                <div className="mb-6 border-b border-zinc-800/60 pb-6">
                  <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" /> Informasi Akun
                  </h2>
                  <p className="text-sm text-zinc-500">Perbarui informasi identitas akun yang digunakan untuk login dan notifikasi MCloud.</p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-5 max-w-lg">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Nama Pengguna (Username)</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={profileData.username}
                        onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                        className="w-full bg-[#161616] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary text-sm transition"
                        placeholder="Username Anda"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Alamat Email</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full bg-[#161616] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary text-sm transition"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-800/60 flex justify-start">
                    <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-md transition shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan Perubahan
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-[#101010] border border-zinc-800/60 rounded-xl p-6 md:p-8 shadow-lg animate-fade-in">
                <div className="mb-6 border-b border-zinc-800/60 pb-6">
                  <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-red-400" /> Ubah Kata Sandi
                  </h2>
                  <p className="text-sm text-zinc-500">Pastikan Anda menggunakan kata sandi yang kuat (kombinasi huruf, angka, dan simbol) demi keamanan server cloud Anda.</p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-5 max-w-lg">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Kata Sandi Saat Ini</label>
                    <input
                      type="password"
                      required
                      value={passData.currentPassword}
                      onChange={(e) => setPassData({...passData, currentPassword: e.target.value})}
                      className="w-full bg-[#161616] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary text-sm transition"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Kata Sandi Baru</label>
                    <input
                      type="password"
                      required
                      value={passData.newPassword}
                      onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
                      className="w-full bg-[#161616] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary text-sm transition"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Konfirmasi Kata Sandi Baru</label>
                    <input
                      type="password"
                      required
                      value={passData.confirmPassword}
                      onChange={(e) => setPassData({...passData, confirmPassword: e.target.value})}
                      className="w-full bg-[#161616] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary text-sm transition"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="flex justify-start pt-4 border-t border-zinc-800/60">
                    <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-md transition shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Perbarui Sandi
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="bg-[#101010] border border-zinc-800/60 rounded-xl p-6 md:p-8 shadow-lg animate-fade-in">
                <div className="mb-6 border-b border-zinc-800/60 pb-6">
                  <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-emerald-400" /> Riwayat Transaksi & Pembelian
                  </h2>
                  <p className="text-sm text-zinc-500">Daftar transaksi pembelian server, perpanjangan masa aktif, atau penyesuaian layanan.</p>
                </div>
                
                {loadingTx ? (
                  <SkeletonTable rows={4} columns={5} className="border border-zinc-800/80 rounded-xl" />
                ) : (
                  <div className="bg-[#121212] border border-zinc-800/80 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-800 bg-zinc-900/50 text-xs text-zinc-400 uppercase font-bold tracking-wider">
                          <th className="py-3.5 px-4">ID / Tanggal</th>
                          <th className="py-3.5 px-4">Keterangan / Layanan</th>
                          <th className="py-3.5 px-4">Nominal</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60 text-sm">
                        {transactions.length > 0 ? (
                          transactions.map((t) => {
                            let parsedConfig = {};
                            try {
                              if (t.config) parsedConfig = JSON.parse(t.config);
                            } catch (e) {}
                            
                            const descText = parsedConfig.note || parsedConfig.type || (t.snapToken ? 'Pembayaran Midtrans' : 'Transaksi Layanan');
                            
                            return (
                              <tr key={t.id} className="hover:bg-zinc-900/40 transition-colors">
                                <td className="py-3.5 px-4">
                                  <div className="font-mono font-bold text-white">#{t.id}</div>
                                  <div className="text-xs text-zinc-500 mt-0.5">
                                    {t.createdAt ? new Date(t.createdAt).toLocaleString('id-ID') : '-'}
                                  </div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="text-zinc-200 font-medium">{descText}</div>
                                  {parsedConfig.serverName && (
                                    <div className="text-xs text-zinc-500 mt-0.5">Server: {parsedConfig.serverName}</div>
                                  )}
                                </td>
                                <td className="py-3.5 px-4 font-mono font-bold text-zinc-200">
                                  Rp {(t.amount || 0).toLocaleString('id-ID')}
                                </td>
                                <td className="py-3.5 px-4">
                                  {t.status === 'success' && (
                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                      Success
                                    </span>
                                  )}
                                  {t.status === 'admin_manual' && (
                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                      Admin Manual
                                    </span>
                                  )}
                                  {t.status === 'pending' && (
                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                      Pending
                                    </span>
                                  )}
                                  {!['success', 'admin_manual', 'pending'].includes(t.status) && (
                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-800 text-zinc-400">
                                      {t.status}
                                    </span>
                                  )}
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  <button
                                    onClick={() => setShowTrxDetailModal(t)}
                                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 ml-auto"
                                  >
                                    <Eye className="w-3.5 h-3.5" /> Struk / Detail
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="5" className="py-12 text-center text-zinc-500">
                              Belum ada riwayat transaksi ditemukan.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Banner Pusat Bantuan & Komunitas */}
            <div className="mt-8 bg-[#101010] border border-zinc-800/80 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <div className="flex items-start md:items-center gap-4 max-w-xl">
                  <div className="relative shrink-0 hidden sm:block">
                    <img 
                      src="/alex.png" 
                      alt="Alex Mascot" 
                      className="w-12 h-12 rounded-full border border-zinc-700 object-cover bg-zinc-900" 
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#101010]"></span>
                  </div>
                  <div className="space-y-1.5">
                    {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Bantuan & Dukungan 24/7
                    </div> */}
                    <h3 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                      Butuh Bantuan Konfigurasi atau Kendala Teknis?
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      Tim dukungan teknis MCloud dan 5,000+ anggota komunitas Discord kami selalu siap membantu menyelesaikan masalah server Anda kapan saja.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
                  <a
                    href="https://discord.gg/mcloud"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-sm transition-all shadow-lg hover:scale-105"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" /> Join Discord
                  </a>
                  <a
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm border border-zinc-700 transition-all hover:scale-105"
                  >
                    <Headphones className="w-4 h-4 text-emerald-400" /> Live Chat CS <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      {/* Modal Detail Transaksi / Struk */}
      <TransactionReceiptModal
        transaction={showTrxDetailModal}
        onClose={() => setShowTrxDetailModal(null)}
      />

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        isDanger={confirmConfig.isDanger}
      />
      <Footer />
    </div>
  );
}
