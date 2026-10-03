const fs = require('fs');
let content = fs.readFileSync('src/components/PlannerContent.tsx', 'utf8');

// 1. Decryption Counter in CinematicLoading
const oldLoading = /function CinematicLoading\(\) \{[\s\S]*?\n\}/;
const newLoading = `const LOADING_TEXTS = [
  "Consulting the Pharaohs...",
  "Mapping ancient routes...",
  "Aligning the stars...",
  "Translating hieroglyphs...",
  "Summoning the winds of the Nile..."
];

function CinematicLoading() {
  const [progress, setProgress] = useState(0);
  const [textIdx, setTextIdx] = useState(0);
  const [displayProgress, setDisplayProgress] = useState("00");

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => (p < 99 ? p + 1 : p));
    }, 40);
    const textTimer = setInterval(() => {
      setTextIdx(i => (i + 1) % LOADING_TEXTS.length);
    }, 2000);
    return () => { clearInterval(timer); clearInterval(textTimer); };
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setDisplayProgress("100");
      return;
    }
    const flicker = setInterval(() => {
      if (Math.random() > 0.3) {
        setDisplayProgress(Math.floor(Math.random() * 100).toString().padStart(2, '0'));
      } else {
        setDisplayProgress(progress.toString().padStart(2, '0'));
      }
    }, 50);
    return () => clearInterval(flicker);
  }, [progress]);

  return (
    <div className="fixed inset-0 bg-[#030712] z-[300] flex flex-col items-center justify-center p-8 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1B6B93]/20 via-[#030712] to-[#030712]" />
      <style>{\`
        @keyframes pulseGlow {
          0%, 100% { filter: drop-shadow(0 0 15px rgba(201,168,76,0.4)); transform: scale(1) translateY(0); }
          50% { filter: drop-shadow(0 0 40px rgba(201,168,76,0.9)); transform: scale(1.05) translateY(-10px); }
        }
        @keyframes rotatePyramid {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes particleUp {
          0% { opacity: 0; transform: translateY(20px) scale(0.5); }
          50% { opacity: 1; transform: translateY(-30px) scale(1); }
          100% { opacity: 0; transform: translateY(-80px) scale(0.5); }
        }
        .pyramid-wrapper { animation: pulseGlow 3s ease-in-out infinite; transform-style: preserve-3d; perspective: 1000px; }
        .pyramid-inner { animation: rotatePyramid 8s linear infinite; transform-style: preserve-3d; }
        .particle { animation: particleUp 2s ease-in-out infinite; }
      \`}</style>

      <div className="relative z-10 flex flex-col items-center">
        <div className="pyramid-wrapper w-40 h-40 mb-16 relative">
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible pyramid-inner">
            <polygon points="50,10 10,90 90,90" fill="url(#goldGrad)" opacity="0.8" />
            <polygon points="50,10 50,90 90,90" fill="url(#goldGradDark)" opacity="0.9" />
            <circle cx="50" cy="65" r="12" fill="#030712" stroke="#E2CB85" strokeWidth="2" opacity="0.9" />
            <circle cx="50" cy="65" r="4" fill="#C9A84C" />
            <path d="M 30,65 Q 50,45 70,65" fill="none" stroke="#E2CB85" strokeWidth="2" />
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E2CB85" />
                <stop offset="100%" stopColor="#C9A84C" />
              </linearGradient>
              <linearGradient id="goldGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C9A84C" />
                <stop offset="100%" stopColor="#8A7334" />
              </linearGradient>
            </defs>
          </svg>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="particle absolute w-2 h-2 bg-[#E2CB85] rounded-full blur-[2px]" style={{ left: \`\${20 + Math.random()*60}%\`, top: \`\${50 + Math.random()*40}%\`, animationDelay: \`\${Math.random()*2}s\` }} />
          ))}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#E2CB85] rounded-full blur-[40px] opacity-60" />
        </div>

        <h2 className="text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E2CB85] to-[#C9A84C] mb-8 tracking-[0.2em] uppercase text-center min-h-[40px] transition-opacity duration-500">
          {LOADING_TEXTS[textIdx]}
        </h2>

        <div className="h-1.5 w-64 md:w-96 bg-[#0A1628] rounded-full overflow-hidden relative border border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#8A7334] via-[#E2CB85] to-[#C9A84C] transition-all duration-100 ease-linear shadow-[0_0_15px_rgba(201,168,76,0.8)]"
            style={{ width: \`\${progress}%\` }}
          />
        </div>
        
        <div className="mt-8 flex flex-col items-center">
          <span className="font-mono text-4xl font-bold text-[#E2CB85]" style={{ textShadow: '0 0 15px rgba(201,168,76,1)' }}>
            {displayProgress}%
          </span>
          <p className="mt-2 text-[#C9A84C]/80 font-mono text-xs tracking-[0.3em]">DECRYPTING ANCIENT ROUTES</p>
        </div>
      </div>
    </div>
  );
}`;
content = content.replace(oldLoading, newLoading);

// 2. Timeline Staggered Reveal
const oldFragment = /<React\.Fragment key=\{actIdx\}>/;
const newMotionDiv = `<motion.div 
                            key={actIdx}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: (dayIdx * 0.3) + (actIdx * 0.15), ease: "easeOut" }}
                          >`;
content = content.replace(new RegExp(oldFragment, 'g'), newMotionDiv);

const oldFragmentEnd = /<\/React\.Fragment>/;
const newMotionDivEnd = `</motion.div>`;
content = content.replace(new RegExp(oldFragmentEnd, 'g'), newMotionDivEnd);

// 3. EgyptMap route animation
const oldEgyptMap = /function EgyptMap\(\{ cities \}: \{ cities: string\[\] \}\) \{[\s\S]*?<\/svg>\s*\);\s*\}/;
const newEgyptMap = `function EgyptMap({ cities }: { cities: string[] }) {
  const uniqueCities = [...new Set(cities)];
  
  const routePoints = cities.map(c => CITY_COORDS[c]).filter(Boolean);
  const routePath = routePoints.map(p => \`\${p.x},\${p.y}\`).join(' ');

  return (
    <svg viewBox="0 0 300 500" className="w-full h-full" fill="none">
      <style>{\`
        .route-path-anim {
          stroke-dasharray: 2000;
          stroke-dashoffset: 2000;
          animation: drawRoute 3s ease-in-out forwards;
          filter: drop-shadow(0 0 5px rgba(201,168,76,0.8));
        }
        @keyframes drawRoute {
          to { stroke-dashoffset: 0; }
        }
        .pin-drop {
          animation: pinDrop 0.5s cubic-bezier(0.25, 1, 0.5, 1) backwards, pinPulse 2s infinite;
        }
        @keyframes pinDrop {
          0% { transform: translateY(-20px) scale(0); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes pinPulse {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(201,168,76,0.6)); }
          50% { filter: drop-shadow(0 0 15px rgba(201,168,76,1)); }
        }
      \`}</style>
      <defs>
        <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E2CB85" />
          <stop offset="100%" stopColor="#C9A84C" />
        </linearGradient>
      </defs>

      <path
        d="M165 50 L250 50 L260 80 L270 100 L260 120 L255 140 L265 155 L255 170 L250 185 L260 200 L255 220 L250 240 L245 260 L240 280 L235 300 L230 320 L225 340 L218 370 L210 400 L195 430 L180 450 L165 440 L150 420 L140 400 L130 380 L125 350 L130 320 L140 290 L150 260 L155 230 L160 200 L170 170 L175 150 L180 130 L175 110 L170 90 L165 70 Z"
        fill="#C9A84C"
        fillOpacity="0.05"
        stroke="#C9A84C"
        strokeWidth="1.5"
        strokeOpacity="0.1"
      />
      <path
        d="M195 130 Q200 160 205 200 Q210 240 205 270 Q200 310 210 350 Q215 380 195 430"
        stroke="#1B6B93"
        strokeWidth="2.5"
        strokeOpacity="0.5"
        strokeLinecap="round"
        fill="none"
      />

      {routePoints.length > 1 && (
        <polyline
          points={routePath}
          fill="none"
          stroke="url(#routeGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="route-path-anim"
        />
      )}

      {uniqueCities.map((city, idx) => {
        const coords = CITY_COORDS[city];
        if (!coords) return null;
        return (
          <g key={city} className="pin-drop" style={{ animationDelay: \`\${idx * 0.4}s\`, transformOrigin: \`\${coords.x}px \${coords.y}px\` }}>
            <circle cx={coords.x} cy={coords.y} r="16" fill="#C9A84C" fillOpacity="0.1" />
            <circle cx={coords.x} cy={coords.y} r="5" fill="#E2CB85" stroke="#030712" strokeWidth="2" />
            <text x={coords.x} y={coords.y - 18} textAnchor="middle" fill="#E2CB85" fontSize="11" fontWeight="700" fontFamily="system-ui" filter="drop-shadow(0px 2px 2px rgba(0,0,0,0.8))">
              {city}
            </text>
          </g>
        );
      })}
    </svg>
  );
}`;
content = content.replace(oldEgyptMap, newEgyptMap);

fs.writeFileSync('src/components/PlannerContent.tsx', content, 'utf8');
console.log('Update V4 done!');
