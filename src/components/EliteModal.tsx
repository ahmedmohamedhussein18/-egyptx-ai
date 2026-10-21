'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Sparkles, CheckCircle2, Crown, ArrowRight, Zap, Lock, ShieldCheck, 
  Check, ArrowLeft, CreditCard, Loader2, Shield
} from 'lucide-react';

interface EliteModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextMessage?: string;
  contextTitle?: string;
  featureTrigger?: 'time-travel' | 'kids-story' | 'hidden-gems' | string;
}

interface Plan {
  id: string;
  name: string;
  badge: string;
  monthlyPrice: string;
  annualPrice: string;
  monthlyPeriod: string;
  annualPeriod: string;
  desc: string;
  features: string[];
  highlight?: boolean;
  ctaText: string;
}

const PLANS: Plan[] = [
  {
    id: 'explorer',
    name: 'Explorer',
    badge: 'Complimentary Tier',
    monthlyPrice: '$0',
    annualPrice: '$0',
    monthlyPeriod: '/ forever',
    annualPeriod: '/ forever',
    desc: 'Essential AI capabilities to discover Egypt’s most famous landmarks.',
    features: [
      'Basic AI Voice (Standard ElevenLabs)',
      'Standard AI Travel Planner',
      'Basic Kids Mode Educational Quizzes',
      'Community Site Exploration',
    ],
    ctaText: 'Current Plan',
  },
  {
    id: 'adventurer',
    name: 'Adventurer Pro',
    badge: 'Executive Connoisseur',
    monthlyPrice: '$19.99',
    annualPrice: '$189.99',
    monthlyPeriod: '/ month',
    annualPeriod: '/ year',
    desc: 'Enhanced AI tooling, extended voice studio, and smart map access for discerning travelers.',
    features: [
      'Extended AI Voice Studio (Ultra-HD Audio)',
      'Standard AI Memories (Basic Trip Journaling)',
      'Interactive Smart Tourism Map Access',
      'Offline Site Itinerary & Audio Downloads',
      'Priority Sovereign AI Query Processing',
    ],
    ctaText: 'Choose Pro',
  },
  {
    id: 'pharaoh',
    name: 'Pharaoh Elite',
    badge: 'Royal VIP Sanctuary',
    monthlyPrice: '$39.99',
    annualPrice: '$299.99',
    monthlyPeriod: '/ month',
    annualPeriod: '/ year',
    desc: 'The ultimate investment for elite travelers, history connoisseurs, and families seeking absolute perfection.',
    features: [
      'Unlimited Ultra-HD ElevenLabs Historical Royal Voices',
      'Pro AI Memories & Travel Cards (Unlimited Digital Postcards & Auto-Journals)',
      'Hidden Gems & Classified Restricted Tomb Vaults',
      'Kids Mode Pro (Personalized AI Hero Stories & Full Control)',
      'VIP Priority Sovereign Queue & 24/7 AI Heritage Concierge',
    ],
    highlight: true,
    ctaText: 'Unlock Elite Now',
  },
];

const COUNTRIES = [
  { code: 'EG', name: 'Egypt' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'CA', name: 'Canada' },
  { code: 'IT', name: 'Italy' },
];

export default function EliteModal({ 
  isOpen, 
  onClose,
  contextMessage,
  contextTitle,
  featureTrigger,
}: EliteModalProps) {
  const [view, setView] = useState<'plans' | 'checkout' | 'success'>('plans');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<Plan>(PLANS[2]);

  const activePrice = (plan: Plan) => billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
  const activePeriod = (plan: Plan) => billingCycle === 'annual' ? plan.annualPeriod : plan.monthlyPeriod;
  
  const displayPrice = activePrice(selectedPlan);
  const displayPeriod = activePeriod(selectedPlan);
  const displayPlanName = billingCycle === 'annual' && selectedPlan.id !== 'explorer'
    ? `${selectedPlan.name} (Annual VIP Pass)`
    : selectedPlan.name;
  
  // Checkout Form State
  const [cardName, setCardName] = useState('John Doe');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('08/28');
  const [cvv, setCvv] = useState('888');
  const [country, setCountry] = useState('EG');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const handleSelectPlan = (plan: Plan) => {
    if (plan.id === 'explorer') return; // Free tier
    setSelectedPlan(plan);
    setView('checkout');
  };

  const handleFormatCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  const handleFormatExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      setExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setExpiry(raw);
    }
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const fakeTxn = `EGX-${Math.floor(100000 + Math.random() * 900000)}`;
      setTransactionId(fakeTxn);
      
      try {
        localStorage.setItem('egyptx_is_elite', 'true');
        localStorage.setItem('egyptx_tier', displayPlanName);
        localStorage.setItem('egyptx_amount_paid', displayPrice);
        window.dispatchEvent(new Event('egyptx-elite-trials-updated'));
        window.dispatchEvent(new Event('storage'));
      } catch {
        // ignore storage errors
      }

      setView('success');
    }, 2000);
  };

  const handleCloseAll = () => {
    setView('plans');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Deep Midnight Obsidian Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseAll}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-2xl cursor-pointer"
        />

        {/* Ambient Glowing Mesh Blobs */}
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-[201] overflow-hidden">
          <div className="absolute -top-28 -left-28 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute -bottom-28 -right-28 w-96 h-96 bg-indigo-600/25 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[150px]" />
        </div>

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 25 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full ${
            view === 'plans' ? 'max-w-5xl' : 'max-w-xl'
          } bg-gradient-to-b from-[#0B1120]/95 via-[#060D1A]/95 to-[#020610]/95 backdrop-blur-2xl border border-amber-500/30 shadow-[0_0_60px_rgba(217,119,6,0.18),0_25px_80px_rgba(0,0,0,0.95)] rounded-3xl p-5 sm:p-8 text-center z-[202] my-auto overflow-hidden max-h-[92vh] overflow-y-auto before:absolute before:inset-0 before:rounded-3xl before:p-[1px] before:bg-gradient-to-b before:from-amber-400/35 before:via-white/5 before:to-transparent before:pointer-events-none transition-all duration-300`}
        >
          {/* Top Radial Golden Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-gradient-to-b from-amber-400/20 to-transparent blur-3xl pointer-events-none" />

          {/* Minimalist Close 'X' Button */}
          <button
            onClick={handleCloseAll}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 hover:border-amber-500/40 border border-white/10 rounded-full transition-all duration-200 cursor-pointer z-30 shadow-sm"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* ═══════════════════════════════════════════════════════════════════
              VIEW 1: PLANS SELECTION
             ═══════════════════════════════════════════════════════════════════ */}
          {view === 'plans' && (
            <div>
              {/* Crown Floating Emblem */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative mx-auto w-16 h-16 sm:w-18 sm:h-18 rounded-3xl bg-gradient-to-br from-amber-400/25 via-yellow-500/15 to-indigo-950/40 border border-amber-400/50 flex items-center justify-center mb-3 shadow-[0_0_35px_rgba(245,158,11,0.35)] backdrop-blur-md"
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-amber-400/20 to-transparent animate-pulse" />
                <Crown className="w-8 h-8 sm:w-9 sm:h-9 text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-gradient-to-r from-amber-300 to-yellow-500 border border-black/40" />
                </span>
              </motion.div>

              {/* Contextual Teaser Banner if triggered from preview lock */}
              {contextMessage && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold mb-3 shadow-[0_0_20px_rgba(245,158,11,0.25)] animate-pulse">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{contextMessage}</span>
                </div>
              )}

              {/* Title */}
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
                <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-sm">
                  {contextTitle || 'Experience Unrivaled Luxury & AI Heritage'}
                </span>
              </h2>

              {/* Subtitle with Luxury Tone */}
              <p className="text-xs sm:text-sm text-slate-300/80 font-normal max-w-xl mx-auto mb-6 tracking-wide leading-relaxed">
                {contextMessage 
                  ? 'Upgrade to EgyptX Elite to unlock full unrestricted access to all VIP tools, time portals, and hidden vaults.'
                  : 'The ultimate investment for elite travelers, history connoisseurs, and families seeking absolute perfection.'}
              </p>

              {/* High-End Billing Cycle Selector (Monthly vs Annual VIP Pass) */}
              <div className="flex items-center justify-center mb-8">
                <div className="p-1 bg-white/[0.04] border border-amber-500/20 rounded-2xl flex items-center gap-1.5 shadow-[0_0_25px_rgba(245,158,11,0.1)] backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      billingCycle === 'monthly'
                        ? 'bg-white/15 text-white shadow-md border border-white/10'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Monthly Billing
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('annual')}
                    className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      billingCycle === 'annual'
                        ? 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                        : 'text-amber-400 hover:text-amber-300'
                    }`}
                  >
                    <span>Annual VIP Pass</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                      billingCycle === 'annual'
                        ? 'bg-slate-950/20 text-slate-950'
                        : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    }`}>
                      Save 35%
                    </span>
                  </button>
                </div>
              </div>

              {/* 3 Pricing Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mb-7 text-left items-stretch">
                {PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative p-5 sm:p-6 rounded-3xl backdrop-blur-xl flex flex-col justify-between transition-all duration-300 ${
                      plan.highlight
                        ? 'bg-gradient-to-b from-amber-500/[0.14] via-[#0B1120]/95 to-[#040913] border-2 border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.28)] hover:shadow-[0_0_55px_rgba(245,158,11,0.45)]'
                        : plan.id === 'adventurer'
                        ? 'bg-gradient-to-b from-blue-500/[0.08] via-white/[0.02] to-transparent border border-blue-400/30 hover:border-blue-400/60 shadow-lg'
                        : 'bg-white/[0.02] border border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Floating Luxury Badges */}
                    {plan.highlight && (
                      <div className="absolute -top-3.5 right-6 z-10">
                        {billingCycle === 'annual' ? (
                          <span className="px-3.5 py-1 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center gap-1 animate-pulse">
                            <Sparkles className="w-3 h-3" />
                            Best Value - Save 35%
                          </span>
                        ) : (
                          <span className="px-3.5 py-1 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-md flex items-center gap-1">
                            <Crown className="w-3 h-3" />
                            Most Popular · Sovereign Tier
                          </span>
                        )}
                      </div>
                    )}

                    <div>
                      {/* Header Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border ${
                            plan.highlight
                              ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                              : plan.id === 'adventurer'
                              ? 'bg-blue-400/15 text-blue-300 border-blue-400/30'
                              : 'bg-white/10 text-slate-300 border-white/15'
                          }`}
                        >
                          {plan.badge}
                        </span>
                        {plan.highlight && <Crown className="w-4 h-4 text-amber-400" />}
                      </div>

                      <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-1.5">
                        <span>{plan.name}</span>
                      </h3>
                      <p className="text-xs text-slate-400 mb-5 leading-relaxed min-h-[36px]">
                        {plan.desc}
                      </p>

                      {/* Price */}
                      <div className="mb-5 pb-4 border-b border-white/10 flex flex-wrap items-baseline gap-1.5">
                        <span
                          className={`text-3xl sm:text-4xl font-black ${
                            plan.highlight
                              ? 'bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent'
                              : 'text-white'
                          }`}
                        >
                          {activePrice(plan)}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{activePeriod(plan)}</span>
                        {billingCycle === 'annual' && plan.id === 'pharaoh' && (
                          <span className="text-[11px] text-amber-300 font-bold ml-1 bg-amber-400/15 px-2 py-0.5 rounded-full border border-amber-400/30">
                            ≈ $24.99/mo
                          </span>
                        )}
                        {billingCycle === 'annual' && plan.id === 'adventurer' && (
                          <span className="text-[11px] text-blue-300 font-bold ml-1 bg-blue-400/15 px-2 py-0.5 rounded-full border border-blue-400/30">
                            Save 20%
                          </span>
                        )}
                      </div>

                      {/* Feature Bullet Points */}
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-snug">
                            <span
                              className={`p-1 rounded-full shrink-0 mt-0.5 ${
                                plan.highlight
                                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                  : 'bg-white/10 text-emerald-400'
                              }`}
                            >
                              <Check className="w-3 h-3" />
                            </span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <div>
                      {plan.id === 'explorer' ? (
                        <button
                          type="button"
                          disabled
                          className="w-full py-3 px-4 rounded-xl bg-white/[0.04] border border-white/10 text-slate-500 font-bold text-xs uppercase tracking-wider cursor-default"
                        >
                          {plan.ctaText}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSelectPlan(plan)}
                          className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group ${
                            plan.highlight
                              ? 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] hover:scale-[1.02] active:scale-[0.98]'
                              : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:scale-[1.02] active:scale-[0.98]'
                          }`}
                        >
                          <span>{plan.ctaText}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Secure Checkout Trust Ticker */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-medium text-slate-300 py-2.5 px-4 rounded-xl bg-white/[0.03] border border-white/10 shadow-inner">
                <span className="flex items-center gap-1.5 text-amber-300">
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  Instant Activation
                </span>
                <span className="text-white/20">•</span>
                <span className="flex items-center gap-1.5 text-slate-200">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  256-Bit SSL Encrypted
                </span>
                <span className="text-white/20">•</span>
                <span className="flex items-center gap-1.5 text-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  Cancel Anytime
                </span>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              VIEW 2: REALISTIC SECURE CHECKOUT GATEWAY
             ═══════════════════════════════════════════════════════════════════ */}
          {view === 'checkout' && (
            <div className="text-left">
              {/* Back button */}
              <button
                type="button"
                onClick={() => setView('plans')}
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold mb-4 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Plans</span>
              </button>

              {/* Header with Security Badge */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <span>Secure Checkout</span>
                    <Shield className="w-5 h-5 text-emerald-400" />
                  </h3>
                  <p className="text-xs text-slate-400">
                    Encrypted gateway · Instant VIP activation
                  </p>
                </div>
                {/* Plan Summary Pill */}
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 inline-block mb-1">
                    {displayPlanName}
                  </span>
                  <p className="text-lg font-black text-white">
                    {displayPrice}
                    <span className="text-[10px] text-slate-400 font-normal ml-0.5">{displayPeriod}</span>
                  </p>
                </div>
              </div>

              {/* Virtual Luxury Credit Card Preview */}
              <div className="relative w-full h-44 sm:h-48 rounded-2xl bg-gradient-to-tr from-[#0F172A] via-[#1E293B] to-[#0A1628] border border-amber-400/40 p-5 shadow-2xl overflow-hidden mb-5 flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                
                {/* Card Top Row */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-6 rounded bg-gradient-to-br from-amber-300 to-amber-500 shadow-sm" />
                    <span className="text-xs font-mono text-amber-200/80">EGYPTX VIP</span>
                  </div>
                  <Crown className="w-5 h-5 text-amber-400" />
                </div>

                {/* Card Middle: Number */}
                <div className="relative z-10 my-auto">
                  <p className="font-mono text-base sm:text-lg tracking-widest text-white drop-shadow">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </p>
                </div>

                {/* Card Bottom: Name & Expiry */}
                <div className="flex items-center justify-between relative z-10 text-xs text-slate-300">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Cardholder</span>
                    <span className="font-medium uppercase tracking-wider text-white">{cardName || 'YOUR NAME'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Expires</span>
                    <span className="font-mono font-medium text-white">{expiry || 'MM/YY'}</span>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <form onSubmit={handlePay} className="space-y-3.5">
                {/* Cardholder Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-[#030712]/70 border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                  />
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Card Number</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                      <CreditCard className="w-3 h-3 text-amber-400" />
                      Visa / Mastercard / Amex
                    </span>
                  </label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={handleFormatCardNumber}
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    className="w-full bg-[#030712]/70 border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                  />
                </div>

                {/* Expiry Date, CVV & Country */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      required
                      value={expiry}
                      onChange={handleFormatExpiry}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full bg-[#030712]/70 border border-white/15 focus:border-amber-400 rounded-xl px-3 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      required
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full bg-[#030712]/70 border border-white/15 focus:border-amber-400 rounded-xl px-3 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Country
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-[#030712]/70 border border-white/15 focus:border-amber-400 rounded-xl px-2.5 py-2.5 text-xs text-white focus:outline-none transition-all shadow-inner cursor-pointer"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code} className="bg-[#0A1628] text-white">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Trust & Gateway Ticker */}
                <div className="py-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10 mt-3 pt-3">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    256-Bit SSL Encrypted
                  </span>
                  <span>Powered by Stripe & Paymob</span>
                </div>

                {/* Pay Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_45px_rgba(245,158,11,0.65)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Processing Secure Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-slate-950" />
                      <span>Pay {displayPrice} Securely</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              VIEW 3: PAYMENT SUCCESS CONFIRMATION SCREEN
             ═══════════════════════════════════════════════════════════════════ */}
          {view === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="py-6 sm:py-8 flex flex-col items-center text-center"
            >
              {/* Animated Checkmark Badge */}
              <div className="relative w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mb-5 shadow-[0_0_40px_rgba(16,185,129,0.5)]">
                <CheckCircle2 className="w-12 h-12" />
                <Crown className="absolute -top-1 -right-1 w-6 h-6 text-[#C5A059]" />
              </div>

              {/* Success Title */}
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">
                Payment Successful!
              </h3>
              <p className="text-sm font-semibold bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent mb-6">
                Welcome to EgyptX Elite
              </p>

              {/* Transaction Receipt Card */}
              <div className="w-full max-w-sm bg-white/[0.03] border border-white/10 rounded-2xl p-4.5 mb-6 text-left space-y-2.5 text-xs text-slate-300">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-slate-400">Transaction ID</span>
                  <span className="font-mono text-white font-medium">{transactionId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Plan Activated</span>
                  <span className="text-amber-300 font-bold">{displayPlanName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Amount Billed</span>
                  <span className="text-white font-bold">{displayPrice}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="text-slate-400">Access Status</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Active (Instant VIP Unlocked)
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleCloseAll}
                className="w-full max-w-sm py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_45px_rgba(245,158,11,0.6)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Close & Start Exploring</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </motion.div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
