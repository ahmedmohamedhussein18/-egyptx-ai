'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Scan, History, Cuboid, Globe, Eye, ScanLine, X, Loader2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { trackEvent } from '@/lib/analytics';

type TabType = 'overview' | 'timeline' | '3d' | 'translation' | 'ar';

function WeatherBadge({ lat, lon }: { lat: number, lon: number }) {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    if (!lat || !lon) return;
    fetch(`/api/weather?lat=${lat}&lon=${lon}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setWeather(data);
        }
      })
      .catch(console.error);
  }, [lat, lon]);

  if (!weather) return null;

  return (
    <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur rounded-full px-4 py-1.5 border border-[#C9A84C]/30 shadow-lg mb-6">
      <img src={`https://openweathermap.org/img/wn/${weather.icon}.png`} alt={weather.description} className="w-6 h-6" />
      <span className="text-white text-sm font-bold">{weather.temperature}°C</span>
      <span className="text-gray-300 text-xs capitalize">{weather.description}</span>
    </div>
  );
}

export default function SmartSiteContent() {
  const [attractions, setAttractions] = useState<any[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // QR Modal State
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);

  useEffect(() => {
    trackEvent('page_view');
    
    async function fetchSites() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('attractions')
          .select('*')
          .eq('verified', true)
          .limit(10); // fetch some top attractions

        if (error) throw error;
        
        if (data && data.length > 0) {
          setAttractions(data);
          setSelectedSiteId(data[0].id);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch attractions');
      } finally {
        setLoading(false);
      }
    }
    fetchSites();
  }, []);

  const selectedSite = attractions.find(s => s.id === selectedSiteId) || attractions[0];

  const handleSelectSite = (id: string) => {
    setSelectedSiteId(id);
    setScanComplete(false);
    setIsScanning(false);
    setActiveTab('overview');
    
    const site = attractions.find(s => s.id === id);
    if (site) {
      trackEvent('attraction_view', { attraction_id: id, governorate_id: site.governorate_id });
    }
  };

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 1800);
  };

  const handleViewQr = async () => {
    if (!selectedSite) return;
    setShowQrModal(true);
    setQrLoading(true);
    setQrCodeData(null);
    try {
      const res = await fetch(`/api/qr/generate?attractionId=${selectedSite.id}`);
      const data = await res.json();
      if (res.ok) {
        setQrCodeData(data.qrCode);
      } else {
        console.error('Failed to generate QR:', data.error);
      }
    } catch (err) {
      console.error('Error fetching QR:', err);
    } finally {
      setQrLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center text-[#C9A84C]">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p>Loading Smart Sites...</p>
      </div>
    );
  }

  if (error || attractions.length === 0) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center text-red-500">
        <AlertCircle className="w-10 h-10 mb-4" />
        <p>{error || 'No verified attractions found.'}</p>
      </div>
    );
  }

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
          {attractions.map((site) => (
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
                {site.name_en}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-2">{site.city || site.category}</p>
            </button>
          ))}
        </div>

        {/* Selected Site Header & Scan Area */}
        <div className="bg-white/5 backdrop-blur-lg border border-[#C9A84C]/20 rounded-3xl p-8 mb-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-full bg-[#1B6B93]/5 blur-[100px] pointer-events-none" />
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{selectedSite.name_en}</h2>
          <p className="text-[#C9A84C] text-lg mb-3">{selectedSite.city || selectedSite.category}</p>
          
          {selectedSite.latitude && selectedSite.longitude && (
            <WeatherBadge lat={selectedSite.latitude} lon={selectedSite.longitude} />
          )}

          <div className="flex justify-center mb-10">
            <button 
              onClick={handleViewQr}
              className="px-6 py-2 border border-[#C9A84C]/50 text-[#C9A84C] rounded-lg hover:bg-[#C9A84C]/10 transition-colors text-sm font-semibold flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" /> View Site QR Code
            </button>
          </div>

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
                  <Scan className="w-16 h-16 text-[#C9A84C] mb-4 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-lg">Simulate Scan</span>
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
                  <Scan className="w-16 h-16 text-[#C9A84C]/30" />
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
              <button onClick={() => setActiveTab('3d')} className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${activeTab === '3d' ? 'bg-[#C9A84C] text-[#030712]' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}><Cuboid className="w-4 h-4" /> 3D Model</button>
              <button onClick={() => setActiveTab('translation')} className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${activeTab === 'translation' ? 'bg-[#C9A84C] text-[#030712]' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}><Globe className="w-4 h-4" /> Translation</button>
              <button onClick={() => setActiveTab('ar')} className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${activeTab === 'ar' ? 'bg-[#1B6B93] text-white border border-[#1B6B93]' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}><Eye className="w-4 h-4" /> AR View</button>
            </div>

            <div className="p-8">
              {activeTab === 'overview' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <h3 className="text-xl font-bold text-[#C9A84C]">What You&apos;re Looking At</h3>
                  <p className="text-gray-300 leading-relaxed text-lg">{selectedSite.description_en || 'Information is currently being updated for this location.'}</p>
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
                    <p className="text-gray-300 leading-relaxed text-lg">{selectedSite.description_en || 'Information is currently being updated for this location.'}</p>
                    {language !== 'English' && (
                      <p className="text-xs text-[#1B6B93] mt-4 flex items-center gap-1"><Globe className="w-3 h-3" /> AI Translation Active</p>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'ar' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-8">
                  <div className="relative w-full max-w-md aspect-[3/4] bg-gray-900 rounded-3xl overflow-hidden mb-6 border border-white/10">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent" />
                    
                    <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-[#C9A84C]" />
                    <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-[#C9A84C]" />
                    <div className="absolute bottom-16 left-8 w-8 h-8 border-b-2 border-l-2 border-[#C9A84C]" />
                    <div className="absolute bottom-16 right-8 w-8 h-8 border-b-2 border-r-2 border-[#C9A84C]" />
                    
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full">
                      <ScanLine className="w-12 h-12 text-[#1B6B93] mx-auto mb-4 opacity-50" />
                      <div className="inline-block bg-black/60 backdrop-blur px-4 py-2 rounded-lg border border-[#C9A84C]/50 text-sm">
                        <span className="text-[#C9A84C] font-bold">Detected:</span> {selectedSite.name_en}
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

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQrModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0A1628] border border-[#C9A84C]/30 rounded-3xl p-8 max-w-sm w-full relative shadow-2xl"
            >
              <button
                onClick={() => setShowQrModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-1">Check In</h3>
                <p className="text-[#C9A84C] text-sm mb-6 font-semibold">{selectedSite?.name_en}</p>

                <div className="bg-white p-4 rounded-xl inline-block mx-auto mb-6 shadow-[0_0_30px_rgba(201,168,76,0.2)]">
                  {qrLoading ? (
                    <div className="w-48 h-48 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
                    </div>
                  ) : qrCodeData ? (
                    <img src={qrCodeData} alt="Check-in QR Code" className="w-48 h-48" />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center text-red-500">
                      Failed to load
                    </div>
                  )}
                </div>

                <p className="text-gray-400 text-sm">
                  Scan this QR code with your mobile device when you arrive at the physical site to collect your digital passport stamp.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
