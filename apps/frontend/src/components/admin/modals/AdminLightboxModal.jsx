import React from 'react';
import { X } from 'lucide-react';

export default function AdminLightboxModal({ lightboxImg, onClose }) {
  if (!lightboxImg) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in" 
      onClick={onClose}
    >
      <div className="relative max-w-5xl max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <img 
          src={lightboxImg} 
          alt="Preview Fullscreen" 
          className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-zinc-700" 
        />
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 p-2.5 bg-zinc-900/90 hover:bg-red-500 text-zinc-300 hover:text-white rounded-full transition shadow-lg border border-zinc-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
