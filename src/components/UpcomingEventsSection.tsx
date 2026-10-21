'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';

interface CulturalEvent {
  id: string;
  dateTag: string;
  twoWordTitle: string;
  city: string;
  shortDesc: string;
  imageUrl: string;
  season: string;
}

const EVENTS: CulturalEvent[] = [
  {
    id: 'sun-festival',
    dateTag: 'OCT 22',
    twoWordTitle: 'Sun Festival',
    city: 'Abu Simbel',
    shortDesc: 'Solar alignment illuminating the sanctuary inner colossi.',
    imageUrl: '/sphinx.jpg',
    season: 'Autumn Equinox'
  },
  {
    id: 'opera-aida',
    dateTag: 'NOV 14',
    twoWordTitle: 'Opera Aida',
    city: 'Luxor Temple',
    shortDesc: 'Verdi masterwork staging under illuminated monumental colonnades.',
    imageUrl: '/alex.jpg',
    season: 'Nile Classical'
  },
  {
    id: 'cairo-biennale',
    dateTag: 'DEC 05',
    twoWordTitle: 'Cairo Biennale',
    city: 'Historic Cairo',
    shortDesc: 'International contemporary art across historic palaces.',
    imageUrl: '/cairo.jpg',
    season: 'Visual Arts'
  },
  {
    id: 'nile-regatta',
    dateTag: 'JAN 18',
    twoWordTitle: 'Nile Regatta',
    city: 'Aswan',
    shortDesc: 'Traditional wooden felucca flotillas racing sunset waters.',
    imageUrl: '/aswan-nile-felucca.png',
    season: 'Winter Season'
  },
  {
    id: 'sphinx-symphony',
    dateTag: 'FEB 22',
    twoWordTitle: 'Sphinx Symphony',
    city: 'Giza Plateau',
    shortDesc: 'Open-air orchestral performance beneath the Great Pyramids.',
    imageUrl: '/gem.jpg',
    season: 'Chamber Gala'
  },
  {
    id: 'golden-parade',
    dateTag: 'MAR 12',
    twoWordTitle: 'Royal Twilight',
    city: 'NMEC Fustat',
    shortDesc: 'Curated royal salon and ceremonial illuminated nocturnal tour.',
    imageUrl: '/mummies.jpg',
    season: 'Heritage Night'
  }
];

import { useLanguage } from '@/context/LanguageContext';

export default function UpcomingEventsSection() {
  const { t } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 380;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-28 md:py-36 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 max-w-xl">
            <span className="text-[11px] uppercase tracking-[0.28em] font-semibold text-[#AA8C4B] dark:text-[#C5A869]">
              {t('home.events.calendarTag')}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-editorial font-bold text-stone-900 dark:text-white tracking-tight leading-none">
              {t('home.events.title')}
            </h2>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 font-light leading-relaxed">
              {t('home.events.subtitle')}
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => scroll('left')}
              className="w-11 h-11 rounded-full bg-[#F8F3E9] dark:bg-white/5 border border-black/[0.04] dark:border-white/10 hover:border-[#C5A869]/40 text-stone-800 dark:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:scale-105"
              aria-label="Previous events"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-11 h-11 rounded-full bg-[#F8F3E9] dark:bg-white/5 border border-black/[0.04] dark:border-white/10 hover:border-[#C5A869]/40 text-stone-800 dark:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:scale-105"
              aria-label="Next events"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Editorial Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-8 pt-2 no-scrollbar snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {EVENTS.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className="snap-start shrink-0 w-[300px] sm:w-[340px] md:w-[360px] group cursor-pointer"
            >
              <div className="bg-[#F8F3E9] dark:bg-[#0A1628]/80 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgb(0,0,0,0.06)] border border-black/[0.03] dark:border-white/5 flex flex-col h-full">
                
                {/* Image Container with Editorial Aspect Ratio */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-stone-200 dark:bg-stone-900">
                  <Image
                    src={event.imageUrl}
                    alt={event.twoWordTitle}
                    fill
                    sizes="(max-width: 768px) 340px, 360px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80" />
                  
                  {/* Minimal Date Tag */}
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-[#F8F7F3]/90 dark:bg-black/60 backdrop-blur-md border border-white/20 shadow-sm">
                    <span className="text-[10px] font-mono font-bold tracking-wider text-stone-900 dark:text-white uppercase">
                      {event.dateTag}
                    </span>
                  </div>

                  {/* Season Tag */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="text-[9px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/40 text-stone-200 backdrop-blur-md">
                      {event.season}
                    </span>
                  </div>

                  {/* Location badge on image */}
                  <div className="absolute bottom-3 left-4 z-10 flex items-center gap-1.5 text-xs text-white/90 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#E2CB85]" />
                    <span>{event.city}</span>
                  </div>
                </div>

                {/* Editorial Content Card */}
                <div className="p-6 flex flex-col justify-between flex-1 space-y-3">
                  <div>
                    <h3 className="text-xl font-serif-editorial font-bold text-stone-900 dark:text-white tracking-tight group-hover:text-[#AA8C4B] dark:group-hover:text-[#C5A869] transition-colors">
                      {event.twoWordTitle}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400 font-light leading-relaxed mt-2 line-clamp-2">
                      {event.shortDesc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-black/[0.04] dark:border-white/5 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-[#AA8C4B] dark:text-[#C5A869] uppercase tracking-wider">
                      {t('home.events.access')}
                    </span>
                    <span className="text-stone-400 group-hover:text-stone-900 dark:group-hover:text-white transition-colors">
                      →
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
