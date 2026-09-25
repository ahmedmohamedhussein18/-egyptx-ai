import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

interface TopHeaderProps {
  profile: any;
  onMenuClick: () => void;
}

export default function TopHeader({ profile, onMenuClick }: TopHeaderProps) {
  const userName = profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : 'Guest';
  const userRole = profile?.role || 'Administrator';

  return (
    <header className="h-16 w-full bg-[#030712] border-b border-[#1e293b] flex items-center justify-between px-4 lg:px-6 shadow-sm z-30 relative">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-400 hover:text-white focus:outline-none rounded-md hover:bg-[#1e293b]"
        >
          <Menu size={24} />
        </button>
        
        <div className="hidden sm:flex flex-col">
          <h1 className="text-[#C9A84C] font-bold text-lg leading-tight uppercase tracking-wide">
            EGYPTX AI
          </h1>
          <p className="text-xs text-gray-400 font-medium tracking-wide">
            National Smart Tourism Command Center
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1e293b]/50 border border-[#1e293b]">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-medium text-emerald-400">System Operational</span>
        </div>

        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C9A84C] rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-[#1e293b]">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-white leading-tight">{userName || 'Administrator'}</p>
            <p className="text-xs text-[#C9A84C] font-medium">{userRole}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#1e293b] border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C]">
            <User size={18} />
          </div>
        </div>
      </div>
    </header>
  );
}
