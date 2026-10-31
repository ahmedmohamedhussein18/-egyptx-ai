'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Crown,
  MapPin,
  Compass,
  Eye,
  LayoutGrid,
  Layers,
  ArrowUpRight,
  X
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface SponsorAmbassador {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  categoryAr: string;
  caption: string;
  captionAr: string;
  monumentName: string;
  monumentNameAr: string;
  location: string;
  locationAr: string;
  photoUrl: string;
  fallbackUrl: string;
  logoText: string;
  quote: string;
  quoteAr: string;
  tier: string;
  tierAr: string;
}

const AMBASSADORS: SponsorAmbassador[] = [
  {
    id: 'alexandria',
    name: 'King Charles III & Queen Camilla',
    nameAr: 'الملك تشارلز الثالث والملكة كاميلا',
    category: 'Global Heritage Patrons',
    categoryAr: 'رعاة التراث العالمي',
    caption: 'Royal Visit to Alexandria',
    captionAr: 'زيارة ملكية لمكتبة الإسكندرية',
    monumentName: 'Bibliotheca Alexandrina',
    monumentNameAr: 'مكتبة الإسكندرية العريقة',
    location: 'Alexandria, Mediterranean',
    locationAr: 'الإسكندرية، البحر المتوسط',
    photoUrl: '/images/sponsor-alexandria.jpg',
    fallbackUrl: '/images/sponsor-alexandria.jpg',
    logoText: 'ROYAL PATRON',
    quote: 'Royal visit to the iconic Bibliotheca Alexandrina, celebrating the preservation of global knowledge and culture.',
    quoteAr: 'زيارة ملكية لمكتبة الإسكندرية العريقة احتفاءً بصون المعرفة العالمية والتراث الثقافي الإنساني.',
    tier: 'Diamond Global Patron',
    tierAr: 'راعي عالمي ملكي',
  },
  {
    id: 'aswan',
    name: 'Global Influencer Explorer',
    nameAr: 'مستكشف ومؤثر عالمي',
    category: 'Cultural Youth Ambassador',
    categoryAr: 'سفير الشباب الثقافي',
    caption: 'Youth Exploration in Aswan',
    captionAr: 'استكشاف معالم أسوان والنوبة',
    monumentName: 'Philae & Aswan Temples',
    monumentNameAr: 'معابد فيلة ونيل أسوان',
    location: 'Aswan, Upper Egypt',
    locationAr: 'أسوان، صعيد مصر',
    photoUrl: '/images/sponsor-aswan.jpg',
    fallbackUrl: '/images/sponsor-aswan.jpg',
    logoText: 'CREATOR VOYAGE',
    quote: 'Experiencing the majestic ancient temples of Aswan, connecting modern youth with timeless Egyptian history.',
    quoteAr: 'معايشة سحر معابد أسوان الخالدة وربط الأجيال الشابة بعراقة التاريخ المصري.',
    tier: 'Heritage Innovation Partner',
    tierAr: 'سفير الشباب الثقافي',
  },
  {
    id: 'citadel',
    name: 'Morgan Freeman',
    nameAr: 'مورغان فريمان',
    category: 'Cinematic Heritage Ambassador',
    categoryAr: 'سفير السينما والتراث العالمي',
    caption: 'Documenting Historic Cairo',
    captionAr: 'توثيق تاريخ وحضارة القاهرة',
    monumentName: 'Citadel of Saladin & Historic Cairo',
    monumentNameAr: 'قلعة صلاح الدين والقاهرة التاريخية',
    location: 'Historic Cairo',
    locationAr: 'القاهرة التاريخية',
    photoUrl: '/images/sponsor-citadel.jpg',
    fallbackUrl: '/images/sponsor-citadel.jpg',
    logoText: 'CINEMATIC ICON',
    quote: 'Exploring the rich Islamic architecture and vibrant historical streets of Cairo, uncovering the deeper stories of human civilization.',
    quoteAr: 'استكشاف روائع العمارة الإسلامية وشوارع القاهرة التاريخية لتوثيق حكايات الحضارة الإنسانية.',
    tier: 'Diamond Global Patron',
    tierAr: 'سفير عالمي سينمائي',
  },
  {
    id: 'gem',
    name: 'Ahmed Helmy',
    nameAr: 'أحمد حلمي',
    category: 'National Arts & Culture Icon',
    categoryAr: 'أيقونة الفن والثقافة الوطنية',
    caption: 'At the Grand Egyptian Museum',
    captionAr: 'في بهو المتحف المصري الكبير',
    monumentName: 'Grand Egyptian Museum (GEM)',
    monumentNameAr: 'المتحف المصري الكبير وتمثال رمسيس الثاني',
    location: 'Giza, Egypt',
    locationAr: 'الجيزة، مصر',
    photoUrl: '/images/sponsor-gem.jpg',
    fallbackUrl: '/images/sponsor-gem.jpg',
    logoText: 'EGYPTIAN ARTS',
    quote: 'Proudly representing Egyptian artistry at the Grand Egyptian Museum (GEM) alongside the colossal statue of Ramses II.',
    quoteAr: 'تمثيل الفن والإبداع المصري بفخر في المتحف المصري الكبير بجوار تمثال رمسيس الثاني العملاق.',
    tier: 'Heritage Innovation Partner',
    tierAr: 'أيقونة الفن المصري',
  },
  {
    id: 'luxor',
    name: 'International Travel Vlogger',
    nameAr: 'صانع محتوى سياحي دولي',
    category: 'Tourism Discovery Partner',
    categoryAr: 'شريك الاستكشاف السياحي',
    caption: 'Capturing Luxor Majestic Temples',
    captionAr: 'توثيق عظمة معابد الأقصر',
    monumentName: 'Karnak & Luxor Temples',
    monumentNameAr: 'معابد الكرنك والأقصر',
    location: 'Luxor, Upper Egypt',
    locationAr: 'الأقصر، صعيد مصر',
    photoUrl: '/images/sponsor-luxor.jpg',
    fallbackUrl: '/images/sponsor-luxor.jpg',
    logoText: 'TRAVEL DISCOVERY',
    quote: 'Capturing the awe-inspiring columns and ancient hieroglyphs of Luxor’s majestic temples.',
    quoteAr: 'توثيق صروح وأعمدة معابد الأقصر المهيبة ونقوشها الهيروغليفية الساحرة.',
    tier: 'Official Royal Carrier',
    tierAr: 'شريك الاستكشاف السياحي',
  },
  {
    id: 'pyramids',
    name: 'MrBeast',
    nameAr: 'مستر بيست (MrBeast)',
    category: 'Digital Entertainment Explorer',
    categoryAr: 'رائد صناعة المحتوى الرقمي',
    caption: 'At the Great Pyramids of Giza',
    captionAr: 'في أحضان أهرامات الجيزة الخالدة',
    monumentName: 'Great Pyramids of Giza',
    monumentNameAr: 'أهرامات الجيزة العظيمة',
    location: 'Giza Plateau, Cairo',
    locationAr: 'هضبة الجيزة، القاهرة',
    photoUrl: '/images/sponsor-pyramids.jpg',
    fallbackUrl: '/images/sponsor-pyramids.jpg',
    logoText: 'MRBEAST',
    quote: 'Bringing global digital audiences to the timeless wonders of the Great Pyramids of Giza.',
    quoteAr: 'جذب ملايين المتابعين حول العالم لعجائب وأسرار أهرامات الجيزة الخالدة.',
    tier: 'Diamond Global Patron',
    tierAr: 'سفير المحتوى الرقمي',
  },
];

export default function SponsorsShowcase() {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';

  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'papyrus'>('carousel');
  const [selectedAmbassador, setSelectedAmbassador] = useState<SponsorAmbassador | null>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [partnerTypeFilter, setPartnerTypeFilter] = useState<'all' | 'luxor' | 'giza' | 'aswan'>('all');

  const filteredAmbassadors = AMBASSADORS.filter((a) => {
    if (partnerTypeFilter === 'luxor') return a.location.toLowerCase().includes('luxor');
    if (partnerTypeFilter === 'giza') return a.location.toLowerCase().includes('giza') || a.location.toLowerCase().includes('cairo');
    if (partnerTypeFilter === 'aswan') return a.location.toLowerCase().includes('aswan') || a.location.toLowerCase().includes('alexandria');
    return true;
  });

  // Auto-advance 3D Carousel every 6 seconds when in carousel view
  useEffect(() => {
    if (viewMode !== 'carousel') return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % filteredAmbassadors.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [viewMode, filteredAmbassadors.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + filteredAmbassadors.length) % filteredAmbassadors.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % filteredAmbassadors.length);
  };

  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-b from-[#030712] via-[#070E1A] to-[#030712] border-t border-[#D4AF37]/20 overflow-hidden text-white">
      {/* Subtle Pharaonic Hieroglyph Watermark & Gold Halo Backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-10 right-0 w-[500px] h-[350px] bg-[#1B6B93]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative Golden Cartouche Border Lines */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#E2CB85] text-xs font-bold uppercase tracking-[0.25em] mb-4 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <Crown className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            <span>{isAr ? 'سفراء وشخصيات الحضارة المصرية' : 'EgyptX Global Ambassadors'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F5E6B8] to-[#C9A84C] drop-shadow-sm mb-4 leading-tight">
            {isAr ? 'نجوم العالم في أحضان حضارة مصر الخالدة' : 'Global Icons Exploring Timeless Egypt'}
          </h2>

          <p className="text-base sm:text-lg text-white/60 leading-relaxed font-light max-w-2xl mx-auto">
            {isAr
              ? 'شخصيات وقادة ومؤثرون عالميون يوثقون رحلاتهم الاستثنائية بين أعظم معالم مصر التاريخية.'
              : 'Renowned world figures, cultural leaders, and digital visionaries celebrating Egypt’s iconic heritage.'}
          </p>

          <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6" />

          {/* Controls & Filter Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {/* Location Filters */}
            <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <button
                onClick={() => { setPartnerTypeFilter('all'); setActiveIndex(0); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  partnerTypeFilter === 'all'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {isAr ? 'كافة الشخصيات (6)' : 'All Ambassadors (6)'}
              </button>
              <button
                onClick={() => { setPartnerTypeFilter('giza'); setActiveIndex(0); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  partnerTypeFilter === 'giza'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {isAr ? 'الأهرامات والقاهرة (3)' : 'Giza & Cairo (3)'}
              </button>
              <button
                onClick={() => { setPartnerTypeFilter('luxor'); setActiveIndex(0); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  partnerTypeFilter === 'luxor'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {isAr ? 'الأقصر' : 'Luxor'}
              </button>
              <button
                onClick={() => { setPartnerTypeFilter('aswan'); setActiveIndex(0); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  partnerTypeFilter === 'aswan'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {isAr ? 'أسوان والإسكندرية' : 'Aswan & Alexandria'}
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <button
                onClick={() => setViewMode('carousel')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'carousel'
                    ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#E2CB85]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isAr ? 'معرض ثلاثي الأبعاد' : '3D Carousel'}</span>
              </button>
              <button
                onClick={() => setViewMode('papyrus')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'papyrus'
                    ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#E2CB85]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>{isAr ? 'شبكة البرديات الحديثة' : 'Modern Papyrus Grid'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* VIEW 1: 3D Royal Carousel */}
        {viewMode === 'carousel' && (
          <div className="relative py-8 select-none">
            {/* Carousel Stage */}
            <div className="relative h-[490px] sm:h-[550px] md:h-[590px] flex items-center justify-center perspective-[1200px]">
              {filteredAmbassadors.map((ambassador, idx) => {
                const total = filteredAmbassadors.length;
                let offset = (idx - activeIndex + total) % total;
                if (offset > total / 2) offset -= total;

                const isCurrent = offset === 0;
                const isAdjacent = Math.abs(offset) === 1;
                const isFar = Math.abs(offset) === 2;
                const isHidden = Math.abs(offset) >= 3;

                if (isHidden) return null;

                // 3D positioning
                const translateX = offset * 280;
                const translateZ = -Math.abs(offset) * 160;
                const rotateY = offset * -18;
                const scale = isCurrent ? 1 : isAdjacent ? 0.88 : isFar ? 0.76 : 0.65;
                const opacity = isCurrent ? 1 : isAdjacent ? 0.7 : 0.35;

                return (
                  <motion.div
                    key={ambassador.id}
                    className="absolute w-[310px] sm:w-[380px] md:w-[440px] h-[450px] sm:h-[500px] md:h-[540px] rounded-3xl overflow-hidden cursor-pointer"
                    style={{
                      transformStyle: 'preserve-3d',
                      zIndex: 30 - Math.abs(offset) * 5,
                    }}
                    animate={{
                      x: translateX,
                      z: translateZ,
                      rotateY: rotateY,
                      scale: scale,
                      opacity: opacity,
                    }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => {
                      if (isCurrent) {
                        setSelectedAmbassador(ambassador);
                      } else {
                        setActiveIndex(idx);
                      }
                    }}
                  >
                    {/* Ambassador Card Container with Gold Border Glow */}
                    <div className="relative w-full h-full bg-[#08101D] border-2 border-[#D4AF37]/50 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.85)] group transition-all duration-300 hover:border-[#F3E5AB]">
                      {/* Background Monument Photo with Local Asset */}
                      <img
                        src={ambassador.photoUrl}
                        alt={ambassador.name}
                        className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
                        style={{ objectPosition: 'top center' }}
                        loading="lazy"
                        onError={(e) => {
                          if (e.currentTarget.src !== ambassador.fallbackUrl) {
                            e.currentTarget.src = ambassador.fallbackUrl;
                          }
                        }}
                      />

                      {/* Pharaonic Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#040812] via-[#050D1A]/85 via-50% to-black/25 pointer-events-none" />

                      {/* Subtle Golden Inner Border Cartouche Accent */}
                      <div className="absolute inset-2 border border-[#D4AF37]/25 rounded-2xl pointer-events-none" />

                      {/* Top Overlay Badge (Role + Logo Tag) */}
                      <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#030712]/85 backdrop-blur-md border border-[#D4AF37]/60 text-[#E2CB85] text-[11px] font-bold shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
                          <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{isAr ? ambassador.categoryAr : ambassador.category}</span>
                        </div>

                        <div className="px-3 py-1 rounded-lg bg-[#030712]/90 backdrop-blur-md border border-[#D4AF37]/40 font-mono text-xs font-black tracking-widest text-[#F3E5AB] shadow-md">
                          {ambassador.logoText}
                        </div>
                      </div>

                      {/* Bottom Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10 space-y-2.5">
                        {/* Caption Pill */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#D4AF37]/25 backdrop-blur-md border border-[#D4AF37]/50 text-[#F5E6B8] text-xs font-bold tracking-wide shadow-sm">
                          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{isAr ? ambassador.captionAr : ambassador.caption}</span>
                        </div>

                        {/* Title (Notable Figure Name) */}
                        <h3 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                          {isAr ? ambassador.nameAr : ambassador.name}
                        </h3>

                        {/* Monument & Location */}
                        <div className="flex items-center gap-2 text-xs text-white/80">
                          <Compass className="w-3.5 h-3.5 text-[#4EB1E2]" />
                          <span className="font-semibold text-white drop-shadow">
                            {isAr ? ambassador.monumentNameAr : ambassador.monumentName}
                          </span>
                          <span className="text-white/40">•</span>
                          <span className="text-white/70">{isAr ? ambassador.locationAr : ambassador.location}</span>
                        </div>

                        {/* Description Quote */}
                        <p className="text-xs text-white/85 line-clamp-2 italic pt-1.5 border-t border-white/10 font-serif leading-relaxed drop-shadow">
                          "{isAr ? ambassador.quoteAr : ambassador.quote}"
                        </p>

                        {/* Action CTA */}
                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-[11px] uppercase tracking-wider text-[#E2CB85] font-bold flex items-center gap-1 group-hover:underline drop-shadow">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{isAr ? 'عرض قصة السفير' : 'View Ambassador Story'}</span>
                          </span>
                          <div className="w-8 h-8 rounded-full bg-[#D4AF37]/30 border border-[#D4AF37]/60 flex items-center justify-center text-[#E2CB85] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors shadow-md">
                            <ArrowUpRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Navigation Arrows & Indicator Dots */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-full bg-white/5 border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#D4AF37]/20 text-[#E2CB85] flex items-center justify-center transition-all shadow-lg active:scale-95"
                aria-label="Previous Ambassador"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                {filteredAmbassadors.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === activeIndex
                        ? 'w-6 bg-gradient-to-r from-[#D4AF37] to-[#F5E6B8]'
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-white/5 border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#D4AF37]/20 text-[#E2CB85] flex items-center justify-center transition-all shadow-lg active:scale-95"
                aria-label="Next Ambassador"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: Modern Papyrus Masonry Grid (3 columns x 2 rows) */}
        {viewMode === 'papyrus' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6"
          >
            {filteredAmbassadors.map((ambassador) => (
              <div
                key={ambassador.id}
                onClick={() => setSelectedAmbassador(ambassador)}
                className="group relative bg-[#09111E] border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-3xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col"
              >
                {/* Photo Header */}
                <div className="relative h-64 w-full overflow-hidden bg-[#040812]">
                  <img
                    src={ambassador.photoUrl}
                    alt={ambassador.name}
                    className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
                    style={{ objectPosition: 'top center' }}
                    loading="lazy"
                    onError={(e) => {
                      if (e.currentTarget.src !== ambassador.fallbackUrl) {
                        e.currentTarget.src = ambassador.fallbackUrl;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09111E] via-transparent to-black/30" />

                  {/* Logo overlay */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-[11px] font-mono font-bold tracking-widest text-[#F5E6B8] border border-[#D4AF37]/40 shadow-sm">
                    {ambassador.logoText}
                  </div>

                  {/* Caption pill */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="inline-block px-2.5 py-1 rounded bg-[#D4AF37]/25 border border-[#D4AF37]/50 text-[#F5E6B8] text-[11px] font-bold backdrop-blur-md truncate max-w-full shadow-sm">
                      {isAr ? ambassador.captionAr : ambassador.caption}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#E2CB85] tracking-widest block mb-1">
                      {isAr ? ambassador.categoryAr : ambassador.category}
                    </span>
                    <h4 className="text-lg font-bold text-white group-hover:text-[#F5E6B8] transition-colors leading-snug">
                      {isAr ? ambassador.nameAr : ambassador.name}
                    </h4>
                    <p className="text-xs text-white/60 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#D4AF37]" />
                      <span>{isAr ? ambassador.monumentNameAr : ambassador.monumentName}</span>
                    </p>
                  </div>

                  <p className="text-xs text-white/70 italic line-clamp-2 border-t border-white/5 pt-2 font-serif">
                    "{isAr ? ambassador.quoteAr : ambassador.quote}"
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs text-[#E2CB85] font-semibold">
                    <span>{isAr ? 'عرض التفاصيل' : 'Explore Story'}</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Global Partnership CTA Banner */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-[#0C1628] via-[#101E35] to-[#0A1220] border border-[#D4AF37]/40 p-8 sm:p-10 shadow-[0_0_50px_rgba(212,175,55,0.15)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-52 h-52 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E2CB85] tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{isAr ? 'انضم إلى نخبة سفراء مصر إكس' : 'Become an EgyptX Global Ambassador'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isAr ? 'هل تمثل مؤسسة ثقافية أو شخصية دولية مؤثرة؟' : 'Are You a Cultural Icon, Leader, or Global Brand?'}
            </h3>
            <p className="text-sm text-white/70">
              {isAr
                ? 'شارك في تسليط الضوء على سحر الحضارة المصرية برعاية تجارب سياحية حصرية وتوثيق معالم الإنسانية الخالدة.'
                : 'Join our international heritage network to experience private VIP monument access and support digital cultural preservation.'}
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#D4AF37] to-[#E2CB85] text-[#030712] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4" />
              <span>{isAr ? 'طلب الانضمام كسفير رسمي' : 'Apply as Global Ambassador'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* MODAL 1: Ambassador Spotlight Dossier */}
      <AnimatePresence>
        {selectedAmbassador && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAmbassador(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#09111E] border border-[#D4AF37]/50 rounded-3xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.9)] z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedAmbassador(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white/70 hover:text-white transition-colors border border-white/20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Monument Hero Image with Fallback */}
              <div className="relative h-72 sm:h-80 md:h-96 w-full bg-[#040812] overflow-hidden">
                <img
                  src={selectedAmbassador.photoUrl}
                  alt={selectedAmbassador.name}
                  className="w-full h-full object-cover object-top"
                  style={{ objectPosition: 'top center' }}
                  onError={(e) => {
                    if (e.currentTarget.src !== selectedAmbassador.fallbackUrl) {
                      e.currentTarget.src = selectedAmbassador.fallbackUrl;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09111E] via-[#09111E]/30 via-35% to-transparent" />

                <div className="absolute bottom-4 left-6 right-6">
                  <span className="px-3 py-1 rounded-full bg-[#D4AF37]/25 border border-[#D4AF37]/50 text-[#E2CB85] text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm">
                    {isAr ? selectedAmbassador.categoryAr : selectedAmbassador.category}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mt-2 drop-shadow-md">
                    {isAr ? selectedAmbassador.nameAr : selectedAmbassador.name}
                  </h3>
                </div>
              </div>

              {/* Details Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div>
                    <span className="text-white/40 block uppercase">{isAr ? 'المعلم' : 'Monument'}</span>
                    <span className="font-bold text-white text-sm">
                      {isAr ? selectedAmbassador.monumentNameAr : selectedAmbassador.monumentName}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40 block uppercase">{isAr ? 'الموقع' : 'Location'}</span>
                    <span className="font-bold text-[#E2CB85] text-sm">
                      {isAr ? selectedAmbassador.locationAr : selectedAmbassador.location}
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-white/40 block uppercase">{isAr ? 'الصفة' : 'Role'}</span>
                    <span className="font-bold text-[#4EE2A2] text-sm">
                      {isAr ? selectedAmbassador.categoryAr : selectedAmbassador.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-bold text-[#D4AF37] tracking-wider">
                    {isAr ? 'بيان الزيارة والأثر الحضاري' : 'Ambassador Story & Reflection'}
                  </h4>
                  <p className="text-sm text-white/80 leading-relaxed font-serif italic bg-[#050B14] p-4 rounded-xl border border-white/5">
                    "{isAr ? selectedAmbassador.quoteAr : selectedAmbassador.quote}"
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setSelectedAmbassador(null)}
                    className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#E2CB85] transition-colors"
                  >
                    {isAr ? 'إغلاق' : 'Close'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Partnership Application */}
      <AnimatePresence>
        {isJoinModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsJoinModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#0C1525] border border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(212,175,55,0.25)] z-10"
            >
              <button
                onClick={() => setIsJoinModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <Crown className="w-10 h-10 text-[#D4AF37] mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-white">
                  {isAr ? 'طلب رعاية وتمثيل رسمي' : 'Join the Global Ambassador Alliance'}
                </h3>
                <p className="text-xs text-white/60 mt-1">
                  {isAr
                    ? 'سيقوم فريق العلاقات الدولية في EgyptX بالتواصل معكم خلال 24 ساعة.'
                    : 'Our diplomatic and heritage team will contact your delegation within 24 hours.'}
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(isAr ? 'تم استلام طلبكم بنجاح! شكراً لدعمكم الحضارة المصرية.' : 'Your ambassador application was received successfully!');
                  setIsJoinModalOpen(false);
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block text-white/70 font-semibold mb-1 uppercase">
                    {isAr ? 'اسم الشخصية / المؤسسة' : 'Name / Organization'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cultural Delegation"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 font-semibold mb-1 uppercase">
                    {isAr ? 'اسم المفوض الرسمي والمنصب' : 'Representative Name & Title'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Representative — Global Culture"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 font-semibold mb-1 uppercase">
                    {isAr ? 'البريد الإلكتروني' : 'Official Email'}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="contact@ambassador.org"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E2CB85] text-black font-bold text-sm tracking-wide mt-2"
                >
                  {isAr ? 'إرسال طلب التمثيل' : 'Submit Ambassador Inquiry'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
