'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { logoutAction } from '@/app/actions/auth';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'AI Planner', href: '/planner' },
  { name: 'Explore Egypt', href: '/explore' },
  { name: 'Smart Sites', href: '/smart-site' },
  { name: 'Museum AI', href: '/museum-ai' },
  { name: 'Hidden Egypt', href: '/hidden-egypt' },
  { name: 'Crafts', href: '/crafts' },
  { name: 'Tourist Passport', href: '/tourist-passport' }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0A1628]/80 backdrop-blur-xl border-b border-[#C9A84C]/10 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#C9A84C] group-hover:scale-110 transition-transform">
              <path d="M12 2L22 20H2L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#C9A84C] to-[#E3C973]">
                EgyptX
              </span>
              <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold bg-[#1B6B93]/20 text-[#1B6B93] border border-[#1B6B93]/30">
                AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-5">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-sm font-medium text-white/80 hover:text-[#C9A84C] transition-colors group py-2"
              >
                {item.name}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#C9A84C] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            {user && (
              <Link
                href="/ai-guide"
                className="relative text-sm font-medium text-white/80 hover:text-[#C9A84C] transition-colors group py-2"
              >
                AI Guide
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#C9A84C] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}
          </nav>

          {/* Right side buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/command-center"
              className="px-4 py-2 text-sm font-medium text-white/90 border border-[#C9A84C]/50 rounded hover:bg-[#C9A84C]/10 hover:border-[#C9A84C] transition-colors"
            >
              Command
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
                      className="absolute right-0 mt-2 w-48 bg-[#0A1628] border border-[#C9A84C]/20 rounded-xl overflow-hidden shadow-xl"
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
                        Profile & Passport
                      </Link>
                  <form action={logoutAction} className="block w-full">
                    <button
                      type="submit"
                      onClick={() => setDropdownOpen(false)}
                      className="block w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-red-400"
                    >
                      Log Out
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link
            href="/login"
            className="px-5 py-2 text-sm font-medium text-[#0A1628] bg-[#C9A84C] rounded hover:bg-[#E3C973] transition-colors shadow-[0_0_15px_rgba(201,168,76,0.3)]"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile menu button */}
      <button
        className="lg:hidden p-2 text-white/80 hover:text-white"
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

  {/* Mobile Menu */}
  <AnimatePresence>
    {mobileMenuOpen && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full left-0 right-0 bg-[#0A1628]/95 backdrop-blur-xl border-b border-[#C9A84C]/20 lg:hidden shadow-2xl"
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
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-3 text-sm font-medium text-white/80 hover:text-[#C9A84C] hover:bg-white/5 rounded-md transition-colors"
            >
              {item.name}
            </Link>
          ))}
          {user && (
            <Link
              href="/ai-guide"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-3 text-sm font-medium text-white/80 hover:text-[#C9A84C] hover:bg-white/5 rounded-md transition-colors"
            >
              AI Guide
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
                  Log Out
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
