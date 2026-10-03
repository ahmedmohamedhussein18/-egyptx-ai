'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, MapPin, Languages, Trash2, Sparkles, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface SavedTrip {
  destination?: string;
  title?: string;
  name?: string;
  [key: string]: any;
}

interface TranslationEntry {
  input: string;
  translation: string;
  timestamp?: string;
}

export default function MemoryCoreContent() {
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [translationHistory, setTranslationHistory] = useState<TranslationEntry[]>([]);
  const [vrVisited, setVrVisited] = useState<string[]>([]);
  const [cleared, setCleared] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      setSavedTrips(JSON.parse(localStorage.getItem('egyptx-saved-trips') || '[]'));
      setTranslationHistory(JSON.parse(localStorage.getItem('egyptx-translation-history') || '[]'));
      setVrVisited(JSON.parse(localStorage.getItem('egyptx-vr-visited') || '[]'));
    } catch (error) {
      console.error('Failed to parse localStorage data', error);
    }
  }, []);

  const handleClearMemory = () => {
    localStorage.removeItem('egyptx-saved-trips');
    localStorage.removeItem('egyptx-translation-history');
    localStorage.removeItem('egyptx-vr-visited');
    
    setSavedTrips([]);
    setTranslationHistory([]);
    setVrVisited([]);
    
    setCleared(true);
    setTimeout(() => setCleared(false), 3000);
  };

  if (!mounted) return null; // Prevent hydration errors

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 p-6 md:p-12 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0A1628]/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-12 text-center md:text-left flex flex-col md:flex-row items-center gap-4">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm inline-flex">
            <Brain className="w-10 h-10 text-[#C9A84C]" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#C9A84C] to-yellow-200 bg-clip-text text-transparent">
              EgyptX Memory Core
            </h1>
            <p className="text-slate-400 mt-2 text-lg">Your AI remembers everything</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Saved Itineraries */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-[#C9A84C]/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(201,168,76,0.05)] hover:shadow-[0_0_40px_rgba(201,168,76,0.1)] transition-all flex flex-col h-full"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3 text-[#C9A84C]">
                <MapPin className="w-6 h-6" />
                <h2 className="text-xl font-semibold text-white">Saved Itineraries</h2>
              </div>
              <span className="bg-[#C9A84C]/20 text-[#C9A84C] text-xs font-bold px-2.5 py-1 rounded-full">
                {savedTrips.length}
              </span>
            </div>
            
            <div className="flex-1">
              {savedTrips.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8">
                  <p className="text-slate-400">Nothing saved yet. Start exploring!</p>
                  <Link href="/planner" className="text-sm text-[#C9A84C] hover:text-yellow-300 transition-colors underline underline-offset-4">
                    Go to Planner
                  </Link>
                </div>
              ) : (
                <ul className="space-y-3">
                  {savedTrips.map((trip, idx) => (
                    <li key={idx} className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                      <span className="font-medium text-slate-200 truncate">
                        {trip.destination || trip.title || trip.name || 'Unnamed Trip'}
                      </span>
                      <div className="w-2 h-2 rounded-full bg-[#C9A84C] shadow-[0_0_8px_#C9A84C]" />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>

          {/* Card 2: Translation History */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl border border-[#1B6B93]/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(27,107,147,0.05)] hover:shadow-[0_0_40px_rgba(27,107,147,0.1)] transition-all flex flex-col h-full"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3 text-[#1B6B93]">
                <Languages className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Translation History</h2>
              </div>
              <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-2.5 py-1 rounded-full">
                {translationHistory.length}
              </span>
            </div>

            <div className="flex-1">
              {translationHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8">
                  <p className="text-slate-400">No translations yet.</p>
                  <Link href="/slang" className="text-sm text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4">
                    Try Translator
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {translationHistory.slice(0, 10).map((entry, idx) => (
                    <li key={idx} className="p-3 bg-black/20 rounded-xl border border-white/5 text-sm">
                      <div className="text-slate-400 mb-1 line-clamp-1">{entry.input}</div>
                      <div className="text-[#C9A84C] font-medium line-clamp-2">→ {entry.translation}</div>
                      {entry.timestamp && <div className="text-[10px] text-slate-500 mt-2 text-right">{new Date(entry.timestamp).toLocaleDateString()}</div>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>

          {/* Card 3: VR Experiences */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(168,85,247,0.05)] hover:shadow-[0_0_40px_rgba(168,85,247,0.1)] transition-all flex flex-col h-full"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3 text-purple-400">
                <Sparkles className="w-6 h-6" />
                <h2 className="text-xl font-semibold text-white">VR Experiences</h2>
              </div>
              <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-2.5 py-1 rounded-full">
                {vrVisited.length}
              </span>
            </div>

            <div className="flex-1">
              {vrVisited.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8">
                  <p className="text-slate-400">No VR locations visited.</p>
                  <Link href="/vr-egypt" className="text-sm text-purple-400 hover:text-purple-300 transition-colors underline underline-offset-4">
                    Explore VR
                  </Link>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {vrVisited.map((location, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-200 text-sm rounded-full">
                      {location}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Clear Memory Action */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-md mx-auto"
        >
          <button
            onClick={handleClearMemory}
            disabled={cleared}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl border font-semibold transition-all ${
              cleared 
                ? 'bg-green-500/10 border-green-500/50 text-green-400'
                : 'bg-red-500/5 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50'
            }`}
          >
            {cleared ? (
              <>Memory cleared!</>
            ) : (
              <>
                <Trash2 className="w-5 h-5" />
                Clear All Memory
              </>
            )}
          </button>
          
          <div className="flex items-center gap-2 mt-4 text-xs text-slate-500 justify-center">
            <AlertTriangle className="w-4 h-4" />
            <p>This action cannot be undone and will erase data from this browser.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
