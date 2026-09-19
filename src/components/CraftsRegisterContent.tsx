'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CraftsRegisterContent() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    
    // Simulate submission (no DB table was explicitly required for this specific form in the prompt, 
    // it just asked for a simple form that says "We'll contact you")
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#0A1628] border border-[#C9A84C]/20 rounded-3xl p-8 relative overflow-hidden"
      >
        <button
          onClick={() => router.push('/crafts')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </button>

        {!submitted ? (
          <>
            <div className="mb-8">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <Store className="w-8 h-8 text-[#C9A84C]" />
              </div>
              <h1 className="text-2xl font-bold text-white uppercase tracking-wider mb-2">
                Artisan Registration
              </h1>
              <p className="text-gray-400 text-sm leading-relaxed">
                We'll contact you when the artisan program launches.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                  placeholder="artisan@example.com"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-[#C9A84C] hover:bg-[#E3C973] text-[#0A1628] font-bold rounded-xl transition-colors flex items-center justify-center gap-2 mt-4 uppercase tracking-widest"
              >
                Notify Me
              </button>
            </form>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Request Received!</h2>
            <p className="text-gray-400 mb-8">
              Thank you, {name}. We will contact you at {email} as soon as the artisan platform goes live.
            </p>
            <button 
              onClick={() => router.push('/crafts')}
              className="w-full py-3 border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A1628] font-bold rounded-xl transition-colors text-sm uppercase"
            >
              Return to Demo Marketplace
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
