'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, MapPin, Award, Lock, Gift, Coins, 
  Crown, Star, Tent, Ship, Palmtree, Compass 
} from 'lucide-react';

/* ─────────────────── DATA ─────────────────── */

const STAMPS = [
  { id: 1, name: 'GIZA PYRAMIDS', date: 'Nov 12, 2025', icon: Triangle, angle: -8 },
  { id: 2, name: 'GRAND EGYPTIAN MUSEUM', date: 'Nov 13, 2025', icon: Crown, angle: 12 },
  { id: 3, name: 'LUXOR TEMPLE', date: 'Nov 15, 2025', icon: Compass, angle: -5 },
  { id: 4, name: 'ASWAN DAM', date: 'Nov 17, 2025', icon: Ship, angle: 8 },
  { id: 5, name: 'SIWA OASIS', date: 'Nov 20, 2025', icon: Tent, angle: -15 },
  { id: 6, name: 'HURGHADA', date: 'Nov 24, 2025', icon: Palmtree, angle: 5 },
];

function Triangle(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2L2 22h20L12 2z" />
    </svg>
  );
}

const BADGES = [
  { id: 'pharaoh', title: 'Pharaoh Explorer', desc: 'Visited 3+ ancient sites', icon: Crown, locked: false },
  { id: 'desert', title: 'Desert Explorer', desc: 'Explored a hidden oasis', icon: Tent, locked: false },
  { id: 'heritage', title: 'Heritage Hunter', desc: 'Collected 5+ digital stamps', icon: Compass, locked: false },
  { id: 'culture', title: 'Culture Seeker', desc: 'Experienced local Egyptian cuisine', icon: Star, locked: false },
  { id: 'nile', title: 'Nile Navigator', desc: 'Take a Nile cruise (Pending)', icon: Ship, locked: true },
];

const REWARDS = [
  { id: 1, title: 'Partner Hotel Discount', desc: '10% off your next stay at affiliated hotels.', cost: 500 },
  { id: 2, title: 'Premium Audio Tour', desc: 'Free museum guide audio tour in 12 languages.', cost: 800 },
  { id: 3, title: 'Skip-the-Line Pass', desc: 'Priority access at the Grand Egyptian Museum.', cost: 1500 },
];

export default function TouristPassportContent() {
  return (
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-16 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Section - Digital Passport ID Card */}
        <div className="flex justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl relative p-1 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(201,168,76,0.15)] group"
          >
            {/* Holographic Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C] via-[#1B6B93] to-[#E2C779] opacity-50 group-hover:opacity-100 transition-opacity duration-700 animate-gradient-xy" />
            
            <div className="relative bg-[#0A1628] rounded-[22px] p-6 sm:p-10 flex flex-col md:flex-row items-center gap-8 border border-white/5 backdrop-blur-2xl">
              
              {/* Subtle watermark background */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex justify-center items-center overflow-hidden">
                <Crown className="w-96 h-96" />
              </div>

              {/* Avatar */}
              <div className="shrink-0 relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#1B6B93] to-[#C9A84C] p-1 shadow-[0_0_20px_rgba(201,168,76,0.3)]">
                  <div className="w-full h-full rounded-full bg-[#030712] flex items-center justify-center overflow-hidden relative">
                    <User className="w-16 h-16 text-[#C9A84C]" />
                    {/* Scan line effect over avatar */}
                    <div className="absolute left-0 w-full h-1 bg-[#1B6B93]/50 animate-[scan_3s_ease-in-out_infinite]" />
                  </div>
                </div>
                {/* Official seal */}
                <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-[#C9A84C] border-4 border-[#0A1628] flex items-center justify-center shadow-lg">
                  <Award className="w-6 h-6 text-[#030712]" />
                </div>
              </div>

              {/* ID Details */}
              <div className="flex-1 text-center md:text-left z-10">
                <h3 className="text-xl text-[#C9A84C] font-semibold uppercase tracking-widest mb-1">
                  🇪🇬 EgyptX Tourist Passport
                </h3>
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 font-serif">
                  Ahmed&apos;s Journey
                </h1>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Passport ID</p>
                    <p className="font-mono text-[#4CC9F0] text-sm">EGX-2026-00142</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Status</p>
                    <p className="font-mono text-green-400 text-sm flex items-center gap-1 justify-center md:justify-start">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Verified Tourist
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Visited Places (Stamps) */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <MapPin className="w-6 h-6 text-[#1B6B93]" />
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Visited Places</h2>
            <div className="h-px bg-white/10 flex-1 ml-4" />
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 justify-items-center">
            {STAMPS.map((stamp, index) => (
              <motion.div
                key={stamp.id}
                initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: stamp.angle }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                className="w-32 h-32 rounded-full border-[3px] border-dashed border-[#C9A84C]/70 flex flex-col items-center justify-center p-2 relative group hover:border-[#C9A84C] transition-colors"
                style={{ 
                  boxShadow: 'inset 0 0 15px rgba(201,168,76,0.1), 0 0 15px rgba(201,168,76,0.1)',
                }}
              >
                {/* Inner circle */}
                <div className="absolute inset-2 rounded-full border border-[#C9A84C]/30 group-hover:border-[#C9A84C]/60 transition-colors" />
                
                <stamp.icon className="w-8 h-8 text-[#C9A84C]/80 mb-1" strokeWidth={1.5} />
                <span className="text-[10px] font-bold text-[#C9A84C] text-center leading-tight uppercase px-1">
                  {stamp.name}
                </span>
                <span className="text-[8px] font-mono text-[#C9A84C]/60 mt-1 uppercase">
                  {stamp.date}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Achievements / Badges */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Award className="w-6 h-6 text-[#1B6B93]" />
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Achievements & Badges</h2>
            <div className="h-px bg-white/10 flex-1 ml-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BADGES.map((badge, idx) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative overflow-hidden rounded-2xl p-6 border transition-all flex gap-4 items-center ${
                  badge.locked 
                    ? 'bg-white/5 border-white/10 grayscale opacity-60' 
                    : 'bg-[#0A1628]/80 backdrop-blur border-[#C9A84C]/30 hover:border-[#C9A84C] shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
                }`}
              >
                {badge.locked ? (
                  <div className="w-14 h-14 shrink-0 rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-gray-400" />
                  </div>
                ) : (
                  <div className="w-14 h-14 shrink-0 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#E2C779] border-2 border-white flex items-center justify-center shadow-[0_0_15px_rgba(201,168,76,0.5)]">
                    <badge.icon className="w-6 h-6 text-[#030712]" />
                  </div>
                )}
                
                <div>
                  <h3 className={`font-bold text-lg mb-1 ${badge.locked ? 'text-gray-400' : 'text-white'}`}>
                    {badge.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {badge.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* EgyptX Points & Rewards */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Gift className="w-6 h-6 text-[#1B6B93]" />
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Points & Rewards</h2>
            <div className="h-px bg-white/10 flex-1 ml-4" />
          </div>

          {/* Points Progress */}
          <div className="bg-[#0A1628]/80 backdrop-blur border border-[#C9A84C]/20 rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-center gap-8 shadow-xl">
            <div className="shrink-0 text-center md:text-left">
              <p className="text-gray-400 text-sm uppercase font-bold tracking-wider mb-2">Available Balance</p>
              <h2 className="text-4xl font-bold text-[#C9A84C] font-mono flex items-center justify-center md:justify-start gap-3">
                <Coins className="w-8 h-8" /> 2,450 <span className="text-xl text-gray-500 font-sans">pts</span>
              </h2>
            </div>
            
            <div className="flex-1 w-full">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-white">Silver Tier</span>
                <span className="text-[#C9A84C]">Gold Tier (3,000 pts)</span>
              </div>
              <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '81%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#1B6B93] to-[#C9A84C] relative"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[shimmer_1s_linear_infinite]" />
                </motion.div>
              </div>
              <p className="text-right text-xs text-gray-500 mt-2">550 pts remaining to upgrade</p>
            </div>
          </div>

          {/* Reward Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REWARDS.map((reward, idx) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 backdrop-blur border border-white/10 hover:border-[#C9A84C]/50 rounded-2xl p-6 flex flex-col transition-colors group"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-white mb-2 group-hover:text-[#C9A84C] transition-colors">
                    {reward.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-6 line-clamp-2">
                    {reward.desc}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                  <span className="font-mono text-[#C9A84C] font-bold text-lg">{reward.cost} pts</span>
                  <button className="px-5 py-2 bg-[#1B6B93]/20 hover:bg-[#1B6B93]/40 border border-[#1B6B93] rounded-lg text-white text-sm font-bold uppercase tracking-wider transition-colors">
                    Redeem
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        @keyframes shimmer {
          100% { background-position: 1rem 0; }
        }
      `}} />
    </div>
  );
}
