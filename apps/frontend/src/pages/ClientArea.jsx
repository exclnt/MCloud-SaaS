import { useState } from 'react';
import { User, Lock, Mail, Save, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ClientArea() {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Using static user data for now as seen in Navbar
  const [profileData, setProfileData] = useState({
    name: 'Eko Ramadani',
    email: 'ekoramadani777@gmail.com',
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    alert('Profil berhasil diperbarui!');
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    alert('Kata sandi berhasil diubah!');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
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
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Nama Lengkap</label>
                      <div className="relative">
                        <User className="w-5 h-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input 
                          type="text" 
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
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
                    <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-black font-bold rounded-md transition shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      <Save className="w-4 h-4" /> Simpan Perubahan
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
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-md py-3 pl-12 pr-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-start pt-4 border-t border-zinc-800/60">
                    <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-black font-bold rounded-md transition shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      <Save className="w-4 h-4" /> Perbarui Sandi
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
