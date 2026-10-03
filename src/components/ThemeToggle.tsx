'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
      className={`relative flex items-center justify-center p-2 rounded-full border transition-all duration-300 ${
        theme === 'light'
          ? 'bg-[#F1F3F6] border-[#E2E6EC] text-[#B8943F] hover:bg-[#FBF7EA] hover:border-[#C9A84C] shadow-sm'
          : 'bg-white/5 border-white/10 text-[#C9A84C] hover:border-[#C9A84C]/40 hover:bg-[#C9A84C]/10 shadow-[0_0_12px_rgba(201,168,76,0.1)]'
      } ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {theme === 'dark' ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.25 }}
          >
            <Sun className="w-4 h-4 text-[#C9A84C]" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.25 }}
          >
            <Moon className="w-4 h-4 text-[#B8943F]" />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}
