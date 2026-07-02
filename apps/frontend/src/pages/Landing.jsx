import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Server, Shield, Zap, Clock, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { api } from '../services/api';

export default function Landing() {
  const navigate = useNavigate();

  const [pricingPlans, setPricingPlans] = useState([
    { name: 'Villager', sub: '24/7 Always Online', ram: '500MB RAM', price: 30000, discount: 0, recommended: false, icon: 'MHF_Villager' },
    { name: 'Spider', sub: '24/7 Always Online', ram: '1GB RAM', price: 40000, discount: 0, recommended: false, icon: 'MHF_Spider' },
    { name: 'Slime', sub: '24/7 Always Online', ram: '2GB RAM', price: 50000, discount: 0, recommended: true, icon: 'MHF_Slime' },
    { name: 'Wither', sub: '24/7 Always Online', ram: '4GB RAM', price: 60000, discount: 0, recommended: false, icon: 'MHF_Wither' },
  ]);

  useEffect(() => {
    document.title = 'MCloud - Game Server Hosting';
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const hiddenElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    hiddenElements.forEach((el) => observer.observe(el));

    api.getPlans().then(data => {
        const withAvatars = data.map(p => {
          let ramStr = p.ram || '500MB RAM';
          const r = ramStr.toLowerCase();
          if (r === '500m' || r === '500mb') ramStr = '500MB RAM';
          else if (r === '1g' || r === '1gb') ramStr = '1GB RAM';
          else if (r === '2g' || r === '2gb') ramStr = '2GB RAM';
          else if (r === '4g' || r === '4gb') ramStr = '4GB RAM';
          else if (r === '8g' || r === '8gb') ramStr = '8GB RAM';
          else if (!ramStr.toUpperCase().includes('RAM')) ramStr = `${ramStr.toUpperCase()} RAM`;

          return {
            ...p,
            sub: p.sub || '24/7 Always Online',
            ram: ramStr,
            icon: `MHF_${p.name}`,
            recommended: p.name.toLowerCase() === 'slime'
          };
        });
        setPricingPlans(withAvatars);
    }).catch(err => console.error("Failed to fetch plans", err));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const testimonialsRow1 = [
    { name: 'Rian Pratama', country: 'Jakarta', text: 'Dukungan di Discord benar-benar responsif. Saya membuka tiket tentang konflik plugin dan mendapat penjelasan yang tepat, bukan balasan copas. Server telah stabil selama sekitar 2 bulan sekarang.', rating: 5 },
    { name: 'Budi Santoso', country: 'Surabaya', text: 'Saya sudah mencoba beberapa host Minecraft selama bertahun-tahun dan kebanyakan memiliki masalah atau lag terus-menerus. MCloud secara mengejutkan stabil. Paket Slime lebih dari cukup untuk SMP kecil saya.', rating: 5 },
    { name: 'dinda.putri', country: 'Bandung', text: 'Saya terutama menggunakannya untuk dunia survival pribadi dengan teman-teman. Performa konsisten dan fitur mulai otomatis membuatnya nyaman karena kami tidak bermain 24/7. Saya juga suka karena pencadangan sudah termasuk.', rating: 5 },
    { name: 'Reza Aditya', country: 'Medan', text: 'Panel kontrol sangat mudah dipahami, bahkan untuk orang yang belum pernah meng-host server sebelumnya. Menginstal plugin hanya dengan beberapa klik tanpa mengganti versi atau melakukan pengaturan rumit.', rating: 5 },
  ];
  
  const testimonialsRow2 = [
    { name: 'Lukman Hakim', country: 'Yogyakarta', text: 'Pindah dari host populer lainnya karena lonjakan lag yang konstan. Di sini pengalamannya jauh lebih mulus. Bahkan selama acara dengan 15+ pemain, server bertahan dengan baik. Harga pada paket berbayar wajar.', rating: 5 },
    { name: 'Nico_MC', country: 'Bali', text: 'Saya mulai dengan paket awal hanya untuk mencobanya dan tidak berharap banyak. Setelah beberapa minggu, saya masih di sini. Pengaturan mudah, waktu aktif stabil, dan komunitas ramah di Discord. Pilihan solid dan sangat terjangkau.', rating: 5 },
    { name: 'MiaCrafts', country: 'Semarang', text: 'Saya menggunakan paket starter untuk menguji bangunan dan datapack sebelum mengunggahnya ke server komunitas yang lebih besar. Pengelola file dan akses konsol memudahkan untuk mengubah sesuatu dengan cepat. Cukup andal untuk apa pun.', rating: 5 },
    { name: 'Johan Wijaya', country: 'Makassar', text: 'Nilai yang tak tertandingi untuk harganya. Dukungan cepat dan sangat membantu. Saya menjalankan server modded dan jaminan waktu aktif 24/7 memang benar. Pasti merekomendasikan kepada siapa pun yang mencari host.', rating: 5 },
  ];

  const featuredServers = [
    { name: 'Nusantara SMP', players: '45/100', version: 'Java 1.20.4', tags: ['SMP', 'Economy'] },
    { name: 'Bedwars Indo', players: '120/200', version: 'Bedrock 1.20', tags: ['Minigames', 'PvP'] },
    { name: 'Skyblock Legend', players: '89/150', version: 'Java 1.19.4', tags: ['Skyblock', 'Grind'] },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <div id="home" className="relative pt-40 pb-32 lg:pt-52 lg:pb-40 overflow-hidden border-b border-zinc-800/60">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            poster="/minecraft-hero.webp"
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen pointer-events-none"
          >
            <source src="/hero-animation.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#0a0a0a]/80 to-[#0a0a0a]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.18)_0%,transparent_70%)] pointer-events-none animate-pulse" style={{ animationDuration: '5s' }}></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 mb-6 animate-badge-pop">
              <span className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              <span className="text-xs">
                <span className="font-bold text-white tracking-wide">MCloud</span> <span className="text-zinc-300">Server Online</span>
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight animate-hero-title">
              Hosting Server Minecraft<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">
                Masa Depan
              </span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-hero-sub">
              MCloud memberikan performa maksimal dengan harga yang terjangkau. Kelola server Anda dengan kontrol panel modern, cepat, dan mudah digunakan.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-hero-buttons">
              <button 
                onClick={() => navigate('/register')}
                className="px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base bg-primary hover:bg-primary-hover text-white font-bold rounded-md transition shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                Mulai Sekarang <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => navigate('/server-list')}
                className="px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-bold rounded-md transition flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                Jelajahi Server
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="py-24 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 reveal">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Mengapa Memilih MCloud?</h2>
              <p className="text-zinc-500">Infrastruktur kelas atas yang didesain khusus untuk Minecraft.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Zap, title: 'Performa Instan', desc: 'Server aktif dalam hitungan detik setelah pembayaran.' },
                { icon: Shield, title: 'Anti DDoS', desc: 'Perlindungan DDoS bawaan untuk menjaga server tetap online.' },
                { icon: Server, title: 'Panel Modern', desc: 'Kontrol penuh via console, file manager, dan pengaturan lengkap.' },
                { icon: Clock, title: 'Uptime 99.9%', desc: 'Infrastruktur andal yang memastikan server Anda selalu hidup.' }
              ].map((feature, i) => (
                <div key={i} className="bg-[#101010] border border-zinc-800/60 p-6 rounded-xl hover:border-primary/30 transition group reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center mb-4 border border-zinc-800 group-hover:bg-primary/10 transition">
                    <feature.icon className="w-6 h-6 text-zinc-400 group-hover:text-primary transition" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div id="pricing" className="py-24 border-y border-zinc-800/60 relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-[url('/price.jpg')] bg-cover bg-center bg-fixed opacity-30"
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-black/80 to-[#0a0a0a]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.15)_0%,transparent_70%)] pointer-events-none"></div>
          
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent z-10"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16 reveal">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Pilih Paket Server Anda</h2>
              <p className="text-zinc-400">Harga transparan tanpa biaya tersembunyi. Bebas ganti paket kapan saja.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-sm md:max-w-none mx-auto">
              {pricingPlans.map((plan, i) => (
                <div key={i} className={`relative bg-black/50 backdrop-blur-md border ${
                  plan.recommended 
                    ? 'border-primary shadow-[0_0_30px_rgba(16,185,129,0.2)]' 
                    : 'border-zinc-800/80'
                } p-8 rounded-xl flex flex-col reveal`} style={{ transitionDelay: `${i * 150}ms` }}>
                  {plan.recommended && (
                    <div className="absolute -top-4 inset-x-0 flex justify-center">
                      <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Terpopuler
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 mb-6">
                    <img 
                      src={`https://mc-heads.net/avatar/${plan.icon}/64`} 
                      alt={plan.name} 
                      className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 p-1"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                      <p className="text-xs text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {plan.sub || '24/7 Always Online'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1 mb-6 border-b border-zinc-800/60 pb-6">
                    <span className="text-zinc-400 font-semibold">Rp</span>
                    <span className="text-4xl font-extrabold text-white">{(plan.price - (plan.price * (plan.discount || 0) / 100)).toLocaleString()}</span>
                    <span className="text-zinc-500">/bln</span>
                    {plan.discount > 0 && (
                      <span className="ml-2 text-xs text-red-400 line-through">Rp {plan.price.toLocaleString()}</span>
                    )}
                  </div>
                  
                  <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-center gap-3 text-sm text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-primary" /> {plan.ram}
                    </li>
                    <li className="flex items-center gap-3 text-sm text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-primary" /> Unmetered Bandwidth
                    </li>
                    <li className="flex items-center gap-3 text-sm text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-primary" /> Akses FTP & Konsol Penuh
                    </li>
                    <li className="flex items-center gap-3 text-sm text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-primary" /> Dukungan 24/7
                    </li>
                  </ul>
                  
                  {plan.available === false && (
                    <div className="mb-3 text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded-md text-center">
                      Stok paket saat ini sedang habis
                    </div>
                  )}
                  <button 
                    disabled={plan.available === false}
                    onClick={() => navigate(`/checkout?plan=${plan.name.toLowerCase()}`)}
                    className={`w-full py-3 rounded-md font-bold transition ${
                      plan.available === false 
                        ? 'bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed' 
                        : plan.recommended 
                          ? 'bg-primary hover:bg-primary-hover text-white' 
                          : 'bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white'
                    }`}
                  >
                    {plan.available === false ? 'Stok Habis' : 'Pilih Paket'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Servers */}
        <div className="py-24 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 reveal">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Server Unggulan</h2>
                <p className="text-zinc-500">Beberapa server publik populer yang dihosting di MCloud.</p>
              </div>
              <button 
                onClick={() => navigate('/server-list')}
                className="text-primary hover:text-emerald-400 font-semibold flex items-center gap-1 transition"
              >
                Lihat Semua Server <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredServers.map((server, i) => (
                <div key={i} className="bg-[#101010] border border-zinc-800/60 p-5 rounded-xl hover:border-zinc-700 transition group cursor-pointer reveal" style={{ transitionDelay: `${i * 150}ms` }} onClick={() => navigate('/server-list')}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-3 items-center">
                      <img src="https://minecraft.net/favicon.ico" alt="Icon" className="w-10 h-10 rounded-lg border border-zinc-800" onError={(e) => { e.target.style.display = 'none'; }} />
                      <div>
                        <h3 className="font-bold text-white">{server.name}</h3>
                        <div className="text-xs text-emerald-500 font-bold flex items-center gap-1 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm mb-4 bg-black p-3 rounded-xl border border-zinc-900">
                    <span className="text-zinc-500 font-medium">Pemain</span>
                    <span className="text-zinc-200 font-bold">{server.players}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-xl text-[10px] font-bold uppercase">
                      {server.version}
                    </span>
                    {server.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary rounded-xl text-[10px] font-bold uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-24 bg-[#0a0a0a] border-y border-zinc-800/60 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-16">
            <div className="text-center reveal">
              <h2 className="text-3xl font-bold text-white mb-4">Apa Kata Mereka?</h2>
              <p className="text-zinc-500">Ribuan pemain dan admin server telah mempercayakan server mereka kepada kami.</p>
            </div>
          </div>

          <div className="relative overflow-hidden w-full max-w-[90%] mx-auto py-4 reveal" style={{ transitionDelay: '200ms' }}>
            <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none"></div>

            <div className="flex flex-col gap-6 relative z-0">
              <div className="flex gap-6 animate-marquee w-max">
                {[...testimonialsRow1, ...testimonialsRow1].map((testi, i) => (
                  <div key={`row1-${i}`} className="w-[400px] shrink-0 bg-[#101010] border border-zinc-800/60 p-6 rounded-xl relative flex flex-col gap-4 hover:-translate-y-2 hover:border-primary/50 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] transition-all duration-300">
                    <div className="flex gap-1">
                      {[...Array(testi.rating)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-zinc-300 text-sm leading-relaxed flex-1 line-clamp-4">{testi.text}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="w-9 h-9 bg-[#0b2816] text-primary rounded-full flex items-center justify-center font-bold text-sm">
                        {testi.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm leading-tight">{testi.name}</h4>
                        <p className="text-xs text-zinc-500">{testi.country}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-6 animate-marquee-reverse w-max -ml-[200px]">
                {[...testimonialsRow2, ...testimonialsRow2].map((testi, i) => (
                  <div key={`row2-${i}`} className="w-[400px] shrink-0 bg-[#101010] border border-zinc-800/60 p-6 rounded-xl relative flex flex-col gap-4 hover:-translate-y-2 hover:border-primary/50 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] transition-all duration-300">
                    <div className="flex gap-1">
                      {[...Array(testi.rating)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-zinc-300 text-sm leading-relaxed flex-1 line-clamp-4">{testi.text}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="w-9 h-9 bg-[#0b2816] text-primary rounded-full flex items-center justify-center font-bold text-sm">
                        {testi.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm leading-tight">{testi.name}</h4>
                        <p className="text-xs text-zinc-500">{testi.country}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* FAQ Section */}
        <div id="faq" className="py-24 bg-[#0a0a0a]">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16 reveal">
              <h2 className="text-3xl font-bold text-white mb-4">Pertanyaan yang Sering Diajukan</h2>
              <p className="text-zinc-500">Temukan jawaban untuk pertanyaan umum seputar layanan MCloud.</p>
            </div>
            
            <div className="space-y-4">
              {[
                { q: "Apakah saya bisa menginstal mod atau plugin?", a: "Tentu! Server kami mendukung berbagai macam platform. Anda memiliki akses penuh ke File Manager untuk mengunggah mod, plugin, maupun custom world." },
                { q: "Berapa lama server aktif setelah pembayaran?", a: "Sistem kami melakukan instalasi otomatis secara instan. Server Anda akan online dan siap dimainkan dalam hitungan detik setelah pembayaran dikonfirmasi." },
                { q: "Apakah saya bisa upgrade paket RAM nantinya?", a: "Untuk saat ini, fitur upgrade atau downgrade paket (scaling RAM) belum tersedia. Kami menyarankan Anda untuk memilih paket yang sesuai dengan kebutuhan Anda sejak awal." },
                { q: "Di mana lokasi server MCloud?", a: "Server kami berlokasi di Jakarta, Indonesia, memastikan latensi (ping) yang sangat rendah untuk pengalaman bermain tanpa lag bagi pemain lokal." }
              ].map((faq, i) => (
                <details key={i} className="group bg-[#101010] border border-zinc-800/60 rounded-xl overflow-hidden reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                  <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-white hover:text-primary transition-colors marker:content-none">
                    {faq.q}
                    <span className="text-primary group-open:rotate-180 transition-transform duration-300">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-zinc-400 leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* Ready to Start (CTA) */}
        <div className="py-24 bg-[#101010] border-t border-zinc-800/60 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15)_0%,transparent_70%)] pointer-events-none"></div>
          
          {/* Gambar Kiri (Mob) - Ganti src gambar dengan yang Anda inginkan */}
          <div className="hidden md:block absolute left-[5%] lg:left-[20%] bottom-0 z-10 pointer-events-none reveal-left">
            <img src="/steve.png" alt="Mob Kiri" className="h-32 lg:h-56 w-auto object-contain opacity-80 drop-shadow-[0_0_15px_rgba(16,185,129,0.2)] transform hover:-translate-y-4 transition-transform duration-500 pointer-events-auto" />
          </div>
          
          {/* Gambar Kanan (Steve) - Ganti src gambar dengan yang Anda inginkan */}
          <div className="hidden md:block absolute right-[5%] lg:right-[20%] bottom-0 z-10 pointer-events-none reveal-right">
            <img src="/creep.png" alt="Steve Kanan" className="h-32 lg:h-56 w-auto object-contain opacity-80 drop-shadow-[0_0_15px_rgba(16,185,129,0.2)] transform scale-x-[-1] hover:-translate-y-4 transition-transform duration-500 pointer-events-auto" />
          </div>

          <div className="max-w-3xl mx-auto px-6 text-center relative z-20 reveal">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Siap Memulai Petualangan?</h2>
            <p className="text-lg text-zinc-400 mb-10">
              Bergabunglah dengan ribuan pemain lain yang telah merasakan performa maksimal dari MCloud. Buat server Anda sekarang dan undang teman-teman Anda!
            </p>
            <button 
              onClick={() => navigate('/register')}
              className="px-6 py-3 sm:px-10 sm:py-5 text-sm sm:text-base w-full sm:w-auto justify-center bg-primary hover:bg-primary-hover text-white font-bold rounded-md transition shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center gap-2 mx-auto pointer-events-auto"
            >
              Daftar Sekarang <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
