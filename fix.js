const fs = require('fs');
let file = fs.readFileSync('src/components/TouristPassportContent.tsx', 'utf8');

file = file.replace(/<h2[^>]*?>\?\?\?\?\?\? \?\?\?\?\?<\/h2>/g, '<h2 className="text-2xl font-bold text-white uppercase tracking-wider" dir="rtl">زيارات موثقة</h2>');

file = file.replace(/<div className="text-\[10px\] font-black text-\[#C9A84C\] my-0\.5 tracking-wider uppercase bg-\[#C9A84C\]\/10 px-1\.5 py-0\.5 rounded-sm border border-\[#C9A84C\]\/40 transform -rotate-6">[\s\S]*?<\/div>/g, '<div className="text-[10px] font-black text-[#030712] my-0.5 tracking-wider uppercase bg-[#C9A84C] px-1.5 py-0.5 rounded-sm border border-[#C9A84C]/40 transform -rotate-6" dir="rtl">زيارة موثقة بـ QR</div>');

fs.writeFileSync('src/components/TouristPassportContent.tsx', file);
console.log('done');
