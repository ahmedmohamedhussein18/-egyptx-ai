const fs = require('fs');
let c = fs.readFileSync('src/context/LanguageContext.tsx', 'utf8');
if (!c.includes('use client')) {
  fs.writeFileSync('src/context/LanguageContext.tsx', "'use client';\n" + c);
}
