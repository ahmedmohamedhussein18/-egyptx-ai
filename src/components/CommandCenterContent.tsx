'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Activity, MapPin, 
  BarChart3, Loader2, Calendar, Map, PieChart as PieChartIcon,
  Home, LayoutDashboard, Compass, Database, TrendingUp, Landmark, FileText, Settings, Key,
  Bot, Send
} from 'lucide-react';
import dynamic from 'next/dynamic';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell
} from 'recharts';

const MapLeaflet = dynamic(() => import('@/components/MapLeaflet'), { ssr: false });

const COLORS = ['#C9A84C', '#1B6B93', '#4CC9F0', '#E8D08D', '#0A1628'];

export default function CommandCenterContent() {
  const [dateRange, setDateRange] = useState('today'); 
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [governorate, setGovernorate] = useState('cairo');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [data, setData] = useState<any>(null);

  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([
    { role: 'assistant', content: 'أهلاً بك في المساعد الذكي السياحي. كيف يمكنني مساعدتك اليوم؟' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchData();
  }, [dateRange, customStart, customEnd, governorate, activeTab]);

  async function fetchData() {
    if (dateRange === 'custom' && (!customStart || !customEnd)) {
      return; 
    }
    
    setLoading(true);
    setError(null);
    try {
      let url = `/api/command-center?range=${dateRange}&governorate=${governorate}`;
      if (dateRange === 'custom') {
        url += `&startDate=${customStart}&endDate=${customEnd}`;
      }

      const res = await fetch(url, { credentials: 'include' });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to fetch dashboard data');
      }

      setData(json);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleChatSubmit = async (e: React.FormEvent, forceMsg?: string) => {
    e.preventDefault();
    const msg = forceMsg || chatMessage;
    if (!msg.trim()) return;

    const newHistory = [...chatHistory, { role: 'user', content: msg }];
    setChatHistory(newHistory);
    setChatMessage('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/government-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ messages: newHistory, dashboardData: data })
      });
      const json = await res.json();
      
      if (res.ok) {
        setChatHistory([...newHistory, { role: 'assistant', content: json.response }]);
      } else {
        setChatHistory([...newHistory, { role: 'assistant', content: 'عذراً، حدث خطأ أثناء الاتصال بالمساعد الذكي.' }]);
      }
    } catch (err) {
      setChatHistory([...newHistory, { role: 'assistant', content: 'عذراً، حدث خطأ أثناء الاتصال بالمساعد الذكي.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const kpis = data?.kpis || {};
  const charts = data?.charts || {};
  const mapData = data?.mapData || [];
  const profile = data?.profile || {};

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0A1628] border border-[#C9A84C]/30 p-3 rounded-lg shadow-xl" dir="rtl">
          <p className="text-white text-sm mb-1">{label}</p>
          <p className="text-[#C9A84C] font-bold">
            العدد: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans flex flex-col pt-20 pb-0" dir="rtl">
      
      {/* HEADER */}
      <header className="w-full bg-[#0A1628] border-b border-white/10 px-6 py-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-xl flex items-center justify-center">
            {/* Ankh symbol simple SVG */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="7" r="4" />
              <path d="M12 11v10" />
              <path d="M8 15h8" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">وزارة السياحة والآثار - مركز المعلومات السياحية الوطني</h1>
            <p className="text-[#C9A84C] text-sm font-medium">EgyptX AI - National Smart Tourism Ecosystem</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex bg-[#030712] rounded-lg border border-white/10 p-1">
            {(['today', '7d', '30d', 'custom'] as const).map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 text-xs font-bold rounded-md transition-colors ${
                  dateRange === range 
                  ? 'bg-[#C9A84C] text-[#0A1628]' 
                  : 'text-gray-400 hover:text-white'
                }`}
              >
                {range === 'today' ? 'اليوم' : range === '7d' ? 'آخر 7 أيام' : range === '30d' ? 'آخر 30 يوم' : 'مخصص'}
              </button>
            ))}
          </div>
          <div className="text-left border-r border-white/10 pr-6">
            <p className="text-white font-bold">{profile.firstName || 'مستخدم'} {profile.lastName || ''}</p>
            <p className="text-gray-400 text-xs">مدير النظام الوطني</p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR (Visual Right in RTL) */}
        <aside className="w-64 bg-[#0A1628] border-l border-white/10 overflow-y-auto hidden lg:block shrink-0">
          <nav className="p-4 space-y-2">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'dashboard' ? 'bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20 font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white font-medium'}`}>
              <LayoutDashboard className="w-5 h-5" />
              <span>لوحة المعلومات</span>
            </button>
            <button onClick={() => setActiveTab('governorates')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'governorates' ? 'bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20 font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white font-medium'}`}>
              <MapPin className="w-5 h-5" />
              <span>المحافظات</span>
            </button>
            <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'analytics' ? 'bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20 font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white font-medium'}`}>
              <Database className="w-5 h-5" />
              <span>التحليلات والبيانات</span>
            </button>
            <button onClick={() => setActiveTab('heritage')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'heritage' ? 'bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20 font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white font-medium'}`}>
              <Landmark className="w-5 h-5" />
              <span>التراث والمناطق</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">الزوار والتنبؤات</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
              <span className="font-medium">التقارير والتصدير</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">إدارة المحتوى</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
              <span className="font-medium">إعدادات النظام</span>
            </button>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#030712] relative">
          <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
            
            {error ? (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-xl text-center mb-8">
                <h3 className="font-bold text-lg mb-2">خطأ في تحميل البيانات</h3>
                <p>{error}</p>
              </div>
            ) : loading && !data ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-[#C9A84C]">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <span className="text-lg font-bold">جاري تحميل البيانات...</span>
              </div>
            ) : (
              <div className="space-y-6">
                
                {activeTab === 'dashboard' && (
                  <>
                    <div className="flex justify-between items-center bg-[#0A1628] p-4 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-400">المحافظة:</span>
                        <select 
                          value={governorate}
                          onChange={(e) => setGovernorate(e.target.value)}
                          className="bg-[#030712] border border-[#C9A84C]/30 text-white rounded-lg px-4 py-2 font-bold outline-none focus:border-[#C9A84C]"
                        >
                          <option value="cairo">القاهرة</option>
                          {data?.governoratesList?.map((g: any) => (
                            <option key={g.id} value={g.id}>{g.name_ar || g.name_en}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                      {[
                        { title: 'جلسات المنصة', value: kpis.totalSessions, icon: <Activity className="text-blue-400" />, trend: '+12.5%' },
                        { title: 'المستخدمون المسجلون', value: kpis.registeredUsers, icon: <Users className="text-green-400" />, trend: '+8.2%' },
                        { title: 'خطط الرحلات المُنشأة', value: kpis.tripPlansCreated, icon: <Compass className="text-purple-400" />, trend: '+24.1%' },
                        { title: 'مشاهدات صفحات المعالم', value: kpis.attractionViews, icon: <PieChartIcon className="text-orange-400" />, trend: '+5.4%' },
                        { title: 'إشارات التحقق الموثقة', value: kpis.verifiedCheckins, icon: <MapPin className="text-[#C9A84C]" />, trend: '+18.9%' },
                        { title: 'إشارات تحقق مرتقبة', value: kpis.verifiedCheckins, icon: <MapPin className="text-yellow-400" />, trend: '+15.2%' }
                      ].map((kpi, i) => (
                        <div key={i} className="bg-[#0A1628] border border-white/10 rounded-2xl p-5 hover:border-[#C9A84C]/30 transition-colors">
                          <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">{kpi.icon}</div>
                            <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">{kpi.trend}</span>
                          </div>
                          <p className="text-gray-400 text-xs font-medium mb-1 truncate">{kpi.title}</p>
                          <h3 className="text-2xl font-bold text-white">
                            {kpi.value > 0 ? kpi.value : <span className="text-sm font-normal text-gray-500">0</span>}
                          </h3>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="bg-[#0A1628] border border-white/10 rounded-2xl p-6 h-[400px] flex flex-col relative">
                        <h3 className="text-lg font-bold text-white mb-4">الخريطة التفاعلية</h3>
                        <div className="flex-1 w-full relative z-0 rounded-xl overflow-hidden border border-white/5">
                          <MapLeaflet attractions={mapData} selectedId={null} onMarkerClick={() => {}} />
                        </div>
                      </div>

                      <div className="bg-[#0A1628] border border-white/10 rounded-2xl p-6 h-[400px] flex flex-col">
                        <h3 className="text-lg font-bold text-white mb-4">إشارات التحقق الموثقة بمرور الوقت</h3>
                        <div className="flex-1 w-full">
                          {charts.checkinsOverTime.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={charts.checkinsOverTime}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="date" stroke="#6b7280" tick={{fill: '#9ca3af', fontSize: 12}} tickLine={false} axisLine={false} />
                                <YAxis stroke="#6b7280" tick={{fill: '#9ca3af', fontSize: 12}} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="checkins" stroke="#C9A84C" strokeWidth={3} dot={{ fill: '#C9A84C', r: 4 }} />
                              </LineChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">لا توجد بيانات تحقق لهذه الفترة</div>
                          )}
                        </div>
                      </div>

                      <div className="bg-[#0A1628] border border-white/10 rounded-2xl p-6 h-[400px] flex flex-col">
                        <h3 className="text-lg font-bold text-white mb-4">أكثر الفئات السياحية زيارة</h3>
                        <div className="flex-1 w-full">
                          {charts.categoryDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={charts.categoryDistribution}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  paddingAngle={5}
                                  dataKey="value"
                                >
                                  {charts.categoryDistribution.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                              </PieChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">لا توجد بيانات لهذه الفترة</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'governorates' && (
                  <div className="bg-[#0A1628] border border-white/10 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">المحافظات</h3>
                    {data?.governoratesList && data.governoratesList.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.governoratesList.map((g: any) => (
                          <div key={g.id} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#C9A84C]/50 transition-colors cursor-pointer flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#1B6B93]/30 flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-[#4CC9F0]" />
                            </div>
                            <div>
                              <h4 className="font-bold text-white">{g.name_ar || g.name_en}</h4>
                              <p className="text-xs text-gray-400">محافظة</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-20 text-center text-gray-500 border border-dashed border-white/10 rounded-xl">لا توجد بيانات متاحة حالياً</div>
                    )}
                  </div>
                )}

                {activeTab === 'analytics' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white">التحليلات والبيانات التفصيلية</h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-[#0A1628] border border-white/10 rounded-2xl p-6 h-[400px] flex flex-col">
                        <h3 className="text-lg font-bold text-white mb-4">أبرز الوجهات طلباً في مخطط الرحلات</h3>
                        <div className="flex-1 w-full">
                          {charts.topTripDestinations && charts.topTripDestinations.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={charts.topTripDestinations} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                <XAxis type="number" stroke="#6b7280" tick={{fill: '#9ca3af', fontSize: 12}} tickLine={false} axisLine={false} allowDecimals={false} />
                                <YAxis type="category" dataKey="name" stroke="#6b7280" tick={{fill: '#9ca3af', fontSize: 11}} tickLine={false} axisLine={false} width={100} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="requests" name="الطلبات" fill="#1B6B93" radius={[4, 0, 0, 4]} barSize={20} />
                              </BarChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">لا توجد خطط رحلات لهذه الفترة</div>
                          )}
                        </div>
                      </div>

                      <div className="bg-[#0A1628] border border-white/10 rounded-2xl p-6 overflow-hidden">
                        <h3 className="text-lg font-bold text-white mb-4">أكثر المعالم زيارة في القاهرة (التحقق الفعلي)</h3>
                        <div className="overflow-x-auto max-h-[300px]">
                          <table className="w-full text-right">
                            <thead>
                              <tr className="border-b border-white/10 text-gray-400 text-sm">
                                <th className="pb-3 font-medium">اسم المعلم</th>
                                <th className="pb-3 font-medium text-left">عدد الزيارات</th>
                              </tr>
                            </thead>
                            <tbody>
                              {charts.topAttractionsTable && charts.topAttractionsTable.length > 0 ? (
                                charts.topAttractionsTable.map((attr: any, i: number) => (
                                  <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                    <td className="py-3 text-white font-medium">{attr.name}</td>
                                    <td className="py-3 text-[#C9A84C] font-bold text-left">{attr.checkins}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={2} className="py-8 text-center text-gray-500">لا توجد زيارات موثقة بعد</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'heritage' && (
                  <div className="bg-[#0A1628] border border-white/10 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">التراث والمناطق</h3>
                    {data?.attractionsList && data.attractionsList.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {data.attractionsList.map((a: any) => (
                          <div key={a.id} className="p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-2">
                            <div className="w-full h-32 bg-[#030712] rounded-lg mb-2 flex items-center justify-center">
                              <Landmark className="w-10 h-10 text-[#C9A84C]/50" />
                            </div>
                            <h4 className="font-bold text-white truncate" title={a.name_ar || a.name_en}>{a.name_ar || a.name_en}</h4>
                            <p className="text-xs text-[#4CC9F0]">{a.category || 'معلم سياحي'}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-20 text-center text-gray-500 border border-dashed border-white/10 rounded-xl">لا توجد بيانات متاحة حالياً</div>
                    )}
                  </div>
                )}

                {/* BOTTOM ACTION BAR */}
                <div className="flex flex-wrap items-center justify-center gap-4 bg-[#0A1628] p-4 rounded-2xl border border-white/10 mt-8 pb-4">
                  <button className="px-6 py-3 bg-[#C9A84C] text-[#0A1628] font-bold rounded-xl hover:bg-[#E8D08D] transition-colors">استكشف مصر</button>
                  <button className="px-6 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">استخدام الذكاء الاصطناعي</button>
                  <button className="px-6 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">تصدير التقارير PDF/Excel</button>
                  <button className="px-6 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">مركز المساعدة</button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* AI ASSISTANT PANEL (Visual Left in RTL) */}
        <aside className="w-80 bg-[#0A1628] border-r border-white/10 flex flex-col shrink-0 hidden xl:flex">
          <div className="p-6 border-b border-white/10 bg-gradient-to-b from-[#1B6B93]/20 to-transparent">
            <div className="flex items-center gap-3 mb-2">
              <Bot className="w-6 h-6 text-[#C9A84C]" />
              <h3 className="text-lg font-bold text-white">المساعد الذكي السياحي</h3>
            </div>
            <p className="text-gray-400 text-sm">اسألني عن أي معلومة سياحية أو تحليل تريده</p>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-2xl max-w-[85%] text-sm ${
                  msg.role === 'user' 
                  ? 'bg-[#C9A84C] text-[#0A1628] rounded-tl-none font-medium' 
                  : 'bg-white/5 border border-white/10 text-white rounded-tr-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white rounded-tr-none">
                  <Loader2 className="w-4 h-4 animate-spin text-[#C9A84C]" />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/10 bg-[#030712]">
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                "ما هي أهم الأماكن الحيوية في القاهرة؟",
                "تحليل المعالم الأكثر تفاعلاً",
                "قارن بين المحافظات",
                "ما هي المعالم الأقل زيارة؟"
              ].map((suggestion, i) => (
                <button 
                  key={i}
                  onClick={(e) => handleChatSubmit(e, suggestion)}
                  className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-3 py-1.5 rounded-full transition-colors text-right"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <form onSubmit={handleChatSubmit} className="flex gap-2">
              <input 
                type="text" 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="اكتب سؤالك هنا..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
                disabled={chatLoading}
              />
              <button 
                type="submit"
                disabled={chatLoading || !chatMessage.trim()}
                className="w-10 h-10 flex items-center justify-center bg-[#C9A84C] text-[#0A1628] rounded-xl hover:bg-[#E8D08D] transition-colors disabled:opacity-50 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-4">
              <button className="w-full py-2 bg-[#1B6B93]/20 border border-[#1B6B93]/50 text-[#4CC9F0] text-sm font-bold rounded-xl hover:bg-[#1B6B93]/40 transition-colors">
                تصدير التقرير الكامل
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
