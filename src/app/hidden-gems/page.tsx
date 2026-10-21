'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, Crown, Sparkles, MapPin, Compass, ArrowRight, 
  ShieldCheck, Eye, KeyRound, ExternalLink, Info, CheckCircle2
} from 'lucide-react';
import { useEliteTrials } from '@/lib/elite-trials';
import EliteModal from '@/components/EliteModal';
import Link from 'next/link';

interface SecretLocation {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  region: string;
  coordinates: string;
  teaser: string;
  secretDetails: string;
  accessRequirement: string;
  tag: string;
}

const SECRET_VAULTS: SecretLocation[] = [
  {
    id: 'siwa-salt-pools',
    name: 'The Secret Salt Lake Sanctuary',
    nameAr: 'بحيرات الملح السرية بسيوة',
    category: 'Desert Oasis & Natural Thermal Springs',
    region: 'Siwa Oasis, Western Desert',
    coordinates: '29.2032° N, 25.5195° E',
    teaser: 'Crystalline turquoise hypersaline pools carved into deep desert salt mines, enabling effortless zero-gravity floating.',
    secretDetails: 'Located 14km east of Shali Fortress along private quarry tracks. Water salinity exceeds 95%, matching the Dead Sea with natural therapeutic healing minerals.',
    accessRequirement: 'Public Free Preview · Open to all explorers',
    tag: 'Free Secret Vault',
  },
  {
    id: 'ramesses-vi-tomb',
    name: 'KV9: Astronomical Ceiling Vault of Ramesses VI',
    nameAr: 'سقف الفلك الملكي بمقبرة رمسيس السادس',
    category: 'Classified Royal Tomb',
    region: 'Valley of the Kings, Luxor',
    coordinates: '25.7402° N, 32.6019° E',
    teaser: 'An intact royal netherworld chamber with unbroken double Book of the Day and Night ceilings in vibrant lapis lazuli pigment.',
    secretDetails: 'Special VIP after-hours entrance required. The burial chamber preserves the colossal broken stone sarcophagus and the most pristine celestial Nut vault in Egypt.',
    accessRequirement: 'Elite VIP Access · Ministry Special Permit',
    tag: 'Royal Tomb Vault',
  },
  {
    id: 'citadel-rooftop-sanctuary',
    name: 'The Royal Belvedere of Saladin Citadel',
    nameAr: 'شرفة القلعة الملكية المطلة على القاهرة',
    category: 'Royal Rooftop Sanctuary',
    region: 'Old Cairo',
    coordinates: '30.0299° N, 31.2612° E',
    teaser: 'Restricted high-altitude belvedere terrace offering a 360-degree sunset panorama over ancient Islamic minarets and the Giza Pyramids.',
    secretDetails: 'Accessed via private stone spiral stairway behind the Gawhara Palace. Former private observatory of the royal governor with views across 1,000 years of Cairo architecture.',
    accessRequirement: 'Elite VIP Access · Private Concierge Pass',
    tag: 'VIP Cairo Skyline',
  },
  {
    id: 'underwater-palace-alexandria',
    name: 'Submerged Palace of Cleopatra VII',
    nameAr: 'قصر كليوباترا الغارق بميناء الإسكندرية',
    category: 'Underwater Archaeological Vault',
    region: 'Eastern Harbour, Alexandria',
    coordinates: '31.2133° N, 29.9042° E',
    teaser: 'Ancient Hellenistic sphinxes, carved limestone columns, and the royal palace floor submerged 6 meters under Mediterranean waters.',
    secretDetails: 'Submerged by seismic activity in the 4th century CE. Exclusive scientific diving zone with guided underwater scooter expeditions for certified divers.',
    accessRequirement: 'Elite VIP Access · Maritime Archaeological Pass',
    tag: 'Submerged Vault',
  },
  {
    id: 'wadi-hitan-desert-vault',
    name: 'Valley of Whales Prehistoric Sea Vault',
    nameAr: 'وادي الحيتان - قاع المحيط القديم',
    category: 'UNESCO Deep Desert Sanctuary',
    region: 'Fayoum Desert',
    coordinates: '29.2711° N, 30.0436° E',
    teaser: 'Wind-carved sandstone desert hiding 40-million-year-old complete fossilized prehistoric whale skeletons from the prehistoric Tethys Sea.',
    secretDetails: 'Off-road 4WD access 80km deep into protected sand dunes. Camp in designated private Bedouin astronomy shelters with zero light pollution and Milky Way visibility.',
    accessRequirement: 'Elite VIP Access · Desert Escort Guide',
    tag: 'Fossil Ocean Vault',
  },
  {
    id: 'crystal-mountain-farafra',
    name: 'The Calcite Arch of Crystal Mountain',
    nameAr: 'قوس جبل الكريستال بالفرافرة',
    category: 'Geological Crystal Vault',
    region: 'White Desert National Park',
    coordinates: '27.6591° N, 28.4312° E',
    teaser: 'A natural soaring arch composed of interlocking translucent quartz and pure barite crystal deposits reflecting golden hour light.',
    secretDetails: 'Formed by ancient hydro-thermal subterranean geysers. Visible under full moon illumination when the entire formation sparkles like pure diamond.',
    accessRequirement: 'Elite VIP Access · Geological Permit',
    tag: 'Mineral Wonder',
  },
  {
    id: 'st-anthony-cliff-cave',
    name: 'The Hermit Cave of St. Anthony the Great',
    nameAr: 'مغارة الأنبا أنطونيوس بجبال البحر الأحمر',
    category: 'Ancient Monastic Sanctuary',
    region: 'Red Sea Mountains',
    coordinates: '28.9242° N, 32.3503° E',
    teaser: 'High-altitude spiritual retreat carved into vertical limestone cliffs 2,000 steps above the desert, in continuous use since 305 CE.',
    secretDetails: 'Includes natural fresh mountain spring water dripping through rock fissures and undisturbed views reaching the Gulf of Suez and Sinai peaks.',
    accessRequirement: 'Elite VIP Access · Monastic Escort',
    tag: 'High Hermitage',
  },
  {
    id: 'marsa-nayzak-lagoon',
    name: 'Marsa Nayzak Meteorite Lagoon',
    nameAr: 'شاطئ وبحيرة النيزك الطبيعية',
    category: 'Hidden Coral Reef Lagoon',
    region: 'Marsa Alam, Red Sea',
    coordinates: '24.9602° N, 34.9611° E',
    teaser: 'An eye-shaped natural swimming pool carved into solid coastal rock by a meteorite strike, filled with crystal-clear warm tidal waters.',
    secretDetails: 'Deep-water pool surrounded by vibrant coral colonies and sea turtles, shielded from high ocean waves by an ancient natural stone barrier.',
    accessRequirement: 'Elite VIP Access · Private Coastal Pass',
    tag: 'Coastal Secret',
  },
];

export default function HiddenGemsPage() {
  const { isElite, useTrial, hiddenGemsUsed } = useEliteTrials();
  const [showEliteModal, setShowEliteModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<SecretLocation | null>(null);

  const handleOpenLocked = (loc: SecretLocation) => {
    setSelectedLocation(loc);
    setShowEliteModal(true);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-20 font-sans relative overflow-hidden">
      {/* Ambient Luxury Amber / Indigo Lighting */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold mb-4 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Classified Egyptian Vaults & Private Sanctuaries</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Hidden Gems & Secret Vaults 
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300/80 leading-relaxed font-normal">
            Beyond the crowded tourist trails lies a secret Egypt known only to sovereign scholars, royalty, and elite explorers. Discover classified royal tomb ceilings, submerged palace ruins, and secluded desert waters.
          </p>

          {/* Access Banner */}
          <div className="mt-6 flex items-center justify-center gap-3">
            {isElite ? (
              <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 flex items-center gap-1.5 shadow-[0_0_25px_rgba(245,158,11,0.4)]">
                <Crown className="w-3.5 h-3.5" />
                Pharaoh Elite VIP Pass · All 8 Restricted Vaults Unlocked
              </span>
            ) : (
              <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-400/20 via-yellow-400/20 to-amber-500/20 border border-amber-400/50 text-amber-300 flex items-center gap-1.5 shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                 1 Free Secret Vault Unlocked (7 Elite Vaults Locked)
              </span>
            )}
          </div>
        </div>

        {/* 8 Secret Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SECRET_VAULTS.map((loc, idx) => {
            const isUnlocked = isElite || idx === 0;

            return (
              <motion.div
                key={loc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className={`relative rounded-3xl p-6 backdrop-blur-xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-white/[0.05] via-[#0B1120] to-[#040913] border-amber-500/40 hover:border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.12)]'
                    : 'bg-white/[0.02] border-white/10'
                }`}
              >
                {/* Frosted Gold Lock Overlay for Locked Elite Vaults */}
                {!isUnlocked && (
                  <div className="absolute inset-0 z-30 backdrop-blur-md bg-slate-950/85 flex flex-col items-center justify-center p-5 text-center border-2 border-amber-500/40 rounded-3xl shadow-[inset_0_0_30px_rgba(245,158,11,0.25)]">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/25 via-yellow-500/15 to-indigo-950/40 border border-amber-400/50 flex items-center justify-center mb-3 shadow-[0_0_25px_rgba(245,158,11,0.35)]">
                      <Lock className="w-7 h-7 text-amber-400 animate-pulse drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                    </div>
                    <span className="text-base font-black text-amber-300 mb-1 flex items-center gap-1.5">
                      Elite Exclusive Vault 
                    </span>
                    <p className="text-xs text-slate-300/80 mb-5 leading-relaxed font-normal">
                      Classified VIP destination reserved exclusively for EgyptX Elite explorers.
                    </p>
                    <button
                      onClick={() => handleOpenLocked(loc)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.45)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                      Unlock Vault Now 
                    </button>
                  </div>
                )}

                {/* Top Badge Row */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      isUnlocked
                        ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                        : 'bg-white/10 text-slate-400 border-white/10'
                    }`}>
                      {loc.tag}
                    </span>

                    {isUnlocked ? (
                      <span className="text-emerald-400 text-xs flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                      </span>
                    ) : (
                      <span className="text-amber-400 text-xs flex items-center gap-1 font-mono">
                        <Lock className="w-3.5 h-3.5" /> VIP Only
                      </span>
                    )}
                  </div>

                  {/* Title & Region */}
                  <h3 className="text-lg font-black text-white mb-1 leading-snug">
                    {loc.name}
                  </h3>
                  <p className="text-xs font-mono text-amber-400/90 mb-3 flex items-center gap-1">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span>{loc.region}</span>
                  </p>

                  <p className="text-xs text-slate-300/90 leading-relaxed mb-4">
                    {loc.teaser}
                  </p>

                  {/* Unlocked Secret Intel Box */}
                  {isUnlocked && (
                    <div className="p-3 rounded-2xl bg-black/40 border border-amber-500/20 mb-4 space-y-1.5 text-left">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
                        <KeyRound className="w-3 h-3" />
                        <span>Confidential Access Intel:</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                        {loc.secretDetails}
                      </p>
                      <div className="pt-1 text-[10px] text-slate-400 font-mono">
                        GPS: {loc.coordinates}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Card Action */}
                <div className="pt-3 border-t border-white/10">
                  {isUnlocked ? (
                    <button
                      onClick={() => {
                        if (idx === 0) {
                          useTrial('hidden-gems');
                        }
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-amber-400/20 hover:text-amber-300 border border-white/10 hover:border-amber-400/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-slate-200"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Vault Coordinates</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenLocked(loc)}
                      className="w-full py-2.5 px-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Unlock with Elite</span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Elite Upgrade Modal */}
      <EliteModal
        isOpen={showEliteModal}
        onClose={() => setShowEliteModal(false)}
        contextTitle="Unlock Egypt's Secret Vaults "
        contextMessage="You've unlocked your 1 free secret vault! Upgrade to EgyptX Elite to access all restricted tomb locations & VIP hidden gems."
        featureTrigger="hidden-gems"
      />
    </div>
  );
}
