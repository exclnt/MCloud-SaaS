import React, { useRef, useEffect } from 'react';
import { MessageSquare, Server, Clock, RefreshCw, CheckCircle2, X, Eye, Paperclip, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import CustomSelect from '../CustomSelect';

export default function AdminTicketsTab({
  tickets,
  selectedTicket,
  setSelectedTicket,
  ticketFilter,
  setTicketFilter,
  ticketMessages,
  ticketReply,
  setTicketReply,
  ticketAttachment,
  setTicketAttachment,
  ticketPreview,
  setTicketPreview,
  sendingTicketReply,
  handleSendAdminReply,
  handleUpdateAdminTicketStatus,
  handleSelectAdminTicket,
  setLightboxImg
}) {
  const chatEndRef = useRef(null);
  const [isClosing, setIsClosing] = React.useState(false);

  useEffect(() => {
    if (selectedTicket) {
      setIsClosing(false);
    }
  }, [selectedTicket]);

  const handleCloseChat = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedTicket(null);
      setIsClosing(false);
    }, 280);
  };

  useEffect(() => {
    if (selectedTicket && ticketMessages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ticketMessages, selectedTicket]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedTicket && !isClosing) {
        handleCloseChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTicket, isClosing]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      return toast.error('Harap pilih file gambar (JPG, PNG, WEBP, GIF)');
    }
    if (file.size > 3 * 1024 * 1024) {
      return toast.error('Ukuran gambar maksimal 3MB');
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setTicketAttachment(reader.result);
      setTicketPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 w-fit"><Clock className="w-3 h-3" /> Menunggu Admin</span>;
      case 'in_progress':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 w-fit"><RefreshCw className="w-3 h-3 animate-spin" /> Diproses</span>;
      case 'resolved':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3" /> Selesai</span>;
      case 'closed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-800 text-zinc-400 border border-zinc-700 flex items-center gap-1 w-fit"><X className="w-3 h-3" /> Ditutup</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-800 text-zinc-400 w-fit">{status}</span>;
    }
  };

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'teknis': return 'Teknis Server';
      case 'pembayaran': return 'Pembayaran';
      case 'pertanyaan': return 'Pertanyaan';
      default: return 'Lainnya';
    }
  };

  const getPriorityBadge = (prio) => {
    switch (prio) {
      case 'high': return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">Tinggi</span>;
      case 'medium': return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Sedang</span>;
      default: return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">Rendah</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in py-2 relative">
      {/* Filter Bar Tanpa Card */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-zinc-800/60">
        {[
          { id: 'all', label: 'Semua' },
          { id: 'open', label: 'Menunggu Admin' },
          { id: 'in_progress', label: 'Diproses' },
          { id: 'resolved', label: 'Selesai' },
          { id: 'closed', label: 'Ditutup' }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setTicketFilter(filter.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              ticketFilter === filter.id 
                ? 'bg-white text-black shadow-md' 
                : 'bg-zinc-900/60 border border-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Tabel Flat Tanpa Card Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider bg-transparent font-semibold">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Pengguna</th>
              <th className="py-3 px-4">Subjek</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4">Prioritas</th>
              <th className="py-3 px-4">Server Terkait</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Pembaruan</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/40 text-sm">
            {tickets.filter(t => ticketFilter === 'all' || t.status === ticketFilter).length === 0 ? (
              <tr>
                <td colSpan="9" className="py-12 text-center text-zinc-500 text-sm">
                  Tidak ada tiket yang ditemukan untuk filter "{ticketFilter === 'all' ? 'Semua' : ticketFilter}".
                </td>
              </tr>
            ) : (
              tickets
                .filter(t => ticketFilter === 'all' || t.status === ticketFilter)
                .map(t => (
                  <tr key={t.id} className="hover:bg-zinc-900/30 transition">
                    <td className="py-4 px-4 font-mono text-xs font-bold text-zinc-500">#{t.id}</td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-white">{t.username}</div>
                      <div className="text-xs text-zinc-500">{t.email}</div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-white max-w-xs truncate">{t.subject}</td>
                    <td className="py-4 px-4 text-xs text-zinc-300">{getCategoryLabel(t.category)}</td>
                    <td className="py-4 px-4">{getPriorityBadge(t.priority)}</td>
                    <td className="py-4 px-4">
                      {t.serverName ? (
                        <span className="inline-flex items-center gap-1 text-xs text-zinc-300 bg-zinc-900/60 px-2 py-1 rounded border border-zinc-800/80">
                          <Server className="w-3 h-3 text-primary" /> {t.serverName} ({t.serverPort})
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-600">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(t.status)}</td>
                    <td className="py-4 px-4 text-xs text-zinc-500">
                      {t.updatedAt ? new Date(t.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-'}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleSelectAdminTicket(t)}
                        className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg transition border border-zinc-700 flex items-center gap-1.5 ml-auto"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-sky-400" /> Buka Chat
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* Slide-over Sidebar untuk Obrolan Tiket */}
      {selectedTicket && (
        <>
          {/* Backdrop Blur */}
          <div
            className={`fixed inset-0 bg-black/75 backdrop-blur-md z-[100] transition-opacity duration-300 ${
              isClosing ? 'opacity-0 animate-out fade-out' : 'animate-in fade-in'
            }`}
            onClick={handleCloseChat}
          />

          {/* Sidebar Drawer dari Kanan */}
          <div
            className={`fixed inset-y-0 right-0 z-[101] w-full sm:w-[550px] md:w-[650px] lg:w-[750px] bg-[#0c0c10] border-l border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col ${
              isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'
            }`}
          >
            {/* Header Sidebar */}
            <div className="p-5 bg-[#121218] border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={handleCloseChat}
                  className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition border border-zinc-800 shrink-0"
                  title="Tutup Panel Obrolan (ESC)"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-zinc-500 font-bold shrink-0">#{selectedTicket.id}</span>
                    <h2 className="text-base font-bold text-white truncate">{selectedTicket.subject}</h2>
                    <div className="shrink-0">{getPriorityBadge(selectedTicket.priority)}</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-zinc-400">
                    <span className="text-emerald-400 font-semibold">{getCategoryLabel(selectedTicket.category)}</span>
                    <span className="text-zinc-300">| User: <strong className="text-white">{selectedTicket.username}</strong></span>
                    {selectedTicket.serverName && (
                      <span className="inline-flex items-center gap-1 text-zinc-300 bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800 text-[11px]">
                        <Server className="w-3 h-3 text-primary shrink-0" /> {selectedTicket.serverName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <CustomSelect
                  value={selectedTicket.status}
                  onChange={(e) => handleUpdateAdminTicketStatus(selectedTicket.id, e.target.value)}
                >
                  <option value="open">Menunggu Admin</option>
                  <option value="in_progress">Diproses</option>
                  <option value="resolved">Selesai</option>
                  <option value="closed">Ditutup</option>
                </CustomSelect>
              </div>
            </div>

            {/* Area Chat / Pesan */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#0a0a0e]">
              {ticketMessages.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-sm">Belum ada percakapan dalam tiket ini.</div>
              ) : (
                ticketMessages.map((m) => {
                  const isAdmin = m.senderRole === 'admin';
                  return (
                    <div key={m.id} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'} animate-in fade-in`}>
                      <div className="flex items-center gap-2 mb-1 px-1">
                        <span className={`text-xs font-bold ${isAdmin ? 'text-indigo-400' : 'text-emerald-400'}`}>
                          {isAdmin ? '🛡️ Anda (Admin MCloud)' : `${m.senderUsername || selectedTicket.username} (Klien)`}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {m.createdAt ? new Date(m.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      
                      <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-md ${
                        isAdmin 
                          ? 'bg-[#181824] border border-indigo-500/20 text-zinc-100 rounded-tr-none' 
                          : 'bg-[#14231c] border border-emerald-500/20 text-emerald-50 rounded-tl-none'
                      }`}>
                        <p className="whitespace-pre-wrap break-words">{m.message}</p>
                        
                        {m.attachment && (
                          <div className="mt-3 relative group rounded-xl overflow-hidden border border-black/30 max-w-sm bg-black/40">
                            <img 
                              src={m.attachment} 
                              alt="Lampiran" 
                              className="w-full max-h-60 object-contain cursor-pointer transition transform group-hover:scale-105"
                              onClick={() => setLightboxImg(m.attachment)}
                            />
                            <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white flex items-center gap-1 pointer-events-none">
                              <Eye className="w-3 h-3" /> Klik untuk perbesar
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Footer Form Balasan */}
            <form onSubmit={handleSendAdminReply} className="p-4 bg-[#121218] border-t border-zinc-800/80 space-y-3 shrink-0">
              {ticketPreview && (
                <div className="relative inline-block bg-zinc-900 p-2 rounded-xl border border-zinc-800">
                  <img src={ticketPreview} alt="Preview" className="h-20 w-auto rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={() => { setTicketAttachment(null); setTicketPreview(null); }}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <label className="p-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl border border-zinc-800 cursor-pointer transition flex items-center justify-center shrink-0" title="Lampirkan Gambar">
                  <Paperclip className="w-5 h-5" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                </label>
                
                <input
                  type="text"
                  value={ticketReply}
                  onChange={(e) => setTicketReply(e.target.value)}
                  placeholder="Tulis balasan untuk klien..."
                  className="flex-1 bg-[#0a0a0e] border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 text-sm transition"
                />
                
                <button
                  type="submit"
                  disabled={sendingTicketReply || (!ticketReply.trim() && !ticketAttachment)}
                  className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition shadow-[0_0_15px_rgba(99,102,241,0.3)] disabled:opacity-50 flex items-center gap-2 shrink-0"
                >
                  {sendingTicketReply ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  <span className="hidden sm:inline">Kirim</span>
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
