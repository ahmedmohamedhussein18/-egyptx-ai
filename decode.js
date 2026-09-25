const fs = require('fs');

const b64 = (str) => Buffer.from(str, 'base64').toString('utf8');

// The original file from git (which has proper old Arabic and emojis)
let file = fs.readFileSync('passport_temp.txt', 'utf8');

// 1. Replace the top summary text
// From: {totalStamps} زيارات موثقة | {explored.length} مستكشف رقمياً
// Note: Since we don't want to type Arabic in regex, we can match the exact structure
file = file.replace(/\{totalStamps\}[^|]+\|\s*\{explored\.length\}[^<]+<\/p>/, 
  `{totalStamps} ${b64('2LLZitin2LHYp9iqINmF2YjYqtmC2Kk=')} | {explored.length} ${b64('2LHYrdmE2KfYqiDZhdiu2LfZh9ip')}</p>`);

// 2. Replace the Visited Places header
// From: <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Visited Places</h2>
file = file.replace(/<h2 className="text-2xl font-bold text-white uppercase tracking-wider">Visited Places<\/h2>/,
  `<h2 className="text-2xl font-bold text-white uppercase tracking-wider" dir="rtl">${b64('2LLZitin2LHYp9iqINmF2YjYqtmC2Kk=')}</h2>`);

// 3. Replace the VISITED ✓ badge
// From: <div className="text-[10px] font-black text-[#C9A84C] my-0.5 tracking-wider uppercase bg-[#C9A84C]/10 px-1.5 py-0.5 rounded-sm border border-[#C9A84C]/40 transform -rotate-6">\n                    VISITED ✓\n                  </div>
file = file.replace(/<div className="text-\[10px\] font-black text-\[#C9A84C\] my-0\.5 tracking-wider uppercase bg-\[#C9A84C\]\/10 px-1\.5 py-0\.5 rounded-sm border border-\[#C9A84C\]\/40 transform -rotate-6">\s*VISITED [^\n<]+\s*<\/div>/,
  `<div className="text-[10px] font-black text-[#030712] my-0.5 tracking-wider uppercase bg-[#C9A84C] px-1.5 py-0.5 rounded-sm border border-[#C9A84C]/40 transform -rotate-6" dir="rtl">
                    ${b64('2LLZitin2LHYqSDZhdmI2KvZgtipINio24AgUVI=')}
                  </div>`);

// 4. Replace the ENTIRE Explored Online section with the new Planned Trips section
const newSection = `
        {/* Planned Trips (AI Planner) */}
        {explored.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Compass className="w-6 h-6 text-[#C9A84C]" />
              <h2 className="text-2xl font-bold text-[#C9A84C] uppercase tracking-wider" dir="rtl">${b64('2LHYrdmE2KfYqtmKINin2YTZhdiu2LfZh9ipIChQbGFubmVkIFRyaXBzKQ==')}</h2>
              <div className="h-px bg-white/10 flex-1 ml-4" />
            </div>
            <p className="text-sm text-gray-400 mb-8 text-right" dir="rtl">
              ${b64('2KfZhNiy24zYp9ix2KfYqiDYp9mE2YXZiNir2YLYqSDYqtiq2LfZhNioINmF2LPYrSBRUiBDb2RlINmB24wg2KfZhNmF2YjZgti5INin2YTZgdi52YTZjS4g2KfZhNix2K3ZhNin2Kog2KfZhNmF2K7Yt9i32Kkg2YfYjCDYsdit2YTYp9iqINij2YbYtNij2KrZh9inINio2KfZhNiw2YPYp9ihINin2YTYp9i12LfZhtin2LnZiC4=')}
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 justify-items-center">
              {explored.map((stamp, index) => (
                <motion.div
                  key={stamp.id}
                  initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
                  animate={{ opacity: 1, scale: 1, rotate: stamp.angle }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                  className="w-36 h-36 rounded-full border-[2px] border-solid border-[#C9A84C]/50 flex flex-col items-center justify-center p-2 relative group hover:border-[#C9A84C] transition-colors bg-[#0A1628]/20"
                >
                  <span className="text-[10px] font-bold text-gray-300 text-center leading-tight uppercase px-1">
                    📍 {stamp.name}
                  </span>
                  <div className="text-[9px] font-bold text-[#C9A84C] my-0.5 tracking-wider uppercase px-1.5 py-0.5 mt-1 border border-[#C9A84C]/40 rounded bg-white/5 flex items-center gap-1">
                    <span>🌍</span> {stamp.country}
                  </div>
                  <div className="text-[9px] font-bold text-white/80 my-0.5 tracking-wider uppercase px-1.5 py-0.5 border border-white/20 rounded bg-white/5 flex items-center gap-1">
                    <span>📅</span> {stamp.duration} ${b64('2KPZitin2YU=')}
                  </div>
                  <span className="text-[7px] font-mono text-gray-500 uppercase mt-1">
                    {stamp.date}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
`;

file = file.replace(/\{\/\* Explored Online \(AI Planner\) \*\/\}.*?\{\/\* Achievements \/ Badges \*\/\}/s, newSection + '\n        {/* Achievements / Badges */}');

fs.writeFileSync('src/components/TouristPassportContent.tsx', file);
console.log('Successfully wrote decoded utf-8 content.');
