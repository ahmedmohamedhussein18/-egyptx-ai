'use client';

import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Bell, Activity, Users, Map, Eye, QrCode, Building, Sparkles, Send, Download, HelpCircle, AlertCircle, ArrowUpRight, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import MapInner to prevent SSR issues with Leaflet
const MapInner = dynamic(() => import('@/components/command-center/MapInner'), { ssr: false });

export default function CommandCenterContent() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/command-center');
      const json = await res.json();
      setData(json);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const sendChatMessage = async (msg: string) => {
    if (!msg.trim()) return;
    setChatMessages(prev => [...prev, { role: 'user', content: msg }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/government-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...chatMessages, { role: 'user', content: msg }],
          dashboardData: { kpis: data?.kpis }
        })
      });
      const resData = await res.json();
      if (resData.error) {
        setChatMessages(prev => [...prev, { role: 'ai', content: resData.error }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'ai', content: resData.reply || resData.response }]);
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'ai', content: 'عذراً، حدث خطأ في النظام.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#C9A84C] font-bold text-lg animate-pulse">جاري تحميل مركز القيادة...</p>
        </div>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const profile = data?.profile || { firstName: 'مستخدم', lastName: 'النظام', role: 'national_admin' };
  const charts = data?.charts || {};
  const mapData = data?.mapData || [];

  const PIE_COLORS = ['#C9A84C', '#1B6B93', '#19A974', '#9b59b6', '#e67e22'];

  const MotionDiv = motion.div;

  return (
    <div dir="rtl" className="min-h-screen bg-[#0a0f1e] text-white font-sans overflow-x-hidden relative">
      {/* Subtle Egyptian Motif Background */}
      <div className="fixed inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'radial-gradient(#C9A84C 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      {/* HEADER */}
      <header className="w-full bg-[#0a0f1e]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="text-[#C9A84C] text-3xl">☥</div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-wide text-white">EgyptX AI</span>
            <span className="text-[10px] text-[#C9A84C]">National Smart Tourism Ecosystem</span>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-[#C9A84C] absolute left-1/2 -translate-x-1/2 hidden md:block">
          مركز القيادة الوطني للسياحة
        </h1>

        <div className="flex items-center gap-6">
          <button className="relative p-2 text-gray-300 hover:text-[#C9A84C] transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="font-bold text-sm text-white">{profile.firstName} {profile.lastName}</span>
              <span className="text-xs text-[#C9A84C]">{profile.role === 'national_admin' ? 'مدير النظام' : 'مشرف'}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#1B6B93] border-2 border-[#C9A84C] flex items-center justify-center overflow-hidden">
              <span className="text-lg font-bold text-white">{profile.firstName?.charAt(0)}</span>
            </div>
          </div>
        </div>
      </header>
      {/* Decorative Gold Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent opacity-50"></div>

      <main className="p-6 max-w-[1920px] mx-auto space-y-6 relative z-10">
        
        {/* TOP KPI CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { title: 'جلسات المنصة', icon: Activity, value: kpis.totalSessions || 0 },
            { title: 'المستخدمون المسجلون', icon: Users, value: kpis.registeredUsers || 0 },
            { title: 'خطط الرحلات', icon: Map, value: kpis.tripPlansCreated || 0 },
            { title: 'مشاهدات المعالم', icon: Eye, value: kpis.attractionViews || 0 },
            { title: 'تسجيلات الدخول', icon: QrCode, value: kpis.verifiedCheckins || 0 },
            { title: 'المعالم الموثقة', icon: Building, value: data?.attractionsList?.length || 0 },
          ].map((kpi, idx) => (
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={idx}
              className="bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:border-[#C9A84C]/50 hover:shadow-[0_0_15px_rgba(201,168,76,0.15)] transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs text-gray-300 font-medium">{kpi.title}</h3>
                <div className="p-2 rounded-lg bg-[#C9A84C]/10 text-[#C9A84C] group-hover:scale-110 transition-transform">
                  <kpi.icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{kpi.value.toLocaleString()}</span>
                <span className="text-[10px] text-green-400 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" /> 12%
                </span>
              </div>
              <p className="text-[9px] text-gray-500 mt-2">مقارنة بالفترة السابقة</p>
            </MotionDiv>
          ))}
        </div>

        {/* MAIN CONTENT (3 COLUMNS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[500px]">
          
          {/* LEFT: MAP (40% -> 5 cols) */}
          <MotionDiv 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-5 bg-white/[0.03] border border-white/10 rounded-xl flex flex-col overflow-hidden hover:border-[#C9A84C]/50 transition-colors"
          >
            <div className="p-4 border-b border-white/10 bg-white/[0.02]">
              <h3 className="text-lg font-bold text-[#C9A84C] flex items-center gap-2">
                <Map className="w-5 h-5" /> خريطة المعالم السياحية
              </h3>
            </div>
            <div className="flex-1 relative z-0">
              <MapInner data={mapData} onSelect={() => {}} />
            </div>
          </MotionDiv>

          {/* CENTER: CHARTS (30% -> 4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Line Chart */}
            <MotionDiv 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl p-4 flex flex-col hover:border-[#C9A84C]/50 transition-colors"
            >
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#C9A84C]" /> إشارات التحقق عبر الزمن
              </h3>
              <div className="flex-1 w-full min-h-0" dir="ltr">
                {charts.checkinsOverTime?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={charts.checkinsOverTime} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" stroke="#6b7280" tick={{fill: '#9ca3af', fontSize: 10}} tickLine={false} axisLine={false} />
                      <YAxis stroke="#6b7280" tick={{fill: '#9ca3af', fontSize: 10}} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0a0f1e', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="checkins" stroke="#C9A84C" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#C9A84C' }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center opacity-50">
                    <AlertCircle className="w-8 h-8 text-[#C9A84C] mb-2" />
                    <p className="text-sm">لا توجد بيانات تحقق بعد</p>
                  </div>
                )}
              </div>
            </MotionDiv>

            {/* Donut Chart */}
            <MotionDiv 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl p-4 flex flex-col hover:border-[#C9A84C]/50 transition-colors"
            >
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#C9A84C]" /> أكثر الفئات السياحية
              </h3>
              <div className="flex-1 w-full min-h-0 flex items-center justify-center" dir="ltr">
                {charts.categoryDistribution?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={charts.categoryDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="value" stroke="none">
                        {charts.categoryDistribution.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0a0f1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-gray-500">لا توجد بيانات</p>
                )}
              </div>
            </MotionDiv>
          </div>

          {/* RIGHT: AI ASSISTANT (30% -> 3 cols) */}
          <MotionDiv 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-3 bg-white/[0.03] border border-[#C9A84C]/30 rounded-xl flex flex-col shadow-[0_0_30px_rgba(201,168,76,0.05)] hover:shadow-[0_0_30px_rgba(201,168,76,0.1)] transition-all overflow-hidden"
          >
            <div className="p-4 border-b border-[#C9A84C]/20 bg-gradient-to-r from-[#C9A84C]/10 to-transparent">
              <h3 className="text-lg font-bold text-[#C9A84C] flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> المساعد الذكي
              </h3>
              <p className="text-xs text-gray-400 mt-1">اسألني عن بيانات السياحة</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <div className="bg-[#1B6B93]/20 border border-[#1B6B93]/30 rounded-lg p-3 text-sm text-[#D1DFE8]">
                مرحباً بك! أنا مساعدك الذكي لمركز القيادة. يمكنني تحليل البيانات والإجابة عن استفساراتك.
              </div>
              
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'ai' ? 'items-start' : 'items-end'}`}>
                  <div className={`text-sm px-4 py-2 rounded-xl max-w-[90%] ${
                    msg.role === 'ai' 
                      ? 'bg-white/5 border border-white/10 text-white rounded-tr-none' 
                      : 'bg-[#C9A84C] text-[#0a0f1e] font-medium rounded-tl-none'
                  }`}>
                    {msg.role === 'ai' && <Sparkles className="w-3 h-3 text-[#C9A84C] mb-1 inline-block ml-1" />}
                    <span className="whitespace-pre-wrap">{msg.content}</span>
                  </div>
                </div>
              ))}
              
              {chatLoading && (
                <div className="flex items-center gap-2 text-[#C9A84C]">
                  <div className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 border-t border-white/10 space-y-3 bg-[#0a0f1e]/50">
              <div className="flex flex-wrap gap-2">
                {['ما أكثر المعالم زيارة؟', 'حلل أداء المحافظة', 'قارن بين المحافظات', 'ما المعالم الأقل زيارة؟'].map((q, i) => (
                  <button 
                    key={i} 
                    onClick={() => setChatInput(q)}
                    className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-2.5 py-1 rounded-full transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendChatMessage(chatInput)}
                  placeholder="اكتب سؤالك هنا..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#C9A84C]/50 transition-colors placeholder:text-gray-600"
                />
                <button 
                  onClick={() => sendChatMessage(chatInput)}
                  disabled={chatLoading || !chatInput.trim()}
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-[#C9A84C] text-[#0a0f1e] rounded-md hover:bg-[#b59543] disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>
          </MotionDiv>
        </div>

        {/* BOTTOM ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Table */}
          <MotionDiv 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:border-[#C9A84C]/50 transition-colors overflow-hidden h-[300px] flex flex-col"
          >
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Building className="w-4 h-4 text-[#C9A84C]" /> أكثر المعالم زيارة
            </h3>
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
              {charts.topAttractionsTable?.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {charts.topAttractionsTable.slice(0, 5).map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded bg-[#C9A84C]/20 text-[#C9A84C] font-bold text-xs flex items-center justify-center">{i + 1}</span>
                        <span className="text-sm text-gray-200">{item.name}</span>
                      </div>
                      <span className="text-sm font-bold text-[#C9A84C]">{item.checkins} زيارة</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center mt-10">لا توجد بيانات</p>
              )}
            </div>
          </MotionDiv>

          {/* Bar Chart */}
          <MotionDiv 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:border-[#C9A84C]/50 transition-colors h-[300px] flex flex-col"
          >
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Map className="w-4 h-4 text-[#C9A84C]" /> أبرز الوجهات في خطط الرحلات
            </h3>
            <div className="flex-1 w-full min-h-0" dir="ltr">
              {charts.topTripDestinations?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.topTripDestinations} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 11}} width={120} />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#0a0f1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                    <Bar dataKey="requests" radius={[0, 4, 4, 0]} barSize={24}>
                      {charts.topTripDestinations.map((_: any, i: number) => (
                        <Cell key={i} fill={i === 0 ? '#C9A84C' : '#1B6B93'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-gray-500 text-center mt-10">لا توجد بيانات</p>
              )}
            </div>
          </MotionDiv>
        </div>

        {/* ACTION BAR */}
        <MotionDiv 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white/[0.02] border border-white/10 rounded-xl p-4 flex flex-wrap items-center gap-4 justify-between"
        >
          <div className="flex items-center gap-4">
            <button className="bg-[#C9A84C] hover:bg-[#b59543] text-[#0a0f1e] font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
              <Download className="w-4 h-4" /> تصدير PDF
            </button>
            <button className="bg-transparent border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C]/10 font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
              <Download className="w-4 h-4" /> تصدير Excel
            </button>
          </div>
          <button className="text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
            <HelpCircle className="w-4 h-4" /> مركز المساعدة
          </button>
        </MotionDiv>
        
      </main>
    </div>
  );
}
