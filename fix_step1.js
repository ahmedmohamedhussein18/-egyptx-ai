const fs = require('fs');
let content = fs.readFileSync('src/components/PlannerContent.tsx', 'utf8');

// 1. Fix state
content = content.replace(/const \[travelStyle, setTravelStyle\] = useState\(''\);/, 'const [travelStyle, setTravelStyle] = useState<string | null>(null);');

// 2. Fix handleTravelStyleChange (prevent SSR hydration mismatch and ReferenceErrors)
const oldHandler = /const handleTravelStyleChange = \(id: string\) => \{[\s\S]*?setTravelStyle\(id\);\s*\};/;
const newHandler = `const handleTravelStyleChange = (id: string) => {
    if (id === 'family') {
      const verified = typeof window !== 'undefined' ? sessionStorage.getItem('isParentVerified') : null;
      if (!verified) {
        setShowParentModal(true);
        return;
      }
    }
    setTravelStyle(id);
  };`;
content = content.replace(oldHandler, newHandler);

// 3. Fix map and active visual state
const oldMap = /\{getTravelStyles\(t\)\.map\(s => \{[\s\S]*?const active = travelStyle === s\.id;[\s\S]*?return \([\s\S]*?<button[\s\S]*?key=\{s\.id\}[\s\S]*?onClick=\{\(\) => handleTravelStyleChange\(s\.id\)\}[\s\S]*?className=\{`flex flex-col items-center p-5 rounded-xl border transition-all duration-200 \$\{[\s\S]*?active[\s\S]*?\? 'bg-\[#C9A84C\]\/15 border-\[#C9A84C\] shadow-\[0_0_20px_rgba\(201,168,76,0\.1\)\]'[\s\S]*?: 'bg-white\/5 border-white\/10 hover:border-white\/25'[\s\S]*?\}`\}[\s\S]*?>/;

const newMap = `{getTravelStyles(t).map(s => {
                      const active = travelStyle === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={(e) => { e.preventDefault(); handleTravelStyleChange(s.id); }}
                          className={\`flex flex-col items-center p-5 rounded-xl border transition-all duration-200 \${
                            active
                              ? 'bg-[#C9A84C]/25 border-[#C9A84C] shadow-[0_0_25px_rgba(201,168,76,0.4)] scale-[1.02]'
                              : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                          }\`}
                        >`;
content = content.replace(oldMap, newMap);

// 4. Fix next button in Step 1
const oldNext = /<button onClick=\{\(\) => setStep\(2\)\} disabled=\{!travelStyle\} className="px-6 py-2 bg-\[#C9A84C\] text-\[#030712\] font-bold rounded-xl disabled:opacity-50">Next →<\/button>/;
const newNext = `<button type="button" onClick={(e) => { e.preventDefault(); setStep(2); }} disabled={!travelStyle} className="px-6 py-2 bg-[#C9A84C] text-[#030712] font-bold rounded-xl disabled:opacity-50 hover:bg-[#E2CB85] transition-colors">Next →</button>`;
content = content.replace(oldNext, newNext);

fs.writeFileSync('src/components/PlannerContent.tsx', content, 'utf8');
console.log('Fixed PlannerContent step 1.');
