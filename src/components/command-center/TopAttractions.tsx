'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight, MapPin } from 'lucide-react';

export default function TopAttractions({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 bg-white rounded-[10px]" dir="rtl">
        <MapPin className="w-8 h-8 text-gray-300 mb-2" />
        <p className="text-gray-500 font-medium">لا توجد بيانات</p>
      </div>
    );
  }

  // Assuming data comes from DB like { name: string, checkins: number }
  return (
    <div className="flex flex-col h-full bg-white rounded-[10px] p-5" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-[#0B1F2A]">أكثر المعالم زيارة في القاهرة</h3>
      </div>
      
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
        {data.slice(0, 5).map((item, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#122C38] flex items-center justify-center text-[#C8A24A] font-bold text-xs">
                {i + 1}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#0B1F2A]">{item.name}</span>
                <span className="text-[10px] text-gray-500">القاهرة</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#0B1F2A]">{item.checkins}</span>
              <div className="flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="w-3 h-3" />
                <span>12%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
