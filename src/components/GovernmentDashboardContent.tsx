'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Download, TrendingUp, Users, Map as MapIcon, ShieldCheck, Activity, MapPin } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import dynamic from 'next/dynamic';

const MapLeaflet = dynamic(() => import('@/components/MapLeaflet'), { ssr: false });

export default function GovernmentDashboardContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const dashboardRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [governorate, setGovernorate] = useState<any>(null);
  
  // Data
  const [stats, setStats] = useState({ checkins: 0, views: 0, plannerReqs: 0, activeUsers: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [attractions, setAttractions] = useState<any[]>([]);
  const [rawEvents, setRawEvents] = useState<any[]>([]);
  const [rawCheckins, setRawCheckins] = useState<any[]>([]);
  
  // AI Agent
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) router.push('/government/login');
      else loadDashboard();
    }
  }, [user, authLoading, router]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      
      // Get Profile
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user?.id).single();
      if (!prof || (prof.role !== 'governorate_admin' && prof.role !== 'governorate_analyst')) {
        router.push('/government/login');
        return;
      }
      setProfile(prof);

      // Get Governorate
      const { data: gov } = await supabase.from('governorates').select('*').eq('id', prof.governorate_id).single();
      setGovernorate(gov);

      // Fetch Attractions in Gov
      const { data: attrs } = await supabase.from('attractions').select('*').eq('governorate_id', prof.governorate_id);
      setAttractions(attrs || []);

      // Fetch Analytics Events for Gov
      // Since normal analytics_events RLS prevents anon users, but Gov Admins have a SELECT policy now.
      const { data: events } = await supabase.from('analytics_events').select('*').eq('governorate_id', prof.governorate_id);
      
      // Fetch Checkins
      const { data: checkins } = await supabase.from('qr_checkins').select('*').eq('governorate_id', prof.governorate_id);

      const evts = events || [];
      const chks = checkins || [];
      setRawEvents(evts);
      setRawCheckins(chks);

      // Calculate KPIs
      const views = evts.filter(e => e.event_type === 'attraction_view').length;
      const plannerReqs = evts.filter(e => e.event_type === 'planner_started').length;
      const activeUsersSet = new Set([...evts.map(e => e.user_id), ...chks.map(c => c.user_id)].filter(Boolean));

      setStats({
        checkins: chks.length,
        views,
        plannerReqs,
        activeUsers: activeUsersSet.size
      });

      // Prepare Chart Data (Last 30 Days Check-ins & Views)
      const last30Days = [...Array(30)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        return d.toISOString().split('T')[0];
      });

      const grouped = last30Days.map(date => {
        const dCheckins = chks.filter(c => c.checked_in_at && c.checked_in_at.startsWith(date)).length;
        const dViews = evts.filter(e => e.created_at && e.created_at.startsWith(date) && e.event_type === 'attraction_view').length;
        return {
          date: date.substring(5), // MM-DD
          Checkins: dCheckins,
          Views: dViews
        };
      });
      setChartData(grouped);

    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAiAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery) return;
    setAiLoading(true);
    setAiResponse('');
    try {
      const res = await fetch('/api/government-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: aiQuery,
          governorate: governorate?.name_en,
          stats
        })
      });
      const data = await res.json();
      setAiResponse(data.reply || 'No response from AI.');
    } catch (err) {
      console.error(err);
      setAiResponse('Failed to query AI Agent.');
    } finally {
      setAiLoading(false);
    }
  };

  const exportPDF = async () => {
    if (!dashboardRef.current) return;
    try {
      const canvas = await htmlToImage.toCanvas(dashboardRef.current, { quality: 1, backgroundColor: '#0A1628' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`EgyptX_${governorate?.code || 'Gov'}_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('Failed to export PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const exportExcel = () => {
    try {
      const wb = XLSX.utils.book_new();
      
      // 1. Summary
      const summaryData = [
        ["Metric", "Value", "Notes"],
        ["Total Verified Check-ins", stats.checkins, ""],
        ["Total Attraction Views", stats.views, ""],
        ["Total AI Planner Requests", stats.plannerReqs, ""],
        ["Total Active Tourists", stats.activeUsers, ""],
        [],
        ["Source: EgyptX First-Party Analytics | Generated: " + new Date().toISOString(), "", ""]
      ];
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

      // 2. Attractions
      const attrData = attractions.length > 0 ? attractions.map(a => ({
        Name: a.name_en,
        City: a.city,
        Category: a.category,
        Verified: a.verified ? "Yes" : "No"
      })) : [{ Name: "", City: "", Category: "", Verified: "" }];
      const attrSheet = XLSX.utils.json_to_sheet(attrData);
      XLSX.utils.book_append_sheet(wb, attrSheet, "Attractions");

      // 3. Check-ins
      const checkinData = rawCheckins.length > 0 ? rawCheckins.map(c => {
        const attrName = attractions.find(a => a.id === c.attraction_id)?.name_en || "Unknown";
        return {
          Attraction: attrName,
          CheckedInAt: c.checked_in_at,
          User: c.user_id,
          Governorate: governorate?.name_en || ""
        };
      }) : [{ Attraction: "", CheckedInAt: "", User: "", Governorate: "" }];
      const checkinSheet = XLSX.utils.json_to_sheet(checkinData);
      XLSX.utils.book_append_sheet(wb, checkinSheet, "Check-ins");

      // 4. Analytics
      const analyticsData = rawEvents.length > 0 ? rawEvents.map(e => {
        const attrName = e.attraction_id ? (attractions.find(a => a.id === e.attraction_id)?.name_en || "Unknown") : "N/A";
        return {
          EventType: e.event_type,
          CreatedAt: e.created_at,
          Attraction: attrName,
          User: e.user_id || "Anonymous"
        };
      }) : [{ EventType: "", CreatedAt: "", Attraction: "", User: "" }];
      const analyticsSheet = XLSX.utils.json_to_sheet(analyticsData);
      XLSX.utils.book_append_sheet(wb, analyticsSheet, "Analytics");

      const govCode = governorate?.code || 'Gov';
      const dateStr = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `EgyptX-Report-${govCode}-${dateStr}.xlsx`);
    } catch (error) {
      console.error('Failed to export Excel:', error);
      alert('Failed to generate Excel report.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8" ref={dashboardRef}>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-[#030712] p-8 rounded-3xl border border-[#1B6B93]/30">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="w-8 h-8 text-[#C9A84C]" />
              <h1 className="text-3xl font-bold text-white uppercase tracking-wider">
                EgyptX Tourism Intelligence
              </h1>
            </div>
            <p className="text-xl text-[#4CC9F0] font-bold">
              {governorate?.name_en} Governorate Command Center
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Data Source: EgyptX First-Party Analytics | Generated: {new Date().toLocaleString()}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={exportExcel}
              className="px-6 py-3 bg-green-600/20 border border-green-500/50 hover:bg-green-600/40 text-green-400 font-bold rounded-lg transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" /> Export Excel
            </button>
            <button
              onClick={exportPDF}
              className="px-6 py-3 bg-[#C9A84C] hover:bg-[#E3C973] text-[#0A1628] font-bold rounded-lg transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" /> Export PDF
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Verified Check-ins', value: stats.checkins, icon: <MapPin className="w-6 h-6 text-[#C9A84C]" />, color: 'border-[#C9A84C]/30' },
            { title: 'Attraction Views', value: stats.views, icon: <Activity className="w-6 h-6 text-[#4CC9F0]" />, color: 'border-[#4CC9F0]/30' },
            { title: 'AI Planner Requests', value: stats.plannerReqs, icon: <TrendingUp className="w-6 h-6 text-purple-400" />, color: 'border-purple-400/30' },
            { title: 'Active Tourists', value: stats.activeUsers, icon: <Users className="w-6 h-6 text-green-400" />, color: 'border-green-400/30' }
          ].map((kpi, idx) => (
            <div key={idx} className={`bg-[#030712] p-6 rounded-2xl border ${kpi.color}`}>
              <div className="flex justify-between items-start mb-4">
                <p className="text-gray-400 font-bold uppercase tracking-wider text-xs">{kpi.title}</p>
                {kpi.icon}
              </div>
              <h2 className="text-4xl font-bold text-white">{kpi.value.toLocaleString()}</h2>
            </div>
          ))}
        </div>

        {/* Chart & AI */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-[#030712] p-6 rounded-3xl border border-white/10 h-[400px] flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Engagement (Last 30 Days)</h3>
            <div className="flex-grow">
              {chartData.length > 0 && stats.views > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4CC9F0" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4CC9F0" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCheckins" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#C9A84C" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#0A1628', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="Views" stroke="#4CC9F0" fillOpacity={1} fill="url(#colorViews)" />
                    <Area type="monotone" dataKey="Checkins" stroke="#C9A84C" fillOpacity={1} fill="url(#colorCheckins)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No verified data available for this period.
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 bg-[#1B6B93]/10 p-6 rounded-3xl border border-[#1B6B93]/30 flex flex-col">
            <h3 className="text-lg font-bold text-[#4CC9F0] mb-4 uppercase tracking-wider">Governorate AI Agent</h3>
            <p className="text-sm text-gray-400 mb-6">Ask questions about your tourism data. The AI analyzes real-time verified metrics.</p>
            
            <form onSubmit={handleAiAsk} className="mt-auto space-y-4">
              <div className="bg-[#030712] p-4 rounded-xl border border-white/10 h-40 overflow-y-auto custom-scrollbar text-sm text-gray-300">
                {aiLoading ? (
                  <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin text-[#C9A84C]" /> AI is thinking...</span>
                ) : aiResponse ? (
                  aiResponse
                ) : (
                  <span className="text-gray-600 italic">Example: "Which metric is growing fastest?" or "ما هي أهم المعالم السياحية؟"</span>
                )}
              </div>
              <input 
                type="text"
                value={aiQuery}
                onChange={e => setAiQuery(e.target.value)}
                placeholder="Ask your data..."
                className="w-full bg-[#030712] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C]"
              />
              <button type="submit" disabled={aiLoading || !aiQuery} className="w-full py-3 bg-[#4CC9F0] text-[#0A1628] hover:bg-white font-bold rounded-lg transition-colors">
                Ask AI
              </button>
            </form>
          </div>

        </div>

        {/* Map */}
        <div className="bg-[#030712] p-6 rounded-3xl border border-white/10">
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
            <MapIcon className="w-5 h-5 text-[#C9A84C]" /> Governorate Attractions
          </h3>
          {attractions.length > 0 ? (
            <MapLeaflet attractions={attractions} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500 border border-dashed border-white/10 rounded-2xl">
              No attractions mapped for this governorate yet.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
