"use client";

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

const HeroSection = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();

  const staggerItem = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-950 dark:bg-[#030712]">
      
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Subtle Contrast Overlay */}
      <div className="absolute inset-0 bg-black/40 z-1 pointer-events-none" />

      {/* CONTENT */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto mt-[-4vh]"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.15 } }
        }}
      >
        {user && (
          <motion.div variants={staggerItem} className="mb-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs uppercase tracking-wider font-medium backdrop-blur-md">
              {t('home.welcomeBack')} <span className="text-[#C5A869] font-bold">{user.name.split(' ')[0]}</span>
            </span>
          </motion.div>
        )}

        {/* Minimalist Editorial Badge */}
        <motion.div variants={staggerItem} className="mb-6 md:mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C5A869]/30 bg-white/5 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A869] animate-pulse" />
          <span className="text-[#C5A869] text-xs font-semibold tracking-[0.2em] uppercase">{t('home.badge')}</span>
        </motion.div>

        {/* Title */}
        <motion.h1 variants={staggerItem} className="text-5xl md:text-7xl lg:text-8xl font-serif-editorial font-bold mb-3 md:mb-4 tracking-tight leading-none text-white">
          <span>Egypt</span>
          <span className="text-[#C5A869] ml-1">X</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.h2 variants={staggerItem} className="text-xs md:text-sm lg:text-base font-light text-stone-300 mb-6 md:mb-8 tracking-[0.3em] uppercase">
          {t('home.subtitle')}
        </motion.h2>

        {/* Punchy Editorial Tagline (Reduced Text) */}
        <motion.p variants={staggerItem} className="text-sm md:text-lg text-white/70 mb-10 md:mb-12 max-w-xl font-light leading-relaxed">
          {t('home.heroTagline')}
        </motion.p>

        {/* Buttons */}
        <motion.div variants={staggerItem} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-12 md:mb-16">
          <button 
            onClick={() => router.push('/planner')} 
            className="w-full sm:w-auto px-7 py-3.5 bg-[#C5A869] hover:bg-[#B89758] text-stone-950 text-xs uppercase tracking-[0.18em] font-bold rounded-full shadow-[0_4px_20px_rgba(197,168,105,0.3)] transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            {t('home.planBtn')}
          </button>
          <button 
            onClick={() => router.push('/explore')} 
            className="w-full sm:w-auto px-7 py-3.5 bg-white/5 hover:bg-white/10 border border-white/20 text-white text-xs uppercase tracking-[0.18em] font-semibold rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            {t('home.exploreBtn')}
          </button>
          <button 
            onClick={() => router.push('/vr-egypt')} 
            className="w-full sm:w-auto px-7 py-3.5 bg-[#1B6B93]/20 hover:bg-[#1B6B93]/30 border border-[#1B6B93]/40 text-[#4EB1E2] text-xs uppercase tracking-[0.18em] font-semibold rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            {t('home.virtualEgypt')}
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div variants={staggerItem} className="flex items-center gap-4 md:gap-6 text-xs text-white/40 uppercase tracking-[0.18em] font-mono">
          <span>{t('home.sitesCount')}</span>
          <span className="w-1 h-1 rounded-full bg-[#1B6B93]"></span>
          <span>{t('home.aiPowered')}</span>
          <span className="w-1 h-1 rounded-full bg-[#C5A869]"></span>
          <span>{t('home.realTime')}</span>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-white/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="text-[10px] uppercase tracking-[0.25em] font-semibold">{t('home.scroll')}</span>
        <motion.svg 
          width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M6 9l6 6 6-6"/>
        </motion.svg>
      </motion.div>

    </section>
  );
};

export default HeroSection;
