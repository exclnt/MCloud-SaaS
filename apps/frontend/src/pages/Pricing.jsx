import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export default function Pricing() {
  const navigate = useNavigate();
  const [pricingPlans, setPricingPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    document.title = 'Harga Server - MCloud';
    const fetchPlans = async () => {
      try {
        const data = await api.getPlans();
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
      } catch (err) {
        toast.error('Gagal memuat paket harga');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Pilih Paket Server Anda</h1>
            <p className="text-lg text-zinc-500">Harga transparan tanpa biaya tersembunyi. Bebas ganti paket kapan saja.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-sm md:max-w-none mx-auto">
            {pricingPlans.map((plan, i) => (
              <div key={i} className={`relative bg-[#101010] border ${plan.recommended ? 'border-primary shadow-[0_0_30px_rgba(16,185,129,0.15)]' : 'border-zinc-800/60'} p-8 rounded-xl flex flex-col hover:border-primary/50 transition duration-300`}>
                {plan.recommended && (
                  <div className="absolute -top-4 inset-x-0 flex justify-center">
                    <span className="bg-primary text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
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
                
                <button 
                  onClick={() => navigate(`/checkout?plan=${plan.name.toLowerCase()}`)}
                  className={`w-full py-3 rounded-md font-bold transition ${plan.recommended ? 'bg-primary hover:bg-primary-hover text-black' : 'bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white'}`}
                >
                  Pilih Paket
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
