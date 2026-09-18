'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Users, Maximize, Target, 
  Sparkles, Shield, TrendingDown, Map, Loader2, AlertCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { trackEvent } from '@/lib/analytics';
import Image from 'next/image';

// Helper to get SVG based on attraction name
function getHiddenSvg(name_en: string) {
  const name = name_en.toLowerCase();
  if (name.includes('siwa')) {
    return <Image src="/images/siwa.jpg" alt={name_en} fill className="object-cover" />;
  }
  
  if (name.includes('fayoum')) {
    return <Image src="/images/fayoum.jpg" alt={name_en} fill className="object-cover" />;
  }

  if (name.includes('white desert')) {
    return <Image src="/images/white-desert.jpg" alt={name_en} fill className="object-cover" />;
  }

  if (name.includes('ras mohammed')) {
    return <Image src="/images/ras-mohammed.jpg" alt={name_en} fill className="object-cover" />;
  }

  if (name.includes('dakhla')) {
    return (
      <svg viewBox="0 0 400 200" className="w-full h-full object-cover">
        <rect width="400" height="200" fill="#F4A261" />
        <rect x="120" y="100" width="50" height="60" fill="#B38B59" />
        <rect x="190" y="80" width="70" height="80" fill="#C9A84C" />
        <rect x="280" y="110" width="40" height="50" fill="#B38B59" />
        <path d="M0 160 L 400 160 L 400 200 L 0 200 Z" fill="#D4A373" />
        <circle cx="320" cy="60" r="20" fill="#E9C46A" />
      </svg>
    );
  }

  if (name.includes('valley')) {
    return (
      <svg viewBox="0 0 400 200" className="w-full h-full object-cover">
        <rect width="400" height="200" fill="#E9C46A" />
        <rect x="150" y="120" width="20" height="40" fill="#C9A84C" />
        <rect x="190" y="120" width="20" height="40" fill="#C9A84C" />
        <rect x="230" y="120" width="20" height="40" fill="#C9A84C" />
        <path d="M140 110 L 260 110 L 250 120 L 150 120 Z" fill="#B38B59" />
        <path d="M0 160 Q 200 140 400 160 L 400 200 L 0 200 Z" fill="#D4A373" />
      </svg>
    );
  }

  if (name.includes('gemal') || name.includes('sea') || name.includes('coast')) {
    return (
      <svg viewBox="0 0 400 200" className="w-full h-full object-cover">
        <rect width="400" height="200" fill="#023E8A" />
        <path d="M0 80 Q 100 60 200 80 T 400 80 L 400 200 L 0 200 Z" fill="#0077B6" />
        <path d="M0 120 Q 150 100 300 150 L 400 160 L 400 200 L 0 200 Z" fill="#E9C46A" />
        <polygon points="50,150 120,60 190,150" fill="#D4A373" />
        <circle cx="340" cy="50" r="25" fill="#FFD166" />
      </svg>
    );
  }

  // Fallback for generic hidden nature places
  return (
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
  );
}

export default function HiddenEgyptContent() {
  const [attractions, setAttractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const supabase = createClient();

  useEffect(() => {
    async function fetchHiddenAttractions() {
      try {
        const { data, error } = await supabase
          .from('attractions')
          .select('*')
          .in('category', ['hidden', 'nature'])
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
    fetchHiddenAttractions();
  }, [supabase]);

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
                Redirecting tourists to these destinations reduces congestion at major monuments while boosting local economies in underserved regions. Data models for impact are currently awaiting verified data sources.
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-4 text-[#C9A84C] font-bold">
              <TrendingDown className="w-8 h-8" />
              <span>Reduced<br/>Crowding</span>
            </div>
          </div>
        </motion.div>

        {/* Destination Cards Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#C9A84C]">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p>Loading hidden gems...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-400">
            <AlertCircle className="w-10 h-10 mb-4" />
            <p>{error}</p>
          </div>
        ) : attractions.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No hidden gems found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {attractions.map((dest, idx) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="bg-white/5 backdrop-blur border border-[#C9A84C]/20 rounded-3xl overflow-hidden hover:border-[#C9A84C]/60 transition-all group flex flex-col shadow-lg"
              >
                {/* SVG Image Header */}
                <div className="h-48 w-full relative overflow-hidden bg-gray-900">
                  {getHiddenSvg(dest.name_en)}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border shadow-lg flex items-center gap-1 bg-green-500/20 text-green-400 border-green-500/40">
                      <Shield className="w-3 h-3" />
                      Opp: UNKNOWN
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-2xl font-bold text-white">{dest.name_en}</h3>
                    {dest.name_ar && <span className="text-xl text-[#C9A84C] font-arabic">{dest.name_ar}</span>}
                  </div>
                  <p className="text-gray-400 text-sm mb-6">{dest.description_en || `Experience the beauty of ${dest.name_en}`}</p>

                  {/* Stats & Capacity Bar - Removed Fake Data */}
                  <div className="bg-[#0A1628] rounded-xl p-4 mb-6 border border-white/5 flex flex-col items-center justify-center min-h-[80px]">
                    <p className="text-sm text-gray-500 font-semibold italic flex items-center gap-2">
                      <Users className="w-4 h-4" /> Platform visit data unavailable
                    </p>
                  </div>

                  {/* AI Recommendation Callout */}
                  <div className="bg-[#1B6B93]/10 border border-[#1B6B93]/30 rounded-xl p-4 mb-6 flex-grow">
                    <h4 className="text-[#4CC9F0] text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Sparkles className="w-4 h-4" /> AI Recommendation
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed italic text-gray-500">
                      Awaiting AI model predictions for this location.
                    </p>
                  </div>

                  <button 
                    onClick={() => trackEvent('attraction_view', { attraction_id: dest.id, governorate_id: dest.governorate_id })}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium flex justify-center items-center gap-2 transition-colors mt-auto group-hover:bg-[#C9A84C] group-hover:text-[#030712] group-hover:border-[#C9A84C]"
                  >
                    Explore Destination
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
