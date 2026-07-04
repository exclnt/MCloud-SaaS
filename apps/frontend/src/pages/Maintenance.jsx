import React, { useState, useEffect } from 'react';
import { RefreshCw, ArrowRight, Lock, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function Maintenance({ settings }) {
  const [isChecking, setIsChecking] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const title = settings?.maintenance_title || 'Pemeliharaan Sistem MCloud';
  const message = settings?.maintenance_message || 'Kami sedang melakukan pemeliharaan rutin untuk meningkatkan performa dan stabilitas server. Silakan kembali dalam beberapa saat.';
  const eta = settings?.maintenance_eta || 'Segera';

  const handleManualCheck = async () => {
    setIsChecking(true);
    try {
      const res = await api.getSettings();
      if (res && res.maintenance_mode !== 'true') {
        window.location.reload();
      }
    } catch (e) {
      // ignore error
    } finally {
      setIsChecking(false);
      setCountdown(30);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleManualCheck();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    const autoCheck = setInterval(async () => {
      try {
        const res = await api.getSettings();
        if (res && res.maintenance_mode !== 'true') {
          window.location.reload();
        }
      } catch (e) {}
    }, 3000);

    window.addEventListener('settingsUpdated', handleManualCheck);

    return () => {
      clearInterval(timer);
      clearInterval(autoCheck);
      window.removeEventListener('settingsUpdated', handleManualCheck);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6 relative selection:bg-amber-500/20 selection:text-amber-300 font-sans">
      {/* Minimalist Top Spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.07),rgba(255,255,255,0))] pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10 text-center animate-fade-in my-auto">
        {/* Sleek Minimalist Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800/80 text-zinc-400 text-[11px] font-medium tracking-wide mb-8 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          <span>SYSTEM MAINTENANCE</span>
        </div>

        {/* Clean Typography Title */}
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-100 mb-3 leading-snug">
          {title}
        </h1>

        {/* Crisp Subtitle */}
        <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-8 font-normal">
          {message}
        </p>

        {/* Minimalist Info Card */}
        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-4 mb-6 backdrop-blur-md text-left shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
            <div className="flex items-center gap-2 text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-[11px] font-medium uppercase tracking-wider">Estimasi Selesai</span>
            </div>
            <span className="text-xs font-mono font-semibold text-zinc-200">{eta}</span>
          </div>

          <div className="flex items-center justify-between pt-3">
            <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Auto-refresh</span>
            <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
              <span className="inline-block w-1 h-1 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-zinc-300 font-semibold">{countdown}s</span>
            </div>
          </div>
        </div>

        {/* Sleek Minimal Action Button */}
        <button
          onClick={handleManualCheck}
          disabled={isChecking}
          className="w-full py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
          <span>{isChecking ? 'Memeriksa status...' : 'Coba muat ulang sekarang'}</span>
        </button>
      </div>

      {/* Minimalist Footer Link */}
      <div className="mt-auto pt-6 text-[11px] text-zinc-600 flex items-center justify-center gap-1.5">
        <Lock className="w-3 h-3 text-zinc-700" />
        <span>Administrator?</span>
        <Link
          to="/login"
          className="text-zinc-500 hover:text-zinc-300 transition-colors font-medium flex items-center gap-0.5 underline underline-offset-4"
        >
          <span>Masuk</span>
          <ArrowRight className="w-2.5 h-2.5" />
        </Link>
      </div>
    </div>
  );
}
