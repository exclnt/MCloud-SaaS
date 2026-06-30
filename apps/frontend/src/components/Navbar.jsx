import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Wallet, ChevronDown, Globe, Server as ServerIcon, Settings, LogOut, User } from 'lucide-react';
import { api } from '../services/api';

export default function Navbar() {
  const [servers, setServers] = useState([]);
  const [isServersOpen, setIsServersOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const serversRef = useRef(null);
  const profileRef = useRef(null);

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

    const handleClickOutside = (event) => {
      if (serversRef.current && !serversRef.current.contains(event.target)) {
        setIsServersOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
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

  return (
    <header className="h-16 border-b border-zinc-800/60 bg-[#0a0a0a] flex items-center justify-between px-6 shrink-0 z-50 sticky top-0">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
            <span className="text-primary font-bold">M</span>
          </div>
          <span className="font-bold text-white tracking-wide">MCloud</span>
        </div>
        <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
          <Link to="/dashboard" className={navLinkClass('/dashboard')}>Home</Link>
          <Link to="/checkout" className={navLinkClass('/checkout')}>Create Server</Link>
          <Link to="/server-list" className={navLinkClass('/server-list')}>Server List</Link>
        </nav>
      </div>
      
      <div className="flex items-center gap-6 text-sm font-medium text-zinc-400">
        <div className="flex items-center gap-2 cursor-pointer hover:text-white transition">
          <Wallet className="w-4 h-4" /> Wallet
        </div>
        
        {/* Servers Dropdown */}
        <div className="relative" ref={serversRef}>
          <div 
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition px-3 py-1.5 rounded-lg border ${isServersOpen ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-900/50 border-zinc-800'}`}
            onClick={() => setIsServersOpen(!isServersOpen)}
          >
            <ServerIcon className="w-4 h-4" /> Servers <ChevronDown className={`w-4 h-4 transition-transform ${isServersOpen ? 'rotate-180' : ''}`} />
          </div>
          
          {isServersOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-[#141414] border border-zinc-800 rounded-xl shadow-2xl py-2 z-50 overflow-hidden">
              <div className="px-4 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">My Servers</div>
              {servers.length === 0 ? (
                <div className="px-4 py-3 text-sm text-zinc-500">No servers found</div>
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
                  View All Servers
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <div 
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition px-3 py-1.5 rounded-lg border ${isProfileOpen ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-900/50 border-zinc-800'}`}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="w-6 h-6 rounded-full bg-emerald-900 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            Eko Ramadani <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
          </div>
          
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-[#141414] border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="px-4 py-4 border-b border-zinc-800 flex items-center gap-3 bg-zinc-900/30">
                <div className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center shrink-0 border border-emerald-800">
                  <User className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="truncate">
                  <div className="text-sm font-bold text-white">Eko Ramadani</div>
                  <div className="text-xs text-zinc-500 truncate">ekoramadani777@gmail.com</div>
                </div>
              </div>
              <div className="p-2">
                <div 
                  className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg cursor-pointer transition"
                  onClick={() => {
                    navigate('/dashboard');
                    setIsProfileOpen(false);
                  }}
                >
                  <Settings className="w-4 h-4" /> Client Area
                </div>
                <div 
                  className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg cursor-pointer transition"
                  onClick={() => {
                    localStorage.removeItem('token');
                    navigate('/login');
                  }}
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </div>
              </div>
            </div>
          )}
        </div>

        <Globe className="w-4 h-4 cursor-pointer hover:text-white transition" />
      </div>
    </header>
  );
}
