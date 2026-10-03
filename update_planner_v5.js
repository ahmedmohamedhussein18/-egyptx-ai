const fs = require('fs');
let content = fs.readFileSync('src/components/PlannerContent.tsx', 'utf8');

// 1. Hieroglyph Component + Loading Screen Update
const oldLoading = /function CinematicLoading\(\) \{[\s\S]*?return \([\s\S]*?<\/div>\s*\);\s*\}/;
const newLoading = `const HieroglyphText = ({ text, className }: { text: string, className?: string }) => {
  const [display, setDisplay] = useState(text.replace(/./g, '𓀀'));
  
  useEffect(() => {
    const chars = '𓀀𓃭𓅓𓆣𓋹𓍹𓎡𓏏𓐍𓁹𓆗𓈖𓌂𓎟𓏤𓀭𓃻𓄿𓆑𓇋';
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

const LOADING_TEXTS = [
  "CONSULTING THE PHARAOHS...",
  "MAPPING ANCIENT ROUTES...",
  "ALIGNING THE STARS...",
  "TRANSLATING HIEROGLYPHS...",
  "SUMMONING THE WINDS OF THE NILE..."
];

function CinematicLoading() {
  const [progress, setProgress] = useState(0);
  const [textIdx, setTextIdx] = useState(0);
  const [displayProgress, setDisplayProgress] = useState("00");

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => (p < 99 ? p + 1 : p));
    }, 60);
    const textTimer = setInterval(() => {
      setTextIdx(i => (i + 1) % LOADING_TEXTS.length);
    }, 3000);
    return () => { clearInterval(timer); clearInterval(textTimer); };
  }, []);

  useEffect(() => {
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
        @keyframes assemblePart1 {
          0% { transform: translateY(-80px) rotateX(60deg) rotateY(45deg); opacity: 0; }
          100% { transform: translateY(0) rotateX(0) rotateY(0); opacity: 1; }
        }
        @keyframes assemblePart2 {
          0% { transform: translateY(80px) rotateX(-60deg) rotateY(-45deg); opacity: 0; }
          100% { transform: translateY(0) rotateX(0) rotateY(0); opacity: 1; }
        }
        @keyframes energyWave {
          0% { transform: scaleY(0); opacity: 0.8; }
          100% { transform: scaleY(1); opacity: 0; }
        }
        @keyframes panRight {
          0% { background-position: 0 0; }
          100% { background-position: 100% 0; }
        }
        .obelisk-top { animation: assemblePart1 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; transform-origin: center bottom; }
        .obelisk-base { animation: assemblePart2 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; transform-origin: center top; }
        .energy-wave { animation: energyWave 2s ease-out infinite; transform-origin: center bottom; }
        .sand-fill { background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4='); }
      \`}</style>

      <div className="relative z-10 flex flex-col items-center">
        {/* 3D Assembling Obelisk/Pyramid Hybrid */}
        <div className="w-48 h-48 mb-16 relative perspective-[1000px]">
          <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible drop-shadow-[0_0_25px_rgba(201,168,76,0.5)]">
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
            <g className="obelisk-top">
              <polygon points="100,30 75,70 125,70" fill="url(#goldGrad)" opacity="0.9" />
              <polygon points="100,30 100,70 125,70" fill="url(#goldGradDark)" opacity="0.7" />
            </g>
            <g className="obelisk-base">
              <polygon points="75,72 125,72 135,160 65,160" fill="url(#goldGradDark)" opacity="0.8" />
              <polygon points="100,72 125,72 135,160 100,160" fill="url(#goldGrad)" opacity="0.6" />
            </g>
            <ellipse cx="100" cy="170" rx="45" ry="12" fill="none" stroke="#E2CB85" strokeWidth="2" className="energy-wave" />
            <ellipse cx="100" cy="170" rx="70" ry="18" fill="none" stroke="#C9A84C" strokeWidth="1" className="energy-wave" style={{ animationDelay: '0.6s' }} />
            <circle cx="100" cy="170" r="40" fill="#E2CB85" filter="blur(25px)" opacity="0.3" />
          </svg>
          {/* Particles */}
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute w-1.5 h-1.5 bg-[#E2CB85] rounded-full blur-[1px] animate-[particleUp_2s_ease-in-out_infinite]" style={{ left: \`\${20 + Math.random()*60}%\`, top: \`\${30 + Math.random()*70}%\`, animationDelay: \`\${Math.random()*2}s\` }} />
          ))}
        </div>

        <h2 className="text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E2CB85] to-[#C9A84C] mb-8 tracking-[0.2em] uppercase text-center min-h-[40px] drop-shadow-md">
          <HieroglyphText key={textIdx} text={LOADING_TEXTS[textIdx]} />
        </h2>

        {/* Dynamic Sand Filling Bar */}
        <div className="relative w-72 md:w-[400px] h-3 bg-[#0A1628] rounded-full overflow-hidden border border-white/10 shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)] backdrop-blur-md">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#8A7334] via-[#E2CB85] to-[#C9A84C] transition-all duration-300 ease-out shadow-[0_0_20px_rgba(201,168,76,1)] flex items-center justify-end"
            style={{ width: \`\${progress}%\` }}
          >
            <div className="absolute inset-0 sand-fill opacity-30 mix-blend-overlay animate-[panRight_2s_linear_infinite]" />
            {/* Leading edge glow */}
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
}`;
content = content.replace(oldLoading, newLoading);

// 2. ActivityCard Component Injection
const activityCardInsert = `const ActivityCard = ({ act, actIdx, dayIdx }: { act: Activity, actIdx: number, dayIdx: number }) => {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const glareRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = cardRef.current;
    const glare = glareRef.current;
    if (!el || !glare) return;

    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -6; 
      const rotateY = ((x - centerX) / centerX) * 6;
      
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        el.style.transform = \`perspective(1000px) rotateX(\${rotateX}deg) rotateY(\${rotateY}deg) scale3d(1.02, 1.02, 1.02)\`;
        glare.style.transform = \`translate(\${x - rect.width/2}px, \${y - rect.height/2}px)\`;
        glare.style.opacity = '0.5';
      });
    };

    const handleMouseLeave = () => {
      cancelAnimationFrame(rafId);
      el.style.transform = \`perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)\`;
      if (glare) glare.style.opacity = '0';
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: (dayIdx * 0.2) + (actIdx * 0.15), ease: [0.21, 1.02, 0.73, 1] }}
    >
      {actIdx > 0 && (
        <div className="ml-1 pl-4 border-l border-dashed border-[#C9A84C]/40 py-3">
          <span className="inline-flex items-center gap-1 bg-[#0A1628] border border-[#C9A84C]/30 text-[#E2CB85] text-xs px-3 py-1.5 rounded-md shadow-[0_0_10px_rgba(201,168,76,0.15)] font-medium">
            {actIdx % 2 === 0 ? '🚕 Uber - 25 mins' : '🚶 Walking - 10 mins'}
          </span>
        </div>
      )}
      
      <div className="flex gap-5 py-3 group">
        <div className="flex flex-col items-center">
          <div className="w-3.5 h-3.5 rounded-full bg-[#C9A84C]/80 group-hover:bg-[#E2CB85] transition-colors ring-4 ring-[#C9A84C]/20 shadow-[0_0_10px_rgba(201,168,76,0.5)]" />
          <div className="w-px flex-1 bg-gradient-to-b from-[#C9A84C]/40 to-transparent mt-2" />
        </div>
        
        <div className="pb-6 flex-1 min-w-0" style={{ perspective: '1000px' }}>
          <div 
            ref={cardRef} 
            className="relative bg-[#0A1628]/80 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden group-hover:border-[#C9A84C]/50 transition-[border,box-shadow] shadow-[0_10px_40px_rgb(0,0,0,0.6)] flex flex-col sm:flex-row will-change-transform"
            style={{ transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
          >
            {/* Moving Glare Overlay */}
            <div 
              ref={glareRef}
              className="pointer-events-none absolute w-[200%] h-[200%] -top-1/2 -left-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_50%)] opacity-0 transition-opacity duration-300 z-50 mix-blend-overlay"
            />
            
            <div className="sm:w-56 h-56 sm:h-auto relative shrink-0 overflow-hidden">
              <img 
                src={\`https://images.unsplash.com/photo-\${actIdx % 3 === 0 ? '1539650116574-8efeb43e2750' : actIdx % 3 === 1 ? '1600378034509-2166a01dd1e3' : '1590518386445-5654cc3c8b41'}?auto=format&fit=crop&w=500&q=80\`} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.08] filter group-hover:brightness-110" 
                alt={act.name} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/20 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-[#0A1628]" />
              
              <div className="absolute top-3 left-3 bg-[#030712]/90 backdrop-blur-md text-[#E2CB85] px-3 py-1.5 rounded-lg text-xs font-bold border border-[#C9A84C]/40 shadow-lg flex items-center gap-2">
                ⏱ {act.time}
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col justify-center relative z-10 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs px-3 py-1 rounded-full bg-[#C9A84C]/15 text-[#E2CB85] border border-[#C9A84C]/30 uppercase tracking-widest font-bold shadow-sm">{act.type}</span>
                {act.cost && <span className="text-xs px-3 py-1 rounded-full bg-[#19A974]/15 text-[#19A974] border border-[#19A974]/30 font-semibold flex items-center gap-1 shadow-sm">💰 {act.cost}</span>}
              </div>
              
              <h4 className="font-extrabold text-2xl text-white group-hover:text-[#E2CB85] transition-colors leading-tight drop-shadow-md">{act.name}</h4>
              <p className="text-sm text-white/70 leading-relaxed font-medium">{act.description}</p>
              
              <div className="pt-4 mt-2 border-t border-white/10 space-y-3">
                {act.tip && (
                  <div className="flex items-start gap-3 text-sm text-[#1B6B93] bg-[#1B6B93]/10 p-2.5 rounded-lg border border-[#1B6B93]/20">
                    <span className="shrink-0 mt-0.5">💡</span>
                    <span><strong className="text-white/90">Tip:</strong> {act.tip}</span>
                  </div>
                )}
                {act.fact && (
                  <div className="flex items-start gap-3 text-sm text-[#C9A84C]/90 bg-[#C9A84C]/5 p-2.5 rounded-lg border border-[#C9A84C]/20">
                    <span className="shrink-0 mt-0.5">📜</span>
                    <span><strong className="text-[#E2CB85]">Did you know?</strong> {act.fact}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
`;

content = content.replace(/interface DayPlan \{[\s\S]*?\}/, `interface DayPlan {\n  day: number;\n  city: string;\n  activities: Activity[];\n}\n\n${activityCardInsert}`);

// 3. Dynamic MOCK_ITINERARY generator to match realistic days
const mockItineraryRegex = /const MOCK_ITINERARY = \[[\s\S]*?\];/;
const dynamicMock = `const generateMockItinerary = (duration: number, dests: string[]) => {
  const safeDests = dests.length > 0 ? dests : ['Cairo'];
  const mock = [];
  const pool = [
    { name: 'Great Pyramids of Giza', description: 'Explore the last remaining wonder of the ancient world. Take a camel ride into the desert for panoramic views.', type: 'history', cost: '$$ Moderate', tip: '👟 Wear comfortable walking shoes and bring plenty of water.', fact: 'The Great Pyramid consists of an estimated 2.3 million stone blocks.' },
    { name: 'Egyptian Museum', description: 'Witness the golden mask of Tutankhamun and countless artifacts.', type: 'culture', cost: '$ Budget', tip: '📸 Photography pass requires a small extra fee.', fact: 'It houses over 120,000 items of ancient Egyptian antiquities.' },
    { name: 'Khan el-Khalili Bazaar', description: 'Wander through the historic shopping district and grab some souvenirs.', type: 'shopping', cost: 'Free to walk', tip: '🗣️ Be prepared to haggle playfully with shop owners.', fact: 'The bazaar dates back to 1382.' },
    { name: 'Nile Felucca Ride', description: 'Relaxing sunset sail on a traditional wooden boat.', type: 'relaxing', cost: '$$ Moderate', tip: '🧥 Bring a light jacket as the river breeze gets cool at sunset.', fact: 'Feluccas have remained the primary mode of transportation on the Nile since antiquity.' },
    { name: 'Valley of the Kings', description: 'Descend into the vibrantly painted tombs of mighty pharaohs.', type: 'history', cost: '$$$ Premium', tip: '🧢 Arrive early to beat the intense midday desert heat.', fact: 'Over 60 tombs have been discovered here, including that of King Tut.' },
    { name: 'Karnak Temple', description: 'Walk through the massive hypostyle hall of towering ancient pillars.', type: 'history', cost: '$$ Moderate', tip: '🚶‍♂️ The complex is massive; don’t miss the Sacred Lake.', fact: 'It is the largest religious building ever constructed in the world.' },
    { name: 'Luxor Temple at Night', description: 'Witness the ancient columns beautifully illuminated against the night sky.', type: 'culture', cost: '$$ Moderate', tip: '🌙 Visiting after sunset offers a magical, cooler experience.', fact: 'The temple is guarded by a massive avenue of human-headed sphinxes.' },
    { name: 'Red Sea Snorkeling', description: 'Dive into crystal-clear waters teeming with vibrant coral reefs and exotic fish.', type: 'nature', cost: '$$$ Premium', tip: '🤿 Eco-friendly sunscreen is highly recommended to protect the reefs.', fact: 'The Red Sea is home to over 1,200 species of fish, 10% of which are found nowhere else.' }
  ];

  for (let i = 1; i <= duration; i++) {
    const city = safeDests[(i - 1) % safeDests.length];
    const numActivities = i % 3 === 0 ? 3 : 2; 
    const activities = [];
    
    let hour = 9;
    for (let a = 0; a < numActivities; a++) {
      const actPool = pool[(i + a * 3) % pool.length];
      const startTime = \`\${hour < 10 ? '0'+hour : hour}:00 AM\`;
      const endHour = hour + 2 + (a % 2);
      const endTime = \`\${endHour > 12 ? (endHour-12 < 10 ? '0'+(endHour-12) : endHour-12) : endHour}:30 \${endHour >= 12 ? 'PM' : 'AM'}\`;
      
      activities.push({
        ...actPool,
        time: \`\${startTime} - \${endTime}\`
      });
      
      hour = endHour + 1;
      if (hour >= 12 && hour < 14) hour = 14;
    }
    
    mock.push({ day: i, city: city, activities });
  }
  return mock;
};`;
content = content.replace(mockItineraryRegex, dynamicMock);

// Hook it into catch fallback correctly: setItinerary(generateMockItinerary(duration, destinations));
content = content.replace(/setItinerary\(MOCK_ITINERARY as any\);/, 'setItinerary(generateMockItinerary(duration, destinations));');


// 4. Headline Replacement
const oldHeaderRegex = /<div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">[\s\S]*?<h2 className="text-2xl md:text-3xl font-bold text-white mb-1">\{t\('planner.itineraryTitle'\)\}<\/h2>[\s\S]*?<p className="text-white\/40">\{duration\} days &middot; \{travelers\} traveler\(s\) &middot; \{budget\} budget<\/p>[\s\S]*?<\/div>/;

const newHeader = `<div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6 w-full">
                  <div className="flex-1">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E2CB85] to-[#C9A84C] mb-5 tracking-tight drop-shadow-sm leading-tight">
                      Your {duration}-Day Curated Expedition Across Egypt
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/90 font-medium shadow-sm flex items-center gap-2">
                        👥 {travelers} Traveler{travelers > 1 ? 's' : ''}
                      </span>
                      <span className="px-4 py-2 rounded-full bg-[#C9A84C]/15 backdrop-blur-md border border-[#C9A84C]/30 text-[#E2CB85] font-semibold shadow-sm flex items-center gap-2 tracking-wide">
                        💳 {budget || 'Flexible'} Budget
                      </span>
                      <span className="px-4 py-2 rounded-full bg-[#1B6B93]/15 backdrop-blur-md border border-[#1B6B93]/30 text-[#4EB1E2] font-medium shadow-sm flex items-center gap-2 capitalize">
                        ✨ {travelStyle || 'Balanced'} Style
                      </span>
                    </div>
                  </div>`;
content = content.replace(oldHeaderRegex, newHeader);


// 5. Replace inline activity mapping with ActivityCard mapping
const oldMappingRegex = /<motion\.div\s*key=\{actIdx\}[\s\S]*?<\/motion\.div>/g;
// Wait, regex global replacement for a block inside `.map()` is tricky if there are other motion divs. 
// We will replace exactly `{day.activities.map((act, actIdx) => (` up to `))}`
const oldActivityMapBlock = /\{day\.activities\.map\(\(act, actIdx\) => \([\s\S]*?<\/motion\.div>\s*\)\)\}/;
const newActivityMapBlock = `{day.activities.map((act, actIdx) => (
                            <ActivityCard key={actIdx} act={act} actIdx={actIdx} dayIdx={dayIdx} />
                          ))}`;
content = content.replace(oldActivityMapBlock, newActivityMapBlock);


fs.writeFileSync('src/components/PlannerContent.tsx', content, 'utf8');
console.log('Update Planner V5 done!');
