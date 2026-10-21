'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Hourglass, Sparkles, Crown, Lock, Volume2, VolumeX, 
  RotateCcw, Compass, ArrowRight, ShieldCheck, Zap, Layers,
  ChevronRight, Calendar, Info
} from 'lucide-react';
import { useEliteTrials } from '@/lib/elite-trials';
import EliteModal from '@/components/EliteModal';
import Link from 'next/link';

interface Monument {
  id: string;
  name: string;
  nameAr: string;
  era: string;
  year: string;
  location: string;
  description: string;
  restoredDescription: string;
  casingMaterial: string;
  originalHeight: string;
  solarAlignment: string;
  soundscapeTrack: string;
  gradient: string;
  ancientVisualBg: string;
}

const MONUMENTS: Monument[] = [
  {
    id: 'giza-pyramid',
    name: 'The Great Pyramid & Sphinx',
    nameAr: 'أهرامات الجيزة وأبو الهول',
    era: 'Old Kingdom · 4th Dynasty',
    year: 'c. 2560 BCE',
    location: 'Giza Plateau, Cairo',
    description: 'Weathered yellow limestone blocks with eroded apex, surrounded by modern Giza city.',
    restoredDescription: 'Clad entirely in mirror-polished white Tura limestone reflecting desert sunlight like a beacon. Crowned with an electrum (gold-silver alloy) pyramidion blazing at the zenith. Sphinx vividly painted in ceremonial red ochre and cobalt blue, guarding the sacred causeway.',
    casingMaterial: 'Polished Tura Fine Limestone & Solid Electrum Capstone',
    originalHeight: '146.6 meters (481 ft)',
    solarAlignment: 'Aligned to Cardinal True North within 3/60th of a degree',
    soundscapeTrack: 'Desert Winds & Sacred Priestly Chants',
    gradient: 'from-amber-600/30 via-yellow-700/20 to-black',
    ancientVisualBg: 'bg-gradient-to-tr from-amber-950 via-[#0C1222] to-amber-900/60',
  },
  {
    id: 'karnak-temple',
    name: 'Karnak Hypostyle Hall',
    nameAr: 'صالة الأعمدة بمعبد الكرنك',
    era: 'New Kingdom · 19th Dynasty',
    year: 'c. 1279 BCE (Ramesses II)',
    location: 'Thebes (Luxor)',
    description: 'Towering stone columns open to the Egyptian sky with weathered inscriptions.',
    restoredDescription: '134 massive papyrus columns soaring 21 meters, fully sheltered beneath a cedarwood ceiling painted with lapis-lazuli golden constellations. Colossal architraves saturated in cinnabar red, malachite green, and Egyptian blue. The sacred lake reflects crystal-pure Nile water.',
    casingMaterial: 'Nubian Sandstone soaked in mineral pigments & gold leaf leafing',
    originalHeight: '24 meters ceiling height',
    solarAlignment: 'Winter Solstice sunrise pierces through the main sanctuary axis',
    soundscapeTrack: 'Bronze Horns & Sistrum Rattles of Amun-Ra',
    gradient: 'from-blue-600/30 via-indigo-900/20 to-black',
    ancientVisualBg: 'bg-gradient-to-tr from-indigo-950 via-[#0A1628] to-blue-900/60',
  },
  {
    id: 'abu-simbel',
    name: 'Colossal Temple of Abu Simbel',
    nameAr: 'معبد أبو سمبل الكبير',
    era: 'New Kingdom · 19th Dynasty',
    year: 'c. 1264 BCE',
    location: 'Nubia, Aswan',
    description: 'Reconstructed mountain cliffside preserved above modern Lake Nasser by UNESCO.',
    restoredDescription: 'Four monumental 20-meter seated colossi of Ramesses II carved directly into the living sandstone rock face, adorned with bright gold Nemes headcloths. During the bi-annual solar alignment, the sun illuminates Ra-Horakhty, Amun-Ra, and Ramesses in the innermost sanctuary.',
    casingMaterial: 'Living Red Sandstone with polychromatic mineral glazes',
    originalHeight: '33 meters facade height',
    solarAlignment: 'Precision bi-annual sanctuary solar illumination (Feb 22 & Oct 22)',
    soundscapeTrack: 'Nile Torrents & Royal Trumpets',
    gradient: 'from-red-600/30 via-amber-800/20 to-black',
    ancientVisualBg: 'bg-gradient-to-tr from-red-950 via-[#100D1A] to-amber-900/60',
  },
  {
    id: 'tut-tomb',
    name: 'Golden Tomb of Tutankhamun (KV62)',
    nameAr: 'مقبرة توت عنخ آمون الملكية',
    era: 'New Kingdom · 18th Dynasty',
    year: 'c. 1323 BCE',
    location: 'Valley of the Kings, Luxor',
    description: 'Rock-cut underground burial chamber with climate-controlled glass vitrines.',
    restoredDescription: 'Burial chamber glowing with pristine yellow and ochre plaster murals depicting the twelve hours of the Amduat. Four nested shrines of gilded oak wrapped in linen veils, guarded by the jackal Anubis on a black carrying shrine alongside alabaster canopic chests.',
    casingMaterial: 'Solid Cedarwood, Heavy Gold Leaf, & Lapis Lazuli Inlays',
    originalHeight: 'Chamber Depth: 8.5 meters subterranean',
    solarAlignment: 'Oriented along the western sunset realm of Osiris',
    soundscapeTrack: 'Soft Whispers of the Underworld & Myrrh Incense',
    gradient: 'from-yellow-600/30 via-amber-900/20 to-black',
    ancientVisualBg: 'bg-gradient-to-tr from-yellow-950 via-[#080E1A] to-amber-800/60',
  },
  {
    id: 'philae-temple',
    name: 'Island Temple of Goddess Isis',
    nameAr: 'معبد إيزيس بجزيرة فيلة',
    era: 'Ptolemaic · 30th Dynasty',
    year: 'c. 280 BCE',
    location: 'Philae Island, Aswan',
    description: 'Relocated island sanctuary in Upper Egypt with Hellenistic and Roman colonnades.',
    restoredDescription: 'A paradise sanctuary set amidst sacred date palms on the holy island of Isis. Twin grand pylons carved with colossal bas-reliefs, painted mammisi (birth house), and granite obelisks burning pure frankincense continuously from sunrise to midnight.',
    casingMaterial: 'Aswan Pink Granite & Fine Calcite Inlays',
    originalHeight: '18 meters pylon height',
    solarAlignment: 'Equinox dawn alignment across the sacred Nile water gate',
    soundscapeTrack: 'Gentle Nile Rhythms & Harp Melodies of Isis',
    gradient: 'from-emerald-600/30 via-teal-900/20 to-black',
    ancientVisualBg: 'bg-gradient-to-tr from-teal-950 via-[#06121E] to-emerald-900/60',
  },
];

export default function TimeTravelPage() {
  const { isElite, useTrial, timeTravelUsed } = useEliteTrials();
  const [selectedMonument, setSelectedMonument] = useState<Monument>(MONUMENTS[0]);
  const [viewMode, setViewMode] = useState<'restored' | 'ruins'>('restored');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [showEliteModal, setShowEliteModal] = useState(false);

  // If trial has been used and user is not elite, the restored view is locked!
  const isViewLocked = !isElite && timeTravelUsed;

  const handleSelectMonument = (monument: Monument) => {
    if (!isElite && timeTravelUsed && monument.id !== selectedMonument.id) {
      setShowEliteModal(true);
      return;
    }
    setSelectedMonument(monument);
    setIsPlayingAudio(false);
  };

  const handleToggleRestoration = () => {
    if (viewMode === 'ruins') {
      if (!isElite && timeTravelUsed) {
        setShowEliteModal(true);
        return;
      }
      setIsSynthesizing(true);
      setTimeout(() => {
        setIsSynthesizing(false);
        setViewMode('restored');
        if (!timeTravelUsed) {
          useTrial('time-travel');
        }
      }, 1200);
    } else {
      setViewMode('ruins');
    }
  };

  const handleSoundscapeToggle = () => {
    if (!isElite && timeTravelUsed) {
      setShowEliteModal(true);
      return;
    }
    setIsPlayingAudio(!isPlayingAudio);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-20 font-sans relative overflow-hidden">
      {/* Ambient Ancient Gold Mesh Blobs */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[450px] h-[450px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold mb-4 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Hourglass className="w-4 h-4 text-amber-400 animate-spin" />
            <span>4D Photogrammetric Temporal Reconstruction</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              AI Time Travel Explorer ⏳
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300/80 leading-relaxed font-normal">
            Witness Ancient Egypt in its 100% intact, pristine glory. Strip away millennia of desert weathering to experience mirror-polished limestone, blazing gold pyramidions, and sacred temple soundscapes.
          </p>

          {/* Access Status Banner */}
          <div className="mt-5 flex items-center justify-center gap-3">
            {isElite ? (
              <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 flex items-center gap-1.5 shadow-[0_0_25px_rgba(245,158,11,0.4)]">
                <Crown className="w-3.5 h-3.5" />
                Sovereign Elite Unlocked · Unlimited Historical Portals
              </span>
            ) : timeTravelUsed ? (
              <button
                onClick={() => setShowEliteModal(true)}
                className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                1 Free Preview Consumed · Upgrade to Elite 
              </button>
            ) : (
              <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-400/20 via-yellow-400/20 to-amber-500/20 border border-amber-400/50 text-amber-300 flex items-center gap-1.5 shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                 1 Free 4D Preview Available
              </span>
            )}
          </div>
        </div>

        {/* Monument Horizontal Carousel / Selector */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
          {MONUMENTS.map((monument) => {
            const isSelected = selectedMonument.id === monument.id;
            return (
              <button
                key={monument.id}
                onClick={() => handleSelectMonument(monument)}
                className={`px-5 py-3.5 rounded-2xl shrink-0 transition-all text-left border flex items-center gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-[#0B1120] border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)] text-white'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/20 text-slate-400 hover:text-white'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                  isSelected ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-slate-300'
                }`}>
                  <Hourglass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white whitespace-nowrap">{monument.name}</h4>
                  <p className="text-[11px] text-amber-400 font-mono">{monument.year}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main 4D Time Portal Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left / Center Viewport (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col">
            <div className={`relative rounded-3xl border-2 border-amber-500/30 overflow-hidden shadow-[0_0_40px_rgba(245,158,11,0.15)] flex-1 min-h-[440px] flex flex-col justify-between p-6 sm:p-8 ${selectedMonument.ancientVisualBg}`}>
              
              {/* Radial Top Glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

              {/* Viewport Top Bar */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    {selectedMonument.location}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                    {selectedMonument.name}
                  </h2>
                </div>

                {/* Mode Toggle Switch: Restored vs Ruins */}
                <div className="flex items-center gap-2 bg-black/50 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
                  <button
                    onClick={() => setViewMode('ruins')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      viewMode === 'ruins' ? 'bg-white/20 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Present Ruins
                  </button>
                  <button
                    onClick={handleToggleRestoration}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      viewMode === 'restored' 
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]' 
                        : 'text-amber-400 hover:text-amber-300'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    4D Restored
                  </button>
                </div>
              </div>

              {/* Middle View Area */}
              <div className="relative z-10 my-8">
                {isSynthesizing ? (
                  <div className="py-16 flex flex-col items-center justify-center text-center">
                    <Hourglass className="w-12 h-12 text-amber-400 animate-spin mb-4 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]" />
                    <h3 className="text-lg font-bold text-white mb-1">Synthesizing 4D Photogrammetric Reality...</h3>
                    <p className="text-xs text-amber-300/80 font-mono">Restoring Tura limestone polish · Re-aligning solstice vectors</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="inline-block px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-white/10 border border-white/15 text-slate-200">
                      Era Target: {selectedMonument.era} ({selectedMonument.year})
                    </div>
                    
                    <p className="text-base sm:text-lg text-slate-100 font-normal leading-relaxed max-w-2xl">
                      {viewMode === 'restored' ? selectedMonument.restoredDescription : selectedMonument.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Interactive Bar */}
              <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={handleSoundscapeToggle}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                    isPlayingAudio
                      ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                      : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/15'
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <Volume2 className="w-4 h-4 animate-bounce" />
                      <span>Audio Active: {selectedMonument.soundscapeTrack}</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>Simulate Temple Audio Soundscape</span>
                    </>
                  )}
                </button>

                <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Curated by EgyptX Heritage Institute</span>
                </div>
              </div>

              {/* Frosted Gold Lock Overlay if trial is exhausted */}
              {isViewLocked && viewMode === 'restored' && (
                <div className="absolute inset-0 z-30 backdrop-blur-xl bg-slate-950/85 flex flex-col items-center justify-center p-6 text-center border-2 border-amber-500/50 shadow-[inset_0_0_40px_rgba(245,158,11,0.3)]">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/25 via-yellow-500/15 to-indigo-950/40 border border-amber-400/50 flex items-center justify-center mb-3 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                    <Lock className="w-8 h-8 text-amber-400 animate-pulse drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-amber-300 mb-2 flex items-center gap-2">
                    AI Time Travel Explorer · Elite Exclusive 
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300/80 mb-6 max-w-md leading-relaxed font-normal">
                    You loved your free Time Travel preview! Unlock unlimited historical eras, 4D photogrammetric architectural restorations, and royal soundscapes with EgyptX Elite.
                  </p>
                  <button
                    onClick={() => setShowEliteModal(true)}
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    Unlock Unlimited Time Travel 
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Architectural & Archaeological Blueprint (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* Blueprint Spec Card */}
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-amber-400">
                <Layers className="w-4 h-4" />
                <h3 className="text-xs font-black uppercase tracking-wider">
                  Archaeological Blueprint Specs
                </h3>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">Original Outer Casing</span>
                <p className="text-xs font-medium text-white">{selectedMonument.casingMaterial}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">Monument Dimensions</span>
                <p className="text-xs font-medium text-white">{selectedMonument.originalHeight}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">Solar Astronomical Vector</span>
                <p className="text-xs font-medium text-white">{selectedMonument.solarAlignment}</p>
              </div>
            </div>

            {/* Elite VIP Perks Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-[#0A1628] to-[#040913] border border-amber-500/30 backdrop-blur-xl flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center gap-2 mb-2 text-amber-300">
                  <Crown className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-wider">EgyptX Elite Suite</span>
                </div>
                <h4 className="text-base font-bold text-white mb-2">
                  Unrestricted 4D Historical Power
                </h4>
                <p className="text-xs text-slate-300/80 leading-relaxed font-normal mb-4">
                  Experience ancient night sky alignments, custom monument walk-throughs, and download offline high-res architectural renders with Pharaoh Elite.
                </p>
              </div>

              <button
                onClick={() => setShowEliteModal(true)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Upgrade to Elite ($39.99/mo)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Elite Upgrade Modal */}
      <EliteModal
        isOpen={showEliteModal}
        onClose={() => setShowEliteModal(false)}
        contextTitle="Unlock AI Time Travel Explorer "
        contextMessage="You loved your free Time Travel preview! Unlock unlimited 4D historical restorations with EgyptX Elite."
        featureTrigger="time-travel"
      />
    </div>
  );
}
