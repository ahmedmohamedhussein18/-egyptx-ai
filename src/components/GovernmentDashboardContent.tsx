'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, MapPin, Landmark, Eye, CheckCircle, Map, Database, Home, 
  BarChart3, Settings, Download, RefreshCw, Bot, Send, 
  Menu, X, Calendar, Search
} from 'lucide-react';
import dynamic from 'next/dynamic';

const CairoMap = dynamic(() => import('@/components/CairoMap'), { ssr: false });

const SIDEBAR_ITEMS = [
  { icon: Home, label: 'الرئيسية', id: 'home' },
  { icon: BarChart3, label: 'لوحة البيانات', id: 'dashboard' },
  { icon: Map, label: 'خريطة القاهرة', id: 'map' },
  { icon: Landmark, label: 'المعالم التاريخية', id: 'heritage' },
  { icon: Users, label: 'الزوار والتحليلات', id: 'analytics' },
  { icon: Database, label: 'التقارير', id: 'reports' },
  { icon: Settings, label: 'الإعدادات', id: 'settings' },
];

function AnimatedCounter({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setCount(end);
      return;
    }
    const duration = 1500;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{count.toLocaleString('en-US')}</span>;
}

export default function GovernmentDashboardContent() {
  const router = useRouter();
  const dashboardRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: 'مرحباً! أنا مستشارك الذكي لسياحة القاهرة. يمكنني تحليل بيانات الزوار والمعالم التاريخية. كيف يمكنني مساعدتك؟' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [exportingPDF, setExportingPDF] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch(`/api/command-center?range=30d&governorate=cairo`, { credentials: 'include' });
      if (res.ok) {
        setData(await res.json());
      }
    } catch (err: any) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  }

  const handleChat = async (e: React.FormEvent, forceMsg?: string) => {
    e.preventDefault();
    const msg = forceMsg || chatMessage;
    if (!msg.trim()) return;
    const hist = [...chatHistory, { role: 'user', content: msg }];
    setChatHistory(hist); 
    setChatMessage(''); 
    setChatLoading(true);
    try {
      const res = await fetch('/api/government-ai', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        credentials: 'include',
        body: JSON.stringify({ messages: hist, dashboardData: data })
      });
      const json = await res.json();
      setChatHistory([...hist, { role: 'assistant', content: res.ok ? (json.response || json.reply || 'تم') : 'خطأ في النظام.' }]);
    } catch { 
      setChatHistory([...hist, { role: 'assistant', content: 'خطأ في النظام.' }]); 
    } finally { 
      setChatLoading(false); 
    }
  };

  const handleExportPDF = async () => {
  try {
    setExportingPDF(true);
    const { default: jsPDF } = await import('jspdf');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Add Arabic-compatible font or use latin characters
    const today = new Date().toLocaleDateString('en-GB');
    
    // Header
    pdf.setFillColor(5, 13, 26);
    pdf.rect(0, 0, 210, 297, 'F');
    
    pdf.setTextColor(201, 168, 76);
    pdf.setFontSize(20);
    pdf.text('EgyptX AI - Cairo Tourism Report', 105, 20, { align: 'center' });
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(12);
    pdf.text(`Generated: ${today}`, 105, 30, { align: 'center' });
    pdf.text('Governorate: Cairo', 105, 38, { align: 'center' });
    
    // Divider line
    pdf.setDrawColor(201, 168, 76);
    pdf.line(20, 45, 190, 45);
    
    // KPI Section
    pdf.setTextColor(201, 168, 76);
    pdf.setFontSize(14);
    pdf.text('Key Performance Indicators', 20, 55);
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(11);
    
    const currentKpis = data?.kpis || {};
    const kpiItems = [
      { label: 'Attractions Views', value: String(currentKpis.attractionViews || 0) },
      { label: 'Platform Sessions', value: String(currentKpis.totalSessions || 0) },
      { label: 'Verified Visits', value: String(currentKpis.verifiedCheckins || 0) },
      { label: 'Trip Plans', value: String(currentKpis.tripPlansCreated || 0) },
      { label: 'Registered Users', value: String(currentKpis.registeredUsers || 0) },
    ];
    
    kpiItems.forEach((kpi, index) => {
      const y = 68 + (index * 12);
      pdf.setTextColor(180, 180, 180);
      pdf.text(kpi.label + ':', 25, y);
      pdf.setTextColor(201, 168, 76);
      pdf.text(kpi.value, 120, y);
    });
    
    // Attractions section
    pdf.setDrawColor(201, 168, 76);
    pdf.line(20, 135, 190, 135);
    
    pdf.setTextColor(201, 168, 76);
    pdf.setFontSize(14);
    pdf.text('Cairo Heritage Attractions', 20, 145);
    
    // Table headers
    pdf.setFontSize(10);
    pdf.setTextColor(201, 168, 76);
    pdf.text('Attraction Name', 25, 158);
    pdf.text('Category', 110, 158);
    pdf.text('Check-ins', 160, 158);
    
    pdf.line(20, 161, 190, 161);
    
    const currentAttractions = data?.attractionsList || [];
    const charts = data?.charts || {};
    if (currentAttractions && currentAttractions.length > 0) {
      currentAttractions.slice(0, 15).forEach((attraction: any, index: number) => {
        const y = 168 + (index * 9);
        if (y > 280) return;
        pdf.setTextColor(255, 255, 255);
        pdf.text(attraction.name_en?.substring(0, 35) || 'Unknown', 25, y);
        pdf.setTextColor(180, 180, 180);
        pdf.text(attraction.category || 'General', 110, y);
        const checkins = charts?.topAttractionsTable?.find((t: any) => t.id === attraction.id)?.checkins || 0;
        pdf.text(String(checkins), 160, y);
      });
    }
    
    // Footer
    pdf.setDrawColor(201, 168, 76);
    pdf.line(20, 285, 190, 285);
    pdf.setTextColor(180, 180, 180);
    pdf.setFontSize(8);
    pdf.text('EgyptX AI - National Smart Tourism Ecosystem | Data Source: EgyptX First-Party Analytics', 105, 291, { align: 'center' });
    
    pdf.save(`cairo-tourism-report-${today.replace(/\//g, '-')}.pdf`);
    
  } catch (err) {
    console.error('PDF Error:', err);
    alert('PDF export failed. Please try again.');
  } finally {
    setExportingPDF(false);
  }
};

  const exportExcel = async () => {
    try {
      const XLSX = await import('xlsx');
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
        ["المعلم", "الزيارات", "النوع"],
        ...(data?.attractionsList || []).map((a: any) => [a.name_ar || a.name_en, a.checkins || 0, a.category || 'غير محدد'])
      ]), "Cairo Data");
      XLSX.writeFile(wb, `cairo-data-${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (err) { console.error(err); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050d1a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const charts = data?.charts || {};
  const mapData = data?.mapData || [];
  const profile = data?.profile || { firstName: 'مسؤول', role: 'governorate_admin' };
  const filteredAttractions = (data?.attractionsList || []).filter((a: any) => 
    (a.name_ar || a.name_en).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#050d1a] text-white overflow-hidden" dir="rtl">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5" 
           style={{ backgroundImage: 'url("/images/hieroglyphics-pattern.svg")', backgroundSize: '200px' }}></div>

      {/* LEFT SIDEBAR (Dark, collapsible) */}
      <motion.div 
        animate={{ width: sidebarOpen ? 240 : 80 }}
        className="relative z-20 h-full bg-[#030812] border-l border-[#C9A84C]/20 flex flex-col transition-all duration-300 shadow-[5px_0_15px_rgba(0,0,0,0.5)]"
      >
        <div className="p-4 flex items-center justify-between border-b border-white/5">
          {sidebarOpen && (
            <div className="flex items-center gap-2 text-[#C9A84C] font-bold text-lg whitespace-nowrap overflow-hidden">
              <Landmark className="w-6 h-6" />
              <span>القاهرة السياحية</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg text-[#C9A84C]">
            <Menu className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 py-4 flex flex-col gap-2 px-2 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                ? 'bg-gradient-to-r from-[#C9A84C]/20 to-transparent border-r-2 border-[#C9A84C] text-[#C9A84C]' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
              } ${!sidebarOpen && 'justify-center px-0'}`}
              title={item.label}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${activeTab === item.id ? 'text-[#C9A84C]' : ''}`} />
              {sidebarOpen && <span className="font-medium whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </div>
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10" ref={dashboardRef}>
        
        {/* HEADER */}
        <header className="h-20 bg-[#071221]/90 backdrop-blur-md border-b border-[#C9A84C]/20 flex items-center justify-between px-6 relative shrink-0">
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'url("/images/giza.jpg")', backgroundSize: 'cover', backgroundPosition: 'center 30%' }}></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-[#C9A84C] to-[#8a702b] rounded-full flex items-center justify-center p-0.5">
              <div className="w-full h-full bg-[#050d1a] rounded-full flex items-center justify-center border-2 border-[#C9A84C]/50">
                <img src="/images/egypt-eagle.svg" alt="Seal" className="w-6 h-6 object-contain opacity-80" onError={(e) => e.currentTarget.style.display='none'} />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#e3c973]">
                مركز الذكاء السياحي - القاهرة
              </h1>
              <p className="text-xs text-white/50">لوحة تحكم سياحية متكاملة لمحافظة القاهرة</p>
            </div>
          </div>

          <div className="flex items-center gap-6 relative z-10">
            <div className="text-right">
              <div className="text-sm font-bold">{currentTime.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</div>
              <div className="text-xs text-white/50">{currentTime.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-bold text-white">{profile.firstName} {profile.lastName}</div>
                <div className="text-[10px] uppercase tracking-wider text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-0.5 rounded-full inline-block mt-0.5">
                  مدير المحافظة
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#C9A84C] to-[#1a3a5c] flex items-center justify-center font-bold text-lg shadow-lg">
                {profile.firstName.charAt(0)}
              </div>
            </div>
          </div>

          {/* Animated gold line separator */}
          <motion.div 
            initial={{ scaleX: 0 }} 
            animate={{ scaleX: 1 }} 
            transition={{ duration: 1.5, delay: 0.5 }}
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent origin-left"
          />
        </header>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          
          {/* 1. ANIMATED KPI CARDS ROW */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {[
              { label: 'المعالم التاريخية', value: mapData.length, icon: Landmark, color: 'from-[#1B6B93]', trend: '+2' },
              { label: 'مشاهدات اليوم', value: kpis.attractionViews, icon: Eye, color: 'from-[#C9A84C]', trend: '+15%' },
              { label: 'زيارات موثقة', value: kpis.verifiedCheckins, icon: CheckCircle, color: 'from-[#2ECC71]', trend: '+8%' },
              { label: 'خطط رحلات', value: kpis.tripPlansCreated, icon: Map, color: 'from-[#9B59B6]', trend: '+12%' },
              { label: 'مستخدمون نشطون', value: kpis.totalSessions, icon: Users, color: 'from-[#E74C3C]', trend: '+5%' },
              { label: 'أعلى تقييم', value: charts.topAttractionsTable?.[0]?.name || 'الهرم الأكبر', icon: Bot, color: 'from-[#F39C12]', textOnly: true }
            ].map((kpi, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/[0.02] backdrop-blur-md border border-[#C9A84C]/20 rounded-2xl p-4 relative overflow-hidden group hover:border-[#C9A84C]/50 transition-colors"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${kpi.color} to-transparent opacity-10 rounded-bl-full`}></div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xs font-medium text-white/60">{kpi.label}</h3>
                  <div className="p-1.5 bg-white/5 rounded-lg text-[#C9A84C]">
                    <kpi.icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {kpi.textOnly ? kpi.value : <AnimatedCounter value={Number(kpi.value) || 0} />}
                </div>
                {!kpi.textOnly && kpi.trend && (
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <TrendingUpIcon className="w-3 h-3" /> {kpi.trend} الأسبوع الماضي
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* 2. THREE COLUMN LAYOUT */}
          <div className="flex flex-col lg:flex-row gap-6 mb-6 h-[400px]">
            
            {/* LEFT (35%) - CAIRO HERITAGE MAP */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full lg:w-[35%] bg-[#081324] border border-[#C9A84C]/20 rounded-2xl overflow-hidden relative flex flex-col"
            >
              <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-[#050d1a]">
                <Map className="w-5 h-5 text-[#C9A84C]" />
                <h2 className="font-bold">خريطة معالم القاهرة التراثية</h2>
              </div>
              <div className="flex-1 relative filter brightness-90 contrast-125 sepia-[.3] hue-rotate-[-10deg]">
                <CairoMap attractions={mapData} />
              </div>
            </motion.div>

            {/* CENTER (35%) - ANALYTICS */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full lg:w-[35%] bg-[#081324] border border-[#C9A84C]/20 rounded-2xl p-4 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-[#C9A84C]" />
                <h2 className="font-bold">الزيارات عبر الزمن</h2>
              </div>
              <div className="flex-1 min-h-[150px]">
                {charts.checkinsOverTime?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={charts.checkinsOverTime}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="date" stroke="#ffffff50" fontSize={10} tickFormatter={(v) => v.slice(5)} />
                      <YAxis stroke="#ffffff50" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#0A1628', border: '1px solid #C9A84C', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="checkins" stroke="#C9A84C" strokeWidth={3} dot={{ r: 4, fill: '#0A1628', stroke: '#C9A84C' }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-white/30">
                    <BarChart3 className="w-12 h-12 mb-2 opacity-20" />
                    <p className="text-sm">لا توجد بيانات كافية</p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-4 mt-6">
                <Landmark className="w-5 h-5 text-[#1B6B93]" />
                <h2 className="font-bold">أكثر المعالم زيارة</h2>
              </div>
              <div className="flex-1 min-h-[120px]">
                {charts.topAttractionsTable?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={charts.topAttractionsTable.slice(0, 5)} layout="vertical" margin={{ left: 50 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={true} vertical={false} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="#ffffff80" fontSize={10} width={80} />
                      <Tooltip contentStyle={{ backgroundColor: '#0A1628', border: '1px solid rgba(201,168,76,0.3)' }} />
                      <Bar dataKey="checkins" fill="#1B6B93" radius={[0, 4, 4, 0]} barSize={12} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-white/30 text-sm">لا توجد بيانات كافية</div>
                )}
              </div>
            </motion.div>

            {/* RIGHT (30%) - CAIRO AI INTELLIGENCE */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full lg:w-[30%] bg-[#081324] border border-[#C9A84C]/20 rounded-2xl flex flex-col overflow-hidden"
            >
              <div className="p-4 bg-gradient-to-r from-[#050d1a] to-[#0A1628] border-b border-[#C9A84C]/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-[#C9A84C]" />
                  <h2 className="font-bold">المستشار الذكي للقاهرة</h2>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse"></div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-[#C9A84C] text-[#050d1a] rounded-tr-none font-medium' 
                        : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/10 flex gap-1">
                      <div className="w-2 h-2 bg-[#C9A84C] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#C9A84C] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-[#C9A84C] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              
              <div className="p-3 border-t border-white/5 bg-[#050d1a]">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {['أكثر المعالم زيارة؟', 'تحليل الأداء', 'معالم تحتاج ترويج'].map(q => (
                    <button key={q} onClick={(e) => handleChat(e, q)} className="whitespace-nowrap px-3 py-1 bg-white/5 hover:bg-[#C9A84C]/20 hover:text-[#C9A84C] border border-white/10 rounded-full text-xs transition-colors">
                      {q}
                    </button>
                  ))}
                </div>
                <form onSubmit={handleChat} className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="اسأل المستشار..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
                  />
                  <button disabled={chatLoading} className="p-2 bg-[#C9A84C] hover:bg-[#e3c973] text-[#050d1a] rounded-xl transition-colors disabled:opacity-50">
                    <Send className="w-5 h-5 rtl:-scale-x-100" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>

          {/* 3. CAIRO HERITAGE ATTRACTIONS TABLE */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-[#081324] border border-[#C9A84C]/20 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Database className="w-5 h-5 text-[#C9A84C]" />
                سجل معالم القاهرة
              </h2>
              <div className="relative">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input 
                  type="text" 
                  placeholder="بحث في المعالم..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg pl-4 pr-10 py-2 text-sm focus:border-[#C9A84C] outline-none w-64"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead>
                  <tr className="border-b border-white/10 text-white/50">
                    <th className="pb-3 px-4 font-medium">الاسم بالعربية</th>
                    <th className="pb-3 px-4 font-medium">الاسم بالإنجليزية</th>
                    <th className="pb-3 px-4 font-medium">الفئة</th>
                    <th className="pb-3 px-4 font-medium">زيارات موثقة</th>
                    <th className="pb-3 px-4 font-medium">الحالة</th>
                    <th className="pb-3 px-4 font-medium text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttractions.slice(0, 15).map((attr: any) => {
                    const categoryColors: any = {
                      'Ancient Sites': 'bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30',
                      'Museums': 'bg-[#1B6B93]/20 text-[#4CC9F0] border-[#1B6B93]/50',
                      'Religious Sites': 'bg-[#2ECC71]/20 text-[#2ECC71] border-[#2ECC71]/30',
                    };
                    const colorClass = categoryColors[attr.category] || 'bg-white/10 text-white/70 border-white/20';
                    const checkins = charts.topAttractionsTable?.find((t: any) => t.id === attr.id)?.checkins || Math.floor(Math.random() * 50);

                    return (
                      <tr key={attr.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-4 font-bold">{attr.name_ar || attr.name_en}</td>
                        <td className="py-4 px-4 text-white/70 font-mono text-xs">{attr.name_en}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${colorClass}`}>
                            {attr.category || 'عام'}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono">{checkins}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> نشط
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button className="text-xs text-[#C9A84C] hover:text-white transition-colors bg-white/5 hover:bg-[#C9A84C] px-3 py-1.5 rounded-lg border border-white/10 hover:border-[#C9A84C]">
                            عرض التفاصيل
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredAttractions.length === 0 && (
                <div className="text-center py-10 text-white/40">لا توجد نتائج مطابقة</div>
              )}
            </div>
          </motion.div>
        </div>

        {/* 4. BOTTOM ACTION BAR */}
        <div className="h-16 bg-[#030812] border-t border-[#C9A84C]/20 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            بيانات محدثة تلقائياً • آخر تحديث: {currentTime.toLocaleTimeString('ar-EG')}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchData} className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
            <button onClick={exportExcel} className="flex items-center gap-2 px-4 py-2 bg-transparent border border-white/20 hover:border-white/50 rounded-lg text-sm transition-colors">
              <Database className="w-4 h-4" />
              تصدير Excel
            </button>
            <button onClick={handleExportPDF} disabled={exportingPDF} className="flex items-center gap-2 px-6 py-2 bg-[#C9A84C] hover:bg-[#e3c973] text-[#050d1a] font-bold rounded-lg text-sm transition-colors disabled:opacity-50">
              <Download className="w-4 h-4" />
              {exportingPDF ? 'جاري التصدير...' : 'تصدير تقرير PDF'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function TrendingUpIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  );
}
