'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, MapPin, Award, Lock, Gift, Coins, 
  Crown, Star, Tent, Ship, Palmtree, Compass, Loader2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { trackEvent } from '@/lib/analytics';
import { useRouter } from 'next/navigation';

export default function TouristPassportContent() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [checkins, setCheckins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    trackEvent('page_view');
    
    async function loadPassportData() {
      try {
        const supabase = createClient();
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/login?redirectTo=/tourist-passport');
          return;
        }

        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        setUserProfile({ ...profile, email: user.email });

        // Fetch checkins with joined attraction data
        const { data: checkinData, error: checkinError } = await supabase
          .from('qr_checkins')
          .select(`
            id,
            checked_in_at,
            attractions (
              id,
              name_en,
              category
            )
          `)
          .eq('user_id', user.id)
          .order('checked_in_at', { ascending: true });

        if (checkinError) throw checkinError;

        // Map data to STAMPS format
        const mappedStamps = (checkinData || []).map((c: any, i: number) => {
          let icon = Crown;
          if (c.attractions?.category === 'nature') icon = Palmtree;
          if (c.attractions?.category === 'hidden') icon = Tent;
          
          return {
            id: c.id,
            name: c.attractions?.name_en || 'Unknown Site',
            date: new Date(c.checked_in_at).toLocaleDateString(),
            icon,
            angle: (i % 2 === 0 ? 1 : -1) * (15 + (i * 5) % 20) // slight random angle
          };
        });

        setCheckins(mappedStamps);

      } catch (err) {
        console.error('Error loading passport data:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadPassportData();
  }, [router]);

  // Derived stats
  const totalStamps = checkins.length;
  const isPharaoh = totalStamps >= 3;
  const isDesert = checkins.some(c => c.icon === Tent);
  const isHeritage = totalStamps >= 5;

  const BADGES = [
    { id: 'pharaoh', title: 'Pharaoh Explorer', desc: 'Visited 3+ ancient sites', icon: Crown, locked: !isPharaoh },
    { id: 'desert', title: 'Desert Explorer', desc: 'Explored a hidden oasis', icon: Tent, locked: !isDesert },
    { id: 'heritage', title: 'Heritage Hunter', desc: 'Collected 5+ digital stamps', icon: Compass, locked: !isHeritage },
    { id: 'culture', title: 'Culture Seeker', desc: 'Experienced local Egyptian cuisine (Pending)', icon: Star, locked: true },
    { id: 'nile', title: 'Nile Navigator', desc: 'Take a Nile cruise (Pending)', icon: Ship, locked: true },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center text-[#C9A84C]">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p>Loading your Passport...</p>
      </div>
    );
  }

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
                  {userProfile?.full_name || 'Tourist'}&apos;s Journey
                </h1>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Total Stamps</p>
                    <p className="font-mono text-[#4CC9F0] text-sm">{totalStamps}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Status</p>
                    <p className="font-mono text-green-400 text-sm flex items-center gap-1 justify-center md:justify-start">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Verified
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
            {checkins.length > 0 ? (
              checkins.map((stamp, index) => (
                <motion.div
                  key={stamp.id}
                  initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
                  animate={{ opacity: 1, scale: 1, rotate: stamp.angle }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                  className="w-32 h-32 rounded-full border-[3px] border-dashed border-[#C9A84C]/70 flex flex-col items-center justify-center p-2 relative group hover:border-[#C9A84C] transition-colors bg-[#0A1628]/40"
                  style={{ 
                    boxShadow: 'inset 0 0 15px rgba(201,168,76,0.1), 0 0 15px rgba(201,168,76,0.1)',
                  }}
                >
                  <div className="absolute inset-2 rounded-full border border-[#C9A84C]/30 group-hover:border-[#C9A84C]/60 transition-colors" />
                  
                  <stamp.icon className="w-8 h-8 text-[#C9A84C]/80 mb-1" strokeWidth={1.5} />
                  <span className="text-[10px] font-bold text-[#C9A84C] text-center leading-tight uppercase px-1">
                    {stamp.name}
                  </span>
                  <span className="text-[8px] font-mono text-[#C9A84C]/60 mt-1 uppercase">
                    {stamp.date}
                  </span>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-10 text-center text-gray-400 italic bg-white/5 border border-white/10 rounded-2xl w-full p-8">
                <p className="mb-2">Start exploring to collect your first stamp.</p>
                <p className="text-sm">Visit Smart Sites and check in with QR codes.</p>
              </div>
            )}
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

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}} />
    </div>
  );
}
