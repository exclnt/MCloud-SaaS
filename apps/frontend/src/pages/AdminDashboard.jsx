import React, { useState, useEffect } from 'react';
import { Shield, Server, Users, CreditCard, Activity, RefreshCw, StopCircle, Trash2, Edit2, CheckCircle, Save, X, PanelLeft, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [servers, setServers] = useState([]);
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Edit Plan State
  const [editingPlan, setEditingPlan] = useState(null);
  const [editPrice, setEditPrice] = useState(0);
  const [editDiscount, setEditDiscount] = useState(0);

  const fetchData = async () => {
    setIsLoading(true);
    try {
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
    fetchData();
  }, [activeTab]);

  const handleServerAction = async (port, action) => {
    try {
      if (action === 'stop') await api.stopServer(port);
      if (action === 'delete') {
        if (!confirm('Are you sure you want to delete this server?')) return;
        await api.deleteServer(port);
      }
      toast.success(`Server ${action} successful`);
      fetchData();
    } catch (e) {
      toast.error(`Failed to ${action} server: ` + e.message);
    }
  };

  const handleSavePlan = async (planId) => {
    try {
      await api.updatePlan(planId, { price: parseInt(editPrice), discount: parseInt(editDiscount) });
      toast.success('Plan updated successfully');
      setEditingPlan(null);
      fetchData();
    } catch (e) {
      toast.error('Failed to update plan: ' + e.message);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <Activity className="w-5 h-5" /> },
    { id: 'servers', name: 'Servers', icon: <Server className="w-5 h-5" /> },
    { id: 'users', name: 'Users', icon: <Users className="w-5 h-5" /> },
    { id: 'pricing', name: 'Pricing', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'logs', name: 'Activity Logs', icon: <Shield className="w-5 h-5" /> },
  ];

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

          <div className="p-4 border-t border-zinc-800/60">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-300 transition">
              <LogOut className="w-3.5 h-3.5" /> Kembali ke Dasbor
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
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-zinc-400">
                    <thead className="text-xs uppercase bg-zinc-800/50 text-zinc-300">
                      <tr>
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Owner</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Port</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {servers.map(s => (
                        <tr key={s.id} className="border-b border-zinc-800 hover:bg-zinc-800/20">
                          <td className="px-4 py-3">{s.id}</td>
                          <td className="px-4 py-3 font-medium text-white">{s.name}</td>
                          <td className="px-4 py-3">{s.owner}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${s.status === 'running' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                              {s.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">{s.port}</td>
                          <td className="px-4 py-3 flex gap-2">
                            {s.status === 'running' && (
                              <button onClick={() => handleServerAction(s.port, 'stop')} className="p-1.5 text-zinc-400 hover:text-amber-400 hover:bg-amber-400/10 rounded" title="Stop">
                                <StopCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button onClick={() => handleServerAction(s.port, 'delete')} className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {servers.length === 0 && (
                        <tr><td colSpan="6" className="text-center py-8 text-zinc-500">No servers found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-zinc-400">
                    <thead className="text-xs uppercase bg-zinc-800/50 text-zinc-300">
                      <tr>
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Username</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} className="border-b border-zinc-800 hover:bg-zinc-800/20">
                          <td className="px-4 py-3">{u.id}</td>
                          <td className="px-4 py-3 font-medium text-white">{u.username}</td>
                          <td className="px-4 py-3">{u.email}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-zinc-800'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-4 py-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-zinc-400">
                    <thead className="text-xs uppercase bg-zinc-800/50 text-zinc-300">
                      <tr>
                        <th className="px-4 py-3">Time</th>
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3">Action</th>
                        <th className="px-4 py-3">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map(log => (
                        <tr key={log.id} className="border-b border-zinc-800 hover:bg-zinc-800/20">
                          <td className="px-4 py-3 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                          <td className="px-4 py-3 font-medium text-emerald-400">{log.username || 'System'}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-zinc-800 rounded text-xs">{log.action}</span>
                          </td>
                          <td className="px-4 py-3 text-xs font-mono break-all max-w-xs">{log.details || '-'}</td>
                        </tr>
                      ))}
                      {logs.length === 0 && (
                        <tr><td colSpan="4" className="text-center py-8 text-zinc-500">No activity logs found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
