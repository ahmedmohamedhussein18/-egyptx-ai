'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Users, Calendar, Clock, ArrowRight, Cloud, Loader2, AlertCircle, Thermometer } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { trackEvent } from '@/lib/analytics';
import dynamic from 'next/dynamic';

const MapLeaflet = dynamic(() => import('@/components/MapLeaflet'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] lg:h-[500px] flex items-center justify-center bg-white/5 rounded-3xl border border-[#C9A84C]/20">
      <Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" />
    </div>
  )
});

type Category = 'All' | 'Ancient' | 'Museum' | 'Nature' | 'Beach' | 'Hidden';



// Helper to get SVG based on category or specific name
function getAttractionSvg(name_en: string, category: string) {
  const name = name_en.toLowerCase();
  
  if (name.includes('giza') || name.includes('saqqara')) {
    return (
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
    );
  }
  
  if (name.includes('luxor') || name.includes('karnak') || name.includes('valley')) {
    return (
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
    );
  }

  if (name.includes('aswan') || name.includes('philae')) {
    return (
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
    );
  }

  if (name.includes('abu simbel')) {
    return (
      <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
        <rect width="400" height="240" fill="#4A4E69" />
        <path d="M50 200 Q 150 50 350 200 Z" fill="#9A8C98" />
        <rect x="150" y="120" width="30" height="60" fill="#C9A84C" />
        <rect x="190" y="120" width="30" height="60" fill="#C9A84C" />
        <rect x="230" y="120" width="30" height="60" fill="#C9A84C" />
        <path d="M0 180 Q 200 170 400 190 L 400 240 L 0 240 Z" fill="#22223B" />
      </svg>
    );
  }

  if (category === 'hidden' || name.includes('oasis')) {
    return (
      <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
        <rect width="400" height="240" fill="#030712" />
        <circle cx="200" cy="100" r="40" fill="#E2E8F0" opacity="0.8" />
        <path d="M0 180 Q 100 150 200 170 T 400 160 L 400 240 L 0 240 Z" fill="#D4A373" />
        <ellipse cx="200" cy="200" rx="60" ry="15" fill="#4FD1C5" opacity="0.7" />
        <path d="M80 170 L80 120 M80 120 L60 100 M80 120 L100 100 M80 130 L100 140 M80 130 L60 140" stroke="#2F855A" strokeWidth="4" fill="none" />
        <path d="M320 160 L320 110 M320 110 L300 90 M320 110 L340 90 M320 120 L340 130 M320 120 L300 130" stroke="#2F855A" strokeWidth="4" fill="none" />
      </svg>
    );
  }

  if (category === 'nature' || name.includes('desert')) {
    return (
      <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
        <rect width="400" height="240" fill="#14213D" />
        <path d="M0 180 Q 200 150 400 180 L 400 240 L 0 240 Z" fill="#E5E5E5" />
        <path d="M120 180 Q 150 80 180 180 Z" fill="#FFFFFF" />
        <path d="M250 190 Q 280 100 310 190 Z" fill="#FFFFFF" />
        <circle cx="200" cy="80" r="15" fill="#FFFFFF" opacity="0.8" />
      </svg>
    );
  }

  if (category === 'beach' || name.includes('sea') || name.includes('sharm')) {
    return (
      <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
        <rect width="400" height="240" fill="#0077B6" />
        <path d="M0 120 Q 100 100 200 120 T 400 120 L 400 240 L 0 240 Z" fill="#0096C7" />
        <path d="M50 200 Q 80 180 110 210 T 170 200" stroke="#FF5400" strokeWidth="8" fill="none" strokeLinecap="round" />
        <circle cx="300" cy="60" r="30" fill="#FFD166" />
      </svg>
    );
  }

  if (category === 'museum') {
    return (
      <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
        <rect width="400" height="240" fill="#2b2d42" />
        <rect x="50" y="100" width="300" height="20" fill="#edf2f4" />
        <rect x="70" y="120" width="20" height="80" fill="#8d99ae" />
        <rect x="140" y="120" width="20" height="80" fill="#8d99ae" />
        <rect x="240" y="120" width="20" height="80" fill="#8d99ae" />
        <rect x="310" y="120" width="20" height="80" fill="#8d99ae" />
        <rect x="40" y="200" width="320" height="20" fill="#edf2f4" />
        <polygon points="200,40 50,100 350,100" fill="#d90429" />
      </svg>
    );
  }

  // Fallback ancient
  return (
    <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
      <defs>
        <linearGradient id="fallback-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1B6B93" />
          <stop offset="100%" stopColor="#D4A373" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#fallback-sky)" />
      <polygon points="120,180 220,60 320,180" fill="#E9C46A" />
    </svg>
  );
}

// Weather Badge component to fetch weather for each card individually
function WeatherBadge({ lat, lon }: { lat: number, lon: number }) {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    if (!lat || !lon) return;
    fetch(`/api/weather?lat=${lat}&lon=${lon}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setWeather(data);
        }
      })
      .catch(console.error);
  }, [lat, lon]);

  if (!weather) return null;

  return (
    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur rounded-full px-3 py-1 flex items-center gap-2 border border-white/20 shadow-lg">
      <img src={`https://openweathermap.org/img/wn/${weather.icon}.png`} alt={weather.description} className="w-6 h-6" />
      <span className="text-white text-xs font-bold">{weather.temperature}°C</span>
    </div>
  );
}

const categories: Category[] = ['All', 'Ancient', 'Museum', 'Nature', 'Beach', 'Hidden'];

export default function ExploreContent() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [attractions, setAttractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchAttractions() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        console.log("Supabase URL:", supabaseUrl);
        console.log("Supabase Key (first 10 chars):", supabaseKey ? supabaseKey.substring(0, 10) + '...' : 'undefined');

        const { data, error } = await supabase
          .from('attractions')
          .select('*')
          .eq('verified', true);

        if (error) throw error;
        setAttractions(data || []);
        trackEvent('page_view');
      } catch (err: any) {
        setError(err.message || 'Failed to fetch attractions');
      } finally {
        setLoading(false);
      }
    }
    fetchAttractions();
  }, [supabase]);

  const filteredDestinations = attractions.filter((dest) => {
    if (activeCategory === 'All') return true;
    return dest.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  const handleDotClick = (id: string) => {
    setSelectedMapId(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCardClick = (id: string) => {
    setSelectedMapId(id);
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
              <div className="relative w-full">
                <MapLeaflet 
                  attractions={filteredDestinations} 
                  selectedId={selectedMapId}
                  onMarkerClick={handleDotClick}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Destination Cards */}
          <div className="w-full lg:w-2/3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-[#C9A84C]">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p>Loading verified destinations...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 text-red-400">
                <AlertCircle className="w-10 h-10 mb-4" />
                <p>{error}</p>
              </div>
            ) : filteredDestinations.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                No destinations found for this category.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDestinations.map((dest, index) => (
                  <motion.div
                    key={dest.id}
                    id={dest.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleCardClick(dest.id)}
                    className={`bg-white/5 backdrop-blur border rounded-2xl overflow-hidden hover:border-[#C9A84C] transition-colors group flex flex-col relative cursor-pointer ${
                      selectedMapId === dest.id ? 'border-[#C9A84C] shadow-[0_0_15px_rgba(201,168,76,0.3)]' : 'border-[#C9A84C]/20'
                    }`}
                  >
                    {/* Image/SVG Section */}
                    <div className="h-48 relative overflow-hidden bg-gray-900">
                      {getAttractionSvg(dest.name_en, dest.category)}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-black/60 backdrop-blur rounded-full text-xs font-medium text-[#C9A84C] border border-[#C9A84C]/30 capitalize">
                          {dest.category}
                        </span>
                      </div>
                      
                      {/* Weather Badge */}
                      {dest.latitude && dest.longitude && (
                        <WeatherBadge lat={dest.latitude} lon={dest.longitude} />
                      )}
                    </div>

                    {/* Details Section */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl font-bold text-white">{dest.name_en}</h3>
                        {dest.name_ar && <span className="text-xl text-[#C9A84C] font-arabic">{dest.name_ar}</span>}
                      </div>
                      <p className="text-gray-400 mb-6 flex-grow">{dest.description_en || `Explore the beautiful ${dest.name_en}`}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <MapPin className="w-4 h-4 text-[#C9A84C]" />
                          <span>{dest.city || 'Egypt'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Star className="w-4 h-4 text-[#C9A84C]" />
                          <span className="italic text-gray-500">Rating unavailable</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 col-span-2">
                          <Users className="w-4 h-4 text-gray-600" />
                          <span className="italic">Crowd data unavailable</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => trackEvent('attraction_view', { attraction_id: dest.id, governorate_id: dest.governorate_id })}
                        className="w-full py-3 bg-[#1B6B93]/20 hover:bg-[#1B6B93]/40 border border-[#1B6B93] rounded-xl text-white font-medium flex justify-center items-center gap-2 transition-colors"
                      >
                        Explore Destination
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
