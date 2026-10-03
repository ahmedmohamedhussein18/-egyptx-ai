const fs = require('fs');
let c = fs.readFileSync('src/components/PlannerContent.tsx', 'utf8');
const search = `const LOADING_TEXTS = [
  "Consulting the Pharaohs...",
  "Mapping ancient routes...",
  "Aligning the stars...",
  "Translating hieroglyphs...",
  "Summoning the winds of the Nile..."
];`;

c = c.replace(search, '');
fs.writeFileSync('src/components/PlannerContent.tsx', c);
console.log('done');
