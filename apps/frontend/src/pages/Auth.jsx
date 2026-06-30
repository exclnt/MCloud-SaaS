import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Server, Lock, User, UserPlus, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

export default function Auth() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Decide initial mode based on route
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setIsLogin(location.pathname === '/login');
    setError('');
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const data = await api.login(username, password);
        localStorage.setItem('token', data.token);
      } else {
        await api.register(username, password);
        const data = await api.login(username, password);
        localStorage.setItem('token', data.token);
      }
      
      const redirect = searchParams.get('redirect');
      const plan = searchParams.get('plan');
      
      if (redirect === 'checkout') {
        navigate(`/checkout?plan=${plan || 'slime'}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setUsername('');
    setPassword('');
    // Update URL without reloading
    navigate(isLogin ? `/register${location.search}` : `/login${location.search}`, { replace: true });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 overflow-hidden relative">
      <div className="absolute inset-0 bg-[#050505]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.15)_0%,transparent_50%)] -z-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.15)_0%,transparent_50%)] -z-10"></div>
      
      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group z-50"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold">Kembali</span>
      </button>

      {/* Main Container */}
      <div className="relative w-full max-w-4xl h-[550px] bg-[#0a0a0a] rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-zinc-800 flex">
        
        {/* ================= REGISTER FORM (LEFT) ================= */}
        <div className={`absolute top-0 left-0 w-1/2 h-full p-8 flex flex-col justify-center transition-all duration-1000 ease-in-out z-10 ${isLogin ? 'opacity-0 pointer-events-none -translate-x-[20%]' : 'opacity-100 translate-x-0 delay-200'}`}>
          <div className="max-w-sm mx-auto w-full">
            <h2 className="text-3xl font-extrabold mb-2 text-white">Buat Akun</h2>
            <p className="text-sm text-zinc-400 mb-6">Bergabunglah dengan MCloud untuk hosting duniamu.</p>
            
            {error && !isLogin && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-sm">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-secondary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Username" 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-secondary transition-colors" />
                <input 
                  type="password" 
                  placeholder="Kata Sandi" 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-secondary text-white font-bold rounded-md shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    Daftar <UserPlus className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
            
            <p className="text-center mt-6 text-zinc-400">
              Apakah kamu sudah memiliki akun? <button type="button" onClick={toggleMode} className="text-secondary hover:text-blue-400 font-bold transition-colors">Masuk</button>
            </p>
          </div>
        </div>

        {/* ================= LOGIN FORM (RIGHT) ================= */}
        <div className={`absolute top-0 right-0 w-1/2 h-full p-8 flex flex-col justify-center transition-all duration-1000 ease-in-out z-10 ${!isLogin ? 'opacity-0 pointer-events-none translate-x-[20%]' : 'opacity-100 translate-x-0 delay-200'}`}>
          <div className="max-w-sm mx-auto w-full">
            <h2 className="text-3xl font-extrabold mb-2 text-white">Selamat Datang</h2>
            <p className="text-sm text-zinc-400 mb-6">Masuk untuk mengelola servermu.</p>
            
            {error && isLogin && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-sm">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Username" 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                <input 
                  type="password" 
                  placeholder="Kata Sandi" 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-primary text-black font-bold rounded-md shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    Masuk <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center mt-6 text-zinc-400">
              Belum memiliki akun? <button type="button" onClick={toggleMode} className="text-primary hover:text-emerald-400 font-bold transition-colors">Daftar</button>
            </p>
          </div>
        </div>

        {/* ================= THUMB OVERLAY ================= */}
        <div className={`absolute top-0 left-0 w-1/2 h-full z-20 transition-transform duration-1000 ease-in-out pointer-events-none ${isLogin ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="w-full h-full p-4">
            <div className={`w-full h-full rounded-xl relative overflow-hidden flex flex-col items-center justify-center text-center p-10 transition-colors duration-1000 ${isLogin ? 'bg-zinc-900' : 'bg-zinc-900'}`}>
               
               {/* Colorful animated gradient background */}
               <div className={`absolute inset-0 transition-opacity duration-1000 ${isLogin ? 'opacity-100' : 'opacity-0'}`}>
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-[#0a0a0a] to-[#0a0a0a]"></div>
                 <div className="absolute w-96 h-96 bg-primary/30 rounded-full blur-3xl -top-20 -left-20"></div>
                 <div className="absolute w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl bottom-0 right-0"></div>
               </div>
               
               <div className={`absolute inset-0 transition-opacity duration-1000 ${!isLogin ? 'opacity-100' : 'opacity-0'}`}>
                 <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-[#0a0a0a] to-[#0a0a0a]"></div>
                 <div className="absolute w-96 h-96 bg-secondary/30 rounded-full blur-3xl -top-20 -right-20"></div>
                 <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl bottom-0 left-0"></div>
               </div>

               {/* Overlay Pattern */}
               <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
               
               <div className="relative z-10 flex flex-col items-center h-full justify-center">
                 <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 shadow-2xl transition-all duration-1000 ${isLogin ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
                   <Server className="w-10 h-10" />
                 </div>
                 
                 <h3 className="text-3xl font-bold text-white mb-4 tracking-tight leading-tight">
                   {isLogin ? (
                     <>Mulai<br/>Perjalananmu<br/>Sekarang</>
                   ) : (
                     <>Selamat<br/>Datang<br/>Kembali</>
                   )}
                 </h3>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
