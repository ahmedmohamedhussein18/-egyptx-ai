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
      icon: <Compass className="w-8 h-8 text-[#C9A84C]" />,
      title: t('home.fourPillars.aiPlanning.title'),
      description: t('home.fourPillars.aiPlanning.desc'),
      action: t('home.fourPillars.aiPlanning.action'),
      link: "/planner"
    },
    {
      icon: <Map className="w-8 h-8 text-[#C9A84C]" />,
      title: t('home.fourPillars.smartSites.title'),
      description: t('home.fourPillars.smartSites.desc'),
      action: t('home.fourPillars.smartSites.action'),
      link: "/smart-site"
    },
    {
      icon: <Headphones className="w-8 h-8 text-[#C9A84C]" />,
      title: t('home.fourPillars.vrEgypt.title'),
      description: t('home.fourPillars.vrEgypt.desc'),
      action: t('home.fourPillars.vrEgypt.action'),
      link: "/vr-egypt"
    },
    {
      icon: <Camera className="w-8 h-8 text-[#C9A84C]" />,
      title: t('home.fourPillars.aiMemories.title'),
      description: t('home.fourPillars.aiMemories.desc'),
      action: t('home.fourPillars.aiMemories.action'),
      link: "/memories"
    }
  ];

  return (
    <section className="py-24 bg-[#030712] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C9A84C]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white uppercase tracking-widest mb-4"
          >
            {t('home.fourPillars.title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#C9A84C] font-medium tracking-widest uppercase text-sm"
          >
            {t('home.fourPillars.subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {getPillars(t).map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#0A1628]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-[#C9A84C]/50 transition-colors group flex flex-col"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {pillar.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{pillar.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">
                {pillar.description}
              </p>
              <button 
                onClick={() => router.push(pillar.link)}
                className="w-full py-3 bg-white/5 hover:bg-[#C9A84C] hover:text-[#0A1628] text-white border border-white/10 font-bold rounded-xl transition-all uppercase tracking-wider text-xs"
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
