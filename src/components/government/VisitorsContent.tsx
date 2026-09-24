'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, MapPin, Users, Info, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

type AttractionData = {
  id: string;
  name: string;
  governorate: string;
  checkinsCount: number;
};

type TrendData = {
  date: string;
  count: number;
};

export default function VisitorsContent() {
  const [loading, setLoading] = useState(true);
  const [attractions, setAttractions] = useState<AttractionData[]>([]);
  const [trends, setTrends] = useState<TrendData[]>([]);

  useEffect(() => {
    const fetchVisitorsData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/government/visitors');
        const json = await res.json();
        
        if (json.attractions) {
          setAttractions(json.attractions);
        }
        if (json.trends) {
          setTrends(json.trends);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVisitorsData();
  }, []);

  const getPredictionLabel = (count: number) => {
    if (count < 5) return 'بيانات غير كافية (Insufficient data)';
    if (count < 20) return 'ازدحام منخفض';
    if (count < 50) return 'ازدحام متوسط';
    return 'ازدحام عالي';
  };

  const getPredictionColor = (count: number) => {
    if (count < 5) return 'text-gray-500 bg-gray-100';
    if (count < 20) return 'text-green-700 bg-green-100';
    if (count < 50) return 'text-yellow-700 bg-yellow-100';
    return 'text-red-700 bg-red-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#C9A84C]" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 w-full max-w-7xl mx-auto space-y-8" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-[#0A1628] mb-1">مراقبة الزوار وتسجيل الدخول</h1>
        <p className="text-sm text-gray-500">إحصائيات تسجيل الدخول وتوقعات الحشود للمعالم السياحية</p>
      </div>

      {/* Platform Visit Trends */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-[#0A1628]/5 rounded-lg text-[#0A1628]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-[#0A1628]">اتجاهات زيارة المنصة (آخر 30 يوم)</h2>
        </div>
        
        <div className="h-[250px] w-full">
          {trends.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <TrendingUp className="w-10 h-10 mb-3 opacity-20" />
              <p className="text-sm font-medium">لا توجد بيانات كافية للاتجاهات</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
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
                <Area type="monotone" dataKey="count" name="زيارات" stroke="#C9A84C" strokeWidth={3} fillOpacity={1} fill="url(#colorTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Attractions Check-ins Grid */}
      <div>
        <h2 className="text-xl font-bold text-[#0A1628] mb-4">حالة الحشود وتسجيل الدخول بالمعالم</h2>
        
        {attractions.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center text-gray-400">
            <MapPin className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium text-gray-600">لا توجد بيانات معالم سياحية متاحة حالياً</p>
            <p className="text-sm text-gray-400 mt-1">لم يتم تسجيل أي معالم أو تسجيلات دخول بعد.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractions.map(attr => (
              <div key={attr.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-[#0A1628]">{attr.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="w-3 h-3 ml-1" />
                      {attr.governorate}
                    </div>
                  </div>
                  <div className="bg-[#0A1628]/5 text-[#0A1628] px-3 py-1 rounded-full flex items-center text-sm font-medium">
                    <Users className="w-4 h-4 ml-1.5" />
                    {attr.checkinsCount}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-sm text-gray-500">توقع الحشود (AI):</span>
                  <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${getPredictionColor(attr.checkinsCount)}`}>
                    {getPredictionLabel(attr.checkinsCount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
