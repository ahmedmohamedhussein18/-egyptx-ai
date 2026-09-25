'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function GovernorateActivity({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 bg-white rounded-[10px]" dir="rtl">
        <p className="text-gray-500 font-medium">لا توجد بيانات</p>
      </div>
    );
  }

  // Sort by value descending and take top 5
  const sortedData = [...data].sort((a, b) => b.value - a.value).slice(0, 5);

  return (
    <div className="flex flex-col h-full bg-white rounded-[10px] p-5" dir="rtl">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-[#0B1F2A]">أبرز الوجهات طلباً في مخطط الرحلات</h3>
      </div>
      
      <div className="flex-1 w-full min-h-0" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis 
              type="category" 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#0B1F2A', fontSize: 11, fontWeight: 500 }} 
              width={100}
            />
            <Tooltip 
              cursor={{ fill: '#F5F7F8' }}
              contentStyle={{ borderRadius: '8px', border: '1px solid #E5E9EC', fontSize: '12px' }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#C8A24A' : '#2684C6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
