'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Users, Maximize, Target, 
  Sparkles, Shield, TrendingDown, Map 
} from 'lucide-react';

/* ─────────────────── DATA ─────────────────── */

const DESTINATIONS = [
  {
    id: 'siwa',
    name: 'Siwa Oasis',
    tagline: 'Salt lakes and desert springs',
    visitors: 14200,
    capacity: 45000,
    opportunity: 'HIGH',
    aiRec: 'Directing eco-tourists here relieves pressure on Luxor\'s fragile environment.',
    svg: (
      <svg viewBox="0 0 400 200" className="w-full h-full object-cover">
        <rect width="400" height="200" fill="#030712" />
        <circle cx="200" cy="80" r="30" fill="#E2E8F0" opacity="0.9" />
        <path d="M0 150 Q 100 120 200 140 T 400 130 L 400 200 L 0 200 Z" fill="#D4A373" />
        <ellipse cx="200" cy="170" rx="80" ry="20" fill="#4FD1C5" opacity="0.8" />
        <path d="M100 140 L100 90 M100 90 L80 70 M100 90 L120 70 M100 100 L120 110 M100 100 L80 110" stroke="#2F855A" strokeWidth="4" fill="none" />
      </svg>
    ),
  },
  {
    id: 'fayoum',
    name: 'Fayoum Oasis',
    tagline: 'Waterfalls, lakes, and dunes',
    visitors: 28500,
    capacity: 60000,
    opportunity: 'HIGH',
    aiRec: 'A perfect weekend alternative to reduce peak-season congestion in Cairo & Giza.',
    svg: (
      <svg viewBox="0 0 400 200" className="w-full h-full object-cover">
        <rect width="400" height="200" fill="#87CEEB" />
        <path d="M0 130 Q 200 100 400 140 L 400 200 L 0 200 Z" fill="#E9C46A" />
        <path d="M100 150 Q 250 130 400 170 L 400 200 L 100 200 Z" fill="#2A9D8F" opacity="0.9" />
        <circle cx="80" cy="50" r="25" fill="#F4A261" />
      </svg>
    ),
  },
  {
    id: 'dakhla',
    name: 'Dakhla Oasis',
    tagline: 'Ancient mud-brick towns',
    visitors: 8100,
    capacity: 30000,
    opportunity: 'HIGH',
    aiRec: 'Promoting ancient towns distributes heritage tourism far beyond the Nile Valley.',
    svg: (
      <svg viewBox="0 0 400 200" className="w-full h-full object-cover">
        <rect width="400" height="200" fill="#F4A261" />
        <rect x="120" y="100" width="50" height="60" fill="#B38B59" />
        <rect x="190" y="80" width="70" height="80" fill="#C9A84C" />
        <rect x="280" y="110" width="40" height="50" fill="#B38B59" />
        <path d="M0 160 L 400 160 L 400 200 L 0 200 Z" fill="#D4A373" />
        <circle cx="320" cy="60" r="20" fill="#E9C46A" />
      </svg>
    ),
  },
  {
    id: 'new-valley',
    name: 'New Valley (Kharga)',
    tagline: 'Vast archaeological sites',
    visitors: 5400,
    capacity: 25000,
    opportunity: 'HIGH',
    aiRec: 'These uncrowded temple ruins offer a serene alternative to Aswan.',
    svg: (
      <svg viewBox="0 0 400 200" className="w-full h-full object-cover">
        <rect width="400" height="200" fill="#E9C46A" />
        <rect x="150" y="120" width="20" height="40" fill="#C9A84C" />
        <rect x="190" y="120" width="20" height="40" fill="#C9A84C" />
        <rect x="230" y="120" width="20" height="40" fill="#C9A84C" />
        <path d="M140 110 L 260 110 L 250 120 L 150 120 Z" fill="#B38B59" />
        <path d="M0 160 Q 200 140 400 160 L 400 200 L 0 200 Z" fill="#D4A373" />
      </svg>
    ),
  },
  {
    id: 'wadi-el-gemal',
    name: 'Wadi El Gemal',
    tagline: 'Pristine coastal desert',
    visitors: 12000,
    capacity: 40000,
    opportunity: 'MEDIUM',
    aiRec: 'Shifting Red Sea divers south protects the overstressed coral reefs of Hurghada.',
    svg: (
      <svg viewBox="0 0 400 200" className="w-full h-full object-cover">
        <rect width="400" height="200" fill="#023E8A" />
        <path d="M0 80 Q 100 60 200 80 T 400 80 L 400 200 L 0 200 Z" fill="#0077B6" />
        <path d="M0 120 Q 150 100 300 150 L 400 160 L 400 200 L 0 200 Z" fill="#E9C46A" />
        <polygon points="50,150 120,60 190,150" fill="#D4A373" />
        <circle cx="340" cy="50" r="25" fill="#FFD166" />
      </svg>
    ),
  },
  {
    id: 'nubian',
    name: 'Nubian Heritage Villages',
    tagline: 'Colorful culture on the Nile',
    visitors: 22300,
    capacity: 50000,
    opportunity: 'MEDIUM',
    aiRec: 'Sustainable cultural tourism here supports locals while easing Aswan temple crowds.',
    svg: (
      <svg viewBox="0 0 400 200" className="w-full h-full object-cover">
        <defs>
          <linearGradient id="nile-water" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0077B6" />
            <stop offset="100%" stopColor="#03045E" />
          </linearGradient>
        </defs>
        <rect width="400" height="200" fill="#FFB703" />
        <path d="M0 140 Q 200 120 400 150 L 400 200 L 0 200 Z" fill="url(#nile-water)" />
        <path d="M50 140 Q 75 100 100 140 Z" fill="#219EBC" />
        <path d="M120 140 Q 145 90 170 140 Z" fill="#FB8500" />
        <path d="M190 140 Q 215 110 240 140 Z" fill="#8ECAE6" />
        <circle cx="100" cy="60" r="20" fill="#FFFFFF" opacity="0.8" />
      </svg>
    ),
  }
];

export default function HiddenEgyptContent() {
  return (
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-[#C9A84C] mb-4 uppercase tracking-wide flex items-center justify-center gap-3"
          >
            <Map className="w-10 h-10 hidden sm:block" />
            Beyond the Famous Egypt
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            Discover Egypt&apos;s hidden gems and help preserve its most treasured sites.
          </motion.p>
        </div>

        {/* National Impact Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-[#1B6B93]/30 via-[#0A1628] to-[#C9A84C]/20 border border-[#C9A84C]/40 rounded-2xl p-6 md:p-8 mb-12 shadow-[0_0_30px_rgba(201,168,76,0.15)] relative overflow-hidden"
        >
          {/* Animated background pulse */}
          <div className="absolute inset-0 bg-white/5 animate-pulse mix-blend-overlay pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="w-16 h-16 shrink-0 bg-[#C9A84C]/20 rounded-full flex items-center justify-center border border-[#C9A84C]/50">
              <Target className="w-8 h-8 text-[#C9A84C]" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">National Impact Mission</h2>
              <p className="text-lg text-gray-300">
                Redirecting just <strong className="text-[#C9A84C]">15%</strong> of tourists to these destinations could reduce Giza congestion by up to <strong className="text-[#4CC9F0]">20%</strong> while boosting local economies in underserved regions.
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-4 text-[#C9A84C] font-bold">
              <TrendingDown className="w-8 h-8" />
              <span>Reduced<br/>Crowding</span>
            </div>
          </div>
        </motion.div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DESTINATIONS.map((dest, idx) => {
            const percentage = (dest.visitors / dest.capacity) * 100;
            const barColor = percentage < 50 ? 'bg-green-500' : 'bg-yellow-500';
            
            return (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="bg-white/5 backdrop-blur border border-[#C9A84C]/20 rounded-3xl overflow-hidden hover:border-[#C9A84C]/60 transition-all group flex flex-col shadow-lg"
              >
                {/* SVG Image Header */}
                <div className="h-48 w-full relative overflow-hidden bg-gray-900">
                  {dest.svg}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border shadow-lg flex items-center gap-1 ${
                      dest.opportunity === 'HIGH' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/40' 
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
                    }`}>
                      <Shield className="w-3 h-3" />
                      Opp: {dest.opportunity}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-white mb-1">{dest.name}</h3>
                  <p className="text-gray-400 text-sm mb-6">{dest.tagline}</p>

                  {/* Stats & Capacity Bar */}
                  <div className="bg-[#0A1628] rounded-xl p-4 mb-6 border border-white/5">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider flex items-center gap-1">
                          <Users className="w-3 h-3" /> Visitors
                        </p>
                        <p className="text-lg font-mono text-white">{(dest.visitors / 1000).toFixed(1)}K</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider flex items-center gap-1 justify-end">
                          <Maximize className="w-3 h-3" /> Capacity
                        </p>
                        <p className="text-lg font-mono text-white">{(dest.capacity / 1000).toFixed(1)}K</p>
                      </div>
                    </div>
                    
                    {/* Visual Progress Bar */}
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mt-1">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={`h-full ${barColor}`}
                      />
                    </div>
                  </div>

                  {/* AI Recommendation Callout */}
                  <div className="bg-[#1B6B93]/10 border border-[#1B6B93]/30 rounded-xl p-4 mb-6 flex-grow">
                    <h4 className="text-[#4CC9F0] text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Sparkles className="w-4 h-4" /> AI Recommendation
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {dest.aiRec}
                    </p>
                  </div>

                  <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium flex justify-center items-center gap-2 transition-colors mt-auto group-hover:bg-[#C9A84C] group-hover:text-[#030712] group-hover:border-[#C9A84C]">
                    Explore Destination
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
