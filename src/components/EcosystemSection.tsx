'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// SVG Icons
const Icons = {
  Tourists: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-[#C9A84C]">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Government: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-[#C9A84C]">
      <rect x="4" y="22" width="16" height="2" />
      <rect x="4" y="2" width="16" height="2" />
      <path d="M6 4v18" />
      <path d="M10 4v18" />
      <path d="M14 4v18" />
      <path d="M18 4v18" />
      <path d="M12 2L2 10h20L12 2z" />
    </svg>
  ),
  Businesses: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-[#C9A84C]">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  AI: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-[#C9A84C]">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 2.5 2.5 0 0 1-.98-4.86A2.5 2.5 0 0 1 4.5 9.5a2.5 2.5 0 0 1 5-0z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 2.5 2.5 0 0 0 .98-4.86 2.5 2.5 0 0 0-1.4-2.5 2.5 2.5 0 0 0-5-0z" />
    </svg>
  ),
  Data: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-[#C9A84C]">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  Heritage: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-[#C9A84C]">
      <path d="M12 2L2 22h20L12 2z" />
      <path d="M12 22V12" />
      <path d="M8 18h8" />
    </svg>
  ),
  IoT: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-[#C9A84C]">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  ),
  Systems: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#C9A84C]">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  ),
  RealTime: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#C9A84C]">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Insights: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#C9A84C]">
      <path d="M2 12h4l3-9 5 18 3-9h5" />
    </svg>
  ),
  Coverage: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#C9A84C]">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
};

const nodes = [
  { id: 'Tourists', label: 'Tourists', icon: Icons.Tourists },
  { id: 'Businesses', label: 'Businesses', icon: Icons.Businesses },
  { id: 'Data', label: 'Data', icon: Icons.Data },
  { id: 'Heritage', label: 'Heritage', icon: Icons.Heritage },
];

// Pre-compute node positions so they're consistent between server and client
const DIAGRAM_CENTER = 300;
const RADIUS = 220;
const nodePositions = nodes.map((_, index) => {
  const angle = (index * (360 / nodes.length) - 90) * (Math.PI / 180); // Start from top (-90°)
  return {
    x: DIAGRAM_CENTER + RADIUS * Math.cos(angle),
    y: DIAGRAM_CENTER + RADIUS * Math.sin(angle),
  };
});

export default function EcosystemSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative py-24 bg-[#0B0F19] overflow-hidden text-white">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#1B6B93]/10 rounded-full blur-[100px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#C9A84C]/5 rounded-full blur-[80px]"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#C9A84C] via-[#E2C779] to-[#C9A84C]"
          >
            The EgyptX AI Ecosystem
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-400"
          >
            An intelligent network connecting all pillars of Egyptian tourism
          </motion.p>
        </div>

        {/* Diagram Area — uses a 600×600 coordinate space */}
        <div className="relative w-full max-w-[600px] mx-auto mb-20 hidden md:block" style={{ aspectRatio: '1 / 1' }}>
          {/* SVG Connection Lines */}
          <svg viewBox="0 0 600 600" className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#1B6B93" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            
            {/* Draw lines from center to nodes */}
            {nodes.map((_node, index) => {
              const { x, y } = nodePositions[index];
              return (
                <g key={`line-${index}`}>
                  <motion.line
                    x1={DIAGRAM_CENTER}
                    y1={DIAGRAM_CENTER}
                    x2={x}
                    y2={y}
                    stroke="url(#lineGrad)"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                  
                  {/* Animated data particle */}
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="3"
                    fill="#C9A84C"
                    initial={{ offsetDistance: '0%' }}
                    animate={{ offsetDistance: '100%' }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                      delay: index * 0.5
                    }}
                    style={{
                      offsetPath: `path("M ${DIAGRAM_CENTER} ${DIAGRAM_CENTER} L ${x} ${y}")`
                    }}
                  />
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="3"
                    fill="#1B6B93"
                    initial={{ offsetDistance: '100%' }}
                    animate={{ offsetDistance: '0%' }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "linear",
                      delay: index * 0.7
                    }}
                    style={{
                      offsetPath: `path("M ${DIAGRAM_CENTER} ${DIAGRAM_CENTER} L ${x} ${y}")`
                    }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Central AI Node */}
          <motion.div 
            className="absolute z-20"
            style={{
              left: '50%',
              top: '50%',
              marginLeft: '-55px',
              marginTop: '-70px',
              width: '110px',
            }}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', damping: 15, duration: 0.8 }}
          >
            <div className="flex flex-col items-center">
              {/* Pulsing ring */}
              <div className="relative w-[110px] h-[110px]">
                <div className="absolute inset-0 rounded-full border border-[#C9A84C]/50 animate-ping"></div>
                <div className="absolute -inset-4 rounded-full border border-[#C9A84C]/20 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-full h-full rounded-full bg-black/40 backdrop-blur-md border-2 border-[#C9A84C] flex items-center justify-center shadow-[0_0_30px_rgba(201,168,76,0.3)] relative z-10">
                  <div className="w-12 h-12">
                    <Icons.AI />
                  </div>
                </div>
              </div>
              <div className="mt-3 text-[#C9A84C] font-semibold text-lg drop-shadow-md">EgyptX AI</div>
            </div>
          </motion.div>

          {/* Outer Nodes — each positioned with percentage-based left/top */}
          {nodes.map((node, index) => {
            const { x, y } = nodePositions[index];
            // Convert from 600×600 coordinate space to percentages
            const leftPct = (x / 600) * 100;
            const topPct = (y / 600) * 100;

            return (
              <motion.div
                key={node.id}
                className="absolute z-10"
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  marginLeft: '-50px',
                  marginTop: '-55px',
                  width: '100px',
                }}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  type: 'spring', 
                  damping: 12, 
                  duration: 0.6,
                  delay: 0.8 + (index * 0.1)
                }}
              >
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="w-[80px] h-[80px] rounded-full bg-white/5 backdrop-blur-sm border border-[#C9A84C]/40 flex items-center justify-center group-hover:border-[#C9A84C] group-hover:shadow-[0_0_20px_rgba(201,168,76,0.2)] transition-all duration-300">
                    <div className="w-8 h-8 group-hover:scale-110 transition-transform duration-300">
                      <node.icon />
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-300 group-hover:text-white transition-colors duration-300 whitespace-nowrap">{node.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Vertical Layout */}
        <div className="md:hidden flex flex-col items-center gap-6 mb-16">
          <motion.div 
            className="flex flex-col items-center mb-4"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="w-24 h-24 rounded-full bg-black/40 backdrop-blur-md border-2 border-[#C9A84C] flex items-center justify-center shadow-[0_0_30px_rgba(201,168,76,0.3)] relative">
              <div className="absolute inset-0 w-full h-full rounded-full border border-[#C9A84C]/50 animate-ping"></div>
              <div className="w-10 h-10 z-10">
                <Icons.AI />
              </div>
            </div>
            <div className="mt-3 text-[#C9A84C] font-semibold text-lg">EgyptX AI</div>
          </motion.div>

          <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
            {nodes.map((node, index) => (
              <motion.div
                key={`mobile-${node.id}`}
                className="flex flex-col items-center bg-white/5 p-4 rounded-xl border border-[#C9A84C]/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-10 h-10 mb-3">
                  <node.icon />
                </div>
                <div className="text-sm text-gray-300">{node.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: '7 Integrated Systems', icon: Icons.Systems },
            { label: 'Real-Time Data Flow', icon: Icons.RealTime },
            { label: 'AI-Driven Insights', icon: Icons.Insights },
            { label: 'Nationwide Coverage', icon: Icons.Coverage },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-5 hover:border-[#C9A84C]/40 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1.5 + (index * 0.1) }}
            >
              <div className="w-12 h-12 rounded-full bg-[#1B6B93]/20 flex items-center justify-center text-[#C9A84C]">
                <stat.icon />
              </div>
              <div className="text-gray-200 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
