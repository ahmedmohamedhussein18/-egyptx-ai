const fs = require('fs');
let c = fs.readFileSync('src/components/PlannerContent.tsx', 'utf8');

// 1. Remove ScramblerText
c = c.replace(/const ScramblerText = \(\{ text, className \}[\s\S]*?return <span className=\{className\}>\{display\}<\/span>;\n\}\n\n/, '');

// 2. Update LOADING_TEXTS
const oldLoadingTexts = /const LOADING_TEXTS = \[\s*\"CONSULTING THE PHARAOHS\.\.\.\",\s*\"MAPPING ANCIENT ROUTES\.\.\.\",\s*\"ALIGNING THE STARS\.\.\.\",\s*\"TRANSLATING HIEROGLYPHS\.\.\.\",\s*\"SUMMONING THE WINDS OF THE NILE\.\.\.\"\s*\];/;
const newLoadingTexts = `const LOADING_TEXTS = [
  "Consulting the Pharaohs...",
  "Mapping Ancient Routes...",
  "Curating Your Journey...",
  "Preparing Your Egyptian Adventure..."
];`;
c = c.replace(oldLoadingTexts, newLoadingTexts);

// 3. Update Interval (3000 -> 2000)
c = c.replace(/const textTimer = setInterval\(\(\) => \{\n\s*setTextIdx\(i => \(i \+ 1\) % LOADING_TEXTS\.length\);\n\s*\}, 3000\);/, 
              `const textTimer = setInterval(() => {\n      setTextIdx(i => (i + 1) % LOADING_TEXTS.length);\n    }, 2000);`);

// 4. Update the h2 element rendering the text
const oldH2Regex = /<h2 className="text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-\[#C9A84C\] via-\[#E2CB85\] to-\[#C9A84C\] mb-8 tracking-\[0\.2em\] uppercase text-center min-h-\[40px\] drop-shadow-md">\s*<ScramblerText key=\{textIdx\} text=\{LOADING_TEXTS\[textIdx\]\} \/>\s*<\/h2>/;
const newH2 = `<div className="mb-8 min-h-[40px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.h2 
              key={textIdx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-xl md:text-3xl font-sans font-semibold text-[#D4AF37] text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              style={{ textShadow: '0 0 10px rgba(212,175,55,0.4)' }}
            >
              {LOADING_TEXTS[textIdx]}
            </motion.h2>
          </AnimatePresence>
        </div>`;
c = c.replace(oldH2Regex, newH2);

// 5. Update the small bottom text if it still uses ScramblerText
c = c.replace(/<ScramblerText text="DECRYPTING ANCIENT ROUTES" \/>/, 'DECRYPTING ANCIENT ROUTES');


fs.writeFileSync('src/components/PlannerContent.tsx', c);
console.log('Done replacing Scrambler with Carousel');
