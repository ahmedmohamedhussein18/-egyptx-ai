const fs = require('fs');
let c = fs.readFileSync('src/components/PlannerContent.tsx', 'utf8');

const loadingComponent = `
const LOADING_TEXTS = [
  "CONSULTING THE PHARAOHS...",
  "MAPPING ANCIENT ROUTES...",
  "ALIGNING THE STARS...",
  "TRANSLATING HIEROGLYPHS...",
  "SUMMONING THE WINDS OF THE NILE..."
];

const HieroglyphText = ({ text, className }: { text: string, className?: string }) => {
  const [display, setDisplay] = React.useState(text.replace(/./g, '0'));
  
  React.useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplay(prev => prev.split('').map((char, idx) => {
        if (idx < iterations) return text[idx];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));
      
      if (iterations >= text.length) clearInterval(interval);
      iterations += 1 / 4;
    }, 40);
    return () => clearInterval(interval);
  }, [text]);

  return <span className={className}>{display}</span>;
}

function CinematicLoading() {
  const [progress, setProgress] = React.useState(0);
  const [textIdx, setTextIdx] = React.useState(0);
  const [displayProgress, setDisplayProgress] = React.useState("00");

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => (p < 99 ? p + 1 : p));
    }, 60);
    const textTimer = setInterval(() => {
      setTextIdx(i => (i + 1) % LOADING_TEXTS.length);
    }, 3000);
    return () => { clearInterval(timer); clearInterval(textTimer); };
  }, []);

  React.useEffect(() => {
    if (progress >= 100) {
      setDisplayProgress("100");
      return;
    }
    const flicker = setInterval(() => {
      if (Math.random() > 0.4) {
        setDisplayProgress(Math.floor(Math.random() * 100).toString().padStart(2, '0'));
      } else {
        setDisplayProgress(progress.toString().padStart(2, '0'));
      }
    }, 40);
    return () => clearInterval(flicker);
  }, [progress]);

  return (
    <div className="fixed inset-0 bg-[#030712] z-[300] flex flex-col items-center justify-center p-8 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1B6B93]/20 via-[#030712] to-[#030712]" />
      <style>{\`
        @keyframes energyWave {
          0% { transform: scaleY(0); opacity: 0.8; }
          100% { transform: scaleY(1); opacity: 0; }
        }
        @keyframes panRight {
          0% { background-position: 0 0; }
          100% { background-position: 100% 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.4)); transform: scale(1); }
          50% { filter: drop-shadow(0 0 35px rgba(212, 175, 55, 0.9)); transform: scale(1.05); }
        }
        .energy-wave { animation: energyWave 2s ease-out infinite; transform-origin: center bottom; }
        .sand-fill { background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4='); }
      \`}</style>

      <div className="relative z-10 flex flex-col items-center">
        {/* Clean Glowing Pyramid SVG */}
        <div className="w-40 h-40 mb-16 relative" style={{ animation: 'pulseGlow 3s ease-in-out infinite' }}>
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-[0_0_30px_rgba(212,175,55,0.5)]">
            <defs>
              <linearGradient id="goldGradClean" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF2B2" />
                <stop offset="100%" stopColor="#D4AF37" />
              </linearGradient>
            </defs>
            <polygon points="50,15 15,85 85,85" fill="url(#goldGradClean)" opacity="0.95" />
            <polygon points="50,15 50,85 85,85" fill="#B38B22" opacity="0.5" />
            <ellipse cx="50" cy="85" rx="40" ry="10" fill="none" stroke="#D4AF37" strokeWidth="2" className="energy-wave" />
          </svg>
          {/* Ambient Radiant Particles */}
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute w-1 h-1 bg-[#FFF2B2] rounded-full blur-[1px] animate-[particleUp_2s_ease-in-out_infinite]" style={{ left: \`\${20 + Math.random()*60}%\`, top: \`\${30 + Math.random()*70}%\`, animationDelay: \`\${Math.random()*2}s\` }} />
          ))}
        </div>

        <h2 className="text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E2CB85] to-[#C9A84C] mb-8 tracking-[0.2em] uppercase text-center min-h-[40px] drop-shadow-md">
          <HieroglyphText key={textIdx} text={LOADING_TEXTS[textIdx]} />
        </h2>

        {/* Dynamic Sand Filling Bar */}
        <div className="relative w-72 md:w-[400px] h-3 bg-[#0A1628] rounded-full overflow-hidden border border-white/10 shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)] backdrop-blur-md">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#8A7334] via-[#E2CB85] to-[#C9A84C] transition-[width] duration-300 ease-out shadow-[0_0_20px_rgba(201,168,76,1)] flex items-center justify-end"
            style={{ width: \`\${progress}%\` }}
          >
            <div className="absolute inset-0 sand-fill opacity-30 mix-blend-overlay animate-[panRight_2s_linear_infinite]" />
            <div className="w-4 h-full bg-white opacity-80 blur-[2px]" />
          </div>
        </div>
        
        <div className="mt-8 flex flex-col items-center">
          <span className="font-mono text-4xl font-bold text-[#E2CB85]" style={{ textShadow: '0 0 15px rgba(201,168,76,1)' }}>
            {displayProgress}%
          </span>
          <p className="mt-2 text-[#C9A84C]/80 font-mono text-xs tracking-[0.3em]">
            <HieroglyphText text="DECRYPTING ANCIENT ROUTES" />
          </p>
        </div>
      </div>
    </div>
  );
}
`;

// Insert it right before function TripAssistant()
c = c.replace('function TripAssistant() {', loadingComponent + '\nfunction TripAssistant() {');

// Remove broken partial pieces left behind!
c = c.replace(/const HieroglyphText = \(\{ text, className \}: \{ text: string, className\?: string \}\) => \{[\s\S]*?return <span className=\{className\}>\{display\}<\/span>;\n\}/, '');

fs.writeFileSync('src/components/PlannerContent.tsx', c);
