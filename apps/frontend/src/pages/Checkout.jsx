import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import {
  CreditCard,
  Server,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Settings2
} from "lucide-react";

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  
  const [config, setConfig] = useState({
    name: '',
    version: 'latest',
    difficulty: 'easy',
    gamemode: 'survival',
    seed: ''
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "SB-Mid-client-YOUR_CLIENT_KEY");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCheckout = async () => {
    if (!config.name) {
      alert("Please enter a server name!");
      return;
    }
    
    setLoading(true);
    try {
      const data = await api.checkout(50000, config);

      window.snap.pay(data.token, {
        onSuccess: function (result) {
          setSuccess(true);
          setTimeout(() => navigate("/dashboard"), 3000);
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background -z-10"></div>
        <div className="glass-panel p-12 rounded-3xl text-center max-w-md animate-slide-up">
          <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Payment Successful!</h2>
          <p className="text-zinc-400 mb-8">
            Your server is being provisioned with your custom settings. You will be
            redirected shortly.
          </p>
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 relative flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-secondary/10 via-background to-background -z-10"></div>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8">
        
        {/* Left Form Column */}
        <div className="glass-panel p-8 md:p-10 rounded-3xl animate-slide-up">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>

          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Settings2 className="w-6 h-6 text-primary" /> Server Configuration
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Server Name *</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="My Awesome Server"
                value={config.name}
                onChange={e => setConfig({...config, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Minecraft Version</label>
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
                  <option value="latest">Latest Release</option>
                  <option value="preview">Preview (Beta)</option>
                  <option value="custom">Custom Version</option>
                </select>
                {(config.version !== 'latest' && config.version !== 'preview') && (
                  <input 
                    type="text" 
                    className="input-field mt-2" 
                    placeholder="e.g. 1.20.10.01"
                    value={config.version}
                    onChange={e => setConfig({...config, version: e.target.value})}
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Game Mode</label>
                <select 
                  className="input-field appearance-none"
                  value={config.gamemode}
                  onChange={e => setConfig({...config, gamemode: e.target.value})}
                >
                  <option value="survival">Survival</option>
                  <option value="creative">Creative</option>
                  <option value="adventure">Adventure</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Difficulty</label>
                <select 
                  className="input-field appearance-none"
                  value={config.difficulty}
                  onChange={e => setConfig({...config, difficulty: e.target.value})}
                >
                  <option value="peaceful">Peaceful</option>
                  <option value="easy">Easy</option>
                  <option value="normal">Normal</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">World Seed (Optional)</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Random"
                  value={config.seed}
                  onChange={e => setConfig({...config, seed: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Payment Column */}
        <div className="glass-panel p-8 md:p-10 rounded-3xl flex flex-col justify-center animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl mb-8">
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 p-3 rounded-xl">
                <Server className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  MCloud Server Instance
                </h3>
                <p className="text-zinc-400 text-sm mb-4">
                  1 Month • 500MB RAM • Persistent Volume
                </p>
                <div className="inline-flex items-center gap-2 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800">
                  <span className="text-primary font-bold">IDR 50.000</span>
                  <span className="text-zinc-500 text-xs">/mo</span>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4 text-white">
            Complete Purchase
          </h2>
          <p className="text-zinc-400 mb-8 text-sm">
            Secure payment processing powered by Midtrans. The server will be provisioned instantly after payment success using your chosen configuration.
          </p>

          <button
            onClick={handleCheckout}
            disabled={loading || !config.name}
            className="btn-primary !py-4 flex items-center justify-center gap-3 text-lg disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <CreditCard className="w-6 h-6" />
            )}
            {loading ? "Processing..." : "Pay IDR 50.000"}
          </button>

          <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
            <span className="text-xs text-zinc-600 uppercase tracking-widest font-semibold">
              Protected by Midtrans Sandbox
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
