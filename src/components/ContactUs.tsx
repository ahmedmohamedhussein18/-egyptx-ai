'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, Sparkles } from 'lucide-react';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1000);
  };

  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#030712] via-[#0A1628] to-[#060E1A] text-white overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#1B6B93]/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#E2CB85] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Connect with EgyptX AI</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Get in Touch <br />
            <span className="bg-gradient-to-r from-[#FFDF73] via-[#C9A84C] to-[#E2CB85] bg-clip-text text-transparent">
              تواصل معنا
            </span>
          </h2>

          <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed">
            Have questions about smart itineraries, enterprise tourism partnerships, or AI heritage experiences? Our team in Cairo is here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-[#C9A84C]/20 backdrop-blur-xl shadow-2xl space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#C9A84C]" />
                Official Assistance Channels
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-light">
                Reach out to our customer experience desk, tourist hotline, or technical integration team.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#C9A84C]/40 transition-colors">
                  <div className="p-3 rounded-xl bg-[#C9A84C]/15 text-[#C9A84C]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block font-mono">Email Support</span>
                    <a href="mailto:support@egyptx.ai" className="text-sm font-semibold text-white hover:text-[#C9A84C] transition-colors">
                      support@egyptx.ai
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#C9A84C]/40 transition-colors">
                  <div className="p-3 rounded-xl bg-[#C9A84C]/15 text-[#C9A84C]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block font-mono">Tourism Hotline</span>
                    <a href="tel:19654" className="text-sm font-semibold text-white hover:text-[#C9A84C] transition-colors">
                      19654 (Within Egypt) / +20 2 2735 9000
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#C9A84C]/40 transition-colors">
                  <div className="p-3 rounded-xl bg-[#C9A84C]/15 text-[#C9A84C]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block font-mono">Headquarters</span>
                    <span className="text-sm font-semibold text-white">
                      Zamalek & New Administrative Capital, Cairo, Egypt
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick reassurance banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#C9A84C]/15 via-transparent to-[#1B6B93]/20 border border-[#C9A84C]/25 backdrop-blur-md flex items-center gap-4">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <p className="text-xs text-gray-200 font-medium">
                AI concierge & live support operating 24/7 across all major Egyptian governorates.
              </p>
            </div>
          </div>

          {/* Right: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.03] border border-[#C9A84C]/30 backdrop-blur-xl shadow-2xl relative">
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Thank you! Your message has been sent. An EgyptX representative will contact you shortly.</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 font-mono">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] text-sm text-white placeholder-gray-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 font-mono">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="sarah@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] text-sm text-white placeholder-gray-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 font-mono">
                    Subject / Topic
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] text-sm text-white outline-none transition-all cursor-pointer"
                  >
                    <option value="General Inquiry" className="bg-[#0A1628] text-white">General Inquiry</option>
                    <option value="AI Itinerary & Planning" className="bg-[#0A1628] text-white">AI Itinerary & Planning</option>
                    <option value="Smart Site & Museum Access" className="bg-[#0A1628] text-white">Smart Site & Museum Access</option>
                    <option value="Enterprise / Tourism Partner" className="bg-[#0A1628] text-white">Enterprise / Tourism Partner</option>
                    <option value="Press & Media" className="bg-[#0A1628] text-white">Press & Media</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 font-mono">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your upcoming travel plans or question..."
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] text-sm text-white placeholder-gray-500 outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#C9A84C] via-[#E2CB85] to-[#C9A84C] hover:brightness-110 text-gray-950 font-extrabold text-sm tracking-wide shadow-[0_0_25px_rgba(201,168,76,0.4)] hover:shadow-[0_0_35px_rgba(201,168,76,0.6)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-gray-950" />
                      <span>Send Message / إرسال الرسالة</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
