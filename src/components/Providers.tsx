'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import FloatingAssistant from '@/components/FloatingAssistant';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <FloatingAssistant />
    </AuthProvider>
  );
}
