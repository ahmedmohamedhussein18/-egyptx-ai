'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { Loader2, BarChart3, TrendingUp, Search } from 'lucide-react';

type AnalyticsEvent = {
  id: string;
  event_type: string;
  created_at: string;
  metadata?: any;
};

export default function AnalyticsContent() {
  const [filter, setFilter] = useState<string>('7'); // '1', '7', '30', 'custom'
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/government/analytics?days=${filter}`);
        const json = await res.json();
        if (json.data) setEvents(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [filter]);

  // Process data for charts
  const { pageViewsData, plannerData, searchData } = useMemo(() => {
    // Group by date string
    const grouped: Record<string, { pageViews: number; planner: number; search: number }> = {};
    
    // Using Arabic locale for date formatting for local appeal
    events.forEach(ev => {
      const d = new Date(ev.created_at);
      const dateStr = d.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
      if (!grouped[dateStr]) {
        grouped[dateStr] = { pageViews: 0, planner: 0, search: 0 };
      }
      
      const type = (ev.event_type || '').toLowerCase();
      if (type.includes('page_view') || type.includes('pageview') || type.includes('view')) {
        grouped[dateStr].pageViews += 1;
      } else if (type.includes('planner') || type.includes('ai') || type.includes('plan')) {
        grouped[dateStr].planner += 1;
      } else if (type.includes('search') || type.includes('query')) {
        grouped[dateStr].search += 1;
      }
    });

    const dates = Object.keys(grouped);
    
    const pageViewsData = dates.map(d => ({ date: d, count: grouped[d].pageViews })).filter(d => d.count > 0);
    const plannerData = dates.map(d => ({ date: d, count: grouped[d].planner })).filter(d => d.count > 0);
    const searchData = dates.map(d => ({ date: d, count: grouped[d].search })).filter(d => d.count > 0);

    return { pageViewsData, plannerData, searchData };
  }, [events]);

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-gray-400">
      <BarChart3 className="w-10 h-10 mb-3 opacity-20" />
      <p className="text-sm font-medium">لا توجد بيانات لهذه الفترة</p>
    </div>
  );

  return (
    <div className="p-6 md:p-8 w-full max-w-7xl mx-auto space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1628] mb-1">التحليلات والبيانات</h1>
          <p className="text-sm text-gray-500">رصد وتحليل تفاعل المستخدمين والزوار مع المنصة</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
          {[
            { id: '1', label: 'اليوم' },
            { id: '7', label: 'آخر 7 أيام' },
            { id: '30', label: 'آخر 30 يوم' },
            { id: 'custom', label: 'مخصص' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === f.id ? 'bg-[#0A1628] text-[#C9A84C]' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Page Views Chart */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-[#0A1628]/5 rounded-lg text-[#0A1628]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-[#0A1628]">مشاهدات الصفحات</h2>
            </div>
            
            <div className="h-[300px] w-full">
              {pageViewsData.length === 0 ? <EmptyState /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={pageViewsData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#C9A84C" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ color: '#0A1628', fontWeight: 'bold', marginBottom: '4px' }}
                    />
                    <Area type="monotone" dataKey="count" name="مشاهدات" stroke="#C9A84C" strokeWidth={3} fillOpacity={1} fill="url(#colorPv)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* AI Planner Requests */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-[#0A1628]/5 rounded-lg text-[#0A1628]">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-[#0A1628]">طلبات المخطط الذكي (AI)</h2>
            </div>
            
            <div className="h-[250px] w-full">
              {plannerData.length === 0 ? <EmptyState /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={plannerData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <RechartsTooltip 
                      cursor={{ fill: '#f9fafb' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="count" name="طلبات" fill="#0A1628" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Search Queries Volume */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-[#0A1628]/5 rounded-lg text-[#0A1628]">
                <Search className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-[#0A1628]">حجم عمليات البحث</h2>
            </div>
            
            <div className="h-[250px] w-full">
              {searchData.length === 0 ? <EmptyState /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={searchData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSearch" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0A1628" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#0A1628" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="count" name="عمليات بحث" stroke="#0A1628" strokeWidth={2} fillOpacity={1} fill="url(#colorSearch)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
