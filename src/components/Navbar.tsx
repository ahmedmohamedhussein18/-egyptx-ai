'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { logoutAction } from '@/app/actions/auth';
import { 
  Sparkles, 
  ChevronDown, 
  Crown, 
  Glasses,
  Menu, 
  X,
  LogOut,
  Command,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import EliteModal from '@/components/EliteModal';
import {
  EXPLORE_NAV_ITEMS,
  EXPERIENCES_NAV_ITEMS,
  LIFE_NAV_ITEMS,
  OFFICIAL_NAV_ITEMS,
  NAV_LANGUAGES,
  type NavDropdownItem,
} from '@/config/navigation';

function LanguageSelector({ locale, setLocale }: { locale: string; setLocale: (loc: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = NAV_LANGUAGES.find((l) => l.code === locale) || NAV_LANGUAGES[0];

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
        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold tracking-wider bg-black/[0.04] dark:bg-white/5 hover:bg-black/[0.08] dark:hover:bg-white/10 border border-black/[0.08] dark:border-white/10 rounded-full transition-colors text-[#1A2332] dark:text-gray-200 cursor-pointer"
        aria-label="Select Language"
      >
        <span className="text-[10px] text-[#C5A059] font-mono">{current.short}</span>
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-36 bg-[#F8F3E9] dark:bg-[#131A2A] border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(26,35,50,0.12),0_0_25px_rgba(197,160,89,0.05)] overflow-hidden z-50 py-1"
          >
            {NAV_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { setLocale(lang.code); setOpen(false); }}
                className={`w-full text-left px-3.5 py-2 text-xs transition-colors hover:bg-[#C5A059]/10 flex items-center justify-between cursor-pointer ${
                  locale === lang.code ? 'text-[#C5A059] dark:text-[#D4AF37] font-bold bg-[#C5A059]/10' : 'text-[#1A2332] dark:text-gray-200'
                }`}
              >
                <span>{lang.label}</span>
                <span className="text-[10px] text-slate-400 dark:text-gray-500 font-mono uppercase">{lang.short}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Hover Dropdown Component (Editorial Layout - Zero Emojis) ────────────────
function NavHoverDropdown({
  label,
  href,
  headerTitle,
  items,
  isActive,
  currentPath,
  scrolled,
}: {
  label: string;
  href: string;
  headerTitle: string;
  items: NavDropdownItem[];
  isActive: boolean;
  currentPath: string;
  scrolled: boolean;
}) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const safeNav = (val: any, fallback: string): string => {
    if (typeof val !== 'string' || !val || val.toLowerCase().includes('nav.')) {
      return fallback;
    }
    return val;
  };

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setOpen(false), 180);
  };

  // High contrast link text:
  // When scrolled in Light Mode: dark navy (#1A2332) against the light papyrus glass
  // When top/unscrolled over dark hero: crisp white/90 in both Light and Dark modes
  const textClass = isActive
    ? 'text-[#C5A059] dark:text-[#D4AF37] font-semibold after:bg-[#C5A059] after:scale-x-100'
    : scrolled
    ? 'text-[#1A2332] hover:text-[#C5A059] dark:text-gray-200 dark:hover:text-[#D4AF37] after:bg-[#C5A059] after:scale-x-0 hover:after:scale-x-100'
    : 'text-white/90 hover:text-white dark:text-gray-200 dark:hover:text-[#D4AF37] after:bg-[#C5A059] after:scale-x-0 hover:after:scale-x-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]';

  const chevronClass = open
    ? 'rotate-180 text-[#C5A059]'
    : isActive
    ? 'text-[#C5A059]'
    : scrolled
    ? 'text-slate-500 dark:text-gray-400 group-hover:text-[#C5A059]'
    : 'text-white/70 group-hover:text-white';

  return (
    <div
      className="relative group/nav"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={href}
        className={`relative flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] font-medium transition-colors py-2 whitespace-nowrap after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-full after:h-[1.5px] after:transition-transform after:duration-300 after:origin-center ${textClass}`}
      >
        <span>{label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${chevronClass}`} />
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[320px] bg-[#F8F3E9] dark:bg-[#131A2A] text-[#1A2332] dark:text-white backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(26,35,50,0.12),0_0_30px_rgba(197,160,89,0.08)] overflow-hidden z-50 p-2 space-y-1"
          >
            <div className="px-3 pt-2 pb-1.5 border-b border-slate-200/70 dark:border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] dark:text-[#D4AF37]">
                {headerTitle}
              </span>
            </div>

            {items.map((item) => {
              const itemActive = currentPath === item.href;
              const title = item.titleKey ? safeNav(t(item.titleKey), item.title) : item.title;
              const subtitle = item.subtitleKey ? safeNav(t(item.subtitleKey), item.subtitle) : item.subtitle;
              const badge = item.badgeKey ? safeNav(t(item.badgeKey), item.badge || '') : item.badge;
              return (
                <Link
                  key={item.href + item.title}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-all duration-200 ${
                    itemActive
                      ? 'bg-[#C5A059]/15 border-[#C5A059]/40 text-[#C5A059]'
                      : 'border-transparent hover:bg-black/[0.04] dark:hover:bg-white/5 hover:border-[#C5A059]/25 text-[#1A2332] dark:text-white/90'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className={`text-xs font-semibold leading-tight tracking-wide ${
                        itemActive ? 'text-[#C5A059]' : 'text-[#1A2332] dark:text-white group-hover:text-[#C5A059]'
                      }`}>
                        {title}
                      </p>
                      {badge && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30">
                          {badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-white/50 truncate mt-0.5">{subtitle}</p>
                  </div>
                  <span className={`text-xs font-bold transition-colors ml-2 shrink-0 ${
                    itemActive ? 'text-[#C5A059]' : 'opacity-25 group-hover:opacity-100 group-hover:text-[#C5A059]'
                  }`}>›</span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Navbar ─────────────────────────────────────────────────────────────
export default function Navbar() {
  const { t, locale, setLocale } = useLanguage();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isEliteModalOpen, setIsEliteModalOpen] = useState(false);
  const { user } = useAuth();
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const safeNav = (val: any, fallback: string): string => {
    if (typeof val !== 'string' || !val || val.toLowerCase().includes('nav.')) {
      return fallback;
    }
    return val;
  };

  const isHomeActive = pathname === '/';
  const isExploreActive = ['/explore', '/hidden-egypt', '/egyptian-culture'].includes(pathname);
  const isExperiencesActive = ['/planner', '/ai-guide', '/vr-egypt', '/slang', '/memory-core', '/hieroglyph-scanner'].includes(pathname);
  const isLifeActive = ['/news', '/videos', '/reels', '/crafts'].includes(pathname);
  const isOfficialActive = ['/egypt-official', '/bookings', '/national-projects'].includes(pathname);
  const isGemVrActive = pathname === '/gem-vr-experience';

  const navLinkBase =
    'relative flex items-center gap-1 text-xs uppercase tracking-[0.14em] font-medium transition-colors py-2 whitespace-nowrap after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-full after:h-[1.5px] after:transition-transform after:duration-300 after:origin-center';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'backdrop-blur-xl bg-[#FDFBF7]/90 dark:bg-[#0B0F19]/90 border-b border-black/[0.06] dark:border-[#D4AF37]/20 py-3 shadow-[0_16px_40px_rgba(26,35,50,0.06)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.4)]'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* ── LEFT: Logo ─────────────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#C5A059] group-hover:scale-105 transition-transform">
              <path d="M12 2L22 20H2L12 2Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22V20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75"/>
            </svg>
            <span className={`text-xl font-bold tracking-tight transition-colors ${
              scrolled
                ? 'text-[#1A2332] dark:text-white'
                : 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]'
            }`}>
              Egypt<span className="text-[#C5A059]">X</span>
            </span>
          </Link>

          {/* ── CENTER: Clean Minimal Navigation Hierarchy (Zero Emojis) ───── */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {/* 1. Home */}
            <Link
              href="/"
              className={`${navLinkBase} ${
                isHomeActive
                  ? 'text-[#C5A059] dark:text-[#D4AF37] font-semibold after:bg-[#C5A059] after:scale-x-100'
                  : scrolled
                  ? 'text-[#1A2332] hover:text-[#C5A059] dark:text-gray-200 dark:hover:text-[#D4AF37] after:bg-[#C5A059] after:scale-x-0 hover:after:scale-x-100'
                  : 'text-white/90 hover:text-white dark:text-gray-200 dark:hover:text-[#D4AF37] after:bg-[#C5A059] after:scale-x-0 hover:after:scale-x-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]'
              }`}
            >
              {safeNav(t('nav.home'), 'Home')}
            </Link>

            {/* 2. Explore */}
            <NavHoverDropdown
              label={safeNav(t('nav.explore'), 'Explore')}
              href="/explore"
              headerTitle={safeNav(t('nav.headers.destinations'), 'Destinations')}
              isActive={isExploreActive}
              currentPath={pathname}
              scrolled={scrolled}
              items={EXPLORE_NAV_ITEMS}
            />

            {/* 3. Experiences */}
            <NavHoverDropdown
              label={safeNav(t('nav.experiences'), 'Experiences')}
              href="/planner"
              headerTitle={safeNav(t('nav.headers.aiExperiences'), 'AI Experiences')}
              isActive={isExperiencesActive}
              currentPath={pathname}
              scrolled={scrolled}
              items={EXPERIENCES_NAV_ITEMS}
            />

            {/* 4. Egypt Life */}
            <NavHoverDropdown
              label={safeNav(t('nav.egyptLife'), 'Egypt Life')}
              href="/news"
              headerTitle={safeNav(t('nav.headers.lifeAndCulture'), 'Life & Culture')}
              isActive={isLifeActive}
              currentPath={pathname}
              scrolled={scrolled}
              items={LIFE_NAV_ITEMS}
            />

            {/* 5. Official */}
            <NavHoverDropdown
              label={safeNav(t('nav.official'), 'Official')}
              href="/egypt-official"
              headerTitle={safeNav(t('nav.headers.officialAndBookings'), 'Official & Bookings')}
              isActive={isOfficialActive}
              currentPath={pathname}
              scrolled={scrolled}
              items={OFFICIAL_NAV_ITEMS}
            />

            {/* 6. Meresankh VR */}
            <Link
              href="/gem-vr-experience"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wider transition-all duration-300 ${
                isGemVrActive
                  ? 'bg-[#C5A059] text-stone-950 shadow-sm scale-105'
                  : 'text-[#C5A059] bg-[#C5A059]/15 border border-[#C5A059]/40 hover:border-[#C5A059] hover:bg-[#C5A059]/25 backdrop-blur-sm'
              }`}
            >
              <Glasses className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{safeNav(t('nav.meresankhVr'), 'Meresankh VR')}</span>
            </Link>
          </nav>

          {/* ── RIGHT: Theme Toggle + Language + Profile ────────────────────── */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <ThemeToggle />
            <LanguageSelector locale={locale} setLocale={setLocale} />

            {/* User Dropdown / Login */}
            {user ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full transition-colors cursor-pointer border ${
                    scrolled
                      ? 'bg-black/[0.04] dark:bg-white/5 hover:bg-black/[0.07] dark:hover:bg-white/10 border-black/[0.06] dark:border-white/10'
                      : 'bg-black/40 hover:bg-black/60 border-white/20 backdrop-blur-md'
                  }`}
                  aria-label="User profile menu"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#C5A059] to-[#9E7B38] flex items-center justify-center text-stone-900 font-bold text-[10px] uppercase shadow-sm">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <span className={`text-xs font-semibold max-w-[80px] sm:max-w-[100px] truncate hidden sm:inline ${
                    scrolled ? 'text-[#1A2332] dark:text-white' : 'text-white'
                  }`}>
                    {user.name ? user.name.split(' ')[0] : 'User'}
                  </span>
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-[#F8F3E9] dark:bg-[#131A2A] text-[#1A2332] dark:text-white border border-slate-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 p-1"
                    >
                      <div className="px-3 py-2.5 border-b border-slate-200/70 dark:border-white/10">
                        <p className="text-xs font-bold text-[#1A2332] dark:text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-gray-400 truncate mt-0.5">{user.email}</p>
                      </div>

                      <Link
                        href="/command-center"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full text-left px-3 py-2 text-xs text-[#1A2332] dark:text-gray-200 hover:text-black dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/5 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Command className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>{safeNav(t('nav.command'), 'Command Center')}</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setIsEliteModalOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-[#C5A059] hover:bg-black/[0.04] dark:hover:bg-white/5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer font-medium"
                      >
                        <Crown className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>{safeNav(t('nav.elite'), 'EgyptX Elite')}</span>
                      </button>

                      <form action={logoutAction} className="block w-full">
                        <button
                          type="submit"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full text-left px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>{safeNav(t('nav.logout'), 'Log out')}</span>
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider bg-[#C5A059] hover:bg-[#B89758] text-stone-950 rounded-full transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
              >
                {safeNav(t('nav.login'), 'Sign In')}
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors cursor-pointer ${
                scrolled
                  ? 'text-[#1A2332] dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5'
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#C5A059]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* ── MOBILE MENU (Zero Emojis) ────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="lg:hidden bg-[#F8F3E9]/98 dark:bg-[#0A1628]/98 backdrop-blur-2xl border-b border-black/[0.06] dark:border-[#C5A059]/25 shadow-xl overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 pt-3 pb-8 space-y-3">
              {/* Home */}
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition-colors ${
                  isHomeActive ? 'bg-[#C5A059]/15 text-[#C5A059]' : 'text-[#1A2332] dark:text-gray-200 hover:bg-black/[0.04] dark:hover:bg-white/5'
                }`}
              >
                {safeNav(t('nav.home'), 'Home')}
              </Link>

              {/* Explore */}
              <div className="pt-2 border-t border-black/[0.05] dark:border-white/5">
                <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">
                  {safeNav(t('nav.explore'), 'Explore')}
                </p>
                <div className="mt-1 space-y-1">
                  {EXPLORE_NAV_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-xs font-medium text-[#1A2332] dark:text-gray-200 hover:text-[#C5A059] hover:bg-black/[0.03] dark:hover:bg-white/5 rounded-xl transition-colors"
                    >
                      <span>{item.titleKey ? safeNav(t(item.titleKey), item.title) : item.title}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Experiences */}
              <div className="pt-2 border-t border-black/[0.05] dark:border-white/5">
                <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">
                  {safeNav(t('nav.experiences'), 'Experiences')}
                </p>
                <div className="mt-1 space-y-1">
                  {EXPERIENCES_NAV_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 text-xs font-medium text-[#1A2332] dark:text-gray-200 hover:text-[#C5A059] hover:bg-black/[0.03] dark:hover:bg-white/5 rounded-xl transition-colors"
                    >
                      <span>{item.titleKey ? safeNav(t(item.titleKey), item.title) : item.title}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30">
                          {item.badgeKey ? safeNav(t(item.badgeKey), item.badge) : item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Egypt Life */}
              <div className="pt-2 border-t border-black/[0.05] dark:border-white/5">
                <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">
                  {safeNav(t('nav.egyptLife'), 'Egypt Life')}
                </p>
                <div className="mt-1 space-y-1">
                  {LIFE_NAV_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 text-xs font-medium text-[#1A2332] dark:text-gray-200 hover:text-[#C5A059] hover:bg-black/[0.03] dark:hover:bg-white/5 rounded-xl transition-colors"
                    >
                      <span>{item.titleKey ? safeNav(t(item.titleKey), item.title) : item.title}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30">
                          {item.badgeKey ? safeNav(t(item.badgeKey), item.badge) : item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Official */}
              <div className="pt-2 border-t border-black/[0.05] dark:border-white/5">
                <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">
                  {safeNav(t('nav.official'), 'Official')}
                </p>
                <div className="mt-1 space-y-1">
                  {OFFICIAL_NAV_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 text-xs font-medium text-[#1A2332] dark:text-gray-200 hover:text-[#C5A059] hover:bg-black/[0.03] dark:hover:bg-white/5 rounded-xl transition-colors"
                    >
                      <span>{item.titleKey ? safeNav(t(item.titleKey), item.title) : item.title}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30">
                          {item.badgeKey ? safeNav(t(item.badgeKey), item.badge) : item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Meresankh VR */}
              <div className="pt-3 border-t border-black/[0.05] dark:border-white/5">
                <Link
                  href="/gem-vr-experience"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#C5A059] text-xs font-bold uppercase tracking-wider hover:bg-[#C5A059]/25 transition-colors"
                >
                  <Glasses className="w-4 h-4 text-[#C5A059]" />
                  <span>{safeNav(t('nav.launchMeresankh'), 'Launch Meresankh VR')}</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <EliteModal isOpen={isEliteModalOpen} onClose={() => setIsEliteModalOpen(false)} />
    </header>
  );
}
