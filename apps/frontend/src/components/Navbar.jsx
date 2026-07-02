import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Wallet, ChevronDown, Globe, Server as ServerIcon, Settings, LogOut, User, Menu, X, MessageSquare } from 'lucide-react';
import { api } from '../services/api';

export default function Navbar() {
  const [servers, setServers] = useState([]);
  const [isServersOpen, setIsServersOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === '/';
  
  const [currentUser, setCurrentUser] = useState({ username: 'Pengguna', email: '' });

  const serversRef = useRef(null);
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const data = await api.getServers();
        setServers(data);
      } catch (err) {
        // Not logged in or error
      }
    };
    fetchServers();

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.username) {
          setCurrentUser({ username: payload.username, email: payload.email || 'Tidak ada email' });
        }
      } catch (e) {}
    }

    const handleClickOutside = (event) => {
      if (serversRef.current && !serversRef.current.contains(event.target)) {
        setIsServersOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinkClass = (path) => {
    const isActive = location.pathname === path;
    if (isActive) {
      return "text-white bg-zinc-800 px-3 py-1.5 rounded-lg";
    }
    return "text-zinc-400 hover:text-white px-3 py-1.5 transition";
  };

  const token = localStorage.getItem('token');

  return (
    <header className="h-16 border-b border-zinc-800/60 bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-50 sticky top-0 animate-header-drop">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/creep.png" alt="MCloud" className="w-8 h-8 object-contain" />
          <span className="font-bold text-white tracking-wide">MCloud</span>
        </div>
        {!isLanding && token && (
          <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
            <Link to="/dashboard" className={navLinkClass('/dashboard')}>Beranda</Link>
            <Link to="/pricing" className={navLinkClass('/pricing')}>Buat Server</Link>
            <Link to="/server-list" className={navLinkClass('/server-list')}>Daftar Server</Link>
          </nav>
        )}
      </div>

      {isLanding && (
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <a href="#home" className="hover:text-white transition">Beranda</a>
          <a href="#pricing" className="hover:text-white transition">Harga</a>
          <a href="#faq" className="hover:text-white transition">FAQ</a>
          <Link to="/docs" className="hover:text-white transition">Docs</Link>
        </nav>
      )}
      
      <div className="flex items-center gap-4 text-sm font-medium text-zinc-400">
        {isLanding ? (
          <>
            <div className="hidden sm:flex items-center gap-4">
              {token ? (
                <Link to="/dashboard" className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary-hover transition">Dasbor</Link>
              ) : (
                <>
                  <Link to="/login" className="hover:text-white transition font-bold">Masuk</Link>
                  <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary-hover transition">Daftar</Link>
                </>
              )}
            </div>
            <button 
              className="sm:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </>
        ) : token ? (
          <>
            <div 
              onClick={() => navigate('/clientarea?tab=transactions')} 
              className="hidden md:flex items-center gap-2 cursor-pointer hover:text-white transition"
            >
              <Wallet className="w-4 h-4 text-emerald-400" /> Riwayat Transaksi
            </div>
            
            {/* Servers Dropdown */}
            <div className="relative hidden md:block" ref={serversRef}>
              <div 
                className={`flex items-center gap-2 cursor-pointer hover:text-white transition px-3 py-1.5 rounded-lg border ${isServersOpen ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-900/50 border-zinc-800'}`}
                onClick={() => setIsServersOpen(!isServersOpen)}
              >
                <ServerIcon className="w-4 h-4" /> Server <ChevronDown className={`w-4 h-4 transition-transform ${isServersOpen ? 'rotate-180' : ''}`} />
              </div>
              
              {isServersOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-[#141414] border border-zinc-800 rounded-xl shadow-2xl py-2 z-50 overflow-hidden">
                  <div className="px-4 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Server Saya</div>
                  {servers.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-zinc-500">Tidak ada server</div>
                  ) : (
                    <div className="max-h-60 overflow-y-auto">
                      {servers.map(server => (
                        <div 
                          key={server.id}
                          className="px-4 py-2 hover:bg-zinc-800/50 cursor-pointer flex items-center gap-3 transition"
                          onClick={() => {
                            navigate(`/server/${server.port}`);
                            setIsServersOpen(false);
                          }}
                        >
                          <div className="w-8 h-8 bg-zinc-900 rounded border border-zinc-800 flex items-center justify-center shrink-0">
                            <ServerIcon className="w-4 h-4 text-zinc-500" />
                          </div>
                          <div className="truncate">
                            <div className="text-sm font-bold text-white truncate">{server.name}</div>
                            <div className="text-xs text-zinc-500 truncate">{server.ip}:{server.port}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="px-4 pt-2 pb-1 border-t border-zinc-800/50 mt-2">
                    <div 
                      className="text-xs text-primary font-bold text-center cursor-pointer hover:text-primary-hover transition"
                      onClick={() => {
                        navigate('/dashboard');
                        setIsServersOpen(false);
                      }}
                    >
                      Lihat Semua Server
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative hidden md:block" ref={profileRef}>
              <div 
                className={`flex items-center gap-2 cursor-pointer hover:text-white transition px-3 py-1.5 rounded-lg border ${isProfileOpen ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-900/50 border-zinc-800'}`}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="w-6 h-6 rounded-full bg-emerald-900 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <span className="hidden lg:inline">{currentUser.username}</span> <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </div>
              
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-[#141414] border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="px-4 py-4 border-b border-zinc-800 flex items-center gap-3 bg-zinc-900/30">
                    <div className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center shrink-0 border border-emerald-800">
                      <User className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="truncate">
                      <div className="text-sm font-bold text-white">{currentUser.username}</div>
                      <div className="text-xs text-zinc-500 truncate">{currentUser.email}</div>
                    </div>
                  </div>
                  <div className="p-2">
                    <div 
                      className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg cursor-pointer transition"
                      onClick={() => {
                        navigate('/clientarea');
                        setIsProfileOpen(false);
                      }}
                    >
                      <Settings className="w-4 h-4" /> Area Klien
                    </div>
                    <div 
                      className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg cursor-pointer transition"
                      onClick={() => {
                        navigate('/tickets');
                        setIsProfileOpen(false);
                      }}
                    >
                      <MessageSquare className="w-4 h-4 text-sky-400" /> Tiket Bantuan
                    </div>
                    <div 
                      className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg cursor-pointer transition"
                      onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('role');
                        localStorage.removeItem('username');
                        navigate('/login');
                      }}
                    >
                      <LogOut className="w-4 h-4" /> Keluar
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <Globe className="hidden md:block w-4 h-4 cursor-pointer hover:text-white transition" />

            {/* Mobile Hamburger Menu Toggle */}
            <button 
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </>
        ) : (
          <>
            <div className="hidden sm:flex items-center gap-4">
              <Link to="/login" className="hover:text-white transition font-bold">Masuk</Link>
              <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary-hover transition">Daftar</Link>
            </div>
            <button 
              className="sm:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="absolute top-16 left-0 right-0 bg-[#0a0a0a] border-b border-zinc-800/60 p-4 md:hidden shadow-2xl flex flex-col gap-4 z-40 max-h-[calc(100vh-4rem)] overflow-y-auto">
          {isLanding ? (
            <div className="flex flex-col gap-4 px-2">
              <a href="#home" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-zinc-300 hover:text-white text-sm font-medium transition">Beranda</a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-zinc-300 hover:text-white text-sm font-medium transition">Harga</a>
              <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-zinc-300 hover:text-white text-sm font-medium transition">FAQ</a>
              <Link to="/docs" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-zinc-300 hover:text-white text-sm font-medium transition">Docs</Link>
              
              <div className="pt-2 border-t border-zinc-800/60">
                {token ? (
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="w-full block p-2 sm:p-3 bg-primary text-white rounded-lg text-sm font-bold text-center hover:bg-primary-hover transition">Dasbor</Link>
                ) : (
                  <div className="flex flex-col gap-2 sm:gap-3">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full p-2 sm:p-3 bg-zinc-900 border border-zinc-800 text-white rounded-lg text-sm font-bold text-center hover:bg-zinc-800 transition">Masuk</Link>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full p-2 sm:p-3 bg-primary text-white rounded-lg text-sm font-bold text-center hover:bg-primary-hover transition">Daftar</Link>
                  </div>
                )}
              </div>
            </div>
          ) : token ? (
            <>
              <div className="flex items-center gap-3 p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center shrink-0 border border-emerald-800">
                  <User className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="truncate">
                  <div className="text-sm font-bold text-white">Eko Ramadani</div>
                  <div className="text-xs text-zinc-500 truncate">ekoramadani777@gmail.com</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }} className="p-2 sm:p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 text-xs sm:text-sm font-medium text-white hover:bg-zinc-800 transition">
                  Beranda
                </button>
                <button onClick={() => { navigate('/pricing'); setIsMobileMenuOpen(false); }} className="p-2 sm:p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 text-xs sm:text-sm font-medium text-white hover:bg-zinc-800 transition">
                  Buat Server
                </button>
                <button onClick={() => { navigate('/server-list'); setIsMobileMenuOpen(false); }} className="p-2 sm:p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 text-xs sm:text-sm font-medium text-white hover:bg-zinc-800 transition">
                  Daftar Server
                </button>
                <button onClick={() => { navigate('/clientarea'); setIsMobileMenuOpen(false); }} className="p-2 sm:p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 text-xs sm:text-sm font-medium text-white hover:bg-zinc-800 transition">
                  Area Klien
                </button>
                <button onClick={() => { navigate('/clientarea?tab=transactions'); setIsMobileMenuOpen(false); }} className="p-2 sm:p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 text-xs sm:text-sm font-medium text-white hover:bg-zinc-800 transition col-span-2 flex items-center justify-center gap-2">
                  <Wallet className="w-4 h-4 text-emerald-400" /> Riwayat Transaksi
                </button>
                <button onClick={() => { navigate('/tickets'); setIsMobileMenuOpen(false); }} className="p-2 sm:p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 text-xs sm:text-sm font-medium text-white hover:bg-zinc-800 transition col-span-2 flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4 text-sky-400" /> Pusat Tiket Bantuan
                </button>
              </div>

              <div className="pt-2 border-t border-zinc-800/60">
                <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 px-1">Server Anda</div>
                <div className="flex flex-col gap-2">
                  {servers.length === 0 ? (
                    <div className="text-sm text-zinc-500 px-1">Tidak ada server</div>
                  ) : (
                    servers.map(server => (
                      <button 
                        key={server.id}
                        onClick={() => { navigate(`/server/${server.port}`); setIsMobileMenuOpen(false); }}
                        className="flex items-center gap-3 p-3 bg-zinc-900/30 rounded-lg border border-zinc-800 hover:bg-zinc-800 transition text-left"
                      >
                        <ServerIcon className="w-4 h-4 text-zinc-400 shrink-0" />
                        <div className="truncate w-full">
                          <div className="text-sm font-bold text-white truncate">{server.name}</div>
                          <div className="text-xs text-zinc-500 truncate">{server.ip}:{server.port}</div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              <button 
                onClick={() => { 
                  localStorage.removeItem('token'); 
                  localStorage.removeItem('role'); 
                  localStorage.removeItem('username'); 
                  navigate('/login'); 
                }} 
                className="mt-2 p-2 sm:p-3 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 text-xs sm:text-sm font-medium text-center hover:bg-red-500/20 transition flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Keluar
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 sm:gap-3">
              <Link to="/login" className="w-full p-2 sm:p-3 bg-zinc-900 border border-zinc-800 text-white rounded-lg text-sm font-bold text-center hover:bg-zinc-800 transition">Masuk</Link>
              <Link to="/register" className="w-full p-2 sm:p-3 bg-primary text-white rounded-lg text-sm font-bold text-center hover:bg-primary-hover transition">Daftar</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
