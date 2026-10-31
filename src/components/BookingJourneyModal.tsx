'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  MapPin,
  Users,
  CreditCard,
  X,
  Download,
  Copy,
  Check,
  Crown,
  ShieldCheck,
  Compass,
  ArrowRight,
  Send
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface BookingJourneyDetails {
  dayNumber?: number;
  cityName?: string;
  duration?: number;
  travelers?: number;
  budget?: string | null;
  travelStyle?: string | null;
  activitiesCount?: number;
  topActivityName?: string;
}

interface BookingJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: BookingJourneyDetails | null;
}

export default function BookingJourneyModal({
  isOpen,
  onClose,
  details,
}: BookingJourneyModalProps) {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';

  const [step, setStep] = useState<'form' | 'confirmed'>('form');
  const [fullName, setFullName] = useState('');
  const [contact, setContact] = useState('');
  const [specialNote, setSpecialNote] = useState('');
  const [bookingCode, setBookingCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate unique royal confirmation code
  const handleConfirmBooking = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const cityPrefix = (details?.cityName || 'EGY').slice(0, 3).toUpperCase();
      const code = `EGX-${cityPrefix}-${randomNum}`;
      setBookingCode(code);
      setIsSubmitting(false);
      setStep('confirmed');
    }, 600);
  };

  const handleCopyCode = () => {
    if (!bookingCode) return;
    navigator.clipboard?.writeText(bookingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetAndClose = () => {
    setStep('form');
    setFullName('');
    setContact('');
    setSpecialNote('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleResetAndClose}
          className="fixed inset-0 bg-[#030712]/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl bg-gradient-to-b from-[#0F192C] via-[#0A1220] to-[#050A14] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 shadow-[0_20px_70px_rgba(212,175,55,0.25)] overflow-hidden z-10 text-white"
        >
          {/* Subtle Pharaonic Hieroglyphic Glow Aura */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-[#1B6B93]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={handleResetAndClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors border border-white/10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {step === 'form' ? (
            /* STEP 1: Registration / Booking Form */
            <div>
              {/* Royal Emblem Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 via-[#C9A84C]/10 to-transparent border border-[#D4AF37]/50 shadow-[0_0_25px_rgba(212,175,55,0.3)] mb-3">
                  <Crown className="w-7 h-7 text-[#E2CB85] animate-pulse" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#E2CB85] text-xs font-semibold uppercase tracking-widest mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{isAr ? 'حجز مسار ملكي معتمد' : 'Royal Expedition Registry'}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F3E5AB] to-[#D4AF37]">
                  {details?.dayNumber
                    ? isAr
                      ? `تسجيل / حجز اليوم ${details.dayNumber} — ${details.cityName || 'مصر'}`
                      : `Book Day ${details.dayNumber} — ${details.cityName || 'Egypt'}`
                    : isAr
                    ? 'تسجيل وحجز الرحلة المصرية الكاملة'
                    : 'Register & Book Your Curated Egypt Journey'}
                </h3>
                <p className="text-sm text-white/60 mt-1.5 max-w-md mx-auto">
                  {isAr
                    ? 'ثبّت حجز مسارك السياحي المخصص واحصل على باقة المرشد الذكي وتصريح الزيارة الملكي فوراً.'
                    : 'Confirm your custom itinerary with priority monument access and an instant Royal Journey Passport.'}
                </p>
              </div>

              {/* Itinerary Summary Snapshot */}
              <div className="bg-[#050D1A]/80 border border-[#D4AF37]/20 rounded-2xl p-4 mb-6 backdrop-blur-sm">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#D4AF37]" />
                    <div>
                      <span className="text-white/40 block">{isAr ? 'الوجهة' : 'Destination'}</span>
                      <span className="font-semibold text-white/90">{details?.cityName || 'Egypt'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#4EB1E2]" />
                    <div>
                      <span className="text-white/40 block">{isAr ? 'المسافرين' : 'Travelers'}</span>
                      <span className="font-semibold text-white/90">
                        {details?.travelers || 1} {isAr ? 'أفراد' : 'Person(s)'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                    <CreditCard className="w-4 h-4 text-[#19A974]" />
                    <div>
                      <span className="text-white/40 block">{isAr ? 'المستوى' : 'Budget'}</span>
                      <span className="font-semibold text-[#E2CB85]">{details?.budget || 'VIP Royal'}</span>
                    </div>
                  </div>
                </div>

                {details?.topActivityName && (
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-white/70">
                    <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="truncate">
                      {isAr ? 'أبرز معالم اليوم:' : 'Highlight:'} <strong className="text-white">{details.topActivityName}</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Booking Form */}
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                    {isAr ? 'اسم المسافر / قائد الرحلة' : 'Lead Traveler Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={isAr ? 'مثال: أحمد محمود أو د. سارة' : 'e.g. Lord Alexander / Dr. Sophia'}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                    {isAr ? 'البريد الإلكتروني أو رقم الواتساب' : 'Email or WhatsApp Number'}
                  </label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder={isAr ? 'لتأكيد الحجز وتلقي كود التصريح' : 'To receive your confirmation voucher'}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                    {isAr ? 'طلبات خاصة (اختياري)' : 'Special Requests (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={specialNote}
                    onChange={(e) => setSpecialNote(e.target.value)}
                    placeholder={isAr ? 'فلوكة نيلية عند الغروب، إرشاد لغوي، مقعد متحرك...' : 'Nile Felucca sunset, Egyptologist guide, dietary requests...'}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#D4AF37] transition-all"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-[#D4AF37] via-[#E2CB85] to-[#C9A84C] text-[#030712] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        {isAr ? 'جاري توثيق الحجز الفرعوني...' : 'Securing Royal Reservation...'}
                      </span>
                    ) : (
                      <>
                        <span>{isAr ? 'تأكيد الحجز والحصول على التصريح الملكي' : 'Confirm & Issue Royal Journey Pass'}</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-center text-white/40 flex items-center justify-center gap-1.5 mt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#19A974]" />
                  <span>{isAr ? 'حجز مجاني ومضمون 100% عبر مظلة EgyptX للسياحة الذكية' : '100% Guaranteed & Endorsed by EgyptX Smart Tourism'}</span>
                </p>
              </form>
            </div>
          ) : (
            /* STEP 2: Royal Confirmation Certificate / Pharaonic Pass */
            <div className="text-center py-2">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-tr from-[#D4AF37]/20 via-[#19A974]/20 to-[#D4AF37]/30 border-2 border-[#D4AF37] flex items-center justify-center shadow-[0_0_35px_rgba(212,175,55,0.4)]"
              >
                <CheckCircle2 className="w-10 h-10 text-[#E2CB85]" />
              </motion.div>

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#19A974]/15 border border-[#19A974]/40 text-[#4EE2A2] text-xs font-bold uppercase tracking-widest mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#19A974]" />
                <span>{isAr ? 'تم التأكيد رسمياً' : 'Confirmed & Sealed'}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F3E5AB] to-[#D4AF37] mb-2">
                {isAr ? 'تم تأكيد رحلتك الفرعونية بنجاح!' : 'Your Egyptian Journey is Confirmed!'}
              </h3>

              <p className="text-sm text-white/70 max-w-md mx-auto mb-6">
                {isAr
                  ? `أهلاً بك يا ${fullName || 'صديقنا العزيز'}! تم ربط خط سيرك الملكي بالمرشد الذكي EgyptX وتأكيد تصريحك.`
                  : `Congratulations ${fullName || 'Voyager'}! Your royal itinerary is logged into the EgyptX Heritage Network.`}
              </p>

              {/* Royal Papyrus Digital Pass Card */}
              <div className="relative bg-[#050B16] border-2 border-[#D4AF37]/50 rounded-2xl p-5 mb-6 shadow-[0_0_30px_rgba(212,175,55,0.15)] text-left">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-xs font-bold tracking-widest text-[#E2CB85] uppercase">
                      EGYPTX ROYAL VOYAGE PASS
                    </span>
                  </div>
                  <span className="text-[11px] font-mono bg-[#D4AF37]/15 text-[#E2CB85] px-2 py-0.5 rounded border border-[#D4AF37]/30">
                    VIP 2026
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs mb-3">
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase">{isAr ? 'المسافر' : 'Traveler'}</span>
                    <span className="font-bold text-white text-sm truncate block">{fullName || 'EgyptX Guest'}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase">{isAr ? 'الوجهة واليوم' : 'Expedition Scope'}</span>
                    <span className="font-bold text-[#E2CB85] text-sm block">
                      {details?.dayNumber ? `Day ${details.dayNumber} (${details.cityName})` : `${details?.duration || 7} Days in Egypt`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-white/5 rounded-xl p-3 border border-white/10">
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase">{isAr ? 'كود الحجز الملكي' : 'Royal Booking Code'}</span>
                    <span className="font-mono font-extrabold text-[#F3E5AB] text-base tracking-wider">{bookingCode}</span>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-[#19A974]" />
                        <span className="text-[#19A974]">{isAr ? 'تم النسخ' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>{isAr ? 'نسخ' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Pharaonic Blessing */}
                <div className="mt-3 text-center">
                  <p className="text-[11px] italic text-[#E2CB85]/80 font-serif">
                    {isAr
                      ? '«لتصحبكم بركات رع ونيل مصر الخالد في كل خطوة على أرض الفراعنة»'
                      : '"May the eternal majesty of the Nile and the warmth of Ra watch over your voyage."'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleResetAndClose}
                  className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E2CB85] text-[#030712] font-bold text-sm hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
                >
                  {isAr ? 'العودة لمتابعة خط السير' : 'Return to Itinerary'}
                </button>
                <button
                  onClick={handleCopyCode}
                  className="py-3 px-5 rounded-xl bg-white/5 border border-[#D4AF37]/30 text-[#E2CB85] font-semibold text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{isAr ? 'حفظ الكود' : 'Save Pass Code'}</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
