const fs = require('fs');
let c = fs.readFileSync('src/components/PlannerContent.tsx', 'utf8');
c = c.replace('function CinematicLoading() {', `const LOADING_TEXTS = [
  "CONSULTING THE PHARAOHS...",
  "MAPPING ANCIENT ROUTES...",
  "ALIGNING THE STARS...",
  "TRANSLATING HIEROGLYPHS...",
  "SUMMONING THE WINDS OF THE NILE..."
];

function CinematicLoading() {`);
fs.writeFileSync('src/components/PlannerContent.tsx', c);
console.log('Fixed text array');
