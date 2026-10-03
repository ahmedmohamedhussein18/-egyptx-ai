const fs = require('fs');
let c = fs.readFileSync('src/components/PlannerContent.tsx', 'utf8');

// I will just replace the corrupted chunk of EgyptMap
const corruptedChunkStart = "function EgyptMap({ cities }: { cities: string[] }) {";
const mainPageMarker = "/* 🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬 MAIN PAGE 🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬 */";

const fixedEgyptMap = `function EgyptMap({ cities }: { cities: string[] }) {
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
}

/* 🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬 MAIN PAGE 🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬🪬 */`;

const startIdx = c.indexOf(corruptedChunkStart);
// But wait, there are weird characters instead of 🪬 because of powershell printing? I will just use regex
const regex = /function EgyptMap\(\{ cities \}: \{ cities: string\[\] \}\) \{[\s\S]*?\/\*\s*[^\*]*MAIN PAGE[^\*]*\*\//;
c = c.replace(regex, fixedEgyptMap);

fs.writeFileSync('src/components/PlannerContent.tsx', c);
