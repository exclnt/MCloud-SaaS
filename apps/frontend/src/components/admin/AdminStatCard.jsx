import React from 'react';

export default function AdminStatCard({
  title,
  value,
  subtitle,
  icon,
  valueClassName = "text-2xl font-bold font-mono text-white mb-0.5",
  className = ""
}) {
  return (
    <div className={`bg-[#111115]/80 border border-zinc-800/60 rounded-xl p-4 hover:border-zinc-700/60 transition-all flex flex-col justify-between ${className}`}>
      <div>
        <div className="flex items-center justify-between text-zinc-400 mb-2">
          <span className="text-xs font-medium text-zinc-300">{title}</span>
          <div className=" shrink-0">
            {icon}
          </div>
        </div>
        <div className={valueClassName}>
          {value}
        </div>
      </div>
      {subtitle && (
        <div className="text-[11px] text-zinc-500 font-mono mt-1">
          {subtitle}
        </div>
      )}
    </div>
  );
}
