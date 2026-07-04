import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Shield, Server, Users, CreditCard, Activity, RefreshCw, Share2, MessageSquare, DollarSign, X, PanelLeft, LogOut } from 'lucide-react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import Footer from '../../components/Footer';
import ConfirmModal from '../../components/ConfirmModal';
import TransactionReceiptModal from '../../components/TransactionReceiptModal';
import AdminCreateUserModal from '../../components/admin/modals/AdminCreateUserModal';
import AdminEditUserModal from '../../components/admin/modals/AdminEditUserModal';
import AdminUserDetailModal from '../../components/admin/modals/AdminUserDetailModal';
import AdminCreateServerModal from '../../components/admin/modals/AdminCreateServerModal';
import AdminLightboxModal from '../../components/admin/modals/AdminLightboxModal';
import { AdminProvider, useAdmin } from '../../context/AdminContext';
import { DataLoading } from '../../components/DataLoading';

function AdminLayoutContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const {
    activeTab,
    setActiveTab,
    isLoading,
    fetchData,
    confirmConfig,
    setConfirmConfig,
    stats,
    users,
    plans,
    logs,
    servers,
    showCreateUserModal,
    setShowCreateUserModal,
    newUserData,
    setNewUserData,
    handleCreateUser,
    showEditUserModal,
    setShowEditUserModal,
    editUserData,
    setEditUserData,
    handleUpdateUser,
    showUserDetailModal,
    setShowUserDetailModal,
    showCreateServerModal,
    setShowCreateServerModal,
    newServerData,
    setNewServerData,
    handleCreateServerForUser,
    handleServerAction,
    handleExtendServer,
    formatUptime,
    formatRemainingDays,
    showTrxDetailModal,
    setShowTrxDetailModal,
    lightboxImg,
    setLightboxImg
  } = useAdmin();

  const tabs = [
    { id: 'overview', name: 'Ikhtisar', icon: <Activity className="w-5 h-5" />, path: '/admin/overview' },
    { id: 'servers', name: 'Server', icon: <Server className="w-5 h-5" />, path: '/admin/servers' },
    { id: 'users', name: 'Pengguna', icon: <Users className="w-5 h-5" />, path: '/admin/users' },
    { id: 'pricing', name: 'Paket & Harga', icon: <CreditCard className="w-5 h-5" />, path: '/admin/plans' },
    { id: 'transactions', name: 'Transaksi', icon: <DollarSign className="w-5 h-5" />, path: '/admin/transactions' },
    { id: 'logs', name: 'Log Aksi', icon: <Shield className="w-5 h-5" />, path: '/admin/logs' },
    { id: 'settings', name: 'Pengaturan', icon: <Share2 className="w-5 h-5" />, path: '/admin/settings' },
    { id: 'tickets', name: 'Tiket Bantuan', icon: <MessageSquare className="w-5 h-5" />, path: '/admin/tickets' },
  ];

  const getPageHeader = (tab) => {
    switch (tab) {
      case 'overview':
        return {
          title: 'Ikhtisar Dasbor',
          description: 'Pantau statistik keseluruhan, kapasitas server, dan aktivitas pengguna MCloud.'
        };
      case 'servers':
        return {
          title: 'Manajemen Server',
          description: 'Kelola seluruh server aktif, perpanjang masa aktif, atau lakukan tindakan administratif.'
        };
      case 'users':
        return {
          title: 'Manajemen Pengguna',
          description: 'Daftar pengguna terdaftar, pengaturan role (administrator / user), dan pengelolaan akun.'
        };
      case 'pricing':
        return {
          title: 'Paket & Harga Layanan',
          description: 'Atur harga paket langganan, diskon bulanan, dan batas kapasitas resource pool RAM.'
        };
      case 'transactions':
        return {
          title: 'Riwayat Transaksi',
          description: 'Pantau aliran pembayaran, perpanjangan server, dan verifikasi pesanan platform.'
        };
      case 'logs':
        return {
          title: 'Log Aktivitas Sistem',
          description: 'Lacak riwayat tindakan pengguna dan admin di seluruh platform demi keamanan dan audit.'
        };
      case 'settings':
        return {
          title: 'Pengaturan Platform',
          description: 'Sesuaikan tautan Discord, WhatsApp, Instagram, dan konfigurasi umum platform.'
        };
      case 'tickets':
        return {
          title: 'Pusat Tiket Bantuan',
          description: 'Tanggapi laporan kendala teknis dari pemain dan kelola status dukungan layanan.'
        };
      default:
        return {
          title: 'Dasbor Admin',
          description: 'Kelola sumber daya platform dan pengguna.'
        };
    }
  };

  const headerInfo = getPageHeader(activeTab);

  return (
    <div className="h-[100dvh] bg-[#0a0a0a] text-zinc-300 font-sans flex flex-col overflow-hidden">
      <AdminNavbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="md:hidden absolute inset-0 bg-black/60 z-30"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Left Sidebar */}
        <aside
          className={`absolute md:relative z-40 w-64 h-full border-r border-zinc-800/60 bg-[#0a0a0a] flex flex-col overflow-y-auto shrink-0 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          <div className="p-4 flex items-center justify-between md:hidden border-b border-zinc-800/60 mb-2">
            <span className="font-bold text-white">Panel Admin</span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* <div className="p-4 pt-2 md:pt-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                  <Shield className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h2 className="font-semibold text-zinc-100">Admin</h2>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-emerald-500 font-medium">
                      Dashboard
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          <nav className="flex-1 px-3 py-4 space-y-0.5">
            <div className="px-3 pb-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Navigasi
            </div>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center border-l-2  gap-3 px-3 py-2 rounded-e-sm text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border-transparent hover:border-zinc-200"
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-zinc-800/60 space-y-2">
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                localStorage.removeItem("username");
                navigate("/login");
              }}
              className="w-full flex items-center gap-2 text-md font-medium text-red-400 hover:text-red-300 px-2 py-3 rounded transition"
            >
              <LogOut className="w-5 h-5" /> Keluar
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#0a0a0a] flex flex-col">
          <div className="md:hidden p-4 border-b border-zinc-800/60 flex items-center justify-between bg-[#101010] shrink-0">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span className="font-bold text-white text-sm">{headerInfo.title}</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-400 hover:text-white"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="w-full flex-none min-h-[100dvh] md:min-h-0 flex flex-col p-4 sm:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  {headerInfo.title}
                </h1>
                <p className="text-zinc-500">
                  {headerInfo.description}
                </p>
              </div>
              <button
                onClick={fetchData}
                className="p-2 hover:bg-zinc-900 rounded-lg transition-colors border border-zinc-800"
                title="Muat Ulang Data"
              >
                <RefreshCw
                  className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
            </div>

            <div className="bg-transparent animate-fade-in min-h-[400px]">
              {isLoading &&
              !stats &&
              !users.length &&
              !plans.length &&
              !logs.length ? (
                <DataLoading
                  text="Memuat statistik & data panel admin..."
                  size="lg"
                />
              ) : (
                <Outlet />
              )}
            </div>
          </div>

          {/* Modals */}
          <AdminCreateUserModal
            isOpen={showCreateUserModal}
            onClose={() => setShowCreateUserModal(false)}
            onSubmit={handleCreateUser}
            newUserData={newUserData}
            setNewUserData={setNewUserData}
          />

          <AdminEditUserModal
            isOpen={showEditUserModal}
            onClose={() => setShowEditUserModal(false)}
            onSubmit={handleUpdateUser}
            editUserData={editUserData}
            setEditUserData={setEditUserData}
          />

          <AdminUserDetailModal
            userModal={showUserDetailModal}
            onClose={() => setShowUserDetailModal(null)}
            servers={servers}
            onOpenCreateServer={setShowCreateServerModal}
            handleServerAction={handleServerAction}
            handleExtendServer={handleExtendServer}
            formatUptime={formatUptime}
            formatRemainingDays={formatRemainingDays}
          />

          <AdminCreateServerModal
            userModal={showCreateServerModal}
            onClose={() => setShowCreateServerModal(null)}
            onSubmit={handleCreateServerForUser}
            newServerData={newServerData}
            setNewServerData={setNewServerData}
            plans={plans}
          />

          <TransactionReceiptModal
            transaction={showTrxDetailModal}
            onClose={() => setShowTrxDetailModal(null)}
          />

          <AdminLightboxModal
            lightboxImg={lightboxImg}
            onClose={() => setLightboxImg(null)}
          />

          <ConfirmModal
            isOpen={confirmConfig.isOpen}
            onClose={() =>
              setConfirmConfig({ ...confirmConfig, isOpen: false })
            }
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

export default function AdminLayout() {
  return (
    <AdminProvider>
      <AdminLayoutContent />
    </AdminProvider>
  );
}
