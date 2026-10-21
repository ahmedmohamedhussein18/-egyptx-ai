'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Wand2,
  Crown,
  Lock,
  Loader2,
  Film,
  RotateCcw,
  Volume2,
  VolumeX,
  BookOpen
} from 'lucide-react';
import type { EliteFeature } from '@/lib/elite-trials';

export interface KidsStoryGeneratorProps {
  heroNameDefault?: string;
  isElite?: boolean;
  kidsStoryUsed?: boolean;
  useTrial?: (feature: EliteFeature) => void;
  onOpenEliteModal?: () => void;
}

export default function KidsStoryGenerator({
  heroNameDefault = '',
  isElite = false,
  kidsStoryUsed = false,
  useTrial,
  onOpenEliteModal
}: KidsStoryGeneratorProps) {
  const [storyHeroName, setStoryHeroName] = useState(heroNameDefault);
  const [storyCompanion, setStoryCompanion] = useState('Horus the Golden Falcon 🦅');
  const [storyDestination, setStoryDestination] = useState('The Great Pyramid Secret Chamber 🏛️');
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [generationPhase, setGenerationPhase] = useState('');
  const [storyUnlockedNotice, setStoryUnlockedNotice] = useState(false);
  const [storyVideoUrl, setStoryVideoUrl] = useState<string | null>(null);
  const [storyVideoTitle, setStoryVideoTitle] = useState('');
  const [storyVideoPrompt, setStoryVideoPrompt] = useState('');
  const [showPromptDetails, setShowPromptDetails] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [storyChapters, setStoryChapters] = useState<{
    title: string;
    chapters: { title: string; text: string; emoji: string }[];
  } | null>(null);

  const handleGenerateStory = async () => {
    // If trial is already used and user is not elite, gate behind EliteModal
    if (!isElite && kidsStoryUsed) {
      onOpenEliteModal?.();
      return;
    }

    setIsGeneratingStory(true);
    setGenerationPhase('جاري صياغة المشاهد السحرية...');

    const hero = storyHeroName.trim() || heroNameDefault || 'Young Explorer';
    const cleanCompanion = storyCompanion.replace(/[^\p{L}\p{N}\s]/gu, '').trim();
    const cleanDestination = storyDestination.replace(/[^\p{L}\p{N}\s]/gu, '').trim();

    // 1. Dynamic Video Prompt Formulation
    const videoPrompt = `Cinematic 3D animation for kids: A brave young pharaonic hero named ${hero}, guided by ${cleanCompanion}, embarking on a mystical quest to discover ${cleanDestination}, featuring ancient Egyptian temples and golden pyramids in a vibrant fantasy style.`;
    setStoryVideoPrompt(videoPrompt);

    try {
      setGenerationPhase('جاري إنتاج قصة الفيديو السحرية بالذكاء الاصطناعي...');

      // 2. Trigger AI Video generation API
      const res = await fetch('/api/kids-story-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heroName: hero,
          companion: cleanCompanion,
          destination: cleanDestination,
          prompt: videoPrompt
        })
      });

      const data = await res.json();
      const videoSrc = data?.videoUrl || '/videos/kids-mode-welcome.mp4';

      setStoryVideoUrl(videoSrc);
      setStoryVideoTitle(data?.title || `✨ مغامرة البطل ${hero} السينمائية`);

      // Accompanying narrative chapters for audio narration & storytelling
      setStoryChapters({
        title: `${hero}'s Quest for the Golden Ankh`,
        chapters: [
          {
            title: 'Chapter 1: The Call of Ancient Sands',
            emoji: '🌅',
            text: `Under the glowing Nile sunset, ${hero} received a mysterious hieroglyphic parchment from ${cleanCompanion}. The ancient papyrus spoke of a legendary golden artifact hidden deep inside ${cleanDestination}. Without hesitation, ${hero} stepped forward into the grand desert sands!`,
          },
          {
            title: 'Chapter 2: The Riddle of the Sacred Spheres',
            emoji: '🏛️',
            text: `Arriving at the entrance of ${cleanDestination}, a great stone gate sealed the path. ${cleanCompanion} fluttered forward and read the riddle engraved in gold: "What flows forever yet never leaves Egypt?" ${hero} grinned and answered boldly: "The sacred Nile!" The stone doors slid open with a rumbling sound of wonder.`,
          },
          {
            title: 'Chapter 3: The Pharaoh\'s Eternal Blessing',
            emoji: '👑',
            text: `In the inner sanctuary, a gentle radiance illuminated the room. The spirit of the ancient Pharaoh appeared, bowing respectfully to ${hero}. "You have proven your courage, wisdom, and honor," proclaimed the Pharaoh, bestowing the Golden Ankh upon ${hero}. Egypt’s timeless magic was safe forever!`,
          },
        ]
      });

      useTrial?.('kids-story');
      if (!isElite) {
        setStoryUnlockedNotice(true);
      }
    } catch (e) {
      console.error('Error generating kids story video:', e);
      // Fallback to built-in pharaonic kids movie
      setStoryVideoUrl('/videos/kids-mode-welcome.mp4');
      setStoryVideoTitle(`✨ مغامرة البطل ${hero} السينمائية`);
    } finally {
      setIsGeneratingStory(false);
      setGenerationPhase('');
    }
  };

  const handleNarrateStory = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isNarrating) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
      return;
    }
    if (!storyChapters) return;

    window.speechSynthesis.cancel();
    const fullStory = `${storyChapters.title}. ` + storyChapters.chapters.map(c => `${c.title}. ${c.text}`).join(' ');
    const utterance = new SpeechSynthesisUtterance(fullStory);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.onend = () => setIsNarrating(false);
    utterance.onerror = () => setIsNarrating(false);
    setIsNarrating(true);
    window.speechSynthesis.speak(utterance);
  };

  const activeHero = storyHeroName.trim() || heroNameDefault || 'Young Explorer';

  return (
    <div className="bg-gradient-to-br from-[#0B1120] via-[#0A1628] to-[#040913] border-2 border-amber-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden shadow-[0_0_35px_rgba(245,158,11,0.15)]">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Wand2 className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-black uppercase tracking-wider text-amber-400">
              AI Cinematic Storyteller &bull; راوي القصص المصورة
            </span>
          </div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <span>👑</span>
            <span>Become the Hero of Ancient Egypt!</span>
          </h2>
        </div>

        {/* Pro / Trial Badge */}
        <div>
          {isElite ? (
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 flex items-center gap-1.5 shadow-md">
              <Crown className="w-3.5 h-3.5" />
              Kids Mode Pro &middot; Unlimited
            </span>
          ) : kidsStoryUsed ? (
            <button
              onClick={() => onOpenEliteModal?.()}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              Trial Used &middot; Upgrade to Pro
            </button>
          ) : (
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-400/20 via-yellow-400/20 to-amber-500/20 border border-amber-400/50 text-amber-300 flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              1 Free Video Story Available
            </span>
          )}
        </div>
      </div>

      {/* Celebration Banner for Free Trial Unlocked */}
      {storyUnlockedNotice && !isElite && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 mb-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-indigo-950/40 border border-amber-400/50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_25px_rgba(245,158,11,0.25)] relative z-10"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-300 shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-200">
                You&apos;ve unlocked your free magical video story!
              </p>
              <p className="text-xs text-slate-300/80">
                Upgrade to EgyptX Elite for unlimited personalized cinematic adventures.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenEliteModal?.()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <Crown className="w-3.5 h-3.5" />
            Upgrade to Elite
          </button>
        </motion.div>
      )}

      {/* Story Inputs Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 relative z-10">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Child / Hero Name
          </label>
          <input
            type="text"
            value={storyHeroName}
            onChange={(e) => setStoryHeroName(e.target.value)}
            placeholder={heroNameDefault || 'e.g. Leo, Maya'}
            className="w-full bg-[#030712] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-amber-400 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Magical Guardian Companion
          </label>
          <select
            value={storyCompanion}
            onChange={(e) => setStoryCompanion(e.target.value)}
            className="w-full bg-[#030712] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-amber-400 focus:outline-none transition-colors"
          >
            <option>Horus the Golden Falcon 🦅</option>
            <option>Bastet the Wise Cat 🐱</option>
            <option>Anubis the Loyal Guide 🐺</option>
            <option>Cleopatra the Brave Queen 👑</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Secret Quest Realm
          </label>
          <select
            value={storyDestination}
            onChange={(e) => setStoryDestination(e.target.value)}
            className="w-full bg-[#030712] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-amber-400 focus:outline-none transition-colors"
          >
            <option>The Great Pyramid Secret Chamber 🏛️</option>
            <option>The Sun Temple of Abu Simbel ☀️</option>
            <option>The Lost Garden of Nefertiti 🌺</option>
            <option>The Underwater Palace of Alexandria 🌊</option>
          </select>
        </div>
      </div>

      {/* Generate / Action Button */}
      <div className="flex flex-wrap items-center gap-3 mb-6 relative z-10">
        <button
          onClick={handleGenerateStory}
          disabled={isGeneratingStory}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
        >
          {isGeneratingStory ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جاري إنتاج قصة الفيديو السحرية بالذكاء الاصطناعي...</span>
            </>
          ) : !isElite && kidsStoryUsed ? (
            <>
              <Lock className="w-4 h-4" />
              Generate Another Video (Elite 👑)
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Magical Hero Story 🎬
            </>
          )}
        </button>
      </div>

      {/* Loading state indicator card */}
      <AnimatePresence>
        {isGeneratingStory && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#070D1F] border-2 border-[#D4AF37]/50 rounded-3xl p-8 text-center shadow-[0_0_40px_rgba(212,175,55,0.2)] mb-6 relative z-10"
          >
            <div className="w-16 h-16 mx-auto mb-4 relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-[#D4AF37]/40 animate-ping" />
              <Film className="w-8 h-8 text-[#D4AF37] animate-pulse" />
            </div>
            <h4 className="text-lg font-black text-[#D4AF37] mb-2 font-sans" dir="rtl">
              جاري إنتاج قصة الفيديو السحرية بالذكاء الاصطناعي...
            </h4>
            <p className="text-xs text-slate-300 font-sans max-w-md mx-auto leading-relaxed">
              Synthesizing 3D cinematic animation: Ancient Egyptian temples, golden pyramids, and your magical guardian embark on the quest!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Updated UI / UX Presentation: Pharaonic Video Player & Success Banner */}
      <AnimatePresence>
        {storyVideoUrl && !isGeneratingStory && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-[#070D1F] border-2 border-[#D4AF37] rounded-3xl p-5 md:p-7 text-left relative z-10 shadow-[0_0_50px_rgba(212,175,55,0.22)] overflow-hidden space-y-4"
          >
            {/* Playful Success Banner for the Child */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#D4AF37]/30">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-bold mb-2 shadow-sm">
                  <Film className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>AI Cinematic Story Premiere &bull; عرض الفيلم السحري</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-[#D4AF37] flex items-center gap-2 tracking-wide font-sans">
                  <span>{storyVideoTitle || `✨ مغامرة البطل ${activeHero} السينمائية`}</span>
                </h3>
                <p className="text-xs text-gray-300 mt-1">
                  Hero: <strong className="text-white">{activeHero}</strong> &middot; Guardian: <strong className="text-amber-300">{storyCompanion}</strong> &middot; Realm: <strong className="text-emerald-300">{storyDestination}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1.5 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] font-extrabold text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  1080p HD
                </span>
              </div>
            </div>

            {/* Embedded, Responsive HTML5 Video Player */}
            <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl bg-black group">
              <video
                key={storyVideoUrl}
                src={storyVideoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-auto max-h-[520px] aspect-video object-cover rounded-2xl"
              />
            </div>

            {/* Interactive Video Controls & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const v = document.querySelector('video');
                    if (v) {
                      v.currentTime = 0;
                      v.play();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Replay Adventure
                </button>

                {storyChapters && (
                  <button
                    onClick={handleNarrateStory}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-amber-400/30 text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {isNarrating ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                        Stop Narration
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                        Audio Narration 🗣️
                      </>
                    )}
                  </button>
                )}
              </div>

              {storyVideoPrompt && (
                <button
                  onClick={() => setShowPromptDetails(!showPromptDetails)}
                  className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>{showPromptDetails ? 'Hide Video Prompt' : 'View AI Video Prompt'}</span>
                </button>
              )}
            </div>

            {/* Collapsible Prompt Info */}
            {showPromptDetails && storyVideoPrompt && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 p-3.5 rounded-xl bg-black/60 border border-white/10 text-xs text-slate-300 space-y-1 font-mono"
              >
                <span className="text-amber-400 font-sans font-bold block text-[11px] uppercase tracking-wider">
                  AI Video Generation Prompt:
                </span>
                <p className="leading-relaxed text-slate-300/90">{storyVideoPrompt}</p>
              </motion.div>
            )}

            {/* Story Chapters Narrative Summary */}
            {storyChapters && (
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Story Chronicle &middot; فصول المغامرة
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {storyChapters.chapters.map((chap, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                      <h4 className="text-xs font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                        <span>{chap.emoji}</span>
                        <span>{chap.title}</span>
                      </h4>
                      <p className="text-slate-300 text-xs leading-relaxed line-clamp-3">
                        {chap.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
