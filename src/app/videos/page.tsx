import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, ArrowRight, Play, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Egypt Tourism Videos | EgyptX AI',
  description: 'Verified official Egyptian tourism videos and cultural documentaries.',
};

interface VideoDoc {
  videoId: string;
  title: string;
  titleAr: string;
  description: string;
  badge: string;
}

const DOCUMENTARY_VIDEOS: VideoDoc[] = [
  {
    videoId: '7_xGnEbvAi0',
    title: 'Wonders of Egypt · 4K Cinematic Journey',
    titleAr: 'عجائب مصر الخالدة - جولة سينمائية فائقة الدقة',
    description: 'Breathtaking 4K aerial and ground showcase of the Pyramids of Giza, Karnak Temple, and ancient archaeological sites.',
    badge: '4K Cinematic Film',
  },
  {
    videoId: 'o1I0AEnl1E8',
    title: 'Most Amazing Places in Egypt · Comprehensive Guide',
    titleAr: 'أعظم الوجهات السياحية والتاريخية في مصر',
    description: 'An expansive travel expedition across Cairo, Luxor, Aswan, Siwa Oasis, and the Red Sea coasts.',
    badge: 'Travel Guide',
  },
  {
    videoId: 'BapSQFJPMM0',
    title: "Let's Go - Egypt · Beautiful Destinations",
    titleAr: 'استكشف مصر - إنتاج بيوتيفول ديستينيشنز',
    description: 'Award-winning visual tribute celebrating modern Egyptian culture, hospitality, and timeless heritage.',
    badge: 'Global Showcase',
  },
  {
    videoId: 'E17BkcjrAO8',
    title: 'Egypt Full Documentary · Lost Civilization & The Nile',
    titleAr: 'وثائقي حضارة الفراعنة الكبرى وشريان النيل الخالد',
    description: 'Deep historical documentary covering 5,000 years of pharaonic architecture, royal dynasties, and sacred temples.',
    badge: 'Full Documentary',
  },
];

export default function VideosPage() {
  return (
    <main className="min-h-screen bg-[#030712] text-white pt-28 pb-24 font-sans relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#C9A84C]/15 via-[#1B6B93]/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-[#1B6B93]/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-xs font-semibold text-[#E2CB85] uppercase tracking-widest mb-4">
            <Sparkles className="w-4 h-4 text-[#C9A84C]" />
            Official Tourism Cinema · أفلام مصر الوثائقية
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-[#E2CB85] to-[#C9A84C] mb-3">
            Egypt Through a Lens 
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 font-medium">
            Official Egyptian tourism and culture videos
          </p>

          {/* Quick toggle to Reels */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="px-4 py-1.5 rounded-full bg-[#C9A84C] text-[#030712] font-bold text-xs shadow-md">
              Featured Cinema 
            </span>
            <Link
              href="/reels"
              className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C9A84C]/40 text-xs font-medium text-gray-300 hover:text-[#C9A84C] transition-all flex items-center gap-1.5"
            >
              <span>Explore Egypt Reels </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ── 2x2 VIDEO GRID (16:9 LANDSCAPE FORMAT) ───────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {DOCUMENTARY_VIDEOS.map((video) => (
            <div
              key={video.videoId}
              className="rounded-2xl overflow-hidden bg-[#0A1628] border border-[#C9A84C] hover:shadow-[0_0_35px_rgba(201,168,76,0.3)] transition-all duration-300 flex flex-col group"
            >
              {/* 16:9 Landscape Video Container */}
              <div className="relative aspect-video w-full bg-black overflow-hidden border-b border-[#C9A84C]/25">
                <iframe
                  src={`https://www.youtube.com/embed/${video.videoId}?rel=0&modestbranding=1`}
                  width="100%"
                  height="100%"
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen={true}
                  className="w-full h-full border-0"
                />
              </div>

              {/* Title & Info Below */}
              <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 bg-[#0A1628]/95">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-[#C9A84C] bg-[#C9A84C]/15 border border-[#C9A84C]/30 px-2.5 py-0.5 rounded-full">
                      {video.badge}
                    </span>
                    <span className="text-xs font-medium text-gray-400 font-mono">
                      16:9 4K
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#C9A84C] transition-colors leading-tight mb-1">
                    {video.title}
                  </h3>
                  <p className="text-sm font-semibold text-[#E2CB85] font-serif mb-2">
                    {video.titleAr}
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed mb-4">
                    {video.description}
                  </p>
                </div>

                {/* Bottom Row */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-mono">
                    Public Verified Documentary
                  </span>
                  <a
                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#C9A84C] text-[#030712] hover:bg-[#E2CB85] text-xs font-bold transition-all shadow-md"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── FOOTER BANNER ────────────────────────────────────────────────── */}
        <div className="rounded-2xl p-8 bg-gradient-to-r from-[#0A1628] via-[#122C38] to-[#0A1628] border border-[#C9A84C] text-center flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="text-left">
            <h3 className="text-xl font-bold text-white mb-1">
              Looking for vertical mobile reels? 
            </h3>
            <p className="text-sm text-gray-300">
              Experience full-screen TikTok-style Egypt Reels with vertical scroll snap.
            </p>
          </div>
          <Link
            href="/reels"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E2CB85] text-[#030712] font-bold text-sm hover:scale-105 transition-all shadow-lg shrink-0 flex items-center gap-2"
          >
            <span>Watch Egypt Reels </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </main>
  );
}
