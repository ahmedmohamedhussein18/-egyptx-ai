'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function CTASection() {
  const { t } = useLanguage();
  return (
    <section className="relative w-full py-32 bg-[#FDFBF7] dark:bg-[#070B13] overflow-hidden flex items-center justify-center border-t border-slate-200/60 dark:border-white/5 transition-colors duration-200">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Pyramid Silhouettes Background */}
      <div className="absolute bottom-0 left-0 right-0 h-64 opacity-5 pointer-events-none flex justify-center items-end space-x-12">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-1/3 h-full fill-slate-900 dark:fill-white">
          <polygon points="50,0 100,100 0,100" />
        </svg>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-1/2 h-full fill-slate-900 dark:fill-white">
          <polygon points="50,0 100,100 0,100" />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center max-w-4xl mx-auto"
        >
          <motion.h2 
            className="text-4xl md:text-6xl font-serif-editorial font-bold mb-6 text-slate-900 dark:text-gray-100"
          >
            {t('cta.title')}
          </motion.h2>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-gray-300 mb-12 max-w-2xl font-light">
            {t('cta.subtitle')}
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="relative px-8 py-4 bg-[#D4AF37] hover:bg-yellow-500 text-slate-950 font-bold text-base rounded-full shadow-md hover:shadow-lg transition-all duration-300 mb-6 cursor-pointer"
          >
            {t('cta.btn')}
          </motion.button>
          
          <p className="text-sm text-white/40 tracking-wider flex items-center gap-2">
            <span className="text-[#D4AF37]">✦</span> {t('cta.poweredBy')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
