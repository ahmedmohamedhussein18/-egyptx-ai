'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function TourismDistribution({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 bg-white rounded-[10px]" dir="rtl">
        <p className="text-gray-500 font-medium">لا توجد بيانات</p>
      </div>
    );
  }

  const COLORS = ['#2684C6', '#C8A24A', '#19A974', '#9b59b6', '#e67e22', '#e74c3c'];

  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col h-full bg-white rounded-[10px] p-5" dir="rtl">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-[#0B1F2A]">أكثر الفئات السياحية زيارة</h3>
      </div>
      
      <div className="flex-1 flex items-center justify-between min-h-0">
        {/* Left Side: Legend (rendered on physical right side because dir="rtl", wait no, in flex row RTL, 1st item is right, 2nd is left. So this is the RIGHT side physically) */}
        <div className="flex-1 h-full w-1/2 relative" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #E5E9EC', fontSize: '12px' }}
                itemStyle={{ color: '#0B1F2A' }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center Total */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] text-gray-500">الإجمالي</span>
            <span className="text-sm font-bold text-[#0B1F2A]">{total.toLocaleString()}</span>
          </div>
        </div>

        {/* Right Side: Legend List (physically left) */}
        <div className="w-1/2 flex flex-col gap-2 overflow-y-auto pl-2">
          {data.map((item, index) => {
            const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  <span className="text-[10px] text-gray-700">{item.name}</span>
                </div>
                <span className="text-[10px] font-bold text-[#0B1F2A]">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
