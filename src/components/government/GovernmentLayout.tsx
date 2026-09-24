'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Users, LayoutDashboard, Database, Landmark, FileText, Settings, Globe, Home, Bell, ChevronDown
} from 'lucide-react';

interface GovernmentLayoutProps {
  children: React.ReactNode;
  profile?: { firstName?: string; lastName?: string };
  rightPanel?: React.ReactNode;
}

export default function GovernmentLayout({ children, profile, rightPanel }: GovernmentLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const MENU_ITEMS = [
    { id: 'home', label: 'الصفحة الرئيسية', icon: <Home className="w-3.5 h-3.5" />, href: '/' },
    { id: 'dashboard', label: 'لوحة المعلومات', icon: <LayoutDashboard className="w-3.5 h-3.5" />, href: '/government/dashboard' },
    { id: 'egypt', label: 'المحافظات', sub: 'جمهورية مصر العربية', icon: <Globe className="w-3.5 h-3.5" />, href: '/government/dashboard', activeOn: '/government/dashboard' },
    { id: 'analytics', label: 'التحليلات والبيانات', icon: <Database className="w-3.5 h-3.5" />, href: '/government/analytics' },
    { id: 'visitors', label: 'الزوار والتدفقات السياحية', icon: <Users className="w-3.5 h-3.5" />, href: '/government/visitors' },
    { id: 'heritage', label: 'التراث والمتاحف', icon: <Landmark className="w-3.5 h-3.5" />, href: '/government/heritage' },
    { id: 'reports', label: 'التقارير والتصدير', icon: <FileText className="w-3.5 h-3.5" />, href: '/government/reports' },
    { id: 'content', label: 'إدارة المحتوى', icon: <Settings className="w-3.5 h-3.5" />, href: '/government/content' },
    { id: 'settings', label: 'إعدادات النظام', icon: <Settings className="w-3.5 h-3.5" />, href: '/government/settings' }
  ];

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#0A1628]" dir="rtl" style={{ fontFamily: "'Cairo', 'Tajawal', sans-serif" }}>
      {/* ══════════ TOP HEADER ══════════ */}
      <header className="h-[60px] flex items-center justify-between px-6 shrink-0 z-30 relative bg-black/40 backdrop-blur-sm">
        <div className="absolute inset-0 bg-[url('/images/destinations/giza.jpg')] bg-cover bg-center opacity-30 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-[#0A1628] via-[#0A1628]/80 to-transparent pointer-events-none"></div>

        {/* Right: Logo */}
        <div className="flex items-center gap-3 z-10" dir="ltr">
          <div className="text-[#C9A84C] font-serif text-2xl">☥</div>
          <div>
             <div className="flex items-baseline gap-1"><h1 className="text-xl font-bold text-white leading-none">EgyptX</h1><span className="text-white text-lg font-light leading-none">AI</span></div>
             <p className="text-[7px] text-[#C9A84C] tracking-[0.1em] uppercase">National Smart Tourism Ecosystem</p>
          </div>
        </div>

        {/* Left: Gov + User */}
        <div className="flex items-center gap-6 z-10">
          <div className="flex items-center gap-3">
             <div className="text-left leading-tight">
               <p className="text-[11px] font-bold text-white">وزارة السياحة والآثار</p>
               <p className="text-[8px] text-gray-300">مركز المعلومات السياحية الوطني</p>
             </div>
             <img src="/images/egypt-coat-of-arms.png" alt="" className="h-8 w-auto opacity-90" onError={(e) => e.currentTarget.style.display = 'none'} />
          </div>
          
          <div className="w-px h-6 bg-white/20"></div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"><Users className="w-4 h-4" /></div>
            <div className="text-left leading-tight flex items-center gap-1">
              <div>
                <p className="text-[11px] font-bold text-white">{profile?.firstName || 'أحمد'} {profile?.lastName || 'محمد'}</p>
                <p className="text-[8px] text-gray-400">مدير النظام</p>
              </div>
              <ChevronDown className="w-3 h-3 text-gray-400 ml-1" />
            </div>
          </div>

          <div className="w-px h-6 bg-white/20"></div>

          <button className="relative text-gray-400 hover:text-white">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-[#0A1628]"></span>
          </button>
        </div>
      </header>

      {/* ══════════ THREE COLUMNS ══════════ */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-60px)]">
        {/* ══════════ LEFT SIDEBAR ══════════ */}
        <aside className="w-[180px] bg-[#0A1628] flex flex-col shrink-0 border-l border-[#1e2d45] z-10 relative">
          <nav className="flex-1 py-4">
            {MENU_ITEMS.map((item) => {
              const isActive = item.activeOn === pathname || (item.href !== '/' && pathname.startsWith(item.href) && item.href !== '/government/dashboard');
              // Special case for dashboard / egypt as they map to the same conceptual page initially
              const actualActive = isActive || (item.id === 'egypt' && pathname === '/government/dashboard');

              return (
                <div key={item.id} className="mb-0.5 relative">
                  {actualActive && <div className="w-[2px] h-full absolute right-0 bg-[#C9A84C] z-20"></div>}
                  <button 
                    onClick={() => router.push(item.href)}
                    className={`w-full flex items-center justify-between gap-2.5 px-4 py-2.5 text-[10px] transition-all relative ${
                      actualActive
                        ? 'bg-gradient-to-l from-[#C9A84C]/20 to-transparent text-[#C9A84C] font-bold border-r-2 border-[#C9A84C]'
                        : 'text-gray-400 hover:text-gray-200 border-r-2 border-transparent'
                    }`}>
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <div className="text-right flex flex-col items-start leading-tight">
                        <span>{item.label}</span>
                        {item.sub && <span className="text-[8px] text-[#C9A84C] opacity-80 mt-0.5">{item.sub}</span>}
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </nav>
          
          <div className="relative h-48 mt-auto border-t border-[#1e2d45]">
            <img src="/images/destinations/luxor.jpg" alt="" className="w-full h-full object-cover opacity-50 grayscale" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/80 to-transparent"></div>
            <div className="absolute bottom-6 right-4 text-right">
              <p className="text-[#C9A84C] font-bold text-xs mb-0.5">مصر ...</p>
              <p className="text-white text-[11px] leading-tight font-light">أكثر من مجرد وجهة<br/>إنها حضارة</p>
            </div>
            <div className="absolute bottom-2 right-4 flex items-center gap-1.5 opacity-60">
               <span className="text-[#C9A84C] text-[10px]">☥</span>
               <span className="text-white text-[7px] font-sans">EgyptX AI | وزارة السياحة والآثار</span>
            </div>
          </div>
        </aside>

        {/* ══════════ MAIN CONTENT ══════════ */}
        <main className="flex-1 overflow-y-auto bg-[#f4f7f9] relative" id="dashboard-content">
          {children}
        </main>

        {/* ══════════ RIGHT PANEL (Optional) ══════════ */}
        {rightPanel}
      </div>
    </div>
  );
}
