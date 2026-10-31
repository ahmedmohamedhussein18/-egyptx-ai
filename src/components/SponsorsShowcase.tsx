'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Crown,
  ExternalLink,
  ShieldCheck,
  Building2,
  Award,
  Compass,
  MapPin,
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
  logoText: string;
  quote: string;
  quoteAr: string;
  tier: 'Diamond Global Patron' | 'Official Royal Carrier' | 'Heritage Innovation Partner';
  tierAr: string;
}

const AMBASSADORS: SponsorAmbassador[] = [
  {
    id: 'unesco',
    name: 'UNESCO World Heritage Alliance',
    nameAr: 'تحالف اليونسكو للتراث العالمي',
    category: 'Global Preservation Partner',
    categoryAr: 'شريك الصون العالمي',
    caption: 'Global Partner Exploring Luxor',
    captionAr: 'الشريك العالمي يستكشف معابد الأقصر',
    monumentName: 'Karnak Great Hypostyle Hall',
    monumentNameAr: 'بهو الأعمدة العظيم بالكرنك',
    location: 'Luxor, Upper Egypt',
    locationAr: 'الأقصر، صعيد مصر',
    photoUrl: '/images/gallery/karnak.jpg',
    logoText: 'UNESCO',
    quote: 'Documenting and safeguarding 4,000 years of living human heritage through cutting-edge AI spatial mapping.',
    quoteAr: 'توثيق وصون 4000 عام من التراث الإنساني الخالد عبر أحدث تقنيات الذكاء الاصطناعي.',
    tier: 'Diamond Global Patron',
    tierAr: 'راعي عالمي ماسي',
  },
  {
    id: 'egyptair',
    name: 'EgyptAir Royal Sky Alliance',
    nameAr: 'مصر للطيران — أجنحة السماء الملكية',
    category: 'Official National Carrier',
    categoryAr: 'الناقل الوطني الرسمي',
    caption: 'Official Aviation Ambassador at Giza Plateau',
    captionAr: 'سفير الطيران الرسمي في هضبة أهرامات الجيزة',
    monumentName: 'Great Pyramids of Giza',
    monumentNameAr: 'أهرامات الجيزة الخالدة',
    location: 'Giza Plateau, Cairo',
    locationAr: 'هضبة الجيزة، القاهرة',
    photoUrl: '/images/attractions/Great Pyramid of Giza.jpg',
    logoText: 'EGYPTAIR',
    quote: 'Connecting global voyagers from 80+ world capitals directly to the sacred monuments of the Nile Valley.',
    quoteAr: 'ربط المسافرين من أكثر من 80 عاصمة عالمية مباشرة بمهد الحضارة والتاريخ على ضفاف النيل.',
    tier: 'Official Royal Carrier',
    tierAr: 'الناقل الملكي المعتمد',
  },
  {
    id: 'gem-founding',
    name: 'Grand Egyptian Museum Consortium',
    nameAr: 'تحالف المتحف المصري الكبير',
    category: 'Museum Innovation Trustee',
    categoryAr: 'شريك الابتكار المتحفي',
    caption: 'Cultural Heritage Trustee at the GEM',
    captionAr: 'أمناء التراث الثقافي في المتحف المصري الكبير',
    monumentName: 'Grand Egyptian Museum (GEM)',
    monumentNameAr: 'المتحف المصري الكبير',
    location: 'Giza, Egypt',
    locationAr: 'الجيزة، مصر',
    photoUrl: '/images/attractions/Grand Egyptian Museum.jpg',
    logoText: 'GEM TRUST',
    quote: 'Unveiling the complete 5,398-piece Tutankhamun golden treasure to millions of physical and digital visitors.',
    quoteAr: 'إبراز كنوز الملك الذهبي توت عنخ آمون الكاملة لملايين الزوار حول العالم.',
    tier: 'Heritage Innovation Partner',
    tierAr: 'شريك الابتكار التراثي',
  },
  {
    id: 'natgeo',
    name: 'National Geographic Expeditions',
    nameAr: 'ناشيونال جيوغرافيك إكسبيديشنز',
    category: 'Archaeological Exploration Partner',
    categoryAr: 'شريك الاستكشاف الأثري',
    caption: 'Archaeological Partner at Abu Simbel',
    captionAr: 'شريك الاستكشاف في معبدي أبو سمبل',
    monumentName: 'Abu Simbel Sun Temples',
    monumentNameAr: 'معبدا أبو سمبل بأسوان',
    location: 'Lake Nasser, Nubia, Aswan',
    locationAr: 'بحيرة ناصر، النوبة، أسوان',
    photoUrl: '/images/attractions/Abu Simbel Temples.jpg',
    logoText: 'NAT GEO',
    quote: 'Witnessing the miraculous solar alignment carved into the living sandstone cliffs of ancient Nubia.',
    quoteAr: 'معايشة ظاهرة تعامد الشمس الإعجازية المنحوتة في صخور النوبة الخالدة.',
    tier: 'Diamond Global Patron',
    tierAr: 'راعي عالمي ماسي',
  },
  {
    id: 'four-seasons',
    name: 'Four Seasons Nile & Heritage Fleet',
    nameAr: 'فور سيزونز — الأسطول النيلي التراثي',
    category: 'Luxury Hospitality Ambassador',
    categoryAr: 'سفير الضيافة الفاخرة',
    caption: 'Luxury Nile Ambassador at Philae Island',
    captionAr: 'سفير الضيافة النيلية الفاخرة بجزيرة فيلة',
    monumentName: 'Philae Temple of Isis',
    monumentNameAr: 'معبد إيزيس بجزيرة فيلة',
    location: 'Agilkia Island, Aswan',
    locationAr: 'جزيرة أجيلكيا، أسوان',
    photoUrl: '/images/gallery/philae.jpg',
    logoText: 'FOUR SEASONS',
    quote: 'Curating timeless bespoke Nile voyages blending royal pharaonic splendor with ultra-luxury comfort.',
    quoteAr: 'صناعة رحلات نيلية ملكية خاصة تمزج بين عراقة الفراعنة وأرقى درجات الرفاهية العالمية.',
    tier: 'Heritage Innovation Partner',
    tierAr: 'شريك الابتكار التراثي',
  },
  {
    id: 'google-arts',
    name: 'Google Arts & Culture Heritage Lab',
    nameAr: 'مختبر جوجل للفنون والثقافة',
    category: 'Digital Twin & AI Digitizer',
    categoryAr: 'الرقمنة والذكاء الاصطناعي',
    caption: 'Spatial AI Patron at Valley of the Kings',
    captionAr: 'شريك الذكاء المكاني في وادي الملوك',
    monumentName: 'Valley of the Kings',
    monumentNameAr: 'وادي الملوك بالبر الغربي',
    location: 'Thebes, Luxor',
    locationAr: 'طيبة، الأقصر',
    photoUrl: '/images/attractions/Valley of the Kings.jpg',
    logoText: 'GOOGLE ARTS',
    quote: 'Capturing millimetric 3D photogrammetry of royal tombs so global researchers explore them in virtual reality.',
    quoteAr: 'إنشاء توائم رقمية ثلاثية الأبعاد لمقابر الملوك لتوفير تجارب واقع افتراضي غامرة.',
    tier: 'Heritage Innovation Partner',
    tierAr: 'شريك الابتكار التراثي',
  },
  {
    id: 'orascom',
    name: 'Orascom Heritage & Mobility',
    nameAr: 'أوراسكوم لإدارة التراث والحركة الذكية',
    category: 'Sustainable Infrastructure Partner',
    categoryAr: 'شريك البنية التحتية المستدامة',
    caption: 'Clean Mobility Partner at Cairo Citadel',
    captionAr: 'شريك التنقل الأخضر بقلعة صلاح الدين',
    monumentName: 'Citadel of Saladin',
    monumentNameAr: 'قلعة صلاح الدين الأيوبي',
    location: 'Historic Cairo',
    locationAr: 'القاهرة التاريخية',
    photoUrl: '/images/attractions/Citadel of Saladin.jpg',
    logoText: 'ORASCOM',
    quote: 'Deploying eco-friendly electric shuttles and digital visitor centers across Egypt’s major monumental plazas.',
    quoteAr: 'تشغيل حافلات كهربائية ذكية بدون انبعاثات في الساحات الأثرية المصرية الكبرى.',
    tier: 'Official Royal Carrier',
    tierAr: 'الناقل الملكي المعتمد',
  },
  {
    id: 'alex-library',
    name: 'Bibliotheca Alexandrina Foundation',
    nameAr: 'مؤسسة مكتبة الإسكندرية',
    category: 'Universal Cultural Patron',
    categoryAr: 'الراعي الثقافي العالمي',
    caption: 'Mediterranean Cultural Ambassador',
    captionAr: 'السفير الثقافي لعروس البحر المتوسط',
    monumentName: 'Bibliotheca Alexandrina & Seafront',
    monumentNameAr: 'مكتبة الإسكندرية وكورنيش البحر',
    location: 'Alexandria, Mediterranean',
    locationAr: 'الإسكندرية، البحر المتوسط',
    photoUrl: '/images/attractions/Alexandria Library.webp',
    logoText: 'ALEXANDRINA',
    quote: 'Reigniting the ancient lighthouse of knowledge and classical philosophy for the digital 21st century.',
    quoteAr: 'إحياء منارة المعرفة القديمة ونشر الفكر والإبداع الإنساني لرواد العصر الرقمي.',
    tier: 'Diamond Global Patron',
    tierAr: 'راعي عالمي ماسي',
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
    if (partnerTypeFilter === 'aswan') return a.location.toLowerCase().includes('aswan');
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
            <span>{isAr ? 'رعاة وسفراء الحضارة المصرية' : 'EgyptX Global Ambassadors'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F5E6B8] to-[#C9A84C] drop-shadow-sm mb-4 leading-tight">
            {isAr ? 'شركاء النيل: حماة التراث ورواد السياحة العالمية' : 'Elite Sponsors & Global Ambassadors'}
          </h2>

          <p className="text-base sm:text-lg text-white/60 leading-relaxed font-light max-w-2xl mx-auto">
            {isAr
              ? 'نخبة المؤسسات والشركاء الدوليين الذين يقودون رحلات استكشاف المعالم الأثرية ويدعمون التحول الرقمي للسياحة في أرض الفراعنة.'
              : 'Distinguished global institutions and world leaders experiencing Egypt’s eternal monuments while driving smart digital preservation.'}
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
                {isAr ? 'كافة الشركاء' : 'All Partners'}
              </button>
              <button
                onClick={() => { setPartnerTypeFilter('luxor'); setActiveIndex(0); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  partnerTypeFilter === 'luxor'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {isAr ? 'الأقصر وطيبة' : 'Luxor & Thebes'}
              </button>
              <button
                onClick={() => { setPartnerTypeFilter('giza'); setActiveIndex(0); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  partnerTypeFilter === 'giza'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {isAr ? 'الأهرامات والقاهرة' : 'Giza & Cairo'}
              </button>
              <button
                onClick={() => { setPartnerTypeFilter('aswan'); setActiveIndex(0); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  partnerTypeFilter === 'aswan'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {isAr ? 'أسوان والنوبة' : 'Aswan & Nubia'}
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
            <div className="relative h-[480px] sm:h-[540px] md:h-[580px] flex items-center justify-center perspective-[1200px]">
              {filteredAmbassadors.map((ambassador, idx) => {
                const total = filteredAmbassadors.length;
                let offset = (idx - activeIndex + total) % total;
                if (offset > total / 2) offset -= total;

                const isCurrent = offset === 0;
                const isAdjacent = Math.abs(offset) === 1;
                const isHidden = Math.abs(offset) > 2;

                if (isHidden) return null;

                // 3D positioning
                const translateX = offset * 280;
                const translateZ = -Math.abs(offset) * 160;
                const rotateY = offset * -18;
                const scale = isCurrent ? 1 : isAdjacent ? 0.88 : 0.75;
                const opacity = isCurrent ? 1 : isAdjacent ? 0.65 : 0.25;

                return (
                  <motion.div
                    key={ambassador.id}
                    className="absolute w-[300px] sm:w-[380px] md:w-[440px] h-[440px] sm:h-[490px] md:h-[530px] rounded-3xl overflow-hidden cursor-pointer"
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
                    <div className="relative w-full h-full bg-[#0A1220] border-2 border-[#D4AF37]/40 rounded-3xl overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.8)] group transition-all duration-300 hover:border-[#D4AF37]">
                      {/* Background Monument Photo */}
                      <img
                        src={ambassador.photoUrl}
                        alt={ambassador.monumentName}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* Pharaonic Gradient Dark Shade */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#050D1A]/60 to-black/30" />

                      {/* Top Overlay Badge (Tier + Logo Mark) */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#030712]/80 backdrop-blur-md border border-[#D4AF37]/50 text-[#E2CB85] text-[11px] font-bold shadow-lg">
                          <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{isAr ? ambassador.tierAr : ambassador.tier}</span>
                        </div>

                        <div className="px-2.5 py-1 rounded-lg bg-[#030712]/90 backdrop-blur-md border border-white/20 font-mono text-[11px] font-black tracking-widest text-[#F3E5AB]">
                          {ambassador.logoText}
                        </div>
                      </div>

                      {/* Bottom Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10 space-y-2">
                        {/* Caption Pill */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#D4AF37]/20 backdrop-blur-md border border-[#D4AF37]/40 text-[#F5E6B8] text-xs font-bold tracking-wide">
                          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{isAr ? ambassador.captionAr : ambassador.caption}</span>
                        </div>

                        {/* Sponsor Name & Monument */}
                        <h3 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">
                          {isAr ? ambassador.nameAr : ambassador.name}
                        </h3>

                        <div className="flex items-center gap-2 text-xs text-white/70">
                          <Compass className="w-3.5 h-3.5 text-[#4EB1E2]" />
                          <span className="font-medium text-white/90">
                            {isAr ? ambassador.monumentNameAr : ambassador.monumentName}
                          </span>
                          <span className="text-white/40">•</span>
                          <span className="text-white/60">{isAr ? ambassador.locationAr : ambassador.location}</span>
                        </div>

                        <p className="text-xs text-white/75 line-clamp-2 italic pt-1 border-t border-white/10 font-serif">
                          "{isAr ? ambassador.quoteAr : ambassador.quote}"
                        </p>

                        {/* Action CTA */}
                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-[11px] uppercase tracking-wider text-[#E2CB85] font-semibold flex items-center gap-1 group-hover:underline">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{isAr ? 'عرض ملف السفير' : 'View Ambassador Story'}</span>
                          </span>
                          <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#E2CB85] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
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

        {/* VIEW 2: Modern Papyrus Masonry Grid */}
        {viewMode === 'papyrus' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-6"
          >
            {filteredAmbassadors.map((ambassador) => (
              <div
                key={ambassador.id}
                onClick={() => setSelectedAmbassador(ambassador)}
                className="group relative bg-[#09111E] border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-3xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col"
              >
                {/* Photo Header */}
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={ambassador.photoUrl}
                    alt={ambassador.monumentName}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09111E] via-transparent to-black/30" />

                  {/* Logo overlay */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold tracking-widest text-[#F5E6B8] border border-white/20">
                    {ambassador.logoText}
                  </div>

                  {/* Caption pill */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="inline-block px-2.5 py-1 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F5E6B8] text-[11px] font-bold backdrop-blur-md truncate max-w-full">
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
              <span>{isAr ? 'انضم إلى نخبة رعاة مصر إكس' : 'Become an EgyptX Global Patron'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isAr ? 'هل تمثل مؤسسة دولية أو علامة تجارية رائدة؟' : 'Are You Representing a Global Brand or Institution?'}
            </h3>
            <p className="text-sm text-white/70">
              {isAr
                ? 'ساهم في رعاية وتوثيق أعظم معالم الإنسانية مع باقات شراكة استراتيجية مميزة وتجارب زيارة لكبار الشخصيات.'
                : 'Partner with EgyptX to support smart heritage preservation, VIP ministerial access, and global digital showcases.'}
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#D4AF37] to-[#E2CB85] text-[#030712] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4" />
              <span>{isAr ? 'طلب الانضمام كسفير رسمي' : 'Apply as Global Patron'}</span>
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

              {/* Monument Hero Image */}
              <div className="relative h-64 sm:h-72 w-full">
                <img
                  src={selectedAmbassador.photoUrl}
                  alt={selectedAmbassador.monumentName}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09111E] via-transparent to-black/40" />

                <div className="absolute bottom-4 left-6 right-6">
                  <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#E2CB85] text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                    {isAr ? selectedAmbassador.captionAr : selectedAmbassador.caption}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mt-2">
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
                    <span className="text-white/40 block uppercase">{isAr ? 'مرتبة الرعاية' : 'Patron Tier'}</span>
                    <span className="font-bold text-[#4EE2A2] text-sm">
                      {isAr ? selectedAmbassador.tierAr : selectedAmbassador.tier}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-bold text-[#D4AF37] tracking-wider">
                    {isAr ? 'بيان الشراكة والأثر التراثي' : 'Partnership Mission & Impact'}
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
                  {isAr ? 'طلب رعاية وشراكة استراتيجية' : 'Join the Global Patron Alliance'}
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
                  alert(isAr ? 'تم استلام طلبكم بنجاح! شكراً لدعمكم الحضارة المصرية.' : 'Your patron application was received successfully!');
                  setIsJoinModalOpen(false);
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block text-white/70 font-semibold mb-1 uppercase">
                    {isAr ? 'اسم المؤسسة / الشركة' : 'Institution / Company Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Cultural Foundation"
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
                    placeholder="e.g. Elena Rostova — Global Heritage Lead"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 font-semibold mb-1 uppercase">
                    {isAr ? 'البريد المؤسسي' : 'Official Email'}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="partnership@organization.org"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E2CB85] text-black font-bold text-sm tracking-wide mt-2"
                >
                  {isAr ? 'إرسال طلب الشراكة' : 'Submit Patron Inquiry'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
