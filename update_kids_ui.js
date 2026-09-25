const fs = require('fs');

const path = 'src/components/KidsModeContent.tsx';
let text = fs.readFileSync(path, 'utf8');

// 1. Update imports
text = text.replace(
  "import React, { useState, useEffect } from 'react';",
  "import React, { useState, useEffect, useRef } from 'react';"
);

text = text.replace(
  "import { Smile, Star, Award, ChevronRight, CheckCircle2, XCircle, Loader2, Sparkles } from 'lucide-react';",
  "import { Smile, Star, Award, ChevronRight, CheckCircle2, XCircle, Loader2, Sparkles, Play, Pause, Volume2, VolumeX } from 'lucide-react';"
);

// 2. Add video state inside the component
const stateInjection = `  // Onboarding
  const [nicknameInput, setNicknameInput] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Video State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlayOverlay, setShowPlayOverlay] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setShowPlayOverlay(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
`;

text = text.replace(
  `  // Onboarding
  const [nicknameInput, setNicknameInput] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);`,
  stateInjection
);

// 3. Update Video UI
const oldVideoUI = `{/* Welcome Video Section */}
        <div className="bg-[#1B6B93]/20 border border-[#1B6B93]/30 rounded-3xl overflow-hidden p-6 md:p-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#C9A84C]" />
            Welcome to Kids Mode!
          </h2>
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-black aspect-video w-full">
            <video 
              controls 
              preload="metadata"
              className="w-full h-full object-cover"
            >
              <source src="/videos/kids-mode-welcome.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>`;

const newVideoUI = `{/* Welcome Video Section */}
        <div className="bg-gradient-to-br from-[#1B6B93]/10 to-[#0A1628] border border-[#1B6B93]/30 rounded-3xl overflow-hidden p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-[#C9A84C]" />
              Welcome to Kids Mode!
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Watch this quick video to learn how to explore, earn points, and unlock awesome badges in your journey through Ancient Egypt!
            </p>
          </div>
          
          <div className="w-full max-w-[500px] shrink-0">
            <div 
              className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] bg-black aspect-video relative group cursor-pointer"
              onClick={togglePlay}
            >
              <video 
                ref={videoRef}
                preload="metadata"
                className="w-full h-full object-cover"
                onEnded={() => { setIsPlaying(false); setShowPlayOverlay(true); }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                <source src="/videos/kids-mode-welcome.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Play Overlay Button */}
              <AnimatePresence>
                {!isPlaying && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all"
                  >
                    <div className="w-20 h-20 rounded-full bg-[#C9A84C]/80 backdrop-blur-md flex items-center justify-center shadow-[0_0_20px_rgba(201,168,76,0.6)] text-black hover:scale-110 transition-transform">
                      <Play className="w-10 h-10 ml-2" fill="currentColor" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pause Hover Indicator */}
              <div className={\`absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 \${isPlaying ? 'group-hover:opacity-100' : ''} transition-opacity\`}>
                {isPlaying && (
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                    <Pause className="w-8 h-8" fill="currentColor" />
                  </div>
                )}
              </div>

              {/* Mute/Unmute Toggle */}
              <button 
                onClick={toggleMute}
                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>`;

text = text.replace(oldVideoUI, newVideoUI);
fs.writeFileSync(path, text, 'utf8');
console.log('Fixed kids video UI');
