const fs = require('fs');
let c = fs.readFileSync('src/components/PlannerContent.tsx', 'utf8');

// MAP FIXES
// 1. Remove the static blue path
c = c.replace(/<path\n\s*d="M195 130 Q200 160 205 200 Q210 240 205 270 Q200 310 210 350 Q215 380 195 430"[\s\S]*?\/>/, '');

// 2. Modify EgyptMap to include generateCurvedPath and update route-path-anim to render BEFORE markers but change polyline to path
const oldEgyptMapStart = /function EgyptMap\(\{ cities \}: \{ cities: string\[\] \}\) \{\n\s*const uniqueCities = \[\.\.\.new Set\(cities\)\];\n\s*const routePoints = cities\.map\(c => CITY_COORDS\[c\]\)\.filter\(Boolean\);\n\s*const routePath = routePoints\.map\(p => \`\$\{p\.x\},\$\{p\.y\}\`\)\.join\(' '\);/;

const newEgyptMapStart = `function EgyptMap({ cities }: { cities: string[] }) {
  const uniqueCities = [...new Set(cities)];
  
  const routePoints = cities.map(c => CITY_COORDS[c]).filter(Boolean);
  
  const generateCurvedPath = (points: {x: number, y: number}[]) => {
    if (points.length === 0) return '';
    if (points.length === 1) return '';
    let d = \`M \${points[0].x},\${points[0].y}\`;
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const dx = p1.x - p0.x;
      const dy = p1.y - p0.y;
      const cx = p0.x + dx / 2 - dy * 0.15;
      const cy = p0.y + dy / 2 + dx * 0.15;
      d += \` Q \${cx},\${cy} \${p1.x},\${p1.y}\`;
    }
    return d;
  };
  
  const routePathD = generateCurvedPath(routePoints);`;

c = c.replace(oldEgyptMapStart, newEgyptMapStart);

// Replace polyline with path
const oldPolyline = /\{routePoints\.length > 1 && \(\n\s*<polyline\n\s*points=\{routePath\}\n\s*fill="none"\n\s*stroke="url\(#routeGradient\)"\n\s*strokeWidth="3"\n\s*strokeLinecap="round"\n\s*strokeLinejoin="round"\n\s*className="route-path-anim"\n\s*\/>\n\s*\)\}/;

const newPath = `{routePoints.length > 1 && (
        <path
          d={routePathD}
          fill="none"
          stroke="url(#routeGradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="route-path-anim"
        />
      )}`;

c = c.replace(oldPolyline, newPath);

// Move text up by changing y={coords.y - 18} to y={coords.y - 25}
c = c.replace(/y=\{coords\.y - 18\}/g, 'y={coords.y - 25}');


// LOADING SCREEN FIXES (Remove number flicker)
const oldFlicker = /React\.useEffect\(\(\) => \{\n\s*if \(progress >= 100\) \{\n\s*setDisplayProgress\("100"\);\n\s*return;\n\s*\}\n\s*const flicker = setInterval\(\(\) => \{\n\s*if \(Math\.random\(\) > 0\.4\) \{\n\s*setDisplayProgress\(Math\.floor\(Math\.random\(\) \* 100\)\.toString\(\)\.padStart\(2, '0'\)\);\n\s*\} else \{\n\s*setDisplayProgress\(progress\.toString\(\)\.padStart\(2, '0'\)\);\n\s*\}\n\s*\}, 40\);\n\s*return \(\) => clearInterval\(flicker\);\n\s*\}, \[progress\]\);/;

const newNoFlicker = `React.useEffect(() => {
    setDisplayProgress(progress.toString().padStart(2, '0'));
  }, [progress]);`;

c = c.replace(oldFlicker, newNoFlicker);

fs.writeFileSync('src/components/PlannerContent.tsx', c);
console.log('Fixed Ghost Path, Curved Routes, and Loading Numbers');
