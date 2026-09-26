'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const getDestinations = (t: any) => [
  {
    id: 'giza',
    name: t('destinations.giza.name'),
    tagline: t('destinations.giza.tagline'),
    highlights: t('destinations.giza.highlights'),
    image: '/images/giza.jpg',
    video: '/videos/giza.mp4',
    description: t('destinations.giza.desc'),
  },
  {
    id: 'luxor',
    name: t('destinations.luxor.name'),
    tagline: t('destinations.luxor.tagline'),
    highlights: t('destinations.luxor.highlights'),
    image: '/images/luxor.jpg',
    video: '/videos/luxor.mp4',
    description: t('destinations.luxor.desc'),
  },
  {
    id: 'aswan',
    name: t('destinations.aswan.name'),
    tagline: t('destinations.aswan.tagline'),
    highlights: t('destinations.aswan.highlights'),
    image: '/images/aswan.jpg',
    video: '/videos/aswan.mp4',
    description: t('destinations.aswan.desc'),
  },
  {
    id: 'siwa',
    name: t('destinations.siwa.name'),
    tagline: t('destinations.siwa.tagline'),
    highlights: t('destinations.siwa.highlights'),
    image: '/images/Siwa Oasisss.jpg',
    video: '/videos/siwa.mp4',
    description: t('destinations.siwa.desc'),
  },
  {
    id: 'fayoum',
    name: t('destinations.fayoum.name'),
    tagline: t('destinations.fayoum.tagline'),
    highlights: t('destinations.fayoum.highlights'),
    image: '/images/Fayoum Oasisss.jpg',
    video: '/videos/fayoum.mp4',
    description: t('destinations.fayoum.desc'),
  },
  {
    id: 'hurghada',
    name: t('destinations.hurghada.name'),
    tagline: t('destinations.hurghada.tagline'),
    highlights: t('destinations.hurghada.highlights'),
    image: '/images/hurghada.jpg',
    video: '/videos/hurghada.mp4',
    description: t('destinations.hurghada.desc'),
  },
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
    <section className="py-24 bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#C9A84C] via-[#E8D08D] to-[#C9A84C] bg-clip-text text-transparent inline-block mb-4"
          >{t('explore.title')}</motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto"
          >{t('explore.subtitle')}</motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {getDestinations(t).map((dest) => (
            <motion.div 
              key={dest.id}
              variants={itemVariants}
              onClick={() => setSelectedDestination(dest)}
              className="group relative flex flex-col h-[400px] rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md border border-[#C9A84C]/10 hover:border-[#C9A84C]/30 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
            >
              {/* Visual Top Half */}
              <div className="h-[60%] w-full overflow-hidden relative">
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
              <div className="h-[40%] p-6 flex flex-col justify-between bg-[#0a0a0a]/80 relative z-10">
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-1 group-hover:text-[#C9A84C] transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-sm font-medium text-[#C9A84C] mb-2">{dest.tagline}</p>
                  <p className="text-xs text-gray-400 line-clamp-1">{dest.highlights}</p>
                </div>
                
                <div className="flex items-center text-sm font-medium text-white group-hover:text-[#C9A84C] transition-colors">
                  <span className="transform transition-transform duration-300 group-hover:translate-x-1">{t('exploreDest')}</span>
                </div>
              </div>
            </motion.div>
          ))}
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
                  Plan My Journey Here &rarr;
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
