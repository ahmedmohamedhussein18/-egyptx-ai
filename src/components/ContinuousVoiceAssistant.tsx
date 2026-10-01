'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';



export default function ContinuousVoiceAssistant() {
  const router = useRouter();
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);
  const restartTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastCmdTime = useRef<number>(0);

  // Futuristic Mobile Widget State
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListeningUI, setIsListeningUI] = useState(false);

  // ── 1. DYNAMIC MULTILINGUAL RECOGNITION (The "Ears") ──
  const updateRecognitionLanguage = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return 'en-US';
    const htmlLang = document.documentElement.lang.toLowerCase();
    const url = window.location.href.toLowerCase();
    if (htmlLang.includes('fr') || url.includes('/fr')) return 'fr-FR';
    if (htmlLang.includes('ar') || url.includes('/ar')) return 'ar-EG';
    return 'en-US';
  };

  // Helper for restarting recognition cleanly
  const startRecognition = () => {
    if (!isListeningRef.current || !recognitionRef.current) return;
    try {
      recognitionRef.current.lang = updateRecognitionLanguage();
      recognitionRef.current.start();
    } catch {
      // Ignore if already active
    }
  };



  // Trilingual TTS Greeting before starting mic (Premium Voice Selection & Arabic Fallback)
  const playGreeting = (): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        resolve();
        return;
      }

      const synth = window.speechSynthesis;
      synth.cancel();

      let hasResolved = false;
      const safeResolve = () => {
        if (!hasResolved) {
          hasResolved = true;
          resolve();
        }
      };

      const speak = () => {
        const voices = synth.getVoices();
        const htmlLang = (typeof document !== 'undefined' && document.documentElement.lang?.toLowerCase()) || 'en';
        const utterance = new SpeechSynthesisUtterance();

        // Helper to find the most modern, natural-sounding AI voice available
        const getPremiumVoice = (langCode: string) => {
          const available = voices.filter(v => v.lang.toLowerCase().includes(langCode));
          if (!available.length) return null;
          // Prioritize Neural, Online, Google, or Apple Siri voices for that modern AI feel
          return (
            available.find(v => 
              v.name.includes('Natural') || 
              v.name.includes('Online') || 
              v.name.includes('Google') || 
              v.name.includes('Siri')
            ) || available[0]
          );
        };

        if (htmlLang.includes('ar')) {
          // Phonetic spelling so the Arabic TTS pronounces "EgyptX AI" correctly and elegantly
          utterance.text = "مرحباً بك في إيجيبت إكس إيه آي، كيف يمكنني مساعدتك اليوم؟";
          utterance.lang = 'ar-SA';
          utterance.voice = getPremiumVoice('ar');
        } else if (htmlLang.includes('fr')) {
          utterance.text = "Bienvenue sur EgyptX AI, comment puis-je vous aider aujourd'hui ?";
          utterance.lang = 'fr-FR';
          utterance.voice = getPremiumVoice('fr');
        } else {
          // Spaced out so English TTS pronounces A-I as letters, not a word
          utterance.text = "Welcome to Egypt X A. I., how can I help you today?";
          utterance.lang = 'en-US';
          utterance.voice = getPremiumVoice('en');
        }

        // If no voice is found for the language (e.g., Arabic missing from OS), resolve immediately to prevent freezing
        if (htmlLang.includes('ar') && !utterance.voice) {
          console.warn("Arabic TTS voice not found on this device.");
          safeResolve();
          return;
        }

        utterance.rate = 1.05; // Slightly faster for a snappier, modern feel
        utterance.pitch = 1.1; // Slightly higher pitch for a friendlier tone

        utterance.onend = safeResolve;
        utterance.onerror = safeResolve;
        synth.speak(utterance);
      };

      if (synth.getVoices().length > 0) {
        speak();
      } else {
        synth.onvoiceschanged = speak;
        setTimeout(safeResolve, 800); // Safety fallback
      }
    });
  };

  // Central activation and deactivation
  const activateAssistant = async () => {
    isListeningRef.current = true;
    setIsListeningUI(true);
    await playGreeting();
    if (isListeningRef.current) {
      startRecognition();
    }
  };

  const deactivateAssistant = () => {
    isListeningRef.current = false;
    setIsListeningUI(false);
    if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

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

    // 4. Remove 'ال' prefix from words
    normalized = normalized.replace(/(^|\s)ال/g, '$1');

    // 5. Trim spaces and punctuation
    normalized = normalized.replace(/[.,/#!$%^&*;:{}=\-_`~()؟?،!]/g, ' ');
    normalized = normalized.replace(/\s+/g, ' ').trim();

    return normalized;
  };

  // ── 6. ZERO-LAG INTENT ENGINE & DEBOUNCING ──
  const processCommand = (rawTranscript: string) => {
    // Strict Debounce: 2000ms
    const now = Date.now();
    if (now - lastCmdTime.current < 2000) return;
    lastCmdTime.current = now;

    const raw = rawTranscript.trim();
    const norm = normalizeText(raw);
    const htmlLang = (document.documentElement.lang || 'en').toLowerCase();
    const isAr = htmlLang.includes('ar');

    // ── 6a. CLOSE AI INTENT ──
    if (
      norm.includes('اقفل المساعد') ||
      norm.includes('اغلق المساعد') ||
      norm.includes('اقفل الصوت') ||
      norm.includes('stop ai') ||
      norm.includes('close ai') ||
      norm.includes('fermer ia') ||
      norm.includes('fermer assistant') ||
      norm.includes('arrete assistant') ||
      norm.includes('arrête assistant')
    ) {
      deactivateAssistant();
      return;
    }

    // ── 6b. CLOSE MODAL / CARD INTENT ──
    if (
      norm.includes('اقفل الكارت') ||
      norm.includes('اغلق الكارت') ||
      norm.includes('اقفل النافذة') ||
      norm.includes('اغلق النافذة') ||
      norm.includes('اقفل المودال') ||
      norm.includes('close card') ||
      norm.includes('close modal') ||
      norm.includes('fermer la carte') ||
      norm.includes('fermer le modal')
    ) {
      const closeBtn = document.querySelector<HTMLElement>(
        'button[aria-label*="close" i], button[aria-label*="إغلاق" i], button[aria-label*="fermer" i], .modal-close, [role="dialog"] button'
      );
      if (closeBtn) {
        closeBtn.click();
      } else {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      }
      return;
    }

    // General Stop / Close command
    if (
      norm === 'اقفل' ||
      norm === 'اغلق' ||
      norm === 'close' ||
      norm === 'stop' ||
      norm === 'fermer' ||
      norm === 'arrete' ||
      norm === 'arrête'
    ) {
      const closeBtn = document.querySelector<HTMLElement>(
        'button[aria-label*="close" i], button[aria-label*="إغلاق" i], button[aria-label*="fermer" i], .modal-close'
      );
      if (closeBtn) {
        closeBtn.click();
      } else {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        deactivateAssistant();
      }
      return;
    }

    // ── AI PLANNER INTELLIGENT ROUTING ──
    const normalizedTranscript = norm;
    if (typeof window !== 'undefined' && window.location.pathname.includes('/planner')) {
      let matched = false;

      // 1. Handle Number Inputs (Travelers & Budget)
      // Extracts digits from voice command (e.g., "5 travelers", "budget 2000")
      const numbers = normalizedTranscript.match(/\d+/g);
      
      if (normalizedTranscript.includes('traveler') || normalizedTranscript.includes('مسافر') || normalizedTranscript.includes('اشخاص') || normalizedTranscript.includes('افراد')) {
        const travelerInput = document.querySelector<HTMLInputElement>('input[placeholder*="Traveler" i], input[type="number"]:first-of-type');
        if (travelerInput && numbers) {
          const val = numbers[0];
          const proto = Object.getPrototypeOf(travelerInput);
          const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
          if (setter) setter.call(travelerInput, val);
          else travelerInput.value = val;
          travelerInput.dispatchEvent(new Event('input', { bubbles: true }));
          travelerInput.dispatchEvent(new Event('change', { bubbles: true }));
          matched = true;
        }
      }

      if (normalizedTranscript.includes('budget') || normalizedTranscript.includes('ميزانية') || normalizedTranscript.includes('ميزانيه')) {
        const budgetInput = document.querySelector<HTMLInputElement>('input[placeholder*="Budget" i], input[placeholder*="500" i], input[type="text"]');
        if (budgetInput && numbers) {
          const val = numbers[numbers.length - 1]; // usually the last number in "budget is 2000"
          const proto = Object.getPrototypeOf(budgetInput);
          const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
          if (setter) setter.call(budgetInput, val);
          else budgetInput.value = val;
          budgetInput.dispatchEvent(new Event('input', { bubbles: true }));
          budgetInput.dispatchEvent(new Event('change', { bubbles: true }));
          matched = true;
        }
      }

      // 2. Handle Trip Duration Slider (Days)
      // E.g., "5 days" or "خمس ايام" (Fallback handling for single digit if no match)
      if (normalizedTranscript.includes('day') || normalizedTranscript.includes('يوم') || normalizedTranscript.includes('ايام')) {
        const slider = document.querySelector<HTMLInputElement>('input[type="range"]');
        if (slider && numbers) {
          const val = numbers[0];
          const proto = Object.getPrototypeOf(slider);
          const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
          if (setter) setter.call(slider, val);
          else slider.value = val;
          slider.dispatchEvent(new Event('input', { bubbles: true }));
          slider.dispatchEvent(new Event('change', { bubbles: true }));
          // Dispatch custom event to sync separated React state directly
          window.dispatchEvent(new CustomEvent('update-duration-slider', { detail: numbers[0] }));
          matched = true;
        }
      }

      // 3. Handle Travel Style Cards (Robust React Click)
      const styles = [
        { keys: ['solo', 'independent', 'وحدي', 'سولو', 'مفرد'], selector: 'Solo' },
        { keys: ['couple', 'romantic', 'زوجين', 'كابل', 'رومانسي'], selector: 'Couple' },
        { keys: ['family', 'kids', 'عائلة', 'اسرة', 'أطفال'], selector: 'Family' },
        { keys: ['group', 'friends', 'مجموعة', 'اصدقاء', 'جروب'], selector: 'Group' }
      ];

      styles.forEach(style => {
        if (style.keys.some(k => normalizedTranscript.includes(k))) {
          // Find all potential text containers
          const elements = Array.from(document.querySelectorAll<HTMLElement>('h3, h4, span, p, div, button'));
          // Find the specific element that matches the text
          const target = elements.find(el => el.textContent?.trim().toLowerCase() === style.selector.toLowerCase()) ||
                         elements.find(el => el.textContent?.toLowerCase().includes(style.selector.toLowerCase()));
          
          if (target) {
            // Find the parent card container (button, cursor-pointer, role="button", or element itself)
            const clickableCard = (target.closest('button, .cursor-pointer, [role="button"]') || target) as HTMLElement;
            
            // Dispatch a real mouse event to force React's SyntheticEvent to fire
            clickableCard.dispatchEvent(new MouseEvent('click', {
              view: window,
              bubbles: true,
              cancelable: true,
              buttons: 1
            }));

            // Fallback standard DOM click
            try { clickableCard.click(); } catch {}
            
            matched = true;
          }
        }
      });

      // If a specific planner command was executed, return early to prevent fallback to generic omni-click
      if (matched) return;
    }

    // ── 6c. MEDIA ICONS & VIDEO PLAYING ──
    if (
      norm.includes('فيديو') ||
      norm.includes('شغل') ||
      norm.includes('video') ||
      norm.includes('lire') ||
      norm.includes('play')
    ) {
      const playElement = document.querySelector<HTMLElement>(
        'video, [class*="play" i], [aria-label*="play" i], [aria-label*="تشغيل" i], .cursor-pointer svg, button svg'
      );

      if (playElement) {
        const targetEl = (playElement.closest('button, a, div.cursor-pointer') || playElement) as HTMLElement;
        targetEl.click();
        return;
      }
    }

    // ── 6d. SILENT NAVIGATION (Zero-Lag, Wrapped in Timeout) ──
    if (
      norm.includes('انزل') ||
      norm.includes('تحت') ||
      norm.includes('scroll down') ||
      norm.includes('down') ||
      norm.includes('descendre') ||
      norm.includes('bas')
    ) {
      window.scrollBy({ top: 700, behavior: 'smooth' });
      return;
    }

    if (
      norm.includes('اطلع') ||
      norm.includes('فوق') ||
      norm.includes('scroll up') ||
      norm.includes('up') ||
      norm.includes('monter') ||
      norm.includes('haut')
    ) {
      window.scrollBy({ top: -700, behavior: 'smooth' });
      return;
    }

    if (
      norm.includes('ارجع') ||
      norm.includes('خلف') ||
      norm.includes('للخلف') ||
      norm.includes('go back') ||
      norm.includes('back') ||
      norm.includes('retour')
    ) {
      setTimeout(() => window.history.back(), 100);
      return;
    }

    if (norm.includes('مخطط') || norm.includes('planner') || norm.includes('planificateur')) {
      setTimeout(() => router.push('/planner'), 50);
      return;
    }

    if (norm.includes('اخبار') || norm.includes('news') || norm.includes('actualite') || norm.includes('actualité')) {
      setTimeout(() => router.push('/news'), 50);
      return;
    }

    if (norm.includes('استكشاف') || norm.includes('اكتشف') || norm.includes('explore') || norm.includes('explorer')) {
      setTimeout(() => router.push('/explore'), 50);
      return;
    }

    if (norm.includes('رئيسي') || norm.includes('home') || norm.includes('accueil')) {
      setTimeout(() => router.push('/'), 50);
      return;
    }

    // ── 6e. TYPE-SAFE AI PLANNER (Magic Fill) ──
    const hasPlannerVerb =
      norm.includes('رحل') ||
      norm.includes('سفر') ||
      norm.includes('ميزاني') ||
      norm.includes('دولار') ||
      norm.includes('جنيه') ||
      norm.includes('trip') ||
      norm.includes('budget') ||
      norm.includes('voyage') ||
      (norm.includes('ايام') && norm.includes('لمده')) ||
      (norm.includes('days') && norm.includes('for')) ||
      (norm.includes('jours') && norm.includes('pour'));

    if (hasPlannerVerb) {
      let extractedCountry = '';
      let extractedDays = 0;
      let extractedBudget = 0;

      const countryMatch =
        raw.match(/(?:من|from|de)\s+([^\s,،.]+)/i) ||
        raw.match(/(?:إلى|الى|to|vers)\s+([^\s,،.]+)/i);
      if (countryMatch && countryMatch[1]) {
        extractedCountry = countryMatch[1].trim();
      }

      const daysMatch =
        raw.match(/(\d+)\s*(?:أيام|ايام|يوم|days?|jours?)/i) ||
        raw.match(/(?:لمدة|خلال|for|pendant|durant)\s*(\d+)/i);

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

      const budgetMatch =
        raw.match(/(\d+[\d,.]*)\s*(?:دولار|جنيه|dollars?|euros?|le|\$|€|budget)/i) ||
        raw.match(/(?:ميزانية|ميزانيه|budget|بميزانية|بميزانيه)\s*(?:قدرها|of|de)?\s*(\d+[\d,.]*)/i);

      if (budgetMatch && budgetMatch[1]) {
        extractedBudget = parseInt(budgetMatch[1].replace(/[,.]/g, ''), 10) || 0;
      }

      if (extractedCountry || extractedDays > 0 || extractedBudget > 0) {
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
        return;
      }
    }

    // ── 6f. VR SPATIAL CARDS & ELEMENT CLICKING ──
    const hasClickVerb =
      norm.includes('افتح') ||
      norm.includes('اختار') ||
      norm.includes('دوس') ||
      norm.includes('اضغط') ||
      norm.includes('انقر') ||
      norm.includes('click') ||
      norm.includes('open') ||
      norm.includes('select') ||
      norm.includes('choose') ||
      norm.includes('ouvre') ||
      norm.includes('choisis') ||
      norm.includes('clique');

    if (hasClickVerb) {
      // Spatial VR Card Matching: "الاول/التاني/الثالث/first/second/premier" + left/right
      let targetIndex = -1;
      if (norm.includes('اول') || norm.includes('first') || norm.includes('premier') || norm.includes('1')) {
        targetIndex = 0;
      } else if (norm.includes('تاني') || norm.includes('ثاني') || norm.includes('second') || norm.includes('deuxieme') || norm.includes('deuxième') || norm.includes('2')) {
        targetIndex = 1;
      } else if (norm.includes('تالت') || norm.includes('ثالث') || norm.includes('third') || norm.includes('troisieme') || norm.includes('troisième') || norm.includes('3')) {
        targetIndex = 2;
      } else if (norm.includes('رابع') || norm.includes('fourth') || norm.includes('quatrieme') || norm.includes('quatrième') || norm.includes('4')) {
        targetIndex = 3;
      } else if (norm.includes('خامس') || norm.includes('fifth') || norm.includes('cinquieme') || norm.includes('cinquième') || norm.includes('5')) {
        targetIndex = 4;
      } else if (norm.includes('سادس') || norm.includes('sixth') || norm.includes('sixieme') || norm.includes('sixième') || norm.includes('6')) {
        targetIndex = 5;
      }

      if (targetIndex !== -1) {
        let items = Array.from(
          document.querySelectorAll<HTMLElement>(
            'img, video, .video-card, [role="button"], div.cursor-pointer, .clickable, button, a'
          )
        ).filter(el => {
          const rect = el.getBoundingClientRect();
          return rect.width > 30 && rect.height > 30;
        });

        const isRtl = document.documentElement.dir === 'rtl' || isAr;
        const wantsRight = norm.includes('يمين') || norm.includes('right') || norm.includes('droite');
        const wantsLeft = norm.includes('شمال') || norm.includes('يسار') || norm.includes('left') || norm.includes('gauche');

        if (wantsRight) {
          if (!isRtl) items = items.reverse();
        } else if (wantsLeft) {
          if (isRtl) items = items.reverse();
        }

        if (items[targetIndex]) {
          const targetEl = (items[targetIndex].closest('button, a, div.cursor-pointer, [role="button"]') || items[targetIndex]) as HTMLElement;
          targetEl.focus();
          targetEl.click();
          return;
        }
      }

      // Text-Based Strict Clicking
      const clickTriggers = [
        'اضغط علي', 'اضغط على', 'اضغط',
        'دوس علي', 'دوس على', 'دوس',
        'افتح', 'اختار', 'انقر علي', 'انقر على',
        'click on', 'click', 'choose', 'select', 'open',
        'ouvre', 'choisis', 'clique sur', 'clique'
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
        if (normalizedTarget && normalizedTarget !== 'فيديو' && normalizedTarget !== 'صوره' && normalizedTarget !== 'حاجه' && normalizedTarget !== 'video') {
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
              const targetEl = (el.closest('button, a, li, label, [role="option"], div.cursor-pointer') || el) as HTMLElement;
              targetEl.focus();
              targetEl.click();
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
        // Offload processing to next tick to guarantee zero-lag
        setTimeout(() => {
          processCommand(transcript);
        }, 0);
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
      if (!isListeningRef.current) {
        setIsListeningUI(false);
      } else {
        if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
        restartTimerRef.current = setTimeout(() => {
          if (isListeningRef.current && recognitionRef.current) {
            startRecognition();
          }
        }, 500);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + 2: Start continuous listening
      if (e.altKey && e.key === '2') {
        e.preventDefault();
        activateAssistant();
      }

      // Alt + 3: Hard-stop recognition and TTS
      if (e.altKey && e.key === '3') {
        e.preventDefault();
        deactivateAssistant();
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
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // ── TRIPLE-TAP GESTURE ACTIVATION ──
  // 3 rapid taps on any empty area (within 600ms) activates the voice assistant.
  // Taps on interactive elements (buttons, inputs, links…) are ignored.
  useEffect(() => {
    let tapCount = 0;
    let tapTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleTripleTap = (e: MouseEvent) => {
      // Ignore taps on interactive elements so normal UI clicks still work
      const target = e.target as Element;
      if (target.closest('button, input, textarea, a, [role="button"], select')) {
        return;
      }

      tapCount++;

      if (tapCount === 3) {
        tapCount = 0;
        if (tapTimeout) clearTimeout(tapTimeout);
        // Only activate if not already listening
        if (!isListeningRef.current) {
          activateAssistant();
        }
      } else {
        // Reset tap counter if 600ms pass without a third tap
        if (tapTimeout) clearTimeout(tapTimeout);
        tapTimeout = setTimeout(() => {
          tapCount = 0;
        }, 600);
      }
    };

    document.addEventListener('click', handleTripleTap);

    return () => {
      document.removeEventListener('click', handleTripleTap);
      if (tapTimeout) clearTimeout(tapTimeout);
    };
  }, []);

  return (
    <>
      {/* ── 4. LIQUID SIRI-STYLE PULSING GRADIENT GLOW (No Text / No Icons) ── */}
      {isListeningUI && (
        <>
          {/* Subtle full-screen edge glow to make the whole screen feel alive */}
          <div className="fixed inset-0 z-[9998] pointer-events-none shadow-[inset_0_0_80px_rgba(168,85,247,0.15)] animate-pulse" style={{ animationDuration: '3s' }} />

          {/* Dynamic Liquid Glowing Wave at the bottom edge */}
          <div className="fixed bottom-0 left-0 right-0 h-40 z-[9999] pointer-events-none flex justify-center items-end overflow-hidden mix-blend-screen">
            
            {/* Outer wide glow */}
            <div 
              className="absolute bottom-0 w-[60vw] h-[150px] bg-gradient-to-r from-cyan-500/40 via-purple-500/40 to-yellow-500/40 rounded-[100%] blur-[60px] animate-pulse translate-y-1/2" 
              style={{ animationDuration: '2.5s' }} 
            />
            
            {/* Inner intense morphing glow */}
            <div 
              className="absolute bottom-0 w-[40vw] h-[100px] bg-gradient-to-r from-blue-400/60 via-fuchsia-500/60 to-amber-400/60 rounded-[100%] blur-[40px] animate-pulse translate-y-1/2" 
              style={{ animationDuration: '1.8s', animationDirection: 'alternate-reverse' }} 
            />

            {/* Core bright light */}
            <div 
              className="absolute bottom-0 w-[20vw] h-[50px] bg-white/30 rounded-[100%] blur-[20px] animate-pulse translate-y-1/2" 
              style={{ animationDuration: '1s' }} 
            />
            
          </div>
        </>
      )}

      {/* ── 5. MOBILE-ONLY SLIDE-OUT AI WIDGET ── */}
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

        {/* Futuristic AI Icon Button (Sparkles) */}
        <div className="bg-[#060E1A]/95 border-y border-r border-[#C9A84C]/40 p-2.5 shadow-2xl backdrop-blur-xl flex items-center justify-center">
          <button
            onClick={() => {
              if (isListeningRef.current) {
                deactivateAssistant();
              } else {
                activateAssistant();
              }
            }}
            aria-label={isListeningUI ? 'Stop AI' : 'Start AI'}
            className="relative group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 focus:outline-none"
          >
            {/* Active Glowing Radar Effect */}
            {isListeningUI && (
              <>
                <span className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#C9A84C]/50 via-amber-400/40 to-cyan-400/50 animate-ping pointer-events-none" />
                <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#C9A84C] to-amber-300 opacity-60 blur-sm animate-pulse pointer-events-none" />
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
              <Sparkles
                className={`w-6 h-6 ${
                  isListeningUI
                    ? 'text-amber-300 animate-pulse'
                    : 'text-[#C9A84C] group-hover:scale-110 transition-transform'
                }`}
              />
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
