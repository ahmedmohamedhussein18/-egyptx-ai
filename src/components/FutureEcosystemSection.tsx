'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import KidsModeVerificationModal from '@/components/KidsModeVerificationModal';
import { 
  Globe, Map, Smile, Siren, 
  Camera, Leaf, Search, Lock 
} from 'lucide-react';

const getUpcomingFeatures = (t: any) => [
  {
    id: 1,
    title: t('home.ecosystem.features.vrEgypt.title'),
    desc: t('home.ecosystem.features.vrEgypt.desc'),
    icon: Globe,
    href: '/vr-egypt',
    bgImage: '/vr-bg.jpg',
  },
  {
    id: 2,
    title: t('home.ecosystem.features.kidsMode.title'),
    desc: t('home.ecosystem.features.kidsMode.desc'),
    icon: Smile,
    href: '/kids',
    bgImage: '/kids-bg.jpg',
  },
  {
    id: 3,
    title: t('home.ecosystem.features.emergency.title'),
    desc: t('home.ecosystem.features.emergency.desc'),
    icon: Siren,
    href: '/emergency',
    bgImage: '/emergency-bg.jpg',
  },
  {
    id: 4,
    title: t('home.ecosystem.features.aiMemories.title'),
    desc: t('home.ecosystem.features.aiMemories.desc'),
    icon: Camera,
    href: '/memories',
    bgImage: '/ai-bg.jpg',
  },
  {
    id: 5,
    title: t('home.ecosystem.features.treasureHunt.title'),
    desc: t('home.ecosystem.features.treasureHunt.desc'),
    icon: Map,
    bgImage: '/treasure-bg.jpg',
  },
  {
    id: 6,
    title: t('home.ecosystem.features.sustainability.title'),
    desc: t('home.ecosystem.features.sustainability.desc'),
    icon: Leaf,
    bgImage: '/sustain-bg.jpg',
  },
  {
    id: 7,
    title: t('home.ecosystem.features.researchHub.title'),
    desc: t('home.ecosystem.features.researchHub.desc'),
    icon: Search,
    bgImage: '/research-bg.jpg',
  },
];

export default function FutureEcosystemSection() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [isKidsModalOpen, setIsKidsModalOpen] = React.useState(false);

  const handleCardClick = (feature: any, e: React.MouseEvent) => {
    if (feature.href === '/kids') {
      e.preventDefault();
      const isVerified = typeof window !== 'undefined' && localStorage.getItem('isKidsModeVerified') === 'true';
      if (isVerified) {
        router.push('/kids');
      } else {
        setIsKidsModalOpen(true);
      }
    }
  };

  return (
    <section className="relative w-full py-24 bg-[#FDFBF7] dark:bg-[#0B0F19] overflow-hidden border-t border-slate-200/60 dark:border-white/5 transition-colors duration-200">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-sky-500/5 dark:bg-[#1B6B93]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-serif-editorial font-bold text-slate-900 dark:text-gray-100 mb-4"
          >
            {t('home.ecosystem.title1')}<span className="text-yellow-600 dark:text-[#D4AF37]">{t('home.ecosystem.title2')}</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-600 dark:text-gray-300 max-w-2xl mx-auto font-light"
          >
            {t('home.ecosystem.subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {getUpcomingFeatures(t).map((feature: any, idx: number) => {
            const CardContent = (
              <>
                {/* Background Image */}
                {feature.bgImage && (
                  <Image
                    src={feature.bgImage}
                    alt={feature.title}
                    fill
                    className="object-cover z-0 transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                )}

                {/* Dark Gradient Overlay */}
                <div className="z-10 absolute inset-0 bg-gradient-to-t from-[#0a0f16] via-[#0a0f16]/75 to-transparent pointer-events-none" />

                {/* Coming Soon Badge - Only show if no href */}
                {!feature.href && (
                  <div className="absolute top-4 right-4 z-20 px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-[10px] uppercase font-bold text-[#4CC9F0] flex items-center gap-1 shadow-md">
                    <Lock className="w-3 h-3" /> {t('home.ecosystem.comingSoon')}
                  </div>
                )}

                {/* Text and Icons */}
                <div className="relative z-20 flex flex-col items-start w-full mt-auto pt-10">
                  <div className="w-12 h-12 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4 group-hover:border-[#D4AF37]/60 group-hover:bg-black/60 transition-colors">
                    <feature.icon className="w-6 h-6 text-gray-200 group-hover:text-[#D4AF37] transition-colors" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors drop-shadow-md">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-200/90 font-light leading-relaxed drop-shadow-sm">
                    {feature.desc}
                  </p>
                </div>
                
                {/* Shimmer line */}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20" />
              </>
            );

            const cardClasses = "relative bg-[#0a0f16] border border-white/10 shadow-lg rounded-2xl p-6 flex flex-col justify-between min-h-[260px] overflow-hidden group transition-all duration-300 " + (feature.href ? "hover:border-[#D4AF37]/60 hover:shadow-[#D4AF37]/10" : "opacity-90 hover:opacity-100");

            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                {feature.href ? (
                  <Link 
                    href={feature.href} 
                    onClick={(e) => handleCardClick(feature, e)}
                    className={`block h-full ${cardClasses}`}
                  >
                    {CardContent}
                  </Link>
                ) : (
                  <div className={`h-full ${cardClasses}`}>
                    {CardContent}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
        
      </div>

      {/* Parental Email Verification Modal for Kids Mode */}
      <KidsModeVerificationModal
        isOpen={isKidsModalOpen}
        onClose={() => setIsKidsModalOpen(false)}
        userEmail={user?.email}
        onSuccess={() => {
          setIsKidsModalOpen(false);
          router.push('/kids');
        }}
      />
    </section>
  );
}
