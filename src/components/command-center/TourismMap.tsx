'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Maximize2, Crosshair, ChevronDown } from 'lucide-react';
import Image from 'next/image';

const MapInner = dynamic(() => import('./MapInner'), { ssr: false });

export default function TourismMap({ data }: { data: any[] }) {
  const [selectedLocation, setSelectedLocation] = useState<any>(data?.[0] || null);

  return (
    <div className="bg-white border border-[#E5E9EC] rounded-[10px] shadow-sm flex flex-col h-full relative" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b border-[#E5E9EC]">
        <h3 className="font-bold text-[#0B1F2A] text-[15px]">خريطة محافظة القاهرة</h3>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] text-gray-500 cursor-pointer">
            <span className="w-2 h-2 rounded-full bg-[#19A974]"></span>
            حيوية
          </div>
          <div className="flex items-center gap-1 text-[11px] text-gray-500 cursor-pointer">
            <span className="w-2 h-2 rounded-full bg-[#2684C6]"></span>
            القاهرة <ChevronDown className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative rounded-b-[10px] overflow-hidden bg-[#071827]">
        <MapInner data={data} onSelect={setSelectedLocation} />

        {/* Map Overlay Controls (right side in RTL is actually left visually, wait, RTL = right to left, so right side is start. The screenshot shows controls on bottom left) */}
        <div className="absolute bottom-4 left-4 z-[400] flex flex-col gap-2">
          <button className="w-8 h-8 bg-[#0B1F2A]/90 text-white rounded flex items-center justify-center backdrop-blur-sm border border-white/10 hover:bg-[#122C38]">
            <span className="text-lg font-light leading-none">+</span>
          </button>
          <button className="w-8 h-8 bg-[#0B1F2A]/90 text-white rounded flex items-center justify-center backdrop-blur-sm border border-white/10 hover:bg-[#122C38]">
            <span className="text-lg font-light leading-none">-</span>
          </button>
          <button className="w-8 h-8 bg-[#0B1F2A]/90 text-white rounded flex items-center justify-center backdrop-blur-sm border border-white/10 hover:bg-[#122C38] mt-2">
            <Crosshair className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Location Card (Overlay) */}
        {selectedLocation && (
          <div className="absolute bottom-4 right-4 z-[400] bg-white rounded-lg p-2 shadow-lg w-[200px] border border-[#E5E9EC] flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="w-12 h-12 bg-gray-200 rounded object-cover overflow-hidden flex-shrink-0 relative">
                {/* Fallback image style since we might not have images for everything */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#2684C6] to-[#0B1F2A]"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[12px] font-bold text-[#0B1F2A] truncate">{selectedLocation.name_ar || selectedLocation.name_en}</h4>
                <p className="text-[10px] text-gray-500 truncate">{selectedLocation.city || 'القاهرة'}</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#19A974]"></div>
                  <span className="text-[10px] text-[#19A974]">{selectedLocation.checkins || 0} تسجيل اليوم</span>
                </div>
              </div>
            </div>
            <button className="w-full text-center text-[10px] text-white bg-[#0B1F2A] rounded py-1 hover:bg-[#122C38] transition-colors">
              عرض التفاصيل
            </button>
          </div>
        )}

        {/* Legend Overlay (Top Right in RTL) */}
        <div className="absolute top-4 right-4 z-[400] bg-[#0B1F2A]/90 backdrop-blur-sm rounded-lg p-3 border border-white/10 text-white flex flex-col gap-2 shadow-lg">
          <div className="flex items-center justify-between gap-4">
             <span className="text-[10px]">القاهرة</span>
             <MapPin className="w-3 h-3 text-white" />
          </div>
          <div className="h-[1px] w-full bg-white/20 my-1"></div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px]">معالم أثرية</span>
            <span className="w-2 h-2 rounded-full bg-[#C8A24A]"></span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px]">متاحف</span>
            <span className="w-2 h-2 rounded-full bg-[#2684C6]"></span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px]">أماكن ترفيهية</span>
            <span className="w-2 h-2 rounded-full bg-[#9b59b6]"></span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px]">فنادق</span>
            <span className="w-2 h-2 rounded-full bg-[#e67e22]"></span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px]">مطاعم</span>
            <span className="w-2 h-2 rounded-full bg-[#e74c3c]"></span>
          </div>
        </div>

      </div>
    </div>
  );
}
