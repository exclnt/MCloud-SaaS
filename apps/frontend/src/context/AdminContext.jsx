import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CustomSelect from '../components/CustomSelect';

const AdminContext = createContext(null);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Tentukan tab aktif berdasarkan URL pathname
  let activeTab = 'overview';
  const path = location.pathname;
  if (path.includes('/servers')) activeTab = 'servers';
  else if (path.includes('/users')) activeTab = 'users';
  else if (path.includes('/plans')) activeTab = 'pricing';
  else if (path.includes('/transactions')) activeTab = 'transactions';
  else if (path.includes('/logs')) activeTab = 'logs';
  else if (path.includes('/settings')) activeTab = 'settings';
  else if (path.includes('/tickets')) activeTab = 'tickets';

  const setActiveTab = (tabId) => {
    navigate(`/admin/${tabId === 'pricing' ? 'plans' : tabId}`);
  };

  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {}, isDanger: false, confirmText: 'Konfirmasi' });
  const [stats, setStats] = useState(null);
  const [servers, setServers] = useState([]);
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [logs, setLogs] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [trxSearchQuery, setTrxSearchQuery] = useState('');
  const [trxCurrentPage, setTrxCurrentPage] = useState(1);
  const [trxPerPage, setTrxPerPage] = useState(10);
  const [showTrxDetailModal, setShowTrxDetailModal] = useState(null);
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [logCurrentPage, setLogCurrentPage] = useState(1);
  const [logsPerPage, setLogsPerPage] = useState(10);

  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketMessages, setTicketMessages] = useState([]);
  const [ticketReply, setTicketReply] = useState('');
  const [ticketAttachment, setTicketAttachment] = useState(null);
  const [ticketPreview, setTicketPreview] = useState(null);
  const [ticketFilter, setTicketFilter] = useState('all');
  const [ticketSearchQuery, setTicketSearchQuery] = useState('');
  const [ticketCurrentPage, setTicketCurrentPage] = useState(1);
  const [ticketsPerPage, setTicketsPerPage] = useState(10);
  const [sendingTicketReply, setSendingTicketReply] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);

  const [serverSearchQuery, setServerSearchQuery] = useState('');
  const [serverCurrentPage, setServerCurrentPage] = useState(1);
  const [serversPerPage, setServersPerPage] = useState(10);

  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  // Edit Plan State
  const [editingPlan, setEditingPlan] = useState(null);
  const [editPrice, setEditPrice] = useState(0);
  const [editDiscount, setEditDiscount] = useState(0);

  // Admin User & Server Management States
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({ username: '', email: '', password: '', role: 'user' });
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editUserData, setEditUserData] = useState({ id: null, username: '', email: '', role: 'user', password: '' });
  const [showUserDetailModal, setShowUserDetailModal] = useState(null);
  const [showCreateServerModal, setShowCreateServerModal] = useState(null);
  const [newServerData, setNewServerData] = useState({ name: '', memoryLimit: '1g', version: 'latest', difficulty: 'easy', gamemode: 'survival', days: 30 });

  // Resource Pool State
  const [resourcePool, setResourcePool] = useState({ totalRamMB: 8192, usedRamMB: 0, availableRamMB: 8192, totalServers: 0 });
  const [poolInput, setPoolInput] = useState('8192');
  const [isSavingPool, setIsSavingPool] = useState(false);

  // Social Media Settings State
  const [socialSettings, setSocialSettings] = useState({
    social_discord: 'https://discord.gg/mcloud',
    social_whatsapp: 'https://wa.me/6281234567890',
    social_instagram: 'https://instagram.com/mcloud.id',
    social_twitter: 'https://x.com/mcloud_id',
    social_email: 'support@mcloud.id',
    maintenance_mode: 'false',
    maintenance_title: 'Pemeliharaan Sistem MCloud',
    maintenance_message: 'Kami sedang melakukan pemeliharaan rutin untuk meningkatkan performa dan stabilitas server. Silakan kembali dalam beberapa saat.',
    maintenance_eta: 'Segera'
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const handleSaveSettings = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await api.updateSettings(socialSettings);
      if (res && res.settings) {
        setSocialSettings(prev => ({ ...prev, ...res.settings }));
      }
      toast.success('Pengaturan sistem berhasil disimpan!');
      fetchData();
      window.dispatchEvent(new Event('settingsUpdated'));
    } catch (err) {
      toast.error('Gagal menyimpan pengaturan: ' + err.message);
    }
    setIsSavingSettings(false);
  };

  const handleSaveResourcePool = async () => {
    setIsSavingPool(true);
    try {
      const val = parseInt(poolInput);
      if (isNaN(val) || val < 0) {
        toast.error("Input RAM harus berupa angka positif (MB)");
        return;
      }
      const res = await api.updateResourcePool(val);
      toast.success("Kapasitas Resource Pool RAM berhasil diperbarui!");
      if (res.pool) {
        setResourcePool(res.pool);
        setPoolInput(String(res.pool.totalRamMB));
      }
      const updatedPlans = await api.getPlans();
      setPlans(updatedPlans);
    } catch (e) {
      toast.error(e.message || "Gagal memperbarui resource pool");
    } finally {
      setIsSavingPool(false);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Always fetch core system state (servers, tickets, transactions, plans, settings) to sync Admin Navbar Notifications across all pages
      const [plansRes, poolRes, settingsRes, srvsRes, ticketsRes, trxRes] = await Promise.all([
        api.getPlans().catch(() => []),
        api.getResourcePool().catch(() => null),
        api.getSettings().catch(() => null),
        api.getAllServers().catch(() => []),
        api.getAdminTickets().catch(() => []),
        api.getAdminTransactions().catch(() => [])
      ]);

      if (plansRes && plansRes.length > 0) setPlans(plansRes);
      if (poolRes) {
        setResourcePool(poolRes);
        setPoolInput(String(poolRes.totalRamMB || 0));
      } else if (plansRes[0]?.poolStats) {
        setResourcePool(plansRes[0].poolStats);
        setPoolInput(String(plansRes[0].poolStats.totalRamMB || 0));
      }
      if (settingsRes) {
        setSocialSettings(prev => ({ ...prev, ...settingsRes }));
      }
      if (srvsRes) setServers(srvsRes);
      if (ticketsRes) setTickets(ticketsRes || []);
      if (trxRes) setTransactions(trxRes || []);

      if (activeTab === 'overview') {
        const [resUsers, resLogs] = await Promise.all([
          api.getAllUsers(),
          api.getActivityLogs().catch(() => ({ logs: [] }))
        ]);
        setUsers(resUsers?.users || []);
        setLogs(resLogs?.logs || []);
        const totalRev = (trxRes || []).filter(t => t.status === 'success').reduce((acc, t) => acc + (t.amount || 0), 0);
        setStats({
          totalServers: (srvsRes || []).length,
          activeServers: (srvsRes || []).filter(s => s.status === 'running').length,
          totalUsers: (resUsers?.users || []).length,
          totalRevenue: totalRev
        });
      } else if (activeTab === 'users') {
        const res = await api.getAllUsers();
        setUsers(res?.users || []);
      } else if (activeTab === 'logs') {
        const res = await api.getActivityLogs();
        setLogs(res?.logs || []);
      }
    } catch (e) {
      toast.error('Failed to fetch data: ' + e.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'logs') setLogCurrentPage(1);
    if (activeTab === 'servers') setServerCurrentPage(1);
    if (activeTab === 'users') setUserCurrentPage(1);
    if (activeTab === 'transactions') setTrxCurrentPage(1);
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    const ticker = setInterval(() => {
      setServers(prev => prev.map(s => s.status === 'running' && typeof s.uptime === 'number' && s.uptime > 0 ? { ...s, uptime: s.uptime + 1 } : s));
    }, 1000);
    return () => clearInterval(ticker);
  }, []);

  // Realtime background sync for global admin data (tickets, servers, transactions)
  useEffect(() => {
    const bgSync = setInterval(async () => {
      try {
        const [srvsRes, ticketsRes, trxRes] = await Promise.all([
          api.getAllServers().catch(() => null),
          api.getAdminTickets().catch(() => null),
          api.getAdminTransactions().catch(() => null)
        ]);
        if (srvsRes) setServers(srvsRes);
        if (ticketsRes) setTickets(ticketsRes);
        if (trxRes) setTransactions(trxRes);
      } catch (e) {}
    }, 5000);
    return () => clearInterval(bgSync);
  }, []);

  // Realtime polling for active selected ticket chat
  useEffect(() => {
    if (!selectedTicket || !selectedTicket.id) return;
    const chatPoll = setInterval(async () => {
      try {
        const res = await api.getTicketById(selectedTicket.id);
        if (res && res.messages) {
          setTicketMessages(prev => {
            if (res.messages.length !== prev.length || JSON.stringify(res.messages) !== JSON.stringify(prev)) {
              return res.messages;
            }
            return prev;
          });
        }
        if (res && res.ticket) {
          setSelectedTicket(prev => prev && prev.id === res.ticket.id ? { ...prev, ...res.ticket } : prev);
          setTickets(prev => prev.map(t => t.id === res.ticket.id ? { ...t, ...res.ticket } : t));
        }
      } catch (e) {}
    }, 2500);
    return () => clearInterval(chatPoll);
  }, [selectedTicket?.id]);

  const handleServerAction = (port, action) => {
    if (action === 'stop') {
      setConfirmConfig({
        isOpen: true,
        title: 'Matikan Server',
        message: `Apakah Anda yakin ingin mematikan server port ${port}? Pemain yang aktif akan terputus.`,
        isDanger: true,
        confirmText: 'Matikan Server',
        onConfirm: async () => {
          try {
            await api.stopServer(port);
            toast.success('Server berhasil dimatikan');
            fetchData();
          } catch (e) {
            toast.error('Gagal mematikan server: ' + e.message);
          }
        }
      });
      return;
    }
    if (action === 'delete') {
      setConfirmConfig({
        isOpen: true,
        title: 'Hapus Server',
        message: `Apakah Anda yakin ingin menghapus server port ${port}? Semua data akan hilang secara permanen.`,
        isDanger: true,
        confirmText: 'Hapus Server',
        onConfirm: async () => {
          try {
            await api.deleteServer(port);
            toast.success('Server berhasil dihapus');
            fetchData();
          } catch (e) {
            toast.error('Gagal menghapus server: ' + e.message);
          }
        }
      });
      return;
    }
  };

  const handleSavePlan = (planId) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Perbarui Harga Paket',
      message: `Apakah Anda yakin ingin memperbarui harga paket ini menjadi Rp ${parseInt(editPrice || 0).toLocaleString('id-ID')} dengan diskon ${editDiscount || 0}%?`,
      isDanger: false,
      confirmText: 'Simpan Perubahan',
      onConfirm: async () => {
        try {
          await api.updatePlan(planId, { price: parseInt(editPrice), discount: parseInt(editDiscount) });
          toast.success('Paket berhasil diperbarui');
          setEditingPlan(null);
          fetchData();
        } catch (e) {
          toast.error('Gagal memperbarui paket: ' + e.message);
        }
      }
    });
  };

  const handleCreateUser = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      await api.createAdminUser(newUserData);
      toast.success('Pengguna berhasil dibuat');
      setShowCreateUserModal(false);
      setNewUserData({ username: '', email: '', password: '', role: 'user' });
      fetchData();
    } catch (err) {
      toast.error('Gagal membuat pengguna: ' + err.message);
    }
  };

  const handleUpdateUser = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      await api.updateAdminUser(editUserData.id, editUserData);
      toast.success('Pengguna berhasil diperbarui');
      setShowEditUserModal(false);
      fetchData();
    } catch (err) {
      toast.error('Gagal memperbarui pengguna: ' + err.message);
    }
  };

  const handleDeleteUser = (userId, username) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Hapus Pengguna',
      message: `Apakah Anda yakin ingin menghapus pengguna "${username}"? Semua server dan log miliknya juga akan otomatis dimatikan dan dihapus (Cascade Delete).`,
      isDanger: true,
      confirmText: 'Hapus Pengguna',
      onConfirm: async () => {
        try {
          await api.deleteAdminUser(userId);
          toast.success('Pengguna dan seluruh server miliknya berhasil dihapus');
          if (showUserDetailModal && showUserDetailModal.id === userId) {
            setShowUserDetailModal(null);
          }
          fetchData();
        } catch (err) {
          toast.error('Gagal menghapus pengguna: ' + err.message);
        }
      }
    });
  };

  const handleCreateServerForUser = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!showCreateServerModal) return;
    try {
      const memVal = newServerData.memoryLimit.toLowerCase().replace('mb', 'm').replace('gb', 'g');
      await api.createAdminServer({
        ...newServerData,
        memoryLimit: memVal,
        userId: showCreateServerModal.id
      });
      toast.success('Server berhasil dibuat untuk user');
      setShowCreateServerModal(null);
      setNewServerData({ name: '', memoryLimit: '1g', version: 'latest', difficulty: 'easy', gamemode: 'survival', days: 30 });
      fetchData();
    } catch (err) {
      toast.error('Gagal membuat server: ' + err.message);
    }
  };

  const handleExtendServer = (serverId, days) => {
    const text = days === 'permanent' ? 'mengubah server ini menjadi Permanen (tanpa batas waktu)' : `memperpanjang masa aktif server ini sebanyak ${days} hari`;
    setConfirmConfig({
      isOpen: true,
      title: 'Perpanjang Masa Aktif Server',
      message: `Apakah Anda yakin ingin ${text}?`,
      isDanger: false,
      confirmText: 'Ya, Lanjutkan',
      onConfirm: async () => {
        try {
          await api.extendAdminServer(serverId, days);
          toast.success(days === 'permanent' ? 'Server dijadikan permanen!' : `Masa aktif diperpanjang ${days} hari!`);
          fetchData();
        } catch (err) {
          toast.error('Gagal memperpanjang server: ' + err.message);
        }
      }
    });
  };

  const formatUptime = (seconds) => {
    if (!seconds || seconds <= 0) return '0 Detik';
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (days > 0) return `${days}h ${hours}j ${minutes}m`;
    if (hours > 0) return `${hours}j ${minutes}m ${secs}d`;
    if (minutes > 0) return `${minutes}m ${secs}d`;
    return `${secs} Detik`;
  };

  const formatRemainingDays = (expiresAt) => {
    if (!expiresAt) return <span className="px-2 py-0.5 rounded text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">Permanen</span>;
    const diff = new Date(expiresAt) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400 border border-red-500/30 font-bold">Kedaluwarsa</span>;
    if (days <= 3) return <span className="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">{days} Hari Lagi</span>;
    return <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">{days} Hari</span>;
  };

  // Filter & Paginate Servers
  const filteredServers = servers.filter(s => {
    if (!serverSearchQuery) return true;
    const q = serverSearchQuery.toLowerCase();
    return (s.name || '').toLowerCase().includes(q) || 
           (s.owner || '').toLowerCase().includes(q) || 
           String(s.id).includes(q) || 
           String(s.port).includes(q) || 
           (s.ip || '').toLowerCase().includes(q);
  });
  const totalServerPages = Math.ceil(filteredServers.length / serversPerPage) || 1;
  const paginatedServers = filteredServers.slice((serverCurrentPage - 1) * serversPerPage, serverCurrentPage * serversPerPage);

  // Filter & Paginate Users
  const filteredUsers = users.filter(u => {
    if (!userSearchQuery) return true;
    const q = userSearchQuery.toLowerCase();
    return (u.username || '').toLowerCase().includes(q) || 
           (u.email || '').toLowerCase().includes(q) || 
           (u.role || '').toLowerCase().includes(q) || 
           String(u.id).includes(q);
  });
  const totalUserPages = Math.ceil(filteredUsers.length / usersPerPage) || 1;
  const paginatedUsers = filteredUsers.slice((userCurrentPage - 1) * usersPerPage, userCurrentPage * usersPerPage);

  const filteredLogs = logs.filter(log => {
    if (!logSearchQuery) return true;
    const query = logSearchQuery.toLowerCase();
    const user = (log.username || 'system').toLowerCase();
    const action = (log.action || '').toLowerCase();
    const details = (log.details || '').toLowerCase();
    const time = new Date(log.createdAt).toLocaleString().toLowerCase();
    return user.includes(query) || action.includes(query) || details.includes(query) || time.includes(query);
  });
  const totalLogPages = Math.ceil(filteredLogs.length / logsPerPage) || 1;
  const paginatedLogs = filteredLogs.slice((logCurrentPage - 1) * logsPerPage, logCurrentPage * logsPerPage);

  const filteredTickets = tickets.filter(t => {
    const matchStatus = ticketFilter === 'all' || t.status === ticketFilter;
    if (!matchStatus) return false;
    if (!ticketSearchQuery) return true;
    const q = ticketSearchQuery.toLowerCase();
    return (t.subject || '').toLowerCase().includes(q) ||
           (t.category || '').toLowerCase().includes(q) ||
           (t.username || '').toLowerCase().includes(q) ||
           (t.email || '').toLowerCase().includes(q) ||
           (t.serverName || '').toLowerCase().includes(q) ||
           String(t.id).includes(q);
  });
  const totalTicketPages = Math.ceil(filteredTickets.length / ticketsPerPage) || 1;
  const paginatedTickets = filteredTickets.slice((ticketCurrentPage - 1) * ticketsPerPage, ticketCurrentPage * ticketsPerPage);

  const enrichedTransactions = transactions.map(t => {
    if (t.orderId && t.planName) return t;
    let cfg = {};
    try {
      if (t.config) cfg = typeof t.config === 'string' ? JSON.parse(t.config) : t.config;
    } catch (e) {}
    const orderId = t.orderId || cfg.orderId || (t.snapToken ? `MCLOUD-${t.id}` : `TRX-${t.id}`);
    let planName = t.planName || cfg.planName || cfg.plan || '-';
    if (planName === '-') {
      if (cfg.renew) planName = 'Perpanjangan Server';
      else if (cfg.memoryLimit || cfg.ram) {
        const ram = String(cfg.memoryLimit || cfg.ram).toLowerCase();
        if (ram === '500m' || ram === '500mb') planName = 'Villager';
        else if (ram === '1g' || ram === '1gb') planName = 'Spider';
        else if (ram === '2g' || ram === '2gb') planName = 'Slime';
        else if (ram === '4g' || ram === '4gb') planName = 'Wither';
        else planName = `Custom (${ram.toUpperCase()})`;
      } else if (t.amount) {
        if (t.amount === 15000 || t.amount === 30000) planName = 'Villager';
        else if (t.amount === 25000 || t.amount === 40000) planName = 'Spider';
        else if (t.amount === 50000 || t.amount === 80000) planName = 'Slime';
        else if (t.amount === 100000 || t.amount === 160000) planName = 'Wither';
        else planName = 'Layanan MCloud';
      }
    }
    return { ...t, orderId, planName };
  });

  const filteredTransactions = enrichedTransactions.filter(t => {
    if (!trxSearchQuery) return true;
    const q = trxSearchQuery.toLowerCase();
    return String(t.id).includes(q) ||
           (t.orderId || '').toLowerCase().includes(q) ||
           (t.planName || '').toLowerCase().includes(q) ||
           (t.username || '').toLowerCase().includes(q) ||
           (t.email || '').toLowerCase().includes(q) ||
           (t.status || '').toLowerCase().includes(q) ||
           (t.config || '').toLowerCase().includes(q);
  });
  const totalTrxPages = Math.ceil(filteredTransactions.length / trxPerPage) || 1;
  const paginatedTransactions = filteredTransactions.slice((trxCurrentPage - 1) * trxPerPage, trxCurrentPage * trxPerPage);

  const totalRevenueIdr = transactions.filter(t => t.status === 'success').reduce((sum, t) => sum + (t.amount || 0), 0);
  const successTrxCount = transactions.filter(t => t.status === 'success').length;
  const adminManualTrxCount = transactions.filter(t => t.status === 'admin_manual').length;

  const renderPaginationFooter = (currentPage, totalPages, totalItems, perPage, setPage, setPerPage, label = "item") => (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t border-zinc-800/80 text-xs text-zinc-400">
      <div className="flex items-center gap-3">
        <span>
          Menampilkan <strong className="text-white">{totalItems === 0 ? 0 : (currentPage - 1) * perPage + 1}</strong> - <strong className="text-white">{Math.min(currentPage * perPage, totalItems)}</strong> dari <strong className="text-white">{totalItems}</strong> {label}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">Per halaman:</span>
          <CustomSelect 
            size="sm"
            className="!w-20"
            value={perPage} 
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </CustomSelect>
        </div>
      </div>

      {totalPages >= 1 && (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            title="Halaman Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1))
            .map((page, index, array) => (
              <React.Fragment key={page}>
                {index > 0 && array[index - 1] !== page - 1 && (
                  <span className="px-2 text-zinc-600">...</span>
                )}
                <button
                  onClick={() => setPage(page)}
                  className={`px-3 py-1.5 rounded-md font-bold transition-colors ${
                    currentPage === page
                      ? 'bg-white text-black shadow-lg'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {page}
                </button>
              </React.Fragment>
            ))
          }

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            title="Halaman Berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );

  const handleSelectAdminTicket = async (ticket) => {
    setSelectedTicket(ticket);
    try {
      const res = await api.getTicketById(ticket.id);
      setSelectedTicket(res.ticket);
      setTicketMessages(res.messages || []);
    } catch (err) {
      toast.error(err.message || 'Gagal memuat detail tiket');
    }
  };

  const handleSendAdminReply = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!ticketReply.trim() && !ticketAttachment) return;
    setSendingTicketReply(true);
    try {
      const newMsg = await api.replyTicket(selectedTicket.id, {
        message: ticketReply || ' [Lampiran Gambar] ',
        attachment: ticketAttachment
      });
      setTicketMessages(prev => [...prev, newMsg]);
      setTicketReply('');
      setTicketAttachment(null);
      setTicketPreview(null);
      
      if (selectedTicket.status === 'open') {
        setSelectedTicket(prev => ({ ...prev, status: 'in_progress' }));
        setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, status: 'in_progress' } : t));
      }
    } catch (err) {
      toast.error(err.message || 'Gagal mengirim balasan');
    } finally {
      setSendingTicketReply(false);
    }
  };

  const handleUpdateAdminTicketStatus = async (id, status) => {
    try {
      await api.updateTicketStatus(id, status);
      toast.success('Status tiket diperbarui');
      if (selectedTicket && selectedTicket.id === id) {
        setSelectedTicket(prev => ({ ...prev, status }));
      }
      setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    } catch (err) {
      toast.error(err.message || 'Gagal mengubah status');
    }
  };

  const value = {
    activeTab,
    setActiveTab,
    confirmConfig,
    setConfirmConfig,
    stats,
    servers,
    users,
    plans,
    logs,
    transactions,
    trxSearchQuery,
    setTrxSearchQuery,
    trxCurrentPage,
    setTrxCurrentPage,
    trxPerPage,
    setTrxPerPage,
    showTrxDetailModal,
    setShowTrxDetailModal,
    logSearchQuery,
    setLogSearchQuery,
    logCurrentPage,
    setLogCurrentPage,
    logsPerPage,
    setLogsPerPage,
    tickets,
    setTickets,
    selectedTicket,
    setSelectedTicket,
    ticketMessages,
    setTicketMessages,
    ticketReply,
    setTicketReply,
    ticketAttachment,
    setTicketAttachment,
    ticketPreview,
    setTicketPreview,
    ticketFilter,
    setTicketFilter,
    ticketSearchQuery,
    setTicketSearchQuery,
    ticketCurrentPage,
    setTicketCurrentPage,
    ticketsPerPage,
    setTicketsPerPage,
    sendingTicketReply,
    setSendingTicketReply,
    lightboxImg,
    setLightboxImg,
    serverSearchQuery,
    setServerSearchQuery,
    serverCurrentPage,
    setServerCurrentPage,
    serversPerPage,
    setServersPerPage,
    userSearchQuery,
    setUserSearchQuery,
    userCurrentPage,
    setUserCurrentPage,
    usersPerPage,
    setUsersPerPage,
    isLoading,
    editingPlan,
    setEditingPlan,
    editPrice,
    setEditPrice,
    editDiscount,
    setEditDiscount,
    showCreateUserModal,
    setShowCreateUserModal,
    newUserData,
    setNewUserData,
    showEditUserModal,
    setShowEditUserModal,
    editUserData,
    setEditUserData,
    showUserDetailModal,
    setShowUserDetailModal,
    showCreateServerModal,
    setShowCreateServerModal,
    newServerData,
    setNewServerData,
    resourcePool,
    setResourcePool,
    poolInput,
    setPoolInput,
    isSavingPool,
    socialSettings,
    setSocialSettings,
    isSavingSettings,
    handleSaveSettings,
    handleSaveResourcePool,
    fetchData,
    handleServerAction,
    handleSavePlan,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleCreateServerForUser,
    handleExtendServer,
    formatUptime,
    formatRemainingDays,
    filteredServers,
    totalServerPages,
    paginatedServers,
    filteredUsers,
    totalUserPages,
    paginatedUsers,
    filteredLogs,
    totalLogPages,
    paginatedLogs,
    filteredTickets,
    totalTicketPages,
    paginatedTickets,
    enrichedTransactions,
    filteredTransactions,
    totalTrxPages,
    paginatedTransactions,
    totalRevenueIdr,
    successTrxCount,
    adminManualTrxCount,
    renderPaginationFooter,
    handleSelectAdminTicket,
    handleSendAdminReply,
    handleUpdateAdminTicketStatus
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
