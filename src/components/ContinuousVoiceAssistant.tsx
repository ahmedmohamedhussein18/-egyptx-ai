'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Bot, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ContinuousVoiceAssistant() {
  const router = useRouter();
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);
  const restartTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastCmdTime = useRef<number>(0);

  // Futuristic Mobile Widget State
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListeningUI, setIsListeningUI] = useState(false);

  // ── TEXT NORMALIZATION HELPER ──
  const normalizeText = (text: string): string => {
    if (!text) return '';
    let normalized = text.toLowerCase().trim();

    // 1. Replace ['أ','إ','آ'] with 'ا'
    normalized = normalized.replace(/[أإآ]/g, 'ا');

    // 2. Replace 'ة' with 'ه', and 'ى' with 'ي'
    normalized = normalized.replace(/ة/g, 'ه').replace(/ى/g, 'ي');

    // 3. Remove Arabic diacritics / tashkeel
    normalized = normalized.replace(/[\u064B-\u065F\u0670]/g, '');

    // 4. Remove 'ال' prefix from words (start of string or after whitespace)
    normalized = normalized.replace(/(^|\s)ال/g, '$1');

    // 5. Trim spaces and punctuation
    normalized = normalized.replace(/[.,/#!$%^&*;:{}=\-_`~()؟?،!]/g, ' ');
    normalized = normalized.replace(/\s+/g, ' ').trim();

    return normalized;
  };

  // Helper for voice feedback (used ONLY for navigation confirmation and AI planner, NEVER on scroll or click)
  const speak = (text: string, lang: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang.startsWith('ar') ? 'ar-EG' : 'en-US';
    utterance.rate = 0.95;

    const applyVoiceAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      let selectedVoice: SpeechSynthesisVoice | null = null;

      if (lang.startsWith('ar')) {
        selectedVoice =
          voices.find(v => v.name.includes('Google') && v.lang.startsWith('ar')) ||
          voices.find(v => v.lang.startsWith('ar')) ||
          null;
      } else {
        selectedVoice =
          voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) ||
          voices.find(v => v.lang.startsWith('en')) ||
          null;
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      applyVoiceAndSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        applyVoiceAndSpeak();
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  };

  const processCommand = (rawTranscript: string) => {
    // ── 1. ZERO-LAG & STRICT DEBOUNCING: 2000ms Lock ──
    const now = Date.now();
    if (now - lastCmdTime.current < 2000) return;

    const raw = rawTranscript.trim();
    const norm = normalizeText(raw);
    const currentLang = document.documentElement.lang || 'en';
    const isAr = currentLang.startsWith('ar');

    // ── 2. STRICT WAKE-WORD / INTENT ENFORCEMENT ──
    // Must contain action verbs ("افتح", "اختار", "دوس", "اضغط", "open", "click", "select", "choose"),
    // navigation verbs ("انزل", "تحت", "اطلع", "فوق", "ارجع", "خلف", "مخطط", "اخبار", "استكشاف", "رئيسي", "scroll", "back", "news", "planner", "explore", "home"),
    // or planner verbs ("رحل", "سفر", "ميزاني", "ايام", "trip", "budget", "days").
    const hasClickVerb =
      norm.includes('افتح') ||
      norm.includes('اختار') ||
      norm.includes('دوس') ||
      norm.includes('اضغط') ||
      norm.includes('انقر') ||
      norm.includes('click') ||
      norm.includes('open') ||
      norm.includes('select') ||
      norm.includes('choose');

    const hasNavScrollVerb =
      norm.includes('انزل') ||
      norm.includes('تحت') ||
      norm.includes('اطلع') ||
      norm.includes('فوق') ||
      norm.includes('scroll') ||
      norm.includes('ارجع') ||
      norm.includes('خلف') ||
      norm.includes('back') ||
      norm.includes('مخطط') ||
      norm.includes('planner') ||
      norm.includes('اخبار') ||
      norm.includes('news') ||
      norm.includes('استكشاف') ||
      norm.includes('اكتشف') ||
      norm.includes('explore') ||
      norm.includes('رئيسي') ||
      norm.includes('home');

    const hasPlannerVerb =
      norm.includes('رحل') ||
      norm.includes('سفر') ||
      norm.includes('ميزاني') ||
      norm.includes('دولار') ||
      norm.includes('جنيه') ||
      norm.includes('trip') ||
      norm.includes('budget') ||
      (norm.includes('ايام') && norm.includes('لمده')) ||
      (norm.includes('days') && norm.includes('for'));

    // IF NONE OF THESE STRICT VERBS/INTENTS EXIST, IGNORE COMPLETELY (Prevents ambient noise misfires)
    if (!hasClickVerb && !hasNavScrollVerb && !hasPlannerVerb) {
      return;
    }

    // ── 5. AI PLANNER FORM FILLING (Magic Fill) ──
    if (hasPlannerVerb) {
      let extractedCountry = '';
      let extractedDays = 0;
      let extractedBudget = 0;

      // Extract Destination / Country: after "من", "إلى", "الى", "from", "to"
      const countryMatch =
        raw.match(/(?:من|from)\s+([^\s,،.]+)/i) ||
        raw.match(/(?:إلى|الى|to)\s+([^\s,،.]+)/i);
      if (countryMatch && countryMatch[1]) {
        extractedCountry = countryMatch[1].trim();
      }

      // Extract Days: number near "أيام", "ايام", "يوم", or "days" / "day"
      const daysMatch =
        raw.match(/(\d+)\s*(?:أيام|ايام|يوم|days?)/i) ||
        raw.match(/(?:لمدة|خلال|for)\s*(\d+)/i);

      if (daysMatch && daysMatch[1]) {
        extractedDays = parseInt(daysMatch[1], 10);
      } else {
        const wordsMap: Record<string, number> = {
          يوم: 1,
          يومين: 2,
          ثلاثه: 3,
          ثلاث: 3,
          اربعه: 4,
          اربع: 4,
          خمسه: 5,
          خمس: 5,
          سته: 6,
          ست: 6,
          سبعه: 7,
          سبع: 7,
          ثمانيه: 8,
          ثماني: 8,
          تسعه: 9,
          تسع: 9,
          عشره: 10,
          عشر: 10
        };
        for (const [w, count] of Object.entries(wordsMap)) {
          if (norm.includes(w)) {
            extractedDays = count;
            break;
          }
        }
      }

      // Extract Budget: number near "دولار", "جنيه", "budget", "dollars", or after "ميزانية"
      const budgetMatch =
        raw.match(/(\d+[\d,.]*)\s*(?:دولار|جنيه|dollars?|le|\$|budget)/i) ||
        raw.match(/(?:ميزانية|ميزانيه|budget|بميزانية|بميزانيه)\s*(?:قدرها|of)?\s*(\d+[\d,.]*)/i);

      if (budgetMatch && budgetMatch[1]) {
        extractedBudget = parseFloat(budgetMatch[1].replace(/,/g, '')) || 0;
      }

      if (extractedCountry || extractedDays > 0 || extractedBudget > 0) {
        lastCmdTime.current = now;
        window.dispatchEvent(
          new CustomEvent('voice-fill-planner', {
            detail: {
              country: extractedCountry,
              days: extractedDays,
              budget: extractedBudget,
              raw
            }
          })
        );

        speak(
          isAr ? 'جاري تخطيط رحلتك الذكية' : 'Planning your smart journey',
          currentLang
        );
        return;
      }
    }

    // ── 1. SILENT SCROLLING (ZERO-LAG, NO TTS) ──
    if (norm.includes('انزل') || norm.includes('تحت') || norm.includes('scroll down') || norm.includes('down')) {
      lastCmdTime.current = now;
      window.scrollBy({ top: 700, behavior: 'smooth' });
      return;
    }

    if (norm.includes('اطلع') || norm.includes('فوق') || norm.includes('scroll up') || norm.includes('up')) {
      lastCmdTime.current = now;
      window.scrollBy({ top: -700, behavior: 'smooth' });
      return;
    }

    // ── NAVIGATION ROUTING ──
    if (norm.includes('ارجع') || norm.includes('خلف') || norm.includes('go back') || norm.includes('back')) {
      lastCmdTime.current = now;
      router.back();
      speak(isAr ? 'جاري العودة للخلف' : 'Going back', currentLang);
      return;
    }

    if (norm.includes('مخطط') || norm.includes('planner')) {
      lastCmdTime.current = now;
      router.push('/planner');
      speak(isAr ? 'جاري الانتقال إلى المخطط' : 'Navigating to planner', currentLang);
      return;
    }

    if (norm.includes('اخبار') || norm.includes('news')) {
      lastCmdTime.current = now;
      router.push('/news');
      speak(isAr ? 'جاري الانتقال إلى الأخبار' : 'Navigating to news', currentLang);
      return;
    }

    if (norm.includes('استكشاف') || norm.includes('اكتشف') || norm.includes('explore')) {
      lastCmdTime.current = now;
      router.push('/explore');
      speak(isAr ? 'جاري الانتقال إلى الاستكشاف' : 'Navigating to explore', currentLang);
      return;
    }

    if (norm.includes('رئيسي') || norm.includes('home')) {
      lastCmdTime.current = now;
      router.push('/');
      speak(isAr ? 'جاري الانتقال إلى الصفحة الرئيسية' : 'Navigating to home page', currentLang);
      return;
    }

    // ── VIDEO PLAYING INTENT ──
    if (norm.includes('فيديو') || norm.includes('شغل') || norm.includes('video')) {
      // Query for common play button selectors, video tags, or interactive SVGs
      const playElement = document.querySelector<HTMLElement>(
        'video, [class*="play" i], [aria-label*="play" i], [aria-label*="تشغيل" i], .cursor-pointer svg, button svg'
      );

      if (playElement) {
        lastCmdTime.current = now;
        const targetEl = (playElement.closest('button, a, div.cursor-pointer') || playElement) as HTMLElement;
        targetEl.click();
        return; // Exit after playing the video
      }
    }

    // ── 3. SPATIAL VR & CARD CONTROL + 4. TEXT-BASED CLICKING ──
    if (hasClickVerb) {
      // a) Spatial / Positional matching:
      // Map positional words: "الاول" -> 0, "التاني/الثاني" -> 1, "التالت/الثالث" -> 2, "الرابع" -> 3, etc.
      let targetIndex = -1;
      if (norm.includes('اول') || norm.includes('first') || norm.includes('1')) {
        targetIndex = 0;
      } else if (norm.includes('تاني') || norm.includes('ثاني') || norm.includes('second') || norm.includes('2')) {
        targetIndex = 1;
      } else if (norm.includes('تالت') || norm.includes('ثالث') || norm.includes('third') || norm.includes('3')) {
        targetIndex = 2;
      } else if (norm.includes('رابع') || norm.includes('fourth') || norm.includes('4')) {
        targetIndex = 3;
      } else if (norm.includes('خامس') || norm.includes('fifth') || norm.includes('5')) {
        targetIndex = 4;
      } else if (norm.includes('سادس') || norm.includes('sixth') || norm.includes('6')) {
        targetIndex = 5;
      }

      if (targetIndex !== -1) {
        // Query cards, video wrappers, and main interactive items
        let items = Array.from(
          document.querySelectorAll<HTMLElement>(
            'img, video, .video-card, [role="button"], div.cursor-pointer, .clickable, button, a'
          )
        ).filter(el => {
          // Filter out tiny or invisible elements (header icons, empty buttons)
          const rect = el.getBoundingClientRect();
          return rect.width > 30 && rect.height > 30;
        });

        // Directional handling ("شمال" / "left", "يمين" / "right")
        const isRtl = document.documentElement.dir === 'rtl' || isAr;
        const wantsRight = norm.includes('يمين') || norm.includes('right');
        const wantsLeft = norm.includes('شمال') || norm.includes('يسار') || norm.includes('left');

        if (wantsRight) {
          // If RTL, first from right is natural order 0; if LTR, reverse
          if (!isRtl) items = items.reverse();
        } else if (wantsLeft) {
          // If RTL, first from left is reversed
          if (isRtl) items = items.reverse();
        }

        if (items[targetIndex]) {
          lastCmdTime.current = now;
          const targetEl = (items[targetIndex].closest('button, a, div.cursor-pointer, [role="button"]') || items[targetIndex]) as HTMLElement;
          targetEl.focus();
          targetEl.click();
          // NO TTS confirmation on clicks (Silent execution to prevent lag)
          return;
        }
      }

      // b) Text-Based Strict Clicking:
      // Extract target phrase after the verb
      const clickTriggers = [
        'اضغط علي', 'اضغط على', 'اضغط',
        'دوس علي', 'دوس على', 'دوس',
        'افتح', 'اختار', 'انقر علي', 'انقر على',
        'click on', 'click', 'choose', 'select', 'open'
      ];
      let clickTarget = '';

      for (const trigger of clickTriggers) {
        const idx = raw.toLowerCase().indexOf(trigger);
        if (idx !== -1) {
          clickTarget = raw.slice(idx + trigger.length).trim();
          break;
        }
      }

      if (clickTarget) {
        const normalizedTarget = normalizeText(clickTarget);
        // Exclude broad non-specific words like "فيديو", "كارت", "صفحة" if alone
        if (normalizedTarget && normalizedTarget !== 'فيديو' && normalizedTarget !== 'صوره' && normalizedTarget !== 'حاجه') {
          const candidates = Array.from(
            document.querySelectorAll<HTMLElement>(
              'button, a, [role="button"], [role="option"], [role="combobox"], [role="checkbox"], li, input, select, label, img, div.cursor-pointer, .clickable'
            )
          );

          for (const el of candidates) {
            const rawElText = (
              el.textContent ||
              el.getAttribute('aria-label') ||
              el.getAttribute('placeholder') ||
              el.getAttribute('alt') ||
              (el as HTMLInputElement).value ||
              ''
            ).toLowerCase();

            const normElText = normalizeText(rawElText);

            if (normElText && (normElText.includes(normalizedTarget) || normalizedTarget.includes(normElText))) {
              lastCmdTime.current = now;
              const targetEl = (el.closest('button, a, li, label, [role="option"], div.cursor-pointer') || el) as HTMLElement;
              targetEl.focus();
              targetEl.click();
              // NO TTS confirmation on clicks (Silent execution to prevent lag)
              return;
            }
          }
        }
      }
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      const resultsLen = event.results.length;
      const lastResult = event.results[resultsLen - 1];

      if (lastResult && lastResult.isFinal && lastResult[0]) {
        const confidence = typeof lastResult[0].confidence === 'number' ? lastResult[0].confidence : 1;
        // Strict noise rejection threshold: confidence must be >= 0.75
        if (confidence > 0 && confidence < 0.75) {
          return;
        }

        const transcript = lastResult[0].transcript;
        processCommand(transcript);
      }
    };

    recognition.onstart = () => {
      setIsListeningUI(true);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        isListeningRef.current = false;
        setIsListeningUI(false);
        console.warn('SpeechRecognition: Microphone access blocked.');
      }
    };

    // onend restart guard with 500ms delay and isListening check
    recognition.onend = () => {
      // If listening was stopped intentionally, update the UI state
      if (!isListeningRef.current) {
        setIsListeningUI(false);
      } else {
        if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
        restartTimerRef.current = setTimeout(() => {
          if (isListeningRef.current && recognitionRef.current) {
            try {
              const currentLang = document.documentElement.lang || 'en';
              recognitionRef.current.lang = currentLang.startsWith('ar') ? 'ar-EG' : 'en-US';
              recognitionRef.current.start();
            } catch {
              // Ignore if already active
            }
          }
        }, 500);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + 2: Start continuous listening
      if (e.altKey && e.key === '2') {
        e.preventDefault();
        window.speechSynthesis.cancel();
        isListeningRef.current = true;
        setIsListeningUI(true);

        const currentLang = document.documentElement.lang || 'en';
        if (recognitionRef.current) {
          recognitionRef.current.lang = currentLang.startsWith('ar') ? 'ar-EG' : 'en-US';
          try {
            recognitionRef.current.start();
            speak(
              currentLang.startsWith('ar') ? 'المساعد الصوتي يستمع إليك' : 'Voice assistant is listening',
              currentLang
            );
          } catch {
            recognitionRef.current.stop();
          }
        }
      }

      // Alt + 3: Hard-stop recognition and TTS
      if (e.altKey && e.key === '3') {
        e.preventDefault();
        isListeningRef.current = false;
        setIsListeningUI(false);
        if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
        if (recognitionRef.current) {
          try {
            recognitionRef.current.abort();
          } catch {}
        }
        window.speechSynthesis.cancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      isListeningRef.current = false;
      setIsListeningUI(false);
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  // Touch & Mobile AI Toggle Handler
  const toggleListening = () => {
    if (isListeningRef.current) {
      // Stop (matches Alt+3)
      isListeningRef.current = false;
      setIsListeningUI(false);
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      window.speechSynthesis.cancel();
    } else {
      // Start (matches Alt+2)
      window.speechSynthesis.cancel();
      isListeningRef.current = true;
      setIsListeningUI(true);

      const currentLang = document.documentElement.lang || 'en';
      if (recognitionRef.current) {
        recognitionRef.current.lang = currentLang.startsWith('ar') ? 'ar-EG' : 'en-US';
        try {
          recognitionRef.current.start();
          speak(
            currentLang.startsWith('ar') ? 'المساعد الصوتي يستمع إليك' : 'Voice assistant is listening',
            currentLang
          );
        } catch {
          recognitionRef.current.stop();
        }
      }
    }
  };

  return (
    <div
      className={`fixed top-2/3 right-0 -translate-y-1/2 z-[9999] flex md:hidden items-center transition-transform duration-300 ease-in-out ${
        isExpanded ? 'translate-x-0' : 'translate-x-[62px]'
      }`}
    >
      {/* Slide-out Edge Tab Handle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="Toggle AI assistant widget"
        className="w-8 h-14 bg-[#060E1A]/95 border-y border-l border-[#C9A84C]/50 rounded-l-2xl flex items-center justify-center text-[#C9A84C] shadow-[-4px_0_20px_rgba(0,0,0,0.6)] backdrop-blur-xl active:scale-95 transition-all"
      >
        {isExpanded ? (
          <ChevronRight className="w-5 h-5 text-[#C9A84C]" />
        ) : (
          <ChevronLeft className="w-5 h-5 text-[#C9A84C] animate-pulse" />
        )}
      </button>

      {/* Futuristic AI Control Orb Container */}
      <div className="bg-[#060E1A]/95 border-y border-r border-[#C9A84C]/40 p-2.5 shadow-2xl backdrop-blur-xl flex items-center justify-center">
        <button
          onClick={toggleListening}
          aria-label={isListeningUI ? 'إيقاف المساعد الذكي (Stop AI)' : 'تشغيل المساعد الذكي (Start AI)'}
          className="relative group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 focus:outline-none"
        >
          {/* Active Listening: Glowing Multi-Layer Radar Ripple Effect */}
          {isListeningUI && (
            <>
              {/* Outer Golden/Cyan Ping Ring */}
              <span className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#C9A84C]/50 via-amber-400/40 to-cyan-400/50 animate-ping pointer-events-none" />
              {/* Inner Pulsing Radar Aura */}
              <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#C9A84C] to-amber-300 opacity-60 blur-sm animate-pulse pointer-events-none" />
              {/* Spinning Subtle Halo */}
              <span className="absolute inset-0 rounded-full border border-amber-300/80 animate-spin pointer-events-none" style={{ animationDuration: '3s' }} />
            </>
          )}

          {/* AI Core Orb Body */}
          <div
            className={`relative z-10 w-full h-full rounded-full flex items-center justify-center border transition-all duration-500 shadow-xl ${
              isListeningUI
                ? 'bg-gradient-to-tr from-[#0F2238] via-[#1B3654] to-[#0A1628] border-amber-400 text-amber-300 shadow-[0_0_25px_rgba(234,179,8,0.8)] scale-105'
                : 'bg-gradient-to-tr from-[#0A1628] via-[#0F2238] to-[#060E1A] border-[#C9A84C]/40 text-[#C9A84C] hover:border-[#C9A84C] hover:shadow-[0_0_18px_rgba(201,168,76,0.4)] active:scale-95'
            }`}
          >
            {isListeningUI ? (
              <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
            ) : (
              <Bot className="w-6 h-6 text-[#C9A84C] group-hover:scale-110 transition-transform" />
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
