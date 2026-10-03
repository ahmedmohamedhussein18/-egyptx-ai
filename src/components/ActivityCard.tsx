'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface Activity {
  time: string;
  name: string;
  description: string;
  type: string;
  cost?: string;
  tip?: string;
  fact?: string;
  imagePath?: string;
  transport?: string;
}

export interface DayPlan {
  day: number;
  city: string;
  activities: Activity[];
}

export interface ActivityCardProps {
  act: Activity;
  actIdx: number;
  dayIdx: number;
  cityName?: string;
}

export default function ActivityCard({ act, actIdx, dayIdx, cityName = 'Cairo' }: ActivityCardProps) {
  const [fetchedUnsplashUrl, setFetchedUnsplashUrl] = React.useState<string | null>((act as any).imagePath || null);

  // Construct bulletproof local fallback image from the day's city
  const citySlug = (cityName || 'Cairo').toLowerCase().replace(/\s+/g, '-');
  const fallbackImg = `/destinations/${citySlug}.jpg`;
  const activeImage = fetchedUnsplashUrl || fallbackImg;

  React.useEffect(() => {
    if ((act as any).imagePath) {
      setFetchedUnsplashUrl((act as any).imagePath);
      return;
    }

    let isMounted = true;

    const fetchImage = async () => {
      try {
        const queryName = act.name || cityName || 'Egypt attraction';
        const res = await fetch(`/api/fetch-image?query=${encodeURIComponent(queryName)}`);
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        if (isMounted && data?.url) {
          setFetchedUnsplashUrl(data.url);
        }
      } catch (err) {
        console.warn('[ActivityCard] Using local destination fallback for:', act.name);
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
    };
  }, [act.name, cityName]);

  const cardRef = React.useRef<HTMLDivElement>(null);
  const glareRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = cardRef.current;
    const glare = glareRef.current;
    if (!el || !glare) return;

    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -6; 
      const rotateY = ((x - centerX) / centerX) * 6;
      
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        glare.style.transform = `translate(${x - rect.width/2}px, ${y - rect.height/2}px)`;
        glare.style.opacity = '0.5';
      });
    };

    const handleMouseLeave = () => {
      cancelAnimationFrame(rafId);
      el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      if (glare) glare.style.opacity = '0';
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: (dayIdx * 0.2) + (actIdx * 0.15), ease: [0.21, 1.02, 0.73, 1] }}
    >
      {actIdx > 0 && (
        <div className="ml-1 pl-4 border-l border-dashed border-[#C9A84C]/40 py-3">
          <span className="inline-flex items-center gap-1 bg-[#0A1628] border border-[#C9A84C]/30 text-[#E2CB85] text-xs px-3 py-1.5 rounded-md shadow-[0_0_10px_rgba(201,168,76,0.15)] font-medium">
            {(act as any).transport || (actIdx % 2 === 0 ? '🚕 Taxi - 25 mins' : '🚶 Walking - 10 mins')}
          </span>
        </div>
      )}
      
      <div className="flex gap-5 py-3 group">
        <div className="flex flex-col items-center">
          <div className="w-3.5 h-3.5 rounded-full bg-[#C9A84C]/80 group-hover:bg-[#E2CB85] transition-colors ring-4 ring-[#C9A84C]/20 shadow-[0_0_10px_rgba(201,168,76,0.5)]" />
          <div className="w-px flex-1 bg-gradient-to-b from-[#C9A84C]/40 to-transparent mt-2" />
        </div>
        
        <div className="pb-6 flex-1 min-w-0" style={{ perspective: '1000px' }}>
          <div 
            ref={cardRef} 
            className="relative bg-[#0A1628]/70 backdrop-blur-[12px] border border-[#D4AF37]/20 rounded-2xl overflow-hidden group-hover:border-[#C9A84C]/50 transition-[border,box-shadow] shadow-[0_10px_40px_rgb(0,0,0,0.6)] flex flex-col sm:flex-row will-change-transform"
            style={{ transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
          >
            {/* Moving Glare Overlay */}
            <div 
              ref={glareRef}
              className="pointer-events-none absolute w-[200%] h-[200%] -top-1/2 -left-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_50%)] opacity-0 transition-opacity duration-300 z-50 mix-blend-overlay"
            />
            
            {/* Image Section - Bulletproof with local fallback & Unsplash enhancement */}
            <div 
              className="sm:w-60 w-full h-56 sm:h-auto min-h-[220px] relative shrink-0 overflow-hidden bg-[#0B1120] bg-cover bg-center transition-all duration-700"
              style={{ backgroundImage: `url('${activeImage}')` }}
            >
              <img 
                src={activeImage}
                alt={act.name}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110" 
                onError={() => {
                  if (fetchedUnsplashUrl) {
                    console.warn('[ActivityCard] Remote image failed, using local fallback:', fallbackImg);
                    setFetchedUnsplashUrl(null);
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/25 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-[#0A1628] pointer-events-none" />
              
              <div className="absolute top-3 left-3 bg-[#030712]/90 backdrop-blur-md text-[#E2CB85] px-3 py-1.5 rounded-lg text-xs font-bold border border-[#C9A84C]/40 shadow-lg flex items-center gap-2 z-10">
                ⏱ {act.time}
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col justify-center relative z-10 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs px-3 py-1 rounded-full bg-[#C9A84C]/15 text-[#E2CB85] border border-[#C9A84C]/30 uppercase tracking-widest font-bold shadow-sm">{act.type}</span>
                {act.cost && <span className="text-xs px-3 py-1 rounded-full bg-[#19A974]/15 text-[#19A974] border border-[#19A974]/30 font-semibold flex items-center gap-1 shadow-sm">💰 {act.cost}</span>}
              </div>
              
              <h4 className="font-extrabold text-2xl text-white group-hover:text-[#E2CB85] transition-colors leading-tight drop-shadow-md">{act.name}</h4>
              <p className="text-sm text-white/70 leading-relaxed font-medium">{act.description}</p>
              
              <div className="pt-4 mt-2 border-t border-white/10 space-y-3">
                {act.tip && (
                  <div className="flex items-start gap-3 text-sm text-[#1B6B93] bg-[#1B6B93]/10 p-2.5 rounded-lg border border-[#1B6B93]/20">
                    <span className="shrink-0 mt-0.5">💡</span>
                    <span><strong className="text-white/90">Tip:</strong> {act.tip}</span>
                  </div>
                )}
                {act.fact && (
                  <div className="flex items-start gap-3 text-sm text-[#C9A84C]/90 bg-[#C9A84C]/5 p-2.5 rounded-lg border border-[#C9A84C]/20">
                    <span className="shrink-0 mt-0.5">📜</span>
                    <span><strong className="text-[#E2CB85]">Did you know?</strong> {act.fact}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
