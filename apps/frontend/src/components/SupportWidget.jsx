import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  MessageCircle, 
  Mail, 
  HelpCircle, 
  X, 
  Headphones, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef(null);
  const [settings, setSettings] = useState({
    social_discord: 'https://discord.gg/mcloud',
    social_whatsapp: 'https://wa.me/6281234567890',
    social_email: 'support@mcloud.id'
  });

  useEffect(() => {
    api.getSettings().then(res => {
      if (res) setSettings(prev => ({ ...prev, ...res }));
    }).catch(() => {});
  }, []);

  // Menutup popup saat klik di luar area widget
  useEffect(() => {
    function handleClickOutside(event) {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const supportChannels = [
    {
      id: 'discord',
      name: 'Komunitas Discord',
      description: 'Respon cepat dari admin & 5,000+ member',
      icon: MessageSquare,
      color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/40',
      badge: 'POPULER',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      href: settings.social_discord || 'https://discord.gg/mcloud',
      isExternal: true
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Support',
      description: 'Chat langsung dengan Customer Service',
      icon: MessageCircle,
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40',
      badge: '24/7 CS',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      href: settings.social_whatsapp || 'https://wa.me/6281234567890?text=Halo%20Tim%20MCloud,%20saya%20butuh%20bantuan%20terkait%20layanan%20server...',
      isExternal: true
    },
    {
      id: 'email',
      name: 'Email & Tiket Bantuan',
      description: 'Untuk kendala penagihan & teknis mendalam',
      icon: Mail,
      color: 'bg-sky-500/10 text-sky-400 border-sky-500/20 group-hover:bg-sky-500/20 group-hover:border-sky-500/40',
      href: (settings.social_email || 'support@mcloud.id').startsWith('mailto:') ? settings.social_email : `mailto:${settings.social_email}`,
      isExternal: true
    },
    {
      id: 'docs',
      name: 'Panduan & Dokumentasi',
      description: 'Tutorial setup plugin, modpack, & konsol',
      icon: HelpCircle,
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/20 group-hover:bg-amber-500/20 group-hover:border-amber-500/40',
      to: '/docs',
      isExternal: false
    }
  ];

  return (
    <div ref={widgetRef} className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Popover / Modal Support */}
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 rounded-2xl bg-[#0f0f13] border border-zinc-800 shadow-2xl overflow-hidden transition-all duration-200 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="relative p-5 bg-[#141418] border-b border-zinc-800/80">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <img 
                  src="/alex.png" 
                  alt="Alex" 
                  className="w-10 h-10 rounded-full border border-zinc-700 object-cover bg-zinc-900" 
                />
                <div>
                  <h3 className="font-bold text-white text-sm tracking-wide">
                    Pusat Bantuan MCloud
                  </h3>
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                    Online 24/7 Support
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition"
                aria-label="Tutup menu bantuan"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Tim support MCloud & komunitas siap membantu menjawab kendala Anda kapan pun.
            </p>
          </div>

          {/* List Channels */}
          <div className="p-3 space-y-2 max-h-[380px] overflow-y-auto bg-[#0f0f13]">
            {supportChannels.map((channel) => {
              const Icon = channel.icon;
              const content = (
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/70 border border-zinc-800/60 hover:border-zinc-700 transition-all duration-150 group cursor-pointer">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`p-2.5 rounded-xl border transition-colors ${channel.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white group-hover:text-indigo-300 transition-colors truncate">
                          {channel.name}
                        </span>
                        {channel.badge && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border tracking-wider uppercase ${channel.badgeColor}`}>
                            {channel.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">
                        {channel.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-zinc-500 group-hover:text-white transition-colors pl-2">
                    {channel.isExternal ? (
                      <ExternalLink className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                </div>
              );

              if (channel.isExternal) {
                return (
                  <a
                    key={channel.id}
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="block"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link
                  key={channel.id}
                  to={channel.to}
                  onClick={() => setIsOpen(false)}
                  className="block"
                >
                  {content}
                </Link>
              );
            })}
          </div>

          {/* Footer Info */}
          <div className="px-4 py-3 bg-[#0a0a0d] border-t border-zinc-800/80 text-center">
            <span className="text-[11px] text-zinc-500 flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
              Customer Service Online (08:00 - 24:00 WIB)
            </span>
          </div>
        </div>
      )}

      {/* Tombol Bantuan Melayang - Cukup Gambar Alex Saja */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group focus:outline-none transition-transform hover:scale-110 active:scale-95 duration-200"
        aria-label="Bantuan dan Dukungan MCloud"
        title="Pusat Bantuan MCloud"
      >
        <div className="relative">
          <img 
            src="/alex.png" 
            alt="Bantuan MCloud" 
            className={`w-16 h-16 rounded-full object-cover shadow-2xl transition-transform ${
              isOpen ? 'scale-95' : ''
            }`}
          />
          {!isOpen && (
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0a0a0a]"></span>
          )}
        </div>
      </button>
    </div>
  );
}
