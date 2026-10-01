'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

const BrainIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8z" />
    <path d="M12 4v16" />
    <path d="M4 12h16" />
    <path d="M12 8a4 4 0 1 0 0 8" />
    <path d="M12 16a4 4 0 1 1 0-8" />
    <path d="M8 12a4 4 0 1 0 8 0" />
    <path d="M16 12a4 4 0 1 1-8 0" />
  </svg>
);

const TempleIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 22h20" />
    <path d="M4 22V10" />
    <path d="M8 22V10" />
    <path d="M12 22V10" />
    <path d="M16 22V10" />
    <path d="M20 22V10" />
    <path d="M2 10l10-8 10 8" />
  </svg>
);

const NetworkIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    <path d="M2 12h20" />
    <circle cx="12" cy="12" r="2" fill="#C9A84C" />
    <circle cx="16" cy="6" r="1.5" fill="#C9A84C" />
    <circle cx="8" cy="18" r="1.5" fill="#C9A84C" />
    <circle cx="16" cy="18" r="1.5" fill="#C9A84C" />
    <circle cx="8" cy="6" r="1.5" fill="#C9A84C" />
  </svg>
);

const getCards = (t: any) => [
  {
    title: t('home.smartTourism.aiPowered.title'),
    icon: <BrainIcon />,
    description: t('home.smartTourism.aiPowered.desc'),
    tag: t('home.smartTourism.aiPowered.tag'),
  },
  {
    title: t('home.smartTourism.smartHeritage.title'),
    icon: <TempleIcon />,
    description: t('home.smartTourism.smartHeritage.desc'),
    tag: t('home.smartTourism.smartHeritage.tag'),
  },
  {
    title: t('home.smartTourism.distribution.title'),
    icon: <NetworkIcon />,
    description: t('home.smartTourism.distribution.desc'),
    tag: t('home.smartTourism.distribution.tag'),
  },
];

export default function SmartTourismSection() {
  const { t } = useLanguage();
  return (
    <section className="relative w-full py-24 md:py-32 bg-[#050B14] overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1B6B93]/10 via-[#050B14] to-[#050B14] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.div 
            className="flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative Line */}
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mb-6 rounded-full" />
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E6D089] to-[#C9A84C]">
              {t('home.smartTourism.title')}
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light">
              {t('home.smartTourism.subtitle')}
            </p>
          </motion.div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {getCards(t).map((card: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              className="group relative"
            >
              <div className="h-full relative overflow-hidden bg-[#0A1628]/60 backdrop-blur-md rounded-2xl p-8 md:p-10 border border-[#C9A84C]/10 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#C9A84C]/30 group-hover:shadow-[0_0_30px_rgba(201,168,76,0.1)] flex flex-col">
                
                {/* Subtle Gradient Overlay */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#C9A84C]/5 to-transparent pointer-events-none" />

                <div className="relative z-10 flex-grow">
                  <div className="mb-6">
                    {card.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                    {card.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed text-sm md:text-base">
                    {card.description}
                  </p>
                </div>

                <div className="relative z-10 mt-8">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] text-xs font-semibold tracking-wider uppercase border border-[#C9A84C]/20">
                    {card.tag}
                  </span>
                </div>
                
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
