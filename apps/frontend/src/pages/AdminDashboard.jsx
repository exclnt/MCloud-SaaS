import React, { useState, useEffect } from 'react';
import { Shield, Server, Users, CreditCard, Activity, RefreshCw, StopCircle, Trash2, Edit2, CheckCircle, Save, X, PanelLeft, LogOut, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ConfirmModal from '../components/ConfirmModal';

export default function AdminDashboard() {
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {}, isDanger: false, confirmText: 'Konfirmasi' });
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [servers, setServers] = useState([]);
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [logs, setLogs] = useState([]);
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [logCurrentPage, setLogCurrentPage] = useState(1);
  const [logsPerPage, setLogsPerPage] = useState(10);

  const [serverSearchQuery, setServerSearchQuery] = useState('');
  const [serverCurrentPage, setServerCurrentPage] = useState(1);
  const [serversPerPage, setServersPerPage] = useState(10);

  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

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

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const plansRes = await api.getPlans().catch(() => []);
      if (plansRes && plansRes.length > 0) setPlans(plansRes);

      if (activeTab === 'overview') {
        const [srvs, resUsers] = await Promise.all([api.getAllServers(), api.getAllUsers()]);
        setServers(srvs);
        setUsers(resUsers.users);
        setStats({
          totalServers: srvs.length,
          activeServers: srvs.filter(s => s.status === 'running').length,
          totalUsers: resUsers.users.length
        });
      } else if (activeTab === 'servers') {
        const srvs = await api.getAllServers();
        setServers(srvs);
      } else if (activeTab === 'users') {
        const res = await api.getAllUsers();
        setUsers(res.users);
      } else if (activeTab === 'pricing') {
        const res = await api.getPlans();
        setPlans(res);
      } else if (activeTab === 'logs') {
        const res = await api.getActivityLogs();
        setLogs(res.logs);
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
    fetchData();
  }, [activeTab]);

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
            toast.success('Server stop successful');
            fetchData();
          } catch (e) {
            toast.error('Failed to stop server: ' + e.message);
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
            toast.success('Server delete successful');
            fetchData();
          } catch (e) {
            toast.error('Failed to delete server: ' + e.message);
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
          toast.success('Plan updated successfully');
          setEditingPlan(null);
          fetchData();
        } catch (e) {
          toast.error('Failed to update plan: ' + e.message);
        }
      }
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
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
    e.preventDefault();
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
    e.preventDefault();
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

  const formatRemainingDays = (expiresAt) => {
    if (!expiresAt) return <span className="px-2 py-0.5 rounded text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">Permanen</span>;
    const diff = new Date(expiresAt) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400 border border-red-500/30 font-bold">Kedaluwarsa</span>;
    if (days <= 3) return <span className="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">{days} Hari Lagi</span>;
    return <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">{days} Hari</span>;
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <Activity className="w-5 h-5" /> },
    { id: 'servers', name: 'Servers', icon: <Server className="w-5 h-5" /> },
    { id: 'users', name: 'Users', icon: <Users className="w-5 h-5" /> },
    { id: 'pricing', name: 'Pricing', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'logs', name: 'Activity Logs', icon: <Shield className="w-5 h-5" /> },
  ];

  // Filter & Paginate Servers
  const filteredServers = servers.filter(s => {
    if (!serverSearchQuery) return true;
    const q = serverSearchQuery.toLowerCase();
    return (s.name || '').toLowerCase().includes(q) || 
           (s.owner || '').toLowerCase().includes(q) || 
           String(s.id).includes(q) || 
           String(s.port).includes(q) || 
           (s.status || '').toLowerCase().includes(q);
  });
  const totalServerPages = Math.ceil(filteredServers.length / serversPerPage) || 1;
  const paginatedServers = filteredServers.slice((serverCurrentPage - 1) * serversPerPage, serverCurrentPage * serversPerPage);

  // Filter & Paginate Users
  const filteredUsers = users.filter(u => {
    if (!userSearchQuery) return true;
    const q = userSearchQuery.toLowerCase();
    return (u.username || '').toLowerCase().includes(q) || 
           (u.email || '').toLowerCase().includes(q) || 
           String(u.id).includes(q) || 
           (u.role || '').toLowerCase().includes(q);
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

  const renderPaginationFooter = (currentPage, totalPages, totalItems, perPage, setPage, setPerPage, label = "item") => (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t border-zinc-800/80 text-xs text-zinc-400">
      <div className="flex items-center gap-3">
        <span>
          Menampilkan <strong className="text-white">{totalItems === 0 ? 0 : (currentPage - 1) * perPage + 1}</strong> - <strong className="text-white">{Math.min(currentPage * perPage, totalItems)}</strong> dari <strong className="text-white">{totalItems}</strong> {label}
        </span>
        <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1">
          <span className="text-zinc-500">Per halaman:</span>
          <select 
            value={perPage} 
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="bg-transparent text-white font-bold outline-none cursor-pointer"
          >
            <option value={5} className="bg-zinc-900">5</option>
            <option value={10} className="bg-zinc-900">10</option>
            <option value={25} className="bg-zinc-900">25</option>
            <option value={50} className="bg-zinc-900">50</option>
            <option value={100} className="bg-zinc-900">100</option>
          </select>
        </div>
      </div>

      {totalPages > 1 && (
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
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
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

  return (
    <div className="h-[100dvh] bg-[#0a0a0a] text-zinc-300 font-sans flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="md:hidden absolute inset-0 bg-black/60 z-30"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Left Sidebar */}
        <aside className={`absolute md:relative z-40 w-64 h-full border-r border-zinc-800/60 bg-[#0a0a0a] flex flex-col overflow-y-auto shrink-0 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-4 flex items-center justify-between md:hidden border-b border-zinc-800/60 mb-2">
            <span className="font-bold text-white">Panel Admin</span>
            <button onClick={() => setIsSidebarOpen(false)} className="text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4 pt-2 md:pt-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                  <Shield className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h2 className="font-semibold text-zinc-100">Admin</h2>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-emerald-500 font-medium">Dashboard</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-0.5">
            <div className="px-3 pb-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Navigasi</div>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
                  activeTab === tab.id 
                    ? 'bg-emerald-500/10 text-emerald-500' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-zinc-800/60 space-y-2">
            <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white px-2 py-1.5 rounded hover:bg-zinc-800/50 transition">
              <Server className="w-3.5 h-3.5 text-emerald-500" /> Kembali ke Dasbor
            </button>
            <button onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('role');
              localStorage.removeItem('username');
              navigate('/login');
            }} className="w-full flex items-center gap-2 text-xs font-medium text-red-400 hover:text-red-300 px-2 py-1.5 rounded hover:bg-red-500/10 transition">
              <LogOut className="w-3.5 h-3.5" /> Keluar
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#0a0a0a] flex flex-col">
          <div className="md:hidden p-4 border-b border-zinc-800/60 flex items-center justify-between bg-[#101010] shrink-0">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span className="font-bold text-white text-sm">Dasbor Admin</span>
            </div>
            <button onClick={() => setIsSidebarOpen(true)} className="p-1.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-400 hover:text-white">
              <PanelLeft className="w-4 h-4" />
            </button>
          </div>
          
          <div className="w-full flex-none min-h-[100dvh] md:min-h-0 flex flex-col p-4 sm:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  <Shield className="w-8 h-8 text-emerald-500" />
                  Dasbor Admin
                </h1>
                <p className="text-zinc-500">Kelola sumber daya platform dan pengguna.</p>
              </div>
              <button onClick={fetchData} className="p-2 hover:bg-zinc-900 rounded-lg transition-colors border border-zinc-800">
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="bg-transparent animate-fade-in min-h-[400px]">
              {isLoading && !stats && !users.length && !plans.length && !logs.length ? (
                <div className="text-center py-12 text-zinc-500">Memuat data...</div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Total Servers */}
                  <div className="bg-[#101010] border border-zinc-800/60 rounded-xl p-5">
                    <div className="flex items-center gap-2 text-zinc-400 mb-4 text-xs font-bold uppercase tracking-wider">
                      <Server className="w-4 h-4 text-primary" /> Total Server
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stats?.totalServers || 0}</div>
                    <div className="text-xs text-zinc-500">Semua server terdaftar</div>
                  </div>

                  {/* Active Servers */}
                  <div className="bg-[#101010] border border-zinc-800/60 rounded-xl p-5">
                    <div className="flex items-center gap-2 text-zinc-400 mb-4 text-xs font-bold uppercase tracking-wider">
                      <CheckCircle className="w-4 h-4 text-emerald-400" /> Server Aktif
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stats?.activeServers || 0}</div>
                    <div className="text-xs text-zinc-500">Server yang sedang berjalan</div>
                  </div>

                  {/* Total Users */}
                  <div className="bg-[#101010] border border-zinc-800/60 rounded-xl p-5">
                    <div className="flex items-center gap-2 text-zinc-400 mb-4 text-xs font-bold uppercase tracking-wider">
                      <Users className="w-4 h-4 text-blue-400" /> Total Pengguna
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stats?.totalUsers || 0}</div>
                    <div className="text-xs text-zinc-500">Semua pengguna terdaftar</div>
                  </div>
                </div>
              )}

              {activeTab === 'servers' && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-[#121212] p-4 rounded-xl border border-zinc-800/80">
                    <div className="text-sm text-zinc-400">
                      Menampilkan <span className="font-bold text-white">{filteredServers.length}</span> server
                      {serverSearchQuery && <span className="text-zinc-500"> untuk "{serverSearchQuery}"</span>}
                    </div>
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Cari server, owner, port, ID..."
                        value={serverSearchQuery}
                        onChange={(e) => {
                          setServerSearchQuery(e.target.value);
                          setServerCurrentPage(1);
                        }}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-9 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
                      />
                      {serverSearchQuery && (
                        <button
                          onClick={() => {
                            setServerSearchQuery('');
                            setServerCurrentPage(1);
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="overflow-x-auto bg-[#101010] border border-zinc-800 rounded-xl">
                    <table className="w-full text-left text-sm text-zinc-400">
                      <thead className="text-xs uppercase bg-zinc-800/50 text-zinc-300 border-b border-zinc-800">
                        <tr>
                          <th className="px-4 py-3.5">ID</th>
                          <th className="px-4 py-3.5">Name</th>
                          <th className="px-4 py-3.5">Owner</th>
                          <th className="px-4 py-3.5">Status</th>
                          <th className="px-4 py-3.5">Port</th>
                          <th className="px-4 py-3.5">Masa Aktif</th>
                          <th className="px-4 py-3.5">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedServers.map(s => (
                          <tr key={s.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                            <td className="px-4 py-3.5 font-mono">#{s.id}</td>
                            <td className="px-4 py-3.5 font-medium text-white">{s.name}</td>
                            <td className="px-4 py-3.5">{s.owner}</td>
                            <td className="px-4 py-3.5">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${s.status === 'running' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                {s.status}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 font-mono text-zinc-300">{s.port}</td>
                            <td className="px-4 py-3.5">{formatRemainingDays(s.expiresAt)}</td>
                            <td className="px-4 py-3.5 flex flex-wrap items-center gap-1.5">
                              {s.status === 'running' && (
                                <button onClick={() => handleServerAction(s.port, 'stop')} className="p-1.5 text-zinc-400 hover:text-amber-400 hover:bg-amber-400/10 rounded border border-transparent hover:border-amber-400/30 transition-colors" title="Stop">
                                  <StopCircle className="w-4 h-4" />
                                </button>
                              )}
                              <button onClick={() => handleServerAction(s.port, 'delete')} className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded border border-transparent hover:border-red-400/30 transition-colors" title="Delete">
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleExtendServer(s.id, 30)} className="px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/20 transition-colors" title="Perpanjang 30 Hari">
                                +30 Hari
                              </button>
                              <button onClick={() => handleExtendServer(s.id, 'permanent')} className="px-2 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs rounded border border-purple-500/20 transition-colors" title="Jadikan Permanen">
                                Permanen
                              </button>
                            </td>
                          </tr>
                        ))}
                        {paginatedServers.length === 0 && (
                          <tr>
                            <td colSpan="7" className="text-center py-12 text-zinc-500">
                              {serverSearchQuery ? `Tidak ada server yang cocok dengan pencarian "${serverSearchQuery}"` : 'Tidak ada server ditemukan'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {renderPaginationFooter(serverCurrentPage, totalServerPages, filteredServers.length, serversPerPage, setServerCurrentPage, setServersPerPage, "server")}
                </div>
              )}

              {activeTab === 'users' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-[#121212] p-4 rounded-xl border border-zinc-800/80">
                    <div>
                      <h3 className="text-lg font-bold text-white">Manajemen Pengguna ({filteredUsers.length})</h3>
                      <p className="text-xs text-zinc-400">Kelola daftar akun pengguna dan server milik mereka</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                      <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="Cari username, email, role..."
                          value={userSearchQuery}
                          onChange={(e) => {
                            setUserSearchQuery(e.target.value);
                            setUserCurrentPage(1);
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-9 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
                        />
                        {userSearchQuery && (
                          <button
                            onClick={() => {
                              setUserSearchQuery('');
                              setUserCurrentPage(1);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <button 
                        onClick={() => setShowCreateUserModal(true)}
                        className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 whitespace-nowrap"
                      >
                        + Buat User Baru
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto bg-[#101010] border border-zinc-800 rounded-xl">
                    <table className="w-full text-left text-sm text-zinc-400">
                      <thead className="text-xs uppercase bg-zinc-800/50 text-zinc-300 border-b border-zinc-800">
                        <tr>
                          <th className="px-4 py-3.5">ID</th>
                          <th className="px-4 py-3.5">Username</th>
                          <th className="px-4 py-3.5">Email</th>
                          <th className="px-4 py-3.5">Role</th>
                          <th className="px-4 py-3.5">Server</th>
                          <th className="px-4 py-3.5">Joined</th>
                          <th className="px-4 py-3.5">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedUsers.map(u => {
                          const userServersCount = servers.filter(s => s.userId === u.id || s.owner === u.username).length;
                          return (
                            <tr key={u.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                              <td className="px-4 py-3.5 font-mono">#{u.id}</td>
                              <td className="px-4 py-3.5 font-medium text-white">{u.username}</td>
                              <td className="px-4 py-3.5">{u.email}</td>
                              <td className="px-4 py-3.5">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="px-4 py-3.5">
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                  {userServersCount} Server
                                </span>
                              </td>
                              <td className="px-4 py-3.5">{new Date(u.createdAt).toLocaleDateString()}</td>
                              <td className="px-4 py-3.5 flex gap-2">
                                <button 
                                  onClick={() => setShowUserDetailModal(u)} 
                                  className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded text-xs border border-zinc-700 transition-colors"
                                >
                                  Detail & Server
                                </button>
                                <button 
                                  onClick={() => {
                                    setEditUserData({ id: u.id, username: u.username, email: u.email, role: u.role, password: '' });
                                    setShowEditUserModal(true);
                                  }} 
                                  className="p-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-amber-400 rounded border border-zinc-700 transition-colors"
                                  title="Edit User"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                {u.username !== 'admin' && (
                                  <button 
                                    onClick={() => handleDeleteUser(u.id, u.username)} 
                                    className="p-1.5 bg-zinc-800/80 hover:bg-red-500/20 text-red-400 rounded border border-zinc-700 hover:border-red-500/30 transition-colors"
                                    title="Hapus User"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                        {paginatedUsers.length === 0 && (
                          <tr>
                            <td colSpan="7" className="text-center py-12 text-zinc-500">
                              {userSearchQuery ? `Tidak ada user yang cocok dengan pencarian "${userSearchQuery}"` : 'Tidak ada user ditemukan'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {renderPaginationFooter(userCurrentPage, totalUserPages, filteredUsers.length, usersPerPage, setUserCurrentPage, setUsersPerPage, "user")}
                </div>
              )}

              {activeTab === 'pricing' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plans.map(p => (
                    <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-white">{p.name}</h3>
                        <span className="text-zinc-500 text-sm">RAM: {p.ram}</span>
                      </div>
                      
                      {editingPlan === p.id ? (
                        <div className="space-y-4 bg-zinc-950 p-4 rounded-md border border-zinc-800">
                          <div>
                            <label className="block text-xs text-zinc-400 mb-1">Price (IDR)</label>
                            <input 
                              type="number" 
                              className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white outline-none focus:border-emerald-500"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-zinc-400 mb-1">Discount (%)</label>
                            <input 
                              type="number" 
                              className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white outline-none focus:border-emerald-500"
                              value={editDiscount}
                              onChange={(e) => setEditDiscount(e.target.value)}
                            />
                          </div>
                          <div className="flex gap-2 justify-end pt-2">
                            <button onClick={() => setEditingPlan(null)} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded">
                              <X className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleSavePlan(p.id)} className="p-2 text-emerald-400 hover:bg-emerald-500/20 bg-emerald-500/10 rounded">
                              <Save className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Price:</span>
                            <span className="text-white font-medium">Rp {p.price.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Discount:</span>
                            <span className={p.discount > 0 ? 'text-emerald-400 font-medium' : 'text-zinc-500'}>{p.discount}%</span>
                          </div>
                          <div className="flex justify-between text-sm pt-2 border-t border-zinc-800 mt-2">
                            <span className="text-zinc-400">Final Price:</span>
                            <span className="text-emerald-500 font-bold">Rp {(p.price - (p.price * p.discount / 100)).toLocaleString()}</span>
                          </div>
                          
                          <button 
                            onClick={() => {
                              setEditingPlan(p.id);
                              setEditPrice(p.price);
                              setEditDiscount(p.discount);
                            }}
                            className="mt-4 w-full py-2 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded transition-colors text-sm"
                          >
                            <Edit2 className="w-4 h-4" /> Edit Plan
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'logs' && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-[#121212] p-4 rounded-xl border border-zinc-800/80">
                    <div className="text-sm text-zinc-400">
                      Menampilkan <span className="font-bold text-white">{filteredLogs.length}</span> log aktivitas
                      {logSearchQuery && <span className="text-zinc-500"> untuk "{logSearchQuery}"</span>}
                    </div>
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Cari user, aksi, atau detail..."
                        value={logSearchQuery}
                        onChange={(e) => {
                          setLogSearchQuery(e.target.value);
                          setLogCurrentPage(1);
                        }}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-9 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
                      />
                      {logSearchQuery && (
                        <button
                          onClick={() => {
                            setLogSearchQuery('');
                            setLogCurrentPage(1);
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="overflow-x-auto bg-[#0a0a0a] border border-zinc-800/80 rounded-xl">
                    <table className="w-full text-left text-sm text-zinc-400">
                      <thead className="text-xs uppercase bg-zinc-800/50 text-zinc-300">
                        <tr>
                          <th className="px-4 py-3.5">Time</th>
                          <th className="px-4 py-3.5">User</th>
                          <th className="px-4 py-3.5">Action</th>
                          <th className="px-4 py-3.5">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedLogs.map(log => (
                          <tr key={log.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/20 transition-colors">
                            <td className="px-4 py-3.5 whitespace-nowrap text-xs">{new Date(log.createdAt).toLocaleString()}</td>
                            <td className="px-4 py-3.5 font-medium text-emerald-400">{log.username || 'System'}</td>
                            <td className="px-4 py-3.5">
                              <span className="px-2.5 py-1 bg-zinc-800/80 border border-zinc-700/50 rounded-md text-xs font-medium text-zinc-300">{log.action}</span>
                            </td>
                            <td className="px-4 py-3.5 text-xs font-mono break-all max-w-md text-zinc-300">{log.details || '-'}</td>
                          </tr>
                        ))}
                        {paginatedLogs.length === 0 && (
                          <tr>
                            <td colSpan="4" className="text-center py-12 text-zinc-500">
                              {logSearchQuery ? `Tidak ada log yang cocok dengan pencarian "${logSearchQuery}"` : 'Tidak ada log aktivitas ditemukan'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {renderPaginationFooter(logCurrentPage, totalLogPages, filteredLogs.length, logsPerPage, setLogCurrentPage, setLogsPerPage, "log")}
                </div>
              )}
            </>
          )}
            </div>
          </div>

          {/* Modal Buat User Baru */}
          {showCreateUserModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-400" /> Buat Pengguna Baru
                  </h3>
                  <button onClick={() => setShowCreateUserModal(false)} className="text-zinc-500 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Username</label>
                    <input 
                      type="text" required
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-emerald-500 transition-colors"
                      placeholder="e.g. alex_player"
                      value={newUserData.username}
                      onChange={e => setNewUserData({...newUserData, username: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Email</label>
                    <input 
                      type="email" required
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-emerald-500 transition-colors"
                      placeholder="e.g. alex@example.com"
                      value={newUserData.email}
                      onChange={e => setNewUserData({...newUserData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Password</label>
                    <input 
                      type="password" required
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-emerald-500 transition-colors"
                      placeholder="••••••••"
                      value={newUserData.password}
                      onChange={e => setNewUserData({...newUserData, password: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Role</label>
                    <select
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-emerald-500 transition-colors"
                      value={newUserData.role}
                      onChange={e => setNewUserData({...newUserData, role: e.target.value})}
                    >
                      <option value="user">User Biasa</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800/80">
                    <button type="button" onClick={() => setShowCreateUserModal(false)} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-xl transition-colors">
                      Batal
                    </button>
                    <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-emerald-600/20">
                      Simpan User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal Edit User */}
          {showEditUserModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Edit2 className="w-5 h-5 text-amber-400" /> Edit Pengguna
                  </h3>
                  <button onClick={() => setShowEditUserModal(false)} className="text-zinc-500 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleUpdateUser} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Username</label>
                    <input 
                      type="text" required
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-amber-500 transition-colors"
                      value={editUserData.username}
                      onChange={e => setEditUserData({...editUserData, username: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Email</label>
                    <input 
                      type="email" required
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-amber-500 transition-colors"
                      value={editUserData.email}
                      onChange={e => setEditUserData({...editUserData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Password Baru (Opsional)</label>
                    <input 
                      type="password"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-amber-500 transition-colors"
                      placeholder="Biarkan kosong jika tidak diubah"
                      value={editUserData.password}
                      onChange={e => setEditUserData({...editUserData, password: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Role</label>
                    <select
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-amber-500 transition-colors"
                      value={editUserData.role}
                      onChange={e => setEditUserData({...editUserData, role: e.target.value})}
                      disabled={editUserData.username === 'admin'}
                    >
                      <option value="user">User Biasa</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800/80">
                    <button type="button" onClick={() => setShowEditUserModal(false)} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-xl transition-colors">
                      Batal
                    </button>
                    <button type="submit" className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold rounded-xl transition-colors shadow-lg shadow-amber-500/20">
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal Detail User & Daftar Server Miliknya */}
          {showUserDetailModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-6 w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-6 border-b border-zinc-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white">{showUserDetailModal.username}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs ${showUserDetailModal.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                        {showUserDetailModal.role}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400 mt-1">{showUserDetailModal.email} · ID: #{showUserDetailModal.id}</p>
                  </div>
                  <button onClick={() => setShowUserDetailModal(null)} className="text-zinc-500 hover:text-white p-1">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-blue-400" /> Daftar Server Milik {showUserDetailModal.username}
                  </h4>
                  <button 
                    onClick={() => setShowCreateServerModal(showUserDetailModal)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-lg shadow-blue-600/20"
                  >
                    + Buat Server untuk User Ini
                  </button>
                </div>

                <div className="overflow-x-auto bg-[#0a0a0a] border border-zinc-800/80 rounded-xl mb-6">
                  <table className="w-full text-left text-xs text-zinc-400">
                    <thead className="uppercase bg-zinc-800/50 text-zinc-300 border-b border-zinc-800">
                      <tr>
                        <th className="px-3 py-2.5">ID</th>
                        <th className="px-3 py-2.5">Nama Server</th>
                        <th className="px-3 py-2.5">Status</th>
                        <th className="px-3 py-2.5">Port</th>
                        <th className="px-3 py-2.5">Masa Aktif</th>
                        <th className="px-3 py-2.5">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {servers
                        .filter(s => s.userId === showUserDetailModal.id || s.owner === showUserDetailModal.username)
                        .map(s => (
                          <tr key={s.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                            <td className="px-3 py-2.5 font-mono">#{s.id}</td>
                            <td className="px-3 py-2.5 font-medium text-white">{s.name}</td>
                            <td className="px-3 py-2.5">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.status === 'running' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                {s.status}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 font-mono text-zinc-300">{s.port}</td>
                            <td className="px-3 py-2.5">{formatRemainingDays(s.expiresAt)}</td>
                            <td className="px-3 py-2.5 flex flex-wrap gap-1">
                              {s.status === 'running' && (
                                <button onClick={() => handleServerAction(s.port, 'stop')} className="p-1 text-zinc-400 hover:text-amber-400 hover:bg-amber-400/10 rounded" title="Stop">
                                  <StopCircle className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button onClick={() => handleServerAction(s.port, 'delete')} className="p-1 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded" title="Delete">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => handleExtendServer(s.id, 30)} className="px-2 py-0.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[10px] rounded border border-blue-500/20">
                                +30 Hari
                              </button>
                              <button onClick={() => handleExtendServer(s.id, 'permanent')} className="px-2 py-0.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-[10px] rounded border border-purple-500/20">
                                Permanen
                              </button>
                            </td>
                          </tr>
                        ))}
                      {servers.filter(s => s.userId === showUserDetailModal.id || s.owner === showUserDetailModal.username).length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center py-8 text-zinc-500">
                            Pengguna ini belum memiliki server
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end">
                  <button onClick={() => setShowUserDetailModal(null)} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-xl transition-colors">
                    Tutup Detail
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Buat Server Untuk User Ini */}
          {showCreateServerModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Server className="w-5 h-5 text-blue-400" /> Buat Server untuk {showCreateServerModal.username}
                  </h3>
                  <button onClick={() => setShowCreateServerModal(null)} className="text-zinc-500 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleCreateServerForUser} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Nama Server</label>
                    <input 
                      type="text" required
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-blue-500 transition-colors"
                      placeholder="e.g. Dunia Alex"
                      value={newServerData.name}
                      onChange={e => setNewServerData({...newServerData, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Paket RAM (Harga)</label>
                      <select
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-blue-500 transition-colors"
                        value={newServerData.memoryLimit}
                        onChange={e => setNewServerData({...newServerData, memoryLimit: e.target.value})}
                      >
                        {plans && plans.length > 0 ? (
                          plans.map(p => {
                            const val = p.ram.toLowerCase().replace('mb', 'm').replace('gb', 'g');
                            const finalPrice = p.price - (p.price * (p.discount || 0) / 100);
                            return (
                              <option key={p.id} value={val}>
                                {p.name} ({p.ram}) - Rp {finalPrice.toLocaleString('id-ID')}/bln
                              </option>
                            );
                          })
                        ) : (
                          <>
                            <option value="500m">Villager (500MB) - Rp 30.000/bln</option>
                            <option value="1g">Spider (1GB) - Rp 40.000/bln</option>
                            <option value="2g">Slime (2GB) - Rp 50.000/bln</option>
                            <option value="4g">Wither (4GB) - Rp 60.000/bln</option>
                          </>
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Masa Aktif</label>
                      <select
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-blue-500 transition-colors"
                        value={newServerData.days}
                        onChange={e => setNewServerData({...newServerData, days: e.target.value})}
                      >
                        <option value="30">30 Hari</option>
                        <option value="60">60 Hari</option>
                        <option value="90">90 Hari</option>
                        <option value="365">1 Tahun</option>
                        <option value="permanent">Permanen</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Mode Permainan</label>
                      <select
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-blue-500 transition-colors"
                        value={newServerData.gamemode}
                        onChange={e => setNewServerData({...newServerData, gamemode: e.target.value})}
                      >
                        <option value="survival">Survival</option>
                        <option value="creative">Creative</option>
                        <option value="adventure">Adventure</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Tingkat Kesulitan</label>
                      <select
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-blue-500 transition-colors"
                        value={newServerData.difficulty}
                        onChange={e => setNewServerData({...newServerData, difficulty: e.target.value})}
                      >
                        <option value="peaceful">Peaceful</option>
                        <option value="easy">Easy</option>
                        <option value="normal">Normal</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Versi Minecraft Server</label>
                    <select
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-blue-500 transition-colors"
                      value={newServerData.version === 'latest' || newServerData.version === 'preview' ? newServerData.version : 'custom'}
                      onChange={e => {
                        if (e.target.value !== 'custom') {
                          setNewServerData({...newServerData, version: e.target.value});
                        } else {
                          setNewServerData({...newServerData, version: ''});
                        }
                      }}
                    >
                      <option value="latest">Rilis Terbaru (Latest)</option>
                      <option value="preview">Preview (Beta)</option>
                      <option value="custom">Versi Kustom...</option>
                    </select>
                    {(newServerData.version !== 'latest' && newServerData.version !== 'preview') && (
                      <input
                        type="text" required
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-white text-sm outline-none focus:border-blue-500 transition-colors mt-2"
                        placeholder="misal: 1.20.10.01"
                        value={newServerData.version}
                        onChange={e => setNewServerData({...newServerData, version: e.target.value})}
                      />
                    )}
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800/80">
                    <button type="button" onClick={() => setShowCreateServerModal(null)} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-xl transition-colors">
                      Batal
                    </button>
                    <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-blue-600/20">
                      Deploy Server
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          <ConfirmModal
            isOpen={confirmConfig.isOpen}
            onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
            onConfirm={confirmConfig.onConfirm}
            title={confirmConfig.title}
            message={confirmConfig.message}
            confirmText={confirmConfig.confirmText}
            isDanger={confirmConfig.isDanger}
          />
          <Footer />
        </main>
      </div>
    </div>
  );
}
