"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Glasses, 
  Maximize2, 
  Minimize2, 
  Compass,
  Sparkles
} from 'lucide-react';

export default function TutHallVrPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Matterport 3D Tour URL for King Tutankhamun Hall
  const vrEmbedUrl = "https://my.matterport.com/show/?m=85n8j312Ur4";

  // Listen for native Fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Fullscreen / WebXR toggle handler
  const handleToggleFullscreen = async () => {
    try {
      if (typeof document === 'undefined') return;
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  };

  return (
    <main className="h-screen w-screen overflow-hidden bg-black relative select-none">
      {/* ── 3D SPATIAL MATTERPORT ENGINE (EMBEDDED IFRAME) ──────────────── */}
      <iframe
        src={vrEmbedUrl}
        title="King Tutankhamun Hall 3D Virtual Experience"
        className="w-full h-full border-0 absolute inset-0 z-0 bg-black"
        width="100%"
        height="100%"
        allow="vr; autoplay; fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
        allowFullScreen
        onLoad={() => setIsLoading(false)}
      />

      {/* Loading state indicator */}
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-black flex flex-col items-center justify-center pointer-events-none transition-opacity duration-500">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full border-2 border-[#D4AF37]/30 border-t-[#D4AF37] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Glasses className="w-8 h-8 text-[#D4AF37] animate-pulse" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F5E6B8] to-[#C9A84C]">
              Entering King Tutankhamun Hall 3D...
            </h2>
            <p className="text-xs text-white/50 font-mono tracking-wider">
              Calibrating spatial photogrammetry & Matterport 3D sweep
            </p>
          </div>
        </div>
      )}

      {/* ── TOP LEFT "EXIT VR" BUTTON ───────────────────────────────────── */}
      <div className="absolute top-5 left-5 z-20 pointer-events-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-[#D4AF37]/40 hover:border-[#D4AF37] text-white/90 hover:text-[#D4AF37] text-xs font-semibold transition-all duration-300 shadow-xl group hover:scale-105 active:scale-95"
          title="Exit VR and return to EgyptX AI"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#D4AF37]" />
          <span>← Exit VR</span>
        </Link>
      </div>

      {/* ── TOP RIGHT 3D HUD STATUS ──────────────────────────────────────── */}
      <div className="absolute top-5 right-5 z-20 hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37]/40 text-[#F5E6B8] text-[11px] font-mono shadow-xl pointer-events-none">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>Tut Hall 3D Spatial View Active</span>
      </div>

      {/* ── BOTTOM CENTER "ENTER HEADSET MODE" BUTTON ────────────────────── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
        <button
          onClick={handleToggleFullscreen}
          className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37]/60 shadow-[0_0_20px_rgba(212,175,55,0.3)] text-[#F5E6B8] hover:bg-[#D4AF37]/20 hover:border-[#D4AF37] hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer group"
        >
          <div className="p-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 group-hover:scale-110 transition-transform">
            <Glasses className="w-4 h-4 text-[#D4AF37] animate-pulse" />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-xs sm:text-sm font-bold tracking-wide">
              {isFullscreen ? "Exit Fullscreen" : "Enter Headset / Fullscreen"}
            </span>
            <span className="text-[10px] text-[#D4AF37]/80 font-mono -mt-0.5">
              Spatial WebXR · Full Immersion
            </span>
          </div>

          <div className="ml-1 text-[#D4AF37]/80 group-hover:text-[#D4AF37] transition-colors">
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </div>
        </button>
      </div>
    </main>
  );
}
