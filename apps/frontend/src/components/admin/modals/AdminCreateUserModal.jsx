import React from 'react';
import { Users, X } from 'lucide-react';
import CustomSelect from '../../CustomSelect';

export default function AdminCreateUserModal({ isOpen, onClose, onSubmit, newUserData, setNewUserData }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" /> Buat Pengguna Baru
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
              Username
            </label>
            <input
              type="text"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-emerald-500 transition-colors"
              placeholder="misal: alex_player"
              value={newUserData.username}
              onChange={(e) =>
                setNewUserData({
                  ...newUserData,
                  username: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-emerald-500 transition-colors"
              placeholder="misal: alex@example.com"
              value={newUserData.email}
              onChange={(e) =>
                setNewUserData({
                  ...newUserData,
                  email: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-emerald-500 transition-colors"
              placeholder="••••••••"
              value={newUserData.password}
              onChange={(e) =>
                setNewUserData({
                  ...newUserData,
                  password: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
              Role
            </label>
            <CustomSelect
              value={newUserData.role}
              onChange={(e) =>
                setNewUserData({ ...newUserData, role: e.target.value })
              }
            >
              <option value="user">User Biasa</option>
              <option value="admin">Administrator</option>
            </CustomSelect>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-primary/20"
            >
              Simpan User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
