import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Bell, User, Settings, LogOut, ExternalLink, ChevronDown, MessageSquare, AlertTriangle, CheckCircle2, Server, DollarSign, Menu, X } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminNavbar({ onToggleSidebar }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({ username: 'Administrator', email: 'admin@mcloud.id' });
  const [dismissedNotifs, setDismissedNotifs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('admin_dismissed_notifs') || '[]');
    } catch (e) {
      return [];
    }
  });
  
  const navigate = useNavigate();
  const {
    tickets = [],
    servers = [],
    transactions = [],
    setActiveTab,
    socialSettings,
    handleSelectAdminTicket
  } = useAdmin();

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.username) {
          setCurrentUser({
            username: payload.username,
            email: payload.email || 'admin@mcloud.id'
          });
        }
      } catch (e) {}
    }

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate dynamic system notifications
  const waitingTickets = tickets.filter(t => {
    const st = String(t.status || '').toLowerCase();
    return st === 'open' || st === 'menunggu admin' || !t.status;
  });
  const problemServers = servers.filter(s => {
    const st = String(s.status || '').toLowerCase();
    return st === 'stopped' || st === 'degraded' || st === 'offline' || st === 'error' || st === 'failed' || st === 'suspended';
  });
  const pendingTrx = transactions.filter(t => {
    const st = String(t.status || '').toLowerCase();
    return st === 'pending' || st === 'challenge' || st === 'unpaid';
  });

  const rawNotifications = [
    ...waitingTickets.map(t => ({
      id: `ticket-${t.id}_${t.updatedAt || t.createdAt || ''}`,
      type: 'ticket',
      title: 'Tiket Menunggu Balasan',
      desc: `[#${t.id}] ${t.subject || 'Kendala Layanan'} oleh ${t.username || 'User'}`,
      time: 'Baru saja',
      icon: <MessageSquare className="w-4 h-4 text-sky-400" />,
      bg: 'bg-sky-500/10 border-sky-500/20',
      action: () => {
        if (setActiveTab) setActiveTab('tickets');
        if (handleSelectAdminTicket) handleSelectAdminTicket(t);
        navigate('/admin/tickets');
        setIsNotifOpen(false);
      }
    })),
    ...problemServers.map(s => ({
      id: `server-${s.id || s.port}_${s.status}_${s.updatedAt || ''}`,
      type: 'server',
      title: `Server ${String(s.status || '').toLowerCase() === 'degraded' ? 'Degraded' : 'Terhenti'}`,
      desc: `Server ${s.name || s.port} memerlukan pemeriksaan kapasitas atau port.`,
      time: 'Perhatian',
      icon: <Server className="w-4 h-4 text-amber-400" />,
      bg: 'bg-amber-500/10 border-amber-500/20',
      action: () => {
        if (setActiveTab) setActiveTab('servers');
        navigate('/admin/servers');
        setIsNotifOpen(false);
      }
    })),
    ...pendingTrx.map(tr => ({
      id: `trx-${tr.id}_${tr.status}_${tr.updatedAt || ''}`,
      type: 'trx',
      title: 'Transaksi Menunggu Verifikasi',
      desc: `Pembayaran ${tr.id || ''} sebesar Rp ${Number(tr.amount || 0).toLocaleString('id-ID')}`,
      time: 'Tertunda',
      icon: <DollarSign className="w-4 h-4 text-emerald-400" />,
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      action: () => {
        if (setActiveTab) setActiveTab('transactions');
        navigate('/admin/transactions');
        setIsNotifOpen(false);
      }
    }))
  ];

  const notifications = rawNotifications.filter(notif => !dismissedNotifs.includes(notif.id));
  const totalNotifs = notifications.length;

  const handleDismissNotif = (e, notifId) => {
    if (e) e.stopPropagation();
    setDismissedNotifs(prev => {
      const updated = [...prev, notifId];
      try { localStorage.setItem('admin_dismissed_notifs', JSON.stringify(updated)); } catch (err) {}
      return updated;
    });
  };

  const handleDismissAll = (e) => {
    if (e) e.stopPropagation();
    const allIds = rawNotifications.map(n => n.id);
    setDismissedNotifs(prev => {
      const updated = Array.from(new Set([...prev, ...allIds]));
      try { localStorage.setItem('admin_dismissed_notifs', JSON.stringify(updated)); } catch (err) {}
      return updated;
    });
  };

  const handleRestoreNotifs = (e) => {
    if (e) e.stopPropagation();
    localStorage.removeItem('admin_dismissed_notifs');
    setDismissedNotifs([]);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const isMaintenance = socialSettings?.maintenance_mode === 'true' || socialSettings?.maintenance_mode === true;

  return (
    <>
      {isMaintenance && (
        <div className="bg-gradient-to-r from-amber-500/90 to-amber-600/90 text-black px-4 py-1.5 text-xs sm:text-sm font-bold flex items-center justify-between shadow-md z-50 animate-pulse shrink-0">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <span className="w-2 h-2 rounded-full bg-black animate-ping shrink-0"></span>
            <span className="truncate">⚠️ Mode Pemeliharaan Sedang Aktif! Akses pengguna publik saat ini ditutup.</span>
          </div>
          <button
            onClick={() => {
              if (setActiveTab) setActiveTab('settings');
              navigate('/admin/settings');
            }}
            className="bg-black/20 hover:bg-black/30 px-2.5 py-0.5 rounded text-xs transition shrink-0 ml-2 font-black"
          >
            Kelola
          </button>
        </div>
      )}

      <header className="h-16 border-b border-zinc-800/80 bg-[#0c0c0e]/90 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 shrink-0 z-50 sticky top-0 shadow-lg">
        {/* Kiri: Logo Branding & Badge Admin Portal */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white transition"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div
            onClick={() => {
              if (setActiveTab) setActiveTab('overview');
              navigate('/admin/overview');
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative">
              <img src="/creep.png" alt="MCloud Admin" className="w-8 h-8 object-contain transition-transform group-hover:scale-105" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0c0c0e] flex items-center justify-center">
                <Shield className="w-2 h-2 text-black fill-current" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-wide text-base">MCloud</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10">
                Admin Portal
              </span>
            </div>
          </div>
        </div>

        {/* Kanan: Notifikasi & Profil Admin */}
        <div className="flex items-center gap-4">
          {/* Pusat Notifikasi Sistem (Bell Icon) */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={`relative p-2.5 rounded-xl border transition-all ${
                isNotifOpen
                  ? 'bg-zinc-800 border-zinc-700 text-white shadow-md'
                  : 'bg-zinc-900/80 border-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
              title="Notifikasi Sistem Admin"
            >
              <Bell className="w-4 h-4" />
              {totalNotifs > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-red-500 text-[10px] font-extrabold text-white animate-pulse shadow-sm shadow-red-500/50">
                  {totalNotifs > 9 ? '9+' : totalNotifs}
                </span>
              )}
            </button>

            {/* Dropdown Notifikasi */}
            {isNotifOpen && (
              <div className="absolute right-0 top-full mt-2.5 w-80 sm:w-96 bg-[#121216] border border-zinc-800/80 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden animate-fade-in backdrop-blur-xl">
                <div className="px-4 py-3 border-b border-zinc-800/60 flex items-center justify-between bg-zinc-900/40">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Notifikasi Sistem</span>
                    {totalNotifs > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                        {totalNotifs} Perlu Tindakan
                      </span>
                    )}
                  </div>
                  {totalNotifs > 0 && (
                    <button
                      onClick={handleDismissAll}
                      className="text-[11px] text-zinc-400 hover:text-white font-semibold transition hover:underline"
                      title="Sembunyikan Semua Notifikasi"
                    >
                      Tandai Dibaca
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-zinc-800/40">
                  {notifications.length === 0 ? (
                    <div className="px-6 py-10 text-center flex flex-col items-center justify-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-1">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-semibold text-zinc-300">Semua Sistem Aman</p>
                      <p className="text-[11px] text-zinc-500">Tidak ada tiket menunggu atau peringatan server saat ini.</p>
                      {dismissedNotifs.length > 0 && (
                        <button
                          onClick={handleRestoreNotifs}
                          className="mt-2 text-[11px] text-sky-400 hover:text-sky-300 font-semibold underline transition"
                        >
                          Kembalikan ({dismissedNotifs.length}) Notifikasi yang Disilang
                        </button>
                      )}
                    </div>
                  ) : (
                    notifications.slice(0, 8).map((notif) => (
                      <div
                        key={notif.id}
                        onClick={notif.action}
                        className="px-4 py-3 hover:bg-zinc-900/80 cursor-pointer flex items-start gap-3 transition group relative"
                      >
                        <div className={`p-2 rounded-xl border shrink-0 mt-0.5 ${notif.bg}`}>
                          {notif.icon}
                        </div>
                        <div className="min-w-0 flex-1 pr-6">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-xs font-bold text-zinc-200 group-hover:text-white transition truncate">
                              {notif.title}
                            </h4>
                            <span className="text-[10px] text-zinc-500 font-mono shrink-0">{notif.time}</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-2 leading-relaxed font-mono">
                            {notif.desc}
                          </p>
                        </div>
                        <button
                          onClick={(e) => handleDismissNotif(e, notif.id)}
                          className="absolute right-3 top-3 p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition opacity-0 group-hover:opacity-100"
                          title="Silang / Sembunyikan Notifikasi"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="px-4 py-2.5 border-t border-zinc-800/60 bg-zinc-900/30 flex items-center justify-between text-center">
                  <span
                    onClick={() => {
                      if (setActiveTab) setActiveTab('overview');
                      navigate('/admin/overview');
                      setIsNotifOpen(false);
                    }}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer transition inline-block"
                  >
                    Lihat Ikhtisar Sistem
                  </span>
                  {dismissedNotifs.length > 0 && (
                    <span
                      onClick={handleRestoreNotifs}
                      className="text-[10px] text-zinc-500 hover:text-zinc-300 cursor-pointer underline transition"
                      title="Kembalikan semua notifikasi yang telah disilang"
                    >
                      Reset ({dismissedNotifs.length})
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown (Desain Asli Sesuai Permintaan) */}
          <div className="relative" ref={profileRef}>
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
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" /> Keluar
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
