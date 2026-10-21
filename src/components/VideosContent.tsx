'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Play,
  Film,
  Compass,
  CheckCircle2,
  ExternalLink,
  Music,
  Eye
} from 'lucide-react';

interface ReelItem {
  id: string;
  youtubeId: string;
  titleEn: string;
  titleAr: string;
  handle: string;
  likes: string;
  comments: string;
  shares: string;
  description: string;
  sound: string;
  tags: string[];
}

interface FeaturedVideoItem {
  youtubeId: string;
  titleEn: string;
  titleAr: string;
  category: string;
  duration: string;
  description: string;
}

const REELS: ReelItem[] = [
  {
    id: 'reel-1',
    youtubeId: 'QnkVTKNvB8A',
    titleEn: 'Saqqara Step Pyramid Wonder',
    titleAr: 'عظمة هرم سقارة المدرج وأقدم بناء حجري في التاريخ',
    handle: '@ExperienceEgypt',
    likes: '142.8K',
    comments: '3.4K',
    shares: '18.9K',
    description: 'Breathtaking timeless journey through the land of the pharaohs, golden sunsets, and vibrant modern life.',
    sound: 'Ancient Nile Symphonies · Original Audio',
    tags: ['#ExperienceEgypt', '#VisitEgypt', '#Pyramids', '#WondersOfTheWorld'],
  },
  {
    id: 'reel-2',
    youtubeId: 'hFZOGqxY2i8',
    titleEn: '4700 Years Old Secret 360° View',
    titleAr: 'أسرار 4700 عام من الحضارة وعجائب الجيزة',
    handle: '@ExperienceEgypt',
    likes: '98.4K',
    comments: '2.1K',
    shares: '11.5K',
    description: 'Explore the monumental wonders from the Great Pyramids to ancient pharaonic sanctuaries and sacred temples.',
    sound: 'Echoes of Thebes · Egyptian Melodies',
    tags: ['#AncientEgypt', '#Wonders', '#Pharaohs', '#Wanderlust'],
  },
  {
    id: 'reel-3',
    youtubeId: 'itvTuuZvX0Q',
    titleEn: 'Paradise of Egypt - Ancient Wonders',
    titleAr: 'جنة مصر وسحر المعالم الفرعونية الخالدة',
    handle: '@ExperienceEgypt',
    likes: '235.1K',
    comments: '6.8K',
    shares: '42.0K',
    description: 'Step inside the royal tombs, majestic columned sanctuaries of Karnak, and the greatest open-air museum.',
    sound: 'Pharaohs Golden Procession · Egyptian Orchestra',
    tags: ['#Luxor', '#Archaeology', '#Karnak', '#ValleyOfTheKings'],
  },
  {
    id: 'reel-4',
    youtubeId: 'mRZh95pdeBI',
    titleEn: 'The Great Pyramids of Egypt',
    titleAr: 'الأهرامات العظيمة - رمز الخلود والبناء',
    handle: '@ExperienceEgypt',
    likes: '176.3K',
    comments: '4.9K',
    shares: '27.4K',
    description: 'Sail the eternal waters of the Nile through Aswan and Nubia, witnessing golden desert dunes and riverbanks.',
    sound: 'Nile Sailing Harmony · Traditional Oud & Flute',
    tags: ['#TheNile', '#NileCruise', '#Aswan', '#EgyptTravel'],
  },
  {
    id: 'reel-5',
    youtubeId: 'XP5FUbujI-Y',
    titleEn: 'Exploring the Pyramids of Giza',
    titleAr: 'رحلة استكشاف هضبة الجيزة وأسرار الفراعنة',
    handle: '@ExperienceEgypt',
    likes: '210.6K',
    comments: '5.2K',
    shares: '31.8K',
    description: 'Experience the electric soul of Egypt: medieval Islamic Cairo, historic Khan el-Khalili bazaar, and the Nile corniche.',
    sound: 'Cairo Nights · Contemporary Oriental Grooves',
    tags: ['#Cairo', '#IslamicCairo', '#KhanElKhalili', '#CityLife'],
  },
];

const FEATURED_VIDEOS: FeaturedVideoItem[] = [
  {
    youtubeId: '7_xGnEbvAi0',
    titleEn: 'Wonders of Egypt · 4K Cinematic Journey',
    titleAr: 'عجائب مصر الخالدة - جولة سينمائية فائقة الدقة',
    category: 'Official Tourism Campaign',
    duration: 'Cinematic Showcase',
    description: 'Breathtaking 4K aerial and ground showcase of the Pyramids of Giza, Karnak Temple, and ancient archaeological sites.',
  },
  {
    youtubeId: 'o1I0AEnl1E8',
    titleEn: 'Most Amazing Places in Egypt · Comprehensive Guide',
    titleAr: 'أعظم الوجهات السياحية والتاريخية في مصر',
    category: 'Historical Heritage',
    duration: 'Monumental Feature',
    description: 'An expansive travel expedition across Cairo, Luxor, Aswan, Siwa Oasis, and the Red Sea coasts.',
  },
  {
    youtubeId: 'BapSQFJPMM0',
    titleEn: "Let's Go - Egypt · Beautiful Destinations",
    titleAr: 'استكشف مصر - إنتاج بيوتيفول ديستينيشنز',
    category: 'Global Showcase',
    duration: 'Temple Highlights',
    description: 'Award-winning visual tribute celebrating modern Egyptian culture, hospitality, and timeless heritage.',
  },
  {
    youtubeId: 'E17BkcjrAO8',
    titleEn: 'Egypt Full Documentary · Lost Civilization & The Nile',
    titleAr: 'وثائقي حضارة الفراعنة الكبرى وشريان النيل الخالد',
    category: 'Full Documentary',
    duration: 'River of Legends',
    description: 'Deep historical documentary covering 5,000 years of pharaonic architecture, royal dynasties, and sacred temples.',
  },
];

export default function VideosContent() {
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
  const [savedReels, setSavedReels] = useState<Record<string, boolean>>({});
  const [copiedNotification, setCopiedNotification] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentReel = REELS[currentReelIndex];

  const handlePrevReel = () => {
    if (currentReelIndex > 0) {
      setCurrentReelIndex(currentReelIndex - 1);
    }
  };

  const handleNextReel = () => {
    if (currentReelIndex < REELS.length - 1) {
      setCurrentReelIndex(currentReelIndex + 1);
    }
  };

  const toggleLike = (reelId: string) => {
    setLikedReels((prev) => ({ ...prev, [reelId]: !prev[reelId] }));
  };

  const toggleSave = (reelId: string) => {
    setSavedReels((prev) => ({ ...prev, [reelId]: !prev[reelId] }));
  };

  const handleShare = (youtubeId: string) => {
    const url = `https://www.youtube.com/watch?v=${youtubeId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-[#C9A84C]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[800px] left-10 w-[500px] h-[500px] bg-[#1B6B93]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-20">
        {/* Header Hero */}
        <header className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#E2CB85] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Cinematic Reels & Video Gallery · معرض وسائط مصر</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#E2CB85] to-[#C9A84C]">
              Egypt Reels & Cinema
            </span>
            <span className="block text-2xl sm:text-3xl font-bold text-[#E2CB85]/90 mt-2 font-arabic">
              فيديوهات وريلز أرض الفراعنة
            </span>
          </h1>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            Immerse yourself in TikTok-style vertical reels and widescreen panoramic cinematic features produced by the official Egyptian Tourism Authority.
          </p>
        </header>

        {/* ── SECTION 1: REELS  (TikTok-Style Vertical Reels) ── */}
        <section id="reels" className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center gap-2.5">
              <span>Egypt Reels</span>
              <span className="text-xl"></span>
              <span className="text-[#C9A84C] font-arabic font-normal text-xl">· ريلز مصر</span>
            </h2>
            <p className="text-xs sm:text-sm text-white/50">
              Vertical full-height interactive reels · Swipe or use controls to browse
            </p>
          </div>

          {/* Reel Interactive Showcase */}
          <div className="flex flex-col items-center justify-center relative">
            {/* Main Phone-style Container */}
            <div
              ref={containerRef}
              className="w-full max-w-[390px] h-[680px] sm:h-[720px] rounded-3xl bg-black border-2 border-[#C9A84C]/40 shadow-[0_0_50px_rgba(201,168,76,0.18)] relative overflow-hidden flex flex-col justify-between group"
            >
              {/* Vertical Video Iframe */}
              <div className="absolute inset-0 w-full h-full overflow-hidden bg-black pointer-events-auto">
                <iframe
                  key={currentReel.youtubeId + (isMuted ? '-muted' : '-unmuted')}
                  src={`https://www.youtube-nocookie.com/embed/${currentReel.youtubeId}?autoplay=1&mute=${
                    isMuted ? '1' : '0'
                  }&loop=1&playlist=${currentReel.youtubeId}&controls=1&modestbranding=1&rel=0`}
                  title={currentReel.titleEn}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0 object-cover"
                />
              </div>

              {/* Top Gradient & Branding Bar */}
              <div className="relative z-20 p-4 pt-5 bg-gradient-to-b from-black/80 via-black/30 to-transparent flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#C9A84C]/30 backdrop-blur-md border border-[#C9A84C]/50 text-[#E2CB85] text-xs font-bold uppercase tracking-wider">
                    EgyptX Reels
                  </span>
                  <span className="text-[11px] font-mono text-white/70 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">
                    {currentReelIndex + 1} / {REELS.length}
                  </span>
                </div>

                {/* Sound Toggle (Interactive) */}
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="pointer-events-auto p-2.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white transition-all cursor-pointer hover:scale-110 active:scale-95"
                  title={isMuted ? 'Click to Unmute' : 'Click to Mute'}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-amber-300" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  )}
                </button>
              </div>

              {/* Right Floating Action Sidebar (TikTok-style) */}
              <div className="absolute right-3.5 bottom-28 z-20 flex flex-col items-center gap-4.5 pointer-events-auto">
                {/* Like Button */}
                <button
                  type="button"
                  onClick={() => toggleLike(currentReel.id)}
                  className="flex flex-col items-center gap-1 group/btn cursor-pointer"
                >
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                      likedReels[currentReel.id]
                        ? 'bg-rose-600 text-white scale-110 shadow-[0_0_15px_rgba(225,29,72,0.5)]'
                        : 'bg-black/50 text-white hover:bg-black/70 border border-white/20 group-hover/btn:scale-105'
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        likedReels[currentReel.id] ? 'fill-current' : ''
                      }`}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-white/90 drop-shadow">
                    {currentReel.likes}
                  </span>
                </button>

                {/* Comments (UI only) */}
                <div className="flex flex-col items-center gap-1 cursor-default">
                  <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-white/90 drop-shadow">
                    {currentReel.comments}
                  </span>
                </div>

                {/* Bookmark Button */}
                <button
                  type="button"
                  onClick={() => toggleSave(currentReel.id)}
                  className="flex flex-col items-center gap-1 group/btn cursor-pointer"
                >
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                      savedReels[currentReel.id]
                        ? 'bg-[#C9A84C] text-[#030712] scale-110 shadow-[0_0_15px_rgba(201,168,76,0.5)]'
                        : 'bg-black/50 text-white hover:bg-black/70 border border-white/20 group-hover/btn:scale-105'
                    }`}
                  >
                    <Bookmark
                      className={`w-5 h-5 ${
                        savedReels[currentReel.id] ? 'fill-current' : ''
                      }`}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-white/90 drop-shadow">
                    Save
                  </span>
                </button>

                {/* Share Button */}
                <button
                  type="button"
                  onClick={() => handleShare(currentReel.youtubeId)}
                  className="flex flex-col items-center gap-1 group/btn cursor-pointer"
                  title="Copy link to video"
                >
                  <div className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all group-hover/btn:scale-105">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-white/90 drop-shadow">
                    Share
                  </span>
                </button>

                {/* Watch Direct YouTube */}
                <a
                  href={`https://www.youtube.com/watch?v=${currentReel.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-red-600/80 hover:bg-red-600 backdrop-blur-md border border-red-500/50 flex items-center justify-center text-white transition-all hover:scale-105 shadow-[0_0_12px_rgba(220,38,38,0.4)]"
                  title="Watch on YouTube"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Bottom Content Overlay */}
              <div className="relative z-20 p-5 pt-8 pb-5 bg-gradient-to-t from-black/95 via-black/70 to-transparent pointer-events-none">
                <div className="space-y-2 pointer-events-auto max-w-[82%]">
                  {/* Channel Handle */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white drop-shadow">
                      {currentReel.handle}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 fill-sky-400/20" />
                    <span className="text-[10px] text-[#E2CB85] bg-[#C9A84C]/20 px-2 py-0.5 rounded-full border border-[#C9A84C]/30 ml-1">
                      Official
                    </span>
                  </div>

                  {/* Reel Titles */}
                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug drop-shadow-md">
                    {currentReel.titleEn}
                  </h3>
                  <p className="text-xs font-semibold text-[#E2CB85] font-arabic drop-shadow">
                    {currentReel.titleAr}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-white/80 line-clamp-2 leading-relaxed drop-shadow">
                    {currentReel.description}
                  </p>

                  {/* Sound track info */}
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-white/70">
                    <Music className="w-3 h-3 text-[#C9A84C] animate-pulse" />
                    <span className="truncate">{currentReel.sound}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {currentReel.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-semibold text-[#E2CB85]/90">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Copied notification alert */}
              {copiedNotification && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 px-4 py-2 rounded-xl bg-black/90 border border-[#C9A84C] text-[#E2CB85] text-xs font-bold shadow-2xl backdrop-blur-md animate-fade-in">
                  ✓ Link Copied to Clipboard!
                </div>
              )}
            </div>

            {/* Vertical Switch Controls (Up / Down) */}
            <div className="flex items-center gap-3 mt-5">
              <button
                type="button"
                onClick={handlePrevReel}
                disabled={currentReelIndex === 0}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentReelIndex === 0
                    ? 'bg-white/5 text-white/30 border border-white/5 cursor-not-allowed'
                    : 'bg-white/10 hover:bg-[#C9A84C] hover:text-[#030712] border border-white/15 text-white'
                }`}
              >
                <ChevronUp className="w-4 h-4" />
                <span>Previous Reel</span>
              </button>

              {/* Progress Indicators */}
              <div className="flex items-center gap-1.5">
                {REELS.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentReelIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentReelIndex === idx
                        ? 'w-6 bg-[#C9A84C]'
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    title={`Go to Reel ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNextReel}
                disabled={currentReelIndex === REELS.length - 1}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentReelIndex === REELS.length - 1
                    ? 'bg-white/5 text-white/30 border border-white/5 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#C9A84C] to-[#E2CB85] text-[#030712] font-extrabold shadow-[0_0_15px_rgba(201,168,76,0.25)]'
                }`}
              >
                <span>Next Reel</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: FEATURED VIDEOS  ("Egypt Through a Lens") ── */}
        <section id="featured-videos" className="space-y-6 pt-10 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
                <Film className="w-6 h-6 text-[#C9A84C]" />
                <span>Featured Videos</span>
                <span className="text-[#C9A84C]">·</span>
                <span className="font-arabic font-normal text-xl text-[#E2CB85]">مصر من عدسة</span>
              </h2>
              <p className="text-xs sm:text-sm text-white/60">
                Widescreen 16:9 cinematic journeys across historical dynasties and panoramic landscapes
              </p>
            </div>

            <span className="text-xs font-mono text-[#E2CB85] bg-[#C9A84C]/10 border border-[#C9A84C]/30 px-3 py-1.5 rounded-xl self-start sm:self-auto">
              {FEATURED_VIDEOS.length} Cinematic Features
            </span>
          </div>

          {/* Horizontal Scroll / Grid of Wider 16:9 Video Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURED_VIDEOS.map((video) => (
              <div
                key={video.youtubeId}
                className="rounded-2xl bg-[#0A1628]/85 backdrop-blur-xl border border-[#C9A84C]/30 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:border-[#C9A84C] transition-all duration-300 flex flex-col justify-between group"
              >
                {/* 16:9 Landscape Embed */}
                <div className="relative w-full aspect-video bg-black/60 border-b border-white/10">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0`}
                    title={video.titleEn}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>

                {/* Card Details */}
                <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#E2CB85]">
                        {video.category}
                      </span>
                      <span className="text-[11px] text-white/50 flex items-center gap-1">
                        <Play className="w-3 h-3 text-[#C9A84C]" />
                        <span>{video.duration}</span>
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#E2CB85] transition-colors">
                        {video.titleEn}
                      </h3>
                      <p className="text-sm font-semibold text-[#E2CB85] font-arabic mt-0.5">
                        {video.titleAr}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                      {video.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-2">
                    <span className="text-[11px] text-white/40 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Experience Egypt Official</span>
                    </span>

                    <a
                      href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600 border border-red-500/40 hover:border-red-500 text-red-200 hover:text-white text-xs font-bold transition-all group-hover:shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Watch</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Callout */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-[#0A1628] via-[#122C38] to-[#0A1628] border border-[#C9A84C]/30 text-center space-y-4 shadow-[0_0_40px_rgba(201,168,76,0.1)]">
          <div className="inline-flex items-center gap-2 p-2 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#E2CB85]">
            <Compass className="w-5 h-5 text-[#C9A84C]" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Ready to Experience Egypt in Person?
          </h3>
          <p className="text-sm text-white/70 max-w-xl mx-auto">
            Book flights, reserve historic palace hotels, or plan your entire journey with the EgyptX AI itinerary creator.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/bookings"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#C9A84C] to-[#E2CB85] text-[#030712] font-bold text-sm shadow-[0_0_20px_rgba(201,168,76,0.35)] hover:scale-105 active:scale-95 transition-all"
            >
              <span>Book Flights & Hotels</span>
            </Link>
            <Link
              href="/planner"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all"
            >
              <span>Launch AI Planner</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
