'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
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
  },
  {
    id: 2,
    title: t('home.ecosystem.features.kidsMode.title'),
    desc: t('home.ecosystem.features.kidsMode.desc'),
    icon: Smile,
    href: '/kids',
  },
  {
    id: 3,
    title: t('home.ecosystem.features.emergency.title'),
    desc: t('home.ecosystem.features.emergency.desc'),
    icon: Siren,
    href: '/emergency',
  },
  {
    id: 4,
    title: t('home.ecosystem.features.aiMemories.title'),
    desc: t('home.ecosystem.features.aiMemories.desc'),
    icon: Camera,
    href: '/memories',
  },
  {
    id: 5,
    title: t('home.ecosystem.features.treasureHunt.title'),
    desc: t('home.ecosystem.features.treasureHunt.desc'),
    icon: Map,
  },
  {
    id: 6,
    title: t('home.ecosystem.features.sustainability.title'),
    desc: t('home.ecosystem.features.sustainability.desc'),
    icon: Leaf,
  },
  {
    id: 7,
    title: t('home.ecosystem.features.researchHub.title'),
    desc: t('home.ecosystem.features.researchHub.desc'),
    icon: Search,
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
    <section className="relative w-full py-24 bg-[#030712] overflow-hidden border-t border-white/5">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-[#1B6B93]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-4"
          >
            {t('home.ecosystem.title1')}<span className="text-[#C9A84C]">{t('home.ecosystem.title2')}</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
          >
            {t('home.ecosystem.subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {getUpcomingFeatures(t).map((feature: any, idx: number) => {
            const CardContent = (
              <>
                {/* Coming Soon Badge - Only show if no href */}
                {!feature.href && (
                  <div className="absolute top-4 right-4 px-2 py-1 bg-[#1B6B93]/20 border border-[#1B6B93]/40 rounded text-[10px] uppercase font-bold text-[#4CC9F0] flex items-center gap-1">
                    <Lock className="w-3 h-3" /> {t('home.ecosystem.comingSoon')}
                  </div>
                )}

                <div className="w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-gray-400 group-hover:text-[#C9A84C] transition-colors" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-300 mb-2 group-hover:text-white transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
                  {feature.desc}
                </p>
                
                {/* Shimmer line */}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </>
            );

            const cardClasses = "relative bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 flex flex-col items-start overflow-hidden group transition-all duration-500 " + (feature.href ? "hover:border-[#C9A84C]/50 hover:bg-white/10" : "grayscale-[50%] opacity-80 hover:grayscale-0 hover:opacity-100");

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
