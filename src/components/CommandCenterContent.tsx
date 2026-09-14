'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Users, Clock, DollarSign, 
  AlertTriangle, ShieldCheck, Thermometer, 
  Droplets, Activity, Radio, MapPin, 
  BarChart3, AlertCircle, ArrowRight
} from 'lucide-react';

/* ─────────────────── DATA ─────────────────── */

const MAP_SITES = [
  { id: 'giza', name: 'Giza', x: 185, y: 140, status: 'red', visitors: '45,210', crowd: 'HIGH' },
  { id: 'luxor', name: 'Luxor', x: 205, y: 265, status: 'yellow', visitors: '28,450', crowd: 'MEDIUM' },
  { id: 'aswan', name: 'Aswan', x: 210, y: 315, status: 'green', visitors: '12,300', crowd: 'LOW' },
  { id: 'hurghada', name: 'Hurghada', x: 230, y: 220, status: 'yellow', visitors: '31,100', crowd: 'MEDIUM' },
  { id: 'siwa', name: 'Siwa', x: 100, y: 125, status: 'green', visitors: '2,400', crowd: 'LOW' },
  { id: 'fayoum', name: 'Fayoum', x: 175, y: 160, status: 'green', visitors: '4,100', crowd: 'LOW' },
];

const HEALTH_SITES = [
  {
    name: 'Karnak Temple',
    temp: '24.8°C',
    humidity: '52%',
    vibration: 'Normal',
    density: '72%',
    risk: 'green',
    alertMsg: 'No Critical Threat'
  },
  {
    name: 'Valley of the Kings (KV62)',
    temp: '28.5°C',
    humidity: '68%',
    vibration: 'Elevated',
    density: '94%',
    risk: 'red',
    alertMsg: 'High humidity detected',
    actionMsg: 'Reduce visitor density to preserve tomb paintings'
  },
  {
    name: 'Abu Simbel',
    temp: '32.1°C',
    humidity: '20%',
    vibration: 'Normal',
    density: '45%',
    risk: 'green',
    alertMsg: 'No Critical Threat'
  }
];

const CHART_DATA = [
  { name: 'Giza', val: 45 },
  { name: 'Hurghada', val: 31 },
  { name: 'Luxor', val: 28 },
  { name: 'Aswan', val: 12 },
  { name: 'Fayoum', val: 4 },
  { name: 'Siwa', val: 2.4 },
];

/* ─────────────────── COMPONENTS ─────────────────── */

export default function CommandCenterContent() {
  const [selectedSite, setSelectedSite] = useState(MAP_SITES[0]);

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-white/10 pb-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl md:text-4xl font-bold text-[#C9A84C] mb-2 uppercase tracking-wide flex items-center gap-3"
            >
              <Radio className="w-8 h-8" />
              EgyptX AI — Command Center
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 font-medium tracking-wider uppercase text-sm"
            >
              National Tourism Intelligence Platform
            </motion.p>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-400 text-sm font-bold tracking-widest uppercase">System Online</span>
          </motion.div>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Today\'s Visitors', value: '184,523', trend: '+12%', icon: Users, color: '#C9A84C' },
            { label: 'Active Tourists', value: '72,391', trend: '+5%', icon: Activity, color: '#1B6B93' },
            { label: 'Average Stay', value: '6.4 Days', trend: '+0.2', icon: Clock, color: '#1B6B93' },
            { label: 'Tourism Spending', value: '$12.8M', trend: '+18%', icon: DollarSign, color: '#C9A84C' },
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#0A1628]/80 backdrop-blur border border-[#C9A84C]/20 rounded-2xl p-5 flex items-start justify-between"
            >
              <div>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">{stat.label}</p>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-3xl font-bold text-white font-mono">{stat.value}</h3>
                  <span className="flex items-center text-green-400 text-xs font-bold bg-green-400/10 px-1.5 py-0.5 rounded">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.trend}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Live Tourism Map (Left Column) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-1 bg-[#0A1628]/80 backdrop-blur border border-[#C9A84C]/20 rounded-2xl p-6 relative overflow-hidden flex flex-col"
          >
            <h3 className="text-lg font-bold text-[#C9A84C] uppercase tracking-wider mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" /> Live Tourism Map
            </h3>
            
            <div className="relative flex-grow flex items-center justify-center min-h-[400px]">
              <svg viewBox="0 0 300 500" className="w-full h-full max-h-[450px]" fill="none">
                {/* Simplified Egypt outline */}
                <path
                  d="M165 50 L250 50 L260 80 L270 100 L260 120 L255 140 L265 155 L255 170 L250 185 L260 200 L255 220 L250 240 L245 260 L240 280 L235 300 L230 320 L225 340 L218 370 L210 400 L195 430 L180 450 L165 440 L150 420 L140 400 L130 380 L125 350 L130 320 L140 290 L150 260 L155 230 L160 200 L170 170 L175 150 L180 130 L175 110 L170 90 L165 70 Z"
                  fill="#C9A84C" fillOpacity="0.05" stroke="#C9A84C" strokeWidth="1" strokeOpacity="0.3"
                />
                {/* Nile */}
                <path
                  d="M195 130 Q200 160 205 200 Q210 240 205 270 Q200 310 210 350 Q215 380 195 430"
                  stroke="#1B6B93" strokeWidth="2.5" strokeOpacity="0.5" strokeLinecap="round" fill="none"
                />
                
                {/* Map Markers */}
                {MAP_SITES.map(site => {
                  const color = site.status === 'red' ? '#EF4444' : site.status === 'yellow' ? '#EAB308' : '#22C55E';
                  const isSelected = selectedSite.id === site.id;
                  
                  return (
                    <g 
                      key={site.id} 
                      onClick={() => setSelectedSite(site)}
                      className="cursor-pointer group"
                    >
                      <circle cx={site.x} cy={site.y} r="15" fill={color} opacity="0.2" className={isSelected ? 'animate-ping' : ''} />
                      <circle cx={site.x} cy={site.y} r="6" fill={color} stroke="#030712" strokeWidth="2" />
                      {isSelected && (
                        <circle cx={site.x} cy={site.y} r="9" stroke={color} strokeWidth="1" fill="none" />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Popup Card for selected site */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedSite.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-xl"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-white uppercase">{selectedSite.name}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border ${
                      selectedSite.status === 'red' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      selectedSite.status === 'yellow' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      'bg-green-500/20 text-green-400 border-green-500/30'
                    }`}>
                      {selectedSite.crowd}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-gray-400 text-xs uppercase">Current Visitors</span>
                    <span className="text-xl font-mono text-[#C9A84C]">{selectedSite.visitors}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Column: AI Crowd Prediction & Heritage Health */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* AI Crowd Prediction Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0A1628]/80 backdrop-blur border border-red-500/30 rounded-2xl overflow-hidden relative shadow-[0_0_40px_rgba(239,68,68,0.1)]"
            >
              {/* Decorative AI background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] pointer-events-none" />
              
              <div className="p-6 border-b border-red-500/20 flex justify-between items-center bg-red-500/5">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-red-400" /> AI Crowd Prediction
                </h3>
                <span className="text-[10px] font-mono text-gray-500 border border-gray-700 px-2 py-1 rounded bg-black/50">PROTOTYPE SIMULATION — DEMO DATA</span>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Target Zone</p>
                  <h2 className="text-3xl font-bold text-white mb-6 font-serif">Giza Plateau</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-red-400 font-bold uppercase">Current Crowd: High</span>
                        <span className="font-mono text-red-400">95% Cap</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div className="bg-red-500 h-2 rounded-full w-[95%]" />
                      </div>
                    </div>
                    
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <p className="text-red-400 text-sm font-bold uppercase mb-1 flex items-center gap-2"><Clock className="w-4 h-4" /> AI Prediction</p>
                      <p className="text-white text-lg">Expected peak congestion in 2 hours</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Recommended Action</p>
                  <p className="text-white text-lg font-medium mb-6">Redirect 18% of visitors toward Saqqara & Fayoum</p>
                  
                  <div className="bg-[#1B6B93]/20 border border-[#1B6B93]/30 rounded-xl p-5">
                    <p className="text-[#4CC9F0] text-sm font-bold uppercase mb-3">AI Intervention Impact</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm">Giza Congestion</span>
                      <span className="text-green-400 font-mono font-bold">-14%</span>
                    </div>
                    <div className="w-full flex h-3 rounded-full overflow-hidden bg-gray-800">
                      {/* Before (red) vs After (blue) visual */}
                      <div className="bg-[#1B6B93] h-full w-[81%]" />
                      <div className="bg-red-500/30 h-full w-[14%] relative">
                        <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')] opacity-50" />
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#1B6B93]/30 flex justify-between items-center">
                      <span className="text-sm text-gray-300">Promote: Saqqara</span>
                      <button className="px-4 py-1.5 bg-[#1B6B93] hover:bg-[#1B6B93]/80 rounded text-white text-xs font-bold uppercase tracking-wider transition-colors">
                        Execute Rule
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Heritage Site Health Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#0A1628]/80 backdrop-blur border border-[#C9A84C]/20 rounded-2xl overflow-hidden p-6"
            >
              <h3 className="text-lg font-bold text-[#C9A84C] uppercase tracking-wider mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> Heritage Site Health
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {HEALTH_SITES.map((site, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border ${site.risk === 'red' ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/10'}`}>
                    <h4 className="font-bold text-white mb-4 line-clamp-1" title={site.name}>{site.name}</h4>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 flex items-center gap-1"><Thermometer className="w-3 h-3" /> Temp</span>
                        <span className="font-mono text-gray-200">{site.temp}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 flex items-center gap-1"><Droplets className="w-3 h-3" /> Humid</span>
                        <span className={`font-mono ${site.risk === 'red' ? 'text-red-400 font-bold' : 'text-gray-200'}`}>{site.humidity}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 flex items-center gap-1"><Activity className="w-3 h-3" /> Vibr</span>
                        <span className={`font-mono ${site.risk === 'red' ? 'text-red-400 font-bold' : 'text-gray-200'}`}>{site.vibration}</span>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-white/10">
                      {site.risk === 'red' ? (
                        <>
                          <p className="text-red-400 text-xs font-bold uppercase flex items-center gap-1 mb-1">
                            <AlertTriangle className="w-3 h-3" /> Potential Risk
                          </p>
                          <p className="text-[10px] text-gray-400 uppercase">{site.actionMsg}</p>
                        </>
                      ) : (
                        <p className="text-green-400 text-xs font-bold uppercase flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> {site.alertMsg}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Analytics Chart Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#0A1628]/80 backdrop-blur border border-[#C9A84C]/20 rounded-2xl p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[#C9A84C] uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-5 h-5" /> Visitors by Destination (Real-time, thousands)
            </h3>
            <button className="text-[#1B6B93] hover:text-white text-sm font-bold uppercase flex items-center gap-1 transition-colors">
              Full Report <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="w-full h-64 relative">
            <svg viewBox="0 0 600 200" className="w-full h-full preserve-3d" preserveAspectRatio="none">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map(i => (
                <line key={i} x1="0" y1={i * 40} x2="600" y2={i * 40} stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
              ))}
              
              {/* Bars */}
              {CHART_DATA.map((d, i) => {
                const maxVal = 50; // max scale 50k
                const barHeight = (d.val / maxVal) * 160;
                const yPos = 160 - barHeight;
                const xPos = (i * 100) + 20;
                const isMax = d.val === Math.max(...CHART_DATA.map(c => c.val));
                
                return (
                  <g key={d.name} className="group">
                    {/* Hover highlight line */}
                    <line x1={xPos + 30} y1="0" x2={xPos + 30} y2="160" stroke="#ffffff" strokeOpacity="0" strokeWidth="60" className="group-hover:stroke-opacity-5 transition-opacity" />
                    
                    {/* Bar */}
                    <rect 
                      x={xPos + 10} 
                      y={yPos} 
                      width="40" 
                      height={barHeight} 
                      fill={isMax ? 'url(#bar-gold)' : 'url(#bar-blue)'}
                      rx="4"
                      className="transition-all duration-500 ease-out hover:brightness-125"
                    />
                    
                    {/* Value Label */}
                    <text 
                      x={xPos + 30} 
                      y={yPos - 10} 
                      textAnchor="middle" 
                      fill={isMax ? '#C9A84C' : '#ffffff'} 
                      opacity="0.8"
                      className="text-[10px] font-mono font-bold"
                    >
                      {d.val}k
                    </text>
                    
                    {/* Axis Label */}
                    <text 
                      x={xPos + 30} 
                      y="185" 
                      textAnchor="middle" 
                      fill="#9ca3af" 
                      className="text-[12px] font-sans uppercase tracking-wider font-bold"
                    >
                      {d.name}
                    </text>
                  </g>
                );
              })}
              
              <defs>
                <linearGradient id="bar-gold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E2C779" />
                  <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="bar-blue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4CC9F0" />
                  <stop offset="100%" stopColor="#1B6B93" stopOpacity="0.3" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
