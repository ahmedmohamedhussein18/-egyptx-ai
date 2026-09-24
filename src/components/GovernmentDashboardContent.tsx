'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Users, Activity, MapPin, Loader2, Compass, ShieldCheck, Calendar, ChevronDown,
  Home, LayoutDashboard, Database, TrendingUp, Landmark, FileText, Settings, Globe,
  Bot, Send, Download, Bell, X, Info, CheckCircle, Eye, Briefcase, HelpCircle, FileCheck, FileSpreadsheet, AlertTriangle
} from 'lucide-react';
import dynamic from 'next/dynamic';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from 'recharts';
const CairoMap = dynamic(() => import('@/components/CairoMap'), { ssr: false });

const PIE_COLORS = ['#1B6B93', '#C9A84C', '#2ECC71', '#9B59B6', '#E74C3C', '#95a5a6'];

export default function GovernmentDashboardContent() {
  const router = useRouter();
  const supabase = createClient();
  const dashboardRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [dateRange, setDateRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [exportingPDF, setExportingPDF] = useState(false);

  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([
    { role: 'user', content: 'ما هي أهم الأماكن الحيوية في القاهرة؟' },
    { role: 'assistant', content: 'فيما يلي أهم الأماكن الحيوية في القاهرة بناءً على بيانات المنصة وتحليل أنماط الزيارة:\n\n1. منطقة الأهرامات (الجيزة) - الأكثر زيارة\n2. وسط البلد (تسوق ومطاعم)\n3. خان الخليلي (تراث وثقافة)\n4. المتحف المصري (متحف)\n5. قلعة صلاح الدين (تاريخ وآثار)\n\nملاحظة:\nتم الاعتماد على بيانات الزيارات الموثقة وإشارات التفاعل على المنصة.\n\nالمصدر: تحليلات المنصة' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const [activeMenu, setActiveMenu] = useState('egypt');
  
  useEffect(() => { fetchData(); }, [dateRange]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);

  async function fetchData() {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      const res = await fetch(`/api/command-center?range=${dateRange}&governorate=cairo`, { credentials: 'include' });
      if (res.ok) setData(await res.json());
    } catch (err: any) { console.error(err); }
    finally { setLoading(false); }
  }

  const handleChat = async (e: React.FormEvent, forceMsg?: string) => {
    e.preventDefault();
    const msg = forceMsg || chatMessage;
    if (!msg.trim()) return;
    const hist = [...chatHistory, { role: 'user', content: msg }];
    setChatHistory(hist); setChatMessage(''); setChatLoading(true);
    try {
      const res = await fetch('/api/government-ai', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ messages: hist, dashboardData: data })
      });
      const json = await res.json();
      setChatHistory([...hist, { role: 'assistant', content: res.ok ? (json.response || json.reply || 'لا توجد إجابة.') : 'عذراً، حدث خطأ.' }]);
    } catch { setChatHistory([...hist, { role: 'assistant', content: 'عذراً، حدث خطأ.' }]); }
    finally { setChatLoading(false); }
  };

  const exportPDF = async () => {
    if (!dashboardRef.current) return;
    setExportingPDF(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      
      // Small delay to ensure any layout shifts are done
      await new Promise(resolve => setTimeout(resolve, 100));
      const c = await html2canvas(dashboardRef.current, { scale: 2, backgroundColor: '#f4f7f9', useCORS: true });
      const pdf = new jsPDF('l', 'mm', 'a4');
      const w = pdf.internal.pageSize.getWidth();
      pdf.addImage(c.toDataURL('image/jpeg', 0.9), 'JPEG', 0, 0, w, (c.height * w) / c.width);
      pdf.save(`egyptx-tourism-report-cairo-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) { 
      console.error('PDF error:', err); 
      alert('فشل تصدير التقرير. الرجاء المحاولة مرة أخرى.');
    } finally {
      setExportingPDF(false);
    }
  };

  const exportExcel = async () => {
    try {
      const XLSX = await import('xlsx');
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
        ["المؤشر", "القيمة", "المصدر"],
        ["جلسات المنصة", kpis.totalSessions, "EgyptX"],
        ["المستخدمون المسجلون", kpis.registeredUsers, "EgyptX"],
        ["خطط الرحلات", kpis.tripPlansCreated, "EgyptX"],
        ["مشاهدات المعالم", kpis.attractionViews, "EgyptX"],
        ["إشارات التحقق", kpis.verifiedCheckins, "EgyptX"],
      ]), "ملخص");
      XLSX.writeFile(wb, `Cairo_Dashboard_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (e) { console.error('Excel error:', e); }
  };

  const fmt = (n: number | undefined) => n !== undefined && n !== null ? n.toLocaleString('en-US') : '0';

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#C9A84C] animate-spin mb-4" />
        <span className="text-lg font-bold text-white font-[Cairo]">جاري تحميل البيانات...</span>
      </div>
    );
  }

  const kpis = data?.kpis || { totalSessions: 0, registeredUsers: 0, tripPlansCreated: 0, attractionViews: 0, verifiedCheckins: 0 };
  const charts = data?.charts || {};
  const mapData = data?.mapData || [];
  
  // Chart components empty state
  const EmptyState = () => (
    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
      <AlertTriangle className="w-6 h-6 text-gray-300" />
      <span className="text-[10px]">لا توجد بيانات لهذه الفترة</span>
    </div>
  );

  // ═══════════════════════════════════════════════
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
                <p className="text-[11px] font-bold text-white">{data?.profile?.firstName || 'أحمد'} {data?.profile?.lastName || 'محمد'}</p>
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
            {[
              { id: 'home', label: 'الصفحة الرئيسية', icon: <Home className="w-3.5 h-3.5" />, href: '/' },
              { id: 'dashboard', label: 'لوحة المعلومات', icon: <LayoutDashboard className="w-3.5 h-3.5" />, href: '/government/dashboard' },
              { id: 'egypt', label: 'المحافظات', sub: 'جمهورية مصر العربية', icon: <Globe className="w-3.5 h-3.5" />, active: true },
              { id: 'analytics', label: 'التحليلات والبيانات', icon: <Database className="w-3.5 h-3.5" />, href: '/government/analytics' },
              { id: 'visitors', label: 'الزوار والتدفقات السياحية', icon: <Users className="w-3.5 h-3.5" />, href: '/government/visitors' },
              { id: 'heritage', label: 'التراث والمتاحف', icon: <Landmark className="w-3.5 h-3.5" />, href: '/government/heritage' },
              { id: 'reports', label: 'التقارير والتصدير', icon: <FileText className="w-3.5 h-3.5" />, href: '/government/reports' },
              { id: 'content', label: 'إدارة المحتوى', icon: <Settings className="w-3.5 h-3.5" />, href: '/government/content' },
              { id: 'settings', label: 'إعدادات النظام', icon: <Settings className="w-3.5 h-3.5" />, href: '/government/settings' }
            ].map((item) => (
              <div key={item.id} className="mb-0.5 relative">
                {item.active && <div className="w-[2px] h-full absolute right-0 bg-[#C9A84C] z-20"></div>}
                <button 
                  onClick={() => {
                    if (item.href) router.push(item.href);
                  }}
                  className={`w-full flex items-center justify-between gap-2.5 px-4 py-2.5 text-[10px] transition-all relative ${
                    item.active
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
            ))}
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

        {/* ══════════ MAIN DASHBOARD ══════════ */}
        <main className="flex-1 overflow-y-auto bg-[#f4f7f9] relative" id="dashboard-content">
          <div className="p-3.5 space-y-3.5 max-w-[1400px] mx-auto bg-[#f4f7f9]" ref={dashboardRef}>
            
            {/* ── Title + Filters ── */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl px-4 py-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100">
              <div>
                <h2 className="text-[13px] font-black text-[#0A1628] mb-0.5">لوحة تحكم المحافظات</h2>
                <p className="text-[9px] text-gray-500">تحليلات سياحية دقيقة لكل محافظات مصر</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-col border border-gray-200 rounded-lg bg-white overflow-hidden w-28">
                  <span className="text-[7px] text-gray-500 px-2 pt-1">المحافظة</span>
                  <div className="flex items-center justify-between px-2 pb-1 text-[10px] font-bold text-[#0A1628]">
                    <span>القاهرة</span><ChevronDown className="w-3 h-3 text-gray-400" />
                  </div>
                </div>
                <div className="flex flex-col border border-gray-200 rounded-lg bg-white overflow-hidden w-28">
                  <span className="text-[7px] text-gray-500 px-2 pt-1">الفترة الزمنية</span>
                  <div className="flex items-center justify-between px-2 pb-1 text-[10px] font-bold text-[#0A1628] cursor-pointer">
                    <select 
                      className="bg-transparent outline-none w-full appearance-none font-bold text-[#0A1628]"
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                    >
                      <option value="today">اليوم</option>
                      <option value="7d">آخر 7 أيام</option>
                      <option value="30d">آخر 30 يوم</option>
                    </select>
                    <ChevronDown className="w-3 h-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="flex flex-col border border-gray-200 rounded-lg bg-white overflow-hidden w-40">
                  <span className="text-[7px] text-gray-500 px-2 pt-1">التاريخ</span>
                  <div className="flex items-center justify-between px-2 pb-1 text-[10px] font-bold text-[#0A1628]">
                    <span>{new Date().toLocaleDateString('ar-EG')}</span><Calendar className="w-3 h-3 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* ── 5 KPI CARDS ── */}
            <div className="flex justify-between gap-3">
              {[
                { title: 'جلسات المنصة', val: kpis.totalSessions, icon: <Users className="w-4 h-4 text-[#1B6B93]" />, bg: 'bg-blue-50' },
                { title: 'المستخدمون المسجلون', val: kpis.registeredUsers, icon: <Users className="w-4 h-4 text-[#1B6B93]" />, bg: 'bg-blue-50' },
                { title: 'خطط الرحلات المنشأة', val: kpis.tripPlansCreated, icon: <Compass className="w-4 h-4 text-[#C9A84C]" />, bg: 'bg-amber-50' },
                { title: 'مشاهدات صفحات المعالم', val: kpis.attractionViews, icon: <Eye className="w-4 h-4 text-[#1B6B93]" />, bg: 'bg-blue-50' },
                { title: 'إشارات تحقق موثقة', val: kpis.verifiedCheckins, icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />, bg: 'bg-emerald-50' },
              ].map((c, i) => (
                <div key={i} className="flex-1 bg-white rounded-xl p-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 ${c.bg} rounded-lg flex items-center justify-center`}>{c.icon}</div>
                    <span className="text-[9px] font-bold text-gray-600">{c.title}</span>
                  </div>
                  <div className="flex items-end justify-between mt-auto mb-1 px-1">
                    <span className="text-lg font-black text-[#0A1628] leading-none">{fmt(c.val)}</span>
                    {/* Trend omitted because there is no historical comparison data available from API yet */}
                    {/* <span className="text-[7px] text-gray-400 border border-gray-100 px-1 py-0.5 rounded">بيانات غير كافية</span> */}
                  </div>
                  <p className="text-[7px] text-gray-400 text-left px-1 w-full border-t border-gray-50 pt-1">
                    {c.val > 0 ? 'لا توجد بيانات مقارنة كافية' : 'لا توجد بيانات'}
                  </p>
                </div>
              ))}
            </div>

            {/* ── MIDDLE ROW ── */}
            <div className="grid grid-cols-12 gap-3">

              {/* Map (Dark Mode) */}
              <div className="col-span-4 bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-2.5 flex flex-col h-[340px]">
                <div className="flex justify-between items-center mb-2 px-1">
                  <h3 className="font-bold text-[#0A1628] text-[11px]">خريطة محافظة القاهرة</h3>
                  <div className="flex items-center gap-1 border border-gray-200 rounded px-1.5 py-0.5 text-[8px] text-gray-500 bg-gray-50">
                    <MapPin className="w-2 h-2 text-[#1B6B93]" /> القاهرة <ChevronDown className="w-2 h-2" />
                  </div>
                </div>
                <div className="flex-1 rounded-lg overflow-hidden relative">
                   {mapData && mapData.length > 0 ? <CairoMap attractions={mapData} /> : <EmptyState />}
                </div>
              </div>

              {/* Line Chart */}
              <div className="col-span-4 bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-3 flex flex-col h-[340px]">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-[#0A1628] text-[11px] flex items-center gap-1.5">
                     <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center"><CheckCircle className="w-2.5 h-2.5 text-white" /></div>
                     إشارات التحقق الموثقة
                   </h3>
                   <div className="flex items-center gap-2 text-[8px] text-gray-500">
                     <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full"></div> القاهرة</span>
                   </div>
                </div>
                <div className="flex-1 -mr-4">
                   {charts?.checkinsOverTime?.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={charts.checkinsOverTime} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 8 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fill: '#9ca3af', fontSize: 8 }} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ fontSize: '10px', direction: 'rtl', borderRadius: '8px' }} />
                          <Line type="monotone" dataKey="checkins" name="إشارات التحقق" stroke="#C9A84C" strokeWidth={2} dot={{ r: 3, fill: '#C9A84C' }} />
                        </LineChart>
                      </ResponsiveContainer>
                   ) : <EmptyState />}
                </div>
                <p className="text-[6px] text-gray-400 text-center mt-2 border-t border-gray-100 pt-1">المصدر: نظام التحقق الإلكتروني</p>
              </div>

              {/* Pie Chart */}
              <div className="col-span-4 bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-3 flex flex-col h-[340px]">
                <h3 className="font-bold text-[#0A1628] text-[11px] mb-4 text-center">أكثر الفئات السياحية زيارة</h3>
                <div className="flex-1 flex items-center justify-between pr-4">
                  {charts?.categoryDistribution?.length > 0 ? (
                    <>
                      <div className="w-[50%] h-[160px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={charts.categoryDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" stroke="none">
                              {charts.categoryDistribution.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                           <span className="text-[8px] text-gray-500">إجمالي</span>
                           <span className="text-sm font-bold text-[#C9A84C]">
                             {fmt(charts.categoryDistribution.reduce((a:number, b:any) => a + b.value, 0))}
                           </span>
                        </div>
                      </div>

                      <div className="w-[45%] flex flex-col gap-2.5">
                        {charts.categoryDistribution.slice(0, 6).map((item: any, i: number) => {
                           const total = charts.categoryDistribution.reduce((a:number, b:any) => a + b.value, 0);
                           const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
                           return (
                            <div key={i} className="flex items-center justify-between text-[9px]">
                              <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}></div>
                                <span className="text-gray-600 truncate max-w-[60px]" title={item.name}>{item.name}</span>
                              </div>
                              <span className="font-bold text-[#0A1628]">{pct}%</span>
                            </div>
                           )
                        })}
                      </div>
                    </>
                  ) : <EmptyState />}
                </div>
                <p className="text-[6px] text-gray-400 text-center mt-2 border-t border-gray-100 pt-1">المصدر: تحليلات المنصة</p>
              </div>
            </div>

            {/* ── BOTTOM ROW ── */}
            <div className="grid grid-cols-12 gap-3">
              
              {/* Table */}
              <div className="col-span-7 bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-3 h-[240px] flex flex-col">
                <h3 className="font-bold text-[#0A1628] text-[11px] mb-2 flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-emerald-100 rounded flex items-center justify-center"><Landmark className="w-2.5 h-2.5 text-emerald-600" /></div>
                  أكثر المعالم زيارة في القاهرة
                </h3>
                <div className="flex-1 overflow-auto">
                  {charts?.topAttractionsTable?.length > 0 ? (
                    <table className="w-full text-[9px] text-right">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400">
                           <th className="pb-1.5 font-normal">المعلم</th>
                           <th className="pb-1.5 font-normal text-center">إشارات التحقق</th>
                        </tr>
                      </thead>
                      <tbody>
                        {charts.topAttractionsTable.slice(0, 5).map((a: any, i: number) => (
                          <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer">
                            <td className="py-1.5 flex items-center gap-2">
                               <img src="/images/destinations/cairo.jpg" className="w-7 h-5 rounded object-cover" alt="" />
                               <span className="font-bold text-[#1B6B93]">{a.name}</span>
                            </td>
                            <td className="py-1.5 text-center font-bold text-[#0A1628]">{fmt(a.checkins)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : <EmptyState />}
                </div>
                <p className="text-[6px] text-gray-400 text-center mt-1 border-t border-gray-50 pt-1">المصدر: نظام التحقق الإلكتروني</p>
              </div>

              {/* Bar Chart */}
              <div className="col-span-5 bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-3 h-[240px] flex flex-col">
                <h3 className="font-bold text-[#0A1628] text-[11px] mb-3 text-center">أعلى الوجهات طلباً في مخطط الرحلات</h3>
                <div className="flex-1 -ml-4 mr-2">
                   {charts?.topTripDestinations?.length > 0 ? (
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={charts.topTripDestinations} layout="vertical" barSize={8} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                           <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                           <XAxis type="number" hide />
                           <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#4b5563' }} width={60} orientation="right" />
                           <Tooltip contentStyle={{ fontSize: '10px' }} />
                           <Bar dataKey="requests" name="الطلبات" fill="#4CC9F0" radius={[2, 0, 0, 2]} label={{ position: 'left', fill: '#9ca3af', fontSize: 8 }}>
                             {charts.topTripDestinations.map((e: any, i: number) => <Cell key={i} fill={i === 0 ? '#1B6B93' : '#4CC9F0'} />)}
                           </Bar>
                        </BarChart>
                     </ResponsiveContainer>
                   ) : <EmptyState />}
                </div>
                <p className="text-[6px] text-gray-400 text-center mt-1 border-t border-gray-50 pt-1">المصدر: بيانات خطط الرحلات</p>
              </div>

            </div>

            {/* ── ACTION BAR ── */}
            <div className="grid grid-cols-4 gap-3 pt-1">
              <button onClick={() => router.push('/explore')} className="flex items-center justify-center gap-2 bg-[#0A1628] text-white py-2.5 rounded-lg text-[10px] font-bold shadow-sm hover:bg-[#152238] transition">
                 <Compass className="w-3.5 h-3.5 text-[#C9A84C]" /> استكشف مصر
              </button>
              <button className="flex items-center justify-center gap-2 bg-white text-[#1B6B93] py-2.5 rounded-lg text-[10px] font-bold shadow-sm hover:bg-gray-50 border border-gray-100 transition">
                 <Bot className="w-3.5 h-3.5 text-green-500" /> استخدام الذكاء الاصطناعي
              </button>
              <button onClick={exportPDF} disabled={exportingPDF} className="flex items-center justify-center gap-2 bg-white text-gray-600 py-2.5 rounded-lg text-[10px] font-bold shadow-sm hover:bg-gray-50 border border-gray-100 transition disabled:opacity-50">
                 {exportingPDF ? <Loader2 className="w-3.5 h-3.5 text-[#C9A84C] animate-spin" /> : <FileSpreadsheet className="w-3.5 h-3.5 text-[#C9A84C]" />}
                 {exportingPDF ? 'جاري التحضير...' : 'تصدير التقارير'}
                 <span className="text-[7px] text-gray-400 font-normal">PDF / Excel</span>
              </button>
              <button onClick={exportExcel} className="flex items-center justify-center gap-2 bg-white text-[#1B6B93] py-2.5 rounded-lg text-[10px] font-bold shadow-sm hover:bg-gray-50 border border-gray-100 transition">
                 <Download className="w-3.5 h-3.5" /> تحميل Excel
              </button>
            </div>

          </div>
        </main>

        {/* ══════════ AI PANEL ══════════ */}
        <aside className="w-[240px] bg-[#07111F] flex flex-col shrink-0 border-r border-[#1e2d45] z-10 hidden xl:flex">
          
          <div className="p-3 border-b border-[#1e2d45] flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center"><Users className="w-3 h-3" /></div>
              <div className="text-right leading-tight">
                <p className="text-[10px] font-bold text-white flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> {data?.profile?.firstName || 'أحمد'} {data?.profile?.lastName || 'محمد'}</p>
                <p className="text-[7px] text-gray-400">إدارة محافظة أو (مسؤول النظام)</p>
              </div>
            </div>
          </div>

          <div className="p-4 text-center border-b border-[#1e2d45]">
            <h3 className="text-[#C9A84C] font-bold text-[13px] mb-1">المساعد الذكي السياحي</h3>
            <p className="text-gray-400 text-[8px]">اسألني عن أي معلومة سياحية أو تحليل تريده</p>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-4 custom-scrollbar">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'} w-full`}>
                <div className="flex gap-1.5 max-w-full">
                  {msg.role === 'user' && <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0 mt-1"><Users className="w-2.5 h-2.5 text-[#0A1628]" /></div>}
                  <div className={`p-2.5 text-[9px] leading-relaxed relative ${
                    msg.role === 'user'
                      ? 'text-white border-b border-white/20' 
                      : 'bg-[#0f1f33] text-gray-300 rounded-lg border border-[#1e2d45]'
                  }`}>
                    {msg.role === 'assistant' && <div className="absolute top-2.5 left-2.5"><FileCheck className="w-3 h-3 text-[#4CC9F0]" /></div>}
                    <div style={{ whiteSpace: 'pre-wrap' }} className={msg.role === 'assistant' ? "pr-5" : ""}>{msg.content}</div>
                  </div>
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-end w-full">
                <div className="bg-[#0f1f33] p-2.5 rounded-lg border border-[#1e2d45]">
                  <Loader2 className="w-3.5 h-3.5 text-[#C9A84C] animate-spin" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-3 border-t border-[#1e2d45] space-y-3">
             <div className="text-right">
               <p className="text-[8px] text-[#C9A84C] mb-1.5 pr-1">أسئلة مقترحة</p>
               <div className="grid grid-cols-2 gap-1.5">
                 {["ما هي المعالم الأقل زيارة؟", "تحليل الاتجاهات (دخل سياحي)", "قارن بين المحافظات", "ما هي أفضل وقت لزيارة القاهرة؟"].map((s, i) => (
                   <button key={i} onClick={e => handleChat(e, s)} className="bg-transparent border border-[#1e2d45] hover:bg-white/5 text-[7px] text-gray-400 py-1.5 px-1 rounded transition text-center">{s}</button>
                 ))}
               </div>
             </div>
             <form onSubmit={handleChat} className="relative">
                <input type="text" value={chatMessage} onChange={e => setChatMessage(e.target.value)} placeholder="اكتب سؤالك هنا..." className="w-full bg-[#0A1628] border border-[#1e2d45] rounded-md pl-8 pr-3 py-2 text-[9px] text-white focus:outline-none focus:border-[#C9A84C]" />
                <button type="submit" disabled={!chatMessage.trim() || chatLoading} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#4CC9F0] hover:text-white disabled:opacity-50"><Send className="w-3 h-3" /></button>
             </form>
             <button onClick={exportPDF} disabled={exportingPDF} className="w-full py-2 bg-gradient-to-l from-[#C9A84C] to-[#E8D08D] text-[#0A1628] font-bold text-[10px] rounded-md shadow-md flex justify-center items-center gap-1.5 hover:opacity-90 transition disabled:opacity-50">
               {exportingPDF ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileText className="w-3 h-3" />}
               {exportingPDF ? 'جاري التصدير...' : 'تصدير التقرير الكامل'}
             </button>
             <div className="text-center">
                <p className="text-[7px] text-gray-500">تقرير شامل عن أداء السياحة في محافظة القاهرة</p>
                <div className="flex items-center justify-center gap-1 mt-1 opacity-50"><span className="text-[#C9A84C] text-[8px]">☥</span><span className="text-gray-500 text-[6px]">مصر.. دائماً في تطوّر</span></div>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
