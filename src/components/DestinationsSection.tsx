'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight } from 'lucide-react';

const getDestinations = (t: any) => [
  {
    id: 'giza',
    name: t('destinations.giza.name'),
    tagline: t('destinations.giza.tagline'),
    highlights: t('destinations.giza.highlights'),
    image: '/images/giza.jpg',
    imageUrl: '/images/giza.jpg',
    video: '/videos/giza.mp4',
    description: t('destinations.giza.desc'),
  },
  {
    id: 'luxor',
    name: t('destinations.luxor.name'),
    tagline: t('destinations.luxor.tagline'),
    highlights: t('destinations.luxor.highlights'),
    image: '/luxor-majestic-temple.png',
    imageUrl: '/luxor-majestic-temple.png',
    video: '/videos/luxor.mp4',
    description: t('destinations.luxor.desc'),
  },
  {
    id: 'aswan',
    name: t('destinations.aswan.name'),
    tagline: t('destinations.aswan.tagline'),
    highlights: t('destinations.aswan.highlights'),
    image: '/aswan-nile-felucca.png',
    imageUrl: '/aswan-nile-felucca.png',
    video: '/videos/aswan.mp4',
    description: t('destinations.aswan.desc'),
  },
  {
    id: 'siwa',
    name: t('destinations.siwa.name'),
    tagline: t('destinations.siwa.tagline'),
    highlights: t('destinations.siwa.highlights'),
    image: '/siwa-magic-springs.png',
    imageUrl: '/siwa-magic-springs.png',
    video: '/videos/siwa.mp4',
    description: t('destinations.siwa.desc'),
  },
  {
    id: 'fayoum',
    name: t('destinations.fayoum.name'),
    tagline: t('destinations.fayoum.tagline'),
    highlights: t('destinations.fayoum.highlights'),
    image: '/fayoum-wadi-waterfalls.png',
    imageUrl: '/fayoum-wadi-waterfalls.png',
    video: '/videos/fayoum.mp4',
    description: t('destinations.fayoum.desc'),
  },
  {
    id: 'hurghada',
    name: t('destinations.hurghada.name'),
    tagline: t('destinations.hurghada.tagline'),
    highlights: t('destinations.hurghada.highlights'),
    image: '/hurghada-red-sea-reef.png',
    imageUrl: '/hurghada-red-sea-reef.png',
    video: '/videos/hurghada.mp4',
    description: t('destinations.hurghada.desc'),
  },
];


const LANDMARK_UNSPLASH_IMAGES = [
  'https://images.unsplash.com/photo-1568322445389-f64ac2515099?w=800', // Pyramids
  'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800', // Luxor
  'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800', // Nile
];

export default function DestinationsSection() {
  const { t } = useLanguage();
  const [selectedDestination, setSelectedDestination] = useState<any | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedDestination(null);
      }
    };
    if (selectedDestination) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedDestination]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
  };

  return (
    <section className="py-28 md:py-36 bg-[#FDFBF7] dark:bg-[#0B0F19] text-slate-900 dark:text-white relative overflow-hidden">
      {/* Subtle Torchlight glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#C5A059]/5 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-serif-editorial font-bold bg-gradient-to-r from-[#A68440] via-[#C5A059] to-[#A68440] dark:from-[#D4AF37] dark:via-[#F3E5AB] dark:to-[#D4AF37] bg-clip-text text-transparent inline-block mb-4"
          >{t('explore.title')}</motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-slate-600 dark:text-stone-300/80 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed"
          >{t('explore.subtitle')}</motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {getDestinations(t).map((dest, idx) => {
            const bgImage = LANDMARK_UNSPLASH_IMAGES[idx % LANDMARK_UNSPLASH_IMAGES.length];
            return (
            <motion.div 
              key={dest.id}
              variants={itemVariants}
              onClick={() => setSelectedDestination(dest)}
              className="group relative flex flex-col h-[410px] rounded-2xl overflow-hidden bg-[#F8F3E9] dark:bg-[#131A2A] border border-slate-200/80 dark:border-white/5 shadow-sm dark:shadow-none hover:shadow-md dark:hover:border-[#D4AF37]/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              {/* Full Card Hover Background Image (hidden by default, 0.3 opacity on hover) */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none z-0"
                style={{ backgroundImage: `url('${bgImage}')` }}
              />
              {/* Visual Top Half */}
              <div className="h-[60%] w-full overflow-hidden relative z-10">
                <div className="absolute inset-0 transition-all duration-500 opacity-90 group-hover:opacity-100 group-hover:scale-105 transform origin-center group-hover:brightness-110">
                  <Image 
                    src={dest.image}
                    alt={dest.name}
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-[#0a0a0a]/30 to-transparent"></div>
              </div>

              {/* Bottom Content */}
              <div className="h-[40%] p-6 flex flex-col justify-between bg-[#F8F3E9] dark:bg-[#131A2A] relative z-10 border-t border-slate-200/60 dark:border-white/5">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif-editorial font-bold text-[#1A2332] dark:text-gray-100 mb-1 group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-yellow-700 dark:text-yellow-400 mb-1.5">{dest.tagline}</p>
                  <p className="text-xs text-slate-500 dark:text-gray-400 line-clamp-1">{dest.highlights}</p>
                </div>
                
                <div className="flex items-center text-xs sm:text-sm font-semibold text-[#1A2332] dark:text-gray-200 group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors pt-2">
                  <span className="transform transition-transform duration-300 group-hover:translate-x-1">{t('exploreDest')}</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 text-yellow-600 dark:text-yellow-400 transform transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedDestination && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedDestination(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-[95%] sm:w-full max-w-[600px] bg-[#0a0a0a] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedDestination(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 hover:text-[#C9A84C] transition-colors border border-white/20"
                aria-label="Close modal"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              {/* Video Player */}
              <div className="w-full h-[220px] sm:h-[340px] bg-black relative">
                <video
                  src={selectedDestination.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <h3 className="text-3xl font-bold text-[#C9A84C] mb-4">{selectedDestination.name}</h3>
                <p className="text-gray-300 leading-relaxed mb-8 text-sm md:text-base">
                  {selectedDestination.description}
                </p>
                <Link
                  href="/planner"
                  className="inline-flex w-full sm:w-auto px-8 py-3 bg-[#C9A84C] text-[#0a0a0a] font-bold uppercase tracking-wider rounded-lg hover:bg-[#E8D08D] transition-colors justify-center items-center"
                >
                  {t('destinations.planJourney')}
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
