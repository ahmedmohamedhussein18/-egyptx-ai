const fs = require('fs');
let content = fs.readFileSync('src/components/PlannerContent.tsx', 'utf8');

// 1. Update Activity interface
content = content.replace(/interface Activity \{[\s\S]*?\}/, `interface Activity {\n  time: string;\n  name: string;\n  description: string;\n  type: string;\n  cost?: string;\n  tip?: string;\n  fact?: string;\n}`);

// 2. Date Picker (Step 2)
const dateStyle = `
                  <style>{\`
                    .custom-date-picker::-webkit-calendar-picker-indicator {
                      filter: invert(0.8) sepia(1) saturate(3) hue-rotate(5deg) brightness(1.2);
                      cursor: pointer;
                      opacity: 0.6;
                      transition: 0.2s;
                    }
                    .custom-date-picker::-webkit-calendar-picker-indicator:hover {
                      opacity: 1;
                    }
                  \`}</style>
`;
content = content.replace(/<h3 className="text-2xl font-bold text-white mb-4">Step 2: When are you going\?<\/h3>/, dateStyle + '<h3 className="text-2xl font-bold text-white mb-4">Step 2: When are you going?</h3>');
content = content.replace(/className="w-full bg-\[#060E1A\] border border-white\/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-\[#C9A84C\]\/50"/g, 'className="custom-date-picker w-full bg-[#060E1A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C]/50 transition-colors"');

// 3. Destinations Expansion
const newDestinationsData = `const DESTINATIONS_DATA = [
  { name: 'Cairo' }, { name: 'Giza' }, { name: 'Alexandria' }, { name: 'Luxor' }, 
  { name: 'Aswan' }, { name: 'Hurghada' }, { name: 'Sharm El Sheikh' }, { name: 'Marsa Matrouh' }, 
  { name: 'Fayoum' }, { name: 'Port Said' }, { name: 'Ismailia' }, { name: 'Suez' }, 
  { name: 'Minya' }, { name: 'Assiut' }, { name: 'Sohag' }, { name: 'Qena' }, 
  { name: 'Dahab' }, { name: 'Siwa Oasis' }, { name: 'North Coast' }, { name: 'Nuweiba' }
];`;
content = content.replace(/const DESTINATIONS_DATA = \[\s*\{[\s\S]*?\}\s*\];/, newDestinationsData);

const oldStep3CodeRegex = /<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">[\s\S]*?<div className="flex justify-between pt-4">/;
const newStep3Code = `<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scroll">
                      {DESTINATIONS_DATA.map(dest => {
                        const active = destinations.includes(dest.name);
                        return (
                          <div 
                            key={dest.name} 
                            onClick={() => setDestinations(d => active ? d.filter(x=>x!==dest.name) : [...d, dest.name])} 
                            className={\`cursor-pointer py-3 px-2 rounded-xl border flex items-center justify-center text-center font-bold text-sm tracking-wide transition-all duration-300 \${active ? 'bg-[#C9A84C]/20 border-[#C9A84C] text-[#C9A84C] shadow-[0_0_15px_rgba(201,168,76,0.3)] scale-[1.02]' : 'bg-[#0A1628]/60 backdrop-blur-md border-white/5 text-white/70 hover:border-[#C9A84C]/50 hover:text-white hover:shadow-[0_0_10px_rgba(201,168,76,0.2)]'}\`}
                          >
                            {dest.name}
                          </div>
                        )
                      })}
                    </div>
                    <style>{\`
                      .custom-scroll::-webkit-scrollbar { width: 6px; }
                      .custom-scroll::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 10px; }
                      .custom-scroll::-webkit-scrollbar-thumb { background: rgba(201, 168, 76, 0.3); border-radius: 10px; }
                      .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(201, 168, 76, 0.6); }
                    \`}</style>
                    <div className="flex justify-between pt-4">`;
content = content.replace(oldStep3CodeRegex, newStep3Code);

// 4. Loading Animation
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

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => (p < 99 ? p + 1 : p));
    }, 40);
    const textTimer = setInterval(() => {
      setTextIdx(i => (i + 1) % LOADING_TEXTS.length);
    }, 2000);
    return () => { clearInterval(timer); clearInterval(textTimer); };
  }, []);

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
        <p className="mt-4 text-[#C9A84C]/80 font-mono text-xs tracking-widest">{progress}% SYNCHRONIZED</p>
      </div>
    </div>
  );
}`;
content = content.replace(oldLoading, newLoading);

// 5. Update MOCK_ITINERARY
const oldMockItineraryRegex = /const MOCK_ITINERARY = \[\s*\{[\s\S]*?\}\s*\];/;
const newMockItinerary = `const MOCK_ITINERARY = [
  { day: 1, city: 'Cairo', activities: [
    { time: '09:00 AM - 12:30 PM', name: 'Great Pyramids of Giza', description: 'Explore the last remaining wonder of the ancient world. Take a camel ride into the desert for panoramic views.', type: 'history', cost: '$$ Moderate', tip: '👟 Wear comfortable walking shoes and bring plenty of water.', fact: 'The Great Pyramid consists of an estimated 2.3 million stone blocks.' },
    { time: '02:00 PM - 05:00 PM', name: 'Egyptian Museum', description: 'Witness the golden mask of Tutankhamun and countless artifacts.', type: 'culture', cost: '$ Budget', tip: '📸 Photography pass requires a small extra fee.', fact: 'It houses over 120,000 items of ancient Egyptian antiquities.' }
  ]},
  { day: 2, city: 'Cairo', activities: [
    { time: '10:00 AM - 02:00 PM', name: 'Khan el-Khalili Bazaar', description: 'Wander through the historic shopping district and grab some souvenirs.', type: 'shopping', cost: 'Free to walk', tip: '🗣️ Be prepared to haggle playfully with shop owners.', fact: 'The bazaar dates back to 1382 and was originally a caravanserai.' },
    { time: '04:00 PM - 06:00 PM', name: 'Nile Felucca Ride', description: 'Relaxing sunset sail on a traditional wooden boat.', type: 'relaxing', cost: '$$ Moderate', tip: '🧥 Bring a light jacket as the river breeze gets cool at sunset.', fact: 'Feluccas have remained the primary mode of transportation on the Nile since antiquity.' }
  ]},
  { day: 3, city: 'Luxor', activities: [
    { time: '07:00 AM - 11:30 AM', name: 'Valley of the Kings', description: 'Descend into the vibrantly painted tombs of mighty pharaohs.', type: 'history', cost: '$$$ Premium', tip: '🧢 Arrive early to beat the intense midday desert heat.', fact: 'Over 60 tombs have been discovered here, including that of King Tut.' },
    { time: '03:00 PM - 05:30 PM', name: 'Karnak Temple', description: 'Walk through the massive hypostyle hall of towering ancient pillars.', type: 'history', cost: '$$ Moderate', tip: '🚶‍♂️ The complex is massive; don’t miss the Sacred Lake.', fact: 'It is the largest religious building ever constructed in the world.' }
  ]}
];`;
content = content.replace(oldMockItineraryRegex, newMockItinerary);

// 6. Update Timeline Render
const oldTimelineRegex = /\{?\/\*\s*Content\s*\*\/\s*\}?\s*<div className="pb-4 flex-1 min-w-0">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

const newTimeline = `{/* Content */}
                              <div className="pb-6 flex-1 min-w-0">
                                <div className="bg-[#0A1628]/90 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden group-hover:border-[#C9A84C]/40 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex flex-col sm:flex-row relative">
                                  <div className="sm:w-48 h-48 sm:h-auto relative shrink-0">
                                    <img src={\`https://images.unsplash.com/photo-\${actIdx % 3 === 0 ? '1539650116574-8efeb43e2750' : actIdx % 3 === 1 ? '1600378034509-2166a01dd1e3' : '1590518386445-5654cc3c8b41'}?auto=format&fit=crop&w=400&q=80\`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={act.name} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/20 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-[#0A1628]" />
                                    
                                    <div className="absolute top-3 left-3 bg-[#030712]/80 backdrop-blur-md text-[#C9A84C] px-3 py-1.5 rounded-lg text-xs font-bold border border-[#C9A84C]/30 shadow-lg flex items-center gap-2">
                                      ⏱ {act.time}
                                    </div>
                                  </div>
                                  
                                  <div className="p-5 flex-1 flex flex-col justify-center relative z-10 space-y-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="text-xs px-3 py-1 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20 uppercase tracking-wider font-bold">{act.type}</span>
                                      {act.cost && <span className="text-xs px-3 py-1 rounded-full bg-[#19A974]/10 text-[#19A974] border border-[#19A974]/20 font-semibold flex items-center gap-1">💰 {act.cost}</span>}
                                    </div>
                                    
                                    <h4 className="font-bold text-xl text-white group-hover:text-[#C9A84C] transition-colors leading-tight">{act.name}</h4>
                                    <p className="text-sm text-white/60 leading-relaxed">{act.description}</p>
                                    
                                    <div className="pt-3 mt-1 border-t border-white/5 space-y-2">
                                      {act.tip && (
                                        <div className="flex items-start gap-2 text-sm text-[#1B6B93]">
                                          <span className="shrink-0 mt-0.5">💡</span>
                                          <span><strong className="text-white/80">Tip:</strong> {act.tip}</span>
                                        </div>
                                      )}
                                      {act.fact && (
                                        <div className="flex items-start gap-2 text-sm text-[#C9A84C]/80">
                                          <span className="shrink-0 mt-0.5">📜</span>
                                          <span><strong className="text-[#C9A84C]">Did you know?</strong> {act.fact}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>`;
content = content.replace(oldTimelineRegex, newTimeline);

// Fix the transport badges in the timeline loop:
// We need to keep the "actIdx % 2 === 0 ? '🚶 Walking - 15 min' : '🚕 Uber - 25 min'" style logic
const oldTransportRegex = /\{actIdx % 2 === 0 \? '🚶 Walking - 15 min' : '🚗 Taxi - 30 min'\}/;
const newTransportRegex = `{actIdx % 2 === 0 ? '🚕 Uber - 25 mins' : '🚶 Walking - 10 mins'}`;
content = content.replace(oldTransportRegex, newTransportRegex);

fs.writeFileSync('src/components/PlannerContent.tsx', content, 'utf8');
console.log('Update Planner V3 done!');
