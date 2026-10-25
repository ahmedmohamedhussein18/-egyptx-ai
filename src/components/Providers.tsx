'use client';

import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import FloatingAssistant from '@/components/FloatingAssistant';
import ContinuousVoiceAssistant from '@/components/ContinuousVoiceAssistant';
import DailyNewsWidget from '@/components/DailyNewsWidget';

export default function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isNewsPage = pathname ? pathname === '/news' || pathname.startsWith('/news/') : false;

  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          {children}
          <FloatingAssistant />
          {isNewsPage && <DailyNewsWidget />}
          <ContinuousVoiceAssistant />
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
