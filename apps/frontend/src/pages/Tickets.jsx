import { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Plus, Loader2, Send, Paperclip, X, Eye, 
  CheckCircle2, AlertCircle, Clock, Shield, User, HelpCircle, 
  Server, ArrowLeft, RefreshCw, Image as ImageIcon, Check
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { SkeletonTable } from '../components/DataLoading';

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Modal Buat Tiket
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'teknis',
    priority: 'medium',
    serverId: '',
    message: '',
    attachment: null
  });
  const [previewImg, setPreviewImg] = useState(null);

  // Form Balasan Chat
  const [replyText, setReplyText] = useState('');
  const [replyAttachment, setReplyAttachment] = useState(null);
  const [replyPreview, setReplyPreview] = useState(null);
  const [sendingReply, setSendingReply] = useState(false);

  // Fullscreen Image Preview Modal
  const [lightboxImg, setLightboxImg] = useState(null);

  const chatEndRef = useRef(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.getTickets();
      setTickets(res || []);
    } catch (err) {
      toast.error(err.message || 'Gagal memuat daftar tiket');
    } finally {
      setLoading(false);
    }
  };

  const fetchServers = async () => {
    try {
      const res = await api.getServers();
      setServers(res || []);
    } catch (err) {}
  };

  useEffect(() => {
    document.title = 'Tiket Bantuan - MCloud';
    fetchTickets();
    fetchServers();
  }, []);

  useEffect(() => {
    if (selectedTicket && messages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSelectTicket = async (ticket) => {
    setSelectedTicket(ticket);
    setLoadingMessages(true);
    try {
      const res = await api.getTicketById(ticket.id);
      setSelectedTicket(res.ticket);
      setMessages(res.messages || []);
    } catch (err) {
      toast.error(err.message || 'Gagal memuat detail tiket');
      setSelectedTicket(null);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Convert File to Base64 Data URL
  const handleFileChange = (e, setAttachment, setPreview) => {
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
      setAttachment(reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newTicket.subject.trim() || !newTicket.message.trim()) {
      return toast.error('Judul dan pesan kendala wajib diisi');
    }
    setCreating(true);
    try {
      await api.createTicket(newTicket);
      toast.success('Tiket berhasil dibuat!');
      setShowCreateModal(false);
      setNewTicket({ subject: '', category: 'teknis', priority: 'medium', serverId: '', message: '', attachment: null });
      setPreviewImg(null);
      fetchTickets();
    } catch (err) {
      toast.error(err.message || 'Gagal membuat tiket');
    } finally {
      setCreating(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() && !replyAttachment) return;
    setSendingReply(true);
    try {
      const newMsg = await api.replyTicket(selectedTicket.id, {
        message: replyText || ' [Lampiran Gambar] ',
        attachment: replyAttachment
      });
      setMessages(prev => [...prev, newMsg]);
      setReplyText('');
      setReplyAttachment(null);
      setReplyPreview(null);
      
      // Update local ticket status to open if it was closed/resolved
      if (selectedTicket.status === 'resolved' || selectedTicket.status === 'closed') {
        setSelectedTicket(prev => ({ ...prev, status: 'open' }));
        setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, status: 'open' } : t));
      }
    } catch (err) {
      toast.error(err.message || 'Gagal mengirim balasan');
    } finally {
      setSendingReply(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!selectedTicket) return;
    try {
      await api.updateTicketStatus(selectedTicket.id, 'closed');
      toast.success('Tiket telah ditutup');
      setSelectedTicket(prev => ({ ...prev, status: 'closed' }));
      setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, status: 'closed' } : t));
    } catch (err) {
      toast.error(err.message || 'Gagal menutup tiket');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1"><Clock className="w-3 h-3" /> Menunggu Admin</span>;
      case 'in_progress':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin" /> Diproses</span>;
      case 'resolved':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Selesai</span>;
      case 'closed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-800 text-zinc-400 border border-zinc-700 flex items-center gap-1"><X className="w-3 h-3" /> Ditutup</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-800 text-zinc-400">{status}</span>;
    }
  };

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'teknis': return 'Kendala Teknis Server';
      case 'pembayaran': return 'Penagihan & Pembayaran';
      case 'pertanyaan': return 'Pertanyaan Umum';
      default: return 'Lainnya';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-primary" /> Pusat Tiket Bantuan
            </h1>
            <p className="text-zinc-400 mt-1 text-sm md:text-base">
              Ajukan tiket dukungan teknis untuk mendapatkan bantuan langsung dari Admin MCloud.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0"
          >
            <Plus className="w-5 h-5" /> Buat Tiket Baru
          </button>
        </div>

        {selectedTicket ? (
          /* Tampilan Detail Tiket & Chat */
          <div className="bg-[#101010] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[700px] animate-fade-in">
            {/* Header Ticket */}
            <div className="p-5 bg-[#141418] border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
                  title="Kembali ke daftar tiket"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-zinc-500 font-bold">#{selectedTicket.id}</span>
                    <h2 className="text-lg font-bold text-white tracking-wide">{selectedTicket.subject}</h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-zinc-400">
                    <span className="text-emerald-400 font-semibold">{getCategoryLabel(selectedTicket.category)}</span>
                    {selectedTicket.serverName && (
                      <span className="flex items-center gap-1 text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                        <Server className="w-3 h-3 text-primary" /> {selectedTicket.serverName}
                      </span>
                    )}
                    <span>• {selectedTicket.createdAt ? new Date(selectedTicket.createdAt).toLocaleString('id-ID') : ''}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(selectedTicket.status)}
                {selectedTicket.status !== 'closed' && (
                  <button
                    onClick={handleCloseTicket}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-red-500/20 text-zinc-300 hover:text-red-400 border border-zinc-700 hover:border-red-500/30 text-xs font-bold transition"
                  >
                    Tutup Tiket
                  </button>
                )}
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#0c0c0f]">
              {loadingMessages ? (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm">Memuat riwayat percakapan...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-sm">Belum ada pesan dalam percakapan ini.</div>
              ) : (
                messages.map((m) => {
                  const isAdmin = m.senderRole === 'admin';
                  return (
                    <div key={m.id} className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'} animate-in fade-in`}>
                      <div className="flex items-center gap-2 mb-1 px-1">
                        <span className={`text-xs font-bold ${isAdmin ? 'text-indigo-400' : 'text-emerald-400'}`}>
                          {isAdmin ? '🛡️ Admin Support MCloud' : (m.senderUsername || 'Anda')}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {m.createdAt ? new Date(m.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      
                      <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-4 text-sm leading-relaxed shadow-md ${
                        isAdmin 
                          ? 'bg-[#181824] border border-indigo-500/20 text-zinc-100 rounded-tl-none' 
                          : 'bg-[#14231c] border border-emerald-500/20 text-emerald-50 rounded-tr-none'
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

            {/* Chat Input */}
            {selectedTicket.status === 'closed' ? (
              <div className="p-4 bg-[#141418] border-t border-zinc-800 text-center text-zinc-500 text-sm">
                Tiket ini telah ditutup. Anda tidak dapat mengirim pesan balasan lagi.
              </div>
            ) : (
              <form onSubmit={handleSendReply} className="p-4 bg-[#141418] border-t border-zinc-800/80 space-y-3">
                {replyPreview && (
                  <div className="relative inline-block bg-zinc-900 p-2 rounded-xl border border-zinc-800">
                    <img src={replyPreview} alt="Preview" className="h-20 w-auto rounded-lg object-cover" />
                    <button
                      type="button"
                      onClick={() => { setReplyAttachment(null); setReplyPreview(null); }}
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
                      onChange={(e) => handleFileChange(e, setReplyAttachment, setReplyPreview)}
                    />
                  </label>
                  
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Tulis pesan balasan atau pertanyaan untuk Admin..."
                    className="flex-1 bg-[#0a0a0d] border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-primary text-sm transition"
                  />
                  
                  <button
                    type="submit"
                    disabled={sendingReply || (!replyText.trim() && !replyAttachment)}
                    className="px-5 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50 flex items-center gap-2 shrink-0"
                  >
                    {sendingReply ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span className="hidden sm:inline">Kirim</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* Daftar Tiket */
          <div className="bg-[#101010] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" /> Daftar Tiket Anda
              </h2>
              <button 
                onClick={fetchTickets}
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
                title="Refresh Daftar"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {loading ? (
              <div className="p-6">
                <SkeletonTable rows={4} columns={5} className="border border-zinc-800/80 rounded-xl" />
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-3">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                  <HelpCircle className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-white text-base">Belum Ada Tiket Bantuan</h3>
                <p className="text-sm text-zinc-400 max-w-sm mx-auto">
                  Jika Anda mengalami masalah teknis server atau pembayaran, silakan buat tiket baru agar Admin dapat membantu.
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white font-bold text-sm rounded-lg transition"
                >
                  <Plus className="w-4 h-4" /> Buat Tiket Sekarang
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/50 text-xs text-zinc-400 uppercase font-bold tracking-wider">
                      <th className="py-3.5 px-6">ID / Judul Kendala</th>
                      <th className="py-3.5 px-6">Kategori</th>
                      <th className="py-3.5 px-6">Server Terkait</th>
                      <th className="py-3.5 px-6">Pembaruan Terakhir</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-sm">
                    {tickets.map((t) => (
                      <tr 
                        key={t.id} 
                        onClick={() => handleSelectTicket(t)}
                        className="hover:bg-zinc-900/50 transition-colors cursor-pointer group"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-zinc-500 font-bold">#{t.id}</span>
                            <span className="font-bold text-white group-hover:text-primary transition-colors">{t.subject}</span>
                            {t.attachment && <ImageIcon className="w-3.5 h-3.5 text-zinc-500 shrink-0" title="Ada lampiran gambar" />}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-zinc-300 font-medium">
                          {getCategoryLabel(t.category)}
                        </td>
                        <td className="py-4 px-6">
                          {t.serverName ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300">
                              <Server className="w-3 h-3 text-primary" /> {t.serverName}
                            </span>
                          ) : (
                            <span className="text-zinc-500 text-xs">-</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-xs text-zinc-400">
                          {t.updatedAt ? new Date(t.updatedAt).toLocaleString('id-ID') : '-'}
                        </td>
                        <td className="py-4 px-6">
                          {getStatusBadge(t.status)}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 group-hover:bg-primary group-hover:text-white text-zinc-300 text-xs font-bold transition">
                            Buka Chat <Eye className="w-3.5 h-3.5" />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal Buat Tiket Baru */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#101014] border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 bg-[#141418] border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" /> Buat Tiket Bantuan Baru
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-zinc-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Judul / Pokok Kendala</label>
                <input
                  type="text"
                  required
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  placeholder="Contoh: Server Minecraft tidak bisa di-start setelah ganti RAM"
                  className="w-full bg-[#16161a] border border-zinc-800 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-primary text-sm transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Kategori Masalah</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                    className="w-full bg-[#16161a] border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary text-sm transition"
                  >
                    <option value="teknis">Kendala Teknis Server</option>
                    <option value="pembayaran">Penagihan & Pembayaran</option>
                    <option value="pertanyaan">Pertanyaan Umum</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Server Terkait (Opsional)</label>
                  <select
                    value={newTicket.serverId}
                    onChange={(e) => setNewTicket({ ...newTicket, serverId: e.target.value })}
                    className="w-full bg-[#16161a] border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary text-sm transition"
                  >
                    <option value="">-- Pilih Server --</option>
                    {servers.map(s => (
                      <option key={s.id} value={s.id}>{s.name} (Port: {s.port})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Deskripsi Detail Kendala</label>
                <textarea
                  required
                  rows="4"
                  value={newTicket.message}
                  onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                  placeholder="Jelaskan secara detail masalah yang Anda hadapi, langkah yang sudah dicoba, atau pesan error yang muncul..."
                  className="w-full bg-[#16161a] border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-primary text-sm transition resize-none"
                ></textarea>
              </div>

              {/* Upload Gambar / Screenshot */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Lampiran Screenshot Error (Opsional, Maks 3MB)
                </label>
                
                {previewImg ? (
                  <div className="relative bg-zinc-900 p-3 rounded-xl border border-zinc-800 flex items-center gap-4">
                    <img src={previewImg} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-zinc-700" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Gambar siap dilampirkan
                      </p>
                      <p className="text-[11px] text-zinc-500 mt-0.5 truncate">Format terkompresi Base64</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setNewTicket({ ...newTicket, attachment: null }); setPreviewImg(null); }}
                      className="p-1.5 bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-lg transition"
                      title="Hapus gambar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-zinc-800 hover:border-primary/50 rounded-xl bg-zinc-900/40 hover:bg-zinc-900 cursor-pointer transition text-center">
                    <ImageIcon className="w-6 h-6 text-zinc-500 mb-1" />
                    <span className="text-xs font-semibold text-zinc-300">Klik untuk upload gambar / screenshot error</span>
                    <span className="text-[10px] text-zinc-500 mt-0.5">JPG, PNG, WEBP atau GIF</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleFileChange(e, (val) => setNewTicket({ ...newTicket, attachment: val }), setPreviewImg)}
                    />
                  </label>
                )}
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm transition shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2 disabled:opacity-50"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Kirim Tiket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal untuk Fullscreen Image Preview */}
      {lightboxImg && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setLightboxImg(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] flex items-center justify-center">
            <img src={lightboxImg} alt="Preview Fullscreen" className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-zinc-800" />
            <button 
              onClick={() => setLightboxImg(null)}
              className="absolute -top-4 -right-4 p-2 bg-zinc-900 border border-zinc-700 hover:bg-red-500 text-white rounded-full shadow-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
