import { useState, useEffect } from 'react';
import { User, Lock, Mail, Save, Shield, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ConfirmModal from '../components/ConfirmModal';

export default function ClientArea() {
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {}, isDanger: false, confirmText: 'Konfirmasi' });
  const [activeTab, setActiveTab] = useState('profile');
  
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
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setConfirmConfig({
      isOpen: true,
      title: 'Perbarui Profil',
      message: 'Apakah Anda yakin ingin memperbarui informasi profil akun Anda?',
      isDanger: false,
      confirmText: 'Simpan Perubahan',
      onConfirm: async () => {
        setLoading(true);
        try {
          const data = await api.updateProfile(profileData);
          localStorage.setItem('token', data.token); // update token with new data
          toast.success('Profil berhasil diperbarui!');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } catch (err) {
          toast.error('Gagal memperbarui profil: ' + err.message);
        }
        setLoading(false);
      }
    });
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      toast.error('Kata sandi baru tidak cocok!');
      return;
    }
    setConfirmConfig({
      isOpen: true,
      title: 'Ubah Kata Sandi',
      message: 'Apakah Anda yakin ingin mengubah kata sandi akun Anda?',
      isDanger: true,
      confirmText: 'Ubah Kata Sandi',
      onConfirm: async () => {
        setLoading(true);
        try {
          await api.updatePassword({ 
            currentPassword: passData.currentPassword, 
            newPassword: passData.newPassword 
          });
          toast.success('Kata sandi berhasil diubah!');
          setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
          toast.error('Gagal mengubah sandi: ' + err.message);
        }
        setLoading(false);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 w-full px-6 md:px-10 py-6 md:py-10 max-w-7xl mx-auto">
        <div className="mb-10 animate-fade-in">
          <h1 className="text-3xl font-bold text-white mb-2">Area Klien</h1>
          <p className="text-zinc-500">Kelola informasi profil dan pengaturan keamanan akun Anda</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Sidebar Area Klien */}
          <aside className="w-full md:w-64 bg-[#101010] border border-zinc-800/60 rounded-xl p-4 shrink-0 shadow-lg">
            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition ${activeTab === 'profile' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'}`}
              >
                <User className="w-4 h-4" /> Profil Pengguna
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition ${activeTab === 'security' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'}`}
              >
                <Shield className="w-4 h-4" /> Keamanan Akun
              </button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 w-full space-y-6">
            
            {activeTab === 'profile' && (
              <div className="bg-[#101010] border border-zinc-800/60 rounded-xl p-6 md:p-8 shadow-lg animate-fade-in">
                <div className="mb-8 border-b border-zinc-800/60 pb-6">
                  <h2 className="text-xl font-bold text-white mb-2">Profil Pengguna</h2>
                  <p className="text-sm text-zinc-500">Perbarui informasi dasar profil Anda.</p>
                </div>
                
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Username</label>
                      <div className="relative">
                        <User className="w-5 h-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input 
                          type="text" 
                          value={profileData.username}
                          onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-md py-3 pl-12 pr-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Alamat Email</label>
                      <div className="relative">
                        <Mail className="w-5 h-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input 
                          type="email" 
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-md py-3 pl-12 pr-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-zinc-800/60">
                    <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-black font-bold rounded-md transition shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan Perubahan
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-[#101010] border border-zinc-800/60 rounded-xl p-6 md:p-8 shadow-lg animate-fade-in">
                <div className="mb-8 border-b border-zinc-800/60 pb-6">
                  <h2 className="text-xl font-bold text-white mb-2">Ubah Kata Sandi</h2>
                  <p className="text-sm text-zinc-500">Pastikan akun Anda menggunakan kata sandi yang kuat dan aman.</p>
                </div>
                
                <form onSubmit={handleSavePassword} className="space-y-6">
                  <div className="space-y-6 max-w-md">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Kata Sandi Saat Ini</label>
                      <div className="relative">
                        <Lock className="w-5 h-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input 
                          type="password" 
                          value={passData.currentPassword}
                          onChange={(e) => setPassData({...passData, currentPassword: e.target.value})}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-md py-3 pl-12 pr-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Kata Sandi Baru</label>
                      <div className="relative">
                        <Lock className="w-5 h-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input 
                          type="password" 
                          value={passData.newPassword}
                          onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-md py-3 pl-12 pr-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Konfirmasi Kata Sandi Baru</label>
                      <div className="relative">
                        <Lock className="w-5 h-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input 
                          type="password" 
                          value={passData.confirmPassword}
                          onChange={(e) => setPassData({...passData, confirmPassword: e.target.value})}
                          className={`w-full bg-zinc-950 border ${passData.confirmPassword && passData.newPassword !== passData.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-zinc-800 focus:ring-primary/50'} rounded-md py-3 pl-12 pr-4 text-zinc-100 focus:outline-none focus:ring-2 focus:border-primary transition`}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-start pt-4 border-t border-zinc-800/60">
                    <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-black font-bold rounded-md transition shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Perbarui Sandi
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      </main>

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
