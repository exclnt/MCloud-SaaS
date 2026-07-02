import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Konfirmasi', 
  cancelText = 'Batal', 
  isDanger = false 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#101010] border border-zinc-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-5 flex items-start gap-4">
          <div className={`p-3 rounded-lg shrink-0 ${isDanger ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1 pt-1">
            <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{message}</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="bg-[#0a0a0a] border-t border-zinc-800/60 p-4 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
          >
            {cancelText}
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition ${isDanger ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-primary hover:bg-primary-hover text-white'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
