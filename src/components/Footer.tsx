import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#060E1A] border-t border-[#D4AF37]/20 pt-20 pb-10">
      <div className="container mx-auto px-6 max-w-7xl">
        
        <div className="mb-16">
          <Link href="/" className="inline-block">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FFDF73] via-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent">
              EgyptX AI
            </h2>
          </Link>
          <p className="text-white/50 mt-2 text-sm tracking-wide">
            The National Smart Tourism Ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Column 1 */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-white/70 uppercase text-xs tracking-[0.2em] font-semibold mb-2">Explore</h3>
            <Link href="#" className="text-white/40 hover:text-[#D4AF37] transition-colors text-sm">Home</Link>
            <Link href="#" className="text-white/40 hover:text-[#D4AF37] transition-colors text-sm">AI Planner</Link>
            <Link href="#" className="text-white/40 hover:text-[#D4AF37] transition-colors text-sm">Explore Egypt</Link>
            <Link href="#" className="text-white/40 hover:text-[#D4AF37] transition-colors text-sm">Smart Sites</Link>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-white/70 uppercase text-xs tracking-[0.2em] font-semibold mb-2">Experience</h3>
            <Link href="/museum-ai" className="text-white/40 hover:text-[#D4AF37] transition-colors text-sm">Museum AI</Link>
            <Link href="/hidden-egypt" className="text-white/40 hover:text-[#D4AF37] transition-colors text-sm">Hidden Egypt</Link>
            <Link href="/emergency" className="text-white/40 hover:text-[#D4AF37] transition-colors text-sm">Emergency Assistant</Link>
            <Link href="/tourist-passport" className="text-white/40 hover:text-[#D4AF37] transition-colors text-sm">Tourist Passport</Link>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-white/70 uppercase text-xs tracking-[0.2em] font-semibold mb-2">Ecosystem</h3>
            <Link href="#" className="text-white/40 hover:text-[#D4AF37] transition-colors text-sm">Command Center</Link>
            <Link href="#" className="text-white/40 hover:text-[#D4AF37] transition-colors text-sm">Business Portal</Link>
            <Link href="#" className="text-white/40 hover:text-[#D4AF37] transition-colors text-sm">Government</Link>
            <Link href="#" className="text-white/40 hover:text-[#D4AF37] transition-colors text-sm">Partners</Link>
          </div>

          {/* Column 4 */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-white/70 uppercase text-xs tracking-[0.2em] font-semibold mb-2">About</h3>
            <Link href="#" className="text-white/40 hover:text-[#D4AF37] transition-colors text-sm">About EgyptX</Link>
            <Link href="#" className="text-white/40 hover:text-[#D4AF37] transition-colors text-sm">Technology</Link>
            <Link href="#" className="text-white/40 hover:text-[#D4AF37] transition-colors text-sm">Privacy</Link>
            <Link href="#" className="text-white/40 hover:text-[#D4AF37] transition-colors text-sm">Terms</Link>
          </div>
        </div>

        {/* Decorative SVG Line */}
        <div className="w-full flex justify-center mb-8 opacity-30">
          <svg width="200" height="12" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 6H60M200 6H140M70 1L80 11M90 11L100 1M110 11L120 1M130 1L120 11" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="100" cy="6" r="3" fill="#D4AF37"/>
          </svg>
        </div>

        {/* Bottom Bar */}
        <div className="text-center">
          <p className="text-white/30 text-xs tracking-wider">
            &copy; 2026 EgyptX AI. The National Smart Tourism Ecosystem.
          </p>
        </div>

      </div>
    </footer>
  );
}
