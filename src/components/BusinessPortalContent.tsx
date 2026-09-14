'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Utensils, Bus, Palette, 
  TrendingUp, Users, DollarSign, Star, 
  CheckCircle2, Settings, PlusCircle, 
  Sparkles, Calendar, Tag, Percent
} from 'lucide-react';

type BusinessType = 'Hotels' | 'Restaurants' | 'Tour Companies' | 'Artisans';

const BUSINESS_TYPES: { id: BusinessType; icon: React.ElementType; label: string }[] = [
  { id: 'Hotels', icon: Building2, label: 'Hotels' },
  { id: 'Restaurants', icon: Utensils, label: 'Restaurants' },
  { id: 'Tour Companies', icon: Bus, label: 'Tour Companies' },
  { id: 'Artisans', icon: Palette, label: 'Artisans' },
];

const KPI_DATA: Record<BusinessType, any[]> = {
  'Hotels': [
    { label: 'Bookings', value: '1,284', trend: '+8%', icon: Calendar },
    { label: 'Tourists Reached', value: '3,821', trend: '+15%', icon: Users },
    { label: 'Revenue', value: '$84K', trend: '+22%', icon: DollarSign },
    { label: 'Average Rating', value: '4.7', trend: '+0.1', icon: Star },
  ],
  'Restaurants': [
    { label: 'Reservations', value: '850', trend: '+12%', icon: Calendar },
    { label: 'Diners Reached', value: '2,400', trend: '+18%', icon: Users },
    { label: 'Revenue', value: '$32K', trend: '+10%', icon: DollarSign },
    { label: 'Average Rating', value: '4.8', trend: '+0.2', icon: Star },
  ],
  'Tour Companies': [
    { label: 'Bookings', value: '420', trend: '+25%', icon: Calendar },
    { label: 'Tourists Reached', value: '1,800', trend: '+30%', icon: Users },
    { label: 'Revenue', value: '$65K', trend: '+40%', icon: DollarSign },
    { label: 'Average Rating', value: '4.9', trend: '+0.1', icon: Star },
  ],
  'Artisans': [
    { label: 'Sales', value: '150', trend: '+5%', icon: Tag },
    { label: 'Tourists Reached', value: '600', trend: '+8%', icon: Users },
    { label: 'Revenue', value: '$8K', trend: '+15%', icon: DollarSign },
    { label: 'Average Rating', value: '5.0', trend: '-', icon: Star },
  ],
};

const OFFERS = [
  { id: 1, title: '20% discount for EgyptX tourists', status: 'Active', redemptions: 342, type: 'discount' },
  { id: 2, title: 'Free airport pickup for 3+ night stays', status: 'Active', redemptions: 89, type: 'perk' },
];

export default function BusinessPortalContent() {
  const [activeTab, setActiveTab] = useState<BusinessType>('Hotels');

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-[#C9A84C] mb-2 uppercase tracking-wide flex items-center gap-3"
            >
              <Building2 className="w-8 h-8" />
              Tourism Business Portal
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 font-medium tracking-wider uppercase text-sm"
            >
              Grow your business with EgyptX AI
            </motion.p>
          </div>

          {/* Business Type Selector (Tabs) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-2 bg-[#0A1628] p-1.5 rounded-xl border border-white/10"
          >
            {BUSINESS_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveTab(type.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  activeTab === type.id
                    ? 'bg-[#C9A84C] text-[#030712] shadow-[0_0_15px_rgba(201,168,76,0.3)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <type.icon className="w-4 h-4" />
                {type.label}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Top Stats Row (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <AnimatePresence mode="wait">
            {KPI_DATA[activeTab].map((stat, idx) => (
              <motion.div 
                key={`${activeTab}-${idx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: idx * 0.05, duration: 0.2 }}
                className="bg-[#0A1628]/80 backdrop-blur border border-[#C9A84C]/20 rounded-2xl p-5 flex items-start justify-between shadow-lg group hover:border-[#C9A84C]/50 transition-colors"
              >
                <div>
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">{stat.label}</p>
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-3xl font-bold text-white font-mono">{stat.value}</h3>
                    {stat.trend !== '-' && (
                      <span className="flex items-center text-green-400 text-xs font-bold bg-green-400/10 px-1.5 py-0.5 rounded">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {stat.trend}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-[#1B6B93]/10 text-[#C9A84C] rounded-xl border border-[#1B6B93]/20 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-6 h-6" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Middle Section: Insights & Offers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Left Column: AI Insights & Your Active Offers */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Tourist Demand Insights (AI Panel) */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-[#1B6B93]/30 to-[#0A1628] backdrop-blur border border-[#4CC9F0]/30 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(76,201,240,0.15)]"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
              
              <div className="flex items-start gap-4 relative z-10">
                <div className="p-3 bg-[#4CC9F0]/20 rounded-xl border border-[#4CC9F0]/40 text-[#4CC9F0] shrink-0">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2 uppercase tracking-wider">
                    AI Tourist Demand Insight
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Increased tourist interest detected in <strong className="text-[#C9A84C]">Fayoum</strong> & <strong className="text-[#C9A84C]">Siwa Oasis</strong> this month. Consider offering targeted promotions to travelers exploring <span className="text-[#4CC9F0] font-semibold border-b border-[#4CC9F0] border-dashed">Hidden Egypt</span> destinations to capture this emerging demand.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Your Active Offers */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#0A1628]/80 backdrop-blur border border-white/10 rounded-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#C9A84C]" />
                  Your Active Offers
                </h3>
              </div>
              
              <div className="flex flex-col gap-4">
                {OFFERS.map((offer) => (
                  <div key={offer.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/5 border border-white/10 hover:border-[#C9A84C]/50 rounded-xl transition-colors gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${offer.type === 'discount' ? 'bg-[#C9A84C]/20 text-[#C9A84C]' : 'bg-[#1B6B93]/30 text-[#4CC9F0]'}`}>
                        <Percent className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg">{offer.title}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-green-400 bg-green-400/10 px-2 py-0.5 rounded border border-green-400/20">
                            <CheckCircle2 className="w-3 h-3" /> {offer.status}
                          </span>
                          <span className="text-sm text-gray-400 flex items-center gap-1">
                            <Users className="w-3 h-3" /> {offer.redemptions} Redemptions
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button className="w-full sm:w-auto px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shrink-0">
                      <Settings className="w-4 h-4" /> Manage
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Create New Offer */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 bg-[#0A1628]/80 backdrop-blur border border-[#C9A84C]/20 rounded-2xl p-6 shadow-xl flex flex-col"
          >
            <h3 className="text-xl font-bold text-[#C9A84C] uppercase tracking-wider mb-6 flex items-center gap-2">
              <PlusCircle className="w-5 h-5" />
              Create New Offer
            </h3>
            
            <form className="flex-1 flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1">
                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Offer Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. 15% off dinner for couples" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#C9A84C] focus:border-[#C9A84C] transition-all"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Discount / Benefit Description</label>
                <textarea 
                  rows={3}
                  placeholder="Describe the exact benefit..." 
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#C9A84C] focus:border-[#C9A84C] transition-all resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Valid Until</label>
                <input 
                  type="date" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-[#C9A84C] focus:border-[#C9A84C] transition-all [color-scheme:dark]"
                />
              </div>

              <div className="mt-auto pt-6">
                <button 
                  type="button"
                  className="w-full py-4 bg-gradient-to-r from-[#C9A84C] to-[#E2C779] hover:brightness-110 text-[#030712] rounded-xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(201,168,76,0.3)]"
                >
                  <PlusCircle className="w-5 h-5" /> Publish Offer
                </button>
              </div>
            </form>
          </motion.div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
