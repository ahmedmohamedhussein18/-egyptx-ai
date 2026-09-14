'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Users, Calendar, Clock, ArrowRight } from 'lucide-react';

type Category = 'All' | 'Ancient Sites' | 'Hidden Egypt' | 'Nature';

interface Destination {
  id: string;
  category: Exclude<Category, 'All'>;
  name: string;
  rating: number;
  tagline: string;
  bestTime: string;
  crowdLevel: 'Low' | 'Medium' | 'High';
  recommendedStay: string;
  mapX: number;
  mapY: number;
  svg: React.ReactNode;
}

const destinations: Destination[] = [
  {
    id: 'giza',
    category: 'Ancient Sites',
    name: 'Giza',
    rating: 4.9,
    tagline: 'Home to the Great Pyramids and Sphinx',
    bestTime: 'Oct-Apr',
    crowdLevel: 'High',
    recommendedStay: '1-2 days',
    mapX: 185,
    mapY: 140,
    svg: (
      <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
        <defs>
          <linearGradient id="giza-sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1B6B93" />
            <stop offset="100%" stopColor="#D4A373" />
          </linearGradient>
          <linearGradient id="giza-sand" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E9C46A" />
            <stop offset="100%" stopColor="#C9A84C" />
          </linearGradient>
        </defs>
        <rect width="400" height="240" fill="url(#giza-sky)" />
        <polygon points="120,180 220,60 320,180" fill="#E9C46A" />
        <polygon points="220,60 320,180 270,180" fill="#C9A84C" />
        <polygon points="50,180 130,90 210,180" fill="#D4A373" />
        <polygon points="130,90 210,180 160,180" fill="#B38B59" />
        <path d="M0 170 Q 100 160 200 180 T 400 170 L 400 240 L 0 240 Z" fill="url(#giza-sand)" />
        <circle cx="340" cy="50" r="30" fill="#F4A261" opacity="0.8" />
      </svg>
    ),
  },
  {
    id: 'luxor',
    category: 'Ancient Sites',
    name: 'Luxor',
    rating: 4.9,
    tagline: 'The world\'s greatest open-air museum',
    bestTime: 'Oct-Apr',
    crowdLevel: 'High',
    recommendedStay: '2-3 days',
    mapX: 205,
    mapY: 265,
    svg: (
      <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
        <defs>
          <linearGradient id="luxor-sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2D3142" />
            <stop offset="100%" stopColor="#4F5D75" />
          </linearGradient>
        </defs>
        <rect width="400" height="240" fill="url(#luxor-sky)" />
        <rect x="80" y="80" width="30" height="120" fill="#C9A84C" />
        <rect x="150" y="80" width="30" height="120" fill="#C9A84C" />
        <rect x="220" y="80" width="30" height="120" fill="#C9A84C" />
        <rect x="290" y="80" width="30" height="120" fill="#C9A84C" />
        <rect x="60" y="60" width="280" height="20" fill="#E9C46A" />
        <path d="M0 190 Q 200 180 400 190 L 400 240 L 0 240 Z" fill="#8D99AE" />
      </svg>
    ),
  },
  {
    id: 'aswan',
    category: 'Ancient Sites',
    name: 'Aswan',
    rating: 4.8,
    tagline: 'Serene Nile views and Nubian culture',
    bestTime: 'Oct-Apr',
    crowdLevel: 'Medium',
    recommendedStay: '2 days',
    mapX: 210,
    mapY: 315,
    svg: (
      <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
        <defs>
          <linearGradient id="aswan-sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF9F1C" />
            <stop offset="100%" stopColor="#FFBF69" />
          </linearGradient>
          <linearGradient id="nile" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1B6B93" />
            <stop offset="100%" stopColor="#0B4061" />
          </linearGradient>
        </defs>
        <rect width="400" height="240" fill="url(#aswan-sky)" />
        <path d="M0 140 Q 200 120 400 150 L 400 240 L 0 240 Z" fill="url(#nile)" />
        <polygon points="200,160 220,80 240,160" fill="#FFFFFF" opacity="0.9" />
        <rect x="205" y="160" width="30" height="10" fill="#5C4033" />
        <circle cx="100" cy="80" r="25" fill="#FFFFFF" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'abu-simbel',
    category: 'Ancient Sites',
    name: 'Abu Simbel',
    rating: 5.0,
    tagline: 'Colossal temples carved into rock',
    bestTime: 'Oct-Apr',
    crowdLevel: 'Medium',
    recommendedStay: '1 day',
    mapX: 195,
    mapY: 360,
    svg: (
      <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
        <rect width="400" height="240" fill="#4A4E69" />
        <path d="M50 200 Q 150 50 350 200 Z" fill="#9A8C98" />
        <rect x="150" y="120" width="30" height="60" fill="#C9A84C" />
        <rect x="190" y="120" width="30" height="60" fill="#C9A84C" />
        <rect x="230" y="120" width="30" height="60" fill="#C9A84C" />
        <path d="M0 180 Q 200 170 400 190 L 400 240 L 0 240 Z" fill="#22223B" />
      </svg>
    ),
  },
  {
    id: 'siwa-oasis',
    category: 'Hidden Egypt',
    name: 'Siwa Oasis',
    rating: 4.9,
    tagline: 'Salt lakes and desert springs',
    bestTime: 'Oct-Apr',
    crowdLevel: 'Low',
    recommendedStay: '3-4 days',
    mapX: 100,
    mapY: 125,
    svg: (
      <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
        <rect width="400" height="240" fill="#030712" />
        <circle cx="200" cy="100" r="40" fill="#E2E8F0" opacity="0.8" />
        <path d="M0 180 Q 100 150 200 170 T 400 160 L 400 240 L 0 240 Z" fill="#D4A373" />
        <ellipse cx="200" cy="200" rx="60" ry="15" fill="#4FD1C5" opacity="0.7" />
        <path d="M80 170 L80 120 M80 120 L60 100 M80 120 L100 100 M80 130 L100 140 M80 130 L60 140" stroke="#2F855A" strokeWidth="4" fill="none" />
        <path d="M320 160 L320 110 M320 110 L300 90 M320 110 L340 90 M320 120 L340 130 M320 120 L300 130" stroke="#2F855A" strokeWidth="4" fill="none" />
      </svg>
    ),
  },
  {
    id: 'fayoum',
    category: 'Hidden Egypt',
    name: 'Fayoum',
    rating: 4.7,
    tagline: 'Waterfalls, lakes, and desert dunes',
    bestTime: 'Oct-Apr',
    crowdLevel: 'Medium',
    recommendedStay: '2 days',
    mapX: 175,
    mapY: 160,
    svg: (
      <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
        <rect width="400" height="240" fill="#87CEEB" />
        <path d="M0 160 Q 200 130 400 170 L 400 240 L 0 240 Z" fill="#E9C46A" />
        <path d="M100 180 Q 250 160 400 200 L 400 240 L 100 240 Z" fill="#2A9D8F" opacity="0.8" />
        <circle cx="80" cy="60" r="20" fill="#F4A261" />
      </svg>
    ),
  },
  {
    id: 'dakhla-oasis',
    category: 'Hidden Egypt',
    name: 'Dakhla Oasis',
    rating: 4.8,
    tagline: 'Ancient mud-brick towns',
    bestTime: 'Oct-Apr',
    crowdLevel: 'Low',
    recommendedStay: '2-3 days',
    mapX: 120,
    mapY: 270,
    svg: (
      <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
        <rect width="400" height="240" fill="#F4A261" />
        <rect x="100" y="140" width="60" height="60" fill="#B38B59" />
        <rect x="180" y="120" width="80" height="80" fill="#C9A84C" />
        <rect x="280" y="150" width="50" height="50" fill="#B38B59" />
        <path d="M0 200 L 400 200 L 400 240 L 0 240 Z" fill="#D4A373" />
        <circle cx="300" cy="80" r="25" fill="#E9C46A" />
      </svg>
    ),
  },
  {
    id: 'new-valley',
    category: 'Hidden Egypt',
    name: 'New Valley',
    rating: 4.6,
    tagline: 'Where desert meets greenery',
    bestTime: 'Oct-Apr',
    crowdLevel: 'Low',
    recommendedStay: '2 days',
    mapX: 150,
    mapY: 300,
    svg: (
      <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
        <rect width="400" height="240" fill="#E9C46A" />
        <path d="M0 160 Q 200 120 400 160 L 400 240 L 0 240 Z" fill="#D4A373" />
        <path d="M150 180 Q 250 140 400 190 L 400 240 L 150 240 Z" fill="#2A9D8F" />
      </svg>
    ),
  },
  {
    id: 'red-sea',
    category: 'Nature',
    name: 'Red Sea',
    rating: 4.8,
    tagline: 'World-class diving and resorts',
    bestTime: 'Sep-Nov, Mar-May',
    crowdLevel: 'High',
    recommendedStay: '4-5 days',
    mapX: 230,
    mapY: 220,
    svg: (
      <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
        <rect width="400" height="240" fill="#0077B6" />
        <path d="M0 120 Q 100 100 200 120 T 400 120 L 400 240 L 0 240 Z" fill="#0096C7" />
        <path d="M50 200 Q 80 180 110 210 T 170 200" stroke="#FF5400" strokeWidth="8" fill="none" strokeLinecap="round" />
        <circle cx="300" cy="60" r="30" fill="#FFD166" />
      </svg>
    ),
  },
  {
    id: 'white-desert',
    category: 'Nature',
    name: 'White Desert',
    rating: 4.9,
    tagline: 'Surreal chalk rock formations',
    bestTime: 'Oct-Apr',
    crowdLevel: 'Low',
    recommendedStay: '1-2 days',
    mapX: 130,
    mapY: 220,
    svg: (
      <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
        <rect width="400" height="240" fill="#14213D" />
        <path d="M0 180 Q 200 150 400 180 L 400 240 L 0 240 Z" fill="#E5E5E5" />
        <path d="M120 180 Q 150 80 180 180 Z" fill="#FFFFFF" />
        <path d="M250 190 Q 280 100 310 190 Z" fill="#FFFFFF" />
        <circle cx="200" cy="80" r="15" fill="#FFFFFF" opacity="0.8" />
      </svg>
    ),
  },
  {
    id: 'ras-mohammed',
    category: 'Nature',
    name: 'Ras Mohammed National Park',
    rating: 4.9,
    tagline: 'Pristine coral reefs and marine life',
    bestTime: 'Sep-Nov, Mar-May',
    crowdLevel: 'Medium',
    recommendedStay: '1 day',
    mapX: 245,
    mapY: 175,
    svg: (
      <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
        <rect width="400" height="240" fill="#03045E" />
        <path d="M0 100 Q 100 80 200 100 T 400 100 L 400 240 L 0 240 Z" fill="#0077B6" />
        <circle cx="100" cy="180" r="20" fill="#F72585" opacity="0.8" />
        <circle cx="280" cy="160" r="30" fill="#4CC9F0" opacity="0.8" />
        <path d="M180 200 Q 200 180 220 200 T 260 190" stroke="#7209B7" strokeWidth="6" fill="none" />
      </svg>
    ),
  },
];

const categories: Category[] = ['All', 'Ancient Sites', 'Hidden Egypt', 'Nature'];

export default function ExploreContent() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const filteredDestinations = destinations.filter(
    (dest) => activeCategory === 'All' || dest.category === activeCategory
  );

  const handleDotClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-[#C9A84C] mb-4"
          >
            Explore Egypt
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400"
          >
            From ancient wonders to hidden oases
          </motion.p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full border transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-[#C9A84C] text-[#030712] border-[#C9A84C] font-semibold'
                  : 'bg-white/5 text-gray-300 border-[#C9A84C]/30 hover:border-[#C9A84C] hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column - Sticky Map */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-24 bg-white/5 backdrop-blur-md border border-[#C9A84C]/20 rounded-3xl p-6">
              <h3 className="text-xl font-semibold text-[#C9A84C] mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Interactive Map
              </h3>
              <div className="relative w-full aspect-[3/5]">
                <svg viewBox="0 0 300 500" className="w-full h-full" fill="none">
                  {/* Map Outline */}
                  <path 
                    d="M165 50 L250 50 L260 80 L270 100 L260 120 L255 140 L265 155 L255 170 L250 185 L260 200 L255 220 L250 240 L245 260 L240 280 L235 300 L230 320 L225 340 L218 370 L210 400 L195 430 L180 450 L165 440 L150 420 L140 400 L130 380 L125 350 L130 320 L140 290 L150 260 L155 230 L160 200 L170 170 L175 150 L180 130 L175 110 L170 90 L165 70 Z" 
                    fill="#C9A84C" 
                    fillOpacity="0.08" 
                    stroke="#C9A84C" 
                    strokeWidth="1.5" 
                    strokeOpacity="0.3"
                  />
                  {/* Nile River */}
                  <path 
                    d="M195 130 Q200 160 205 200 Q210 240 205 270 Q200 310 210 350 Q215 380 195 430" 
                    stroke="#1B6B93" 
                    strokeWidth="2.5" 
                    strokeOpacity="0.5" 
                    strokeLinecap="round" 
                    fill="none"
                  />
                  
                  {/* Destination Dots */}
                  {destinations.map((dest) => {
                    const isVisible = activeCategory === 'All' || dest.category === activeCategory;
                    if (!isVisible) return null;
                    return (
                      <g 
                        key={dest.id} 
                        onClick={() => handleDotClick(dest.id)}
                        className="cursor-pointer group"
                      >
                        <circle 
                          cx={dest.mapX} 
                          cy={dest.mapY} 
                          r="6" 
                          fill="#C9A84C"
                          className="transition-transform group-hover:scale-150"
                        />
                        <circle 
                          cx={dest.mapX} 
                          cy={dest.mapY} 
                          r="12" 
                          fill="#C9A84C"
                          opacity="0.3"
                          className="animate-ping group-hover:animate-none"
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* Right Column - Destination Cards */}
          <div className="w-full lg:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDestinations.map((dest, index) => (
                <motion.div
                  key={dest.id}
                  id={dest.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/5 backdrop-blur border border-[#C9A84C]/20 rounded-2xl overflow-hidden hover:border-[#C9A84C] transition-colors group flex flex-col"
                >
                  {/* Image/SVG Section */}
                  <div className="h-48 relative overflow-hidden bg-gray-900">
                    {dest.svg}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-black/60 backdrop-blur rounded-full text-xs font-medium text-[#C9A84C] border border-[#C9A84C]/30">
                        {dest.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur rounded-full text-sm font-medium text-white border border-white/10">
                      <Star className="w-4 h-4 text-[#C9A84C] fill-current" />
                      {dest.rating}
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold text-white mb-2">{dest.name}</h3>
                    <p className="text-gray-400 mb-6 flex-grow">{dest.tagline}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Calendar className="w-4 h-4 text-[#C9A84C]" />
                        <span>{dest.bestTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Clock className="w-4 h-4 text-[#C9A84C]" />
                        <span>{dest.recommendedStay}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300 col-span-2">
                        <Users className="w-4 h-4 text-[#C9A84C]" />
                        <span className="flex items-center gap-2">
                          Crowd Level: 
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            dest.crowdLevel === 'Low' ? 'bg-green-500/20 text-green-400' :
                            dest.crowdLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {dest.crowdLevel}
                          </span>
                        </span>
                      </div>
                    </div>

                    <button className="w-full py-3 bg-[#1B6B93]/20 hover:bg-[#1B6B93]/40 border border-[#1B6B93] rounded-xl text-white font-medium flex justify-center items-center gap-2 transition-colors">
                      Explore Destination
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {filteredDestinations.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                No destinations found for this category.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
