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
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#030712]">
      
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/hero-bg-compressed.mp4"
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#030712]/80 via-[#030712]/60 to-[#030712]/90" />

      {/* CONTENT */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto mt-[-5vh]"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.15 } }
        }}
      >
        {user && (
          <motion.div variants={staggerItem} className="mb-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-medium backdrop-blur-md">{t('home.welcomeBack')} <span className="text-[#C9A84C] font-bold">{user.name.split(' ')[0]}</span> 👋
            </span>
          </motion.div>
        )}

        {/* Badge */}
        <motion.div variants={staggerItem} className="mb-6 md:mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C9A84C]/30 bg-white/5 backdrop-blur-md">
          <span className="text-lg md:text-xl">🏛️</span>
          <span className="text-[#C9A84C] text-xs md:text-sm font-medium tracking-wide">{t('home.badge')}</span>
        </motion.div>

        {/* Title */}
        <motion.h1 variants={staggerItem} className="text-5xl md:text-7xl lg:text-8xl font-black mb-2 md:mb-4 tracking-tighter">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E2CB85] to-[#C9A84C]">EgyptX</span>
          <span className="text-[#1B6B93] ml-2 md:ml-4">AI</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.h2 variants={staggerItem} className="text-base md:text-2xl lg:text-3xl font-light text-white mb-4 md:mb-6 tracking-[0.15em] md:tracking-[0.2em] uppercase">
          The National Smart Tourism Ecosystem
        </motion.h2>

        {/* Tagline */}
        <motion.p variants={staggerItem} className="text-base md:text-xl text-white/60 mb-10 md:mb-12 max-w-2xl font-light">
          Discover Egypt. Experience History. Shape the Future.
        </motion.p>

        {/* Buttons */}
        <motion.div variants={staggerItem} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-12 md:mb-16">
          <button onClick={() => router.push('/planner')} className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-[#C9A84C] hover:bg-[#D5B965] text-black font-semibold rounded-lg shadow-[0_0_20px_rgba(201,168,76,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(201,168,76,0.5)]">{t('home.planBtn')}</button>
          <button onClick={() => router.push('/explore')} className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C]/10 font-semibold rounded-lg transition-all duration-300 hover:scale-105">{t('home.exploreBtn')}</button>
          <button onClick={() => router.push('/vr-egypt')} className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 border border-[#1B6B93] text-[#1B6B93] hover:bg-[#1B6B93]/10 font-semibold rounded-lg transition-all duration-300 hover:scale-105">{t('home.virtualEgypt')}</button>
        </motion.div>

        {/* Stats */}
        <motion.div variants={staggerItem} className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-white/40 font-mono">
          <span>{t('home.sitesCount')}</span>
          <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-[#1B6B93]"></span>
          <span>{t('home.aiPowered')}</span>
          <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-[#C9A84C]"></span>
          <span>{t('home.realTime')}</span>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 md:gap-2 text-white/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="text-[10px] md:text-xs uppercase tracking-widest font-semibold">{t('home.scroll')}</span>
        <motion.svg 
          width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="md:w-6 md:h-6"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M6 9l6 6 6-6"/>
        </motion.svg>
      </motion.div>

    </section>
  );
};

export default HeroSection;
