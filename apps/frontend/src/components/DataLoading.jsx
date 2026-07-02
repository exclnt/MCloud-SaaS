import React from 'react';

export function DataLoading({ text = 'Memuat data...', inline = false, size = 'md' }) {
  if (inline) {
    return (
      <div className="flex items-center justify-center gap-2.5 py-4 w-full animate-fade-in">
        <div className="w-4 h-4 rounded-full border-2 border-zinc-800 border-t-primary animate-spin shrink-0"></div>
        <span className="text-xs font-medium text-zinc-400 tracking-wide">{text}</span>
      </div>
    );
  }

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <div className="w-full flex flex-col items-center justify-center py-12 px-4 animate-fade-in gap-3.5">
      <div className={`relative flex items-center justify-center ${isSmall ? 'w-8 h-8' : isLarge ? 'w-12 h-12' : 'w-10 h-10'}`}>
        <div className="absolute inset-0 rounded-full border-2 border-zinc-800/80 border-t-primary border-r-primary/40 animate-spin shadow-[0_0_15px_rgba(16,185,129,0.2)]"></div>
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
      </div>
      <span className="text-sm font-medium text-zinc-400 tracking-wide">
        {text}
      </span>
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
