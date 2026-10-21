'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { Compass, Camera, Map, Headphones } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FourPillarsSection() {
  const { t } = useLanguage();
  const router = useRouter();
  
  const getPillars = (t: any) => [
    {
      icon: <Compass className="w-6 h-6 text-[#C5A869]" />,
      title: t('home.fourPillars.aiPlanning.title'),
      description: t('home.fourPillars.aiPlanning.desc'),
      action: t('home.fourPillars.aiPlanning.action'),
      link: "/planner"
    },
    {
      icon: <Map className="w-6 h-6 text-[#C5A869]" />,
      title: t('home.fourPillars.smartSites.title'),
      description: t('home.fourPillars.smartSites.desc'),
      action: t('home.fourPillars.smartSites.action'),
      link: "/smart-site"
    },
    {
      icon: <Headphones className="w-6 h-6 text-[#C5A869]" />,
      title: t('home.fourPillars.vrEgypt.title'),
      description: t('home.fourPillars.vrEgypt.desc'),
      action: t('home.fourPillars.vrEgypt.action'),
      link: "/vr-egypt"
    },
    {
      icon: <Camera className="w-6 h-6 text-[#C5A869]" />,
      title: t('home.fourPillars.aiMemories.title'),
      description: t('home.fourPillars.aiMemories.desc'),
      action: t('home.fourPillars.aiMemories.action'),
      link: "/memories"
    }
  ];

  return (
    <section className="py-28 md:py-36 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-3">
          <span className="text-[11px] uppercase tracking-[0.28em] font-semibold text-[#AA8C4B] dark:text-[#C5A869]">
            {t('home.fourPillars.foundation')}
          </span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif-editorial font-bold text-stone-900 dark:text-white tracking-tight"
          >
            {t('home.fourPillars.title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-stone-600 dark:text-stone-400 font-light text-sm sm:text-base leading-relaxed"
          >
            {t('home.fourPillars.subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {getPillars(t).map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              className="bg-[#F8F3E9] dark:bg-[#131A2A] rounded-2xl p-8 border border-slate-200/80 dark:border-white/5 shadow-sm dark:shadow-none hover:shadow-md dark:hover:border-[#D4AF37]/30 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FDFBF7] dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-serif-editorial font-bold text-[#1A2332] dark:text-gray-100 mb-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-slate-600 dark:text-gray-300 text-xs sm:text-sm font-light leading-relaxed mb-6">
                  {pillar.description}
                </p>
              </div>

              <button 
                onClick={() => router.push(pillar.link)}
                className="w-full py-2.5 bg-[#FDFBF7] dark:bg-white/5 hover:bg-[#C5A059] dark:hover:bg-[#D4AF37] hover:text-slate-950 dark:hover:text-slate-950 text-[#1A2332] dark:text-gray-200 border border-slate-200 dark:border-white/10 font-semibold rounded-xl transition-all duration-300 uppercase tracking-[0.16em] text-[11px] cursor-pointer"
              >
                {pillar.action}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
