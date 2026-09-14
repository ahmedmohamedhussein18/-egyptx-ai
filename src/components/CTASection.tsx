'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section className="relative w-full py-32 bg-[#0a1128] overflow-hidden flex items-center justify-center">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none" />

      {/* Pyramid Silhouettes Background */}
      <div className="absolute bottom-0 left-0 right-0 h-64 opacity-5 pointer-events-none flex justify-center items-end space-x-12">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-1/3 h-full fill-white">
          <polygon points="50,0 100,100 0,100" />
        </svg>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-1/2 h-full fill-white">
          <polygon points="50,0 100,100 0,100" />
        </svg>
      </div>

      {/* Top Border Pattern */}
      <div className="absolute top-0 left-0 w-full h-4 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h10v10H0V0zm10 10h10v10H10V10z\' fill=\'%23D4AF37\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")', backgroundSize: '20px 20px' }} />

      {/* Bottom Border Pattern */}
      <div className="absolute bottom-0 left-0 w-full h-4 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h10v10H0V0zm10 10h10v10H10V10z\' fill=\'%23D4AF37\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")', backgroundSize: '20px 20px' }} />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center max-w-4xl mx-auto"
        >
          <motion.h2 
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#FFDF73] via-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] 
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "linear" 
            }}
            style={{ backgroundSize: '200% auto' }}
          >
            Experience Egypt, Intelligently.
          </motion.h2>
          
          <p className="text-xl md:text-2xl text-white/60 mb-12">
            Let AI guide your journey through 5,000 years of civilization
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0a1128] font-bold text-lg rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] transition-shadow duration-300 mb-6"
          >
            Plan My Journey
          </motion.button>
          
          <p className="text-sm text-white/40 tracking-wider flex items-center gap-2">
            <span className="text-[#D4AF37]">✦</span> Powered by Egyptian Intelligence
          </p>
        </motion.div>
      </div>
    </section>
  );
}
