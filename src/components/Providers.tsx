'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import FloatingAssistant from '@/components/FloatingAssistant';
import ContinuousVoiceAssistant from '@/components/ContinuousVoiceAssistant';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <LanguageProvider>
        {children}
        <FloatingAssistant />
        <ContinuousVoiceAssistant />
      </LanguageProvider>
    </AuthProvider>
  );
}
