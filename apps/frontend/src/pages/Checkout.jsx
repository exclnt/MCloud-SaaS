import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import {
  CreditCard,
  Server,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Settings2,
  User
} from "lucide-react";

const PLAN_DETAILS = {
  villager: { name: 'Villager', ram: '500MB', price: 30000, priceStr: '30.000', icon: 'MHF_Villager', desc: 'Cocok untuk server bertahan hidup (survival) pribadi dengan beberapa teman.' },
  spider: { name: 'Spider', ram: '1GB', price: 40000, priceStr: '40.000', icon: 'MHF_Spider', desc: 'Ideal untuk server skala menengah dengan tambahan plugin dasar.' },
  slime: { name: 'Slime', ram: '2GB', price: 50000, priceStr: '50.000', icon: 'MHF_Slime', desc: 'Sempurna untuk server komunitas dengan sistem ekonomi atau minigame.' },
  wither: { name: 'Wither', ram: '4GB', price: 60000, priceStr: '60.000', icon: 'MHF_Wither', desc: 'Performa maksimal untuk server besar, modpack, dan menampung banyak pemain.' },
};

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const planKey = searchParams.get('plan') || 'slime';
  const selectedPlan = PLAN_DETAILS[planKey] || PLAN_DETAILS['slime'];
  
  const isRenew = searchParams.get('renew') === 'true';
  const renewServerId = searchParams.get('serverId');
  const renewServerPort = searchParams.get('port');
  const renewServerName = searchParams.get('serverName') || 'Server Anda';
  
  const token = localStorage.getItem('token');
  
  const [config, setConfig] = useState({
    name: '',
    version: 'latest',
    difficulty: 'easy',
    gamemode: 'survival',
    seed: ''
  });

  useEffect(() => {
    // Restore config if coming back from login
    const saved = sessionStorage.getItem('checkout_config');
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
        sessionStorage.removeItem('checkout_config');
      } catch(e) {}
    }

    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "SB-Mid-client-YOUR_CLIENT_KEY");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleLoginRedirect = () => {
    sessionStorage.setItem('checkout_config', JSON.stringify(config));
    navigate(`/login?redirect=checkout&plan=${planKey}`);
  };

  const handleCheckout = async () => {
    if (!isRenew && !config.name) {
      alert("Harap masukkan nama server!");
      return;
    }
    
    setLoading(true);
    try {
      const memStr = selectedPlan.ram.toLowerCase().replace('mb', 'm').replace('gb', 'g');
      const payloadConfig = isRenew
        ? { renew: true, serverId: parseInt(renewServerId), days: 30 }
        : { ...config, memoryLimit: memStr };

      const data = await api.checkout(selectedPlan.price, payloadConfig);

      window.snap.pay(data.token, {
        onSuccess: function (result) {
          setSuccess(true);
          // Wait 4 seconds to give webhook time to update DB before fetching on new page
          setTimeout(() => navigate(isRenew && renewServerPort ? `/server/${renewServerPort}` : "/dashboard"), 4000);
        },
        onPending: function (result) {
          console.log("pending", result);
        },
        onError: function (result) {
          console.error("error", result);
          setLoading(false);
        },
        onClose: function () {
          setLoading(false);
        },
      });
    } catch (e) {
      console.error(e);
      alert(e.message);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-panel p-12 rounded-xl text-center max-w-md animate-slide-up border-zinc-800 bg-[#101010]">
          <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Pembayaran Berhasil!</h2>
          <p className="text-zinc-400 mb-8">
            Server Anda sedang disiapkan dengan pengaturan kustom Anda. Anda akan
            dialihkan sebentar lagi.
          </p>
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 relative flex items-center justify-center">

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8">
        
        {/* Left Form Column */}
        <div className="glass-panel p-5 md:p-6 rounded-xl bg-[#101010] animate-slide-up">
          <button
            onClick={() => navigate(isRenew && renewServerPort ? `/server/${renewServerPort}` : "/")}
            className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>

          {isRenew ? (
            <>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Settings2 className="w-6 h-6 text-primary" /> Perpanjang Sewa Server
              </h2>
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center">
                <Server className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{renewServerName}</h3>
                <p className="text-zinc-400">
                  Anda akan memperpanjang masa aktif server ini selama 30 hari ke depan. Server Anda tidak akan mengalami perubahan data atau pengaturan selama proses perpanjangan.
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Settings2 className="w-6 h-6 text-primary" /> 1. Pengaturan Server
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Nama Server *</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Server Keren Saya"
                    value={config.name}
                    onChange={e => setConfig({...config, name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Versi Minecraft</label>
                    <select 
                      className="input-field appearance-none"
                      value={config.version === 'latest' || config.version === 'preview' ? config.version : 'custom'}
                      onChange={e => {
                        if (e.target.value !== 'custom') {
                          setConfig({...config, version: e.target.value});
                        } else {
                          setConfig({...config, version: ''});
                        }
                      }}
                    >
                      <option value="latest">Rilis Terbaru</option>
                      <option value="preview">Preview (Beta)</option>
                      <option value="custom">Versi Kustom</option>
                    </select>
                    {(config.version !== 'latest' && config.version !== 'preview') && (
                      <input 
                        type="text" 
                        className="input-field mt-2" 
                        placeholder="misal: 1.20.10.01"
                        value={config.version}
                        onChange={e => setConfig({...config, version: e.target.value})}
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Mode Permainan</label>
                    <select 
                      className="input-field appearance-none"
                      value={config.gamemode}
                      onChange={e => setConfig({...config, gamemode: e.target.value})}
                    >
                      <option value="survival">Bertahan Hidup (Survival)</option>
                      <option value="creative">Kreatif (Creative)</option>
                      <option value="adventure">Petualangan (Adventure)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Tingkat Kesulitan</label>
                    <select 
                      className="input-field appearance-none"
                      value={config.difficulty}
                      onChange={e => setConfig({...config, difficulty: e.target.value})}
                    >
                      <option value="peaceful">Damai (Peaceful)</option>
                      <option value="easy">Mudah (Easy)</option>
                      <option value="normal">Normal</option>
                      <option value="hard">Sulit (Hard)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Seed Dunia (Opsional)</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="Acak"
                      value={config.seed}
                      onChange={e => setConfig({...config, seed: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Payment Column */}
        <div className="glass-panel p-5 md:p-6 rounded-xl bg-[#101010] flex flex-col justify-center animate-slide-up" style={{ animationDelay: "0.1s" }}>
          
          <div className="flex items-center gap-4 mb-6">
            <img 
              src={`https://mc-heads.net/avatar/${selectedPlan.icon}/64`} 
              alt={selectedPlan.name} 
              className="w-12 h-12" 
            />
            <div>
              <h3 className="text-2xl font-bold text-white">
                Paket {selectedPlan.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-zinc-400 mt-1">
                <span>RAM {selectedPlan.ram}</span>
                <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
                <span>Penyimpanan Permanen</span>
              </div>
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-6 border-b border-zinc-800/60 pb-6">
            <span className="text-3xl font-extrabold text-primary">Rp {selectedPlan.priceStr}</span>
            <span className="text-zinc-500 text-sm">/ 1 Bulan</span>
          </div>
          
          <div className="space-y-4 mb-8">
            <p className="text-sm text-zinc-300 leading-relaxed">
              <strong className="text-white">Detail Paket:</strong> {selectedPlan.desc}
            </p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Pembayaran ini bersifat satu kali untuk 30 hari ke depan. Harga sudah termasuk perlindungan anti-DDoS, dan akses FTP penuh. Transaksi diproses secara instan dan aman via Midtrans.
            </p>
          </div>

          <h2 className="text-xl font-bold mb-4 text-white">
            2. Selesaikan Pembelian
          </h2>
          <p className="text-zinc-400 mb-8 text-sm">
            {token ? "Tinjau detail server Anda dan lanjutkan ke pembayaran aman." : "Anda harus masuk (login) terlebih dahulu untuk menyelesaikan pembelian server ini ke akun Anda."}
          </p>

          {!token ? (
            <button
              onClick={handleLoginRedirect}
              className="btn-primary !py-4 flex items-center justify-center gap-3 text-lg"
            >
              <User className="w-6 h-6" />
              Masuk untuk Melanjutkan
            </button>
          ) : (
            <button
              onClick={handleCheckout}
              disabled={loading || (!isRenew && !config.name)}
              className="btn-primary !py-4 flex items-center justify-center gap-3 text-lg disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <CreditCard className="w-6 h-6" />
              )}
              {loading ? "Memproses..." : `Bayar Rp ${selectedPlan.priceStr}`}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
