'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Crown,
  Sparkles,
  ShieldCheck,
  Compass,
  ArrowRight,
  Mail,
  CheckCircle2,
  Key,
  Gem,
  Anchor,
  Clock,
  Star
} from 'lucide-react';

export default function ElitePage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setLoading(true);
    setTimeout(() => {
      // Save locally to simulate VIP list registration
      try {
        const existing = JSON.parse(localStorage.getItem('egyptx_elite_vip_list') || '[]');
        if (!existing.includes(email)) {
          existing.push(email);
          localStorage.setItem('egyptx_elite_vip_list', JSON.stringify(existing));
        }
      } catch (err) {}

      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-[#C9A84C]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-3/4 right-10 w-[500px] h-[500px] bg-[#1B6B93]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* VIP Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#C9A84C]/20 via-[#E2CB85]/25 to-[#C9A84C]/20 border border-[#C9A84C]/60 text-[#E2CB85] text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(201,168,76,0.2)]">
            <Crown className="w-4 h-4 text-[#C9A84C] animate-pulse" />
            <span>Invitation-Only Sanctuary · النخبة المصرية</span>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#E2CB85] to-[#C9A84C]">
                EgyptX Elite
              </span>
            </h1>
            <p className="text-2xl sm:text-3xl font-bold text-[#E2CB85] font-arabic">
              مصر إكس إيليت · تجارب الملوك والأساطير
            </p>
          </div>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-white/85 font-medium leading-relaxed max-w-2xl mx-auto">
            Premium Egyptian Experiences — <span className="text-[#E2CB85] underline decoration-[#C9A84C]/50 underline-offset-4">Coming Soon</span>
          </p>

          <p className="text-sm text-white/60 leading-relaxed max-w-xl mx-auto">
            The ultimate luxury travel tier for distinguished connoisseurs, private collectors, and travelers seeking unprecedented access to ancient sanctuaries and bespoke royal hospitality.
          </p>

          {/* Early Access Email Signup Form */}
          <div className="pt-4 max-w-md mx-auto">
            {submitted ? (
              <div className="p-5 rounded-2xl bg-[#0A1628]/90 border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)] text-center space-y-2 animate-fade-in">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">VIP Request Received · تم تسجيلك بنجاح</h3>
                <p className="text-xs text-white/70">
                  You are registered for early access. Our private concierge team will notify you as soon as admissions open.
                </p>
                <span className="text-[11px] font-mono text-[#E2CB85]">
                  Status: Priority Waitlist #{Math.floor(Math.random() * 40) + 12}
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 w-4 h-4 text-[#C9A84C]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email for private early access..."
                    className="w-full pl-11 pr-32 py-3.5 rounded-2xl bg-[#0A1628]/90 border border-[#C9A84C]/40 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all shadow-[0_0_20px_rgba(0,0,0,0.4)]"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E2CB85] text-[#030712] font-bold text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(201,168,76,0.3)] disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Joining...' : 'Request Access'}
                  </button>
                </div>
                <p className="text-[11px] text-white/40 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C9A84C]" />
                  <span>Strictly confidential · Limited inaugural memberships</span>
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Exclusive Perks Preview Grid */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center justify-center gap-2">
              <Gem className="w-5 h-5 text-[#C9A84C]" />
              <span>What Awaits in EgyptX Elite</span>
            </h2>
            <p className="text-xs sm:text-sm text-white/50">
              Unrivaled privileges designed for high-profile international guests
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                icon: Key,
                titleEn: 'Private After-Hours Royal Sanctuaries',
                titleAr: 'دخول خاص واستثنائي بعد ساعات العمل الرسمية',
                desc: 'Experience the Giza Plateau, the Great Pyramid interior, and the tomb of Nefertari under the starry desert sky in total solitude with senior antiquities directors.',
                tag: 'Exclusive Access',
              },
              {
                icon: Anchor,
                titleEn: 'Presidential Nile Yacht Charters',
                titleAr: 'يخوت ودهبيات نيلية رئاسية مخصصة',
                desc: 'Handcrafted luxury Dahabiya sailing between Luxor and Aswan, featuring private master suites, Michelin-trained Egyptian culinary chefs, and private docking privileges.',
                tag: 'Bespoke Sailing',
              },
              {
                icon: Star,
                titleEn: 'Personal Egyptologist & Security Concierge',
                titleAr: 'مرشد أثري شخصي وفريق حراسة وضيافة خاص',
                desc: 'Accompanied throughout your journey by doctorate-level archaeological historians and dedicated 24/7 logistical liaisons ensuring absolute perfection.',
                tag: 'Concierge Tier',
              },
              {
                icon: Clock,
                titleEn: 'Private Vaults & Restoration Laboratory Tours',
                titleAr: 'جولات حصرية في معامل ترميم المومياوات والمتاحف',
                desc: 'Behind-the-scenes access to Grand Egyptian Museum restoration laboratories, private royal jewelry vaults, and active archaeological dig sites before public unveiling.',
                tag: 'Curated Heritage',
              },
            ].map((perk) => {
              const Icon = perk.icon;
              return (
                <div
                  key={perk.titleEn}
                  className="p-6 rounded-2xl bg-[#0A1628]/80 backdrop-blur-xl border border-[#C9A84C]/30 hover:border-[#C9A84C] transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.5)] group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/40 text-[#E2CB85] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#C9A84C]" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#E2CB85]">
                        {perk.tag}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-[#E2CB85] transition-colors">
                        {perk.titleEn}
                      </h3>
                      <p className="text-xs font-semibold text-[#E2CB85] font-arabic mt-0.5">
                        {perk.titleAr}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                      {perk.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-4">
                    <span className="text-[10px] text-white/40">Guaranteed Discretion</span>
                    <span className="text-xs font-semibold text-[#E2CB85] flex items-center gap-1">
                      <span>Elite Tier</span>
                      <Crown className="w-3.5 h-3.5 text-[#C9A84C]" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Navigation Back to Site */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <Link href="/" className="hover:text-[#C9A84C] transition-colors flex items-center gap-1">
            <span>← Return to EgyptX AI Home</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/planner" className="hover:text-[#C9A84C] transition-colors">
              AI Planner
            </Link>
            <span>·</span>
            <Link href="/bookings" className="hover:text-[#C9A84C] transition-colors">
              Bookings & Flights
            </Link>
            <span>·</span>
            <Link href="/videos" className="hover:text-[#C9A84C] transition-colors">
              Reels & Videos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
