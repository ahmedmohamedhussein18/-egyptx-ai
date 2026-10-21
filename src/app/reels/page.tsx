'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Sparkles, 
  ArrowLeft,
  Volume2,
  VolumeX,
  Compass
} from 'lucide-react';

interface ReelData {
  videoId: string;
  title: string;
  titleAr: string;
  creator: string;
  likes: string;
  comments: string;
  shares: string;
  musicTrack: string;
}

const REELS_DATA: ReelData[] = [
  {
    videoId: 'QnkVTKNvB8A',
    title: 'Saqqara Step Pyramid Wonder',
    titleAr: 'عظمة هرم سقارة المدرج وأقدم بناء حجري في التاريخ',
    creator: '@experienceegypt',
    likes: '84.2K',
    comments: '2.4K',
    shares: '14.8K',
    musicTrack: 'Original Sound · Pharaohs Legacy',
  },
  {
    videoId: 'hFZOGqxY2i8',
    title: '4700 Years Old Secret 360° View',
    titleAr: 'أسرار 4700 عام من الحضارة وعجائب الجيزة',
    creator: '@pyramids_magic',
    likes: '129.5K',
    comments: '4.8K',
    shares: '31.2K',
    musicTrack: 'Nile Whispers · Egyptian Traditional',
  },
  {
    videoId: 'itvTuuZvX0Q',
    title: 'Paradise of Egypt - Ancient Wonders',
    titleAr: 'جنة مصر وسحر المعالم الفرعونية الخالدة',
    creator: '@egypt_uncovered',
    likes: '96.1K',
    comments: '3.1K',
    shares: '18.4K',
    musicTrack: 'Echoes of Thebes · Instrumental',
  },
  {
    videoId: 'mRZh95pdeBI',
    title: 'The Great Pyramids of Egypt',
    titleAr: 'الأهرامات العظيمة - رمز الخلود والبناء',
    creator: '@cairo_wanderer',
    likes: '142.0K',
    comments: '5.6K',
    shares: '42.9K',
    musicTrack: 'Cairo Golden Hour · Atmospheric Beats',
  },
  {
    videoId: 'XP5FUbujI-Y',
    title: 'Exploring the Pyramids of Giza',
    titleAr: 'رحلة استكشاف هضبة الجيزة وأسرار الفراعنة',
    creator: '@desert_explorer',
    likes: '73.8K',
    comments: '1.9K',
    shares: '11.3K',
    musicTrack: 'Desert Dunes · Ambient Strings',
  },
];

function ReelItem({ reel, index }: { reel: ReelData; index: number }) {
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const embedUrl = `https://www.youtube.com/embed/${reel.videoId}?autoplay=1&mute=1&loop=1&playlist=${reel.videoId}&controls=0&rel=0&modestbranding=1`;

  return (
    <div className="h-full w-full max-w-sm mx-auto snap-start flex items-center justify-center relative p-2 sm:p-4">
      {/* 9:16 Aspect Ratio Iframe Wrapper with Gold Border & Rounded Corners */}
      <div className="w-full h-full max-h-[82vh] aspect-[9/16] rounded-2xl overflow-hidden relative bg-[#030712] border-2 border-[#C9A84C]/50 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(201,168,76,0.15)] flex flex-col justify-between">
        
        {/* Iframe */}
        <div className="absolute inset-0 w-full h-full bg-black">
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            title={reel.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen={true}
            className="w-full h-full border-0 pointer-events-auto"
          />
        </div>

        {/* Top Badges (TikTok/Reels Header) */}
        <div className="relative z-20 p-4 flex items-center justify-between pointer-events-none">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#C9A84C]/40 text-[11px] font-bold text-[#E2CB85] shadow-md">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Reels #{index + 1}</span>
          </div>

          <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-gray-300 font-mono border border-white/10">
            9:16
          </span>
        </div>

        {/* Floating Right-Side Action Sidebar (TikTok Style) */}
        <div className="absolute right-3 bottom-24 z-30 flex flex-col items-center gap-4">
          {/* Like Button */}
          <button
            onClick={() => setLiked(!liked)}
            className="flex flex-col items-center gap-1 group cursor-pointer"
            title="Like"
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-lg ${
                liked
                  ? 'bg-red-500 text-white scale-110 shadow-red-500/50'
                  : 'bg-black/60 text-white hover:bg-white/20 hover:scale-105 border border-white/20'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            </div>
            <span className="text-[11px] font-bold text-white drop-shadow">
              {liked ? 'Liked' : reel.likes}
            </span>
          </button>

          {/* Comment Button (UI only) */}
          <div className="flex flex-col items-center gap-1 cursor-pointer" title="Comments">
            <div className="w-11 h-11 rounded-full bg-black/60 text-white border border-white/20 flex items-center justify-center backdrop-blur-md hover:bg-white/20 transition-all shadow-lg">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-white drop-shadow">
              {reel.comments}
            </span>
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1 group cursor-pointer"
            title="Share Reel"
          >
            <div className="w-11 h-11 rounded-full bg-black/60 text-white border border-white/20 flex items-center justify-center backdrop-blur-md hover:bg-[#C9A84C] hover:text-[#030712] transition-all shadow-lg">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-white drop-shadow">
              {copied ? 'Copied!' : reel.shares}
            </span>
          </button>

          {/* Audio Indicator */}
          <div className="w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center backdrop-blur-md text-[#C9A84C]">
            <Volume2 className="w-4 h-4 animate-pulse" />
          </div>
        </div>

        {/* Bottom Overlay with Dark Gradient & Title */}
        <div className="relative z-20 bg-gradient-to-t from-[#030712] via-[#030712]/80 to-transparent pt-16 pb-4 px-4 pointer-events-none">
          <p className="text-xs font-bold text-[#C9A84C] drop-shadow mb-1 flex items-center gap-1.5">
            <span>{reel.creator}</span>
            <span className="text-[10px] text-gray-400 font-normal">· Follow</span>
          </p>
          <h3 className="text-sm sm:text-base font-bold text-white leading-snug drop-shadow-md">
            {reel.title}
          </h3>
          <p className="text-xs text-[#E2CB85] font-serif drop-shadow mt-0.5">
            {reel.titleAr}
          </p>
          <p className="text-[11px] text-gray-300/80 truncate mt-1 flex items-center gap-1.5">
            <span></span>
            <span>{reel.musicTrack}</span>
          </p>
        </div>

      </div>
    </div>
  );
}

export default function ReelsPage() {
  return (
    <main className="min-h-screen bg-[url('/Egypt_%20Land%20of%20Eternal%20Beauty.png')] bg-cover bg-center bg-no-repeat bg-fixed bg-black/70 bg-blend-overlay text-white pt-24 pb-8 font-sans relative overflow-hidden flex flex-col justify-between">
      {/* Ambient background glows */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#C9A84C]/15 via-[#1B6B93]/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-[#1B6B93]/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 w-full relative z-10 flex flex-col flex-1">

        {/* ── HEADER BAR ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between py-3 mb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xl"></span>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-[#E2CB85] to-[#C9A84C]">
                Egypt Reels
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block">
                TikTok-style vertical creator feed · Swipe or scroll down
              </p>
            </div>
          </div>

          <Link
            href="/videos"
            className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C9A84C]/40 text-xs font-semibold text-gray-300 hover:text-[#C9A84C] transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Featured Cinema </span>
          </Link>
        </div>

        {/* ── TIKTOK-STYLE VERTICAL SCROLL SNAP FEED ──────────────────────── */}
        <div className="h-[85vh] overflow-y-scroll snap-y snap-mandatory scroll-smooth rounded-3xl border border-white/10 bg-[#0A1628]/40 backdrop-blur-xl shadow-2xl relative scrollbar-none"
             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {REELS_DATA.map((reel, index) => (
            <ReelItem key={reel.videoId} reel={reel} index={index} />
          ))}
        </div>

        {/* ── HELPER FOOTER NOTE ──────────────────────────────────────────── */}
        <div className="text-center py-2 text-[11px] text-gray-400">
          Scroll down or swipe to watch next reel · Muted autoplay enabled
        </div>

      </div>
    </main>
  );
}
