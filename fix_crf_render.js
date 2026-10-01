const fs = require('fs');
let crf = fs.readFileSync('src/components/CraftsContent.tsx', 'utf8');

crf = crf.replace(
  /<button\s+key=\{category.id\}\s+onClick=\{\(\) => setActiveCategory\(category.id\)\}\s+className=\{`px-6 py-2 rounded-full border transition-all duration-300 \$\{\s+activeCategory === category.id\s+\? 'bg-\[\#C9A84C\] text-\[\#030712\] border-\[\#C9A84C\] font-semibold'\s+: 'bg-white\/5 text-gray-300 border-\[\#C9A84C\]\/30 hover:border-\[\#C9A84C\] hover:text-white'\s+\}`\}\s*>\s*\{category\}\s*<\/button>/g,
  "<button key={category.id} onClick={() => setActiveCategory(category.id)} className={`px-6 py-2 rounded-full border transition-all duration-300 ${activeCategory === category.id ? 'bg-[#C9A84C] text-[#030712] border-[#C9A84C] font-semibold' : 'bg-white/5 text-gray-300 border-[#C9A84C]/30 hover:border-[#C9A84C] hover:text-white'}`}>{category.label}</button>"
);

// Fallback in case regex doesn't match perfectly
crf = crf.replace(/>\s*\{category\}\s*<\/button>/g, ">{category.label}</button>");

fs.writeFileSync('src/components/CraftsContent.tsx', crf);
console.log("Fixed rendering category label in CraftsContent");
