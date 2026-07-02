import React from 'react';
import { Search, X, Edit2, Trash2 } from 'lucide-react';

export default function AdminUsersTab({
  filteredUsers,
  userSearchQuery,
  setUserSearchQuery,
  setUserCurrentPage,
  setShowCreateUserModal,
  paginatedUsers,
  servers,
  setShowUserDetailModal,
  setEditUserData,
  setShowEditUserModal,
  handleDeleteUser,
  userCurrentPage,
  totalUserPages,
  usersPerPage,
  setUsersPerPage,
  renderPaginationFooter
}) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-[#121212] p-4 rounded-xl border border-zinc-800/80">
        <div>
          <h3 className="text-lg font-bold text-white">
            Manajemen Pengguna ({filteredUsers.length})
          </h3>
          <p className="text-xs text-zinc-400">
            Kelola daftar akun pengguna dan server milik mereka
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari username, email, peran..."
              value={userSearchQuery}
              onChange={(e) => {
                setUserSearchQuery(e.target.value);
                setUserCurrentPage(1);
              }}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md pl-10 pr-9 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
            />
            {userSearchQuery && (
              <button
                onClick={() => {
                  setUserSearchQuery("");
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
            className="w-full sm:w-auto px-4 py-2 bg-primary hover:bg-primary-hover text-white text-md font-medium rounded-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20 whitespace-nowrap"
          >
            + Buat Pengguna Baru
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
              <th className="px-4 py-3.5">Peran</th>
              <th className="px-4 py-3.5">Server</th>
              <th className="px-4 py-3.5">Terdaftar</th>
              <th className="px-4 py-3.5">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((u) => {
              const userServersCount = servers.filter(
                (s) =>
                  s.userId === u.id || s.owner === u.username,
              ).length;
              return (
                <tr
                  key={u.id}
                  className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-4 py-3.5 font-mono">
                    #{u.id}
                  </td>
                  <td className="px-4 py-3.5 font-medium text-white">
                    {u.username}
                  </td>
                  <td className="px-4 py-3.5">{u.email}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold border ${u.role === "admin" ? "bg-purple-500/20 text-purple-300 border-purple-500/30" : "bg-zinc-800 text-zinc-300 border-zinc-700"}`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold  ">
                      {userServersCount} Server
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3.5 flex gap-2">
                    <button
                      onClick={() => setShowUserDetailModal(u)}
                      className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded text-xs border border-zinc-700 transition-colors"
                    >
                      Detail & Server
                    </button>
                    <button
                      onClick={() => {
                        setEditUserData({
                          id: u.id,
                          username: u.username,
                          email: u.email,
                          role: u.role,
                          password: "",
                        });
                        setShowEditUserModal(true);
                      }}
                      className="p-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-amber-400 rounded border border-zinc-700 transition-colors"
                      title="Edit Pengguna"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {u.username !== "admin" && (
                      <button
                        onClick={() =>
                          handleDeleteUser(u.id, u.username)
                        }
                        className="p-1.5 bg-zinc-800/80 hover:bg-red-500/20 text-red-400 rounded border border-zinc-700 hover:border-red-500/30 transition-colors"
                        title="Hapus Pengguna"
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
                <td
                  colSpan="7"
                  className="text-center py-12 text-zinc-500"
                >
                  {userSearchQuery
                    ? `Tidak ada pengguna yang cocok dengan pencarian "${userSearchQuery}"`
                    : "Tidak ada pengguna ditemukan"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {renderPaginationFooter(
        userCurrentPage,
        totalUserPages,
        filteredUsers.length,
        usersPerPage,
        setUserCurrentPage,
        setUsersPerPage,
        "pengguna",
      )}
    </div>
  );
}
