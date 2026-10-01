'use client';

import { useEffect } from 'react';

export default function VoiceAssistant() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + 2: Speak welcome message in current language
      if (e.altKey && e.key === '2') {
        e.preventDefault();

        // Cancel any ongoing speech to prevent overlap
        window.speechSynthesis.cancel();

        const currentLang = document.documentElement.lang || 'en';

        const utterance = new SpeechSynthesisUtterance();
        utterance.rate = 0.9;

        if (currentLang.startsWith('ar')) {
          utterance.text =
            'مرحباً بك في منصة إيجيبت إكس للذكاء الاصطناعي. أنت الآن في الصفحة الرئيسية. للتنقل بين الصفحات، يمكنك استخدام شريط القوائم في الأعلى. نحن هنا لمساعدتك في استكشاف مصر بكل سهولة، ونتمنى لك تجربة ممتعة.';
          utterance.lang = 'ar-SA';
        } else {
          utterance.text =
            'Welcome to the EgyptX AI platform. You are currently on the homepage. To navigate between pages, you can use the menu bar at the top. We are here to help you explore Egypt with ease, and we wish you an enjoyable experience.';
          utterance.lang = 'en-US';
        }

        window.speechSynthesis.speak(utterance);
      }

      // Alt + 3: Cancel/stop speech
      if (e.altKey && e.key === '3') {
        e.preventDefault();
        window.speechSynthesis.cancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Renders nothing — purely functional
  return null;
}
