"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Landmark, 
  Sparkles, 
  Compass, 
  Crown, 
  MapPin, 
  ArrowLeft, 
  ExternalLink,
  Layers,
  ChevronRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export interface NationalProject {
  id: string;
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  category: 'Tourism' | 'Heritage' | 'Mummies Parade' | 'Museums';
  imageUrl: string;
  location: string;
  year: string;
  highlight: string;
  stats: string;
}

export const NATIONAL_PROJECTS: NationalProject[] = [
  {
    id: 'gem',
    title: {
      en: 'Grand Egyptian Museum (GEM)',
      ar: 'المتحف المصري الكبير'
    },
    description: {
      en: 'The largest archaeological museum complex in the world dedicated to a single civilization, housing over 100,000 artifacts including the complete Tutankhamun collection.',
      ar: 'أكبر مجمع متاحف أثرية في العالم مكرس لحضارة واحدة، يضم أكثر من 100,000 قطعة أثرية بما فيها مجموعة الملك توت عنخ آمون الكاملة.'
    },
    category: 'Museums',
    imageUrl: '/gem.jpg',
    location: 'Giza Plateau, Cairo',
    year: '2024–2025',
    highlight: 'Over 100,000 Treasures',
    stats: '500,000 m² Area'
  },
  {
    id: 'mummies-parade',
    title: {
      en: "Pharaohs' Golden Parade & NMEC",
      ar: 'موكب المومياوات الملكية والمتحف القومي للحضارة'
    },
    description: {
      en: 'A historic theatrical procession that safely transferred 22 royal mummies from Tahrir to the state-of-the-art National Museum of Egyptian Civilization in Fustat.',
      ar: 'موكب أسطوري مهيب نقل 22 مومياء ملكية فرعونية من ميدان التحرير إلى المتحف القومي للحضارة المصرية بالفسطاط بتقنيات حفظ عالمية.'
    },
    category: 'Mummies Parade',
    imageUrl: '/mummies.jpg',
    location: 'Fustat, Historic Cairo',
    year: '2021',
    highlight: '22 Royal Monarchs',
    stats: 'Global Broadcast to 60+ Nations'
  },
  {
    id: 'sphinxes-avenue',
    title: {
      en: 'Avenue of Sphinxes Restoration',
      ar: 'إحياء وتطوير طريق الكباش بالأقصر'
    },
    description: {
      en: 'Restoration of the 2.7-kilometer sacred ceremonial processional way connecting Karnak Temple and Luxor Temple, flanked by over 1,050 carved sphinx statues.',
      ar: 'مشروع أثري وطني أعاد افتتاح الطريق الاحتفالي المقدس بطول 2.7 كم الرابط بين معبدي الكرنك والأقصر محاطاً بأكثر من 1,050 تمثال كباش.'
    },
    category: 'Heritage',
    imageUrl: '/sphinx.jpg',
    location: 'Luxor (Thebes)',
    year: '2021',
    highlight: '2,700m Ceremonial Route',
    stats: '1,050 Sphinx Statues'
  },
  {
    id: 'historic-cairo',
    title: {
      en: 'Historic Cairo & Ahl Misr Walkway',
      ar: 'تطوير القاهرة التاريخية وممشى أهل مصر'
    },
    description: {
      en: 'Urban revitalization of Islamic Cairo, the Citadel aqueducts, and the Nile riverfront promenades, blending cultural heritage preservation with vibrant modern tourism.',
      ar: 'مشروع قومي لتطوير وترميم القاهرة الإسلامية وسور مجرى العيون مع إنشاء ممشى أهل مصر السياحي المتطور على ضفاف نهر النيل.'
    },
    category: 'Tourism',
    imageUrl: '/cairo.jpg',
    location: 'Nile Corniche & Old Cairo',
    year: '2022–2024',
    highlight: 'Eco-Friendly Waterfront',
    stats: '14.5 km Nile Promenade'
  },
  {
    id: 'greco-roman',
    title: {
      en: 'Greco-Roman Museum of Alexandria',
      ar: 'إعادة إحياء المتحف اليوناني الروماني بالإسكندرية'
    },
    description: {
      en: 'Comprehensive reconstruction and modernization of Alexandria’s premier classical heritage museum, exhibiting over 10,000 antiquities spanning Alexander to the Byzantine era.',
      ar: 'ترميم وتحديث شامل لأقدم متاحف الآثار الكلاسيكية في الشرق الأوسط لعرض أكثر من 10 آلاف قطعة أثرية من عصور الإسكندر حتى البيزنطية.'
    },
    category: 'Museums',
    imageUrl: '/alex.jpg',
    location: 'Alexandria',
    year: '2023',
    highlight: 'Classical Mediterranean Legacy',
    stats: '44 Exhibition Galleries'
  },
  {
    id: 'great-transfiguration',
    title: {
      en: 'The Great Transfiguration (Saint Catherine)',
      ar: 'مشروع التجلي الأعظم بسانت كاترين'
    },
    description: {
      en: 'World-heritage sustainable tourism transformation surrounding Mount Sinai and the Monastery of Saint Catherine, dedicated to interfaith pilgrimage and eco-tourism.',
      ar: 'مشروع تنموي عالمي فريد لتطوير منطقة سانت كاترين وجبل موسى، كوجهة عالمية للسياحة الروحية والبيئية مع صون التراث الإنساني لليونسكو.'
    },
    category: 'Heritage',
    imageUrl: '/catherine.jpg',
    location: 'South Sinai',
    year: '2024–2025',
    highlight: 'Spiritual World Heritage',
    stats: '14 Integrated Mega-Projects'
  },
  {
    id: 'new-alamein',
    title: {
      en: 'New Alamein Riviera & Eco-Tourism',
      ar: 'ريفييرا العلمين الجديدة والسياحة الساحلية'
    },
    description: {
      en: 'Transforming the Mediterranean coastline into a year-round smart hub for international leisure, cultural festivals, and sustainable beach tourism.',
      ar: 'تحويل ساحل البحر المتوسط إلى مركز دولي ذكي مستدام للسياحة الترفيهية والمهرجانات الثقافية على مدار العام.'
    },
    category: 'Tourism',
    imageUrl: '/alamein.jpg',
    location: 'Mediterranean Coast',
    year: '2023–2025',
    highlight: 'Year-Round Coastal Hub',
    stats: '14 km Crystal Lagoon & Shoreline'
  },
  {
    id: 'saqqara-discoveries',
    title: {
      en: 'Saqqara Necropolis Modernization',
      ar: 'مركز زوار واكتشافات جبانة سقارة الأثرية'
    },
    description: {
      en: 'State-of-the-art visitor facilities and archaeological exploration platforms showcasing newly unearthed Old Kingdom shafts, animal mummies, and intact sarcophagi.',
      ar: 'تطوير مسارات الزيارة ومراكز الاستقبال المتطورة في سقارة لمواكبة أضخم الكشوفات الأثرية للتوابيت الملونة ومقابر الدولة القديمة.'
    },
    category: 'Heritage',
    imageUrl: '/saqqara.jpg',
    location: 'Saqqara, Giza',
    year: '2022–2024',
    highlight: 'Step Pyramid Sanctuary',
    stats: '250+ Sarcophagi Unearthed'
  }
];

const CATEGORIES = ['All', 'Museums', 'Heritage', 'Mummies Parade', 'Tourism'] as const;
type CategoryFilter = typeof CATEGORIES[number];

export default function NationalProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [activeProjectModal, setActiveProjectModal] = useState<NationalProject | null>(null);

  const filteredProjects = selectedCategory === 'All'
    ? NATIONAL_PROJECTS
    : NATIONAL_PROJECTS.filter(project => project.category === selectedCategory);

  return (
    <div 
      className="relative min-h-screen bg-cover bg-center bg-no-repeat bg-fixed text-white font-sans selection:bg-amber-500 selection:text-black"
      style={{ backgroundImage: "url('/Golden Hieroglyphs at Sunset.png')" }}
    >
      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-[2px] z-0 pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* ── TOP HEADER ────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-40 px-4 sm:px-8 py-4 bg-gray-950/80 backdrop-blur-xl border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
              title="Back to Home"
            >
              <ArrowLeft className="w-5 h-5 text-amber-400" />
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-amber-400 to-amber-600 flex items-center gap-2">
                National Projects of Egypt
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  المشروعات القومية
                </span>
              </h1>
              <p className="text-xs text-gray-400 font-light hidden sm:block">
                Celebrating modern megaprojects, heritage preservation, and tourism excellence
              </p>
            </div>
          </div>

          <Link
            href="/planner"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-all cursor-pointer shadow-md"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Plan Your Tour</span>
            <span className="sm:hidden">Plan</span>
          </Link>
        </header>

        {/* ── HERO BANNER SECTION ───────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-4 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Egypt&apos;s 2030 Tourism & Heritage Vision</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 leading-tight">
            Egypt&apos;s Modern Renaissance <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">
              نهضة مصر الحديثة
            </span>
          </h2>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-gray-300 font-light leading-relaxed mb-8">
            From the monumental halls of the Grand Egyptian Museum and the historic Royal Mummies Parade 
            to restored ancient avenues and sustainable Mediterranean coasts, discover how Egypt is reimagining 
            its legacy for the next thousand years.
          </p>

          {/* Key Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-10">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-amber-500/20 backdrop-blur-md">
              <span className="text-xl sm:text-2xl font-black text-amber-300 block">100,000+</span>
              <span className="text-[11px] text-gray-400 font-medium">Relics Curated at GEM</span>
            </div>
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-amber-500/20 backdrop-blur-md">
              <span className="text-xl sm:text-2xl font-black text-amber-300 block">22</span>
              <span className="text-[11px] text-gray-400 font-medium">Royal Mummies Enshrined</span>
            </div>
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-amber-500/20 backdrop-blur-md">
              <span className="text-xl sm:text-2xl font-black text-amber-300 block">2.7 km</span>
              <span className="text-[11px] text-gray-400 font-medium">Avenue of Sphinxes</span>
            </div>
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-amber-500/20 backdrop-blur-md">
              <span className="text-xl sm:text-2xl font-black text-amber-300 block">100%</span>
              <span className="text-[11px] text-gray-400 font-medium">Sustainable Heritage</span>
            </div>
          </div>

          {/* ── FILTER TABS ─────────────────────────────────────────────── */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-2">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-950 shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-105'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 hover:border-amber-500/30'
                  }`}
                >
                  {cat === 'All' && ' '}
                  {cat === 'Museums' && '️ '}
                  {cat === 'Heritage' && ' '}
                  {cat === 'Mummies Parade' && ' '}
                  {cat === 'Tourism' && '️ '}
                  {cat}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── PROJECTS GRID ─────────────────────────────────────────────── */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 flex-1">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  className="group relative bg-white/5 border border-amber-500/20 hover:border-amber-400/50 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl hover:shadow-[0_0_35px_rgba(245,158,11,0.2)] transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Image Container */}
                  <div className="relative w-full h-52 sm:h-56 overflow-hidden bg-gray-900">
                    <img 
                      src={project.imageUrl} 
                      alt={project.title.en} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    
                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-amber-300 border border-amber-500/40">
                        {project.category}
                      </span>
                    </div>

                    {/* Year / Status Badge */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-black/60 backdrop-blur-md text-gray-300 border border-white/15">
                        <Calendar className="w-3 h-3 text-amber-400" />
                        {project.year}
                      </span>
                    </div>

                    {/* Location Tag */}
                    <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 text-xs text-amber-200 font-medium drop-shadow-md">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{project.location}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Titles */}
                      <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors mb-1">
                        {project.title.en}
                      </h3>
                      <p className="text-xs font-semibold text-amber-400/90 font-serif mb-3" dir="rtl">
                        {project.title.ar}
                      </p>

                      {/* Description */}
                      <p className="text-xs text-gray-300 leading-relaxed font-light line-clamp-3">
                        {project.description.en}
                      </p>
                    </div>

                    {/* Highlights & CTA */}
                    <div className="pt-4 border-t border-white/10 space-y-3">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-400 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          {project.highlight}
                        </span>
                        <span className="font-mono text-amber-300 font-semibold">
                          {project.stats}
                        </span>
                      </div>

                      <button
                        onClick={() => setActiveProjectModal(project)}
                        className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 text-xs font-bold text-gray-200 hover:text-amber-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer group-hover:bg-amber-500/10"
                      >
                        <span>Explore Milestone</span>
                        <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </main>

        {/* ── PROJECT DETAILS MODAL ─────────────────────────────────────── */}
        <AnimatePresence>
          {activeProjectModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-gray-950 border border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl text-white"
              >
                {/* Modal Image */}
                <div className="relative h-60 sm:h-72 w-full">
                  <img
                    src={activeProjectModal.imageUrl}
                    alt={activeProjectModal.title.en}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />

                  <button
                    onClick={() => setActiveProjectModal(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white/80 hover:text-white border border-white/20 transition-all cursor-pointer"
                  >
                    
                  </button>

                  <div className="absolute bottom-4 left-6">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/30 text-amber-200 border border-amber-500/50">
                      {activeProjectModal.category}
                    </span>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 sm:p-8 space-y-6">
                  <div>
                    <h3 className="text-2xl font-black text-white mb-1">
                      {activeProjectModal.title.en}
                    </h3>
                    <p className="text-sm font-bold text-amber-400 font-serif" dir="rtl">
                      {activeProjectModal.title.ar}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-gray-300 leading-relaxed font-light">
                      {activeProjectModal.description.en}
                    </p>
                    <p className="text-sm text-amber-100/90 leading-relaxed font-medium bg-white/5 p-4 rounded-xl border border-white/5" dir="rtl">
                      {activeProjectModal.description.ar}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-[10px] text-gray-400 block uppercase font-mono">Location</span>
                      <span className="text-xs font-bold text-white">{activeProjectModal.location}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-[10px] text-gray-400 block uppercase font-mono">Timeline</span>
                      <span className="text-xs font-bold text-white">{activeProjectModal.year}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-gray-400 block uppercase font-mono">Impact Metric</span>
                      <span className="text-xs font-bold text-amber-400 font-mono">{activeProjectModal.stats}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => setActiveProjectModal(null)}
                      className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-xs cursor-pointer transition-all"
                    >
                      Close
                    </button>
                    <Link
                      href="/planner"
                      className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-950 font-bold text-xs shadow-lg hover:shadow-amber-500/30 transition-all flex items-center gap-1.5"
                    >
                      <span>Add to Itinerary</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
