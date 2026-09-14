'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ScanLine, Info, Images, ExternalLink, MapPin, Search } from 'lucide-react';

interface ArtifactData {
  id: string;
  name: string;
  period: string;
  dynasty: string;
  location: string;
  description: string;
  imageUrl?: string;
}

const ARTIFACTS: ArtifactData[] = [
  {
    id: 'tut-mask',
    name: 'Golden Mask of Tutankhamun',
    period: 'New Kingdom',
    dynasty: '18th Dynasty (c. 1323 BCE)',
    location: 'Valley of the Kings, KV62',
    description: 'The spectacular gold death mask of the boy king Tutankhamun, inlaid with colored glass and semiprecious stones. It is one of the most famous works of art in the world and a prominent symbol of ancient Egypt.'
  },
  {
    id: 'rosetta-stone',
    name: 'Rosetta Stone',
    period: 'Ptolemaic',
    dynasty: 'Ptolemaic Kingdom (196 BCE)',
    location: 'Memphis',
    description: 'A granodiorite stele inscribed with three versions of a decree issued in Memphis. Its bilingual text (Ancient Egyptian and Greek) was the key to deciphering Egyptian hieroglyphs.'
  },
  {
    id: 'nefertiti-bust',
    name: 'Nefertiti Bust',
    period: 'New Kingdom',
    dynasty: '18th Dynasty (c. 1345 BCE)',
    location: 'Amarna',
    description: 'A painted stucco-coated limestone bust of Nefertiti, the Great Royal Wife of Akhenaten. The work is believed to have been crafted by the sculptor Thutmose, serving as a timeless icon of feminine beauty.'
  },
  {
    id: 'narmer-palette',
    name: 'Narmer Palette',
    period: 'Early Dynastic',
    dynasty: '1st Dynasty (c. 3100 BCE)',
    location: 'Hierakonpolis',
    description: 'A significant Egyptian archeological find, featuring some of the earliest hieroglyphic inscriptions ever found. It is thought by some to depict the unification of Upper and Lower Egypt under the king Narmer.'
  }
];

export default function MuseumAIContent() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedArtifact, setAnalyzedArtifact] = useState<ArtifactData | null>(null);

  const handleIdentify = () => {
    setAnalyzedArtifact(null);
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzedArtifact(ARTIFACTS[0]); // Default to Tut mask
    }, 1500);
  };

  const handleSelectRecent = (artifact: ArtifactData) => {
    setAnalyzedArtifact(artifact);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-[#C9A84C] mb-4 flex items-center justify-center gap-3"
          >
            <Search className="w-10 h-10 hidden sm:block" /> Museum Companion
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400"
          >
            Point, scan, discover. Uncover the history behind any artifact.
          </motion.p>
        </div>

        {/* Viewfinder & Result Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Camera Viewfinder */}
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-sm aspect-[3/4] bg-[#0A1628]/40 border border-[#C9A84C]/20 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(201,168,76,0.1)] mb-6">
              
              {/* Brackets */}
              <div className="absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 border-[#C9A84C]" />
              <div className="absolute top-6 right-6 w-10 h-10 border-t-2 border-r-2 border-[#C9A84C]" />
              <div className="absolute bottom-6 left-6 w-10 h-10 border-b-2 border-l-2 border-[#C9A84C]" />
              <div className="absolute bottom-6 right-6 w-10 h-10 border-b-2 border-r-2 border-[#C9A84C]" />
              
              {/* Center target */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-32 h-32 border border-white/20 rounded-full" />
                <div className="absolute w-2 h-2 bg-white/50 rounded-full" />
              </div>

              {/* Scanning Animation */}
              {isAnalyzing && (
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
                  className="absolute left-0 w-full h-1 bg-[#1B6B93] shadow-[0_0_20px_#1B6B93]"
                />
              )}
            </div>

            <button 
              onClick={handleIdentify}
              disabled={isAnalyzing}
              className={`px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all ${
                isAnalyzing 
                  ? 'bg-gray-800 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[#C9A84C] to-[#E2C779] text-[#030712] hover:scale-105 shadow-[0_0_30px_rgba(201,168,76,0.3)]'
              }`}
            >
              <Camera className="w-5 h-5" />
              {isAnalyzing ? 'Analyzing Image...' : 'Identify Artifact'}
            </button>
          </div>

          {/* Result Card */}
          <div className="flex items-center justify-center">
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-[#C9A84C]"
                >
                  <ScanLine className="w-16 h-16 animate-pulse mb-4" />
                  <p className="font-semibold text-lg animate-pulse">Running Vision AI Model...</p>
                </motion.div>
              ) : analyzedArtifact ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full bg-white/5 backdrop-blur border border-[#C9A84C]/30 rounded-3xl p-6 md:p-8"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold mb-4 border border-green-500/30">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    MATCH FOUND
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white mb-6">
                    {analyzedArtifact.name}
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Period</span>
                      <span className="text-gray-200">{analyzedArtifact.period}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Dynasty</span>
                      <span className="text-gray-200">{analyzedArtifact.dynasty}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 uppercase font-bold tracking-wider flex items-center gap-1"><MapPin className="w-3 h-3" /> Location Discovered</span>
                      <span className="text-[#C9A84C] font-medium">{analyzedArtifact.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-300 leading-relaxed mb-8">
                    {analyzedArtifact.description}
                  </p>

                  <div className="flex flex-col gap-3">
                    <button className="w-full py-3 bg-[#1B6B93]/20 hover:bg-[#1B6B93]/40 border border-[#1B6B93] rounded-xl text-white font-medium flex justify-center items-center gap-2 transition-colors">
                      <Info className="w-4 h-4" /> Learn More
                    </button>
                    <div className="flex gap-3">
                      <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium flex justify-center items-center gap-2 transition-colors text-sm">
                        <Images className="w-4 h-4" /> Original State
                      </button>
                      <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium flex justify-center items-center gap-2 transition-colors text-sm">
                        <ExternalLink className="w-4 h-4" /> Compare
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-gray-800 rounded-3xl p-12 text-center w-full h-full"
                >
                  <Camera className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg">No artifact analyzed yet.</p>
                  <p className="text-sm">Point the camera and tap Identify.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Recently Identified Section */}
        <div className="border-t border-white/10 pt-12">
          <h3 className="text-2xl font-bold text-white mb-6">Recently Identified</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ARTIFACTS.slice(1).map((artifact) => (
              <div 
                key={artifact.id}
                onClick={() => handleSelectRecent(artifact)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C9A84C]/50 rounded-2xl p-5 cursor-pointer transition-all group"
              >
                <div className="h-32 bg-[#0A1628] rounded-xl mb-4 flex items-center justify-center border border-white/5 overflow-hidden relative">
                  <ScanLine className="w-8 h-8 text-[#1B6B93] opacity-30 group-hover:scale-110 transition-transform" />
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 rounded text-[10px] text-gray-400 font-mono">ID: {artifact.id}</div>
                </div>
                <h4 className="font-bold text-white mb-1 group-hover:text-[#C9A84C] transition-colors">{artifact.name}</h4>
                <p className="text-sm text-gray-500 line-clamp-1">{artifact.location}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
