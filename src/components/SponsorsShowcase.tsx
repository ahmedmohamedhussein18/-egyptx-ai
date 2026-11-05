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
  X,
  Upload,
  CheckCircle2,
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
  isUserGenerated?: boolean;
}

const INITIAL_AMBASSADORS: SponsorAmbassador[] = [
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
    isUserGenerated: false,
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
    isUserGenerated: false,
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
    isUserGenerated: false,
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
    isUserGenerated: false,
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
    isUserGenerated: false,
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
    isUserGenerated: false,
  },
];

interface ToastState {
  show: boolean;
  title: string;
  message: string;
  type?: 'success' | 'info';
}

export default function SponsorsShowcase() {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';

  const [ambassadors, setAmbassadors] = useState<SponsorAmbassador[]>(INITIAL_AMBASSADORS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'papyrus'>('carousel');
  const [selectedAmbassador, setSelectedAmbassador] = useState<SponsorAmbassador | null>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [partnerTypeFilter, setPartnerTypeFilter] = useState<'all' | 'luxor' | 'giza' | 'aswan'>('all');

  // Form State for Adding Custom Ambassador Card
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formMonument, setFormMonument] = useState('Great Pyramids of Giza');
  const [formStory, setFormStory] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Royal Toast Notification State
  const [toast, setToast] = useState<ToastState>({
    show: false,
    title: '',
    message: '',
    type: 'success',
  });

  // Auto-dismiss Toast
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const filteredAmbassadors = ambassadors.filter((a) => {
    if (partnerTypeFilter === 'luxor') {
      return (
        a.location.toLowerCase().includes('luxor') ||
        a.monumentName.toLowerCase().includes('luxor') ||
        a.monumentName.toLowerCase().includes('karnak')
      );
    }
    if (partnerTypeFilter === 'giza') {
      return (
        a.location.toLowerCase().includes('giza') ||
        a.location.toLowerCase().includes('cairo') ||
        a.monumentName.toLowerCase().includes('pyramid')
      );
    }
    if (partnerTypeFilter === 'aswan') {
      return (
        a.location.toLowerCase().includes('aswan') ||
        a.location.toLowerCase().includes('alexandria') ||
        a.monumentName.toLowerCase().includes('philae') ||
        a.monumentName.toLowerCase().includes('alexandria')
      );
    }
    return true;
  });

  // Clamp activeIndex whenever filteredAmbassadors length changes
  useEffect(() => {
    if (filteredAmbassadors.length > 0 && activeIndex >= filteredAmbassadors.length) {
      setActiveIndex(0);
    }
  }, [filteredAmbassadors.length, activeIndex]);

  // Auto-advance 3D Carousel every 6 seconds when in carousel view
  useEffect(() => {
    if (viewMode !== 'carousel' || filteredAmbassadors.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % filteredAmbassadors.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [viewMode, filteredAmbassadors.length]);

  const handlePrev = () => {
    if (filteredAmbassadors.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + filteredAmbassadors.length) % filteredAmbassadors.length);
  };

  const handleNext = () => {
    if (filteredAmbassadors.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % filteredAmbassadors.length);
  };

  // Image File Upload Change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreviewUrl(objectUrl);
    }
  };

  // Dynamic VIP Ambassador Addition
  const handleAddAmbassador = (e: React.FormEvent) => {
    e.preventDefault();

    const finalPhotoUrl = imagePreviewUrl || '/images/sponsor-pyramids.jpg';

    // Location mapping based on monument
    let loc = 'Giza Plateau, Cairo';
    let locAr = 'هضبة الجيزة، القاهرة';
    if (formMonument.toLowerCase().includes('luxor') || formMonument.toLowerCase().includes('karnak')) {
      loc = 'Luxor, Upper Egypt';
      locAr = 'الأقصر، صعيد مصر';
    } else if (formMonument.toLowerCase().includes('aswan') || formMonument.toLowerCase().includes('philae') || formMonument.toLowerCase().includes('abu simbel')) {
      loc = 'Aswan, Upper Egypt';
      locAr = 'أسوان، صعيد مصر';
    } else if (formMonument.toLowerCase().includes('alexandria')) {
      loc = 'Alexandria, Mediterranean';
      locAr = 'الإسكندرية، البحر المتوسط';
    }

    const newAmbassador: SponsorAmbassador = {
      id: `user-${Date.now()}`,
      name: formName.trim(),
      nameAr: formName.trim(),
      category: formRole.trim() || (isAr ? 'سفير التراث الفخري' : 'VIP Cultural Ambassador'),
      categoryAr: formRole.trim() || 'سفير التراث الفخري',
      caption: `${isAr ? 'زيارة وتوثيق' : 'Exploring'} ${formMonument}`,
      captionAr: `استكشاف ${formMonument}`,
      monumentName: formMonument,
      monumentNameAr: formMonument,
      location: loc,
      locationAr: locAr,
      photoUrl: finalPhotoUrl,
      fallbackUrl: '/images/sponsor-pyramids.jpg',
      logoText: 'VIP AMBASSADOR',
      quote: formStory.trim() || (isAr ? 'رحلة ملهمة بين صروح الحضارة المصرية الخالدة.' : 'An inspiring journey through the timeless wonders of Egyptian civilization.'),
      quoteAr: formStory.trim() || 'رحلة ملهمة بين صروح الحضارة المصرية الخالدة.',
      tier: 'Honorary Global Ambassador',
      tierAr: 'سفير فخري عالمي',
      isUserGenerated: true,
    };

    // Prepend new card to state
    setAmbassadors((prev) => [newAmbassador, ...prev]);
    setActiveIndex(0);
    setIsJoinModalOpen(false);

    // Reset Form
    setFormName('');
    setFormRole('');
    setFormMonument('Great Pyramids of Giza');
    setFormStory('');
    setSelectedImageFile(null);
    setImagePreviewUrl(null);

    // Show Royal Success Toast
    setToast({
      show: true,
      title: isAr ? 'تمت إضافة بطاقتك بنجاح! ' : 'Ambassador Card Added! ',
      message: isAr
        ? `أهلاً بك يا ${newAmbassador.name} كسفير رسمي في معرض EgyptX!`
        : `Welcome ${newAmbassador.name}! Your custom ambassador card is now live on the showcase.`,
      type: 'success',
    });
  };

  // Selective Deletion: ONLY removes user generated cards
  const removeCard = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Verify card is user generated
    const target = ambassadors.find((a) => a.id === id);
    if (!target || !target.isUserGenerated) return;

    setAmbassadors((prev) => prev.filter((a) => a.id !== id));

    if (selectedAmbassador?.id === id) {
      setSelectedAmbassador(null);
    }

    setToast({
      show: true,
      title: isAr ? 'تم حذف البطاقة' : 'Card Removed',
      message: isAr
        ? `تم حذف بطاقتك المخصصة بنجاح.`
        : `Your customized ambassador card has been safely removed.`,
      type: 'info',
    });
  };

  return (
    <section className="relative py-24 md:py-32 bg-[#FDFBF7] dark:bg-gradient-to-b dark:from-[#030712] dark:via-[#070E1A] dark:to-[#030712] border-t border-slate-200/80 dark:border-[#D4AF37]/20 overflow-hidden text-[#1A2332] dark:text-white transition-colors duration-200">
      {/* Subtle Pharaonic Hieroglyph Watermark & Gold Halo Backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-10 right-0 w-[500px] h-[350px] bg-[#1B6B93]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative Golden Cartouche Border Lines */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#8A661C] dark:text-[#E2CB85] text-xs font-bold uppercase tracking-[0.25em] mb-4 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <Crown className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            <span>{isAr ? 'سفراء وشخصيات الحضارة المصرية' : 'EgyptX Global Ambassadors'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-[#8A661C] to-[#C9A84C] dark:from-white dark:via-[#F5E6B8] dark:to-[#C9A84C] drop-shadow-sm mb-4 leading-tight">
            {isAr ? 'نجوم العالم في أحضان حضارة مصر الخالدة' : 'Global Icons Exploring Timeless Egypt'}
          </h2>

          <p className="text-base sm:text-lg text-gray-600 dark:text-white/60 leading-relaxed font-light max-w-2xl mx-auto">
            {isAr
              ? 'شخصيات وقادة ومؤثرون عالميون يوثقون رحلاتهم الاستثنائية بين أعظم معالم مصر التاريخية.'
              : 'Renowned world figures, cultural leaders, and digital visionaries celebrating Egypt’s iconic heritage.'}
          </p>

          <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6" />

          {/* Controls & Filter Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {/* Location Filters */}
            <div className="inline-flex p-1 rounded-xl bg-[#F8F3E9] dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md">
              <button
                onClick={() => { setPartnerTypeFilter('all'); setActiveIndex(0); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  partnerTypeFilter === 'all'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'text-gray-600 hover:text-gray-900 dark:text-white/60 dark:hover:text-white'
                }`}
              >
                {isAr ? `كافة الشخصيات (${ambassadors.length})` : `All Ambassadors (${ambassadors.length})`}
              </button>
              <button
                onClick={() => { setPartnerTypeFilter('giza'); setActiveIndex(0); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  partnerTypeFilter === 'giza'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'text-gray-600 hover:text-gray-900 dark:text-white/60 dark:hover:text-white'
                }`}
              >
                {isAr ? 'الأهرامات والقاهرة' : 'Giza & Cairo'}
              </button>
              <button
                onClick={() => { setPartnerTypeFilter('luxor'); setActiveIndex(0); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  partnerTypeFilter === 'luxor'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'text-gray-600 hover:text-gray-900 dark:text-white/60 dark:hover:text-white'
                }`}
              >
                {isAr ? 'الأقصر' : 'Luxor'}
              </button>
              <button
                onClick={() => { setPartnerTypeFilter('aswan'); setActiveIndex(0); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  partnerTypeFilter === 'aswan'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'text-gray-600 hover:text-gray-900 dark:text-white/60 dark:hover:text-white'
                }`}
              >
                {isAr ? 'أسوان والإسكندرية' : 'Aswan & Alexandria'}
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="inline-flex p-1 rounded-xl bg-[#F8F3E9] dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md">
              <button
                onClick={() => setViewMode('carousel')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'carousel'
                    ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#8A661C] dark:text-[#E2CB85]'
                    : 'text-gray-600 hover:text-gray-900 dark:text-white/60 dark:hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isAr ? 'معرض ثلاثي الأبعاد' : '3D Carousel'}</span>
              </button>
              <button
                onClick={() => setViewMode('papyrus')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'papyrus'
                    ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#8A661C] dark:text-[#E2CB85]'
                    : 'text-gray-600 hover:text-gray-900 dark:text-white/60 dark:hover:text-white'
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

                      {/* Top Overlay Badge (Role + Logo Tag + Selective Delete) */}
                      <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#030712]/85 backdrop-blur-md border border-[#D4AF37]/60 text-[#E2CB85] text-[11px] font-bold shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
                          <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{isAr ? ambassador.categoryAr : ambassador.category}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="px-3 py-1 rounded-lg bg-[#030712]/90 backdrop-blur-md border border-[#D4AF37]/40 font-mono text-xs font-black tracking-widest text-[#F3E5AB] shadow-md">
                            {ambassador.logoText}
                          </div>

                          {/* Selective Delete: Subtle glassmorphism circle with minimal X icon */}
                          {ambassador.isUserGenerated && (
                            <button
                              type="button"
                              onClick={(e) => removeCard(ambassador.id, e)}
                              className="p-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[#D4AF37]/75 hover:text-red-400 hover:border-red-400/40 hover:bg-black/80 shadow-sm transition-all duration-200 hover:scale-110 active:scale-95 z-20 group/del"
                              title={isAr ? 'حذف البطاقة المخصصة' : 'Remove Custom Card'}
                              aria-label="Delete card"
                            >
                              <X className="w-3.5 h-3.5 transition-transform group-hover/del:rotate-90 duration-200" />
                            </button>
                          )}
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
                          <span className="font-semibold text-slate-900 dark:text-white">
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
            {filteredAmbassadors.length > 1 && (
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
            )}
          </div>
        )}

        {/* VIEW 2: Modern Papyrus Masonry Grid */}
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
                className="group relative bg-[#F8F3E9] dark:bg-[#09111E] border border-slate-200 dark:border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-3xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

                  {/* Logo overlay & Selective Delete */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                    <div className="px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-[11px] font-mono font-bold tracking-widest text-[#F5E6B8] border border-[#D4AF37]/40 shadow-sm">
                      {ambassador.logoText}
                    </div>

                    {ambassador.isUserGenerated && (
                      <button
                        type="button"
                        onClick={(e) => removeCard(ambassador.id, e)}
                        className="p-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[#D4AF37]/75 hover:text-red-400 hover:border-red-400/40 hover:bg-black/80 shadow-sm transition-all duration-200 hover:scale-110 active:scale-95 group/del"
                        title={isAr ? 'حذف البطاقة المخصصة' : 'Remove Custom Card'}
                        aria-label="Delete card"
                      >
                        <X className="w-3.5 h-3.5 transition-transform group-hover/del:rotate-90 duration-200" />
                      </button>
                    )}
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
                    <span className="text-[10px] uppercase font-bold text-[#8A661C] dark:text-[#E2CB85] tracking-widest block mb-1">
                      {isAr ? ambassador.categoryAr : ambassador.category}
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#C5A059] dark:group-hover:text-[#F5E6B8] transition-colors leading-snug">
                      {isAr ? ambassador.nameAr : ambassador.name}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-white/60 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#D4AF37]" />
                      <span>{isAr ? ambassador.monumentNameAr : ambassador.monumentName}</span>
                    </p>
                  </div>

                  <p className="text-xs text-gray-700 dark:text-white/70 italic line-clamp-2 border-t border-slate-200 dark:border-white/5 pt-2 font-serif">
                    "{isAr ? ambassador.quoteAr : ambassador.quote}"
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs text-[#8A661C] dark:text-[#E2CB85] font-semibold">
                    <span>{isAr ? 'عرض التفاصيل' : 'Explore Story'}</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Global Partnership CTA Banner */}
        <div className="mt-16 rounded-3xl bg-[#F8F3E9] dark:bg-gradient-to-r dark:from-[#0C1628] dark:via-[#101E35] dark:to-[#0A1220] border border-slate-200/80 dark:border-[#D4AF37]/40 p-8 sm:p-10 shadow-sm dark:shadow-[0_0_50px_rgba(212,175,55,0.15)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-52 h-52 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8A661C] dark:text-[#E2CB85] tracking-wider uppercase">
              <span>{isAr ? 'دعوة VIP حصرية' : 'EXCLUSIVE VIP INVITATION'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1A2332] dark:text-white">
              {isAr ? 'قصتك تستحق أن تُخلّد بين العظماء.' : 'Your Story Belongs Among the Greats.'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-white/70">
              {isAr
                ? 'لأنك تستحق الأفضل بكل تأكيد. أضف صورتك إلى جانب قادة العالم وأيقونات الحضارة، وخلّد رحلتك المصرية الاستثنائية.'
                : 'Because you deserve the absolute best. Add your portrait alongside world leaders and global icons, and immortalize your exclusive Egyptian journey.'}
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#D4AF37] to-[#E2CB85] text-[#030712] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-105 active:scale-95"
            >
              <span>{isAr ? 'احصل على مكانتك الملكية' : 'Claim Your VIP Status'}</span>
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
              className="relative w-full max-w-2xl bg-[#FDFBF7] dark:bg-[#09111E] border border-[#D4AF37]/50 rounded-3xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.5)] z-10"
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-[#F8F3E9] dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10">
                  <div>
                    <span className="text-gray-500 dark:text-white/40 block uppercase">{isAr ? 'المعلم' : 'Monument'}</span>
                    <span className="font-bold text-gray-900 dark:text-white text-sm">
                      {isAr ? selectedAmbassador.monumentNameAr : selectedAmbassador.monumentName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-white/40 block uppercase">{isAr ? 'الموقع' : 'Location'}</span>
                    <span className="font-bold text-[#8A661C] dark:text-[#E2CB85] text-sm">
                      {isAr ? selectedAmbassador.locationAr : selectedAmbassador.location}
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-gray-500 dark:text-white/40 block uppercase">{isAr ? 'الصفة' : 'Role'}</span>
                    <span className="font-bold text-emerald-700 dark:text-[#4EE2A2] text-sm">
                      {isAr ? selectedAmbassador.categoryAr : selectedAmbassador.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-bold text-[#D4AF37] tracking-wider">
                    {isAr ? 'بيان الزيارة والأثر الحضاري' : 'Ambassador Story & Reflection'}
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-white/80 leading-relaxed font-serif italic bg-slate-100 dark:bg-[#050B14] p-4 rounded-xl border border-slate-200 dark:border-white/5">
                    "{isAr ? selectedAmbassador.quoteAr : selectedAmbassador.quote}"
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  {/* Selective Deletion inside Details Modal */}
                  {selectedAmbassador.isUserGenerated ? (
                    <button
                      type="button"
                      onClick={() => removeCard(selectedAmbassador.id)}
                      className="px-4 py-2 rounded-xl bg-slate-200/80 dark:bg-black/40 backdrop-blur-md border border-slate-300 dark:border-white/10 text-gray-700 dark:text-white/60 hover:text-red-500 dark:hover:text-red-400 hover:border-red-400/40 font-medium text-xs flex items-center gap-1.5 transition-all shadow-sm group/del"
                    >
                      <X className="w-3.5 h-3.5 text-[#D4AF37]/75 group-hover/del:text-red-400 transition-colors" />
                      <span>{isAr ? 'حذف بطاقتي المخصصة' : 'Remove Custom Card'}</span>
                    </button>
                  ) : <div />}

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

      {/* MODAL 2: Interactive VIP Ambassador Creator & Application Form */}
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
              className="relative w-full max-w-lg bg-[#FDFBF7] dark:bg-[#0C1525] border border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(212,175,55,0.25)] z-10 my-8"
            >
              <button
                onClick={() => setIsJoinModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-200/70 dark:bg-white/5 hover:bg-slate-300/80 dark:hover:bg-white/10 text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <Crown className="w-10 h-10 text-[#D4AF37] mx-auto mb-2 animate-bounce" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isAr ? 'إصدار بطاقة سفير رسمي' : 'Create Your VIP Ambassador Card'}
                </h3>
                <p className="text-xs text-gray-600 dark:text-white/60 mt-1 max-w-sm mx-auto">
                  {isAr
                    ? 'أدخل بياناتك وصورتك لإنشاء بطاقتك التفاعلية فوراً وإضافتها إلى المعرض الملكي.'
                    : 'Personalize your card with your visit photo and story to feature instantly in the EgyptX Showcase.'}
                </p>
              </div>

              <form onSubmit={handleAddAmbassador} className="space-y-4 text-xs">
                {/* Ambassador Name */}
                <div>
                  <label className="block text-gray-700 dark:text-white/70 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                    {isAr ? 'اسم الشخصية / السفير' : 'Ambassador / Creator Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder={isAr ? 'مثال: د. مجدي يعقوب أو اسمك الكريم' : 'e.g. Elena Rostova or Your Name'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>

                {/* Role / Category */}
                <div>
                  <label className="block text-gray-700 dark:text-white/70 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                    {isAr ? 'الصفة / مجال التمثيل' : 'Role / Category Title'}
                  </label>
                  <input
                    type="text"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder={isAr ? 'مثال: سفير التراث الثقافي، رائد استكشاف' : 'e.g. VIP Cultural Ambassador, Heritage Explorer'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>

                {/* Monument Selection */}
                <div>
                  <label className="block text-gray-700 dark:text-white/70 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                    {isAr ? 'المعلم المصري المرتبط بالزيارة' : 'Associated Egyptian Monument'}
                  </label>
                  <select
                    value={formMonument}
                    onChange={(e) => setFormMonument(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#08101E] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                  >
                    <option value="Great Pyramids of Giza">{isAr ? 'أهرامات الجيزة الخالدة' : 'Great Pyramids of Giza'}</option>
                    <option value="Grand Egyptian Museum (GEM)">{isAr ? 'المتحف المصري الكبير (GEM)' : 'Grand Egyptian Museum (GEM)'}</option>
                    <option value="Karnak & Luxor Temples">{isAr ? 'معابد الكرنك والأقصر' : 'Karnak & Luxor Temples'}</option>
                    <option value="Philae & Aswan Temples">{isAr ? 'معابد فيلة ونيل أسوان' : 'Philae & Aswan Temples'}</option>
                    <option value="Abu Simbel Temples">{isAr ? 'معبدي أبو سمبل الخالدين' : 'Abu Simbel Temples'}</option>
                    <option value="Bibliotheca Alexandrina">{isAr ? 'مكتبة الإسكندرية العريقة' : 'Bibliotheca Alexandrina'}</option>
                    <option value="Citadel of Saladin & Historic Cairo">{isAr ? 'قلعة صلاح الدين والقاهرة التاريخية' : 'Citadel of Saladin & Historic Cairo'}</option>
                    <option value="Valley of the Kings">{isAr ? 'وادي الملوك والملكات' : 'Valley of the Kings'}</option>
                  </select>
                </div>

                {/* Image Upload Field */}
                <div>
                  <label className="block text-gray-700 dark:text-white/70 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                    {isAr ? 'صورة الزيارة أو السفير' : 'Upload Monument / Ambassador Photo'}
                  </label>
                  <div className="relative border-2 border-dashed border-[#D4AF37]/40 hover:border-[#D4AF37] rounded-2xl p-4 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-all text-center cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    {imagePreviewUrl ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={imagePreviewUrl}
                          alt="Uploaded Preview"
                          className="w-14 h-14 rounded-xl object-cover object-top border border-[#D4AF37]/50 shadow-md shrink-0"
                        />
                        <div className="text-left text-xs space-y-0.5 truncate">
                          <p className="text-gray-900 dark:text-white font-medium truncate">
                            {selectedImageFile?.name || 'custom-image.jpg'}
                          </p>
                          <p className="text-[#E2CB85] text-[11px] font-semibold">
                            {isAr ? 'تم تحميل الصورة • انقر للتغيير' : 'Image ready • Click to change'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-2 text-gray-600 dark:text-white/70 group-hover:text-gray-900 dark:group-hover:text-white">
                        <Upload className="w-6 h-6 text-[#D4AF37] mb-1.5 animate-pulse" />
                        <p className="text-xs font-semibold">
                          {isAr ? 'انقر لرفع صورة السفير أو اسحبها هنا' : 'Click or drag photo here to upload'}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-white/40 mt-0.5">PNG, JPG, WEBP (Max 10MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Your Experience / Story Textarea */}
                <div>
                  <label className="block text-gray-700 dark:text-white/70 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                    {isAr ? 'رسالة أو قصة الزيارة والانطباع' : 'Your Experience / Heritage Story'} *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formStory}
                    onChange={(e) => setFormStory(e.target.value)}
                    placeholder={
                      isAr
                        ? 'شاركنا شعورك ورسالتك الشخصية عند استكشاف هذا المعلم التاريخي...'
                        : 'Share your personal thoughts, reflection, or impression while exploring this ancient wonder...'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-gray-900 dark:text-white text-xs leading-relaxed focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E2CB85] text-black font-extrabold text-sm tracking-wide shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_4px_30px_rgba(212,175,55,0.5)] transition-all flex items-center justify-center gap-2 mt-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Crown className="w-4 h-4 text-black" />
                  <span>{isAr ? 'إصدار ونشر بطاقة السفير الملكية' : 'Publish VIP Ambassador Card'}</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Royal Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm sm:max-w-md p-4 rounded-2xl bg-[#FDFBF7]/95 dark:bg-[#09111E]/95 backdrop-blur-xl border border-[#D4AF37]/60 shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex items-start gap-3 text-gray-900 dark:text-white"
          >
            <div className="shrink-0 p-2 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#E2CB85]">
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-[#4EE2A2]" />
              ) : (
                <Crown className="w-5 h-5 text-[#D4AF37]" />
              )}
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <h4 className="text-sm font-bold text-[#8A661C] dark:text-[#F3E5AB] leading-tight">
                {toast.title}
              </h4>
              <p className="text-xs text-gray-700 dark:text-white/80 mt-1 leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => setToast((prev) => ({ ...prev, show: false }))}
              className="shrink-0 p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
