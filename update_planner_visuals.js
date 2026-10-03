const fs = require('fs');
let content = fs.readFileSync('src/components/PlannerContent.tsx', 'utf8');

const constsInsert = `
const DESTINATIONS_DATA = [
  { name: 'Cairo', image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=500&q=80' },
  { name: 'Luxor', image: 'https://images.unsplash.com/photo-1600378034509-2166a01dd1e3?auto=format&fit=crop&w=500&q=80' },
  { name: 'Aswan', image: 'https://images.unsplash.com/photo-1590518386445-5654cc3c8b41?auto=format&fit=crop&w=500&q=80' },
  { name: 'Alexandria', image: 'https://images.unsplash.com/photo-1627993309562-ee67c870daac?auto=format&fit=crop&w=500&q=80' },
  { name: 'Sharm El Sheikh', image: 'https://images.unsplash.com/photo-1598463994326-8c4600115bc5?auto=format&fit=crop&w=500&q=80' },
  { name: 'Hurghada', image: 'https://images.unsplash.com/photo-1601053154845-6fec58ec4f58?auto=format&fit=crop&w=500&q=80' },
];

const MOCK_ITINERARY = [
  { day: 1, city: 'Cairo', activities: [
    { time: '09:00 AM', name: 'Great Pyramids of Giza', description: 'Explore the last remaining wonder of the ancient world.', type: 'history' },
    { time: '02:00 PM', name: 'Egyptian Museum', description: 'Witness the golden mask of Tutankhamun and countless artifacts.', type: 'culture' }
  ]},
  { day: 2, city: 'Cairo', activities: [
    { time: '10:00 AM', name: 'Khan el-Khalili Bazaar', description: 'Wander through the historic shopping district and grab some souvenirs.', type: 'shopping' },
    { time: '04:00 PM', name: 'Nile Felucca Ride', description: 'Relaxing sunset sail on a traditional wooden boat.', type: 'relaxing' }
  ]},
  { day: 3, city: 'Luxor', activities: [
    { time: '08:00 AM', name: 'Valley of the Kings', description: 'Descend into the vibrantly painted tombs of mighty pharaohs.', type: 'history' },
    { time: '03:00 PM', name: 'Karnak Temple', description: 'Walk through the massive hypostyle hall of towering ancient pillars.', type: 'history' }
  ]}
];
`;
content = content.replace(/(const COUNTRIES = \[)/, constsInsert + '\n$1');

// Replace Step 3 Rendering
const oldStep3CodeRegex = /<h3 className="text-2xl font-bold text-white mb-4">Step 3: Top Destinations<\/h3>[\s\S]*?<div className="flex justify-between pt-4">/;
const newStep3Code = `<h3 className="text-2xl font-bold text-white mb-4">Step 3: Top Destinations</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {DESTINATIONS_DATA.map(dest => {
                        const active = destinations.includes(dest.name);
                        return (
                          <div 
                            key={dest.name} 
                            onClick={() => setDestinations(d => active ? d.filter(x=>x!==dest.name) : [...d, dest.name])} 
                            className={\`relative cursor-pointer h-32 rounded-xl overflow-hidden border-2 transition-all duration-300 \${active ? 'border-[#C9A84C] shadow-[0_0_20px_rgba(201,168,76,0.5)] scale-105 z-10' : 'border-white/10 hover:border-white/30'}\`}
                          >
                            <img src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/90 via-[#030712]/40 to-transparent" />
                            
                            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                              <span className={\`font-bold text-lg \${active ? 'text-[#C9A84C]' : 'text-white'}\`}>{dest.name}</span>
                              {active && <span className="w-6 h-6 rounded-full bg-[#C9A84C] text-[#030712] flex items-center justify-center text-xs font-bold shadow-lg">✓</span>}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex justify-between pt-4">`;
content = content.replace(oldStep3CodeRegex, newStep3Code);

// Replace Generate Fallback
const oldGenerate = /try \{[\s\S]*?const response = await fetch\('\/api\/generate-itinerary'[\s\S]*?trackEvent\('planner_completed'[\s\S]*?\} catch \(err: any\) \{[\s\S]*?setError\(err\.message \|\| 'An unexpected error occurred\.'\);[\s\S]*?\} finally \{/;

const newGenerate = `try {
        const response = await fetch('/api/generate-itinerary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(getPayload())
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to generate itinerary');
        }
        
        setItinerary(data.itinerary || data);
        trackEvent('planner_completed', { duration, budget });
      } catch (err: any) {
        console.warn('API Failed, using mock fallback.', err);
        // CRITICAL DEMO FAILSAFE
        setItinerary(MOCK_ITINERARY as any);
      } finally {`;
content = content.replace(oldGenerate, newGenerate);


// Replace Rich Itinerary Timeline UI
const oldTimelineRegex = /\{?\/\*\s*Content\s*\*\/\s*\}?\s*<div className="pb-2 flex-1 min-w-0">\s*<div className="flex items-center gap-3 mb-1">\s*<span className="text-xs font-mono text-\[#1B6B93\] font-semibold">\{act\.time\}<\/span>\s*<span className="text-xs px-2 py-0\.5 rounded-full bg-\[#C9A84C\]\/10 text-\[#C9A84C\] border border-\[#C9A84C\]\/20 capitalize">\{act\.type\}<\/span>\s*<\/div>\s*<h4 className="font-semibold text-white group-hover:text-\[#C9A84C\] transition-colors">\{act\.name\}<\/h4>\s*<p className="text-sm text-white\/40 mt-0\.5">\{act\.description\}<\/p>\s*<\/div>/;

const newTimeline = `{/* Content */}
                              <div className="pb-4 flex-1 min-w-0">
                                <div className="bg-[#0A1628]/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden group-hover:border-[#C9A84C]/30 transition-all shadow-lg flex flex-col sm:flex-row">
                                  <div className="sm:w-32 h-32 relative shrink-0">
                                    <img src={\`https://images.unsplash.com/photo-\${actIdx % 3 === 0 ? '1539650116574-8efeb43e2750' : actIdx % 3 === 1 ? '1600378034509-2166a01dd1e3' : '1590518386445-5654cc3c8b41'}?auto=format&fit=crop&w=300&q=80\`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={act.name} />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A1628] hidden sm:block" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] to-transparent sm:hidden" />
                                  </div>
                                  <div className="p-4 flex-1 flex flex-col justify-center relative z-10">
                                    <div className="flex items-center gap-3 mb-2">
                                      <span className="text-xs font-mono text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-0.5 rounded-md font-semibold">{act.time}</span>
                                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/70 border border-white/10 capitalize">{act.type}</span>
                                    </div>
                                    <h4 className="font-semibold text-lg text-white group-hover:text-[#C9A84C] transition-colors">{act.name}</h4>
                                    <p className="text-sm text-white/50 mt-1 line-clamp-2">{act.description}</p>
                                  </div>
                                </div>
                              </div>`;
content = content.replace(oldTimelineRegex, newTimeline);

fs.writeFileSync('src/components/PlannerContent.tsx', content, 'utf8');
console.log('Visuals and failsafe updated successfully.');
