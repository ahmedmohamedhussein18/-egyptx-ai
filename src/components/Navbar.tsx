'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { logoutAction } from '@/app/actions/auth';
import { Sparkles, MessageCircle, Brain, ChevronDown, ShoppingBag } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

// ── Primary Nav items (First 5 items; News is the 6th item with hover dropdown) ─
const getPrimaryNavItems = (t: any) => [
  { name: t('nav.home') || 'Home', href: '/' },
  { name: t('nav.aiPlanner') || 'AI Planner', href: '/planner', badge: 'AI' },
  { name: t('nav.exploreEgypt') || 'Explore Egypt', href: '/explore' },
  { name: t('nav.hiddenEgypt') || 'Hidden Egypt', href: '/hidden-egypt' },
  { name: t('nav.touristPassport') || 'Tourist Passport', href: '/tourist-passport' },
];

// ── Dropdown options under "News" (Strictly 3 options: Shop, Slang, Memory) ──
const NEWS_DROPDOWN_OPTIONS = [
  {
    icon: ShoppingBag,
    emoji: '🛍️',
    title: 'Shop',
    subtitle: 'Hotels, homes & Egyptian crafts',
    href: '/crafts',
    color: '#C9A84C',
  },
  {
    icon: MessageCircle,
    emoji: '🎭',
    title: 'Slang',
    subtitle: 'Egyptian Arabic dialect & voice',
    href: '/slang',
    color: '#19A974',
  },
  {
    icon: Brain,
    emoji: '🧠',
    title: 'Memory',
    subtitle: 'Your travel memory core & history',
    href: '/memory-core',
    color: '#8B5CF6',
  },
];

// ── Language Selector ───────────────────────────────────────────────────────
const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇪🇬' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
];

function LanguageSelector({ locale, setLocale }: { locale: string; setLocale: (loc: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = languages.find((l) => l.code === locale) || languages[0];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors text-white"
      >
        <span>{current.flag}</span>
        <span className="uppercase">{current.code}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-36 bg-[#0A1628] border border-[#C9A84C]/20 rounded-xl shadow-xl overflow-hidden z-50"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { setLocale(lang.code); setOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-[#C9A84C]/10 flex items-center gap-2 ${
                  locale === lang.code ? 'text-[#C9A84C]' : 'text-white'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── News Hover Dropdown (6th Main Nav item with 3 options: Shop, Slang, Memory) ──
function NewsWithDropdown({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setOpen(false), 160);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Visible Link: News */}
      <Link
        href="/news"
        className="relative flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white transition-colors group py-2 whitespace-nowrap after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-full after:h-[2px] after:bg-[#C9A84C] after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center"
      >
        <span>{label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            open ? 'rotate-180 text-[#C9A84C]' : 'text-white/40 group-hover:text-[#C9A84C]'
          }`}
        />
      </Link>

      {/* Sleek Glassmorphism Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[290px] bg-[#0A1628]/95 backdrop-blur-xl border border-[#C9A84C]/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_25px_rgba(201,168,76,0.12)] overflow-hidden z-50 p-2 space-y-1"
          >
            <div className="px-3 pt-2 pb-1.5 border-b border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A84C]/70">
                Explore More
              </span>
            </div>

            {NEWS_DROPDOWN_OPTIONS.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                onClick={() => setOpen(false)}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-[#C9A84C]/20 transition-all duration-200"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base transition-transform duration-200 group-hover:scale-110 shadow-sm"
                  style={{ backgroundColor: `${item.color}20`, border: `1px solid ${item.color}40` }}
                >
                  {item.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white/95 group-hover:text-[#C9A84C] transition-colors leading-tight mb-0.5">
                    {item.title}
                  </p>
                  <p className="text-xs text-white/40 truncate">{item.subtitle}</p>
                </div>
                <span className="text-white/20 group-hover:text-[#C9A84C] transition-colors text-sm font-bold">›</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Navbar ─────────────────────────────────────────────────────────────
export default function Navbar() {
  const { t, locale, setLocale } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinkClass =
    'relative flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors group py-2 whitespace-nowrap after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-full after:h-[2px] after:bg-[#C9A84C] after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0A1628]/85 backdrop-blur-xl border-b border-[#C9A84C]/10 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#C9A84C] group-hover:scale-110 transition-transform">
              <path d="M12 2L22 20H2L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#C9A84C] to-[#E3C973]">
              EgyptX
            </span>
          </Link>

          {/* ── Desktop Navigation — EXACTLY: Home, AI Planner, Explore Egypt, Hidden Egypt, Tourist Passport, News ── */}
          <nav className="hidden xl:flex items-center gap-6">
            {getPrimaryNavItems(t).map((item) => (
              <Link key={item.name} href={item.href} className={navLinkClass}>
                {item.name}
                {'badge' in item && item.badge && (
                  <span
                    className="ml-1 px-[6px] py-[2px] rounded text-[10px] font-bold text-[#D4AF37] tracking-wider uppercase"
                    style={{ border: '1px solid rgba(255, 215, 0, 0.5)', boxShadow: '0 0 8px rgba(255, 215, 0, 0.3)' }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}

            {/* 6th item: News with hover dropdown containing Shop, Slang, Memory */}
            <NewsWithDropdown label={t('nav.news') || 'News'} />

            {/* AI Guide icon (authenticated only) */}
            {user && (
              <Link
                href="/ai-guide"
                title="AI Vision Guide"
                className="relative text-[#C9A84C] hover:text-[#E3C973] transition-colors group py-2 flex items-center"
              >
                <Sparkles className="w-5 h-5" />
                <span className="absolute left-1/2 bottom-0 w-full h-[2px] bg-[#C9A84C] -translate-x-1/2 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
              </Link>
            )}
          </nav>

          {/* ── Right-side Controls ──────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <LanguageSelector locale={locale} setLocale={setLocale} />
            <Link
              href="/command-center"
              className="px-4 py-2 text-sm font-medium text-white/90 border border-[#C9A84C]/50 rounded hover:bg-[#C9A84C]/10 hover:border-[#C9A84C] transition-colors whitespace-nowrap"
            >
              {t('nav.command')}
            </Link>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#C9A84C] to-[#1B6B93] flex items-center justify-center text-[#030712] font-bold text-xs uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-white">{user.name.split(' ')[0]}</span>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-[#0A1628] border border-[#C9A84C]/20 rounded-xl overflow-hidden shadow-xl z-50"
                    >
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                        <p className="text-xs text-white/50 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/tourist-passport"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-[#C9A84C]"
                      >
                        {t('nav.touristPassport')}
                      </Link>
                      <form action={logoutAction} className="block w-full">
                        <button
                          type="submit"
                          onClick={() => setDropdownOpen(false)}
                          className="block w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-red-400"
                        >
                          {t('nav.logout')}
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2 text-sm font-medium text-[#0A1628] bg-[#C9A84C] rounded hover:bg-[#E3C973] transition-colors shadow-[0_0_15px_rgba(201,168,76,0.3)] whitespace-nowrap"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile controls */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 text-white/80 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              ) : (
                <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              )}
            </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-[#0A1628]/95 backdrop-blur-xl border-b border-[#C9A84C]/20 lg:hidden shadow-2xl z-40"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {user && (
                <div className="px-3 py-3 mb-2 border-b border-white/10 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#C9A84C] to-[#1B6B93] flex items-center justify-center text-[#030712] font-bold text-sm uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-white/50">{user.email}</p>
                  </div>
                </div>
              )}

              {/* Exact visible links: Home, AI Planner, Explore Egypt, Hidden Egypt, Tourist Passport, News */}
              {getPrimaryNavItems(t).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-white/80 hover:text-[#C9A84C] hover:bg-white/5 rounded-md transition-colors"
                >
                  {item.name}
                </Link>
              ))}

              <Link
                href="/news"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-white/80 hover:text-[#C9A84C] hover:bg-white/5 rounded-md transition-colors"
              >
                {t('nav.news') || 'News'}
              </Link>

              {/* Sub-items from News dropdown: Shop, Slang, Memory */}
              <div className="px-3 py-2 border-t border-white/5 mt-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#C9A84C]/60 mb-1.5">
                  More Services
                </p>
                <div className="space-y-1">
                  {NEWS_DROPDOWN_OPTIONS.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-2 py-2 text-sm text-white/70 hover:text-[#C9A84C] rounded-md transition-colors hover:bg-white/5"
                    >
                      <span className="text-base">{item.emoji}</span>
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {user && (
                <Link
                  href="/ai-guide"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-3 text-sm font-medium text-[#C9A84C] hover:bg-white/5 rounded-md transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  AI Vision Guide
                </Link>
              )}

              <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-3">
                <Link
                  href="/command-center"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 text-center text-sm font-medium text-[#C9A84C] border border-[#C9A84C]/50 rounded-md hover:bg-[#C9A84C]/10 transition-colors"
                >
                  Command Center
                </Link>
                {user ? (
                  <form action={logoutAction} className="block w-full">
                    <button
                      type="submit"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full px-4 py-3 text-center text-sm font-medium text-[#0A1628] bg-red-400 rounded-md hover:bg-red-300 transition-colors"
                    >
                      {t('nav.logout')}
                    </button>
                  </form>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 text-center text-sm font-medium text-[#0A1628] bg-[#C9A84C] rounded-md hover:bg-[#E3C973] transition-colors"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
