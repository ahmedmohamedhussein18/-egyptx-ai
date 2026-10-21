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

export default function GemVrExperiencePage() {
  const [isEquipping, setIsEquipping] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Cinematic "Putting On The Headset" timing sequence
  useEffect(() => {
    // At 3s: Animate mask scale(50) zooming in over 1.5s (pulling headset over eyes)
    const equipTimer = setTimeout(() => {
      setIsEquipping(true);
    }, 3000);

    // At 4.5s: Complete zoom, fully reveal 3D spatial world and enable interactions
    const readyTimer = setTimeout(() => {
      setIsReady(true);
    }, 4500);

    return () => {
      clearTimeout(equipTimer);
      clearTimeout(readyTimer);
    };
  }, []);

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

  // Guaranteed working 3D virtual tour embed
  const vrEmbedUrl = "https://my.matterport.com/show/?m=d42fuVA21To&play=1&brand=0&title=0&tourcta=0&vr=1";

  return (
    <main className="h-screen w-screen overflow-hidden bg-black relative select-none">
      {/* ── 3D SPATIAL WEBGL ENGINE ─────────────────────────────────────── */}
      <iframe
        src={vrEmbedUrl}
        title="Ancient Egypt 3D Spatial Virtual Experience"
        className="w-full h-full border-0 absolute inset-0 z-0 bg-black"
        allow="autoplay; fullscreen; vr; xr-spatial-tracking; gyroscope; accelerometer"
        allowFullScreen
      />

      {/* ── "PUTTING ON THE HEADSET" CINEMATIC OVERLAY ──────────────────── */}
      {!isReady && (
        <div
          className={`fixed inset-0 z-50 transition-opacity duration-700 ${
            isEquipping ? 'pointer-events-none' : ''
          }`}
        >
          {/* Binocular Lens Masked Black Veil */}
          <div
            className="w-full h-full bg-black flex items-center justify-center transition-transform duration-[1500ms] ease-in-out"
            style={{
              transform: isEquipping ? 'scale(50)' : 'scale(1)',
              maskImage: 'radial-gradient(circle at center, transparent 30%, black 35%)',
              WebkitMaskImage: 'radial-gradient(circle at center, transparent 30%, black 35%)',
            }}
          />

          {/* Centered Headset HUD & UI (Fades when headset pulls over eyes) */}
          <div
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none transition-all duration-500 ${
              isEquipping ? 'opacity-0 scale-125' : 'opacity-100 scale-100'
            }`}
          >
            {/* Ambient Amber Glow */}
            <div className="absolute w-72 h-72 rounded-full bg-amber-500/15 blur-[90px] animate-pulse" />

            {/* Glowing Binocular Lens Contours */}
            <div className="relative mb-6 flex items-center justify-center">
              {/* Outer Pulsing Goggle Ring */}
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.5)] animate-pulse flex items-center justify-center">
                {/* Secondary Rotating Inner Reticle */}
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-dashed border-amber-400/60 animate-spin [animation-duration:10s] flex items-center justify-center">
                  {/* Perfectly Centered VR Glasses Icon */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600/30 to-yellow-400/20 border border-amber-500/80 shadow-[0_0_25px_rgba(245,158,11,0.7)] flex items-center justify-center backdrop-blur-sm">
                    <Glasses className="w-9 h-9 text-amber-400 animate-pulse drop-shadow-[0_0_12px_rgba(245,158,11,0.9)]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Cinematic Headset Typography */}
            <div className="text-center space-y-2 max-w-sm px-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-widest uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                <span>WebXR Spatial Optical Alignment</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-amber-400 to-amber-600 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                Equipping VR Headset...
              </h2>

              <p className="text-xs text-amber-200/70 font-mono tracking-wider">
                Aligning focal lenses · Calibrating 3D depth sensors
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── MINIMALIST TOP LEFT "EXIT VR" BUTTON ────────────────────────── */}
      <div className="absolute top-5 left-5 z-20 pointer-events-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/15 hover:border-amber-500/60 text-white/90 hover:text-amber-400 text-xs font-medium transition-all duration-300 shadow-xl group hover:scale-105 active:scale-95"
          title="Exit VR and return to EgyptX AI"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-amber-400" />
          <span>← Exit VR</span>
        </Link>
      </div>

      {/* ── TOP RIGHT 3D HUD STATUS ─────────────────────────────────────── */}
      <div className="absolute top-5 right-5 z-20 hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-amber-500/30 text-amber-300 text-[11px] font-mono shadow-xl pointer-events-none">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <Compass className="w-3.5 h-3.5 text-amber-400" />
        <span>3D Spatial View Active</span>
      </div>

      {/* ── POLISHED "ENTER HEADSET MODE" BUTTON ────────────────────────── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
        <button
          onClick={handleToggleFullscreen}
          className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-black/40 backdrop-blur-md border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.4)] text-amber-500 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-300 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer group"
        >
          <div className="p-1 rounded-full bg-amber-500/20 border border-amber-500/40 group-hover:scale-110 transition-transform">
            <Glasses className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-xs sm:text-sm font-bold tracking-wide">
              {isFullscreen ? "Exit Headset Mode" : "Enter Headset Mode"}
            </span>
            <span className="text-[10px] text-amber-400/70 font-mono -mt-0.5">
              Spatial WebXR · Fullscreen
            </span>
          </div>

          <div className="ml-1 text-amber-400/70 group-hover:text-amber-300 transition-colors">
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
