import React from 'react';
import { Server, Cpu, Database, Cloud, Shield, Activity } from 'lucide-react';

export function DataLoading({ text = 'Memuat data...', inline = false, size = 'md' }) {
  if (inline) {
    return (
      <div className="flex items-center justify-center gap-3 py-6 px-4 bg-zinc-900/40 border border-zinc-800/60 rounded-xl animate-fade-in w-full">
        <div className="relative flex items-center justify-center w-6 h-6 shrink-0">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin"></div>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
        </div>
        <span className="text-sm font-medium text-zinc-300 tracking-wide flex items-center gap-1">
          {text}
          <span className="inline-flex gap-0.5 ml-1">
            <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </span>
        </span>
      </div>
    );
  }

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <div className="w-full flex items-center justify-center py-12 px-4 animate-fade-in">
      <div className={`relative flex flex-col items-center justify-center bg-[#101010]/90 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-8 sm:p-10 max-w-md w-full text-center shadow-[0_0_50px_rgba(16,185,129,0.08)] ${isSmall ? 'p-6' : ''}`}>
        
        {/* Ambient Glow Background */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* 3D Core Animated Spinner */}
        <div className={`relative flex items-center justify-center mb-6 ${isSmall ? 'w-14 h-14' : isLarge ? 'w-24 h-24' : 'w-20 h-20'}`}>
          {/* Outer Rotating Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/40 animate-[spin_6s_linear_infinite]"></div>
          
          {/* Middle Fast Rotating Gradient Ring */}
          <div className="absolute inset-1 rounded-full border-2 border-transparent border-t-primary border-r-emerald-400/80 animate-[spin_1.5s_cubic-bezier(0.68,-0.55,0.26,1.55)_infinite] shadow-[0_0_15px_rgba(16,185,129,0.3)]"></div>
          
          {/* Inner Reverse Rotating Ring */}
          <div className="absolute inset-3 rounded-full border border-blue-400/30 border-b-blue-400 animate-[spin_2s_linear_infinite_reverse]"></div>

          {/* Center Glowing Server Core Icon */}
          <div className="relative z-10 w-10 h-10 bg-zinc-900/90 border border-primary/50 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)] transform transition hover:scale-105">
            <Server className="w-5 h-5 text-primary animate-pulse" />
          </div>
        </div>

        {/* Typography */}
        <h3 className="text-base sm:text-lg font-bold text-white mb-1 tracking-wide">
          Memuat Sistem
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xs leading-relaxed flex items-center justify-center gap-1">
          {text}
          <span className="inline-flex gap-0.5 ml-1">
            <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </span>
        </p>

        {/* Decorative Status Bar */}
        <div className="w-32 h-1 bg-zinc-800/80 rounded-full mt-6 overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent animate-[shimmer_1.5s_infinite]"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonServerRow({ count = 3, className = '' }) {
  return (
    <div className={`space-y-4 animate-fade-in ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="relative overflow-hidden bg-[#101010] border border-zinc-800/60 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 shadow-lg"
        >
          {/* Shimmer Overlay */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none"></div>

          {/* Left Status Bar Placeholder */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-800"></div>

          <div className="flex items-center gap-4 pl-2">
            <div className="w-12 h-12 bg-zinc-900 rounded-lg border border-zinc-800/80 animate-pulse flex items-center justify-center shrink-0">
              <div className="w-6 h-6 rounded bg-zinc-800 animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <div className="w-36 h-4 bg-zinc-800 rounded-md animate-pulse"></div>
                <div className="w-20 h-4 bg-zinc-800/60 rounded-md animate-pulse"></div>
                <div className="w-16 h-4 bg-zinc-800/40 rounded-md animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-3 bg-zinc-900 rounded-md animate-pulse"></div>
                <div className="w-28 h-3 bg-zinc-900 rounded-md animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end border-t sm:border-0 pt-3 sm:pt-0 border-zinc-800/60">
            <div className="w-24 h-8 bg-zinc-900 border border-zinc-800 rounded-lg animate-pulse"></div>
            <div className="w-20 h-8 bg-zinc-900 rounded-lg animate-pulse"></div>
            <div className="w-28 h-8 bg-zinc-800/50 rounded-lg animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonPublicServer({ count = 6, className = '' }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-fade-in ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="bg-[#101010] border border-zinc-800/60 rounded-xl p-5 flex flex-col h-full relative overflow-hidden shadow-lg"
        >
          {/* Shimmer Overlay */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none"></div>

          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 animate-pulse shrink-0"></div>
              <div className="space-y-1.5">
                <div className="w-6 h-2.5 bg-zinc-800/60 rounded animate-pulse"></div>
                <div className="w-32 h-4 bg-zinc-800 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="w-14 h-4 bg-zinc-900 rounded-full animate-pulse"></div>
          </div>

          <div className="flex-1 bg-zinc-950/50 rounded-lg p-3 mb-4 border border-zinc-900 space-y-2">
            <div className="w-full h-3 bg-zinc-900 rounded animate-pulse"></div>
            <div className="w-2/3 h-3 bg-zinc-900 rounded animate-pulse"></div>
            <div className="w-1/3 h-2.5 bg-zinc-900/60 rounded animate-pulse mt-3"></div>
          </div>

          <div className="flex gap-2 mb-4 flex-wrap">
            <div className="w-20 h-5 bg-zinc-900 border border-zinc-800/80 rounded animate-pulse"></div>
            <div className="w-24 h-5 bg-zinc-900 border border-zinc-800/80 rounded animate-pulse"></div>
            <div className="w-16 h-5 bg-zinc-900 border border-zinc-800/80 rounded animate-pulse"></div>
          </div>

          <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 mt-auto">
            <div className="w-32 h-3.5 bg-zinc-800 rounded animate-pulse"></div>
            <div className="w-4 h-4 bg-zinc-800 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonPricingCard({ count = 4, className = '' }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-sm md:max-w-none mx-auto animate-fade-in ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="relative bg-[#101010] border border-zinc-800/60 p-8 rounded-xl flex flex-col overflow-hidden shadow-lg">
          {/* Shimmer Overlay */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none"></div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0 animate-pulse"></div>
            <div className="space-y-2 flex-1">
              <div className="w-24 h-5 bg-zinc-800 rounded animate-pulse"></div>
              <div className="w-32 h-3 bg-zinc-900 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-6 border-b border-zinc-800/60 pb-6">
            <div className="w-36 h-9 bg-zinc-800 rounded animate-pulse"></div>
            <div className="w-12 h-4 bg-zinc-900 rounded animate-pulse"></div>
          </div>

          <ul className="space-y-4 mb-8 flex-1">
            {Array.from({ length: 4 }).map((_, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-zinc-900 border border-zinc-800 shrink-0 animate-pulse"></div>
                <div className="w-full h-3.5 bg-zinc-900 rounded animate-pulse"></div>
              </li>
            ))}
          </ul>

          <div className="w-full h-12 bg-zinc-900 border border-zinc-800 rounded-md animate-pulse"></div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonCheckoutCard({ className = '' }) {
  return (
    <div className={`animate-fade-in relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none"></div>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0 animate-pulse"></div>
        <div className="space-y-2">
          <div className="w-32 h-6 bg-zinc-800 rounded animate-pulse"></div>
          <div className="w-48 h-3.5 bg-zinc-900 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-6 border-b border-zinc-800/60 pb-6">
        <div className="w-36 h-8 bg-zinc-800 rounded animate-pulse"></div>
        <div className="w-16 h-4 bg-zinc-900 rounded animate-pulse"></div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="w-full h-4 bg-zinc-900 rounded animate-pulse"></div>
        <div className="w-3/4 h-4 bg-zinc-900 rounded animate-pulse"></div>
        <div className="w-5/6 h-3 bg-zinc-900/60 rounded animate-pulse mt-4"></div>
      </div>
    </div>
  );
}

export function SkeletonCard({ count = 3, className = '' }) {
  return <SkeletonServerRow count={count} className={className} />;
}

export function SkeletonTable({ rows = 5, columns = 4, className = '' }) {
  return (
    <div className={`w-full bg-[#101010] border border-zinc-800/60 rounded-xl overflow-hidden shadow-lg animate-fade-in ${className}`}>
      {/* Table Header */}
      <div className="p-4 bg-zinc-900/50 border-b border-zinc-800/60 flex items-center justify-between gap-4">
        {Array.from({ length: columns }).map((_, colIdx) => (
          <div 
            key={colIdx} 
            className={`h-3 bg-zinc-800 rounded-md animate-pulse ${colIdx === 0 ? 'w-1/4' : colIdx === columns - 1 ? 'w-16 ml-auto' : 'w-1/6'}`}
          />
        ))}
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-zinc-800/40">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="relative overflow-hidden p-4 flex items-center justify-between gap-4 hover:bg-zinc-900/20 transition">
            {/* Shimmer Overlay */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none"></div>

            {Array.from({ length: columns }).map((_, colIdx) => {
              // Vary widths slightly for realistic look
              const widths = ['w-32', 'w-24', 'w-20', 'w-16', 'w-28'];
              const widthClass = colIdx === 0 ? 'w-1/4 sm:w-48' : colIdx === columns - 1 ? 'w-20 ml-auto' : widths[(rowIdx + colIdx) % widths.length];

              return (
                <div key={colIdx} className="flex items-center gap-3">
                  {colIdx === 0 && (
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0 animate-pulse"></div>
                  )}
                  <div className={`h-3.5 bg-zinc-800/80 rounded-md animate-pulse ${widthClass}`} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
