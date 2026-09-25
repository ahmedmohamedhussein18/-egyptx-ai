'use client';

import React from 'react';

export default function CommandHeader({ profile }: { profile: any }) {
  return (
    <header className="h-[75px] w-full bg-[#0B1F2A] flex items-center justify-between px-6 border-b border-[#C8A24A]/20 text-white" dir="rtl">
      
      {/* Right Side (Logo & Ministry) */}
      <div className="flex items-center gap-6 h-full">
        {/* Logo */}
        <div className="flex flex-col">
          <div className="text-xl font-bold flex items-center gap-1">
            <span className="text-[#C8A24A]">EgyptX</span> <span className="text-white">AI</span>
          </div>
          <span className="text-[10px] text-gray-400">National Smart Tourism Ecosystem</span>
        </div>

        <div className="h-8 w-[1px] bg-white/10 mx-2"></div>

        {/* Ministry */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="font-bold text-sm">وزارة السياحة والآثار</span>
            <span className="text-[#C8A24A] text-[11px]">مركز المعلومات السياحية الوطني</span>
          </div>
        </div>
      </div>

      {/* Center (Filters) */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 mb-1">المحافظة</span>
          <select className="bg-[#122C38] border border-white/10 rounded px-3 py-1 text-sm text-white outline-none">
            <option value="cairo">القاهرة</option>
          </select>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 mb-1">الفترة الزمنية</span>
          <select className="bg-[#122C38] border border-white/10 rounded px-3 py-1 text-sm text-white outline-none">
            <option value="7d">آخر 7 أيام</option>
            <option value="today">اليوم</option>
            <option value="30d">آخر 30 يوم</option>
            <option value="custom">مخصص</option>
          </select>
        </div>
      </div>

      {/* Left Side (Profile) */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col text-left">
          <span className="text-sm font-semibold">{profile?.firstName ? `${profile.firstName} ${profile.lastName}` : 'أحمد محمد'}</span>
          <span className="text-[11px] text-[#C8A24A]">مدير النظام الوطني</span>
        </div>
        <div className="h-10 w-10 rounded-full bg-[#122C38] border border-[#C8A24A]/40 flex items-center justify-center font-bold text-[#C8A24A]">
          {profile?.firstName?.charAt(0) || 'أ'}
        </div>
      </div>
    </header>
  );
}
