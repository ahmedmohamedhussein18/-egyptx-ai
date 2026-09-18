'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const destinations = [
  {
    id: 'giza',
    name: 'Giza',
    tagline: 'The Eternal Wonders',
    highlights: 'Great Pyramids • Sphinx • Sound & Light',
    image: '/images/giza.jpg',
  },
  {
    id: 'luxor',
    name: 'Luxor',
    tagline: 'The World\'s Greatest Open-Air Museum',
    highlights: 'Valley of Kings • Karnak • Luxor Temple',
    image: '/images/luxor.jpg',
  },
  {
    id: 'aswan',
    name: 'Aswan',
    tagline: 'Where the Nile Begins',
    highlights: 'Philae Temple • Nubian Villages • Felucca Rides',
    image: '/images/aswan.jpg',
  },
  {
    id: 'siwa',
    name: 'Siwa',
    tagline: 'The Desert Oasis',
    highlights: 'Oracle Temple • Salt Lakes • Stargazing',
    image: '/images/siwa.jpg',
  },
  {
    id: 'fayoum',
    name: 'Fayoum',
    tagline: 'Nature\'s Hidden Gem',
    highlights: 'Wadi El Rayan • Whale Valley • Lake Qarun',
    image: '/images/fayoum.jpg',
  },
  {
    id: 'hurghada',
    name: 'Hurghada',
    tagline: 'Red Sea Paradise',
    highlights: 'Coral Reefs • Marine Life • Desert Safari',
    image: '/images/hurghada.jpg',
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
