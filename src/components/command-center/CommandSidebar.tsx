'use client';

import React from 'react';
import { Home, LayoutDashboard, Map, BarChart2, Users, Landmark, FileText, Settings, Database } from 'lucide-react';

interface CommandSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: 'home', label: 'الصفحة الرئيسية', icon: <Home className="w-4 h-4" /> },
  { id: 'overview', label: 'لوحة المعلومات', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'governorates', label: 'المحافظات', icon: <Map className="w-4 h-4" /> },
  { id: 'analytics', label: 'التحليلات والبيانات', icon: <BarChart2 className="w-4 h-4" /> },
  { id: 'visitors', label: 'الزوار والتنبؤات', icon: <Users className="w-4 h-4" /> },
  { id: 'heritage', label: 'التراث والمناطق', icon: <Landmark className="w-4 h-4" /> },
  { id: 'reports', label: 'التقارير والتصدير', icon: <FileText className="w-4 h-4" /> },
  { id: 'content', label: 'إدارة المحتوى', icon: <Database className="w-4 h-4" /> },
  { id: 'settings', label: 'إعدادات النظام', icon: <Settings className="w-4 h-4" /> },
];

export default function CommandSidebar({ activeTab, setActiveTab }: CommandSidebarProps) {
  return (
    <aside className="w-full h-full bg-[#071827] flex flex-col shrink-0" dir="rtl">
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        <ul className="flex flex-col gap-1 px-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.label;
            return (
              <li key={item.id} className="w-full">
                <button
                  onClick={() => setActiveTab(item.label)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition-all duration-200 ${
                    isActive
                      ? 'bg-[#C8A24A] text-white font-bold shadow-md'
                      : 'text-gray-400 hover:bg-[#0B1F2A] hover:text-white'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-[#C8A24A]'}>{item.icon}</span>
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Decorative Bottom Block */}
      <div className="p-4 mt-auto">
        <div className="bg-[#0B1F2A] rounded-lg p-3 border border-[#C8A24A]/20 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#C8A24A]/10 to-transparent"></div>
          <span className="text-[#C8A24A] font-bold text-lg relative z-10">مصر</span>
          <span className="text-[10px] text-gray-400 relative z-10">مهد الحضارة</span>
        </div>
      </div>
    </aside>
  );
}
