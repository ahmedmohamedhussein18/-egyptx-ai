const fs = require('fs');
let c = fs.readFileSync('src/components/PlannerContent.tsx', 'utf8');

// 1. Rename HieroglyphText to ScramblerText and make it a cyber-scrambler
const scramblerText = `const ScramblerText = ({ text, className }: { text: string, className?: string }) => {
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
}`;
c = c.replace(/const HieroglyphText = \(\{ text, className \}[\s\S]*?return <span className=\{className\}>\{display\}<\/span>;\n\}/, scramblerText);
c = c.replace(/<HieroglyphText /g, '<ScramblerText ');

// 2. Map Fix: Use destinations instead of itinerary cities to guarantee map reflects user input
c = c.replace(
  '<EgyptMap cities={itinerary.map(d => d.city)} />',
  '<EgyptMap cities={destinations.length > 0 ? destinations : itinerary.map(d => d.city)} />'
);

// 3. Pyramid Aesthetics
const newPyramidCSS = `@keyframes pulseGlow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.4)); transform: scale(1); }
          50% { filter: drop-shadow(0 0 50px rgba(212, 175, 55, 0.6)); transform: scale(1.05); }
        }`;
c = c.replace(/@keyframes pulseGlow \{[\s\S]*?transform: scale\(1\.05\); \}\n\s*\}/, newPyramidCSS);

// Progress Bar width transition
c = c.replace('transition-[width] duration-300 ease-out shadow-[0_0_20px_rgba(201,168,76,1)]', 'transition-[width] duration-[400ms] ease-out shadow-[0_0_20px_rgba(201,168,76,1)]');


// 4. ActivityCard fixes: State for imgError, backdrop-filter, border
const cardStartRegex = /const ActivityCard = \(\{ act, actIdx, dayIdx \}: \{ act: Activity, actIdx: number, dayIdx: number \}\) => \{/;
const cardStartReplacement = `const ActivityCard = ({ act, actIdx, dayIdx }: { act: Activity, actIdx: number, dayIdx: number }) => {
  const [imgError, setImgError] = React.useState(false);`;
c = c.replace(cardStartRegex, cardStartReplacement);

const oldImgContainerRegex = /<div className="sm:w-56 h-56 sm:h-auto relative shrink-0 overflow-hidden">[\s\S]*?<div className="absolute top-3 left-3 bg-\[#030712\]\/90 backdrop-blur-md text-\[#E2CB85\] px-3 py-1\.5 rounded-lg text-xs font-bold border border-\[#C9A84C\]\/40 shadow-lg flex items-center gap-2">\s*⏱ \{act\.time\}\s*<\/div>\s*<\/div>/;
const newImgContainer = `<div className="sm:w-56 h-56 sm:h-auto relative shrink-0 overflow-hidden">
              {imgError ? (
                <div className="w-full h-full bg-gradient-to-br from-[#D4AF37]/40 to-[#0A1628] flex items-center justify-center">
                  <span className="text-[#D4AF37] opacity-50 text-4xl">🏛️</span>
                </div>
              ) : (
                <img 
                  src={\`https://images.unsplash.com/photo-\${actIdx % 3 === 0 ? '1539650116574-8efeb43e2750' : actIdx % 3 === 1 ? '1600378034509-2166a01dd1e3' : '1590518386445-5654cc3c8b41'}?auto=format&fit=crop&w=500&q=80\`} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.08] filter group-hover:brightness-110" 
                  alt={act.name} 
                  onError={() => setImgError(true)}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/20 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-[#0A1628]" />
              
              <div className="absolute top-3 left-3 bg-[#030712]/90 backdrop-blur-md text-[#E2CB85] px-3 py-1.5 rounded-lg text-xs font-bold border border-[#C9A84C]/40 shadow-lg flex items-center gap-2">
                ⏱ {act.time}
              </div>
            </div>`;
c = c.replace(oldImgContainerRegex, newImgContainer);

// Ensure exact CSS string styling for the card container
const oldCardClasses = `className="relative bg-[#0A1628]/70 backdrop-blur-[12px] border border-[#D4AF37]/20 rounded-2xl overflow-hidden group-hover:border-[#C9A84C]/50 transition-[border,box-shadow] shadow-[0_10px_40px_rgb(0,0,0,0.6)] flex flex-col sm:flex-row will-change-transform"`;
const newCardClasses = `className="relative bg-[#0A1628]/70 rounded-2xl overflow-hidden group-hover:border-[#C9A84C]/50 transition-[border,box-shadow] shadow-[0_10px_40px_rgb(0,0,0,0.6)] flex flex-col sm:flex-row will-change-transform" style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255, 215, 0, 0.15)', transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)' }}`;

// Wait, the previous style had style={{ transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
// I'll replace the whole opening div string.
const oldDivStr = /<div\s*ref=\{cardRef\}\s*className="relative bg-\[#0A1628\]\/70 backdrop-blur-\[12px\] border border-\[#D4AF37\]\/20 rounded-2xl overflow-hidden group-hover:border-\[#C9A84C\]\/50 transition-\[border,box-shadow\] shadow-\[0_10px_40px_rgb\(0,0,0,0\.6\)\] flex flex-col sm:flex-row will-change-transform"\s*style=\{\{ transition: 'transform 0\.2s cubic-bezier\(0\.2, 0\.8, 0\.2, 1\)' \}\}>/;

const newDivStr = `<div 
            ref={cardRef} 
            className="relative bg-[#0A1628]/70 rounded-2xl overflow-hidden group-hover:border-[#C9A84C]/50 transition-[border,box-shadow] shadow-[0_10px_40px_rgb(0,0,0,0.6)] flex flex-col sm:flex-row will-change-transform"
            style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255, 215, 0, 0.15)', transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
          >`;
c = c.replace(oldDivStr, newDivStr);

fs.writeFileSync('src/components/PlannerContent.tsx', c);
console.log('Final fixes applied!');
