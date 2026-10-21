'use client';
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, MapPin, Send, CheckCircle2, Sparkles } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      setTimeout(() => {
        setSubmitted(false);
        setIsContactModalOpen(false);
      }, 3000);
    }, 1000);
  };

  return (
    <footer className="bg-[#F8F3E9] dark:bg-[#070B13] border-t border-black/[0.05] dark:border-[#D4AF37]/20 pt-24 pb-12 transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-7xl">
        
        <div className="mb-16">
          <Link href="/" className="inline-block">
            <h2 className="text-3xl font-serif-editorial font-bold bg-gradient-to-r from-[#A68440] via-[#C5A059] to-[#A68440] dark:from-[#FFDF73] dark:via-[#D4AF37] dark:to-[#B8860B] bg-clip-text text-transparent">{t('footer.title')}</h2>
          </Link>
          <p className="text-slate-600 dark:text-white/50 mt-2 text-sm tracking-wide font-light">{t('footer.subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Column 1 */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-slate-900 dark:text-gray-200 uppercase text-xs tracking-[0.2em] font-semibold mb-2">{t('footer.explore')}</h3>
            <Link href="/" className="text-slate-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-[#D4AF37] transition-colors text-sm">{t('footer.home')}</Link>
            <Link href="/planner" className="text-slate-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-[#D4AF37] transition-colors text-sm">{t('footer.aiPlanner')}</Link>
            <Link href="/explore" className="text-slate-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-[#D4AF37] transition-colors text-sm">{t('footer.exploreEgypt')}</Link>
            <Link href="/smart-site" className="text-slate-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-[#D4AF37] transition-colors text-sm">{t('footer.smartSites')}</Link>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-slate-900 dark:text-gray-200 uppercase text-xs tracking-[0.2em] font-semibold mb-2">{t('footer.experience')}</h3>
            <Link href="/museum-ai" className="text-slate-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-[#D4AF37] transition-colors text-sm">{t('footer.museumAi')}</Link>
            <Link href="/hidden-egypt" className="text-slate-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-[#D4AF37] transition-colors text-sm">{t('footer.hiddenEgypt')}</Link>
            <Link href="/emergency" className="text-slate-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-[#D4AF37] transition-colors text-sm">{t('footer.emergency')}</Link>
            <Link href="/tourist-passport" className="text-slate-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-[#D4AF37] transition-colors text-sm">{t('footer.touristPassport')}</Link>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-slate-900 dark:text-gray-200 uppercase text-xs tracking-[0.2em] font-semibold mb-2">{t('footer.ecosystem')}</h3>
            <Link href="/command-center" className="text-slate-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-[#D4AF37] transition-colors text-sm">{t('footer.commandCenter')}</Link>
            <Link href="/business-portal" className="text-slate-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-[#D4AF37] transition-colors text-sm">{t('footer.businessPortal')}</Link>
            <Link href="/government/dashboard" className="text-slate-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-[#D4AF37] transition-colors text-sm">{t('footer.government')}</Link>
            <Link href="/national-projects" className="text-slate-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-[#D4AF37] transition-colors text-sm">{t('footer.nationalProjects')}</Link>
          </div>

          {/* Column 4 */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-slate-900 dark:text-gray-200 uppercase text-xs tracking-[0.2em] font-semibold mb-2">{t('footer.discover')}</h3>
            <Link href="/crafts" className="text-slate-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-[#D4AF37] transition-colors text-sm">{t('footer.egyptianCrafts')}</Link>
            <Link href="/egyptian-culture" className="text-slate-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-[#D4AF37] transition-colors text-sm">{t('footer.egyptianCulture')}</Link>
            <Link href="/news" className="text-slate-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-[#D4AF37] transition-colors text-sm">{t('footer.journal')}</Link>
            <li className="list-none text-sm">
              <button onClick={() => setIsContactModalOpen(true)} className="text-slate-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-[#D4AF37] transition-colors text-left cursor-pointer">
                {t('footer.contactUs')}
              </button>
            </li>
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
          <p className="text-slate-500 dark:text-white/30 text-xs tracking-wider">{t('footer.copy')}</p>
        </div>

      </div>

      {/* Glassmorphism Contact Modal with /contact-bg.png */}
      <AnimatePresence>
        {isContactModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsContactModalOpen(false)}
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Dialog with contact-bg.png */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                backgroundImage: "url('/contact-bg.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              className="relative w-full max-w-2xl rounded-3xl overflow-hidden border border-[#C9A84C]/40 shadow-[0_0_60px_rgba(201,168,76,0.25),0_25px_80px_rgba(0,0,0,0.95)] z-[202] my-auto"
            >
              {/* Glassmorphic dark overlay */}
              <div className="relative bg-[#060E1A]/85 backdrop-blur-xl p-6 sm:p-8 text-white max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer z-10"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="text-center max-w-lg mx-auto mb-6 space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#E2CB85] text-xs font-semibold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
                    <span>{t('footer.contactModal.badge')}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {t('footer.contactModal.title')}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                    {t('footer.contactModal.subtitle')}
                  </p>
                </div>

                {/* Contact Badges Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                    <Mail className="w-4 h-4 text-[#C9A84C] mx-auto mb-1" />
                    <span className="text-[10px] text-gray-400 block font-mono">{t('footer.contactModal.emailLabel')}</span>
                    <a href="mailto:support@egyptx.ai" className="text-xs font-semibold text-white hover:text-[#C9A84C] transition-colors truncate block">
                      support@egyptx.ai
                    </a>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                    <Phone className="w-4 h-4 text-[#C9A84C] mx-auto mb-1" />
                    <span className="text-[10px] text-gray-400 block font-mono">{t('footer.contactModal.hotlineLabel')}</span>
                    <a href="tel:19654" className="text-xs font-semibold text-white hover:text-[#C9A84C] transition-colors block">
                      19654 / +20 2 2735 9000
                    </a>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                    <MapPin className="w-4 h-4 text-[#C9A84C] mx-auto mb-1" />
                    <span className="text-[10px] text-gray-400 block font-mono">{t('footer.contactModal.hqLabel')}</span>
                    <span className="text-xs font-semibold text-white block truncate">
                      {t('footer.contactModal.hqValue')}
                    </span>
                  </div>
                </div>

                {/* Form or Success Notification */}
                {submitted ? (
                  <div className="p-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-sm font-semibold flex flex-col items-center gap-2 text-center my-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    <span>{t('footer.contactModal.successTitle')}</span>
                    <span className="text-xs text-emerald-400/80">{t('footer.contactModal.successDesc')}</span>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1 font-mono">
                          {t('footer.contactModal.nameLabel')}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Sarah Jenkins"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] text-sm text-white placeholder-gray-500 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1 font-mono">
                          {t('footer.contactModal.emailInputLabel')}
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="sarah@example.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] text-sm text-white placeholder-gray-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1 font-mono">
                        {t('footer.contactModal.subjectLabel')}
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] text-sm text-white outline-none transition-all cursor-pointer"
                      >
                        <option value="General Inquiry" className="bg-[#0A1628] text-white">{t('footer.contactModal.subjects.general')}</option>
                        <option value="AI Itinerary & Planning" className="bg-[#0A1628] text-white">{t('footer.contactModal.subjects.planning')}</option>
                        <option value="Smart Site & Museum Access" className="bg-[#0A1628] text-white">{t('footer.contactModal.subjects.smartSite')}</option>
                        <option value="Enterprise / Tourism Partner" className="bg-[#0A1628] text-white">{t('footer.contactModal.subjects.enterprise')}</option>
                        <option value="Press & Media" className="bg-[#0A1628] text-white">{t('footer.contactModal.subjects.press')}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1 font-mono">
                        {t('footer.contactModal.messageLabel')}
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={t('footer.contactModal.messagePlaceholder')}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] text-sm text-white placeholder-gray-500 outline-none transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-5 rounded-full bg-gradient-to-r from-[#C9A84C] via-[#E2CB85] to-[#C9A84C] hover:brightness-110 text-gray-950 font-extrabold text-sm tracking-wide shadow-[0_0_20px_rgba(201,168,76,0.35)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 text-gray-950" />
                          <span>{t('footer.contactModal.sendBtn')}</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
