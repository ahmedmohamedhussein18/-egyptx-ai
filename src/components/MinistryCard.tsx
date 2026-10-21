'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ExternalLink, Landmark, ScrollText, ShieldCheck, FileText } from 'lucide-react';

export interface MinistryItem {
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  url: string;
  tag: string;
  image: string;
  iconName: 'Landmark' | 'ScrollText' | 'ShieldCheck' | 'FileText';
}

const ICONS = {
  Landmark,
  ScrollText,
  ShieldCheck,
  FileText,
};

export default function MinistryCard({ inst }: { inst: MinistryItem }) {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';
  const [imgError, setImgError] = useState(false);
  const Icon = ICONS[inst.iconName] || Landmark;

  const mainName = isAr ? inst.nameAr : inst.nameEn;
  const subName = isAr ? inst.nameEn : inst.nameAr;
  const mainDesc = isAr ? inst.descAr : inst.descEn;

  return (
    <div
      onClick={() => {
        if (typeof window !== 'undefined') {
          window.open(inst.url, '_blank', 'noopener,noreferrer');
        }
      }}
      className="relative overflow-hidden rounded-2xl group cursor-pointer border border-white/10 hover:border-[#C9A84C]/60 group-hover:border-[#C9A84C]/60 transition-all duration-500 bg-[#0A1628] min-h-[320px] flex flex-col justify-between shadow-lg"
    >
      {/* Background Image or Gradient Placeholder */}
      {inst.image && !imgError ? (
        <img
          src={inst.image}
          alt={mainName}
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#122C38] to-[#1B6B93]/20 flex flex-col items-center justify-center p-6 text-center">
          <Icon className="w-16 h-16 text-[#C9A84C]/40 mb-3 group-hover:scale-110 transition-transform duration-500" />
          <span className="text-base font-bold text-gray-300 drop-shadow">{mainName}</span>
          <span className="text-xs text-[#E2CB85]/70 mt-1">{subName}</span>
        </div>
      )}

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/70 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col justify-between h-full flex-1">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/20 border border-[#C9A84C]/40 flex items-center justify-center text-[#C9A84C] group-hover:scale-110 transition-transform shadow-sm backdrop-blur-sm">
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#E2CB85] uppercase tracking-wider bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#C9A84C]/30">
              {inst.tag}
            </span>
          </div>

          <h3 className="text-xl font-bold text-white group-hover:text-[#C9A84C] transition-colors mb-1 drop-shadow-md">
            {mainName}
          </h3>
          <h4 className="text-sm font-semibold text-[#E2CB85]/90 mb-3 font-serif drop-shadow">
            {subName}
          </h4>

          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed mb-4 drop-shadow">
            {mainDesc}
          </p>
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-auto">
          <span className="text-[11px] text-gray-400 font-mono">
            {isAr ? 'بوابة رسمية معتمدة' : 'Verified Portal'}
          </span>
          <a
            href={inst.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#C9A84C] hover:text-[#030712] text-xs font-semibold text-white transition-all shadow-sm backdrop-blur-sm"
          >
            <span>{isAr ? 'زيارة البوابة الرسمية' : 'Visit Official Portal'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
