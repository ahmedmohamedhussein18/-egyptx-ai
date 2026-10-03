const fs = require('fs');
const file = 'src/components/PlannerContent.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add new state for the wizard
const stateInsert = `
  // Wizard state
  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [destinations, setDestinations] = useState([]);
`;
content = content.replace(/const \[avoidCrowds, setAvoidCrowds\] = useState\(false\);/, 'const [avoidCrowds, setAvoidCrowds] = useState(false);' + stateInsert);

// 2. Replace the LoadingAnimation component entirely
const cinematicLoading = `
const FUN_FACTS = [
  "Cleopatra lived closer in time to the iPhone than to the building of the Great Pyramid.",
  "Ancient Egyptians invented the 365-day calendar to predict the Nile floods.",
  "The Great Pyramid of Giza was originally covered in highly polished white limestone.",
  "Cats were considered sacred and bringing harm to one was a serious crime."
];

function CinematicLoading() {
  const [progress, setProgress] = useState(0);
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => (p < 100 ? p + 2 : p));
    }, 100);
    const factTimer = setInterval(() => {
      setFactIndex(i => (i + 1) % FUN_FACTS.length);
    }, 3000);
    return () => { clearInterval(timer); clearInterval(factTimer); };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#030712]/95 backdrop-blur-xl z-[200] flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full relative z-10">
        <h2 className="text-3xl font-bold text-[#C9A84C] mb-8 text-center animate-pulse">Crafting Your Legend...</h2>
        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-6 relative">
          <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#C9A84C] to-[#E2CB85] transition-all duration-100 ease-linear shadow-[0_0_15px_rgba(201,168,76,0.8)]" style={{ width: \`\${progress}%\` }} />
        </div>
        <p className="text-white/80 text-center text-sm min-h-[40px] italic transition-opacity duration-500">
          "{FUN_FACTS[factIndex]}"
        </p>
      </div>
    </div>
  );
}
`;
content = content.replace(/function LoadingAnimation\(\{(.*?)\}\) \{[\s\S]*?(?=\/\* ───)/, cinematicLoading + '\n');
content = content.replace(/<LoadingAnimation \/>/, '<CinematicLoading />');

// 3. Inject TripAssistant Component at the end of the file, right before export or at the bottom
const tripAssistant = `
function TripAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ role: 'ai', text: 'Hi! I am your EgyptX Trip Assistant. Need to change anything?' }]);
  const [input, setInput] = useState('');

  const sendMsg = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMsgs([...msgs, { role: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: 'ai', text: 'I have noted your request and will adjust the itinerary!' }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-[#0A1628]/95 backdrop-blur-xl border border-[#C9A84C]/30 w-80 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-96">
          <div className="bg-[#C9A84C]/10 border-b border-[#C9A84C]/20 p-3 flex justify-between items-center">
            <span className="font-bold text-[#C9A84C]">✨ Trip Assistant</span>
            <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">✕</button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {msgs.map((m, i) => (
              <div key={i} className={\`p-2 rounded-lg text-sm \${m.role === 'ai' ? 'bg-white/5 text-white/90 mr-8' : 'bg-[#C9A84C]/20 text-[#C9A84C] ml-8'}\`}>
                {m.text}
              </div>
            ))}
          </div>
          <form onSubmit={sendMsg} className="p-3 border-t border-white/10 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Modify trip..." className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
          </form>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="w-14 h-14 bg-gradient-to-r from-[#C9A84C] to-[#E2CB85] rounded-full flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(201,168,76,0.4)] hover:scale-110 transition-transform">
          💬
        </button>
      )}
    </div>
  );
}
`;
content = content.replace(/export default function PlannerContent\(\) \{/, tripAssistant + '\nexport default function PlannerContent() {');

// Also inject <TripAssistant /> inside the main return before closing </div>
content = content.replace(/<\/AnimatePresence>\s*<\/div>\s*<\/div>\s*\);\s*\}\s*$/g, '</AnimatePresence>\n      <TripAssistant />\n      </div>\n    </div>\n  );\n}\n');

// 4. Wizard UI replacement
const wizardUI = `
            <motion.div
              key="wizard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-[#0A1628]/60 backdrop-blur-md rounded-3xl p-6 md:p-10 border border-[#C9A84C]/10"
            >
              {/* Wizard Progress */}
              <div className="flex justify-between items-center mb-8 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 z-0">
                  <div className="h-full bg-[#C9A84C] transition-all duration-300" style={{ width: \`\${((step - 1) / 3) * 100}%\` }} />
                </div>
                {[1,2,3,4].map(s => (
                  <div key={s} className={\`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors \${step >= s ? 'bg-[#C9A84C] text-[#030712]' : 'bg-[#060E1A] text-white/40 border border-white/20'}\`}>
                    {s}
                  </div>
                ))}
              </div>

              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white mb-4">Step 1: Your Travel Group</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {getTravelStyles(t).map(s => {
                    const active = travelStyle === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => handleTravelStyleChange(s.id)}
                        className={\`flex flex-col items-center p-5 rounded-xl border transition-all duration-200 \${
                          active
                            ? 'bg-[#C9A84C]/15 border-[#C9A84C] shadow-[0_0_20px_rgba(201,168,76,0.1)]'
                            : 'bg-white/5 border-white/10 hover:border-white/25'
                        }\`}
                      >
                        <span className="text-3xl mb-2">{s.emoji}</span>
                        <span className={\`font-semibold text-sm \${active ? 'text-[#C9A84C]' : 'text-white/80'}\`}>{s.label}</span>
                      </button>
                    );
                  })}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white/70 mb-3">Number of Travelers</label>
                    <input type="number" min="1" max="50" value={travelers} onChange={(e) => setTravelers(Number(e.target.value))} className="w-full max-w-xs bg-[#060E1A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C]/50" />
                  </div>
                  <div className="flex justify-end pt-4"><button onClick={() => setStep(2)} disabled={!travelStyle} className="px-6 py-2 bg-[#C9A84C] text-[#030712] font-bold rounded-xl disabled:opacity-50">Next →</button></div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white mb-4">Step 2: When are you going?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-white/70 mb-2">Start Date</label>
                      <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-[#060E1A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C]/50" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white/70 mb-2">End Date (Calculates Duration)</label>
                      <input type="date" value={endDate} onChange={e => {
                        setEndDate(e.target.value);
                        if(startDate && e.target.value) {
                          const diff = (new Date(e.target.value) - new Date(startDate)) / (1000 * 60 * 60 * 24);
                          if(diff > 0) setDuration(Math.min(Math.max(diff, 1), 14));
                        }
                      }} className="w-full bg-[#060E1A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C]/50" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-white/70 mb-2">Country of Origin</label>
                    <select value={country} onChange={e => setCountry(e.target.value)} className="w-full bg-[#060E1A] border border-white/10 rounded-lg px-4 py-3 text-white">
                      <option value="">Select Country</option>
                      {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
                    </select>
                  </div>
                  <div className="flex justify-between pt-4">
                    <button onClick={() => setStep(1)} className="px-6 py-2 border border-white/20 text-white rounded-xl">← Back</button>
                    <button onClick={() => setStep(3)} disabled={!startDate || !endDate || !country} className="px-6 py-2 bg-[#C9A84C] text-[#030712] font-bold rounded-xl disabled:opacity-50">Next →</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white mb-4">Step 3: Top Destinations</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Cairo', 'Luxor', 'Aswan', 'Alexandria', 'Hurghada', 'Sharm El Sheikh'].map(city => {
                      const active = destinations.includes(city);
                      return (
                        <div key={city} onClick={() => setDestinations(d => active ? d.filter(x=>x!==city) : [...d, city])} className={\`cursor-pointer p-4 rounded-xl border flex items-center justify-center text-center font-semibold transition-all \${active ? 'bg-[#C9A84C]/20 border-[#C9A84C] text-[#C9A84C] shadow-[0_0_15px_rgba(201,168,76,0.2)]' : 'bg-[#060E1A] border-white/10 text-white/60'}\`}>
                          {city}
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex justify-between pt-4">
                    <button onClick={() => setStep(2)} className="px-6 py-2 border border-white/20 text-white rounded-xl">← Back</button>
                    <button onClick={() => setStep(4)} disabled={destinations.length===0} className="px-6 py-2 bg-[#C9A84C] text-[#030712] font-bold rounded-xl disabled:opacity-50">Next →</button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white mb-4">Step 4: Interests & Pace</h3>
                  <div>
                    <label className="block text-sm font-semibold text-white/70 mb-4">Interests</label>
                    <div className="flex flex-wrap gap-3">
                      {getInterests(t).map(i => {
                        const active = interests.includes(i.id);
                        return (
                          <button key={i.id} onClick={() => toggleInterest(i.id)} className={\`px-5 py-3 rounded-xl border text-sm font-medium transition-all \${active ? 'bg-[#C9A84C]/20 border-[#C9A84C] text-[#C9A84C]' : 'bg-white/5 border-white/10 text-white/60'}\`}>
                            {i.emoji} {i.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-white/70 mb-2">Pace</label>
                    <select value={pace} onChange={e => setPace(e.target.value)} className="w-full bg-[#060E1A] border border-white/10 rounded-lg px-4 py-3 text-white">
                      {getPaces(t).map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                    </select>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-white/70 mb-2">Total Budget</label>
                    <input type="text" value={budget} onChange={e => setBudget(e.target.value)} placeholder="e.g. $2000" className="w-full bg-[#060E1A] border border-white/10 rounded-lg px-4 py-3 text-white" />
                  </div>
                  <div className="flex justify-between pt-4">
                    <button onClick={() => setStep(3)} className="px-6 py-2 border border-white/20 text-white rounded-xl">← Back</button>
                    <button onClick={handleGenerate} disabled={!isFormValid} className="px-8 py-3 bg-gradient-to-r from-[#C9A84C] to-[#E2CB85] text-[#030712] font-bold rounded-xl shadow-[0_0_20px_rgba(201,168,76,0.4)] disabled:opacity-50">✨ Generate Itinerary</button>
                  </div>
                </div>
              )}
            </motion.div>
`;
const oldFormRegex = /<motion\.div\s*key="form"[\s\S]*?<\/motion\.div>\s*/;
content = content.replace(oldFormRegex, wizardUI + '\n');

// 5. Advanced Timeline Badges between locations
const advancedTimelineReplacement = `
                        {day.activities.map((act, actIdx) => (
                          <React.Fragment key={actIdx}>
                            {actIdx > 0 && (
                              <div className="ml-1 pl-4 border-l border-dashed border-[#C9A84C]/30 py-2">
                                <span className="inline-flex items-center gap-1 bg-[#0A1628] border border-[#C9A84C]/20 text-[#C9A84C] text-[10px] px-2 py-1 rounded-md shadow-sm">
                                  {actIdx % 2 === 0 ? '🚶 Walking - 15 min' : '🚗 Taxi - 30 min'}
                                </span>
                              </div>
                            )}
                            <div className="flex gap-4 py-3 group">
`;
content = content.replace(/\{day\.activities\.map\(\(act, actIdx\) => \([\s\S]*?className="flex gap-4 py-3 group"\s*>/, advancedTimelineReplacement);
content = content.replace(/\{act\.description\}<\/p>\s*<\/div>\s*<\/div>\s*\)\)\}/, '{act.description}</p>\n                            </div>\n                          </div>\n                          </React.Fragment>\n                        ))}');

// 6. Update API payload to include destinations
content = content.replace(/routePreference\s*\n\s*\}\);/g, "routePreference,\n    destinations\n  });");

fs.writeFileSync(file, content, 'utf8');
console.log('Update successful');
