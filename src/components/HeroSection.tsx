"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

interface NetworkLine {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const HeroSection = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [networkLines, setNetworkLines] = useState<NetworkLine[]>([]);

  useEffect(() => {
    setIsMounted(true);
    setParticles(
      Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? '#C9A84C' : '#1B6B93',
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
      }))
    );

    setNetworkLines(
      Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        x1: Math.random() * 100,
        y1: Math.random() * 100,
        x2: Math.random() * 100,
        y2: Math.random() * 100,
      }))
    );
  }, []);

  const staggerItem = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#030712]">
      
      {/* 1. Background Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#C9A84C]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#1B6B93]/5 rounded-full blur-[120px]" />
      </div>

      {/* 2. Egypt Map Silhouette */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
        <svg viewBox="0 0 600 500" className="w-[80vw] h-[80vh] fill-none stroke-[#C9A84C] stroke-[3px]">
          {/* Rough abstract map of Egypt outline */}
          <path fill="#C9A84C" d="M300,50 C400,60 500,40 550,50 L550,450 L100,450 L50,300 C50,200 100,100 200,50 Z" />
        </svg>
      </div>

      {/* 3. Nile River */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.07] pointer-events-none">
        <svg viewBox="0 0 600 500" className="w-[80vw] h-[80vh] fill-none stroke-[#1B6B93] stroke-[6px]">
          <path d="M 450,-50 Q 420,100 450,250 T 350,400 Q 320,450 360,550" />
        </svg>
      </div>

      {/* 4. Animated Particle Field */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {isMounted && particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              opacity: p.color === '#C9A84C' ? 0.2 : 0.15,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, 20, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* 5. AI Network lines */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-5">
        <svg className="w-full h-full">
          {isMounted && networkLines.map((line) => (
            <line
              key={line.id}
              x1={`${line.x1}%`}
              y1={`${line.y1}%`}
              x2={`${line.x2}%`}
              y2={`${line.y2}%`}
              stroke="#C9A84C"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      </div>

      {/* 6. Egyptian Pyramid silhouettes */}
      <div className="absolute bottom-0 w-full h-[35vh] z-0 flex items-end justify-center pointer-events-none opacity-50">
        <svg viewBox="0 0 1000 300" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="pyramidGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0A1628" stopOpacity="0" />
              <stop offset="100%" stopColor="#030712" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="pyramidGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1B6B93" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#030712" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="pyramidGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#030712" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path d="M 150,300 L 350,120 L 550,300 Z" fill="url(#pyramidGrad2)" />
          <path d="M 400,300 L 550,60 L 700,300 Z" fill="url(#pyramidGrad1)" />
          <path d="M 600,300 L 720,160 L 840,300 Z" fill="url(#pyramidGrad3)" />
        </svg>
      </div>

      {/* CONTENT */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto mt-[-5vh]"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.15 } }
        }}
      >
        {/* Badge */}
        <motion.div variants={staggerItem} className="mb-6 md:mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C9A84C]/30 bg-white/5 backdrop-blur-md">
          <span className="text-lg md:text-xl">🏛️</span>
          <span className="text-[#C9A84C] text-xs md:text-sm font-medium tracking-wide">National Smart Tourism Ecosystem</span>
        </motion.div>

        {/* Title */}
        <motion.h1 variants={staggerItem} className="text-5xl md:text-7xl lg:text-8xl font-black mb-2 md:mb-4 tracking-tighter">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E2CB85] to-[#C9A84C]">EgyptX</span>
          <span className="text-[#1B6B93] ml-2 md:ml-4">AI</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.h2 variants={staggerItem} className="text-base md:text-2xl lg:text-3xl font-light text-white mb-4 md:mb-6 tracking-[0.15em] md:tracking-[0.2em] uppercase">
          The National Smart Tourism Ecosystem
        </motion.h2>

        {/* Tagline */}
        <motion.p variants={staggerItem} className="text-base md:text-xl text-white/60 mb-10 md:mb-12 max-w-2xl font-light">
          Discover Egypt. Experience History. Shape the Future.
        </motion.p>

        {/* Buttons */}
        <motion.div variants={staggerItem} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-12 md:mb-16">
          <button className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-[#C9A84C] hover:bg-[#D5B965] text-black font-semibold rounded-lg shadow-[0_0_20px_rgba(201,168,76,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(201,168,76,0.5)]">
            Plan My Journey
          </button>
          <button className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C]/10 font-semibold rounded-lg transition-all duration-300 hover:scale-105">
            Explore Egypt
          </button>
          <button className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 border border-[#1B6B93] text-[#1B6B93] hover:bg-[#1B6B93]/10 font-semibold rounded-lg transition-all duration-300 hover:scale-105">
            Virtual Egypt
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div variants={staggerItem} className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-white/40 font-mono">
          <span>50+ Sites</span>
          <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-[#1B6B93]"></span>
          <span>AI-Powered</span>
          <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-[#C9A84C]"></span>
          <span>Real-Time</span>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 md:gap-2 text-white/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="text-[10px] md:text-xs uppercase tracking-widest font-semibold">Scroll to explore</span>
        <motion.svg 
          width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="md:w-6 md:h-6"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M6 9l6 6 6-6"/>
        </motion.svg>
      </motion.div>

    </section>
  );
};

export default HeroSection;
