const fs = require('fs');

// 1. Update PlannerContent.tsx
let plannerContent = fs.readFileSync('src/components/PlannerContent.tsx', 'utf8');

// Update getPayload to include destinations
plannerContent = plannerContent.replace(
  'const getPayload = () => ({',
  'const getPayload = () => ({ destinations, routePreference: "shortest-distance",'
);

// Add all 20 CITY_COORDS to EgyptMap
const newCityCoords = `const CITY_COORDS: Record<string, { x: number; y: number }> = {
  'Cairo': { x: 165, y: 70 },
  'Giza': { x: 160, y: 75 },
  'Alexandria': { x: 125, y: 35 },
  'Luxor': { x: 210, y: 350 },
  'Aswan': { x: 220, y: 430 },
  'Hurghada': { x: 250, y: 220 },
  'Sharm El Sheikh': { x: 235, y: 170 },
  'Marsa Matrouh': { x: 60, y: 40 },
  'Fayoum': { x: 155, y: 110 },
  'Port Said': { x: 195, y: 40 },
  'Ismailia': { x: 190, y: 60 },
  'Suez': { x: 195, y: 80 },
  'Minya': { x: 160, y: 180 },
  'Assiut': { x: 170, y: 240 },
  'Sohag': { x: 185, y: 280 },
  'Qena': { x: 200, y: 320 },
  'Dahab': { x: 250, y: 150 },
  'Siwa Oasis': { x: 30, y: 120 },
  'North Coast': { x: 90, y: 35 },
  'Nuweiba': { x: 260, y: 130 },
};`;

plannerContent = plannerContent.replace(
  /const CITY_COORDS: Record<string, \{ x: number; y: number \}> = \{[\s\S]*?\};/,
  newCityCoords
);

// Update CinematicLoading (remove hieroglyphs, add matrix scramble + new pyramid)
const oldHieroglyph = /const HieroglyphText = \(\{ text, className \}: \{ text: string, className\?: string \}\) => \{[\s\S]*?return <span className=\{className\}>\{display\}<\/span>;\n\}/;
const newScramble = `const HieroglyphText = ({ text, className }: { text: string, className?: string }) => {
  const [display, setDisplay] = useState(text.replace(/./g, '0'));
  
  useEffect(() => {
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
}`;
plannerContent = plannerContent.replace(oldHieroglyph, newScramble);

// Update CinematicLoading visuals and width transition
const oldVisuals = /<style>\{\`[\s\S]*?<\/style>\s*<div className="relative z-10 flex flex-col items-center">[\s\S]*?<div className="w-48 h-48 mb-16 relative perspective-\[1000px\]">[\s\S]*?<\/div>\s*<h2/m;
const newVisuals = `<style>{\`
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

        <h2`;
plannerContent = plannerContent.replace(oldVisuals, newVisuals);

// Fix Progress Bar transition
plannerContent = plannerContent.replace(
  'transition-all duration-300 ease-out shadow-[0_0_20px_rgba(201,168,76,1)]',
  'transition-[width] duration-300 ease-out shadow-[0_0_20px_rgba(201,168,76,1)]'
);

// Update ActivityCard UI & Image Fallback
const oldImageRegex = /<img[\s\S]*?alt=\{act\.name\}\s*\/>/;
const newImage = `<img 
                src={\`https://images.unsplash.com/photo-\${actIdx % 3 === 0 ? '1539650116574-8efeb43e2750' : actIdx % 3 === 1 ? '1600378034509-2166a01dd1e3' : '1590518386445-5654cc3c8b41'}?auto=format&fit=crop&w=500&q=80\`} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.08] filter group-hover:brightness-110" 
                alt={act.name} 
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1590518386445-5654cc3c8b41?auto=format&fit=crop&w=500&q=80'; }}
              />`;
plannerContent = plannerContent.replace(oldImageRegex, newImage);

// Ensure the border and blur are applied
plannerContent = plannerContent.replace(
  'className="relative bg-[#0A1628]/80 backdrop-blur-2xl border border-white/10 rounded-2xl',
  'className="relative bg-[#0A1628]/70 backdrop-blur-[12px] border border-[#D4AF37]/20 rounded-2xl'
);


fs.writeFileSync('src/components/PlannerContent.tsx', plannerContent, 'utf8');


// 2. Update Route Map API
let apiContent = fs.readFileSync('src/app/api/generate-itinerary/route.ts', 'utf8');

// Extract destinations
apiContent = apiContent.replace(
  'routePreference,',
  'routePreference,\n      destinations,'
);

// Add strict constraint to prompt
const promptUpdate = `const destinationsConstraint = destinations && destinations.length > 0 ? destinations.join(', ') : '';

    const prompt = \`You are an expert Egypt travel planner. Create a realistic, day-by-day itinerary in Egypt for a traveler from \${country || 'abroad'}.
Trip Details:
- Duration: \${parsedDuration} days
- Budget: $\${budget} (Total for \${parsedTravelers} traveler(s). That's $\${(budget / parsedTravelers).toFixed(2)} per person. Keep this in mind!)
- Travelers: \${parsedTravelers}
- Interests: \${interestsString || 'general'}
- Travel Style: \${travelStyle || 'standard'}
- Pace: \${paceInstruction || 'Balanced pace.'}
\${accessibility ? \`- Accessibility Needs: \${accessibility}\` : ''}
\${avoidPlaces ? \`- Places to Avoid: \${avoidPlaces}\` : ''}
\${avoidCrowds ? \`- Preference: Avoid crowded places.\` : ''}
\${routePreference === 'shortest-distance' ? \`- Route Preference: Shortest distance between locations. Group nearby activities and cities.\` : ''}

CRITICAL DESTINATION CONSTRAINT:
You MUST ONLY generate itineraries and route stops for the user-selected destinations: \${destinationsConstraint || 'Cairo'}. Do not hallucinate or fallback to default destinations like Cairo/Luxor unless explicitly selected.\``;

apiContent = apiContent.replace(
  /const prompt = `You are an expert Egypt travel planner\. Create a realistic[\s\S]*?CRITICAL DESTINATION CONSTRAINT:[\s\S]*?unless explicitly selected.`/g,
  ''
);

apiContent = apiContent.replace(
  /const prompt = `You are an expert Egypt travel planner\. Create a realistic, day-by-day itinerary in Egypt for a traveler from \$\{country \|\| 'abroad'\}\.[\s\S]*?\$\{routePreference === 'shortest-distance' \? `- Route Preference: Shortest distance between locations\. Group nearby activities and cities\.` : ''\}/,
  promptUpdate
);


fs.writeFileSync('src/app/api/generate-itinerary/route.ts', apiContent, 'utf8');
console.log('Update done!');
