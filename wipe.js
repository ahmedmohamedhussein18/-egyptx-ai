const fs = require('fs');
let c = fs.readFileSync('src/components/PlannerContent.tsx', 'utf8');

const regex = /const LOADING_TEXTS = \[\s*"CONSULTING THE PHARAOHS\.\.\.",\s*"MAPPING ANCIENT ROUTES\.\.\.",\s*"ALIGNING THE STARS\.\.\.",\s*"TRANSLATING HIEROGLYPHS\.\.\.",\s*"SUMMONING THE WINDS OF THE NILE\.\.\."\s*\];/g;
const regex2 = /const LOADING_TEXTS = \[\s*"Consulting the Pharaohs\.\.\.",\s*"Mapping ancient routes\.\.\.",\s*"Aligning the stars\.\.\.",\s*"Translating hieroglyphs\.\.\.",\s*"Summoning the winds of the Nile\.\.\."\s*\];/g;
const regex3 = /const LOADING_TEXTS = \[\s*"Consulting the Pharaohs\.\.\.",\s*"Mapping ancient routes\.\.\."\s*\];/g;

c = c.replace(regex, '');
c = c.replace(regex2, '');
c = c.replace(regex3, '');

const singleDef = `const LOADING_TEXTS = [
  "CONSULTING THE PHARAOHS...",
  "MAPPING ANCIENT ROUTES...",
  "ALIGNING THE STARS...",
  "TRANSLATING HIEROGLYPHS...",
  "SUMMONING THE WINDS OF THE NILE..."
];`;

c = c.replace('function CinematicLoading() {', singleDef + '\nfunction CinematicLoading() {');

fs.writeFileSync('src/components/PlannerContent.tsx', c);
