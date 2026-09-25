'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function TourismActivityChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 bg-white rounded-[10px]" dir="rtl">
        <p className="text-gray-500 font-medium">لا توجد بيانات</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-[10px] p-5" dir="rtl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-[#0B1F2A]">إشارات التحقق المؤكدة</h3>
        <div className="flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-2 py-1 rounded-full font-bold">
          مستقر
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-0" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E9EC" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 10 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 10 }} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              labelStyle={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}
            />
            <Line 
              type="monotone" 
              dataKey="checkins" 
              stroke="#2684C6" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#C8A24A', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
