'use client';

import React from 'react';
import { motion } from 'framer-motion';

const destinations = [
  {
    id: 'giza',
    name: 'Giza',
    tagline: 'The Eternal Wonders',
    highlights: 'Great Pyramids • Sphinx • Sound & Light',
    svg: (
      <svg className="w-full h-full object-cover" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="giza-sky" x1="200" y1="0" x2="200" y2="240" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1a110a" />
            <stop offset="1" stopColor="#4a3015" />
          </linearGradient>
          <linearGradient id="pyr-left" x1="150" y1="100" x2="200" y2="200" gradientUnits="userSpaceOnUse">
            <stop stopColor="#c9a84c" />
            <stop offset="1" stopColor="#8b722d" />
          </linearGradient>
          <linearGradient id="pyr-right" x1="200" y1="100" x2="250" y2="200" gradientUnits="userSpaceOnUse">
            <stop stopColor="#a6883b" />
            <stop offset="1" stopColor="#5d4c20" />
          </linearGradient>
        </defs>
        <rect width="400" height="240" fill="url(#giza-sky)" />
        <circle cx="100" cy="80" r="30" fill="#f5d787" opacity="0.8" />
        <path d="M50 200 L150 70 L250 200 Z" fill="url(#pyr-left)" />
        <path d="M150 70 L250 200 L320 200 Z" fill="url(#pyr-right)" opacity="0.8" />
        <path d="M220 200 L280 120 L350 200 Z" fill="url(#pyr-left)" opacity="0.9" />
        <path d="M280 120 L350 200 L380 200 Z" fill="url(#pyr-right)" opacity="0.7" />
        <rect y="200" width="400" height="40" fill="#2a1e12" />
      </svg>
    ),
  },
  {
    id: 'luxor',
    name: 'Luxor',
    tagline: 'The World\'s Greatest Open-Air Museum',
    highlights: 'Valley of Kings • Karnak • Luxor Temple',
    svg: (
      <svg className="w-full h-full object-cover" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="luxor-sky" x1="200" y1="0" x2="200" y2="240" gradientUnits="userSpaceOnUse">
            <stop stopColor="#151a1d" />
            <stop offset="1" stopColor="#3d2a1d" />
          </linearGradient>
          <linearGradient id="pillar" x1="0" y1="0" x2="20" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#b37e4c" />
            <stop offset="1" stopColor="#6e4d2e" />
          </linearGradient>
        </defs>
        <rect width="400" height="240" fill="url(#luxor-sky)" />
        
        <rect x="80" y="80" width="40" height="140" fill="url(#pillar)" />
        <rect x="70" y="60" width="60" height="20" fill="#8c6036" />
        
        <rect x="180" y="80" width="40" height="140" fill="url(#pillar)" />
        <rect x="170" y="60" width="60" height="20" fill="#8c6036" />
        
        <rect x="280" y="80" width="40" height="140" fill="url(#pillar)" />
        <rect x="270" y="60" width="60" height="20" fill="#8c6036" />
        
        <rect x="50" y="40" width="300" height="20" fill="#a47547" />
        <rect y="220" width="400" height="20" fill="#2a1e12" />
      </svg>
    ),
  },
  {
    id: 'aswan',
    name: 'Aswan',
    tagline: 'Where the Nile Begins',
    highlights: 'Philae Temple • Nubian Villages • Felucca Rides',
    svg: (
      <svg className="w-full h-full object-cover" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="aswan-sky" x1="200" y1="0" x2="200" y2="160" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0d1b2a" />
            <stop offset="1" stopColor="#1b4965" />
          </linearGradient>
          <linearGradient id="nile" x1="200" y1="160" x2="200" y2="240" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1b6b93" />
            <stop offset="1" stopColor="#0b2a3a" />
          </linearGradient>
        </defs>
        <rect width="400" height="160" fill="url(#aswan-sky)" />
        <rect y="160" width="400" height="80" fill="url(#nile)" />
        <circle cx="200" cy="140" r="40" fill="#ffb703" opacity="0.9" />
        
        <path d="M80 150 C120 150 150 160 200 160 C250 160 280 150 320 150 L320 160 L80 160 Z" fill="#000" opacity="0.4" />
        
        <path d="M250 180 Q290 190 330 180" stroke="#62b6cb" strokeWidth="2" fill="none" opacity="0.6"/>
        <path d="M100 200 Q150 210 200 200" stroke="#62b6cb" strokeWidth="2" fill="none" opacity="0.6"/>
        
        <path d="M280 170 L280 80 L340 165 Z" fill="#e0e1dd" opacity="0.9" />
        <path d="M280 170 L280 110 L240 165 Z" fill="#b0c4de" opacity="0.9" />
        <path d="M230 165 C260 175 300 175 350 165 Z" fill="#2b2d42" />
      </svg>
    ),
  },
  {
    id: 'siwa',
    name: 'Siwa',
    tagline: 'The Desert Oasis',
    highlights: 'Oracle Temple • Salt Lakes • Stargazing',
    svg: (
      <svg className="w-full h-full object-cover" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="siwa-sky" x1="200" y1="0" x2="200" y2="240" gradientUnits="userSpaceOnUse">
            <stop stopColor="#10002b" />
            <stop offset="1" stopColor="#3c096c" />
          </linearGradient>
        </defs>
        <rect width="400" height="240" fill="url(#siwa-sky)" />
        
        <circle cx="50" cy="40" r="1" fill="#fff" opacity="0.8" />
        <circle cx="120" cy="80" r="1.5" fill="#fff" opacity="0.9" />
        <circle cx="200" cy="30" r="2" fill="#fff" opacity="1" />
        <circle cx="280" cy="60" r="1" fill="#fff" opacity="0.7" />
        <circle cx="350" cy="90" r="1.5" fill="#fff" opacity="0.8" />
        <circle cx="80" cy="120" r="1" fill="#fff" opacity="0.6" />
        <circle cx="320" cy="140" r="2" fill="#fff" opacity="0.9" />
        
        <circle cx="200" cy="240" r="150" fill="#240046" opacity="0.5" />
        <circle cx="200" cy="240" r="100" fill="#5a189a" opacity="0.3" />
        
        <path d="M100 240 C100 160 150 160 150 240" stroke="#7b2cbf" strokeWidth="4" fill="none" />
        <path d="M150 160 Q170 140 180 180" stroke="#7b2cbf" strokeWidth="3" fill="none" />
        <path d="M150 160 Q130 140 120 180" stroke="#7b2cbf" strokeWidth="3" fill="none" />
        
        <path d="M300 240 C300 180 260 180 260 240" stroke="#7b2cbf" strokeWidth="4" fill="none" />
        <path d="M260 180 Q240 160 230 190" stroke="#7b2cbf" strokeWidth="3" fill="none" />
        <path d="M260 180 Q280 160 290 190" stroke="#7b2cbf" strokeWidth="3" fill="none" />
        
        <rect y="220" width="400" height="20" fill="#10002b" />
      </svg>
    ),
  },
  {
    id: 'fayoum',
    name: 'Fayoum',
    tagline: 'Nature\'s Hidden Gem',
    highlights: 'Wadi El Rayan • Whale Valley • Lake Qarun',
    svg: (
      <svg className="w-full h-full object-cover" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="fayoum-sky" x1="200" y1="0" x2="200" y2="240" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2c3027" />
            <stop offset="1" stopColor="#606c38" />
          </linearGradient>
          <linearGradient id="dune1" x1="0" y1="100" x2="200" y2="240" gradientUnits="userSpaceOnUse">
            <stop stopColor="#dda15e" />
            <stop offset="1" stopColor="#bc6c25" />
          </linearGradient>
          <linearGradient id="dune2" x1="200" y1="120" x2="400" y2="240" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fefae0" />
            <stop offset="1" stopColor="#dda15e" />
          </linearGradient>
        </defs>
        <rect width="400" height="240" fill="url(#fayoum-sky)" />
        <circle cx="300" cy="70" r="35" fill="#fefae0" opacity="0.9" />
        <path d="M-50 240 Q100 100 250 240 Z" fill="url(#dune1)" />
        <path d="M150 240 Q300 120 450 240 Z" fill="url(#dune2)" opacity="0.9" />
        
        <path d="M180 180 Q250 200 320 180 L350 240 L150 240 Z" fill="#283618" opacity="0.8" />
      </svg>
    ),
  },
  {
    id: 'hurghada',
    name: 'Hurghada',
    tagline: 'Red Sea Paradise',
    highlights: 'Coral Reefs • Marine Life • Desert Safari',
    svg: (
      <svg className="w-full h-full object-cover" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sea" x1="200" y1="0" x2="200" y2="240" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0077b6" />
            <stop offset="1" stopColor="#03045e" />
          </linearGradient>
        </defs>
        <rect width="400" height="240" fill="url(#sea)" />
        
        <path d="M-20 40 Q80 20 200 60 T420 40 L420 -20 L-20 -20 Z" fill="#90e0ef" opacity="0.3" />
        <circle cx="200" cy="20" r="40" fill="#caf0f8" opacity="0.6" filter="blur(10px)" />
        
        <path d="M50 240 Q80 150 120 240 Z" fill="#ffb703" opacity="0.8" />
        <path d="M90 240 Q130 120 170 240 Z" fill="#fb8500" opacity="0.7" />
        <path d="M250 240 Q290 140 330 240 Z" fill="#ffb703" opacity="0.8" />
        <path d="M290 240 Q340 100 380 240 Z" fill="#fb8500" opacity="0.7" />
        
        <circle cx="200" cy="180" r="5" fill="#fff" opacity="0.8" />
        <circle cx="220" cy="160" r="3" fill="#fff" opacity="0.6" />
        <circle cx="180" cy="140" r="4" fill="#fff" opacity="0.7" />
        <circle cx="240" cy="130" r="2" fill="#fff" opacity="0.5" />
      </svg>
    ),
  },
];

export default function DestinationsSection() {
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
          >
            Featured Destinations
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto"
          >
            From ancient wonders to hidden oases
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {destinations.map((dest) => (
            <motion.div 
              key={dest.id}
              variants={itemVariants}
              className="group relative flex flex-col h-[400px] rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md border border-[#C9A84C]/10 hover:border-[#C9A84C]/30 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
            >
              {/* Visual Top Half */}
              <div className="h-[60%] w-full overflow-hidden relative">
                <div className="absolute inset-0 transition-all duration-500 opacity-90 group-hover:opacity-100 group-hover:scale-105 transform origin-center group-hover:brightness-110">
                  {dest.svg}
                </div>
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
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
                  <span className="transform transition-transform duration-300 group-hover:translate-x-1">Explore &rarr;</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
