'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Loader2, ArrowLeft, MapPin, Compass, Cuboid } from 'lucide-react';
import dynamic from 'next/dynamic';

const MapLeaflet = dynamic(() => import('@/components/MapLeaflet'), { ssr: false });

export default function DestinationDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [attraction, setAttraction] = useState<any>(null);

  useEffect(() => {
    async function fetchAttraction() {
      try {
        const { data, error } = await supabase.from('attractions').select('*, governorates(name_en)').eq('id', id).single();
        if (error) throw error;
        setAttraction(data);
        
        // Track analytics silently
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventType: 'attraction_view', attractionId: id })
        }).catch(() => {});
        
      } catch (err) {
        console.error('Failed to load attraction', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAttraction();
  }, [id, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
      </div>
    );
  }

  if (!attraction) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-white mb-4">Destination Not Found</h1>
        <button onClick={() => router.push('/explore')} className="px-6 py-2 bg-[#C9A84C] text-[#0A1628] font-bold rounded-lg">
          Back to Explore
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-16 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button
          onClick={() => router.push('/explore')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Explore
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Details */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              {attraction.name_ar && <p className="font-arabic text-3xl text-[#C9A84C] mb-2">{attraction.name_ar}</p>}
              <h1 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-wider mb-4">
                {attraction.name_en}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm font-medium">
                <span className="flex items-center gap-1.5 text-gray-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                  <MapPin className="w-4 h-4 text-[#C9A84C]" /> {attraction.city}{attraction.governorates?.name_en ? `, ${attraction.governorates.name_en}` : ''}
                </span>
                <span className="flex items-center gap-1.5 text-[#4CC9F0] bg-[#4CC9F0]/10 px-3 py-1.5 rounded-full border border-[#4CC9F0]/20">
                  <Compass className="w-4 h-4" /> {attraction.category}
                </span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed border-t border-white/10 pt-6">
              <p>{attraction.description_en || 'Experience the rich history and beauty of this Egyptian marvel. Visitors from around the world travel here to witness its grandeur.'}</p>
            </div>

            {/* 3D Placeholder */}
            <div className="mt-8 bg-[#0A1628] border border-[#1B6B93]/30 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1B6B93]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#1B6B93]/20 flex items-center justify-center text-[#4CC9F0]">
                  <Cuboid className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Interactive 3D Model</h3>
                  <p className="text-sm text-gray-400">Explore this site in 3D space</p>
                </div>
              </div>
              <div className="w-full h-48 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center">
                <p className="text-gray-500 text-sm font-medium">3D Model Placeholder. Feature coming soon.</p>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="h-[400px] lg:h-[600px] bg-white/5 border border-white/10 rounded-3xl overflow-hidden p-2">
            <div className="w-full h-full rounded-2xl overflow-hidden relative">
               <MapLeaflet attractions={[attraction]} />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
