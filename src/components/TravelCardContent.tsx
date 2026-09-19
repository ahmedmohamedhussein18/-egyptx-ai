'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Download, Image as ImageIcon, MapPin, Calendar, Sparkles } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

interface PhotoMemory {
  id: string;
  photo_url: string;
  caption: string;
  memory_date: string;
  attractions?: { name_en: string; name_ar: string } | null;
}

export default function TravelCardContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [photos, setPhotos] = useState<PhotoMemory[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMemory | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirectTo=/travel-card');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchPhotos();
    }
  }, [user]);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('memory_photos')
        .select('*, attractions(name_en, name_ar)')
        .eq('user_id', user?.id)
        .order('memory_date', { ascending: false });

      if (data) {
        setPhotos(data);
        if (data.length > 0) setSelectedPhoto(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current || !selectedPhoto) return;
    setDownloading(true);
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, { quality: 1.0, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `egyptx-travel-card-${selectedPhoto.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to generate image', error);
      alert('Failed to generate travel card. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-[#C9A84C] mb-4 uppercase tracking-wider flex items-center justify-center gap-3"
          >
            <Sparkles className="w-8 h-8" />
            AI Travel Cards
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Turn your memories into beautifully crafted digital postcards.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
          </div>
        ) : photos.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm max-w-3xl mx-auto"
          >
            <ImageIcon className="w-16 h-16 text-gray-500 mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-bold text-gray-300 mb-2">No photos found</h2>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Upload a memory photo first to create your travel card.
            </p>
            <button
              onClick={() => router.push('/memories')}
              className="px-6 py-3 bg-[#C9A84C] hover:bg-[#E3C973] text-[#0A1628] font-bold rounded-lg transition-colors"
            >
              Go to Memories
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Sidebar selector */}
            <div className="lg:col-span-4 h-[600px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 overflow-y-auto custom-scrollbar">
              <h3 className="text-lg font-bold text-[#C9A84C] mb-4 uppercase tracking-wider">Select a Memory</h3>
              <div className="space-y-4">
                {photos.map(photo => (
                  <div 
                    key={photo.id}
                    onClick={() => setSelectedPhoto(photo)}
                    className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors border ${selectedPhoto?.id === photo.id ? 'bg-[#C9A84C]/20 border-[#C9A84C]' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-white/10">
                      {/* Using img for external url from supabase storage */}
                      <img src={photo.photo_url} alt="Thumbnail" className="w-full h-full object-cover" crossOrigin="anonymous" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-white truncate">{photo.attractions?.name_en || 'Unknown Location'}</p>
                      <p className="text-xs text-gray-400">{new Date(photo.memory_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Canvas Preview & Export */}
            <div className="lg:col-span-8 flex flex-col items-center">
              
              {selectedPhoto && (
                <div className="w-full max-w-[500px] mb-8">
                  {/* The actual element to capture */}
                  <div 
                    ref={cardRef} 
                    className="relative w-full aspect-[4/5] bg-[#030712] overflow-hidden rounded-2xl shadow-2xl border-[8px] border-[#0A1628]"
                  >
                    {/* Background Image */}
                    <img 
                      src={selectedPhoto.photo_url} 
                      alt="Travel Card Background" 
                      crossOrigin="anonymous" 
                      className="absolute inset-0 w-full h-full object-cover opacity-80" 
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-[#0A1628]/40" />

                    {/* Inner Gold Border */}
                    <div className="absolute inset-4 border-2 border-[#C9A84C]/50 pointer-events-none rounded-lg" />
                    <div className="absolute inset-5 border border-[#C9A84C]/30 pointer-events-none rounded-md" />

                    {/* Corner Ornaments */}
                    <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#C9A84C]" />
                    <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#C9A84C]" />
                    <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#C9A84C]" />
                    <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#C9A84C]" />

                    {/* Branding Top */}
                    <div className="absolute top-8 w-full text-center">
                      <p className="text-[10px] tracking-[0.3em] text-white/80 uppercase">EgyptX AI Experience</p>
                    </div>

                    {/* Content Bottom */}
                    <div className="absolute bottom-10 left-8 right-8 text-center drop-shadow-lg">
                      {selectedPhoto.attractions?.name_ar && (
                        <p className="font-arabic text-2xl text-[#C9A84C] mb-1 opacity-90">{selectedPhoto.attractions.name_ar}</p>
                      )}
                      <h2 className="text-3xl font-bold text-white uppercase tracking-widest mb-2 font-serif">
                        {selectedPhoto.attractions?.name_en || 'Egypt'}
                      </h2>
                      <div className="flex items-center justify-center gap-4 text-sm text-white/80 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> EGYPT</span>
                        <span className="w-1 h-1 rounded-full bg-[#C9A84C]" />
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(selectedPhoto.memory_date).getFullYear()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleDownload}
                disabled={downloading || !selectedPhoto}
                className="px-8 py-4 bg-[#C9A84C] hover:bg-[#E3C973] text-[#0A1628] font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:shadow-[0_0_30px_rgba(201,168,76,0.5)] flex items-center gap-3 disabled:opacity-50 text-lg"
              >
                {downloading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
                {downloading ? 'Generating...' : 'Download PNG Card'}
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
