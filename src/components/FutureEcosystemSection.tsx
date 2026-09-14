'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, Map, Smile, Siren, 
  Camera, Leaf, Search, Lock 
} from 'lucide-react';

const UPCOMING_FEATURES = [
  {
    id: 1,
    title: 'VR Egypt',
    desc: 'Immersive 360° virtual tours of ancient wonders',
    icon: Globe,
  },
  {
    id: 2,
    title: 'Treasure Hunt',
    desc: 'Gamified exploration challenges with real rewards',
    icon: Map,
  },
  {
    id: 3,
    title: 'Kids Mode',
    desc: 'A magical, educational experience for young explorers',
    icon: Smile,
  },
  {
    id: 4,
    title: 'Emergency Assistant',
    desc: 'Instant access to help, translation, and emergency services',
    icon: Siren,
  },
  {
    id: 5,
    title: 'AI Memories',
    desc: 'Auto-generated story of your journey with photos and highlights',
    icon: Camera,
  },
  {
    id: 6,
    title: 'Sustainability Dashboard',
    desc: 'Tracking Egypt\'s environmental impact and progress',
    icon: Leaf,
  },
  {
    id: 7,
    title: 'Research Hub',
    desc: 'AI-powered access to Egypt\'s historical and archaeological data',
    icon: Search,
  },
];

export default function FutureEcosystemSection() {
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
            Expanding the <span className="text-[#C9A84C]">Ecosystem</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
          >
            EgyptX AI is continuously evolving. Here&apos;s what&apos;s coming next.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {UPCOMING_FEATURES.map((feature, idx) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="relative bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 flex flex-col items-start overflow-hidden group grayscale-[50%] opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              >
                {/* Coming Soon Badge */}
                <div className="absolute top-4 right-4 px-2 py-1 bg-[#1B6B93]/20 border border-[#1B6B93]/40 rounded text-[10px] uppercase font-bold text-[#4CC9F0] flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Coming Soon
                </div>

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
              </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
