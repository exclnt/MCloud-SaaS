import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Server, Lock, User, UserPlus, ArrowRight, ArrowLeft, Loader2, Rocket, Key, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';

export default function Auth() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Decide initial mode based on route
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    setIsLogin(location.pathname === '/login');
    document.title = location.pathname === '/login' ? 'Masuk - MCloud' : 'Daftar - MCloud';
    setError('');
    setSuccess('');
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (isLogin) {
        const data = await api.login(username, password);
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);
        if (data.role) localStorage.setItem('role', data.role);
        setSuccess('Berhasil masuk! Mengalihkan...');
      } else {
        if (password !== confirmPassword) {
          setError('Kata sandi tidak cocok!');
          setLoading(false);
          return;
        }
        localStorage.setItem('token', data.token);
        setSuccess('Pendaftaran berhasil! Mengalihkan...');
      }
      
      const redirect = searchParams.get('redirect');
      const plan = searchParams.get('plan');
      
      setTimeout(() => {
        if (redirect === 'checkout') {
          navigate(`/checkout?plan=${plan || 'slime'}`);
        } else {
          navigate('/dashboard');
        }
      }, 1500);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setEmail('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    // Update URL without reloading
    navigate(isLogin ? `/register${location.search}` : `/login${location.search}`, { replace: true });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 overflow-hidden relative">
      <div className="absolute inset-0 bg-[#050505]"></div>
      <div className="absolute inset-0 z-0">
        <img src="/time.webp" alt="Background" className="w-full h-full object-cover opacity-20 md:opacity-40" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.15)_0%,transparent_50%)] z-0 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.15)_0%,transparent_50%)] z-0 pointer-events-none"></div>
      
      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group z-50"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold">Kembali</span>
      </button>

      {/* Main Container */}
      <div className={`relative w-full max-w-4xl h-[550px] bg-[#0a0a0a]/60 backdrop-blur-xl rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-zinc-800/80 flex z-10 transition-all duration-1000 ease-out ${isMounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}>
        
        {/* ================= REGISTER FORM (LEFT) ================= */}
        <div className={`absolute top-0 left-0 w-full md:w-1/2 h-full p-6 md:p-8 flex flex-col justify-center transition-all duration-1000 ease-in-out z-10 ${isLogin ? 'opacity-0 pointer-events-none md:-translate-x-[20%] scale-95 md:scale-100' : 'opacity-100 translate-x-0 scale-100 delay-200'}`}>
          <div className="max-w-sm mx-auto w-full">
            <h2 className="text-3xl font-extrabold mb-2 text-white">Buat Akun</h2>
            <p className="text-sm text-zinc-400 mb-6">Bergabunglah dengan MCloud untuk hosting duniamu.</p>
            
            {error && !isLogin && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-sm">{error}</div>}
            {success && !isLogin && <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-3 rounded-xl mb-6 text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> {success}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative group">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-secondary transition-colors" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required={!isLogin}
                />
              </div>
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
                  type={showPassword ? "text" : "password"} 
                  placeholder="Kata Sandi" 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-12 text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-secondary transition-colors" />
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Ketik Ulang Kata Sandi" 
                  className={`w-full bg-zinc-900 border ${confirmPassword && password !== confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-zinc-800 focus:border-secondary focus:ring-secondary'} rounded-xl py-3 pl-12 pr-12 text-white focus:outline-none focus:ring-1 transition-all`}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required={!isLogin}
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {!isLogin && confirmPassword && (
                <div className={`flex items-center gap-1.5 text-xs -mt-3 pl-2 ${password === confirmPassword ? 'text-emerald-500' : 'text-red-500'}`}>
                  {password === confirmPassword ? (
                    <><CheckCircle2 className="w-3.5 h-3.5" /> Kata sandi cocok</>
                  ) : (
                    <><XCircle className="w-3.5 h-3.5" /> Kata sandi tidak cocok</>
                  )}
                </div>
              )}
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
        <div className={`absolute top-0 md:right-0 left-0 md:left-auto w-full md:w-1/2 h-full p-6 md:p-8 flex flex-col justify-center transition-all duration-1000 ease-in-out z-10 ${!isLogin ? 'opacity-0 pointer-events-none md:translate-x-[20%] scale-95 md:scale-100' : 'opacity-100 translate-x-0 scale-100 delay-200'}`}>
          <div className="max-w-sm mx-auto w-full">
            <h2 className="text-3xl font-extrabold mb-2 text-white">Selamat Datang</h2>
            <p className="text-sm text-zinc-400 mb-6">Masuk untuk mengelola servermu.</p>
            
            {error && isLogin && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-sm">{error}</div>}
            {success && isLogin && <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-3 rounded-xl mb-6 text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> {success}</div>}
            
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
                  type={showPassword ? "text" : "password"} 
                  placeholder="Kata Sandi" 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-12 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
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
        <div className={`absolute top-0 left-0 hidden md:block w-1/2 h-full z-20 transition-transform duration-1000 ease-in-out pointer-events-none ${isLogin ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="w-full h-full p-4">
            <div className="w-full h-full rounded-xl relative overflow-hidden flex flex-col p-6 md:p-8 transition-colors duration-1000 bg-zinc-900">
               
               {/* Background Images */}
               <div className="absolute inset-0">
                 {/* Login Background (Shows when isLogin is true) */}
                 <img 
                   src="/login.webp" 
                   alt="Login" 
                   className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isLogin ? 'opacity-100' : 'opacity-0'}`}
                 />
                 {/* Register Background (Shows when isLogin is false) */}
                 <img 
                   src="/register.webp" 
                   alt="Register" 
                   className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${!isLogin ? 'opacity-100' : 'opacity-0'}`}
                 />
                 
                 {/* Dark Overlay to make text readable */}
                 <div className="absolute inset-0 bg-black/60"></div>
                 <div className={`absolute inset-0 transition-colors duration-1000 mix-blend-multiply ${isLogin ? 'bg-primary/30' : 'bg-secondary/30'}`}></div>
               </div>
               
               <div className="relative z-10 flex flex-col h-full justify-start mt-4 w-full">
                 {/* Text for Login mode (Thumb on left) */}
                 <div className={`absolute inset-x-0 flex flex-col transition-all duration-1000 ease-in-out items-start text-left ${isLogin ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95 pointer-events-none'}`}>
                   <h3 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
                     Mulai<br/>Perjalananmu<br/>Sekarang
                   </h3>
                 </div>
                 
                 {/* Text for Register mode (Thumb on right) */}
                 <div className={`absolute inset-x-0 flex flex-col transition-all duration-1000 ease-in-out items-end text-right ${!isLogin ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-12 scale-95 pointer-events-none'}`}>
                   <h3 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
                     Selamat<br/>Datang<br/>Kembali
                   </h3>
                 </div>
               </div>
            </div>
          </div>
        </div>

      </div>

      {/* Mascot Image on Bottom Right */}
      <div className="absolute bottom-0 right-0 z-0 pointer-events-none hidden md:block w-72 lg:w-[500px]">
        <img 
          src="/time.webp" 
          alt="Minecraft Mascot" 
          className="w-full h-auto object-contain drop-shadow-2xl opacity-80 hover:opacity-100 transition-opacity duration-500 transform translate-y-8"
          style={{ 
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)', 
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)' 
          }}
        />
      </div>
    </div>
  );
}
