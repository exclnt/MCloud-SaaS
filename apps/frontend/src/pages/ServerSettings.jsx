import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Settings, Save, CheckCircle, Copy, Link as LinkIcon, Tag, Eye, Network } from 'lucide-react';
import { api } from '../services/api';

export default function ServerSettings() {
  const { serverInfo, status } = useOutletContext();
  const [displayName, setDisplayName] = useState(serverInfo.name);
  const [motd, setMotd] = useState(serverInfo.motd || '');
  const [savingDisplay, setSavingDisplay] = useState(false);
  const [isVisible, setIsVisible] = useState(serverInfo.visibility === 'public');
  const [tags, setTags] = useState(serverInfo.tags ? serverInfo.tags.split(',').filter(t => t.trim() !== '') : []);
  const [tagInput, setTagInput] = useState('');

  const handleSaveDisplay = async () => {
    setSavingDisplay(true);
    try {
      await api.updateServerConfig(serverInfo.port, { name: displayName, motd: motd });
      alert("Pengaturan Tampilan Server Berhasil Disimpan!");
    } catch (e) {
      alert("Gagal menyimpan Pengaturan Tampilan: " + e.message);
    }
    setSavingDisplay(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Tersalin ke papan klip!');
  };

  const toggleVisibility = async () => {
    const newVisibility = isVisible ? 'private' : 'public';
    setIsVisible(!isVisible);
    try {
      await api.updateServerConfig(serverInfo.port, { visibility: newVisibility });
    } catch (e) {
      alert("Gagal menyimpan visibilitas: " + e.message);
      setIsVisible(isVisible); // revert
    }
  };

  const handleAddTag = async (e) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      if (tags.length >= 5) {
        alert("Maksimal 5 tag diizinkan.");
        return;
      }
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setTagInput('');
      try {
        await api.updateServerConfig(serverInfo.port, { tags: newTags.join(',') });
      } catch (err) {
        alert("Gagal menyimpan tag: " + err.message);
        setTags(tags); // revert
      }
    }
  };

  const removeTag = async (indexToRemove) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    try {
      await api.updateServerConfig(serverInfo.port, { tags: newTags.join(',') });
    } catch (err) {
      alert("Gagal menghapus tag: " + err.message);
      setTags(tags); // revert
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          Pengaturan Server
        </h1>
        <p className="text-zinc-500">Kelola alamat server Anda, nama tampilan, dan daftar publik</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          
          {/* Display Name & MOTD */}
          <div className="bg-[#101010] border border-zinc-800/60 rounded-xl p-6 relative">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-white mb-1">Tampilan Server</h3>
                <p className="text-sm text-zinc-500">Sesuaikan MOTD server Anda</p>
              </div>
              <button onClick={handleSaveDisplay} disabled={savingDisplay} className="flex items-center gap-2 px-6 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-semibold text-sm rounded-md transition disabled:opacity-50">
                <Save className="w-4 h-4" /> {savingDisplay ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">PESAN HARI INI (MOTD)</label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-300 focus:outline-none focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">EDIT MOTD</label>
                <textarea 
                  rows={3}
                  value={motd}
                  onChange={(e) => setMotd(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-300 focus:outline-none focus:border-primary transition resize-none"
                />
              </div>
            </div>
            
            <p className="text-xs text-zinc-500 mt-6 pt-4 border-t border-zinc-800/50">
              Gunakan \u00A7[kode] untuk warna. Contoh: \u00A7aHijau \u00A7bBiru Muda \u00A7cMerah
            </p>
          </div>

          {/* Visibility */}
          <div className="bg-[#101010] border border-zinc-800/60 rounded-xl p-6 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white mb-1">Visibilitas</h3>
              <p className="text-xs text-zinc-500 mb-2">Server Anda dapat dilihat oleh siapa saja yang menelusuri daftar server</p>
              <div className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-md inline-flex border ${isVisible ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-zinc-400 bg-zinc-800/50 border-zinc-700/50'}`}>
                <Eye className="w-3.5 h-3.5" /> {isVisible ? 'Terlihat di Daftar Server' : 'Tersembunyi dari Daftar Server'}
              </div>
            </div>
            <div 
              onClick={toggleVisibility}
              className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${isVisible ? 'bg-primary' : 'bg-zinc-700'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isVisible ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </div>

          {/* Server Tags */}
          <div className="bg-[#101010] border border-zinc-800/60 rounded-xl p-6">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <Tag className="w-5 h-5 text-zinc-400" />
                <h3 className="text-base font-bold text-white">Tag Server</h3>
              </div>
              <span className="text-xs text-zinc-500">{tags.length}/5</span>
            </div>
            <p className="text-xs text-zinc-500 mb-4 ml-8">Tambahkan tag untuk membantu pemain menemukan server Anda berdasarkan mode atau gaya permainan</p>
            <div className="ml-8">
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                  <div key={index} className="flex items-center gap-2 px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">
                    {tag}
                    <button onClick={() => removeTag(index)} className="text-zinc-500 hover:text-red-400">&times;</button>
                  </div>
                ))}
              </div>
              <input 
                type="text" 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                disabled={tags.length >= 5}
                placeholder={tags.length >= 5 ? "Tag maksimal tercapai" : "Ketik dan tekan Enter untuk menambahkan..."}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-400 focus:outline-none focus:border-primary transition disabled:opacity-50"
              />
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-[#101010] border border-primary/20 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-1">
              <Network className="w-5 h-5 text-primary" />
              <h3 className="text-base font-bold text-white">Detail Koneksi Server</h3>
            </div>
            <p className="text-sm text-zinc-400 mb-6 ml-8">Gunakan IP dan Port ini untuk terhubung ke server Anda dari klien Minecraft.</p>
            
            <div className="ml-8 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Alamat IP</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-3 font-mono text-lg text-white">
                    {serverInfo.ip}
                  </div>
                  <button 
                    onClick={() => copyToClipboard(serverInfo.ip)}
                    className="p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition"
                    title="Salin IP"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Port</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-3 font-mono text-lg text-white">
                    {serverInfo.port}
                  </div>
                  <button 
                    onClick={() => copyToClipboard(serverInfo.port.toString())}
                    className="p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition"
                    title="Salin Port"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="pt-4 border-t border-zinc-800/60 mt-6">
                <p className="text-xs text-zinc-500">
                  <span className="text-primary font-semibold">Cara bergabung:</span> Buka Minecraft, buka Server, gulir ke bawah, klik "Tambah Server", dan masukkan IP dan Port di atas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GlobeIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
      <path d="M2 12h20"/>
    </svg>
  );
}
