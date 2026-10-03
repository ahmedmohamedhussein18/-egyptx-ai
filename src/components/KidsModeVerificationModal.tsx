'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Mail, RefreshCw, X, CheckCircle2, AlertCircle, Sparkles, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface KidsModeVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userEmail?: string;
}

export default function KidsModeVerificationModal({
  isOpen,
  onClose,
  onSuccess,
  userEmail: propEmail,
}: KidsModeVerificationModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [emailInput, setEmailInput] = useState<string>('');
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize email state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      const initialEmail = (
        propEmail ||
        user?.email ||
        (typeof window !== 'undefined' ? localStorage.getItem('egyptx-user-email') : '') ||
        ''
      ).trim();
      setEmailInput(initialEmail);
      setStep('email');
      setDigits(['', '', '', '', '', '']);
      setError(null);
      setSuccess(false);
      setStatusMessage('');
      setCountdown(0);
    }
  }, [isOpen, propEmail, user?.email]);

  // Resend cooldown timer
  useEffect(() => {
    if (!isOpen || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, countdown]);

  // Dispatch OTP via backend API
  const handleSendOtp = useCallback(async (targetEmail: string) => {
    const cleanEmail = targetEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address (e.g. user@gmail.com)');
      return;
    }

    setIsSending(true);
    setError(null);
    setStatusMessage('Sending verification code...');

    try {
      // Save email locally for convenience
      try {
        localStorage.setItem('egyptx-user-email', cleanEmail);
      } catch (e) {
        // ignore storage errors
      }

      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to dispatch verification code');
      }

      setStatusMessage(`Verification code sent to your email (${cleanEmail})`);
      setStep('otp');
      setCountdown(30);

      // Focus first OTP input box after transition
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 250);
    } catch (err: any) {
      console.error('[KidsModeVerificationModal] send-otp error:', err);
      setError(err?.message || 'Unable to send code. Please try again.');
    } finally {
      setIsSending(false);
    }
  }, []);

  const handleEmailFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendOtp(emailInput);
  };

  const handleDigitChange = (index: number, val: string) => {
    setError(null);
    const cleaned = val.replace(/[^0-9]/g, '');

    // Pasted multiple digits
    if (cleaned.length > 1) {
      const newDigits = [...digits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = cleaned[i] || '';
      }
      setDigits(newDigits);
      const nextFocus = Math.min(cleaned.length, 5);
      inputRefs.current[nextFocus]?.focus();

      const fullCode = newDigits.join('');
      if (fullCode.length === 6) {
        handleVerifyOtp(fullCode);
      }
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = cleaned.slice(-1);
    setDigits(newDigits);

    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullCode = newDigits.join('');
    if (fullCode.length === 6) {
      handleVerifyOtp(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP with backend API
  const handleVerifyOtp = async (codeToVerify: string) => {
    if (codeToVerify.length < 4 || isVerifying) return;
    setIsVerifying(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.trim().toLowerCase(),
          otp: codeToVerify,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid confirmation code');
      }

      // Success! Persist verification & session token
      setSuccess(true);
      try {
        localStorage.setItem('isKidsModeVerified', 'true');
        sessionStorage.setItem('isKidsModeVerified', 'true');
        if (data.sessionToken) {
          localStorage.setItem('kidsModeSessionToken', data.sessionToken);
          sessionStorage.setItem('kidsModeSessionToken', data.sessionToken);
        }
      } catch (e) {
        // ignore storage errors
      }

      setTimeout(() => {
        onSuccess();
      }, 750);
    } catch (err: any) {
      setError(err?.message || 'Verification failed. Please check the code and try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerifyOtp(digits.join(''));
  };

  const handleResendClick = () => {
    if (countdown > 0 || isSending) return;
    setDigits(['', '', '', '', '', '']);
    handleSendOtp(emailInput);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Dark Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#030712]/85 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md bg-gradient-to-b from-[#0B1120] to-[#060E1A] border border-[#C9A84C]/40 rounded-3xl p-6 md:p-8 shadow-[0_25px_65px_rgba(0,0,0,0.85),0_0_45px_rgba(201,168,76,0.18)] overflow-hidden text-center z-10"
        >
          {/* Ambient Egyptian Gold Glow */}
          <div className="absolute -top-24 -left-24 w-52 h-52 bg-[#C9A84C]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-52 h-52 bg-[#1B6B93]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Security Shield Icon */}
          <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C9A84C]/20 to-[#1B6B93]/20 border border-[#C9A84C]/40 flex items-center justify-center mb-5 shadow-[0_0_25px_rgba(201,168,76,0.25)]">
            <ShieldCheck className="w-8 h-8 text-[#C9A84C]" />
            <span className="absolute -bottom-1 -right-1 p-1 bg-[#0B1120] rounded-full border border-[#C9A84C]/60">
              <Lock className="w-3 h-3 text-[#E2CB85]" />
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-extrabold text-white mb-2 tracking-tight">
            {step === 'email' ? 'Parental Email Verification' : 'Enter Verification Code'}
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-white/70 leading-relaxed mb-5">
            {step === 'email'
              ? 'Enter any parent email address to receive a secure 6-digit confirmation code.'
              : `We've sent a 6-digit verification code to ${emailInput}. Enter it below to unlock Kids Mode.`}
          </p>

          {/* Status Message (e.g. Verification code sent to your email) */}
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2.5 text-left"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-medium">{statusMessage}</span>
            </motion.div>
          )}

          {/* Error Message with Retry Action */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 bg-red-500/15 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center justify-between gap-3 text-left"
            >
              <div className="flex items-start gap-2 flex-1">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  handleSendOtp(emailInput);
                }}
                disabled={isSending || !emailInput.trim()}
                className="px-3 py-1.5 bg-red-500/25 hover:bg-red-500/40 text-white border border-red-400/50 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isSending ? 'animate-spin' : ''}`} />
                <span>Retry</span>
              </button>
            </motion.div>
          )}

          {/* Success State */}
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6 flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white">Verification Confirmed!</h3>
              <p className="text-xs text-[#E2CB85] animate-pulse">
                Unlocking Kids Mode... Welcome young explorers! 🌟
              </p>
            </motion.div>
          ) : step === 'email' ? (
            /* STEP 1: TYPE EMAIL & SEND */
            <form onSubmit={handleEmailFormSubmit} className="space-y-4">
              <div className="relative text-left">
                <label className="block text-xs font-semibold text-white/70 mb-1.5 pl-1">
                  Parent / Guardian Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A84C]/80" />
                  <input
                    type="email"
                    required
                    autoFocus
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      setError(null);
                    }}
                    placeholder="e.g. user@gmail.com"
                    disabled={isSending}
                    className="w-full pl-10 pr-4 py-3 bg-[#030712]/70 border-2 border-white/15 rounded-xl text-white placeholder-white/40 focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/30 focus:outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!emailInput.trim() || isSending}
                className="w-full py-3.5 bg-gradient-to-r from-[#C9A84C] via-[#E2CB85] to-[#C9A84C] text-[#030712] font-extrabold rounded-xl shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:shadow-[0_0_30px_rgba(201,168,76,0.5)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#030712]" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#030712]" />
                    <span>Send Verification Code</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: ENTER 6-DIGIT OTP */
            <form onSubmit={handleOtpFormSubmit} className="space-y-5">
              {/* 6 OTP Input Boxes */}
              <div className="flex justify-center items-center gap-2 sm:gap-3">
                {digits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { inputRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    disabled={isVerifying}
                    className="w-11 h-14 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold text-white bg-[#030712]/70 border-2 border-white/15 rounded-xl focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/40 focus:outline-none transition-all shadow-inner disabled:opacity-50"
                  />
                ))}
              </div>

              {/* Submit & Navigation Controls */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={digits.every((d) => !d) || isVerifying || isSending}
                  className="w-full py-3.5 bg-gradient-to-r from-[#C9A84C] via-[#E2CB85] to-[#C9A84C] text-[#030712] font-extrabold rounded-xl shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:shadow-[0_0_30px_rgba(201,168,76,0.5)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#030712]" />
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <span>Confirm & Unlock Kids Mode</span>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs text-white/50 pt-1 px-1">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('email');
                      setError(null);
                    }}
                    className="text-white/60 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResendClick}
                    disabled={countdown > 0 || isSending || isVerifying}
                    className="text-[#C9A84C] hover:text-[#E2CB85] font-semibold transition-colors flex items-center gap-1 disabled:opacity-40 disabled:hover:text-[#C9A84C] cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSending ? 'animate-spin' : ''}`} />
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
