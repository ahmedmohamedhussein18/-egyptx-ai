'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface VrLoadingOverlayProps {
  isOpen: boolean;
  targetUrl?: string;
  onClose: () => void;
}

const WELCOME_DURATION_MS = 2500;

export default function VrLoadingOverlay({
  isOpen,
  targetUrl = '/vr-egypt',
  onClose,
}: VrLoadingOverlayProps) {
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let closeTimer: ReturnType<typeof setTimeout>;
    const routeTimer = setTimeout(() => {
      router.push(targetUrl);
      closeTimer = setTimeout(onClose, 300);
    }, WELCOME_DURATION_MS);

    return () => {
      clearTimeout(routeTimer);
      clearTimeout(closeTimer);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, targetUrl, router, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="vr-loading-portal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black z-[9999] flex items-center justify-center select-none overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Welcome"
        >
          <div className="absolute w-[28rem] h-[28rem] sm:w-[36rem] sm:h-[36rem] rounded-full bg-[#D4AF37]/10 blur-[120px] pointer-events-none" />

          <motion.h1
            initial={{ opacity: 0, y: 16, filter: 'blur(12px)', scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              scale: 1,
              textShadow: [
                '0 0 18px rgba(212,175,55,0.45)',
                '0 0 42px rgba(245,197,66,0.95)',
                '0 0 18px rgba(212,175,55,0.45)',
              ],
            }}
            transition={{
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
              textShadow: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="relative z-10 text-5xl sm:text-7xl md:text-8xl font-serif font-light tracking-[0.25em] uppercase text-[#F4E3B2]"
          >
            Welcome
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
