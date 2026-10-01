const fs = require('fs');

let c = fs.readFileSync('src/app/login/page.tsx', 'utf8');
if (!c.includes('import { useLanguage }')) {
  c = "import { useLanguage } from '@/context/LanguageContext';\n" + c;
}
fs.writeFileSync('src/app/login/page.tsx', c);
