'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Compass,
  MapPin,
  Clock,
  Landmark,
  Heart,
  Globe,
  Maximize2,
  X,
  Share2,
  Check,
  ShieldCheck,
  RotateCw,
  Loader2,
  ExternalLink,
} from 'lucide-react';

import { ArtifactItem, MonumentData, MONUMENTS, getMonumentById } from '@/lib/monuments';

const LANGUAGE_PILLS = [
  { code: 'ar', label: 'العربية', flag: '🇪🇬' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
];

export default function VrTourDetailContent({ id }: { id: string }) {
  const monument = getMonumentById(id);

  // States
  const [selectedLang, setSelectedLang] = useState('en');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(1428);
  const [isVrModalOpen, setIsVrModalOpen] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioBlobUrlRef = useRef<string | null>(null);

  // Load favorite state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const favs = JSON.parse(localStorage.getItem('egyptx-vr-favorites') || '[]');
        if (favs.includes(monument.id.toString())) {
          setIsFavorited(true);
        }
      } catch {
        /* ignore */
      }
    }
  }, [monument.id]);

  // Handle Favorite Toggle
  const toggleFavorite = () => {
    const nextState = !isFavorited;
    setIsFavorited(nextState);
    setFavoriteCount((prev) => (nextState ? prev + 1 : prev - 1));

    if (typeof window !== 'undefined') {
      try {
        const favs = JSON.parse(localStorage.getItem('egyptx-vr-favorites') || '[]');
        const key = monument.id.toString();
        let updated: string[];
        if (nextState) {
          updated = Array.from(new Set([...favs, key]));
        } else {
          updated = favs.filter((f: string) => f !== key);
        }
        localStorage.setItem('egyptx-vr-favorites', JSON.stringify(updated));
      } catch {
        /* ignore */
      }
    }
  };

  // Stop Audio helper
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (audioBlobUrlRef.current) {
      URL.revokeObjectURL(audioBlobUrlRef.current);
      audioBlobUrlRef.current = null;
    }
    setIsPlayingAudio(false);
    setIsAudioLoading(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  // Play ElevenLabs Audio Guide via /api/tts
  const handlePlayAudio = async () => {
    if (isPlayingAudio) {
      stopAudio();
      return;
    }

    stopAudio();
    setIsAudioLoading(true);
    setAudioError(null);

    const textToSpeak =
      monument.narrations[selectedLang] ||
      monument.narrations['en'] ||
      monument.description;

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSpeak,
          voiceId: 'female', // Sarah / Multilingual v2
        }),
      });

      if (!res.ok) {
        let errMessage = 'Voice generation failed. Please try again.';
        try {
          const errData = await res.json();
          if (errData?.error) errMessage = errData.error;
        } catch {
          /* ignore */
        }
        throw new Error(errMessage);
      }

      const audioBlob = await res.blob();
      if (!audioBlob || audioBlob.size === 0) {
        throw new Error('Received empty audio stream.');
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      audioBlobUrlRef.current = audioUrl;

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setIsAudioLoading(false);
        setIsPlayingAudio(true);
      };

      audio.onended = () => {
        stopAudio();
      };

      audio.onerror = () => {
        stopAudio();
        setAudioError('Audio playback failed.');
      };

      await audio.play();
    } catch (err: any) {
      console.warn('ElevenLabs tour audio error:', err);
      setIsAudioLoading(false);
      setIsPlayingAudio(false);
      setAudioError(err?.message || 'ElevenLabs audio unavailable.');
    }
  };

  // Switch narration language
  const handleSelectLanguage = (langCode: string) => {
    setSelectedLang(langCode);
    if (isPlayingAudio) {
      stopAudio();
    }
  };

  // Copy share link
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-20 relative overflow-hidden font-sans select-none">
      {/* ── Background Atmospheric Lighting ────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-[#C9A84C]/5 rounded-full blur-[160px]" />
        <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-[#1B6B93]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-1/3 w-[600px] h-[400px] bg-[#C9A84C]/5 rounded-full blur-[180px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── 1. HERO & BREADCRUMB ────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <Link
              href="/vr-egypt"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-[#C9A84C]/15 border border-white/10 hover:border-[#C9A84C]/60 text-xs sm:text-sm font-semibold text-white/80 hover:text-[#E2CB85] transition-all duration-300 drop-shadow-md group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>← Back to Tours</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white/70 hover:text-white transition-colors"
                title="Share Tour"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
              </button>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/40 text-[#E2CB85] text-xs font-mono font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9A84C]" />
                UNESCO Certified
              </span>
            </div>
          </div>

          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold tracking-wider uppercase text-[#C9A84C]">
              {monument.era}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#1B6B93]/20 border border-[#1B6B93]/50 text-[11px] font-semibold tracking-wider uppercase text-cyan-300">
              {monument.siteType}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-[11px] font-semibold tracking-wider uppercase text-emerald-300">
              Interactive 360° Portal
            </span>
          </div>

          {/* Monument Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E2CB85] to-[#C9A84C] drop-shadow-[0_0_35px_rgba(201,168,76,0.35)] leading-tight mb-2">
            {monument.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/60">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#C9A84C]" />
              <span className="font-medium text-white/90">{monument.city}, {monument.governorate}</span>
            </div>
            <span className="text-white/30">•</span>
            <div className="flex items-center gap-1.5 font-mono">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>{monument.coordinates}</span>
            </div>
            <span className="text-white/30">•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>{monument.duration} Recommended</span>
            </div>
          </div>
        </div>

        {/* ── 2. AUDIO GUIDE BAR (ElevenLabs HD Voice) ───────────────────── */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0B1120]/90 via-[#0B1120]/70 to-[#0B1120]/90 border border-[#C9A84C]/30 shadow-[0_0_30px_rgba(201,168,76,0.1)] backdrop-blur-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left: Info & ElevenLabs badge */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#1B6B93] p-[1.5px] shadow-[0_0_15px_rgba(201,168,76,0.4)] shrink-0">
                <div className="w-full h-full bg-[#0A1628] rounded-[10px] flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-[#C9A84C]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-white">
                    Historical Audio Guide
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#C9A84C]/20 border border-[#C9A84C]/50 text-[#E2CB85]">
                    <Sparkles className="w-2.5 h-2.5 text-[#C9A84C]" />
                    ElevenLabs HD Voice
                  </span>
                </div>
                <p className="text-xs text-white/60 mt-0.5">
                  Listen to authentic historical narration in your preferred language
                </p>
              </div>
            </div>

            {/* Right: Language Selection Pills & Play Button */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-full p-1 overflow-x-auto">
                {LANGUAGE_PILLS.map((lang) => {
                  const active = selectedLang === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelectLanguage(lang.code)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer whitespace-nowrap ${
                        active
                          ? 'bg-[#C9A84C] text-[#0A1628] shadow-[0_0_12px_rgba(201,168,76,0.5)] font-bold'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Play / Pause Action Button */}
              <button
                type="button"
                onClick={handlePlayAudio}
                disabled={isAudioLoading}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 shadow-lg cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-red-500/25 border border-red-500 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse'
                    : isAudioLoading
                    ? 'bg-white/10 border border-white/20 text-white/50 cursor-wait'
                    : 'bg-gradient-to-r from-[#C9A84C] via-[#E2CB85] to-[#C9A84C] text-[#0A1628] hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(201,168,76,0.4)] hover:shadow-[0_0_35px_rgba(201,168,76,0.6)]'
                }`}
              >
                {isAudioLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#C9A84C]" />
                    <span>Synthesizing Voice...</span>
                  </>
                ) : isPlayingAudio ? (
                  <>
                    <Pause className="w-4 h-4 text-red-400" />
                    <span>Pause Narration</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current text-[#0A1628]" />
                    <span>Play Audio Guide</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Active Audio Narration Snippet */}
          {isPlayingAudio && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/80"
            >
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5 items-end h-3.5">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-[#C9A84C] rounded-full"
                      animate={{ height: ['4px', `${8 + (i % 3) * 4}px`, '4px'] }}
                      transition={{ duration: 0.4 + i * 0.1, repeat: Infinity }}
                    />
                  ))}
                </div>
                <p className="italic text-white/90 line-clamp-1">
                  &ldquo;{monument.narrations[selectedLang] || monument.description}&rdquo;
                </p>
              </div>
              <button
                onClick={stopAudio}
                className="text-[11px] text-white/50 hover:text-white underline ml-2 shrink-0"
              >
                Stop
              </button>
            </motion.div>
          )}

          {audioError && (
            <p className="text-xs text-amber-400 mt-2 font-medium">
              ⚠️ {audioError}
            </p>
          )}
        </div>

        {/* ── 3. LIVE CINEMATIC VIDEO PREVIEW PLAYER ─────────────────────── */}
        <div className="mb-12">
          <div className="relative aspect-video lg:aspect-[16/8] w-full rounded-3xl overflow-hidden border border-white/15 shadow-[0_0_70px_rgba(0,0,0,0.9)] bg-black group">
            {/* Live Looping Video Background (No static poster) */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
            >
              <source src={monument.videoSrc || '/bg-slang.mp4'} type="video/mp4" />
              <source src="/bg-slang.mp4" type="video/mp4" />
            </video>

            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-black/35 to-black/30 pointer-events-none" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/70 pointer-events-none" />

            {/* Top Bar on Preview */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between z-10 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-mono text-white/90">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Video Preview
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#C9A84C]/40 text-xs font-mono text-[#E2CB85]">
                <Globe className="w-3.5 h-3.5 text-[#C9A84C]" />
                360° Photogrammetry
              </span>
            </div>

            {/* Central Glowing Gold Play Button Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4">
              <div className="relative flex items-center justify-center mb-4">
                {/* Glowing Outer Rings */}
                <div className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-[#C9A84C]/50 animate-ping pointer-events-none" />
                <div className="absolute w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#C9A84C]/20 blur-xl pointer-events-none" />

                {/* Main Interactive Button */}
                <button
                  type="button"
                  onClick={() => setIsVrModalOpen(true)}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#E2CB85] via-[#C9A84C] to-[#8A7334] p-[2px] shadow-[0_0_50px_rgba(201,168,76,0.7)] hover:shadow-[0_0_70px_rgba(201,168,76,0.95)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer group/btn"
                  title="Start Immersive VR Tour"
                >
                  <div className="w-full h-full rounded-full bg-[#0A1628]/85 backdrop-blur-sm flex items-center justify-center group-hover/btn:bg-[#0A1628]/60 transition-colors">
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 text-[#E2CB85] fill-current ml-1 drop-shadow-[0_0_15px_rgba(201,168,76,0.9)]" />
                  </div>
                </button>
              </div>

              {/* Call-to-action text */}
              <button
                type="button"
                onClick={() => setIsVrModalOpen(true)}
                className="px-6 py-2.5 rounded-full bg-black/75 hover:bg-black/90 border border-[#C9A84C]/60 hover:border-[#C9A84C] text-sm sm:text-base font-bold text-white hover:text-[#E2CB85] transition-all backdrop-blur-md shadow-2xl flex items-center gap-2 cursor-pointer"
              >
                <span>Start Immersive VR Tour</span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#C9A84C] text-[#0A1628] font-black">
                  360°
                </span>
              </button>
            </div>

            {/* Bottom Info on Preview */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-wrap items-end justify-between gap-3 z-10 pointer-events-none">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#C9A84C]">
                  {monument.titleAr}
                </p>
                <p className="text-sm sm:text-base font-bold text-white drop-shadow-md">
                  High-Precision Digital Twin
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono text-white/70">
                  Click to enter full 360° virtual sphere
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 4. SIDEBAR & ARTIFACTS GRID ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* ── Left / Main Content: Description & Featured Artifacts ──────── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview & History Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1120]/80 border border-white/10 shadow-xl backdrop-blur-md">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2.5">
                <Landmark className="w-5 h-5 text-[#C9A84C]" />
                Architectural History & Significance
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                {monument.description}
              </p>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-gray-400 leading-relaxed">
                <p className="font-semibold text-[#E2CB85] mb-1">Historical Context</p>
                {monument.historicalContext}
              </div>
            </div>

            {/* Featured Artifacts Grid */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#C9A84C]" />
                    Featured Artifacts & Sanctuaries
                  </h3>
                  <p className="text-xs text-white/50 mt-0.5">
                    Explore high-resolution highlights discovered within the complex
                  </p>
                </div>
                <span className="text-xs font-mono text-[#C9A84C]">
                  {monument.artifacts.length} Items Documented
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {monument.artifacts.map((artifact) => (
                  <div
                    key={artifact.id}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B1120]/90 hover:border-[#C9A84C]/50 transition-all duration-300 shadow-md hover:shadow-[0_0_30px_rgba(201,168,76,0.15)] flex flex-col"
                  >
                    {/* Artifact Image with Smooth Hover Zoom */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/60">
                      <img
                        src={artifact.image}
                        alt={artifact.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-black/20 to-transparent" />
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/70 border border-white/15 text-[10px] font-mono text-[#E2CB85] backdrop-blur-md">
                        {artifact.period}
                      </span>
                    </div>

                    {/* Artifact Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-base font-bold text-white group-hover:text-[#E2CB85] transition-colors mb-1">
                          {artifact.name}
                        </h4>
                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                          {artifact.description}
                        </p>
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-[#C9A84C]">
                        <span>Cataloged Archive</span>
                        <span className="group-hover:translate-x-1 transition-transform">Details →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Column: Tour Details Card & Interactive Map ─────────── */}
          <div className="space-y-6">
            {/* Tour Details Card */}
            <div className="p-6 rounded-3xl bg-[#0B1120]/80 border border-white/10 shadow-xl backdrop-blur-md space-y-5">
              <h3 className="text-lg font-bold text-white pb-3 border-b border-white/10 flex items-center justify-between">
                <span>Tour Specifications</span>
                <span className="text-xs font-mono text-emerald-400">● Live VR Ready</span>
              </h3>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/50">Location:</span>
                  <span className="font-semibold text-white">{monument.city}, Egypt</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/50">Historical Patron:</span>
                  <span className="font-semibold text-[#E2CB85]">{monument.patron}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/50">Architectural Type:</span>
                  <span className="font-semibold text-white">{monument.siteType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/50">Estimated Duration:</span>
                  <span className="font-semibold text-white">{monument.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/50">Virtual Explorers:</span>
                  <span className="font-mono font-semibold text-cyan-300">{monument.visitors}</span>
                </div>
              </div>

              {/* "I'd Love This!" Gold Favorite Button */}
              <button
                type="button"
                onClick={toggleFavorite}
                className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                  isFavorited
                    ? 'bg-[#C9A84C] text-[#0A1628] shadow-[0_0_25px_rgba(201,168,76,0.6)] border border-[#E2CB85]'
                    : 'bg-white/5 hover:bg-[#C9A84C]/15 border border-[#C9A84C]/40 text-[#E2CB85] hover:border-[#C9A84C]'
                }`}
              >
                <Heart
                  className={`w-4 h-4 transition-transform ${
                    isFavorited ? 'fill-current text-[#0A1628] scale-125' : 'text-[#C9A84C]'
                  }`}
                />
                <span>{isFavorited ? "Added to Wishlist! ❤️" : "I'd Love This! (Save to Favorites)"}</span>
                <span className="text-[11px] opacity-80 font-mono">({favoriteCount})</span>
              </button>
            </div>

            {/* Interactive Styled Map Preview Card */}
            <div className="p-6 rounded-3xl bg-[#0B1120]/80 border border-white/10 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#C9A84C]" />
                  Geographic Pinpoint
                </h4>
                <span className="text-[10px] font-mono text-white/50">WGS84 GPS</span>
              </div>

              {/* Styled Map Container */}
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-white/10 bg-slate-900 group">
                <iframe
                  title="Monument Map Location"
                  src={monument.mapEmbedUrl}
                  className="w-full h-full border-0 filter invert contrast-125 opacity-70 group-hover:opacity-90 transition-opacity"
                  loading="lazy"
                />

                {/* Radar Ping Overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-[#C9A84C] animate-ping" />
                  <div className="w-4 h-4 rounded-full bg-[#C9A84C] shadow-[0_0_15px_#C9A84C]" />
                </div>

                <div className="absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-black/80 backdrop-blur-md text-[11px] font-mono text-white/90 flex items-center justify-between">
                  <span>{monument.coordinates}</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      monument.title + ' Egypt'
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#C9A84C] hover:underline flex items-center gap-1"
                  >
                    Satellite <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 360° IMMERSIVE VR PORTAL MODAL ───────────────────────────────── */}
      <AnimatePresence>
        {isVrModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#030712]/95 backdrop-blur-2xl flex flex-col"
          >
            {/* Top Modal Navigation */}
            <div className="p-4 sm:p-6 flex items-center justify-between border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#C9A84C]/20 border border-[#C9A84C]/50 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-[#C9A84C]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">{monument.title}</h3>
                  <p className="text-xs text-white/50">
                    Interactive 360° Panoramic Sphere · Drag to look around
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsVrModalOpen(false)}
                  className="p-2 sm:px-4 sm:py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Close VR View</span>
                </button>
              </div>
            </div>

            {/* 360° Sphere Iframe */}
            <div className="flex-1 w-full h-full relative p-2 sm:p-6 bg-black flex items-center justify-center">
              <iframe
                src={monument.vrPortalUrl}
                title={`${monument.title} 360 Degree Virtual Tour`}
                className="w-full h-full rounded-2xl border border-[#C9A84C]/30 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                allowFullScreen
                allow="accelerometer; gyroscope; magnetometer; xr-spatial-tracking"
              />

              {/* Motion Hint Badge */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/80 border border-white/20 text-xs text-white/80 backdrop-blur-md pointer-events-none flex items-center gap-2">
                <RotateCw className="w-3.5 h-3.5 text-[#C9A84C] animate-spin" />
                <span>Move phone or drag with mouse to explore 360° environment</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
