'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PhoneOff,
  Mic,
  MicOff,
  Camera,
  RefreshCw,
  Sparkles,
  Languages,
  BookOpen,
  Send,
  AlertCircle,
  X,
  Loader2,
  Volume2,
} from 'lucide-react';

interface AIGuideVoiceCallProps {
  isOpen: boolean;
  onClose: () => void;
}

type CallStatus = 'connecting' | 'listening' | 'speaking' | 'analyzing' | 'ended';

type VoicePersonality = 'female' | 'male' | 'youth';

const VOICE_OPTIONS: Array<{ id: VoicePersonality; label: string; icon: string }> = [
  { id: 'female', label: '👩 Sarah (Female)', icon: '👩' },
  { id: 'male', label: '👨 Adam (Male)', icon: '👨' },
  { id: 'youth', label: '👦 Liam (Youth)', icon: '👦' },
];

/* ── Authentic Egyptian Eye of Horus (Wadjet) Icon ─────────────────────── */
function EgyptianEyeIcon({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Upper Eyebrow line */}
      <path
        d="M20 38 C42 22, 78 22, 100 38"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      {/* Upper Eyelid */}
      <path
        d="M16 54 C36 38, 76 38, 98 54"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Lower Eyelid */}
      <path
        d="M16 54 C36 70, 76 70, 98 54"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Pupil / Iris */}
      <circle cx="56" cy="54" r="10" fill="currentColor" />
      <circle cx="53" cy="51" r="3.5" fill="#FFFFFF" />
      {/* Falcon Teardrop Marking (Down) */}
      <path
        d="M48 68 L48 95 C48 98, 44 98, 44 95 L44 68"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="currentColor"
      />
      {/* Curved Falcon Spiral (Right curl) */}
      <path
        d="M72 66 C75 80, 85 88, 96 82 C104 76, 98 68, 92 70"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AIGuideVoiceCall({ isOpen, onClose }: AIGuideVoiceCallProps) {
  // Call status and timers
  const [callStatus, setCallStatus] = useState<CallStatus>('connecting');
  const [callSeconds, setCallSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);

  // ElevenLabs Voice Personality
  const [selectedVoice, setSelectedVoice] = useState<VoicePersonality>('female');
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  // Vision & AI state
  const [lastResult, setLastResult] = useState<any | null>(null);
  const [userSpeechText, setUserSpeechText] = useState<string>('');
  const [aiSpeechText, setAiSpeechText] = useState<string>('');
  const [triggerFlash, setTriggerFlash] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [manualInput, setManualInput] = useState('');
  const [showInputDrawer, setShowInputDrawer] = useState(false);

  // Refs for audio / speech / camera sync
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentAudioUrlRef = useRef<string | null>(null);
  const isSpeakingRef = useRef(false);
  const isAnalyzingRef = useRef(false);
  const isCallActiveRef = useRef(false);
  const isMutedRef = useRef(false);
  const selectedVoiceRef = useRef<VoicePersonality>('female');
  const lastResultRef = useRef<any | null>(null);

  // Update voice ref
  useEffect(() => {
    selectedVoiceRef.current = selectedVoice;
  }, [selectedVoice]);

  // Update mute ref
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Keep lastResult ref in sync
  useEffect(() => {
    lastResultRef.current = lastResult;
  }, [lastResult]);

  // Read current site language strictly from document.documentElement.lang
  const getSiteLanguage = useCallback((): string => {
    if (typeof document !== 'undefined' && document.documentElement.lang) {
      return document.documentElement.lang.toLowerCase();
    }
    return 'en';
  }, []);

  // Stop currently playing audio and revoke object URL
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (currentAudioUrlRef.current) {
      URL.revokeObjectURL(currentAudioUrlRef.current);
      currentAudioUrlRef.current = null;
    }
    isSpeakingRef.current = false;
  }, []);

  // ElevenLabs TTS Audio Player: Plays hyper-realistic voice stream
  const speakWithElevenLabs = useCallback(
    async (text: string, onEnd?: () => void) => {
      if (!text || !text.trim() || !isCallActiveRef.current) {
        onEnd?.();
        return;
      }

      // Stop previous playback
      stopAudio();
      setIsGeneratingVoice(true);
      setVoiceError(null);
      isSpeakingRef.current = true;

      // Temporarily pause speech recognition while generating & speaking to prevent echo loops
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          /* ignore */
        }
      }

      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: text.trim().slice(0, 500),
            voiceId: selectedVoiceRef.current,
          }),
        });

        if (!res.ok) {
          let errMessage = 'Voice generation failed. Check ElevenLabs API key.';
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
          throw new Error('Received empty audio stream from ElevenLabs.');
        }

        setIsGeneratingVoice(false);

        // If user hung up while audio was fetching
        if (!isCallActiveRef.current) {
          return;
        }

        const audioUrl = URL.createObjectURL(audioBlob);
        currentAudioUrlRef.current = audioUrl;

        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onplay = () => {
          setCallStatus('speaking');
          isSpeakingRef.current = true;
        };

        audio.onended = () => {
          stopAudio();
          setCallStatus('listening');
          onEnd?.();
          // Resume speech recognition
          if (isCallActiveRef.current && !isMutedRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch {
              /* ignore */
            }
          }
        };

        audio.onerror = (e) => {
          console.warn('[ElevenLabs Audio] Playback error:', e);
          stopAudio();
          setCallStatus('listening');
          onEnd?.();
          if (isCallActiveRef.current && !isMutedRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch {
              /* ignore */
            }
          }
        };

        await audio.play();
      } catch (err: any) {
        console.error('[ElevenLabs TTS] Audio synthesis error:', err);
        setVoiceError(err?.message || 'Voice generation failed.');
        setIsGeneratingVoice(false);
        stopAudio();
        setCallStatus('listening');
        onEnd?.();
        if (isCallActiveRef.current && !isMutedRef.current && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch {
            /* ignore */
          }
        }
      }
    },
    [stopAudio]
  );

  // End call cleanup
  const endCall = useCallback(() => {
    isCallActiveRef.current = false;
    isSpeakingRef.current = false;
    isAnalyzingRef.current = false;
    setIsGeneratingVoice(false);

    stopAudio();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        /* ignore */
      }
      recognitionRef.current = null;
    }

    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }

    setCallStatus('ended');
    onClose();
  }, [onClose, stopAudio]);

  // Capture current frame from live camera onto canvas
  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.videoWidth === 0 || video.videoHeight === 0) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  // Send photo to /api/ai-guide
  const analyzeCurrentFrame = useCallback(
    async (triggerType: 'auto' | 'command' = 'command') => {
      if (isAnalyzingRef.current || isSpeakingRef.current || !isCallActiveRef.current) return;

      const base64Img = captureFrame();
      if (!base64Img) return;

      isAnalyzingRef.current = true;
      setCallStatus('analyzing');
      setTriggerFlash(true);
      setTimeout(() => setTriggerFlash(false), 300);

      const siteLang = getSiteLanguage();

      try {
        const res = await fetch('/api/ai-guide', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Img, language: siteLang }),
        });

        if (!res.ok) throw new Error('Analysis request failed');
        const data = await res.json();

        setLastResult(data);
        lastResultRef.current = data;

        if (data.confidence_level && data.confidence_level !== 'unable' && data.identified_name) {
          let speechText = '';
          if (siteLang.startsWith('ar')) {
            speechText = `أرى أمامك: ${data.identified_name}. ${data.ai_description}`;
          } else if (siteLang.startsWith('fr')) {
            speechText = `Je vois devant vous : ${data.identified_name}. ${data.ai_description}`;
          } else {
            speechText = `I see ${data.identified_name}. ${data.ai_description}`;
          }
          setAiSpeechText(speechText);
          speakWithElevenLabs(speechText);
        } else {
          if (triggerType === 'command') {
            let unableText = '';
            if (siteLang.startsWith('ar')) {
              unableText = 'لم أتمكن من التعرف على هذا المعلم بوضوح. يرجى توجيه الكاميرا بزاوية أوضح.';
            } else if (siteLang.startsWith('fr')) {
              unableText = "Je n'ai pas pu identifier clairement le monument. Veuillez pointer la caméra avec plus de clarté.";
            } else {
              unableText = "I couldn't identify this monument clearly. Please point your camera closer or under better lighting.";
            }
            setAiSpeechText(unableText);
            speakWithElevenLabs(unableText);
          } else {
            // Auto interval: if nothing clear is detected, silently revert to listening
            setCallStatus('listening');
          }
        }
      } catch (err) {
        console.error('[AI Guide Call] Vision analyze error:', err);
        setCallStatus('listening');
      } finally {
        isAnalyzingRef.current = false;
      }
    },
    [captureFrame, getSiteLanguage, speakWithElevenLabs]
  );

  // Command 2: Explain / Tell me more
  const handleExplainCommand = useCallback(async () => {
    const siteLang = getSiteLanguage();
    const currentMonument = lastResultRef.current;

    if (!currentMonument || !currentMonument.identified_name) {
      const promptText = siteLang.startsWith('ar')
        ? 'يرجى توجيه الكاميرا أولاً نحو المعلم والقول "صور" لأتمكن من رؤيته وشرحه لك.'
        : siteLang.startsWith('fr')
        ? 'Veuillez d\'abord pointer la caméra vers un monument et dire "photo" pour que je puisse vous l\'expliquer.'
        : 'Please point your camera at a monument and say "take photo" first so I can see it and explain.';
      setAiSpeechText(promptText);
      speakWithElevenLabs(promptText);
      return;
    }

    setCallStatus('analyzing');
    try {
      const res = await fetch('/api/ai-guide/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content:
                'Tell me captivating historical stories, secrets, architectural details, and significance of this monument in 2-3 concise sentences.',
            },
          ],
          context: currentMonument,
          language: siteLang,
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setAiSpeechText(data.reply);
        speakWithElevenLabs(data.reply);
      } else {
        setCallStatus('listening');
      }
    } catch {
      setCallStatus('listening');
    }
  }, [getSiteLanguage, speakWithElevenLabs]);

  // Command 3: Translate monument name to site language
  const handleTranslateCommand = useCallback(async () => {
    const siteLang = getSiteLanguage();
    const currentMonument = lastResultRef.current;

    if (!currentMonument || !currentMonument.identified_name) {
      const promptText = siteLang.startsWith('ar')
        ? 'وجّه الكاميرا نحو أي أثر أو قل "صور" أولاً لترجمة اسمه.'
        : 'Point your camera at an artifact or say "take photo" first to translate its name.';
      setAiSpeechText(promptText);
      speakWithElevenLabs(promptText);
      return;
    }

    setCallStatus('analyzing');
    try {
      const res = await fetch('/api/ai-guide/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `What is the authentic name, Arabic pronunciation, and meaning of "${currentMonument.identified_name}"? Provide a short, elegant translation in 2 sentences.`,
            },
          ],
          context: currentMonument,
          language: siteLang,
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setAiSpeechText(data.reply);
        speakWithElevenLabs(data.reply);
      } else {
        setCallStatus('listening');
      }
    } catch {
      setCallStatus('listening');
    }
  }, [getSiteLanguage, speakWithElevenLabs]);

  // General conversational query
  const handleGeneralQuestion = useCallback(
    async (query: string) => {
      const siteLang = getSiteLanguage();
      setCallStatus('analyzing');

      const ctx = lastResultRef.current || {
        identified_name: 'Egyptian Heritage Monument',
        ai_description: 'An ancient Egyptian archaeological landmark.',
        confidence_level: 'medium',
      };

      try {
        const res = await fetch('/api/ai-guide/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', content: query }],
            context: ctx,
            language: siteLang,
          }),
        });
        const data = await res.json();
        if (data.reply) {
          setAiSpeechText(data.reply);
          speakWithElevenLabs(data.reply);
        } else {
          setCallStatus('listening');
        }
      } catch {
        setCallStatus('listening');
      }
    },
    [getSiteLanguage, speakWithElevenLabs]
  );

  // Master speech dispatcher: interprets voice commands or general speech
  const handleUserSpeech = useCallback(
    (transcript: string) => {
      if (!transcript || !transcript.trim()) return;
      const text = transcript.trim();
      const lower = text.toLowerCase();
      setUserSpeechText(text);

      // 1. END CALL COMMANDS
      const endCallKeywords = [
        'انهي المكالمه',
        'انهي المكالمة',
        'إنهاء المكالمة',
        'انهاء المكالمة',
        'اقفل',
        'مع السلامة',
        'باي',
        'end call',
        'hang up',
        'goodbye',
        'bye',
        'stop call',
        'exit call',
        'termine l\'appel',
        'raccroche',
        'au revoir',
      ];
      if (endCallKeywords.some((kw) => lower.includes(kw))) {
        const siteLang = getSiteLanguage();
        const byeText = siteLang.startsWith('ar')
          ? 'مع السلامة! نتمنى لك رحلة ممتعة في مصر.'
          : siteLang.startsWith('fr')
          ? 'Au revoir ! Passez un excellent séjour en Égypte.'
          : 'Goodbye! Enjoy exploring Egypt.';
        setAiSpeechText(byeText);
        speakWithElevenLabs(byeText, () => endCall());
        return;
      }

      // 2. CAPTURE / PHOTO COMMANDS
      const photoKeywords = [
        'صور',
        'صوّر',
        'صورة',
        'التقط صورة',
        'شوف ده',
        'بص هنا',
        'انظر هنا',
        'انظر',
        'take photo',
        'photo',
        'look at this',
        'snap',
        'capture',
        'picture',
        'take a picture',
        'prends une photo',
        'regarde ça',
      ];
      if (photoKeywords.some((kw) => lower.includes(kw))) {
        const siteLang = getSiteLanguage();
        const ack = siteLang.startsWith('ar')
          ? 'حاضر، جاري التقاط الصورة والتعرف عليها...'
          : siteLang.startsWith('fr')
          ? 'Bien reçu, j\'analyse ce que vous regardez...'
          : 'Got it, looking at this right now...';
        setAiSpeechText(ack);
        speakWithElevenLabs(ack, () => {
          analyzeCurrentFrame('command');
        });
        return;
      }

      // 3. EXPLAIN / TELL ME MORE COMMANDS
      const explainKeywords = [
        'اشرح',
        'اشرحلي',
        'تفاصيل',
        'احكيلي',
        'معلومات اكثر',
        'معلومات أكثر',
        'كلمني عنه',
        'explain',
        'tell me more',
        'more details',
        'details',
        'tell me about it',
        'give me more info',
        'explique',
        'dis-m\'en plus',
        'plus de détails',
      ];
      if (explainKeywords.some((kw) => lower.includes(kw))) {
        handleExplainCommand();
        return;
      }

      // 4. TRANSLATE COMMANDS
      const translateKeywords = [
        'ترجم',
        'ترجمة',
        'ترجملي',
        'translate',
        'translation',
        'traduis',
        'traduction',
      ];
      if (translateKeywords.some((kw) => lower.includes(kw))) {
        handleTranslateCommand();
        return;
      }

      // 5. GENERAL QUESTION TO AI
      handleGeneralQuestion(text);
    },
    [
      getSiteLanguage,
      speakWithElevenLabs,
      endCall,
      analyzeCurrentFrame,
      handleExplainCommand,
      handleTranslateCommand,
      handleGeneralQuestion,
    ]
  );

  // Start Camera stream
  const startCamera = useCallback(async (mode: 'environment' | 'user') => {
    try {
      setCameraError(null);
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((track) => track.stop());
        cameraStreamRef.current = null;
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
      } catch {
        // Fallback for laptops / desktop webcams
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      cameraStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn('[AI Guide Call] Camera access error:', err);
      setCameraError(err.message || 'Camera permission denied');
    }
  }, []);

  // Switch camera front/back
  const toggleCameraFacing = useCallback(() => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  }, [facingMode, startCamera]);

  // Initialize SpeechRecognition API
  useEffect(() => {
    if (!isOpen) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    setSpeechSupported(true);
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;

    const siteLang = getSiteLanguage();
    recognition.lang = siteLang.startsWith('ar')
      ? 'ar-EG'
      : siteLang.startsWith('fr')
      ? 'fr-FR'
      : siteLang.startsWith('de')
      ? 'de-DE'
      : siteLang.startsWith('es')
      ? 'es-ES'
      : 'en-US';

    recognition.onresult = (event: any) => {
      if (isSpeakingRef.current || isMutedRef.current) return;
      const current = event.resultIndex;
      const transcript = event.results[current]?.[0]?.transcript;
      if (transcript && transcript.trim()) {
        handleUserSpeech(transcript.trim());
      }
    };

    recognition.onerror = (err: any) => {
      if (err.error !== 'no-speech' && err.error !== 'aborted') {
        console.warn('SpeechRecognition error:', err.error);
      }
    };

    recognition.onend = () => {
      // Auto-restart if call is still alive and AI isn't speaking
      if (isCallActiveRef.current && !isSpeakingRef.current && !isMutedRef.current) {
        try {
          recognition.start();
        } catch {
          /* ignore */
        }
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (err) {
      console.warn('Could not auto-start speech recognition:', err);
    }

    return () => {
      try {
        recognition.stop();
      } catch {
        /* ignore */
      }
    };
  }, [isOpen, getSiteLanguage, handleUserSpeech]);

  // Initialize Call & ElevenLabs Greeting
  useEffect(() => {
    if (isOpen) {
      isCallActiveRef.current = true;
      setCallStatus('connecting');
      setCallSeconds(0);
      setUserSpeechText('');
      setAiSpeechText('');
      setVoiceError(null);
      setLastResult(null);

      // Open camera automatically
      startCamera(facingMode);

      // Greeting in detected language
      const siteLang = getSiteLanguage();
      let welcome = '';
      if (siteLang.startsWith('ar')) {
        welcome = 'أهلاً بك! أنا مرشدك الذكي من EgyptX. وجّه الكاميرا نحو أي أثر أو قل "صور"، وتحدث معي بحرية.';
      } else if (siteLang.startsWith('fr')) {
        welcome = "Bonjour ! Je suis votre guide IA EgyptX. Pointez votre caméra vers un monument ou dites \"photo\", et posez-moi vos questions.";
      } else {
        welcome = "Hello! I'm your EgyptX AI Guide. Point your camera at any monument or say \"photo\", and feel free to talk with me.";
      }

      setAiSpeechText(welcome);

      const timer = setTimeout(() => {
        speakWithElevenLabs(welcome);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      endCall();
    }
  }, [isOpen, facingMode, getSiteLanguage, speakWithElevenLabs, startCamera, endCall]);

  // Call duration timer
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCallSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Automated vision check every 5 seconds
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      if (
        isCallActiveRef.current &&
        !isSpeakingRef.current &&
        !isAnalyzingRef.current &&
        !isMutedRef.current &&
        videoRef.current &&
        cameraStreamRef.current
      ) {
        analyzeCurrentFrame('auto');
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen, analyzeCurrentFrame]);

  // Format timer
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const isRTL = getSiteLanguage().startsWith('ar');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-[#030712] text-white flex flex-col justify-between overflow-hidden font-sans select-none"
      >
        {/* Hidden Canvas for Frame Capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Snapshot Flash Overlay */}
        <div
          className={`absolute inset-0 bg-white pointer-events-none z-50 transition-opacity duration-300 ${
            triggerFlash ? 'opacity-35' : 'opacity-0'
          }`}
        />

        {/* Background Atmospheric Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C9A84C]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-[#1B6B93]/15 rounded-full blur-[120px] pointer-events-none" />

        {/* ── TOP HEADER / STATUS BAR ────────────────────────────────────── */}
        <div className="relative z-20 px-6 pt-6 sm:pt-8 pb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C9A84C] to-[#1B6B93] p-[1px] shadow-[0_0_15px_rgba(201,168,76,0.4)]">
              <div className="w-full h-full bg-[#0A1628] rounded-[15px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#C9A84C]" />
              </div>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-wide text-white flex items-center gap-2">
                EgyptX Vision AI
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#C9A84C]/20 text-[#E2CB85] border border-[#C9A84C]/40">
                  ElevenLabs HD
                </span>
              </h2>
              <p className="text-xs text-white/50 font-mono tracking-wider">
                {formatTime(callSeconds)}
              </p>
            </div>
          </div>

          {/* Voice Personality Selector (Female, Male, Youth) */}
          <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-full px-2.5 py-1 backdrop-blur-md">
            <Volume2 className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
            <span className="text-[10px] font-semibold text-white/60 uppercase tracking-wider hidden sm:inline">
              Voice:
            </span>
            {VOICE_OPTIONS.map((v) => {
              const active = selectedVoice === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setSelectedVoice(v.id);
                    stopAudio();
                  }}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-[#C9A84C] text-[#0A1628] shadow-[0_0_12px_rgba(201,168,76,0.6)] font-bold'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {v.label}
                </button>
              );
            })}
          </div>

          {/* Status Indicator Pill */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border transition-all duration-300 ${
                isGeneratingVoice
                  ? 'bg-[#C9A84C]/25 border-[#C9A84C] text-[#E2CB85] animate-pulse shadow-[0_0_15px_rgba(201,168,76,0.4)]'
                  : callStatus === 'speaking'
                  ? 'bg-[#C9A84C]/20 border-[#C9A84C] text-[#E2CB85] shadow-[0_0_15px_rgba(201,168,76,0.3)]'
                  : callStatus === 'analyzing'
                  ? 'bg-blue-500/20 border-blue-400 text-blue-300 animate-pulse'
                  : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isGeneratingVoice
                    ? 'bg-[#C9A84C] animate-ping'
                    : callStatus === 'speaking'
                    ? 'bg-[#C9A84C] animate-ping'
                    : callStatus === 'analyzing'
                    ? 'bg-blue-400 animate-spin'
                    : 'bg-emerald-400 animate-pulse'
                }`}
              />
              <span>
                {isGeneratingVoice
                  ? isRTL
                    ? 'جاري توليد الصوت...'
                    : 'Generating voice...'
                  : callStatus === 'speaking'
                  ? isRTL
                    ? 'يتحدث المرشد...'
                    : 'Speaking...'
                  : callStatus === 'analyzing'
                  ? isRTL
                    ? 'جاري فحص المعلم...'
                    : 'Analyzing vision...'
                  : isRTL
                  ? 'يستمع إليك...'
                  : 'Listening...'}
              </span>
            </div>

            <button
              onClick={endCall}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
              title="Close call"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Voice Generation Error Banner (if any) */}
        {voiceError && (
          <div className="relative z-30 mx-6 p-2 rounded-xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-between text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{voiceError}</span>
            </div>
            <button
              onClick={() => setVoiceError(null)}
              className="p-1 hover:bg-white/10 rounded-md text-white/60 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ── CENTER AREA: AVATAR & CONVERSATION ──────────────────────────── */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 max-w-2xl mx-auto w-full text-center">
          {/* Identified Monument Banner (if identified) */}
          {lastResult?.identified_name && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 px-4 py-2 rounded-2xl bg-[#0A1628]/80 border border-[#C9A84C]/40 backdrop-blur-md shadow-[0_0_20px_rgba(201,168,76,0.2)] flex items-center gap-2.5"
            >
              <span className="text-base">📍</span>
              <div className="text-left">
                <p className="text-xs uppercase tracking-wider text-[#C9A84C] font-semibold">
                  Detected Monument
                </p>
                <p className="text-sm font-bold text-white">{lastResult.identified_name}</p>
              </div>
            </motion.div>
          )}

          {/* AI Avatar: Egyptian Eye + Glowing Soundwave Ripples */}
          <div className="relative mb-5 flex items-center justify-center">
            {/* Audio Ripples when Speaking */}
            {callStatus === 'speaking' && !isGeneratingVoice && (
              <>
                <motion.div
                  animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0.1, 0.6] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full border-2 border-[#C9A84C]/50 pointer-events-none"
                />
                <motion.div
                  animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0.05, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                  className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-[#C9A84C]/25 pointer-events-none"
                />
              </>
            )}

            {/* Pulsing Soundwaves when Generating Voice */}
            {isGeneratingVoice && (
              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute w-48 h-48 sm:w-60 sm:h-60 rounded-full border-2 border-dashed border-[#C9A84C] pointer-events-none"
              />
            )}

            {/* Breathing Halo when Listening */}
            {callStatus === 'listening' && (
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.7, 0.35] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-[#C9A84C]/15 blur-2xl pointer-events-none"
              />
            )}

            {/* Rotating Orbit when Analyzing */}
            {callStatus === 'analyzing' && (
              <div className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full border-2 border-dashed border-[#C9A84C] animate-spin pointer-events-none" />
            )}

            {/* Central Disc with Egyptian Eye of Horus */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-b from-[#162744] via-[#0A1628] to-[#040914] border-2 border-[#C9A84C] shadow-[0_0_40px_rgba(201,168,76,0.5)] flex items-center justify-center relative overflow-hidden backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-t from-[#C9A84C]/15 to-transparent pointer-events-none" />
              <EgyptianEyeIcon className="w-16 h-16 sm:w-20 sm:h-20 text-[#E2CB85] drop-shadow-[0_0_20px_rgba(201,168,76,0.85)]" />
            </div>
          </div>

          {/* Generating Voice Soundwave Indicator */}
          {isGeneratingVoice && (
            <div className="flex items-center justify-center gap-1.5 mb-3">
              <span className="w-1 h-3 bg-[#C9A84C] rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1 h-5 bg-[#E2CB85] rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1 h-4 bg-[#C9A84C] rounded-full animate-bounce [animation-delay:-0.2s]" />
              <span className="w-1 h-6 bg-[#E2CB85] rounded-full animate-bounce" />
              <span className="w-1 h-3 bg-[#C9A84C] rounded-full animate-bounce [animation-delay:-0.1s]" />
              <span className="text-[11px] font-mono text-[#E2CB85] ml-2">ElevenLabs Multilingual v2</span>
            </div>
          )}

          {/* Conversational Subtitles / Bubbles */}
          <div className="space-y-2.5 w-full max-w-lg min-h-[85px] flex flex-col justify-center">
            {aiSpeechText && (
              <motion.div
                key={aiSpeechText}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-black/45 border border-white/10 backdrop-blur-md text-sm md:text-base text-gray-200 leading-relaxed shadow-lg text-center"
              >
                <p className="text-white/90">{aiSpeechText}</p>
              </motion.div>
            )}

            {userSpeechText && (
              <motion.div
                key={userSpeechText}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block self-center px-3.5 py-1.5 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-xs md:text-sm text-[#E2CB85] font-medium"
              >
                🗣️ &ldquo;{userSpeechText}&rdquo;
              </motion.div>
            )}
          </div>

          {/* Quick Voice Command Suggestion Chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => handleUserSpeech(isRTL ? 'صور' : 'take photo')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-[#C9A84C]/20 border border-white/10 hover:border-[#C9A84C]/60 text-xs text-white/80 hover:text-[#E2CB85] transition-all cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>{isRTL ? '📸 "صور"' : '📸 "Take Photo"'}</span>
            </button>
            <button
              onClick={() => handleUserSpeech(isRTL ? 'اشرح' : 'explain')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-[#C9A84C]/20 border border-white/10 hover:border-[#C9A84C]/60 text-xs text-white/80 hover:text-[#E2CB85] transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>{isRTL ? '📖 "اشرح لي"' : '📖 "Explain"'}</span>
            </button>
            <button
              onClick={() => handleUserSpeech(isRTL ? 'ترجم' : 'translate')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-[#C9A84C]/20 border border-white/10 hover:border-[#C9A84C]/60 text-xs text-white/80 hover:text-[#E2CB85] transition-all cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>{isRTL ? '🌐 "ترجم"' : '🌐 "Translate"'}</span>
            </button>
            <button
              onClick={() => handleUserSpeech(isRTL ? 'انهي المكالمه' : 'end call')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 text-xs text-white/70 hover:text-red-300 transition-all cursor-pointer"
            >
              <PhoneOff className="w-3.5 h-3.5 text-red-400" />
              <span>{isRTL ? '❌ "انهي المكالمة"' : '❌ "End Call"'}</span>
            </button>
          </div>
        </div>

        {/* ── USER CAMERA PREVIEW (Small Thumbnail in Corner) ──────────────── */}
        <div className="absolute bottom-28 right-4 sm:bottom-28 sm:right-8 z-30">
          <div className="relative w-32 h-44 sm:w-40 sm:h-52 rounded-2xl overflow-hidden border-2 border-[#C9A84C]/80 shadow-[0_0_25px_rgba(0,0,0,0.85)] bg-black/90">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Camera Overlay Badges */}
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
              <span className="inline-flex items-center gap-1 text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/70 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Vision
              </span>
            </div>

            {/* Flip Camera Button */}
            <button
              type="button"
              onClick={toggleCameraFacing}
              className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/20 transition-colors cursor-pointer"
              title="Switch Camera"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Tap to Snap Button directly on camera */}
            <button
              type="button"
              onClick={() => analyzeCurrentFrame('command')}
              className="absolute bottom-2 left-2 p-1.5 rounded-lg bg-[#C9A84C]/80 hover:bg-[#C9A84C] text-black border border-white/20 transition-colors cursor-pointer"
              title="Take Photo Now"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>

            {cameraError && (
              <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-2 text-center">
                <AlertCircle className="w-5 h-5 text-amber-400 mb-1" />
                <p className="text-[10px] text-gray-300 leading-tight">{cameraError}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── BOTTOM CALL CONTROLS BAR ────────────────────────────────────── */}
        <div className="relative z-20 px-6 pb-6 pt-3 flex flex-col items-center gap-3">
          {/* Fallback Text Input Toggle (if speech isn't supported or noisy) */}
          <AnimatePresence>
            {showInputDrawer && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="w-full max-w-md flex items-center gap-2 p-2 bg-[#0A1628]/95 border border-[#C9A84C]/30 rounded-2xl shadow-xl"
              >
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && manualInput.trim()) {
                      handleUserSpeech(manualInput.trim());
                      setManualInput('');
                    }
                  }}
                  placeholder={isRTL ? 'اكتب سؤالك هنا...' : 'Type your question...'}
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
                />
                <button
                  onClick={() => {
                    if (manualInput.trim()) {
                      handleUserSpeech(manualInput.trim());
                      setManualInput('');
                    }
                  }}
                  className="p-2 rounded-xl bg-[#C9A84C] text-black hover:bg-[#E3C973] transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Action Buttons */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Mute Mic Button */}
            <button
              onClick={() => setIsMuted((m) => !m)}
              className={`p-4 rounded-full border transition-all duration-200 cursor-pointer ${
                isMuted
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
              }`}
              title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Snap Photo Button */}
            <button
              onClick={() => analyzeCurrentFrame('command')}
              className="p-4 rounded-full bg-[#C9A84C]/20 hover:bg-[#C9A84C]/35 border border-[#C9A84C] text-[#E2CB85] shadow-[0_0_15px_rgba(201,168,76,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Take Photo Now"
            >
              <Camera className="w-5 h-5" />
            </button>

            {/* Red Hang-up Button */}
            <button
              onClick={endCall}
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.7)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              title="End Call"
            >
              <PhoneOff className="w-7 h-7" />
            </button>

            {/* Type fallback toggle */}
            <button
              onClick={() => setShowInputDrawer((v) => !v)}
              className={`p-4 rounded-full border transition-all duration-200 cursor-pointer ${
                showInputDrawer
                  ? 'bg-[#C9A84C]/25 border-[#C9A84C] text-[#E2CB85]'
                  : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
              }`}
              title="Toggle Text Input"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
