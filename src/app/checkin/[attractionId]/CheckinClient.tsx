'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, MapPin } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import Link from 'next/link';

export default function CheckinClient({ attraction, userId }: { attraction: any, userId: string }) {
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    if (!tracked) {
      trackEvent('qr_checkin', { attraction_id: attraction.id, user_id: userId, governorate_id: attraction.governorate_id });
      setTracked(true);
    }
  }, [tracked, attraction, userId]);

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Celebration background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, type: "spring" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C9A84C]/10 rounded-full blur-[100px]"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="bg-white/5 backdrop-blur-xl border border-[#C9A84C]/30 rounded-3xl p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(201,168,76,0.15)] relative z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="w-24 h-24 bg-gradient-to-tr from-[#1B6B93] to-[#C9A84C] rounded-full mx-auto mb-6 flex items-center justify-center shadow-[0_0_20px_rgba(201,168,76,0.5)]"
        >
          <CheckCircle className="w-12 h-12 text-[#030712]" strokeWidth={3} />
        </motion.div>

        <h1 className="text-3xl font-bold text-white mb-2">Checked In! 🎉</h1>
        <p className="text-[#C9A84C] text-lg font-semibold mb-6">{attraction.name_en}</p>

        <div className="bg-[#0A1628] rounded-xl p-4 mb-8 border border-white/10 flex items-center justify-center gap-2">
          <MapPin className="w-5 h-5 text-[#1B6B93]" />
          <span className="text-gray-300 font-medium">{attraction.city || 'Egypt'}</span>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/tourist-passport" className="w-full py-3 bg-[#C9A84C] text-[#030712] font-bold rounded-xl hover:shadow-[0_0_15px_rgba(201,168,76,0.4)] transition-all">
            View Digital Passport
          </Link>
          <Link href="/smart-site" className="w-full py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-all">
            Continue Exploring
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
