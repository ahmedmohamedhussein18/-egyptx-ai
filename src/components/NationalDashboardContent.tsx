'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Download, TrendingUp, Users, ShieldCheck, Activity, MapPin, BarChart2, Map as MapIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import dynamic from 'next/dynamic';

const MapLeaflet = dynamic(() => import('@/components/MapLeaflet'), { ssr: false });

export default function NationalDashboardContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const dashboardRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  
  // Data
  const [stats, setStats] = useState({ checkins: 0, views: 0, plannerReqs: 0, activeUsers: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [topAttractions, setTopAttractions] = useState<any[]>([]);
  const [attractions, setAttractions] = useState<any[]>([]);
  const [rawEvents, setRawEvents] = useState<any[]>([]);
  const [rawCheckins, setRawCheckins] = useState<any[]>([]);
  
  // AI Agent
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) router.push('/national/login');
      else loadDashboard();
    }
  }, [user, authLoading, router]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      
      // Get Profile
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user?.id).single();
      if (!prof || prof.role !== 'national_admin') {
        router.push('/national/login');
        return;
      }

      // Fetch All Data
      const [govRes, attrRes, evtRes, chkRes] = await Promise.all([
        supabase.from('governorates').select('id, name_en, code'),
        supabase.from('attractions').select('*'),
        supabase.from('analytics_events').select('*'),
        supabase.from('qr_checkins').select('*')
      ]);

      const govs = govRes.data || [];
      const attrs = attrRes.data || [];
      const evts = evtRes.data || [];
      const chks = chkRes.data || [];

      setAttractions(attrs);
      setRawEvents(evts);
      setRawCheckins(chks);

      // KPIs
      const views = evts.filter(e => e.event_type === 'attraction_view').length;
      const plannerReqs = evts.filter(e => e.event_type === 'planner_started').length;
      const activeUsersSet = new Set([...evts.map(e => e.user_id), ...chks.map(c => c.user_id)].filter(Boolean));

      setStats({
        checkins: chks.length,
        views,
        plannerReqs,
        activeUsers: activeUsersSet.size
      });

      // Governorate Comparison Chart
      const govStats = govs.map(gov => {
        const govChks = chks.filter(c => c.governorate_id === gov.id).length;
        const govPlanner = evts.filter(e => e.governorate_id === gov.id && e.event_type === 'planner_started').length;
        return {
          name: gov.code || gov.name_en,
          Checkins: govChks,
          PlannerRequests: govPlanner,
          total: govChks + govPlanner
        };
      }).filter(g => g.total > 0).sort((a, b) => b.total - a.total).slice(0, 10); // Top 10 govs with data

      setChartData(govStats);

      // Top Attractions
      const attrViews: Record<string, number> = {};
      evts.forEach(e => {
        if (e.event_type === 'attraction_view' && e.attraction_id) {
          attrViews[e.attraction_id] = (attrViews[e.attraction_id] || 0) + 1;
        }
      });
      const topAttrs = attrs.map(a => ({
        ...a,
        views: attrViews[a.id] || 0
      })).sort((a, b) => b.views - a.views).slice(0, 5);

      setTopAttractions(topAttrs);

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
      const res = await fetch('/api/national-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: aiQuery,
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
      pdf.save(`EgyptX_NationalReport_${new Date().toISOString().split('T')[0]}.pdf`);
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
          Governorate: c.governorate_id || "N/A"
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

      const dateStr = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `EgyptX-Report-National-${dateStr}.xlsx`);
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-[#030712] p-8 rounded-3xl border border-[#C9A84C]/30">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="w-8 h-8 text-[#C9A84C]" />
              <h1 className="text-3xl font-bold text-white uppercase tracking-wider">
                EgyptX Tourism Intelligence
              </h1>
            </div>
            <p className="text-xl text-[#C9A84C] font-bold">
              National Command Center
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
            { title: 'Total Verified Check-ins', value: stats.checkins, icon: <MapPin className="w-6 h-6 text-[#C9A84C]" />, color: 'border-[#C9A84C]/30' },
            { title: 'Total Attraction Views', value: stats.views, icon: <Activity className="w-6 h-6 text-[#4CC9F0]" />, color: 'border-[#4CC9F0]/30' },
            { title: 'Total Planner Requests', value: stats.plannerReqs, icon: <TrendingUp className="w-6 h-6 text-purple-400" />, color: 'border-purple-400/30' },
            { title: 'Total Active Tourists', value: stats.activeUsers, icon: <Users className="w-6 h-6 text-green-400" />, color: 'border-green-400/30' }
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

        {/* Chart & Top Attractions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-[#030712] p-6 rounded-3xl border border-white/10 h-[450px] flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#C9A84C]" /> Governorate Comparison
            </h3>
            <div className="flex-grow">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#0A1628', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                    <Legend />
                    <Bar dataKey="Checkins" fill="#C9A84C" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="PlannerRequests" fill="#4CC9F0" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No verified data available across governorates.
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <div className="bg-[#030712] p-6 rounded-3xl border border-white/10 flex flex-col h-[450px]">
              <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">Top Attractions (National)</h3>
              <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 space-y-4">
                {topAttractions.length > 0 ? (
                  topAttractions.map((attr, idx) => (
                    <div key={attr.id} className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#C9A84C]/20 text-[#C9A84C] flex items-center justify-center font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-white truncate text-sm">{attr.name_en}</p>
                        <p className="text-xs text-gray-400">{attr.views} views</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 mt-10">No attraction data yet.</div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* AI & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-[#C9A84C]/10 p-6 rounded-3xl border border-[#C9A84C]/30 flex flex-col">
            <h3 className="text-lg font-bold text-[#C9A84C] mb-4 uppercase tracking-wider">National AI Agent</h3>
            <p className="text-sm text-gray-400 mb-6">Ask questions about national tourism trends. The AI analyzes real-time verified metrics across the entire country.</p>
            
            <form onSubmit={handleAiAsk} className="mt-auto space-y-4">
              <div className="bg-[#030712] p-4 rounded-xl border border-white/10 h-40 overflow-y-auto custom-scrollbar text-sm text-gray-300">
                {aiLoading ? (
                  <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin text-[#C9A84C]" /> AI is thinking...</span>
                ) : aiResponse ? (
                  aiResponse
                ) : (
                  <span className="text-gray-600 italic">Example: "Which governorate is leading in AI Planner requests?"</span>
                )}
              </div>
              <input 
                type="text"
                value={aiQuery}
                onChange={e => setAiQuery(e.target.value)}
                placeholder="Ask national data..."
                className="w-full bg-[#030712] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C]"
              />
              <button type="submit" disabled={aiLoading || !aiQuery} className="w-full py-3 bg-[#C9A84C] text-[#0A1628] hover:bg-white font-bold rounded-lg transition-colors">
                Ask National AI
              </button>
            </form>
          </div>

          <div className="bg-[#030712] p-6 rounded-3xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
              <MapIcon className="w-5 h-5 text-[#C9A84C]" /> National Map Overview
            </h3>
            {attractions.length > 0 ? (
              <MapLeaflet attractions={attractions} />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500 border border-dashed border-white/10 rounded-2xl">
                No attractions mapped yet.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
