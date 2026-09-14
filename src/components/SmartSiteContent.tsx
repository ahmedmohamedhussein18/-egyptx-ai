'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Scan, History, Cuboid, Globe, Eye, ScanLine, Clock, MapPin, Search } from 'lucide-react';

interface TimelineEvent {
  year: string;
  event: string;
}

interface SiteData {
  id: string;
  name: string;
  tagline: string;
  description: string;
  timeline: TimelineEvent[];
}

const SITES: SiteData[] = [
  {
    id: 'karnak',
    name: 'Temple of Karnak',
    tagline: 'The largest religious building ever constructed',
    description: 'The Karnak Temple Complex is a vast open-air museum and the largest religious site in the ancient world. Dedicated to the Theban triad of Amun, Mut, and Khonsu, it was developed over 2,000 years by successive pharaohs.',
    timeline: [
      { year: '2000 BCE', event: 'Construction begins during the Middle Kingdom under Senusret I.' },
      { year: '1500 BCE', event: 'Major expansions by Thutmose I and Hatshepsut.' },
      { year: '1290 BCE', event: 'The Great Hypostyle Hall is completed by Seti I and Ramesses II.' },
      { year: '323 BCE', event: 'Ptolemaic additions, including the Philip Arrhidaeus shrine.' }
    ]
  },
  {
    id: 'giza',
    name: 'Great Pyramid of Giza',
    tagline: 'The last surviving Wonder of the Ancient World',
    description: 'Built for the Pharaoh Khufu, the Great Pyramid was the tallest man-made structure in the world for over 3,800 years. It consists of an estimated 2.3 million stone blocks.',
    timeline: [
      { year: '2560 BCE', event: 'Construction is completed under the reign of Khufu.' },
      { year: '1303 CE', event: 'A massive earthquake loosens the outer casing stones.' },
      { year: '1880 CE', event: 'Flinders Petrie conducts the first scientific excavations and measurements.' }
    ]
  },
  {
    id: 'valley-kings',
    name: 'Valley of the Kings',
    tagline: 'The grand necropolis of the pharaohs',
    description: 'A royal burial ground situated on the west bank of the Nile, hiding over 60 tombs of pharaohs and powerful nobles from the New Kingdom, designed to thwart tomb robbers.',
    timeline: [
      { year: '1539 BCE', event: 'First royal burials begin (Thutmose I).' },
      { year: '1075 BCE', event: 'End of the New Kingdom; the valley is abandoned for royal burials.' },
      { year: '1922 CE', event: 'Howard Carter discovers the nearly intact tomb of Tutankhamun (KV62).' }
    ]
  },
  {
    id: 'abu-simbel',
    name: 'Abu Simbel',
    tagline: 'Colossal temples rescued from the Nile',
    description: 'Carved out of a mountainside during the reign of Ramesses II, these twin temples serve as a lasting monument to the king and his queen Nefertari, aligned perfectly with the sun.',
    timeline: [
      { year: '1244 BCE', event: 'Construction of the temples is completed.' },
      { year: '1813 CE', event: 'The temples are rediscovered by Swiss orientalist Jean-Louis Burckhardt.' },
      { year: '1968 CE', event: 'UNESCO relocation project saves the temples from Lake Nasser.' }
    ]
  },
  {
    id: 'luxor',
    name: 'Luxor Temple',
    tagline: 'The southern sanctuary of ancient Thebes',
    description: 'Unlike other temples in Thebes, Luxor Temple is not dedicated to a cult god or a deified version of the pharaoh in death, but to the rejuvenation of kingship and the royal Ka.',
    timeline: [
      { year: '1400 BCE', event: 'Construction started by Amenhotep III.' },
      { year: '1250 BCE', event: 'Ramesses II adds the great pylon and colossal statues.' },
      { year: '320 BCE', event: 'Alexander the Great rebuilds the sanctuary.' }
    ]
  }
];

type TabType = 'overview' | 'timeline' | '3d' | 'translation' | 'ar';

export default function SmartSiteContent() {
  const [selectedSiteId, setSelectedSiteId] = useState<string>(SITES[0].id);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [language, setLanguage] = useState('English');

  const selectedSite = SITES.find(s => s.id === selectedSiteId) || SITES[0];

  const handleSelectSite = (id: string) => {
    setSelectedSiteId(id);
    setScanComplete(false);
    setIsScanning(false);
    setActiveTab('overview');
  };

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-[#C9A84C] mb-4"
          >
            Smart Site Experience
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400"
          >
            Select a site and scan the code to reveal AI-powered insights.
          </motion.p>
        </div>

        {/* Site Selector */}
        <div className="flex overflow-x-auto pb-6 mb-12 gap-4 scrollbar-hide snap-x">
          {SITES.map((site) => (
            <button
              key={site.id}
              onClick={() => handleSelectSite(site.id)}
              className={`flex-none w-64 p-4 rounded-2xl border text-left transition-all snap-start ${
                selectedSiteId === site.id 
                  ? 'bg-[#C9A84C]/10 border-[#C9A84C] shadow-[0_0_20px_rgba(201,168,76,0.15)]' 
                  : 'bg-white/5 border-white/10 hover:border-[#C9A84C]/50'
              }`}
            >
              <h3 className={`font-semibold text-lg mb-1 ${selectedSiteId === site.id ? 'text-[#C9A84C]' : 'text-white'}`}>
                {site.name}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-2">{site.tagline}</p>
            </button>
          ))}
        </div>

        {/* Selected Site Header & Scan Area */}
        <div className="bg-white/5 backdrop-blur-lg border border-[#C9A84C]/20 rounded-3xl p-8 mb-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-full bg-[#1B6B93]/5 blur-[100px] pointer-events-none" />
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{selectedSite.name}</h2>
          <p className="text-[#C9A84C] text-lg mb-10">{selectedSite.tagline}</p>

          <AnimatePresence mode="wait">
            {!isScanning && !scanComplete && (
              <motion.div
                key="scan-btn"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex justify-center"
              >
                <button 
                  onClick={handleScan}
                  className="group relative flex flex-col items-center justify-center w-48 h-48 bg-[#0A1628] rounded-2xl border border-[#C9A84C]/30 hover:border-[#C9A84C] hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] transition-all cursor-pointer"
                >
                  <QrCode className="w-16 h-16 text-[#C9A84C] mb-4 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-lg">Scan QR Code</span>
                  {/* Decorative corners */}
                  <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#C9A84C]" />
                  <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#C9A84C]" />
                  <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#C9A84C]" />
                  <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#C9A84C]" />
                </button>
              </motion.div>
            )}

            {isScanning && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center"
              >
                <div className="relative w-48 h-48 bg-[#0A1628] rounded-2xl border border-[#C9A84C] flex items-center justify-center overflow-hidden shadow-[0_0_40px_rgba(201,168,76,0.4)]">
                  <QrCode className="w-16 h-16 text-[#C9A84C]/30" />
                  <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
                    className="absolute left-0 w-full h-1 bg-[#1B6B93] shadow-[0_0_15px_#1B6B93]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#1B6B93]/0 via-[#1B6B93]/10 to-[#1B6B93]/0" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* AI Heritage Guide Panel */}
        {scanComplete && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-lg border border-[#C9A84C]/20 rounded-3xl overflow-hidden"
          >
            <div className="p-6 bg-[#0A1628]/80 border-b border-[#C9A84C]/10 flex flex-wrap gap-2 md:gap-4">
              <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${activeTab === 'overview' ? 'bg-[#C9A84C] text-[#030712]' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}><ScanLine className="w-4 h-4" /> Overview</button>
              <button onClick={() => setActiveTab('timeline')} className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${activeTab === 'timeline' ? 'bg-[#C9A84C] text-[#030712]' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}><History className="w-4 h-4" /> Timeline</button>
              <button onClick={() => setActiveTab('3d')} className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${activeTab === '3d' ? 'bg-[#C9A84C] text-[#030712]' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}><Cuboid className="w-4 h-4" /> 3D Model</button>
              <button onClick={() => setActiveTab('translation')} className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${activeTab === 'translation' ? 'bg-[#C9A84C] text-[#030712]' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}><Globe className="w-4 h-4" /> Translation</button>
              <button onClick={() => setActiveTab('ar')} className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${activeTab === 'ar' ? 'bg-[#1B6B93] text-white border border-[#1B6B93]' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}><Eye className="w-4 h-4" /> AR View</button>
            </div>

            <div className="p-8">
              {activeTab === 'overview' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <h3 className="text-xl font-bold text-[#C9A84C]">What You&apos;re Looking At</h3>
                  <p className="text-gray-300 leading-relaxed text-lg">{selectedSite.description}</p>
                </motion.div>
              )}

              {activeTab === 'timeline' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <h3 className="text-xl font-bold text-[#C9A84C] mb-6">Historical Timeline</h3>
                  <div className="relative border-l-2 border-[#1B6B93]/30 pl-8 space-y-8 ml-4">
                    {selectedSite.timeline.map((item, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[41px] bg-[#030712] p-1 rounded-full">
                          <div className="w-4 h-4 bg-[#C9A84C] rounded-full shadow-[0_0_10px_#C9A84C]" />
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                          <span className="text-[#1B6B93] font-bold text-sm tracking-wider uppercase mb-1 block">{item.year}</span>
                          <p className="text-gray-200">{item.event}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === '3d' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-12">
                  <div className="w-64 h-64 border-2 border-dashed border-[#C9A84C]/30 rounded-2xl flex flex-col items-center justify-center bg-[#0A1628]/50 mb-6">
                    <Cuboid className="w-16 h-16 text-[#C9A84C] mb-4 opacity-50" />
                    <p className="text-gray-400 font-medium">Interactive 3D Preview</p>
                  </div>
                  <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors flex items-center gap-2">
                    <History className="w-4 h-4" /> Rotate Model
                  </button>
                </motion.div>
              )}

              {activeTab === 'translation' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="flex justify-between items-center bg-[#0A1628] p-4 rounded-xl border border-white/10">
                    <span className="text-gray-400">Language:</span>
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="bg-transparent text-[#C9A84C] font-semibold border-none outline-none cursor-pointer"
                    >
                      <option>English</option>
                      <option>عربي (Arabic)</option>
                      <option>Français (French)</option>
                      <option>Deutsch (German)</option>
                      <option>Español (Spanish)</option>
                    </select>
                  </div>
                  <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                    <h3 className="text-xl font-bold text-[#C9A84C] mb-4">What You&apos;re Looking At</h3>
                    <p className="text-gray-300 leading-relaxed text-lg">{selectedSite.description}</p>
                    {language !== 'English' && (
                      <p className="text-xs text-[#1B6B93] mt-4 flex items-center gap-1"><Globe className="w-3 h-3" /> AI Translation Active</p>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'ar' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-8">
                  <div className="relative w-full max-w-md aspect-[3/4] bg-gray-900 rounded-3xl overflow-hidden mb-6 border border-white/10">
                    {/* Simulated Camera Feed */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent" />
                    
                    {/* AR Brackets */}
                    <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-[#C9A84C]" />
                    <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-[#C9A84C]" />
                    <div className="absolute bottom-16 left-8 w-8 h-8 border-b-2 border-l-2 border-[#C9A84C]" />
                    <div className="absolute bottom-16 right-8 w-8 h-8 border-b-2 border-r-2 border-[#C9A84C]" />
                    
                    {/* AR Overlay Mock */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full">
                      <ScanLine className="w-12 h-12 text-[#1B6B93] mx-auto mb-4 opacity-50" />
                      <div className="inline-block bg-black/60 backdrop-blur px-4 py-2 rounded-lg border border-[#C9A84C]/50 text-sm">
                        <span className="text-[#C9A84C] font-bold">Detected:</span> {selectedSite.name}
                      </div>
                    </div>
                  </div>
                  
                  <button className="px-8 py-4 bg-[#1B6B93] hover:bg-[#1B6B93]/80 text-white rounded-xl font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(27,107,147,0.4)] transition-all hover:scale-105">
                    <Eye className="w-5 h-5" /> Launch AR Viewer
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
