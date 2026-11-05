'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Navigation,
  MapPin,
  Train,
  Car,
  Footprints,
  Clock,
  ArrowRight,
  Search,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  LocateFixed,
  Loader2,
  Compass,
  Building,
  RotateCw
} from 'lucide-react';

interface TransitDetails {
  lineName: string;
  lineShortName: string;
  vehicleType: string;
  departureStop: string;
  arrivalStop: string;
  numStops: number;
  headsign: string;
  lineColor?: string;
}

interface TransitStep {
  instruction: string;
  distance: string;
  duration: string;
  travelMode: string;
  transitDetails?: TransitDetails;
}

interface ModeRouteResult {
  available: boolean;
  distance?: string;
  duration?: string;
  durationValue?: number;
  summary?: string;
  departureTime?: string;
  arrivalTime?: string;
  steps?: TransitStep[];
  error?: string;
}

interface NavigationResponse {
  success: boolean;
  origin: { lat: number; lng: number };
  destination: string;
  modes: {
    transit: ModeRouteResult;
    driving: ModeRouteResult;
    walking: ModeRouteResult;
  };
  googleMapsUrl: string;
}

const QUICK_HOTELS = [
  'The Nile Ritz-Carlton, Cairo',
  'Marriott Mena House, Giza',
  'Sofitel Cairo Nile El Gezirah',
  'Four Seasons Hotel Cairo at Nile Plaza',
  'Steigenberger Hotel El Tahrir'
];

export default function SmartNavigator() {
  // Geolocation state
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Search state
  const [destination, setDestination] = useState('');
  const [selectedMode, setSelectedMode] = useState<'transit' | 'driving' | 'walking'>('transit');

  // API query state
  const [isSearching, setIsSearching] = useState(false);
  const [navData, setNavData] = useState<NavigationResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Detect current GPS position
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setGeoLoading(false);
      },
      (err) => {
        setGeoLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setGeoError('Location permission denied. Please allow location access in your browser settings.');
            break;
          case err.POSITION_UNAVAILABLE:
            setGeoError('Location information is unavailable. Try again in an open area.');
            break;
          case err.TIMEOUT:
            setGeoError('Location request timed out. Retrying...');
            break;
          default:
            setGeoError('Could not determine your location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0
      }
    );
  };

  // Auto-detect on mount
  useEffect(() => {
    detectLocation();
  }, []);

  // Handle route submission
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!destination.trim()) return;

    if (!coords) {
      setErrorMsg('Please allow GPS location access to calculate routes from where you are right now.');
      return;
    }

    setIsSearching(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/navigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: coords,
          destination: destination.trim(),
          language: 'en'
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch navigation routes.');
      }

      setNavData(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with navigation service.');
    } finally {
      setIsSearching(false);
    }
  };

  // Build direct navigation URL with active mode
  const getActiveGoogleMapsUrl = () => {
    if (!coords || !destination.trim()) return '#';
    const modeParam = selectedMode === 'driving' ? 'driving' : selectedMode === 'walking' ? 'walking' : 'transit';
    return `https://www.google.com/maps/dir/?api=1&origin=${coords.lat},${coords.lng}&destination=${encodeURIComponent(destination.trim())}&travelmode=${modeParam}`;
  };

  const activeModeData = navData?.modes[selectedMode];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-3 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
          <Compass className="w-4 h-4 text-[#D4AF37] animate-spin" style={{ animationDuration: '10s' }} />
          <span>Real-Time Smart Navigator</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Never Get Lost in Cairo & Giza
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Instant real-time Google Maps routing from your exact live position. Navigate metro lines, stations, and streets directly to your hotel.
        </p>
      </div>

      {/* Main Container Card */}
      <div className="bg-[#0B0F19] border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.85)] relative overflow-hidden backdrop-blur-xl">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#1B6B93]/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-10 left-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none" />

        {/* 1. Geolocation Status Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#131A2A] border border-white/5 mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${coords ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'}`}>
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Your Current Position</p>
              {geoLoading ? (
                <p className="text-xs text-amber-300 flex items-center gap-1.5 font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Acquiring high-precision GPS coordinates...
                </p>
              ) : coords ? (
                <p className="text-xs text-emerald-400 font-mono font-medium">
                  {coords.lat.toFixed(5)}° N, {coords.lng.toFixed(5)}° E (GPS Verified)
                </p>
              ) : (
                <p className="text-xs text-rose-400 font-medium">
                  {geoError || 'GPS location not detected yet.'}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={detectLocation}
            disabled={geoLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            <LocateFixed className={`w-3.5 h-3.5 text-[#D4AF37] ${geoLoading ? 'animate-spin' : ''}`} />
            <span>{coords ? 'Refresh GPS' : 'Enable GPS'}</span>
          </button>
        </div>

        {/* 2. Search Form */}
        <form onSubmit={handleSearch} className="relative z-10 space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#E2CB85] mb-2 font-mono">
              Where do you want to go? (Hotel, Station, or Landmark)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. The Nile Ritz-Carlton, Cairo or Marriott Mena House"
                className="w-full pl-11 pr-32 py-3.5 rounded-2xl bg-[#131A2A] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={isSearching || !destination.trim()}
                className="absolute right-2 top-2 bottom-2 px-5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-stone-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Routing...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Find Route</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Hotel Recommendation Pills */}
          <div>
            <p className="text-[11px] font-mono uppercase text-slate-400 mb-2 flex items-center gap-1">
              <Building className="w-3 h-3 text-[#D4AF37]" />
              <span>Popular Tourist Hotels in Cairo & Giza:</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_HOTELS.map((hotel) => (
                <button
                  key={hotel}
                  type="button"
                  onClick={() => {
                    setDestination(hotel);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors border ${
                    destination === hotel
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F5E6B8]'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {hotel}
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Error notification banner */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs mb-6 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">{errorMsg}</p>
              {coords && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${coords.lat},${coords.lng}&destination=${encodeURIComponent(destination)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-amber-300 hover:underline pt-1 font-bold"
                >
                  Open destination directly in Google Maps <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* 3. Navigation Results Section */}
        {navData && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 pt-4 border-t border-white/10"
          >
            {/* Resolved Destination Title */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block mb-0.5">
                  Route Calculated
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>{navData.destination}</span>
                </h3>
              </div>

              {/* Direct Primary Action: Navigate with Google Maps */}
              <a
                href={getActiveGoogleMapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E2CB85] text-stone-950 font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95"
              >
                <Navigation className="w-4 h-4 fill-stone-950" />
                <span>Navigate with Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Travel Mode Selector Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Transit (Metro / Bus) Card */}
              <button
                type="button"
                onClick={() => setSelectedMode('transit')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedMode === 'transit'
                    ? 'bg-[#15233C] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                    : 'bg-[#131A2A] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400">
                      <Train className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Metro / Transit</span>
                  </div>
                  {selectedMode === 'transit' && <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />}
                </div>
                {navData.modes.transit.available ? (
                  <div>
                    <p className="text-xl font-extrabold text-white">{navData.modes.transit.duration}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{navData.modes.transit.distance}</p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No direct metro line found</p>
                )}
              </button>

              {/* Driving (Taxi / Uber) Card */}
              <button
                type="button"
                onClick={() => setSelectedMode('driving')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedMode === 'driving'
                    ? 'bg-[#15233C] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                    : 'bg-[#131A2A] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
                      <Car className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Taxi / Car</span>
                  </div>
                  {selectedMode === 'driving' && <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />}
                </div>
                {navData.modes.driving.available ? (
                  <div>
                    <p className="text-xl font-extrabold text-white">{navData.modes.driving.duration}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{navData.modes.driving.distance}</p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Driving info unavailable</p>
                )}
              </button>

              {/* Walking Card */}
              <button
                type="button"
                onClick={() => setSelectedMode('walking')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedMode === 'walking'
                    ? 'bg-[#15233C] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                    : 'bg-[#131A2A] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
                      <Footprints className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Walking</span>
                  </div>
                  {selectedMode === 'walking' && <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />}
                </div>
                {navData.modes.walking.available ? (
                  <div>
                    <p className="text-xl font-extrabold text-white">{navData.modes.walking.duration}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{navData.modes.walking.distance}</p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Too far to walk</p>
                )}
              </button>
            </div>

            {/* Step-by-Step Transit Instructions */}
            <div className="p-5 rounded-2xl bg-[#131A2A] border border-white/5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    {selectedMode === 'transit' ? 'Metro & Public Transit Route' : selectedMode === 'driving' ? 'Driving Directions' : 'Walking Route'}
                  </span>
                </div>
                {activeModeData?.departureTime && activeModeData?.arrivalTime && (
                  <span className="text-xs font-mono text-emerald-400">
                    Depart {activeModeData.departureTime} · Arrive {activeModeData.arrivalTime}
                  </span>
                )}
              </div>

              {activeModeData?.steps && activeModeData.steps.length > 0 ? (
                <div className="space-y-3">
                  {activeModeData.steps.map((step, idx) => {
                    const isTransit = step.travelMode === 'TRANSIT';
                    const td = step.transitDetails;

                    return (
                      <div key={idx} className="flex items-start gap-3 text-xs">
                        <div className="shrink-0 w-6 h-6 rounded-full bg-white/10 text-white font-mono flex items-center justify-center text-[10px] font-bold mt-0.5">
                          {idx + 1}
                        </div>

                        <div className="flex-1 space-y-1">
                          {isTransit && td ? (
                            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 space-y-2">
                              <div className="flex items-center gap-2">
                                <Train className="w-4 h-4 text-blue-400 shrink-0" />
                                <span className="font-bold text-blue-300 text-sm">
                                  {td.lineName || td.lineShortName || 'Metro Line'} {td.headsign ? `towards ${td.headsign}` : ''}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                                <div>
                                  <span className="text-slate-400 block font-mono text-[10px]">Board at:</span>
                                  <span className="font-semibold text-white">{td.departureStop}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block font-mono text-[10px]">Get off at:</span>
                                  <span className="font-semibold text-white">{td.arrivalStop} ({td.numStops} {td.numStops === 1 ? 'stop' : 'stops'})</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between text-slate-300">
                              <p className="leading-relaxed">{step.instruction}</p>
                              {step.distance && (
                                <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">
                                  {step.distance} ({step.duration})
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  {activeModeData?.error || 'Route steps unavailable for this mode.'}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
