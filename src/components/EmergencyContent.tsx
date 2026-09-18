'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, Phone, MapPin, Copy, CheckCircle2, 
  Map as MapIcon, Loader2, Hospital, ShieldAlert,
  Volume2
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { trackEvent } from '@/lib/analytics';

// Dynamically import the Leaflet map so it only runs on the client
const MapLeaflet = dynamic(() => import('@/components/MapLeaflet'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] flex items-center justify-center bg-[#0A1628] rounded-xl border border-white/10">
      <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
    </div>
  )
});

const EMERGENCY_NUMBERS = [
  { name_en: 'Ambulance', name_ar: 'الإسعاف', number: '123', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  { name_en: 'Police', name_ar: 'الشرطة', number: '122', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  { name_en: 'Tourist Police', name_ar: 'شرطة السياحة', number: '126', color: 'text-[#C9A84C]', bg: 'bg-[#C9A84C]/10', border: 'border-[#C9A84C]/30' },
  { name_en: 'Fire Department', name_ar: 'المطافئ', number: '180', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  { name_en: 'Traffic Police', name_ar: 'شرطة المرور', number: '128', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30' },
];

const PHRASES = [
  { en: 'I need a doctor.', ar: 'أحتاج إلى طبيب.', pron: 'Ahtaaj ilaa tabeeb.' },
  { en: 'Please call the police.', ar: 'يرجى الاتصال بالشرطة.', pron: 'Yurja al-ittisaal bish-shurta.' },
  { en: 'I am a tourist and I am lost.', ar: 'أنا سائح وقد ضللت طريقي.', pron: 'Ana saa-ih wa qad dalalt tareeqi.' },
  { en: 'Where is the nearest hospital?', ar: 'أين أقرب مستشفى؟', pron: 'Ayna aqrab mustashfa?' },
  { en: 'Help me, please.', ar: 'ساعدني من فضلك.', pron: 'Saa-idni min fadlak.' },
];

export default function EmergencyContent() {
  const [locationState, setLocationState] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    trackEvent('page_view');
  }, []);

  const requestLocation = () => {
    setLocationState('requesting');
    if (!navigator.geolocation) {
      setLocationState('denied');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationState('granted');
        trackEvent('emergency_location_granted');
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setLocationState('denied');
        trackEvent('emergency_location_denied');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const copyToClipboard = async () => {
    if (!coords) return;
    const text = `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackEvent('emergency_location_copied');
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-16 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-950/40 border-l-4 border-red-500 rounded-r-xl p-6 flex items-start gap-4"
        >
          <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-xl font-bold text-red-100 mb-1">Emergency Disclaimer</h2>
            <p className="text-red-200/80 text-sm leading-relaxed">
              EgyptX AI does not replace official emergency services. In case of an immediate life-threatening situation, use the official numbers below to contact local authorities directly.
            </p>
          </div>
        </motion.div>

        {/* Official Numbers Grid */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Phone className="w-6 h-6 text-[#C9A84C]" />
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Official Emergency Numbers</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {EMERGENCY_NUMBERS.map((num, idx) => (
              <motion.a
                key={num.number}
                href={`tel:${num.number}`}
                onClick={() => trackEvent('emergency_call_clicked', { service: num.name_en })}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex items-center justify-between p-5 rounded-2xl border backdrop-blur-sm transition-all hover:scale-[1.02] active:scale-95 ${num.bg} ${num.border}`}
              >
                <div>
                  <h3 className={`font-bold text-lg ${num.color}`}>{num.name_en}</h3>
                  <p className="text-gray-400 text-sm font-arabic mt-0.5">{num.name_ar}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-3xl font-bold ${num.color} tracking-wider`}>{num.number}</span>
                  <div className={`p-3 rounded-full bg-white/10 ${num.color}`}>
                    <Phone className="w-5 h-5 fill-current" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        {/* Find Nearby Help */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-6 h-6 text-[#1B6B93]" />
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Find Nearby Help</h2>
          </div>

          <div className="bg-[#0A1628]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8">
            <AnimatePresence mode="wait">
              {locationState === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  <MapIcon className="w-12 h-12 text-[#1B6B93] mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-bold text-white mb-2">Location Required</h3>
                  <p className="text-gray-400 text-sm max-w-md mx-auto mb-8">
                    To help you find nearby hospitals or police stations, and to provide coordinates to emergency dispatchers, we need access to your device&apos;s location.
                  </p>
                  <button
                    onClick={requestLocation}
                    className="px-8 py-4 bg-[#1B6B93] hover:bg-[#1B6B93]/80 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-[#1B6B93]/20"
                  >
                    Allow Location Access
                  </button>
                </motion.div>
              )}

              {locationState === 'requesting' && (
                <motion.div
                  key="requesting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <Loader2 className="w-10 h-10 text-[#C9A84C] animate-spin mx-auto mb-4" />
                  <p className="text-gray-400">Requesting location permissions...</p>
                </motion.div>
              )}

              {locationState === 'denied' && (
                <motion.div
                  key="denied"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8 bg-red-950/20 rounded-2xl border border-red-500/20"
                >
                  <MapPin className="w-10 h-10 text-red-400 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-bold text-red-200 mb-2">Location Access Denied</h3>
                  <p className="text-red-200/60 text-sm max-w-md mx-auto">
                    Location access is needed to show nearby help. You can still call emergency numbers directly using the buttons above.
                  </p>
                  <button
                    onClick={requestLocation}
                    className="mt-6 px-6 py-2 border border-red-500/50 text-red-400 rounded-lg text-sm hover:bg-red-500/10 transition-colors"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}

              {locationState === 'granted' && coords && (
                <motion.div
                  key="granted"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Coordinates Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white/5 border border-[#C9A84C]/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#C9A84C]/20 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-[#C9A84C]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-0.5">Your Current Coordinates</p>
                        <p className="font-mono text-white tracking-wide">
                          {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="w-full sm:w-auto px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      {copied ? (
                        <><CheckCircle2 className="w-4 h-4 text-green-400" /> <span className="text-green-400">Copied!</span></>
                      ) : (
                        <><Copy className="w-4 h-4" /> Copy Location</>
                      )}
                    </button>
                  </div>

                  {/* Placeholder for nearby facilities */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <Hospital className="w-5 h-5 text-[#1B6B93]" />
                        <h4 className="font-bold text-white">Nearest Hospitals</h4>
                      </div>
                      <p className="text-sm text-gray-400 italic">
                        Nearby facility search requires a connected places data source — not yet configured.
                      </p>
                    </div>
                    <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <ShieldAlert className="w-5 h-5 text-[#1B6B93]" />
                        <h4 className="font-bold text-white">Nearest Police Station</h4>
                      </div>
                      <p className="text-sm text-gray-400 italic">
                        Nearby facility search requires a connected places data source — not yet configured.
                      </p>
                    </div>
                  </div>

                  {/* Map View */}
                  <div className="w-full rounded-2xl overflow-hidden border border-white/10 relative">
                    <MapLeaflet 
                      attractions={[{
                        id: 'user-location',
                        name_en: 'Your Location',
                        name_ar: 'موقعك',
                        city: 'Current Coordinates',
                        category: 'current_location',
                        latitude: coords.lat,
                        longitude: coords.lng
                      }]}
                    />
                    <div className="absolute top-4 left-4 z-[400] bg-[#0A1628]/90 backdrop-blur px-3 py-1.5 rounded-lg border border-[#C9A84C]/50 text-xs font-bold text-[#C9A84C] shadow-lg">
                      Location locked
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Phrasebook */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Volume2 className="w-6 h-6 text-[#E2C779]" />
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Emergency Phrases</h2>
          </div>
          
          <div className="bg-[#0A1628]/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden">
            <div className="p-4 bg-white/5 border-b border-white/10 text-xs text-gray-400 uppercase tracking-widest font-semibold text-center">
              Static Reference • English to Arabic Translation
            </div>
            <div className="divide-y divide-white/5">
              {PHRASES.map((phrase, idx) => (
                <div key={idx} className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                  <div className="flex-1">
                    <p className="text-lg font-medium text-white mb-1">{phrase.en}</p>
                    <p className="text-sm text-gray-500 italic">Pronounced: {phrase.pron}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-arabic text-[#C9A84C]" dir="rtl">{phrase.ar}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
