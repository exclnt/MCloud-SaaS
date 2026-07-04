import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  MessageCircle,
  Mail,
  Headphones,
  ExternalLink,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { api } from "../services/api";

export default function Footer() {
  const [settings, setSettings] = useState({
    social_discord: "https://discord.gg/mcloud",
    social_whatsapp: "https://wa.me/6281234567890",
    social_instagram: "https://instagram.com/mcloud.id",
    social_twitter: "https://x.com/mcloud_id",
    social_email: "support@mcloud.id",
  });

  useEffect(() => {
    api
      .getSettings()
      .then((res) => {
        if (res) setSettings((prev) => ({ ...prev, ...res }));
      })
      .catch(() => {});
  }, []);

  const socialLinks = [
    {
      name: "Discord",
      href: settings.social_discord || "https://discord.gg/mcloud",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      ),
      hoverClass:
        "hover:bg-[#5865F2] hover:text-white hover:border-[#5865F2]/50",
    },
    {
      name: "WhatsApp",
      href: settings.social_whatsapp || "https://wa.me/6281234567890",
      icon: <MessageCircle className="w-4 h-4" />,
      hoverClass:
        "hover:bg-emerald-600 hover:text-white hover:border-emerald-500/50",
    },
    {
      name: "Instagram",
      href: settings.social_instagram || "https://instagram.com/mcloud.id",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      hoverClass: "hover:bg-pink-600 hover:text-white hover:border-pink-500/50",
    },
    {
      name: "X (Twitter)",
      href: settings.social_twitter || "https://x.com/mcloud_id",
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      hoverClass: "hover:bg-zinc-800 hover:text-white hover:border-zinc-600",
    },
    {
      name: "Email Support",
      href: (settings.social_email || "support@mcloud.id").startsWith("mailto:")
        ? settings.social_email
        : `mailto:${settings.social_email}`,
      icon: <Mail className="w-4 h-4" />,
      hoverClass: "hover:bg-sky-600 hover:text-white hover:border-sky-500/50",
    },
  ];

  return (
    <footer className="border-t border-zinc-800/80 bg-[#0a0a0a] mt-auto font-sans">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-zinc-800/60">
          {/* Kolom Kiri: Brand & Sosial Media */}
          <div className="md:col-span-4 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 flex items-center justify-center">
                <img
                  src="/creep.png"
                  alt="MCloud"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <span className="font-bold text-white text-lg tracking-wide">
                MCloud<span className="text-emerald-500">.</span>
              </span>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed pr-4">
              Platform hosting server Minecraft premium terdepan di Indonesia.
              Ditenagai prosesor berkecepatan tinggi, perlindungan Anti-DDoS
              berlapis, dan dukungan teknis 24/7.
            </p>

            {/* Deretan Sosial Media */}
            <div>
              <span className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3">
                Ikuti Komunitas Kami
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    title={social.name}
                    className={`w-9 h-9 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 flex items-center justify-center transition-all duration-200 ${social.hoverClass}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Kolom Tengah & Kanan: Navigasi & Support */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Layanan */}
            <div>
              <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                {/* <Zap className="w-3.5 h-3.5 text-emerald-400" /> */}
                Layanan
              </h4>
              <ul className="space-y-2.5 text-xs text-zinc-400">
                <li>
                  <Link
                    to="/pricing"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    Hosting Minecraft{" "}
                    <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded font-bold">
                      PRO
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="hover:text-white transition-colors"
                  >
                    Server Dedicated
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="hover:text-white transition-colors"
                  >
                    BungeeCord & Proxy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="hover:text-white transition-colors"
                  >
                    Modpack Installer
                  </Link>
                </li>
                <li>
                  <Link
                    to="/changelog"
                    className="hover:text-zinc-400 transition-colors flex items-center gap-1"
                  >
                    Changelog <span className="text-[9px] px-1.5 py-0.2 bg-zinc-500/20 text-zinc-400 rounded font-bold">v1.5.0</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Bantuan & Support */}
            <div>
              <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                {/* <Headphones className="w-3.5 h-3.5 text-indigo-400" /> */}
                Bantuan & Support
              </h4>
              <ul className="space-y-2.5 text-xs text-zinc-400">
                <li>
                  <a
                    href={
                      settings.social_discord || "https://discord.gg/mcloud"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-400 transition-colors flex items-center gap-1"
                  >
                    Komunitas Discord{" "}
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </li>
                <li>
                  <a
                    href={
                      settings.social_whatsapp || "https://wa.me/6281234567890"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                  >
                    WhatsApp Support 24/7{" "}
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </li>
                <li>
                  <a
                    href={
                      (settings.social_email || "support@mcloud.id").startsWith(
                        "mailto:",
                      )
                        ? settings.social_email
                        : `mailto:${settings.social_email}`
                    }
                    className="hover:text-sky-400 transition-colors"
                  >
                    Tiket & Email CS
                  </a>
                </li>
                <li>
                  <Link
                    to="/docs"
                    className="hover:text-white transition-colors"
                  >
                    Panduan & Tutorial
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="hover:text-amber-400 transition-colors"
                  >
                    Tanya Jawab (FAQ)
                  </Link>
                </li>
              </ul>
            </div>

            {/* Sumber Daya */}
            <div>
              <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                {/* <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> */}
                Legal & Privasi
              </h4>
              <ul className="space-y-2.5 text-xs text-zinc-400">
                <li>
                  <Link
                    to="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Syarat & Ketentuan
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <span className="text-zinc-500 cursor-not-allowed">
                    Status Server (Online 99.9%)
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright & Badge Bawah */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            © {new Date().getFullYear()} MCloud Hosting. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              All Systems Operational
            </span>
            <span>•</span>
            <span>
              Created by{" "}
              <a
                href="https://ekoramadani.my.id"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Eko Ramadani
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
