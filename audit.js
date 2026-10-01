const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      file = path.join(dir, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(walk(file));
      } else {
        if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
      }
    });
  } catch(e) {}
  return results;
}

const targets = [
  'src/components/PlannerContent.tsx',
  'src/components/ExploreContent.tsx',
  'src/components/CraftsContent.tsx',
  'src/components/TouristPassportContent.tsx',
  'src/components/HiddenEgyptContent.tsx',
  'src/components/FourPillarsSection.tsx',
  'src/components/SmartTourismSection.tsx',
  'src/components/SmartMobilitySection.tsx',
  'src/components/EcosystemSection.tsx',
  'src/components/Footer.tsx',
  'src/components/Navbar.tsx',
];

// check each file for patterns that look like JSX hardcoded English text
// i.e. things inside JSX that are NOT already t() calls
targets.forEach(f => {
  try {
    const c = fs.readFileSync(f, 'utf8');
    // Extract all t() keys used
    const tKeys = [...c.matchAll(/t\(['"]([^'"]+)['"]\)/g)].map(m => m[1]);
    console.log('=== ' + path.basename(f) + ' (' + tKeys.length + ' t() calls) ===');
    // Show first 5 keys for context
    tKeys.slice(0,5).forEach(k => console.log('  t("' + k + '")'));
    if (tKeys.length > 5) console.log('  ...and ' + (tKeys.length - 5) + ' more');
  } catch(e) {
    console.log('MISSING: ' + f);
  }
});
