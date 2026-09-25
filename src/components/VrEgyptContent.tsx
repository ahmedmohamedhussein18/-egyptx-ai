'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, MapPin, Lock, ArrowLeft, PlayCircle, Sparkles } from 'lucide-react';

const destinations = [
  {
    id: 1,
    title: "Abu Simbel Temples",
    city: "Aswan",
    description: "Carved out of a mountainside in the 13th century BC, the Abu Simbel temples stand as a testament to the grandeur of Ramesses II. Experience the majestic colossal statues that guard the entrance to one of ancient Egypt's most awe-inspiring monuments, preserved for eternity on the banks of Lake Nasser.",
    videoSrc: "/videos/vr1.mp4"
  },
  {
    id: 2,
    title: "Al-Azhar Mosque",
    city: "Cairo",
    description: "Founded in 970 AD, Al-Azhar Mosque is a masterpiece of Fatimid architecture and the heart of Islamic learning in Egypt. Wander virtually through its expansive marble courtyards and admire the intricate stucco work and historic minarets that have overlooked Cairo for over a millennium.",
    videoSrc: "/videos/vr2.mp4" 
  },
  {
    id: 3,
    title: "Al-Azhar Park",
    city: "Cairo",
    description: "A lush, green oasis in the center of historic Cairo. Al-Azhar Park offers breathtaking panoramic views of the city's ancient skyline. Stroll through the beautifully manicured Islamic gardens, serene water features, and enjoy a virtual moment of peace above the bustling metropolis.",
    videoSrc: "/videos/vr3.mp4"
  },
  {
    id: 4,
    title: "Al-Rifa'i Mosque",
    city: "Cairo",
    description: "Constructed in two phases between 1869 and 1912, this monumental mosque stands opposite the Mosque of Sultan Hassan. Step inside to marvel at its soaring ceilings, lavish gold-leaf decorations, and the grand tombs of the Egyptian royal family resting in absolute architectural splendor.",
    videoSrc: "/videos/vr4.mp4"
  },
  {
    id: 5,
    title: "Alexandria Library",
    city: "Alexandria",
    description: "The Bibliotheca Alexandrina is a striking architectural homage to the ancient Library of Alexandria. Explore the vast, sunlit main reading room which cascades down towards the sea, and admire the majestic granite walls carved with characters from 120 different human scripts.",
    videoSrc: "/videos/vr5.mp4"
  },
  {
    id: 6,
    title: "Amr ibn al-As Mosque",
    city: "Cairo",
    description: "Originally built in 642 AD, it was the first mosque ever constructed in Egypt and the whole of Africa. Experience the vast, serene interior where wooden columns support an expansive wooden roof, offering a profound sense of history and spiritual tranquility.",
    videoSrc: "/videos/vr6.mp4"
  }
];

export default function VrEgyptContent() {
  const [activeSite, setActiveSite] = useState<typeof destinations[0] | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans overflow-x-hidden relative">
      {/* Intro Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#030712]"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, filter: 'blur(10px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <Sparkles className="w-12 h-12 text-[#C9A84C] animate-pulse" />
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-[#E2CB85] to-[#C9A84C] mb-4">
                Ancient Egyptian<br />Civilization
              </h1>
              <div className="h-0.5 w-32 mx-auto bg-[#C9A84C] opacity-50 rounded-full mt-8"></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#C9A84C]/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#1B6B93]/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-12 min-h-screen flex flex-col justify-center">
        {/* Header Section */}
        <AnimatePresence mode="wait">
          {!activeSite && !showSplash && (
            <motion.div 
              key="header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center mb-16"
            >
              <div className="flex justify-center items-center gap-3 mb-4">
                <Globe className="w-10 h-10 text-[#C9A84C]" />
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-widest text-[#C9A84C]">
                  VR EGYPT
                </h1>
              </div>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                Immersive 360° virtual tours of ancient wonders. Drag to look around in available panoramas.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic State: Grid vs Video Player */}
        <AnimatePresence mode="wait">
          {!activeSite ? (
            /* Grid Layout */
            !showSplash && (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {destinations.map((dest, i) => (
                  <motion.div
                    key={dest.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                    onClick={() => setActiveSite(dest)}
                    className="group relative cursor-pointer overflow-hidden rounded-3xl bg-white/[0.02] border border-white/10 hover:border-[#C9A84C]/50 transition-all duration-500 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(201,168,76,0.15)]"
                  >
                    <div className="absolute top-5 right-5 z-20">
                      <div className="bg-black/50 backdrop-blur-md p-2.5 rounded-full border border-white/10 group-hover:bg-[#C9A84C]/20 group-hover:border-[#C9A84C]/50 transition-all">
                        <Lock className="w-4 h-4 text-gray-400 group-hover:text-[#C9A84C]" />
                      </div>
                    </div>

                    <div 
                      className="aspect-[4/3] bg-cover bg-center flex items-center justify-center relative overflow-hidden" 
                      style={{ backgroundImage: "url('/images/ChatGPT Image Sep 25, 2026, 09_32_14 PM.png')" }}
                    >
                      <div className="absolute inset-0 bg-[#030712]/60 group-hover:bg-[#030712]/40 transition-colors duration-500"></div>
                      <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#C9A84C] via-transparent to-transparent mix-blend-screen"></div>
                      <PlayCircle className="w-14 h-14 text-white/50 group-hover:text-[#C9A84C] group-hover:scale-125 transition-all duration-700 z-10 group-hover:shadow-[0_0_30px_rgba(201,168,76,0.5)] rounded-full bg-black/20 backdrop-blur-sm" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent"></div>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-2xl font-bold text-white mb-2 tracking-wide group-hover:text-[#C9A84C] transition-colors">{dest.title}</h3>
                      <div className="flex items-center gap-1.5 text-sm text-gray-400">
                        <MapPin className="w-4 h-4 text-[#C9A84C]" />
                        <span className="uppercase tracking-widest">{dest.city}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )
          ) : (
            /* Immersive Portal Video Player State */
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex flex-col items-center justify-center min-h-screen fixed inset-0 z-50 bg-[#030712]"
            >
              {/* Back Button */}
              <div className="absolute top-8 left-8 z-[60]">
                <button 
                  onClick={() => setActiveSite(null)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-black/50 hover:bg-[#C9A84C]/20 border border-white/20 hover:border-[#C9A84C] rounded-full text-sm font-medium transition-all backdrop-blur-md group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Discover
                </button>
              </div>

              {/* Edge-to-Edge / Massive Rounded Video Player */}
              <div className="w-[95vw] h-[75vh] md:w-[90vw] md:h-[80vh] rounded-[40px] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(201,168,76,0.15)] relative bg-black mt-8">
                {/* CSS to ensure controls are completely hidden, plus HTML attributes */}
                <video 
                  src={activeSite.videoSrc}
                  className="w-full h-full object-cover pointer-events-none"
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  controls={false}
                  disablePictureInPicture
                  controlsList="nodownload nofullscreen noremoteplayback"
                />
                
                {/* Embedded Typography inside the bottom of the video container for maximum immersion */}
                <div className="absolute bottom-0 left-0 w-full p-12 bg-gradient-to-t from-black via-black/80 to-transparent">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="max-w-4xl"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-5 h-5 text-[#C9A84C]" />
                      <span className="text-[#C9A84C] uppercase tracking-widest font-semibold">{activeSite.city}</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-extrabold mb-4 text-white tracking-tight drop-shadow-lg">
                      {activeSite.title}
                    </h2>
                    <p className="text-lg md:text-xl leading-relaxed text-gray-300 font-light drop-shadow-md max-w-3xl">
                      {activeSite.description}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
