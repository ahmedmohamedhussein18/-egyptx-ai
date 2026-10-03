'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Languages,
  Sparkles,
  Mic,
  MicOff,
  Camera,
  SendHorizonal,
  Volume2,
  VolumeX,
  Loader2,
  X,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface TranslationResult {
  translation: string;
  phonetic: string;
  context: string;
}

type MessageRole = 'user' | 'ai';

interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  result?: TranslationResult;
  imagePreview?: string;
  timestamp: Date;
}

interface VoiceOption {
  id: string;
  label: string;
  name: string;
  emoji: string;
}

// 100% Valid & Verified ElevenLabs Default Premade Voice IDs
const VOICE_OPTIONS: VoiceOption[] = [
  { id: 'EXAVITQu4vr4xnSDxMaL', label: '👩 Female Voice', name: 'Sarah', emoji: '👩' },
  { id: 'pNInz6obpgDQGcFmaJgB', label: '👨 Male Voice', name: 'Adam', emoji: '👨' },
  { id: 'TX3LPaxmHKxFdv7VOQHJ', label: '👦 Youth Voice', name: 'Liam', emoji: '👦' },
];

const SUGGESTION_PILLS = [
  "Where is the nearest pharmacy?",
  "How much does this cost?",
  "Can you take me to the Pyramids?",
  "Thank you very much",
];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

/* ─── ElevenLabs HD Voice Hook (Zero Browser Speech Fallback) ─────────────── */
function useElevenLabsTTS() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingAudioId, setLoadingAudioId] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    setPlayingId(null);
    setLoadingAudioId(null);
  }, []);

  const play = useCallback(
    async (msgId: string, text: string, voiceId?: string) => {
      // Toggle off if already playing this message
      if (playingId === msgId) {
        stop();
        return;
      }
      stop();
      setLoadingAudioId(msgId);
      setAudioError(null);

      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, voiceId }),
        });

        // 1. Strictly check if (!res.ok)
        if (!res.ok) {
          let errorMessage = 'Voice generation failed. Check API key.';
          try {
            const errJson = await res.json();
            if (errJson?.error) errorMessage = errJson.error;
            else if (errJson?.message) errorMessage = errJson.message;
          } catch {
            const errText = await res.text().catch(() => '');
            if (errText) errorMessage = errText;
          }
          throw new Error(errorMessage);
        }

        // 2. Verify Content-Type is actually audio (prevent parsing JSON as audio)
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('audio')) {
          let errorMessage = 'Voice generation failed. Check API key.';
          try {
            const errJson = await res.json();
            if (errJson?.error) errorMessage = errJson.error;
          } catch { /* ignore */ }
          throw new Error(errorMessage);
        }

        // 3. ONLY create Blob and Audio once response is fully successful
        const audioBlob = await res.blob();
        if (!audioBlob || audioBlob.size === 0) {
          throw new Error('Received empty audio from server.');
        }

        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        setLoadingAudioId(null);
        setPlayingId(msgId);

        audio.onended = () => {
          setPlayingId(null);
          URL.revokeObjectURL(audioUrl);
        };

        audio.onerror = (e) => {
          console.error('[ElevenLabs Playback Error]', e);
          setPlayingId(null);
          setLoadingAudioId(null);
          setAudioError('Voice generation failed. Check API key.');
          URL.revokeObjectURL(audioUrl);
        };

        try {
          await audio.play();
        } catch (playErr: any) {
          console.error('[Audio Play Exception]', playErr);
          setPlayingId(null);
          setLoadingAudioId(null);
          setAudioError(playErr.message || 'Audio playback was interrupted by the browser.');
          URL.revokeObjectURL(audioUrl);
        }
      } catch (err: any) {
        console.error('[TTS Generation Error]', err);
        setLoadingAudioId(null);
        setPlayingId(null);
        setAudioError(err.message || 'Voice generation failed. Check API key.');
      }
    },
    [playingId, stop]
  );

  useEffect(() => () => stop(), [stop]);

  return { play, stop, playingId, loadingAudioId, audioError, setAudioError };
}

/* ─── Mic Input Hook ──────────────────────────────────────────────────────── */
function useMic(onResult: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const recRef = useRef<any>(null);

  const toggle = useCallback(() => {
    if (typeof window === 'undefined') return;
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }

    const rec = new SR();
    recRef.current = rec;
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'ar-EG';

    rec.onstart = () => setListening(true);
    rec.onresult = (e: any) => {
      const transcript = e.results[0]?.[0]?.transcript || '';
      if (transcript) onResult(transcript);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start();
  }, [listening, onResult]);

  useEffect(() => () => recRef.current?.stop(), []);

  return { listening, toggle };
}

/* ─── AI Response Bubble ─────────────────────────────────────────────────── */
function AIBubble({
  msg,
  playingId,
  loadingAudioId,
  selectedVoice,
  onPlay,
}: {
  msg: ChatMessage;
  playingId: string | null;
  loadingAudioId: string | null;
  selectedVoice: VoiceOption;
  onPlay: (id: string, text: string) => void;
}) {
  const r = msg.result!;
  const isPlaying = playingId === msg.id;
  const isLoading = loadingAudioId === msg.id;

  return (
    <div className="flex justify-start w-full">
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-start gap-3 max-w-[85%] md:max-w-[80%]"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#1B6B93] flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(201,168,76,0.35)] mt-1">
          <Sparkles className="w-4 h-4 text-white" />
        </div>

        {/* Card */}
        <div className="bg-[#06101E]/90 backdrop-blur-md border border-[#C9A84C]/30 rounded-2xl rounded-tl-sm overflow-hidden shadow-[0_6px_24px_rgba(0,0,0,0.5)]">
          {/* Arabic translation */}
          <div className="px-4 pt-3.5 pb-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase tracking-widest text-[#C9A84C]/80 font-bold">
                Egyptian Arabic
              </span>
              <span className="text-[9px] uppercase tracking-wider text-white/35 font-mono flex items-center gap-1">
                <span>{selectedVoice.emoji}</span>
                <span>{selectedVoice.name}</span>
              </span>
            </div>
            <p
              dir="rtl"
              className="text-2xl font-bold text-white leading-relaxed text-right"
              style={{ fontFamily: "'Noto Naskh Arabic', 'Arabic UI Text', serif" }}
            >
              {r.translation}
            </p>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-[#C9A84C]/25 to-transparent mx-4" />

          {/* Phonetic */}
          <div className="px-4 py-2.5">
            <p className="text-[10px] uppercase tracking-widest text-[#1B6B93]/90 mb-0.5 font-semibold">How to say it</p>
            <p className="font-mono text-[#E2CB85] text-sm md:text-base leading-snug">{r.phonetic}</p>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent mx-4" />

          {/* Cultural context */}
          <div className="px-4 py-2.5">
            <p className="text-[10px] uppercase tracking-widest text-white/35 mb-0.5 font-semibold">Cultural context</p>
            <p className="text-xs md:text-sm text-white/60 italic leading-relaxed">{r.context}</p>
          </div>

          {/* Play Button */}
          <div className="px-4 pb-3.5 pt-1">
            <button
              onClick={() => onPlay(msg.id, r.translation)}
              disabled={isLoading}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 border ${
                isPlaying
                  ? 'bg-[#C9A84C]/25 border-[#C9A84C] text-[#C9A84C] shadow-[0_0_18px_rgba(201,168,76,0.45)]'
                  : isLoading
                  ? 'bg-white/10 border-white/20 text-white/60 cursor-wait'
                  : 'bg-transparent border-[#C9A84C]/35 text-[#C9A84C] hover:bg-[#C9A84C]/15 hover:border-[#C9A84C] hover:shadow-[0_0_12px_rgba(201,168,76,0.25)]'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C9A84C]" />
                  <span>Generating Voice...</span>
                </>
              ) : isPlaying ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#C9A84C] animate-pulse" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#C9A84C]" />
                  <span>Play HD Voice ({selectedVoice.label.split(' ')[0]} {selectedVoice.name})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── User bubble ────────────────────────────────────────────────────────── */
function UserBubble({ msg }: { msg: ChatMessage }) {
  return (
    <div className="flex justify-end w-full">
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-[85%] md:max-w-[75%] bg-[#12233C]/95 backdrop-blur-md border border-white/15 rounded-2xl rounded-tr-sm px-4 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
      >
        {msg.imagePreview && (
          <img
            src={msg.imagePreview}
            alt="uploaded preview"
            className="w-full max-w-[200px] rounded-xl mb-2 object-cover border border-white/10"
          />
        )}
        <p className="text-white text-sm leading-relaxed">{msg.text}</p>
        <p className="text-white/35 text-[10px] mt-1 text-right font-mono">
          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </motion.div>
    </div>
  );
}

/* ─── Typing indicator ───────────────────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div className="flex justify-start w-full">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#1B6B93] flex items-center justify-center shadow-[0_0_12px_rgba(201,168,76,0.3)]">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex items-center gap-1.5 bg-[#06101E]/90 border border-[#C9A84C]/25 rounded-2xl rounded-tl-sm px-4 py-3">
          {[0, 0.15, 0.3].map((delay, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-[#C9A84C]"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Slang Chat Component ───────────────────────────────────────────── */
export default function SlangTranslatorContent() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(VOICE_OPTIONS[0].id);

  const bottomRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { play, stop, playingId, loadingAudioId, audioError, setAudioError } = useElevenLabsTTS();

  const selectedVoice = VOICE_OPTIONS.find((v) => v.id === selectedVoiceId) || VOICE_OPTIONS[0];

  // Auto-dismiss audio error after 6 seconds
  useEffect(() => {
    if (!audioError) return;
    const timer = setTimeout(() => setAudioError(null), 6000);
    return () => clearTimeout(timer);
  }, [audioError, setAudioError]);

  const appendMicText = useCallback((text: string) => {
    setInput((prev) => (prev ? `${prev} ${text}` : text));
  }, []);

  const { listening, toggle: toggleMic } = useMic(appendMicText);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleScroll = () => {
    const el = chatRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 120);
  };

  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  };

  const handleSendText = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: uid(),
      role: 'user',
      text,
      imagePreview: imagePreview ?? undefined,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setImagePreview(null);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setLoading(true);

    try {
      const res = await fetch('/api/slang-translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error('Translation failed');
      const data: TranslationResult = await res.json();

      const aiMsg: ChatMessage = {
        id: uid(),
        role: 'ai',
        text: data.translation,
        result: data,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);

      // Save to localStorage for Memory Core
      if (typeof window !== 'undefined') {
        try {
          const history = JSON.parse(
            localStorage.getItem('egyptx-translation-history') || '[]'
          ) as Array<{ input: string; translation: string; timestamp: string }>;
          history.unshift({ input: text, translation: data.translation, timestamp: new Date().toISOString() });
          localStorage.setItem(
            'egyptx-translation-history',
            JSON.stringify(history.slice(0, 50))
          );
        } catch { /* ignore */ }
      }
    } catch {
      const errMsg: ChatMessage = {
        id: uid(),
        role: 'ai',
        text: 'Sorry, I had trouble translating that. Please try again.',
        result: {
          translation: 'حصل مشكلة، حاول تاني يا فندم',
          phonetic: 'Ḥaṣal muška, ḥāwil tāni ya fandim',
          context: 'A friendly Egyptian way to say an issue occurred — please try again!',
        },
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText(input);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string);
      setInput((prev) => prev || `[Image: ${file.name}]`);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="min-h-screen text-white flex flex-col justify-center items-center px-4 pt-24 pb-8 relative z-10 overflow-hidden font-sans">
      {/* ── Fullscreen Background Video (Bright & Vivid) ──────────────────── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover -z-10 opacity-100"
      >
        <source src="/bg-slang.mp4" type="video/mp4" />
      </video>

      {/* ── 1. CENTERED CHAT CONTAINER (Crystal Clear) ────────────────────── */}
      <div className="w-full max-w-3xl h-[82vh] md:h-[84vh] bg-gradient-to-b from-black/30 to-black/5 border border-white/10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden relative z-10">

        {/* Card Top Header */}
        <div className="flex items-center justify-between px-5 md:px-6 py-3.5 border-b border-white/10 bg-black/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#1B6B93] flex items-center justify-center shadow-[0_0_12px_rgba(201,168,76,0.35)] drop-shadow-lg">
              <Languages className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold bg-gradient-to-r from-[#C9A84C] to-[#E3C973] bg-clip-text text-transparent leading-none drop-shadow-lg">
                EgyptX Slang
              </h1>
              <p className="text-[11px] text-white/75 mt-0.5 drop-shadow-md">ElevenLabs HD Voice</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full bg-black/30 border border-[#C9A84C]/40 text-[#E2CB85] font-mono font-semibold drop-shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-[#19A974] animate-pulse" />
              ElevenLabs Multilingual v2
            </span>
          </div>
        </div>

        {/* ── Voice Selector Bar (Female, Male, Youth) ───────────────────────── */}
        <div className="flex items-center justify-between px-4 md:px-6 py-2 bg-black/15 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-[#C9A84C] drop-shadow-md" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/75 drop-shadow-md">
              AI Voice:
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {VOICE_OPTIONS.map((v) => {
              const active = selectedVoiceId === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setSelectedVoiceId(v.id);
                    stop();
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border flex items-center gap-1.5 cursor-pointer whitespace-nowrap drop-shadow-lg ${
                    active
                      ? 'bg-[#C9A84C]/30 border-[#C9A84C] text-[#E2CB85] shadow-[0_0_12px_rgba(201,168,76,0.3)] font-semibold'
                      : 'bg-black/30 border-white/10 text-white/80 hover:text-white hover:border-[#C9A84C]/40 hover:bg-black/50'
                  }`}
                >
                  <span className="drop-shadow-sm">{v.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* User-friendly Error Toast Notification */}
        <AnimatePresence>
          {audioError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mx-4 mt-2 p-2.5 bg-red-950/85 border border-red-500/40 rounded-xl flex items-center justify-between text-xs text-red-200 shadow-md backdrop-blur-md shrink-0 z-20"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span className="font-medium">{audioError}</span>
              </div>
              <button
                onClick={() => setAudioError(null)}
                className="p-1 hover:bg-white/10 rounded-md transition-colors text-white/60 hover:text-white"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Chat Messages Viewport ────────────────────────────────────────── */}
        <div
          ref={chatRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 md:px-6 py-5 space-y-4 scroll-smooth"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#C9A84C20 transparent' }}
        >
          {/* ── Empty State (Welcome Screen) ────────────────────────────────── */}
          {isEmpty && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="h-full flex flex-col items-center justify-center text-center px-4 py-6"
            >
              {/* 3D Glowing Microphone Icon */}
              <div className="relative mb-5 flex items-center justify-center">
                <div className="absolute w-28 h-28 rounded-full bg-[#C9A84C]/25 blur-2xl pointer-events-none" />
                <button
                  type="button"
                  onClick={toggleMic}
                  className={`relative w-20 h-20 rounded-3xl bg-gradient-to-br from-[#E2CB85] via-[#C9A84C] to-[#8A7334] p-[1.5px] shadow-[0_0_30px_rgba(201,168,76,0.5)] border border-[#C9A84C]/50 drop-shadow-lg transition-transform hover:scale-105 cursor-pointer ${listening ? 'animate-pulse' : ''}`}
                  title="Click to speak"
                >
                  <div className="w-full h-full rounded-[22px] bg-gradient-to-b from-[#0D1F38] to-[#050D1A] flex items-center justify-center border border-white/10 shadow-inner">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C9A84C]/25 to-transparent flex items-center justify-center">
                      <Mic className="w-6 h-6 text-[#E2CB85] drop-shadow-[0_0_12px_rgba(201,168,76,0.9)]" />
                    </div>
                  </div>
                </button>
              </div>

              {/* Heading */}
              <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E2CB85] to-[#C9A84C] tracking-tight mb-2 text-center drop-shadow-lg">
                Talk to Egyptians in their language
              </h2>

              {/* Subtitle */}
              <p className="text-xs md:text-sm text-white/80 font-medium mb-6 text-center drop-shadow-lg">
                Speak with locals
              </p>

              {/* Clickable Suggestion Pills */}
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {SUGGESTION_PILLS.map((phrase) => (
                  <button
                    key={phrase}
                    type="button"
                    onClick={() => handleSendText(phrase)}
                    className="px-3.5 py-2 rounded-full text-xs font-medium text-white/95 bg-black/40 hover:bg-[#C9A84C]/20 border border-white/15 hover:border-[#C9A84C] hover:text-[#E2CB85] transition-all duration-200 shadow-md drop-shadow-lg hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] flex items-center gap-2 group cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] group-hover:scale-125 transition-transform" />
                    <span className="drop-shadow-sm">{phrase}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Message Bubbles ────────────────────────────────────────────── */}
          {messages.map((msg) =>
            msg.role === 'user' ? (
              <UserBubble key={msg.id} msg={msg} />
            ) : (
              msg.result && (
                <AIBubble
                  key={msg.id}
                  msg={msg}
                  playingId={playingId}
                  loadingAudioId={loadingAudioId}
                  selectedVoice={selectedVoice}
                  onPlay={(id, text) => play(id, text, selectedVoiceId)}
                />
              )
            )
          )}

          {/* AI Typing loader */}
          {loading && <TypingIndicator />}

          <div ref={bottomRef} />
        </div>

        {/* Scroll to bottom button */}
        <AnimatePresence>
          {showScrollBtn && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToBottom}
              className="absolute bottom-20 right-5 z-20 w-8 h-8 rounded-full bg-[#0A1628] border border-[#C9A84C]/40 flex items-center justify-center shadow-lg hover:bg-[#C9A84C]/15 transition-colors"
            >
              <ChevronDown className="w-4 h-4 text-[#C9A84C]" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* ── Bottom Input Bar (Crystal Clear) ────────────────────────────── */}
        <div className="border-t border-white/10 bg-black/25 px-4 py-3 shrink-0 relative z-10">
          {/* Upload thumbnail preview */}
          <AnimatePresence>
            {imagePreview && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="mb-2 relative inline-block drop-shadow-lg"
              >
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-16 h-16 object-cover rounded-xl border border-[#C9A84C]/30 shadow-md"
                />
                <button
                  onClick={() => { setImagePreview(null); setInput(''); }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center shadow"
                >
                  <X className="w-2.5 h-2.5 text-white" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-end gap-2">
            {/* Camera Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload image or camera capture"
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-white/15 bg-black/40 hover:bg-[#C9A84C]/20 hover:border-[#C9A84C]/50 text-white/70 hover:text-[#C9A84C] transition-all cursor-pointer drop-shadow-lg"
            >
              <Camera className="w-4 h-4 drop-shadow-sm" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Text input area */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => { setInput(e.target.value); resizeTextarea(); }}
                onKeyDown={handleKeyDown}
                placeholder="Type English or Arabic… (Enter to send)"
                disabled={loading}
                className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-[#C9A84C]/60 transition-colors resize-none text-xs md:text-sm leading-relaxed overflow-hidden drop-shadow-md"
                style={{ minHeight: '40px', maxHeight: '140px' }}
              />
            </div>

            {/* Microphone button */}
            <button
              type="button"
              onClick={toggleMic}
              title={listening ? 'Stop speech recognition' : 'Speak into mic'}
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-200 cursor-pointer drop-shadow-lg ${
                listening
                  ? 'bg-red-500/30 border-red-500 text-red-400 shadow-[0_0_16px_rgba(239,68,68,0.5)] animate-pulse'
                  : 'border-white/15 bg-black/40 hover:bg-[#C9A84C]/20 hover:border-[#C9A84C]/50 text-white/70 hover:text-[#C9A84C]'
              }`}
            >
              {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send button */}
            <button
              type="button"
              onClick={() => handleSendText(input)}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-[#C9A84C] hover:bg-[#d4b55b] text-[#030712] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_14px_rgba(201,168,76,0.3)] hover:shadow-[0_0_20px_rgba(201,168,76,0.5)] cursor-pointer drop-shadow-lg"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <SendHorizonal className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Mic Waveform indicator */}
          <AnimatePresence>
            {listening && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-2 mt-2 px-1">
                  <div className="flex gap-0.5 items-end h-3.5">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-red-400 rounded-full"
                        animate={{ height: ['4px', `${7 + Math.random() * 7}px`, '4px'] }}
                        transition={{ duration: 0.4 + i * 0.1, repeat: Infinity }}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-red-400 font-medium">Listening to your voice…</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-white/20 text-[10px] mt-2">
            <Sparkles className="inline w-2.5 h-2.5 mr-1 text-[#C9A84C]/50" />
            ElevenLabs HD Voice · {selectedVoice.label} · EgyptX Dialect AI
          </p>
        </div>
      </div>
    </div>
  );
}
