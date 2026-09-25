'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
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
const exactImageMap: Record<string, string> = {
  "Great Pyramid of Giza": "Great Pyramid of Giza.jpg",
  "Egyptian Museum Cairo": "Egyptian Museum Cairo.webp",
  "Karnak Temple": "Karnak Temple.jpeg",
  "Luxor Temple": "Luxor Temple.jpg",
  "Valley of the Kings": "Valley of the Kings.jpg",
  "Abu Simbel Temples": "Abu Simbel Temples.jpg",
  "Philae Temple": "Philae Temple.jpeg",
  "Siwa Oasis": "Siwa Oasis.jpg",
  "White Desert": "White Desert.jpg",
  "Grand Egyptian Museum": "Grand Egyptian Museum.jpg",
  "Saqqara Step Pyramid": "Saqqara Step Pyramid.jpg",
  "Fayoum Oasis": "Fayoum Oasis.jpg",
  "Red Sea Coast Hurghada": "Red Sea Coast Hurghada.jpg",
  "Sharm El Sheikh": "Sharm El Sheikh.jpg",
  "Ras Mohammed": "Ras Mohammed.jpg",
  "Alexandria Library": "Alexandria Library.webp",
  "Saint Catherine Monastery": "Saint Catherine Monastery.jpg",
  "Citadel of Saladin": "Citadel of Saladin.jpg",
  "Wadi El Hitan": "Wadi El Hitan.jpeg",
  "Egyptian Museum (Tahrir)": "Egyptian Museum (Tahrir).jpg",
  "Mosque of Muhammad Ali": "Mosque of Muhammad Ali.jpg",
  "Sultan Hassan Mosque": "Sultan Hassan Mosque.webp",
  "Al-Rifa'i Mosque": "Al-Rifa'i Mosque.jpg",
  "Khan el-Khalili Bazaar": "Khan el-Khalili Bazaar.jpg",
  "Al-Azhar Mosque": "Al-Azhar Mosque.webp",
  "Hanging Church (El Muallaqa)": "Hanging Church (El Muallaqa).jpeg",
  "Coptic Museum": "Coptic Museum.jpg",
  "Ben Ezra Synagogue": "Ben Ezra Synagogue.jpeg",
  "Amr ibn al-As Mosque": "Amr ibn al-As Mosque.jpg",
  "Cairo Tower (Borg El Qahira)": "Cairo Tower (Borg El Qahira).jpg",
  "Manial Palace Museum": "Manial Palace Museum.jpg",
  "Museum of Islamic Art (Cairo)": "Museum of Islamic Art (Cairo).jpg",
  "Bayt Al-Suhaymi": "Bayt Al-Suhaymi.webp",
  "Al-Azhar Park": "Al-Azhar Park.webp",
  "Qasr El Nil Bridge": "Qasr El Nil Bridge.jpg",
  "Ibn Tulun Mosque": "Ibn Tulun Mosque.webp",
  "Gayer-Anderson Museum": "Gayer-Anderson Museum.jpg"
};

function getAttractionImage(name_en: string, category: string) {
  // Direct lookup from the exact map
  const matchedImage = exactImageMap[name_en] || "placeholder.jpg";
  const src = `/images/${matchedImage}`;

  return (
    <img 
      src={src} 
      alt={name_en}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      onError={(e) => {
        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=1000&auto=format&fit=crop';
      }}
    />
  );
}

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
  const router = useRouter();

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
        
        const strictOrder = [
  "great pyramid of giza",
  "egyptian museum cairo",
  "karnak temple",
  "luxor temple",
  "valley of the kings",
  "abu simbel temples",
  "philae temple",
  "siwa oasis",
  "white desert",
  "grand egyptian museum",
  "saqqara step pyramid",
  "fayoum oasis",
  "red sea coast hurghada",
  "sharm el sheikh",
  "ras mohammed",
  "alexandria library",
  "saint catherine monastery",
  "citadel of saladin",
  "wadi el hitan",
  "egyptian museum (tahrir)",
  "mosque of muhammad ali",
  "sultan hassan mosque",
  "al-rifa'i mosque",
  "khan el-khalili bazaar",
  "al-azhar mosque",
  "hanging church (el muallaqa)",
  "coptic museum",
  "ben ezra synagogue",
  "amr ibn al-as mosque",
  "cairo tower (borg el qahira)",
  "manial palace museum",
  "museum of islamic art (cairo)",
  "bayt al-suhaymi",
  "al-azhar park",
  "qasr el nil bridge",
  "ibn tulun mosque",
  "gayer-anderson museum"
];

        const getSortIndex = (name_en: string) => {
          if (!name_en) return 999;
          const name = name_en.toLowerCase();
          
          for (let i = 0; i < strictOrder.length; i++) {
            // Check for direct match or substring match from strictOrder
            // Clean up both strings to make matching more robust
            const target = strictOrder[i].replace(/[()'-]/g, '').trim();
            const current = name.replace(/[()'-]/g, '').trim();
            
            if (current.includes(target) || target.includes(current)) {
              return i;
            }
          }
          return 999;
        };

        const sortedData = (data || []).sort((a, b) => getSortIndex(a.name_en) - getSortIndex(b.name_en));

        setAttractions(sortedData);
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
                      {getAttractionImage(dest.name_en, dest.category)}
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
                        onClick={() => router.push(`/destination/${dest.id}`)}
                        className="w-full mt-6 py-2.5 bg-transparent border border-[#C9A84C]/50 hover:bg-[#C9A84C] hover:text-[#0A1628] text-[#C9A84C] font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                      >
                        Explore Details <ArrowRight className="w-4 h-4" />
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
