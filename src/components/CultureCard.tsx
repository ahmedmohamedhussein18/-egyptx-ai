'use client';

import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

export interface CultureIconItem {
  nameAr: string;
  nameEn: string;
  era: string;
  descAr: string;
  descEn: string;
  category: string;
  link: string;
}

interface CultureCardProps {
  item: CultureIconItem;
  personImage?: string;
}

export default function CultureCard({ item, personImage }: CultureCardProps) {
  const [hasError, setHasError] = useState(false);
  const showImage = Boolean(personImage && !hasError);

  // Derive initials from English name
  const initials = item.nameEn
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative overflow-hidden rounded-2xl group border border-slate-200/80 dark:border-white/10 hover:border-[#C5A059] dark:hover:border-[#C5A059]/60 hover:shadow-xl hover:shadow-[#C5A059]/10 transition-all duration-300 flex flex-col bg-[#F8F3E9] dark:bg-[#0A1628] shadow-sm">
      
      {/* 1. IMAGE CONTAINER: Fixed proportional aspect ratio (aspect-[4/3] or h-64) with overflow-hidden */}
      <div className="relative w-full aspect-[4/3] sm:h-64 overflow-hidden bg-slate-900 shrink-0">
        {showImage ? (
          <img
            src={personImage}
            alt={item.nameEn}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover object-center opacity-90 group-hover:opacity-100 transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0A1628] via-[#1B6B93]/25 to-[#C5A059]/25 flex items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-black/60 border border-[#C5A059]/40 flex items-center justify-center shadow-lg">
              <span className="text-xl font-extrabold text-[#C5A059] select-none font-serif tracking-wider">
                {initials}
              </span>
            </div>
          </div>
        )}

        {/* Subtle Bottom Image Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

        {/* Top Badges (Category & Era) */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#E2CB85] bg-black/75 backdrop-blur-md border border-[#C5A059]/40 px-2.5 py-0.5 rounded-full tracking-wide shadow-sm truncate max-w-[70%]">
            {item.category}
          </span>
          <span className="text-[10px] text-gray-200 font-mono bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/15 shrink-0 shadow-sm">
            {item.era}
          </span>
        </div>

        {/* Bottom Image Overlay Names */}
        <div className="absolute bottom-2.5 left-3 right-3 z-10">
          <h3 className="text-lg sm:text-xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight">
            {item.nameAr}
          </h3>
          <h4 className="text-xs sm:text-sm font-serif font-medium text-[#E2CB85] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-wide">
            {item.nameEn}
          </h4>
        </div>
      </div>

      {/* 2. CONTENT CONTAINER: Alabaster off-white in light mode, obsidian navy in dark */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow bg-[#F8F3E9] dark:bg-[#0A1628]">
        
        {/* Descriptions Block */}
        <div className="space-y-1 mb-4">
          <p className="text-xs sm:text-sm text-[#1A2332] dark:text-gray-200 leading-snug font-medium line-clamp-2">
            {item.descAr}
          </p>
          <p className="text-[11px] sm:text-xs text-slate-600 dark:text-gray-400 leading-snug font-light italic line-clamp-2">
            {item.descEn}
          </p>
        </div>

        {/* Footer Action */}
        <div className="pt-3 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between mt-auto">
          <span className="text-[10px] text-slate-500 dark:text-gray-400 font-mono tracking-wider uppercase">
            EgyptX Heritage
          </span>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/80 dark:bg-white/5 hover:bg-[#C5A059] hover:text-slate-950 dark:hover:bg-[#C5A059] dark:hover:text-slate-950 text-[11px] font-semibold text-[#1A2332] dark:text-white/90 border border-slate-200 dark:border-white/15 hover:border-[#C5A059] transition-all duration-200 cursor-pointer shadow-sm"
          >
            <span>Learn More · اقرأ المزيد</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
}
