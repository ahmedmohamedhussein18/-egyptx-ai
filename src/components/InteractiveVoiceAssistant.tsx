'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function InteractiveVoiceAssistant() {
  const router = useRouter();
  const recognitionRef = useRef<any>(null);

  const speak = (text: string, lang: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang.startsWith('ar') ? 'ar-EG' : 'en-US';
    utterance.rate = 0.95;

    // Aggressively search for premium Google voices
    const trySpeak = () => {
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

      if (selectedVoice) utterance.voice = selectedVoice;
      window.speechSynthesis.speak(utterance);
    };

    // Voices may not be loaded yet on first call — retry after load
    if (window.speechSynthesis.getVoices().length > 0) {
      trySpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        trySpeak();
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  };

  const handleCommand = (transcript: string, lang: string) => {
    const t = transcript.toLowerCase().trim();
    const isAr = lang.startsWith('ar');

    if (!isAr) {
      // ── English commands ──
      if (t.includes('news')) {
        router.push('/news');
        speak('Taking you to the news page.', lang);
      } else if (t.includes('home') || t.includes('main')) {
        router.push('/');
        speak('Taking you to the home page.', lang);
      } else if (t.includes('explore') || t.includes('destinations')) {
        router.push('/explore');
        speak('Taking you to the Explore Egypt page.', lang);
      } else if (t.includes('plan') || t.includes('planner') || t.includes('trip')) {
        router.push('/planner');
        speak('Opening the AI Trip Planner.', lang);
      } else if (t.includes('vr') || t.includes('virtual')) {
        router.push('/vr-egypt');
        speak('Launching VR Egypt.', lang);
      } else if (t.includes('passport') || t.includes('profile')) {
        router.push('/tourist-passport');
        speak('Opening your Tourist Passport.', lang);
      } else if (t.includes('emergency') || t.includes('help')) {
        router.push('/emergency');
        speak('Opening the Emergency Assistant.', lang);
      } else {
        speak('I am ready to help. You can say: news, home, explore, plan a trip, VR, or passport.', lang);
      }
    } else {
      // ── Arabic commands ──
      if (t.includes('أخبار') || t.includes('الاخبار') || t.includes('اخبار') || t.includes('الأخبار')) {
        router.push('/news');
        speak('جاري الانتقال إلى صفحة الأخبار.', lang);
      } else if (t.includes('الرئيسية') || t.includes('البداية') || t.includes('رئيسية') || t.includes('ابدأ')) {
        router.push('/');
        speak('جاري الانتقال إلى الصفحة الرئيسية.', lang);
      } else if (t.includes('استكشاف') || t.includes('وجهات') || t.includes('استكشف') || t.includes('اكتشاف')) {
        router.push('/explore');
        speak('جاري الانتقال إلى صفحة استكشاف مصر.', lang);
      } else if (t.includes('خطط') || t.includes('رحلة') || t.includes('التخطيط') || t.includes('المخطط')) {
        router.push('/planner');
        speak('جاري فتح مخطط الرحلات بالذكاء الاصطناعي.', lang);
      } else if (t.includes('واقع افتراضي') || t.includes('الواقع الافتراضي') || t.includes('في آر')) {
        router.push('/vr-egypt');
        speak('جاري فتح تجربة مصر الافتراضية.', lang);
      } else if (t.includes('جواز') || t.includes('جواز السفر') || t.includes('ملف') || t.includes('حساب')) {
        router.push('/tourist-passport');
        speak('جاري فتح جواز سفر السائح.', lang);
      } else if (t.includes('طوارئ') || t.includes('مساعدة') || t.includes('نجدة')) {
        router.push('/emergency');
        speak('جاري فتح مساعد الطوارئ.', lang);
      } else {
        speak('أنا مستعد للمساعدة. يمكنك قول: أخبار، الرئيسية، استكشاف، رحلة، أو جواز السفر.', lang);
      }
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('SpeechRecognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const lang = document.documentElement.lang || 'en';
      handleCommand(transcript, lang);
    };

    recognition.onerror = (event: any) => {
      console.error('Voice recognition error:', event.error);
      const lang = document.documentElement.lang || 'en';
      if (event.error !== 'aborted') {
        speak(
          lang.startsWith('ar')
            ? 'عذراً، لم أتمكن من سماعك. حاول مرة أخرى.'
            : 'Sorry, I could not hear you. Please try again.',
          lang
        );
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + 2: Start listening
      if (e.altKey && e.key === '2') {
        e.preventDefault();
        window.speechSynthesis.cancel();

        const lang = document.documentElement.lang || 'en';
        recognition.lang = lang.startsWith('ar') ? 'ar-EG' : 'en-US';

        try {
          recognition.start();
          // Brief audio cue to confirm listening has started
          speak(
            lang.startsWith('ar') ? 'أستمع إليك...' : 'Listening...',
            lang
          );
        } catch {
          // Recognition may already be running; stop and restart
          recognition.stop();
        }
      }

      // Alt + 3: Stop / cancel
      if (e.altKey && e.key === '3') {
        e.preventDefault();
        recognition.abort();
        window.speechSynthesis.cancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      recognition.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
