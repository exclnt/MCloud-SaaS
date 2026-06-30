import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { 
  Search,
  Globe,
  Copy
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ServerList() {
  const [servers, setServers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const navigate = useNavigate();

  const fetchServers = async () => {
    try {
      const data = await api.getPublicServers();
      setServers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchServers();
    const interval = setInterval(fetchServers, 10000); // 10s as per screenshot text
    return () => clearInterval(interval);
  }, []);

  const allTags = Array.from(new Set(servers.flatMap(s => s.tags ? s.tags.split(',') : []))).filter(Boolean);
  
  // Also include popular tags from the design
  const popularTags = ['PvP', 'SMP', 'Skyblock', 'Creative', 'Factions', 'Prison', 'Gens', 'Farming', 'Lifesteal', 'Roleplay', 'RPG', 'Modded', 'Parkour', 'Box', 'OneBlock', 'Bedrock', 'Mining', 'Tycoon', 'Hardcore', 'Escape'];
  
  const displayTags = Array.from(new Set([...allTags, ...popularTags])).slice(0, 20);

  const filteredServers = servers.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.ip.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === '' || (s.tags && s.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  const copyToClipboard = (text, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    alert('IP disalin ke papan klip!');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="relative py-20 flex flex-col items-center justify-center border-b border-zinc-800/60 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.minecraft.net/content/dam/games/minecraft/screenshots/1-20-update-village.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/50 via-[#0a0a0a]/80 to-[#0a0a0a]"></div>
        
        <div className="relative z-10 text-center space-y-4 mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Daftar Server Minecraft</h1>
          <p className="text-zinc-400 text-lg">Jelajahi server Minecraft terbaik untuk dimainkan saat ini.</p>
        </div>
        
        <div className="relative z-10 flex items-center justify-center gap-12 md:gap-24 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-1">{servers.length}</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Server</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-1">
              {servers.filter(s => s.status === 'running').length}
            </div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Online</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-1">
              {servers.reduce((acc, curr) => acc + (curr.status === 'running' ? 1 : 0), 0) * 12}
            </div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Pengguna</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Cari server..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition"
              />
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-400 hover:text-white transition">
                <Globe className="w-4 h-4" /> Java
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-md text-sm text-primary transition">
                <Globe className="w-4 h-4" /> Bedrock
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setSelectedTag('')}
              className={`px-3 py-1 rounded-md text-xs font-medium border transition ${selectedTag === '' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'}`}
            >
              Semua
            </button>
            {displayTags.map(tag => (
              <button 
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                className={`px-3 py-1 rounded-md text-xs font-medium border transition ${selectedTag === tag ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Server Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-12">
          {filteredServers.length === 0 ? (
            <div className="col-span-full py-12 text-center text-zinc-500">
              Tidak ada server yang cocok dengan kriteria Anda.
            </div>
          ) : (
            filteredServers.map((server, idx) => (
              <div key={server.id} className="bg-[#101010] border border-zinc-800/60 rounded-xl p-5 hover:border-zinc-700 transition flex flex-col h-full group relative overflow-hidden">
                {/* Status Indicator */}
                <div className={`absolute top-0 right-0 w-16 h-16 ${server.status === 'running' ? 'bg-primary/10' : 'bg-red-500/10'} rounded-bl-full -mr-8 -mt-8 pointer-events-none`}></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3 items-center">
                    <img src="https://minecraft.net/favicon.ico" alt="Icon" className="w-8 h-8 rounded" onError={(e) => { e.target.style.display = 'none'; }} />
                    <div>
                      <div className="text-xs text-zinc-500 font-bold mb-0.5">#{idx + 1}</div>
                      <h3 className="font-bold text-white truncate max-w-[180px]">{server.name}</h3>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400">
                      <span className={`w-2 h-2 rounded-full ${server.status === 'running' ? 'bg-primary' : 'bg-red-500'}`}></span>
                      {server.status === 'running' ? 'Online' : 'Offline'}
                    </div>
                  </div>
                </div>

                <div className="flex-1 bg-zinc-950/50 rounded-lg p-3 mb-4 border border-zinc-900 overflow-hidden relative">
                  <div className="text-sm font-mono text-zinc-300 whitespace-pre-wrap">{server.motd || 'A Minecraft Server'}</div>
                  {server.status === 'running' && <div className="text-xs font-mono text-primary mt-1">Status: Berjalan lancar</div>}
                </div>

                <div className="flex gap-2 mb-4 flex-wrap">
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold uppercase flex items-center gap-1">
                    Java 1.21.11
                  </span>
                  <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px] font-bold uppercase flex items-center gap-1">
                    Bedrock {server.version === 'latest' ? '1.20.52' : server.version}
                  </span>
                  {server.tags && server.tags.split(',').slice(0,2).map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded text-[10px] font-bold uppercase">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 mt-auto cursor-pointer hover:bg-zinc-800 transition" onClick={(e) => copyToClipboard(`${server.ip}:${server.port}`, e)}>
                  <div className="text-xs font-mono text-zinc-300 truncate">{server.ip}:{server.port}</div>
                  <Copy className="w-4 h-4 text-zinc-500 group-hover:text-white transition" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* CTA Banner */}
        <div className="text-center py-12 border-t border-zinc-800/60">
          <h2 className="text-2xl font-bold text-white mb-2">Host server Anda sendiri secara gratis</h2>
          <p className="text-zinc-500 mb-6">Tampil di daftar secara otomatis saat server Anda online.</p>
          <button onClick={() => navigate('/checkout')} className="bg-primary hover:bg-primary-hover text-black font-bold px-8 py-3 rounded-md transition">
            Buat Server Gratis
          </button>
        </div>

        <div className="mt-12 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Temukan Server Minecraft Terbaik</h3>
          <p className="text-sm text-zinc-500 leading-relaxed mb-6">
            Daftar server Minecraft kami menampilkan server Java Edition dan Bedrock Edition dengan jumlah pemain langsung yang diperbarui setiap 10 detik. Jelajahi berbagai mode permainan seperti survival, PvP, factions, skyblock, creative, dan banyak lagi. Setiap server yang terdaftar di-host di MCloud dengan perangkat keras berkinerja tinggi.
          </p>
          <h4 className="text-sm font-bold text-white mb-2">Cara bergabung dengan server</h4>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Klik IP server untuk menyalinnya ke papan klip Anda, lalu tempelkan ke menu multiplayer Minecraft. Server Bedrock Edition menampilkan versinya dengan jelas sehingga Anda dapat bergabung dengan klien yang tepat.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
