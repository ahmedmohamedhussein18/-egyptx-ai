import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendLabel?: string;
}

export function KPICard({ title, value, icon, trend, trendLabel }: KPICardProps) {
  const isPositive = trend?.startsWith('+');
  const isNegative = trend?.startsWith('-');

  return (
    <div className="bg-[#0A1628] border border-[#C9A84C]/20 rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-[#C9A84C]/50 transition-all duration-300 shadow-lg">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none text-[#C9A84C] transform scale-150 translate-x-4 -translate-y-4">
        {icon}
      </div>
      
      <div className="flex items-center justify-between mb-4 z-10">
        <h3 className="text-gray-400 text-sm font-medium tracking-wider uppercase">{title}</h3>
        <div className="p-2 bg-[#C9A84C]/10 rounded-lg text-[#C9A84C] shadow-[0_0_15px_rgba(201,168,76,0.15)]">
          {icon}
        </div>
      </div>
      
      <div className="mt-2 z-10">
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        
        <div className="mt-4 flex items-center text-sm min-h-[1.25rem]">
          {trend ? (
            <>
              <span className={`font-semibold ${isPositive ? 'text-emerald-400' : isNegative ? 'text-rose-400' : 'text-gray-300'}`}>
                {trend}
              </span>
              {trendLabel && (
                <span className="text-gray-500 ml-2">{trendLabel}</span>
              )}
            </>
          ) : (
            <span className="text-gray-500 italic text-xs">No previous-period data</span>
          )}
        </div>
      </div>
    </div>
  );
}
