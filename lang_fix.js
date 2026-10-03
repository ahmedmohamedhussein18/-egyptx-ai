const fs = require('fs');

let c = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

const oldLangsRegex = /const languages = \[\s*\{ code: 'en', label: 'English \(EN\)', flag: '[^']*' \},\s*\{ code: 'ar', label: '[^']*', flag: '[^']*' \},\s*\{ code: 'fr', label: '[^']*', flag: '[^']*' \},\s*\{ code: 'de', label: '[^']*', flag: '[^']*' \},\s*\{ code: 'it', label: '[^']*', flag: '[^']*' \},\s*\{ code: 'es', label: '[^']*', flag: '[^']*' \},\s*\{ code: 'zh', label: '[^']*', flag: '[^']*' \},\s*\{ code: 'ru', label: '[^']*', flag: '[^']*' \}\s*\];/;

const newLangs = `const languages = [
  { code: 'en', label: 'English (EN)', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية (AR)', flag: '🇪🇬' },
  { code: 'fr', label: 'Français (FR)', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch (DE)', flag: '🇩🇪' },
  { code: 'it', label: 'Italiano (IT)', flag: '🇮🇹' },
  { code: 'es', label: 'Español (ES)', flag: '🇪🇸' },
  { code: 'zh', label: '中文 (ZH)', flag: '🇨🇳' },
  { code: 'ru', label: 'Русский (RU)', flag: '🇷🇺' }
];`;

c = c.replace(oldLangsRegex, newLangs);
fs.writeFileSync('src/components/Navbar.tsx', c);
console.log('Language encoding fixed!');
